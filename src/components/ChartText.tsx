import React from 'react';

import { TUseChartPropsReturn } from 'hooks/useChartProps';

export const TEST_DATA_ID_CHART_TEXT_FOREIGN_OBJECT = 'TEST_DATA_ID_CHART_TEXT_FOREIGN_OBJECT';

type TChartText = Pick<TUseChartPropsReturn,
'children'
| 'classNameChildren'
| 'classNameSvgGroupText'
| 'classNameSvgObjectText'
| 'classNameText'
| 'colorText'
| 'fontSize'
| 'size'
| 'text'
>;

/**
 * Chart's "text" or (and) "children"
 * @component ChartText
 * @param { TChartText } props
 * @returns { JSX.Element } returns svg group <g> of <foreignObject> which contains passed "text" or (and) "children"
 */
export const ChartText: React.FC<TChartText> = props => {

  const {
    children,
    classNameChildren,
    classNameSvgGroupText,
    classNameSvgObjectText,
    classNameText,
    colorText,
    fontSize,
    size,
    text,
  } = props;

  if (!text && !children) {
    return null;
  }

  return (
    <g
      className={classNameSvgGroupText}
      style={{ pointerEvents: 'none' }}
    >
      <foreignObject
        className={classNameSvgObjectText}
        data-testid={TEST_DATA_ID_CHART_TEXT_FOREIGN_OBJECT}
        height={size}
        style={{ position: 'relative' }}
        width={size}
        x="0"
        y="0"
      >
        {
          text && (
            <div
              className={classNameText}
              style={
                {
                  alignItems: 'center',
                  color: colorText,
                  display: 'flex',
                  fontSize: `${fontSize}px`,
                  height: '100%',
                  justifyContent: 'center',
                  position: 'absolute',
                  transition: 'font-size .3s, color .3s',
                  width: '100%',
                }
              }
            >
              {text}
            </div>
          )
        }

        {
          children && (
            <div
              className={classNameChildren}
              style={
                {
                  display: 'flex',
                  height: '100%',
                  position: 'absolute',
                  width: '100%',
                }
              }
            >
              {children}
            </div>
          )
        }
      </foreignObject>
    </g>
  );
};
