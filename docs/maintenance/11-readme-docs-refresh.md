# Stage 11 — README and docs refresh

## Summary

- Refreshed README to match the maintained package state.
- Added current install, usage, TypeScript, SSR, accessibility, and local quality gate documentation.
- Added examples for common chart usage patterns.
- Removed stale and overconfident claims.
- Fixed inaccurate `DataItem` field name (`segmentId` → `id`).
- Fixed inaccurate donut example (was using `gap` only; correct prop is `donutThickness`).
- Fixed broken contributing guide URL (`wwwhub.com` → `github.com`).
- Added `pnpm add` to the install section alongside `npm` and `yarn`.
- Kept CI disabled.
- Kept publish disabled / no-op.

---

## README changes

| Section | Change |
| :--- | :--- |
| **Status** | Added honest maintenance status block. Notes CI and publish are disabled. |
| **Install** | Added `pnpm add` command. Kept `npm` and `yarn`. |
| **Quick start** | Minimal working example with typed `DataItem[]`. |
| **Examples** | Added: donut, gaps, custom children, responsive, controlled selected, accessible. |
| **Accessibility** | New section: `ariaLabel`, `getSegmentAriaLabel`, `aria-pressed`, keyboard (Enter + Space). |
| **TypeScript** | New section: typed usage, `DataItem`, `PieDonutChartProps` import. |
| **SSR** | New section: describes SSR-safe render behavior and `useIsomorphicLayoutEffect`. |
| **Props — DataItem** | Fixed `segmentId` → `id`. Documented `order: 0` is valid. |
| **Props — Component** | Added `ariaLabel` and `getSegmentAriaLabel`. Updated `onSegmentKeyEnterDown` description to include Space key (added in Stage 10). |
| **Development** | New section: full list of pnpm commands. |
| **Quality gates** | New section: honest description of what the local gate covers. |
| **Release / publishing** | New section: notes publish automation is disabled during maintenance. |

---

## Examples verified

| Example | Notes |
| :--- | :--- |
| **Basic pie** | `data` + `size` — minimal working example |
| **Donut** | Uses `donutThickness` (was incorrectly `gap`-only in previous docs) |
| **Gaps** | `gap` prop for segment spacing |
| **Center content** | `children` prop + `<foreignObject>` |
| **Responsive** | `useRef` + `parentRef` |
| **Controlled selected** | `selected` state + `onSegmentClick` callback |
| **Accessibility** | `ariaLabel` + `getSegmentAriaLabel` |

All examples are consistent with types in `src/types/index.d.ts` as of this stage.

---

## Stale content removed / corrected

| Item | Reason |
| :--- | :--- |
| `"Demo page coming soon"` | Stale since original publish; removed |
| `DataItem.segmentId` field in props table | Wrong field name — correct name is `id` (matches `src/types/index.d.ts`) |
| Donut example using only `gap={10}` | `gap` adds spacing between segments, not a donut ring; correct prop is `donutThickness` |
| `yarn add` as sole alternative install method | Added `pnpm add`; kept yarn for completeness |
| `onSegmentKeyEnterDown` described as "Enter key only" | After Stage 10, Space key also triggers this callback |
| Broken contributing URL (`wwwhub.com/...`) | Fixed to `github.com/...` |
| No mention of CI/publish status | Added honest note that both are currently disabled |

---

## Compatibility

| Attribute | Value |
| :--- | :--- |
| Public API changed | No |
| Runtime code changed | No |
| New dependencies | No |
| `dist/` committed | No |

---

## Local checks

| Command | Result |
| :--- | :--- |
| `pnpm install` | ✅ |
| `pnpm run check` | ✅ |
| `pnpm run lint` | ✅ |
| `pnpm run format:check` | ✅ |
| `pnpm run type-check` | ✅ |
| `pnpm run type-check:test` | ✅ |
| `pnpm run build` | ✅ |
| `pnpm run test` | ✅ 60 suites / 197 tests |
| `pnpm run test:cover` | ✅ |
| `pnpm run pack:smoke` | ✅ |
| `pnpm run size` | ✅ |
| `pnpm run check:all` | ✅ |
| `pnpm audit` | ✅ |

---

## Known issues left for later PRs

- CI remains disabled.
- Publish workflow remains no-op.
- Release checklist remains for a later stage.
- Optional demo/Storybook site may be added in a future stage.
