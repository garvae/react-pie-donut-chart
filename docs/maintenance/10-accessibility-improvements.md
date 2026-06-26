# Stage 10 — Accessibility improvements

## Summary

- Added optional chart and segment accessible labels via `ariaLabel` and `getSegmentAriaLabel` props.
- Added `role="img"` and `aria-label` to the root `<svg>` element.
- Added `role="button"`, `aria-label`, and `aria-pressed` to interactive segment `<path>` elements.
- Added Space key activation alongside the existing Enter key, preventing default page-scroll behavior.
- Preserved all existing public API, callback signatures, and `tabIndex` behavior.
- Kept CI disabled.
- Kept publish disabled/no-op.

## New optional props

- `ariaLabel?: string` — Sets the `aria-label` on the root `<svg>`. Defaults to `"Pie donut chart"` when not provided.
- `getSegmentAriaLabel?: (segment: DataItem, index: number) => string` — Factory for per-segment accessible names. Defaults to `"Segment <id>: value <value>"` when not provided.

## SVG accessibility

- **Previous behavior:** `<svg>` had no `role` and no `aria-label`; assistive technology had no semantic information about the chart.
- **New behavior:** `<svg role="img" aria-label="Pie donut chart">` (or the caller-supplied label). The constant `DEFAULT_CHART_ARIA_LABEL = 'Pie donut chart'` is exported from `PieDonutChart.tsx` for use in tests and consumers.
- **Tests:** `src/__TESTS__/accessibility/PieDonutChart.accessibility.spec.tsx` — default label, custom label, SSR (via existing `src/__TESTS__/ssr/render.spec.tsx`).

## Segment accessibility

- **Interactive segment role:** `role="button"` on non-gap `<path>` elements.
- **Accessible label:** `aria-label` populated by `getSegmentAriaLabel(segment, index)` or the built-in default `"Segment <id>: value <value>"`. Gap segments receive no `aria-label` and no `role`.
- **Selected state:** `aria-pressed={isSelected}` on non-gap segments (matches WAI-ARIA pattern for toggle buttons).
- **Non-interactive behavior:** Gap segments (`isGapSegment === true`) receive `role={undefined}`, `aria-label={undefined}`, and `aria-pressed={undefined}`, preserving the existing `tabIndex={-1}` behavior.
- **Tests:** segment role, default/custom labels, `aria-pressed` state, non-interactive paths not exposed as buttons.

## Keyboard behavior

- **Enter:** Unchanged — triggers selection and calls `onSegmentKeyEnterDown` (via `isKeyDownEnter`).
- **Space:** New — also triggers selection and calls `onSegmentKeyEnterDown`; `e.preventDefault()` is called to suppress default page-scroll. Implementation uses the new `isKeyDownSpace` utility (`src/utils/isKeyDownSpace.ts`).
- **Existing callback compatibility:** `onSegmentKeyEnterDown` is called for both Enter and Space (consistent with WAI-ARIA button activation pattern where both keys are equivalent activators).

## New files

- `src/utils/isKeyDownSpace.ts` — utility mirroring `isKeyDownEnter`, detects `e.code === 'Space'`, `e.key === ' '`, or `e.key === 'space'`.
- `src/utils/__TESTS__/isKeyDownSpace.spec.ts` — 6 unit tests.
- `src/__TESTS__/accessibility/PieDonutChart.accessibility.spec.tsx` — 10 integration tests covering SVG role/label, segment role/label/state, and keyboard activation.

## Compatibility

- Breaking changes: **no**
- New runtime dependencies: **no**
- TypeScript consumer verified by `pack:smoke`: **yes**

## Local checks

- `pnpm install`: ✅
- `pnpm run check`: ✅ (0 errors, 37 pre-existing warnings in `scripts/`)
- `pnpm run lint`: ✅
- `pnpm run format:check`: ✅
- `pnpm run type-check`: ✅
- `pnpm run type-check:test`: ✅
- `pnpm run build`: ✅
- `pnpm run test`: ✅ 60 suites / 197 tests
- `pnpm run test:cover`: ✅
- `pnpm run pack:smoke`: ✅ All package smoke tests passed
- `pnpm run size`: ✅ 10.08–10.19 kB (limit 15 kB)
- `pnpm run check:all`: ✅
- `pnpm audit`: ✅ No known vulnerabilities

## Known issues left for later PRs

- README/demo refresh remains for a later PR.
- CI remains disabled.
- Publish workflow remains no-op.
