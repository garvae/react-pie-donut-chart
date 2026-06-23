# Stage 08 — Data geometry bug fixes

## Summary

- Fixed 5 confirmed bugs in data validation and geometry calculation code.
- All fixes are covered by new tests (10 new tests in 5 files), written before
  the fixes were applied (red → green, in order).
- Test count: 57/160 → 57/170 (+10).
- `pnpm run check:all` passes end-to-end.
- No public API changes.
- No changes to CSS, SVG output structure (only values corrected).
- Kept CI and publish disabled.

---

## Bugs fixed

### Bug 1: `ChanelRand` could return 256, producing wrong random colours

**File:** `src/utils/color.ts`

**Before:**
```ts
const ChanelRand = (): number => Math.floor(Math.random() * (256 + 1));
```

**After:**
```ts
const ChanelRand = (): number => Math.floor(Math.random() * 256);
```

**Why it's a bug:** `Math.random()` returns values in `[0, 1)` — the upper
bound is exclusive. `Math.floor(Math.random() * 257)` can evaluate to 256 when
`Math.random()` returns a value like `0.999999` (`Math.floor(0.999999 × 257) =
Math.floor(256.999…) = 256`). An RGB channel value of 256 is outside the valid
`[0, 255]` range. When it is passed to `rgbToHex`'s bitwise operation
`(1 << 24) + (256 << 16) + (256 << 8) + 256`, each overflowing channel
contributes an extra carry bit that corrupts the other channels, producing a
wrong colour hex string (e.g. `#010100` instead of `#ffffff`). The string still
passes the hex regex (correct length), so this was silent and hard to detect.

**Fix:** Using multiplier `256` ensures `Math.floor(x * 256)` ≤ 255 for all
`x ∈ [0, 1)`.

**Test:** `color.spec.ts` — mocks `Math.random` to return `0.999999` and
asserts that the result equals `'#ffffff'`. With the old formula the result was
`'#010100'` (wrong colour due to bitwise channel overflow).

---

### Bug 2: `sanitizeNumber` silently passed `Infinity` and `-Infinity`

**File:** `src/utils/sanitizeNumber.ts`

**Before:**
```ts
if (isNaN(n)) { ... return defaultNumber; }
return n;
```

**After:**
```ts
if (isNaN(n) || !isFinite(n)) { ... return defaultNumber; }
return n;
```

**Why it's a bug:** `isNaN(Infinity)` is `false`, so `sanitizeNumber(Infinity)`
returned `Infinity`. `sanitizeNumber` is the entry-point validator for numeric
props like `donutThickness`, `gap`, `fontSize`, `hoverScaleRatio`, etc. Any
`Infinity` that reached the geometry pipeline would produce `NaN` coordinates
in SVG path commands (`Infinity * cos(…) = NaN`), resulting in invisible or
broken chart segments.

**Tests:** `sanitizeNumber.spec.ts` — two new tests:
- `Infinity` → returns the provided `defaultNumber`, `consoleError` called once
- `-Infinity` → returns `DEFAULT_SANITISE_NUMBER_VALUE`, `consoleError` called once

---

### Bug 3: `checkIncomingValues` did not reject `Infinity` in segment values

**File:** `src/utils/createChartSegmentPathDraw/_utils/checkIncomingValues.ts`

**Before:** `isNaN(valueSegment) || isNaN(valueSegmentsTotal) || ...`

**After:** Added `!isFinite(valueSegment) || !isFinite(valueSegmentsPreviousTotal) || !isFinite(valueSegmentsTotal) || ...`

**Why it's a bug:** `isNaN(Infinity)` is `false`, so `Infinity` values passed
the existing guard and were forwarded to the trigonometry in
`createSvgCommandsString`. A segment angle computed as `360 * (Infinity /
(total || 1))` gives `Infinity`, which then produces `NaN` from
`Math.cos(Infinity * π / 180)` — generating `NaN NaN` tokens in the SVG path
`d` attribute.

**Tests:** `checkIncomingValues.spec.ts` — two new tests:
- `valueSegment: Infinity` → returns `false`, `consoleError` called once
- `valueSegmentsTotal: Infinity` → returns `false`, `consoleError` called once

---

### Bug 4: Single-segment chart (100% = 360°) produced invisible / broken arc

**File:** `src/utils/createChartSegmentPathDraw/_utils/createSvgCommandsString.ts`

**Before:**
```ts
const { angleDegrees, ... } = props;
```

**After:**
```ts
const angleDegrees = Math.min(props.angleDegrees, 359.9999);
```

