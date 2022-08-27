import { renderHook } from '@testing-library/react';
import {
  TUseChartSelectedSegment,
  useChartSelectedSegment,
} from 'hooks/useChartSelectedSegment';
import { TEST_PROPS } from 'tests/mocks/variables';
import { TDataItemRequired } from 'types/PieDonutChart.types.internal';


const USE_CHART_SELECTED_SEGMENT_TEST_PROPS: TUseChartSelectedSegment = {
  data: TEST_PROPS.data as TDataItemRequired[],
  focusedSegment: null,
  isSelectedValueShownInCenter: false,
  selected: null,
};

describe('hook "useChartSelectedSegment"', () => {
  it('returns [null] if the provided prop "isSelectedValueShownInCenter" is false', () => {
    expect.assertions(1);

    const { result } = renderHook(() => useChartSelectedSegment({
      ...USE_CHART_SELECTED_SEGMENT_TEST_PROPS,
      selected: TEST_PROPS.data[0].id as string,
    }));

    expect(result.current).toBeNull();
  });

  it('returns [null] if the provided props "focusedSegment" and "selected" are both null', () => {
    expect.assertions(1);

    const { result } = renderHook(() => useChartSelectedSegment({
      ...USE_CHART_SELECTED_SEGMENT_TEST_PROPS,
      isSelectedValueShownInCenter: true,
    }));

    expect(result.current).toBeNull();
  });

  it('returns [null] if the provided "data" contains no items', () => {
    expect.assertions(1);

    const { result } = renderHook(() => useChartSelectedSegment({
      ...USE_CHART_SELECTED_SEGMENT_TEST_PROPS,
      data: [],
      isSelectedValueShownInCenter: true,
      selected: TEST_PROPS.data[0].id as string,
    }));

    expect(result.current).toBeNull();
  });

  it('returns [null] if the provided "data" is invalid', () => {
    expect.assertions(2);

    const initialProps: TUseChartSelectedSegment = {
      ...USE_CHART_SELECTED_SEGMENT_TEST_PROPS,
      // @ts-ignore
      data: '1234',
      isSelectedValueShownInCenter: true,
      selected: TEST_PROPS.data[0].id as string,
    };

    const {
      rerender,
      result,
    } = renderHook(props => useChartSelectedSegment(props), { initialProps });

    expect(result.current).toBeNull();

    rerender({
      ...initialProps,
      // @ts-ignore
      data: undefined,
    });

    expect(result.current).toBeNull();
  });

  it('returns [null] if the provided "selected" item is not found in the provided "data"', () => {
    expect.assertions(1);

    const { result } = renderHook(() => useChartSelectedSegment({
      ...USE_CHART_SELECTED_SEGMENT_TEST_PROPS,
      isSelectedValueShownInCenter: true,
      selected: '1234',
    }));

    expect(result.current).toBeNull();
  });

  it('returns the selected item if the provided "selected" prop is valid', () => {
    expect.assertions(1);

    const selected = TEST_PROPS.data[0].id as string;

    const { result } = renderHook(() => useChartSelectedSegment({
      ...USE_CHART_SELECTED_SEGMENT_TEST_PROPS,
      isSelectedValueShownInCenter: true,
      selected,
    }));

    expect(result.current?.id).toBe(selected);
  });

  it('returns the focused item if the provided "focusedSegment" prop is valid', () => {
    expect.assertions(1);

    const focusedSegment = TEST_PROPS.data[0].id as string;

    const { result } = renderHook(() => useChartSelectedSegment({
      ...USE_CHART_SELECTED_SEGMENT_TEST_PROPS,
      focusedSegment,
      isSelectedValueShownInCenter: true,
    }));

    expect(result.current?.id).toBe(focusedSegment);
  });
});
