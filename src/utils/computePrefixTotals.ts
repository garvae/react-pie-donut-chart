/**
 * Computes prefix (running) totals for an array of items that each carry a
 * numeric "value" field.
 *
 * @param items - array of items with a numeric "value" property (each entry
 *   must have a finite positive "value"; caller is responsible for filtering
 *   invalid values before passing them here — see useChartDataRemap).
 * @returns an array of the same length where entry[i] is the sum of
 *   items[0..i-1].value (i.e. the running total BEFORE item[i] is added).
 *
 * @example
 * computePrefixTotals([{value:10},{value:20},{value:30}]) → [0, 10, 30]
 * computePrefixTotals([]) → []
 * computePrefixTotals([{value:5}]) → [0]
 *
 * @complexity O(n) time, O(n) space — a single pass over the input array.
 *
 * Replaces the previous per-segment O(n²) calculation in Chart.tsx:
 *   data.filter((_, index) => index < i).reduce((c, n) => c + n.value, 0)
 * which created a new sub-array and reduced it for every index i, leading to
 * O(1 + 2 + ... + n) = O(n²) total work.
 */
export function computePrefixTotals<T extends { value: number }>(items: T[]): number[] {
  let running = 0;

  return items.map((item) => {
    const prev = running;
    running += item.value;
    return prev;
  });
}
