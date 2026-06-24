import { computePrefixTotals } from 'utils/computePrefixTotals';

describe('function "computePrefixTotals"', () => {
  it('returns an empty array for empty input', () => {
    expect.assertions(1);

    expect(computePrefixTotals([])).toEqual([]);
  });

  it('returns [0] for a single-item input', () => {
    expect.assertions(1);

    expect(computePrefixTotals([{ value: 42 }])).toEqual([0]);
  });

  it('returns [0, 10, 30] for input values [10, 20, 30]', () => {
    expect.assertions(1);

    /**
     * This is the key regression assertion for the Stage 09 performance
     * refactor: verifies that the one-pass prefix-sum utility produces the
     * same "previousTotal" sequence as the old O(n²)
     * data.filter((_, i) => i < idx).reduce((s, x) => s + x.value, 0)
     * pattern in Chart.tsx.
     *
     * entry[0] = 0         (nothing before first item)
     * entry[1] = 10        (sum of items before index 1 = 10)
     * entry[2] = 10 + 20   (sum of items before index 2 = 30)
     */
    expect(computePrefixTotals([{ value: 10 }, { value: 20 }, { value: 30 }])).toEqual([0, 10, 30]);
  });

  it('returns correct prefix totals for a 5-element sequence', () => {
    expect.assertions(1);

    expect(computePrefixTotals([{ value: 5 }, { value: 15 }, { value: 10 }, { value: 20 }, { value: 50 }])).toEqual([
      0, 5, 20, 30, 50
    ]);
  });

  it('works with items that carry additional properties beyond "value"', () => {
    expect.assertions(1);

    const items = [
      { color: '#ff0000', id: 'a', order: 1, value: 10 },
      { color: '#00ff00', id: 'b', order: 2, value: 20 },
      { color: '#0000ff', id: 'c', order: 3, value: 30 }
    ];

    expect(computePrefixTotals(items)).toEqual([0, 10, 30]);
  });

  it('output length matches input length', () => {
    expect.assertions(1);

    const items = Array.from({ length: 100 }, (_, i) => ({ value: i + 1 }));

    expect(computePrefixTotals(items)).toHaveLength(100);
  });

  it('entry[i] equals the sum of all preceding values (mathematical invariant)', () => {
    expect.assertions(100);

    const items = Array.from({ length: 100 }, (_, i) => ({ value: (i + 1) * 3 }));
    const result = computePrefixTotals(items);

    for (let i = 0; i < items.length; i++) {
      const expectedPrev = items.slice(0, i).reduce((s, x) => s + x.value, 0);

      expect(result[i]).toBe(expectedPrev);
    }
  });
});
