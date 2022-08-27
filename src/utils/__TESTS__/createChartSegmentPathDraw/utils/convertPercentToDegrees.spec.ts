import { convertPercentToDegrees } from 'utils/createChartSegmentPathDraw/_utils/convertPercentToDegrees';

describe('function "convertPercentToDegrees"', () => {
  it('returns the valid angle in degrees', () => {
    expect.assertions(1);

    const angle = convertPercentToDegrees({ percent: 1 });
    expect(angle).toBe(3.6);
  });

  it('returns a valid fallback when invalid params are passed', () => {
    expect.assertions(1);

    // @ts-ignore
    const angle = convertPercentToDegrees({ percent: 'abc' });
    expect(angle).toBe(0);
  });
});
