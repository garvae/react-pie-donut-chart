# Stage 09 — Performance: O(n²) → O(n) prefix-sum refactor in Chart

## Summary

- Replaced the O(n²) per-segment `filter + reduce` in `Chart.tsx` with a
  single-pass O(n) prefix-sum via a new `computePrefixTotals` utility.
- Added 4 regression tests **before** the refactor (all green before and after)
  and 7 unit tests for the new utility.
- Test count: 57/170 → 58/181 (+1 suite, +11 tests).
- `pnpm run check:all` passes end-to-end.
- No change to component behavior or public API.
- Kept CI and publish disabled.

---

## The bug

`src/components/Chart.tsx` computed each segment's "previous total" (the sum
of all preceding segment values, used to calculate the arc start angle) inside
a `data.map()` callback:

```ts
// before (O(n²)):
if (i > 0) {
  prevTotal = data?.filter((_, index) => index < i)
                   ?.reduce((c, n) => c + n.value, 0) || 0;
}
```

For segment at index `i`, this:
1. Creates a new sub-array of `i` elements via `filter`
2. Reduces it to a single sum via `reduce`

Doing this for every index `i` in a dataset of `n` segments gives:
- `i = 0`: 0 work
- `i = 1`: 1 element
- `i = 2`: 2 elements
- ...
- `i = n-1`: n-1 elements

Total: O(1 + 2 + ... + (n-1)) = O(n² / 2) = **O(n²)** time, and O(n) extra
allocations (one sub-array per segment).

For small `n` (≤ 20, which is the typical chart use case) this is fine in
absolute terms. But it means the chart renders in quadratic time, so
pathological inputs — or a future dashboard with many chart instances — can
cause performance cliffs. The fix makes it unconditionally O(n) at no cost in
either complexity of the code or behavior.

---

## The fix

### New utility: `src/utils/computePrefixTotals.ts`

```ts
export function computePrefixTotals<T extends { value: number }>(items: T[]): number[] {
  let running = 0;
  return items.map((item) => {
    const prev = running;
    running += item.value;
    return prev;
  });
}
```

A single left-to-right pass over the array: one counter, one array allocation
(same length as input). O(n) time, O(n) space.

`computePrefixTotals([{value:10}, {value:20}, {value:30}])` → `[0, 10, 30]`

`result[i]` is exactly the sum of `items[0..i-1].value` — identical to what
the old `data.filter((_, idx) => idx < i).reduce(...)` pattern computed for
every `i`. No change in the values produced, only in how they are computed.

### Usage in `Chart.tsx`

```ts
// before the early-return (Rules of Hooks: hooks must be called unconditionally)
const prefixTotals = useMemo(() => computePrefixTotals(data), [data]);

if (!data.length) { return null; }

// inside data.map():
let prevTotal = prefixTotals[i] || 0;  // was: filter+reduce O(n) per-segment
```

`useMemo` ensures the single-pass prefix computation only re-runs when the
`data` array reference changes — not on every unrelated re-render.

`useMemo` is placed BEFORE the `if (!data.length) { return null }` early
return so that hooks are always called in the same order on every render
(React Rules of Hooks). When `data` is empty, `computePrefixTotals([])` simply
returns `[]` immediately (zero cost), and the early return follows.

---

## Regression tests added (before the refactor, all green before and after)

`src/components/__TESTS__/Chart.spec.tsx`:

1. **Segment count** — 5-item data with `gap=0` → exactly 5 path segments
   rendered (count must be the same regardless of how prevTotal is computed)
2. **Sort order** — `order:0` item + `order:1` item → 2 segments, no NaN in
   paths (validates that the Stage 08 `order:??` fix and the prefix-sum
   computation both respect the pre-sorted order)
3. **No NaN in paths** — 3-item data `[10, 20, 30]` → zero `NaN` tokens in
   any path `d` attribute (confirms prevTotal values are numerically valid)
4. **Large data fixture** — 100 segments → no throw, exactly 100 path
   segments, zero `NaN` in paths (exercises the O(n) path through the full
   prefix-sum range)

---

## Unit tests for the new utility

`src/utils/__TESTS__/computePrefixTotals.spec.ts` (new file):

1. Empty input → `[]`
2. Single item → `[0]`
3. `[10, 20, 30]` → `[0, 10, 30]` (key regression assertion for the refactor)
4. 5-element sequence → correct prefix totals
5. Works with items carrying additional properties beyond `value`
6. Output length matches input length
7. Mathematical invariant: `result[i] === items.slice(0, i).reduce(sum)` for
   all `i` in a 100-element array (verified for every index)

---

## Complexity summary

| Code path | Before | After |
|---|---|---|
| Compute all segment prevTotals for `n` segments | O(n²) time, O(n) intermediate allocations | O(n) time, O(n) space (one array) |
| Per re-render (data unchanged) | O(n²) unconditionally | O(1) (useMemo cache hit) |

---

## Local checks

- `pnpm run check`: ✅ 0 errors
- `pnpm run lint`: ✅ 0 errors
- `pnpm run format:check`: ✅ 0 errors
- `pnpm run type-check`: ✅ 0 errors
- `pnpm run type-check:test`: ✅ 0 errors
- `pnpm run build`: ✅ 0 errors
- `pnpm run test`: ✅ **58/58 suites, 181/181 tests** (was 57/170)
- `pnpm run test:cover`: ✅ 58/58 suites, 181/181 tests
- `pnpm run pack:smoke`: ✅ CJS/ESM/TypeScript consumers verified
- `pnpm run size`: ✅ within limits
- `pnpm run check:all`: ✅ exit 0
- `pnpm audit`: ✅ 0 vulnerabilities

---

## What was NOT done

- ResizeObserver-based replacement: not in scope (separate concern, no failing test).
- `useChartDataRemap`'s `useMemo` dependency array: already has `[dataProp]` — correct.
- `debounce` wrapper in `useHandleResize`: already memoized via `useCallback` — no redundant work.
- No changes to public props, exported types, or public API.
- No `dist/` committed. CI and publish remain disabled.
