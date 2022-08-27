import { mockConsole } from 'tests/mocks/console';
import { TEST_PROPS } from 'tests/mocks/variables';
import {
  TPieDonutChartCommonPropsClassNames,
  TPieDonutChartCommonPropsColors,
  TPieDonutChartPropsInternal,
} from 'types/PieDonutChart.types.internal';
import { checkPropsErrors } from 'utils/checkPropsErrors';

const {
  classNames: classNamesProp,
  colors: colorsProp,
  ...restProps
} = TEST_PROPS;

const classNames: TPieDonutChartCommonPropsClassNames = {
  classNameChartBackground: classNamesProp.chartBackground,
  classNameChartCenter: classNamesProp.chartCenter,
  classNameChartSegment: classNamesProp.chartSegment,
  classNameChartSegmentsBackground: classNamesProp.chartSegmentsBackground,
  classNameChildren: classNamesProp.children,
  classNameSvgGroupSegments: classNamesProp.svgGroupSegments,
  classNameSvgGroupSegmentsBackground: classNamesProp.svgGroupSegmentsBackground,
  classNameSvgGroupText: classNamesProp.svgGroupText,
  classNameSvgObjectText: classNamesProp.svgObjectText,
  classNameText: classNamesProp.text,
};

const colors: TPieDonutChartCommonPropsColors = {
  colorChartBackground: colorsProp.chartBackground,
  colorChartCenter: colorsProp.chartCenter,
  colorSegmentFocusedOutline: colorsProp.segmentFocusedOutline,
  colorSegmentsBackground: colorsProp.segmentsBackground,
  colorText: colorsProp.text,
};

const CHECK_PROPS_ERRORS_TEST_PROPS = {
  ...classNames,
  ...colors,
  ...restProps,
} as unknown as TPieDonutChartPropsInternal;


describe('function "checkPropsErrors"', () => {
  it('checks valid props and shows no console errors', () => {
    expect.assertions(1);

    const { consoleErrorMocked }  = mockConsole();

    // @ts-ignore
    checkPropsErrors(CHECK_PROPS_ERRORS_TEST_PROPS);

    expect(consoleErrorMocked).not.toHaveBeenCalled();
  });


  it('checks invalid props and shows console errors', () => {
    expect.assertions(1);

    const { consoleErrorMocked }  = mockConsole();

    checkPropsErrors({
      ...CHECK_PROPS_ERRORS_TEST_PROPS,
      // @ts-ignore
      animationSpeed: 'invalid',
      // @ts-ignore
      colorChartBackground: 1234,
      // @ts-ignore
      data: 'invalid',
      // @ts-ignore
      isScaleOnHover: 'invalid',
      // @ts-ignore
      onSegmentClick: 'invalid',
      // @ts-ignore
      stylesHoveredSegment: 'invalid',
    });

    expect(consoleErrorMocked).toHaveBeenCalledTimes(6);
  });

  describe('checks"parentRef" prop', () => {

    it('is not of type "object"', () => {
      expect.assertions(1);

      const { consoleErrorMocked }  = mockConsole();

      checkPropsErrors({
        ...CHECK_PROPS_ERRORS_TEST_PROPS,
        // @ts-ignore
        parentRef: 1234,
      });

      expect(consoleErrorMocked).toHaveBeenCalledTimes(1);
    });

    it('doesn\'t have "current" key', () => {
      expect.assertions(1);

      const { consoleErrorMocked }  = mockConsole();
      const invalidParentRef = { invalid: {} };

      checkPropsErrors({
        ...CHECK_PROPS_ERRORS_TEST_PROPS,
        // @ts-ignore
        parentRef: invalidParentRef,
      });

      expect(consoleErrorMocked).toHaveBeenCalledTimes(1);
    });

    it('"current" is not of type "object"', () => {
      expect.assertions(1);

      const { consoleErrorMocked }  = mockConsole();

      checkPropsErrors({
        ...CHECK_PROPS_ERRORS_TEST_PROPS,
        // @ts-ignore
        parentRef: { current: 1234 },
      });

      expect(consoleErrorMocked).toHaveBeenCalledTimes(1);
    });

    it('"current" doesn\'t have "offsetHeight" key', () => {
      expect.assertions(1);

      const { consoleErrorMocked }  = mockConsole();
      const invalidParentRef = { invalid: { offsetWidth: 1 } };

      checkPropsErrors({
        ...CHECK_PROPS_ERRORS_TEST_PROPS,
        // @ts-ignore
        parentRef: invalidParentRef,
      });

      expect(consoleErrorMocked).toHaveBeenCalledTimes(1);
    });

    it('"current" has invalid "offsetHeight" key', () => {
      expect.assertions(1);

      const { consoleErrorMocked }  = mockConsole();
      const invalidParentRef = { current: {
        offsetHeight: '*',
        offsetWidth: 1,
      } };

      checkPropsErrors({
        ...CHECK_PROPS_ERRORS_TEST_PROPS,
        // @ts-ignore
        parentRef: invalidParentRef,
      });

      expect(consoleErrorMocked).toHaveBeenCalledTimes(1);
    });

    it('"current" has no "offsetWidth" key', () => {
      expect.assertions(1);

      const { consoleErrorMocked }  = mockConsole();
      const invalidParentRef = { invalid: { offsetHeight: 1 } };

      checkPropsErrors({
        ...CHECK_PROPS_ERRORS_TEST_PROPS,
        // @ts-ignore
        parentRef: invalidParentRef,
      });

      expect(consoleErrorMocked).toHaveBeenCalledTimes(1);
    });

    it('"current" has invalid "offsetWidth" key', () => {
      expect.assertions(1);

      const { consoleErrorMocked }  = mockConsole();
      const invalidParentRef = { current: {
        offsetHeight: 1,
        offsetWidth: '*',
      } };

      checkPropsErrors({
        ...CHECK_PROPS_ERRORS_TEST_PROPS,
        // @ts-ignore
        parentRef: invalidParentRef,
      });

      expect(consoleErrorMocked).toHaveBeenCalledTimes(1);
    });
  });

  it('checks invalid "data" prop elements and shows console errors', () => {
    expect.assertions(1);

    const { consoleErrorMocked }  = mockConsole();

    // @ts-ignore
    checkPropsErrors({
      ...CHECK_PROPS_ERRORS_TEST_PROPS,
      data: [ {
      // @ts-ignore
        color: 1234,
        // @ts-ignore
        id: 1234,
        // @ts-ignore
        order: '1',
        // @ts-ignore
        value: '50',
      }, {
      // @ts-ignore
        color: 2234,
        // @ts-ignore
        id: 2234,
        // @ts-ignore
        order: '2',
      } ],
    });

    expect(consoleErrorMocked).toHaveBeenCalledTimes(8);
  });

  it('checks the invalid "donutThickness" prop and shows console errors', () => {
    expect.assertions(1);

    const { consoleErrorMocked }  = mockConsole();

    // @ts-ignore
    checkPropsErrors({
      ...CHECK_PROPS_ERRORS_TEST_PROPS,
      donutThickness: CHECK_PROPS_ERRORS_TEST_PROPS.size,
    });

    expect(consoleErrorMocked).toHaveBeenCalledTimes(1);
  });

  it('checks the invalid "children" prop and shows console errors', () => {
    expect.assertions(1);

    const { consoleErrorMocked }  = mockConsole();

    checkPropsErrors({
      ...CHECK_PROPS_ERRORS_TEST_PROPS,
      // @ts-ignore
      children: {},
    });

    expect(consoleErrorMocked).toHaveBeenCalledTimes(1);
  });
});