**Why it's a bug:** SVG arc commands are mathematically undefined when the
arc's start and end points are the same point, which occurs when the sweep
angle is exactly 360°. The SVG specification states that in this case the arc
must not be drawn at all. A chart with a single non-zero-value segment, or
with all other segments having zero/filtered-out values, passes
`valueSegment / valueSegmentsTotal = 1 → angleDegrees = 360` to
`createSvgCommandsString`. The resulting arc commands produce either an
invisible segment or, in some renderers, a single dot.

**Fix:** Clamp `angleDegrees` to a maximum of `359.9999` — the arc closes to
within 0.0001° of a full circle, visually indistinguishable, but the start and
end points are never identical so the arc renders correctly in all SVG engines.

**Test:** `createChartSegmentPathDraw.spec.ts` — new test with
`valueSegment: 1, valueSegmentsTotal: 1, valueSegmentsPreviousTotal: 0`
asserts the returned path is non-empty and contains no `'NaN'` tokens.

---

### Bug 5: `order: 0` was silently discarded and replaced with a fallback

**File:** `src/hooks/useChartDataRemap.ts`

**Before:**
```ts
order = item.order || dataValid.length + 1 + i;
```

**After:**
```ts
order = item.order ?? dataValid.length + 1 + i;
```

**Why it's a bug:** JavaScript's `||` (logical OR) evaluates the right-hand
side whenever the left-hand side is **falsy**. `0` is falsy. So any data item
with `order: 0` had its explicit order silently replaced with
`dataValid.length + 1 + i` — a large positive number — causing it to sort last
instead of first. Consumers who intentionally provided `order: 0` (the lowest
priority value) got wrong sort order without any error or warning.

**Fix:** Nullish coalescing `??` only falls back when the value is `null` or
`undefined`, leaving `0` (and any other defined numeric value) intact.

**Test:** `useChartDataRemap.spec.tsx` — new test provides two items with
`order: 0` and `order: 1` respectively; asserts that the item with `order: 0`
is first in the result.

---

### Additional: negative and `Infinity` data values not filtered

**File:** `src/hooks/useChartDataRemap.ts`

**Before:**
```ts
const dataValid = dataProp.filter((segment) => !!segment.value);
```

**After:** Extended to also warn and exclude segments where `value < 0` or
`!isFinite(value)`.

**Why it's needed:** The existing `!!segment.value` filter correctly excluded
`value: 0` (intentional — zero-area arcs cannot be drawn). However, `!!-1` is
`true` and `!!Infinity` is `true`, so negative and infinite segment values
passed through silently. A negative value in `valueSegmentsTotal` would
ultimately cause incorrect angle calculations for all other segments. An
`Infinity` value was partly addressed by Bug 3 above (the geometry guard), but
it's better to reject invalid data at the input boundary with a clear warning,
before the data enters the render pipeline at all.

**Tests:** `useChartDataRemap.spec.tsx` — three new tests:
- Item with `value: -10` → filtered out (1 item removed), `consoleWarn` called
- Item with `value: Infinity` → filtered out (1 item removed), `consoleWarn` called
- All items invalid (`value: -5` and `value: 0`) → result is empty array

---

## New test count

| File | Tests added |
|---|---|
| `src/utils/__TESTS__/color.spec.ts` | +1 |
| `src/utils/__TESTS__/sanitizeNumber.spec.ts` | +2 |
| `src/utils/__TESTS__/createChartSegmentPathDraw/utils/checkIncomingValues.spec.ts` | +2 |
| `src/utils/__TESTS__/createChartSegmentPathDraw/utils/createChartSegmentPathDraw.spec.ts` | +1 |
| `src/hooks/__TESTS__/useChartDataRemap.spec.tsx` | +4 |
| **Total** | **+10** |

Test suites: 57/57 (unchanged).
Tests: 160 → **170** (+10).

---

## Local checks

- `pnpm run check` ✅ 0 errors
- `pnpm run lint` ✅ 0 errors
- `pnpm run format:check` ✅ 0 errors
- `pnpm run type-check` ✅ 0 errors
- `pnpm run type-check:test` ✅ 0 errors
- `pnpm run build` ✅ 0 errors
- `pnpm run test` ✅ 57/57 suites, 170/170 tests
- `pnpm run test:cover` ✅ 57/57 suites, 170/170 tests
- `pnpm run pack:smoke` ✅ CJS/ESM/TypeScript consumers verified
- `pnpm run size` ✅ within limits
- `pnpm run check:all` ✅ exit 0
- `pnpm audit` ✅ 0 vulnerabilities

---

## What was NOT done

- No changes to public API, exported types, or component props.
- No visual or structural changes to SVG output (only coordinates corrected).
- No `dist/` committed.
- CI remains disabled (Stage 01).
- Publish remains no-op (Stage 01).
- The `convertPercentToDegrees.spec.ts` coverage was reviewed and left as-is —
  no additional gaps found in that utility's test coverage.
- `getPointCoords` was reviewed and found correct — no changes needed.
