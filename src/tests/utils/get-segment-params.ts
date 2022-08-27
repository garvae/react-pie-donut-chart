import {
  TEST_DATA_ATTR_CHART_GROUP_SEGMENT_ID,
  SEGMENT_OFFSET_CORRECTION_ANGLE,
} from 'components/Chart';
import { TEST_CHART_PROPS_COMMON } from 'tests/mocks/variables';
import { convertPercentToDegrees } from 'utils/createChartSegmentPathDraw/_utils/convertPercentToDegrees';

type TGetSegmentParamsCommon = {
  segment: HTMLElement;
};

type TGetSegmentParamsFirst = TGetSegmentParamsCommon & {
  isFirst: true;
  prevTotalPercentage?: never;
};

type TGetSegmentParamsNotFirst = TGetSegmentParamsCommon & {
  isFirst: false;
  prevTotalPercentage: number;
};

type TGetSegmentParams = TGetSegmentParamsFirst | TGetSegmentParamsNotFirst;

type TGetSegmentParamsReturn = {
  segmentId?: string;
  segmentOffset: number;
  segmentValue: number;
  totalDataValue: number;
};

/**
 * Calculates segment params.
 * @function { (props: TGetSegmentParams) => TGetSegmentParamsReturn } getSegmentParams
 * @param { TGetSegmentParams } props
 */
export const getSegmentParams = (props: TGetSegmentParams): TGetSegmentParamsReturn => {

  const {
    isFirst,
    prevTotalPercentage,
    segment,
  } = props;

  const segmentInData = TEST_CHART_PROPS_COMMON.data.find(item => item.id === segment.getAttribute(TEST_DATA_ATTR_CHART_GROUP_SEGMENT_ID));
  const totalDataValue = TEST_CHART_PROPS_COMMON.data?.reduce((current, next) => current + next.value, 0);

  if (!segmentInData) {
    throw new Error('Segment not found');
  }

  const segmentPercentage = segmentInData.value / totalDataValue * 100;

  let segmentOffset = convertPercentToDegrees({ percent: segmentPercentage }) - SEGMENT_OFFSET_CORRECTION_ANGLE;

  if (!isFirst) {
    segmentOffset = segmentOffset + convertPercentToDegrees({ percent: prevTotalPercentage || 0 });
  }

  return {
    segmentId: segmentInData.id,
    segmentOffset,
    segmentValue: segmentInData.value,
    totalDataValue,
  };
};
