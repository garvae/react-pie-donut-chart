import { isValidElement } from 'react';

import { TPieDonutChartPropsInternal } from 'types/PieDonutChart.types.internal';
import { consoleError } from 'utils/console';
import { isProduction } from 'utils/env';
import { lowerCaseFirstLetter } from 'utils/string';

export const INVALID_DATA_DEFAULT_ERROR = 'Must be type of Array<TDataItem>';

enum ETypeofType {
  BOOLEAN = 'boolean',
  FUNCTION = 'function',
  NUMBER = 'number',
  OBJECT = 'object',
  STRING = 'string',
}

type TCheckPropsErrorsItem = {
  condition?: boolean,
  err?: string;
  isUndefinedPossible?: boolean,
  name: string;
  type?: ETypeofType,
  value?: unknown
};

/**
 * Checks the validness of incoming params and shows to user console.error (and tips)
 * @function checkPropsErrors
 * @param { TPieDonutChartPropsInternal } props
 */
export const checkPropsErrors = (props: TPieDonutChartPropsInternal) => {

  const {
    animationSpeed,
    chartCenterSize,
    children,
    className,
    classNameChartBackground,
    classNameChartCenter,
    classNameChartSegment,
    classNameChartSegmentsBackground,
    classNameChildren,
    classNameSvgGroupSegments,
    classNameSvgGroupSegmentsBackground,
    classNameSvgGroupText,
    classNameSvgObjectText,
    classNameText,
    colorChartBackground,
    colorChartCenter,
    colorSegmentFocusedOutline,
    colorSegmentsBackground,
    colorText,
    data,
    donutThickness,
    fontSize,
    gap,
    hoverScaleRatio,
    isScaleOnHover,
    isSelectOnClick,
    isSelectOnKeyEnterDown,
    isSelectedValueShownInCenter,
    maxSize,
    minSize,
    onSegmentClick,
    onSegmentKeyEnterDown,
    parentRef,
    resizeReRenderDebounceTime,
    selected,
    size,
    stylesHoveredSegment,
    tabIndex,
    text,
    widthSegmentFocusedOutline,
  } = props;

  const numberUndefinedParams = {
    animationSpeed,
    chartCenterSize,
    donutThickness,
    fontSize,
    gap,
    hoverScaleRatio,
    maxSize,
    minSize,
    resizeReRenderDebounceTime,
    size,
    tabIndex,
    widthSegmentFocusedOutline,
  };

  const booleanUndefinedParams = {
    isScaleOnHover,
    isSelectOnClick,
    isSelectOnKeyEnterDown,
    isSelectedValueShownInCenter,
  };

  const stringUndefinedParams = {
    className,
    classNameChartBackground,
    classNameChartCenter,
    classNameChartSegment,
    classNameChartSegmentsBackground,
    classNameChildren,
    classNameSvgGroupSegments,
    classNameSvgGroupSegmentsBackground,
    classNameSvgGroupText,
    classNameSvgObjectText,
    classNameText,
    colorChartBackground,
    colorChartCenter,
    colorSegmentFocusedOutline,
    colorSegmentsBackground,
    colorText,
    selected,
    text,
  };

  const functionUndefinedParams = {
    onSegmentClick,
    onSegmentKeyEnterDown,
  };

  const objectUndefinedParams = { stylesHoveredSegment };

  const properties: TCheckPropsErrorsItem[] = [
    ...Object.entries(numberUndefinedParams).map(([ key, value ]) => ({
      isUndefinedPossible: true,
      name: key,
      type: ETypeofType.NUMBER,
      value,
    })),

    ...Object.entries(booleanUndefinedParams).map(([ key, value ]) => ({
      isUndefinedPossible: true,
      name: key,
      type: ETypeofType.BOOLEAN,
      value,
    })),

    ...Object.entries(stringUndefinedParams).map(([ key, value ]) => ({
      isUndefinedPossible: true,
      name: key,
      type: ETypeofType.STRING,
      value,
    })),

    ...Object.entries(functionUndefinedParams).map(([ key, value ]) => ({
      isUndefinedPossible: true,
      name: key,
      type: ETypeofType.FUNCTION,
      value,
    })),

    ...Object.entries(objectUndefinedParams).map(([ key, value ]) => ({
      isUndefinedPossible: true,
      name: key,
      type: ETypeofType.OBJECT,
      value,
    })),

    {
      condition: !!(data && Array.isArray(data)),
      err: INVALID_DATA_DEFAULT_ERROR,
      name: 'data',
    },
  ];

  if (!isProduction()) {
    properties.forEach(item => {

      const {
        condition,
        err,
        isUndefinedPossible,
        name: nameProp,
        type,
        value,
      } = item;

      let name = nameProp;

      if (name.startsWith('color') && name !== 'color') {
        name = name.slice(5);
        name = lowerCaseFirstLetter(name);
      } else if (name.startsWith('className') && name !== 'className') {
        name = name.slice(9);
        name = lowerCaseFirstLetter(name);
      }

      if (err && typeof condition !== 'undefined' && !condition) {
        consoleError(`Parameter "${name}" error: ${err}`);
        return;
      }

      if (typeof type !== 'undefined') {
        if (isUndefinedPossible) {
          if (typeof value === 'undefined') {
            return;
          }
        }

        if (typeof value !== type) {
          consoleError(`
          Parameter "${name}" error: Must be type of ${type}
          Provided: "${name}" = ${value}
          Type: ${typeof value}
          `);
        }
      }
    });

    /**
     * prop "children" checks
     */
    if (children && !isValidElement(children) && typeof children !== 'string' && typeof children !== 'number') {
      consoleError(`
      Parameter "children" error: Must be type of ReactNode | string | number
      Provided: children = ${children}
      Type: ${typeof children}
      `);
    }

    /**
     * prop "parentRef" checks
     */
    if (parentRef) {
      const parentRefError = 'Parameter "parentRef" error: invalid ref';

      if (typeof parentRef !== 'object') {
        consoleError(parentRefError);
      } else {
        const isParentRefHasKeyCurrent = 'current' in parentRef;

        if (!isParentRefHasKeyCurrent) {
          consoleError(parentRefError);
        } else {
          if (parentRef.current) {
            if (typeof parentRef.current !== 'object') {
              consoleError(parentRefError);
            } else {
              const isParentRefCurrentHasKeyOffsetHeight = 'offsetHeight' in parentRef.current;
              const isParentRefCurrentHasKeyOffsetWidth = 'offsetWidth' in parentRef.current;

              if (
                !isParentRefCurrentHasKeyOffsetHeight
                || !isParentRefCurrentHasKeyOffsetWidth
                || typeof parentRef.current.offsetHeight !== 'number'
                || typeof parentRef.current.offsetWidth !== 'number'
              ) {
                consoleError(parentRefError);
              }
            }

          }
        }
      }
    }

    /**
     * prop "data" elements checks
     */
    if (props.data && Array.isArray(props.data)) {
      props.data.forEach((item, i) => {
        const {
          color,
          id,
          order,
          value,
        } = item;

        let dataItemId = `index of ${i}`;

        if (id && typeof id === 'string') {
          dataItemId = `id: ${id}`;
        }

        const paramPrefix = `Data item [${dataItemId}] param`;

        if (typeof color !== 'undefined' && typeof color !== 'string') {
          consoleError(`
          ${paramPrefix} "color" error: Must be type of string
          Provided: "color" = ${color}
          Type: ${typeof color}
          `);
        }

        if (typeof id !== 'undefined' && typeof id !== 'string') {
          consoleError(`
          ${paramPrefix} "id" error: Must be type of string
          Provided: "id" = ${id}
          Type: ${typeof id}
          `);
        }

        if (typeof order !== 'undefined' && typeof order !== 'number') {
          consoleError(`
          ${paramPrefix} "order" error: Must be type of number
          Provided: "order" = ${order}
          Type: ${typeof order}
          `);
        }

        if (typeof value !== 'number' && !value) {
          consoleError(`${paramPrefix} "value" error: Must be provided`);
        } else if (typeof value !== 'number') {
          consoleError(`
          ${paramPrefix} "value" error: Must be type of number
          Provided: "value" = ${value}
          Type: ${typeof value}
          `);
        }
      });
    }

    /**
     * prop "donutThickness" additional checks
     */
    if (donutThickness && size) {
      const minDonutThickness = size / 2;

      if (donutThickness >= minDonutThickness) {
        consoleError(`
        Param "donutThickness" error: Thickness of donut can't be equals or more than size.
        Current passed thickness: ${donutThickness};
        Current passed size: ${size};
        Max thickness you can pass with current size: ${minDonutThickness - 1}.
        
        Tip: If you want to get "Pie" type chart instead of "Donut" type - just remove "donutThickness" param or pass donutThickness={0}
        `);
      }
    }
  }
};
