'use strict';

var React6 = require('react');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React6__default = /*#__PURE__*/_interopDefault(React6);

/*!
*****************************************************************************
*****************************************************************************

MIT License

Copyright (c) 2023 Garvae

Author repo: https://github.com/garvae
Author email: vgarvae@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*****************************************************************************
*****************************************************************************
*/
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// src/utils/computePrefixTotals.ts
function computePrefixTotals(items) {
  let running = 0;
  return items.map((item) => {
    const prev = running;
    running += item.value;
    return prev;
  });
}
var init_computePrefixTotals = __esm({
  "src/utils/computePrefixTotals.ts"() {
  }
});

// src/utils/createChartSegmentPathDraw/_utils/convertPercentToDegrees.ts
var convertPercentToDegrees;
var init_convertPercentToDegrees = __esm({
  "src/utils/createChartSegmentPathDraw/_utils/convertPercentToDegrees.ts"() {
    convertPercentToDegrees = (props) => {
      const { percent } = props;
      if (typeof percent !== "number") {
        return 0;
      }
      return percent / 100 * 360;
    };
  }
});

// src/utils/env.ts
var isClient, isProduction, isTest;
var init_env = __esm({
  "src/utils/env.ts"() {
    typeof process !== "undefined" ? process.env : {};
    isClient = () => typeof window !== "undefined" && typeof document !== "undefined";
    isProduction = () => typeof process !== "undefined" && false;
    isTest = () => !isProduction() && typeof process !== "undefined" && false;
  }
});

// src/utils/console.ts
var alignConsoleTextLeftDefaultErr, alignConsoleTextLeft, defaultReportLinkMessage, createErrorWithDescription, defaultConsolePs, consoleError, consoleWarn;
var init_console = __esm({
  "src/utils/console.ts"() {
    init_env();
    alignConsoleTextLeftDefaultErr = `
Something went wrong while working with strings...
And seems like it's an INTERNAL LIBRARY error.

Error in: "lowerCaseFirstLetter" function
`;
    alignConsoleTextLeft = (text) => {
      if (!text || typeof text !== "string") {
        if (!isProduction()) {
          console.error([alignConsoleTextLeftDefaultErr, `Received text: ${text}`].join("\n\n"));
        }
        return "";
      }
      return text.replaceAll("  ", "");
    };
    defaultReportLinkMessage = `
If you see this error and are sure that all properties passed to the "PieDonutChart" component are valid, 
please open an issue here: https://github.com/garvae/react-pie-donut-chart.
`;
    createErrorWithDescription = (props) => {
      const { messageMain, report: reportProp } = props;
      const title = "\u{1F622} \u{1F622} \u{1F622} Sorry, but something went wrong while calculating the chart params.";
      const hint = `
Please check:
1. All necessary and valid properties are passed to the "PieDonutChart" component
2. No other errors are displayed in the console

${defaultReportLinkMessage}
`;
      const report = [title];
      if (messageMain && typeof messageMain === "string") {
        report.push(messageMain);
      }
      report.push(hint);
      if (reportProp && typeof reportProp === "string") {
        report.push(`
* * * * * * *
If want to open an issue please include the information below in the bug report.

${reportProp}
* * * * * * *
`);
      }
      return report.join("\n\n");
    };
    defaultConsolePs = `
- - - - - - - - - - -
P.S. This message will not be shown in the 'production' mode.
`;
    consoleError = (err) => {
      if (!isProduction()) {
        console.error(
          alignConsoleTextLeft(`
    ${err}
    
    ${defaultConsolePs}
    `)
        );
      }
    };
    consoleWarn = (warn) => {
      if (!isProduction()) {
        console.warn(
          alignConsoleTextLeft(`
    ${warn}
    
    ${defaultConsolePs}
    `)
        );
      }
    };
  }
});

// src/utils/createChartSegmentPathDraw/_utils/checkIncomingValues.ts
var checkIncomingValues;
var init_checkIncomingValues = __esm({
  "src/utils/createChartSegmentPathDraw/_utils/checkIncomingValues.ts"() {
    init_console();
    checkIncomingValues = (props) => {
      const { radiusInner, radiusOuter, size, valueSegment, valueSegmentsPreviousTotal, valueSegmentsTotal } = props;
      const isNotValid = isNaN(valueSegment) || !isFinite(valueSegment) || isNaN(valueSegmentsPreviousTotal) || !isFinite(valueSegmentsPreviousTotal) || isNaN(size) || isNaN(valueSegmentsTotal) || !isFinite(valueSegmentsTotal) || isNaN(radiusOuter) || isNaN(radiusInner) || valueSegment > valueSegmentsTotal || valueSegmentsPreviousTotal > valueSegmentsTotal || radiusOuter > size || radiusInner > size || radiusInner > radiusOuter;
      if (isNotValid) {
        consoleError(
          createErrorWithDescription({
            messageMain: "In most cases, this error is caused by invalid props.",
            report: `
      One of the checks failed:
      
      isNaN(valueSegment)
      || isNaN(valueSegmentsPreviousTotal)
      || isNaN(size)
      || isNaN(valueSegmentsTotal)
      || isNaN(radiusOuter)
      || isNaN(radiusInner)
      || valueSegment > valueSegmentsTotal
      || valueSegmentsPreviousTotal > valueSegmentsTotal
      || radiusOuter > size
      || radiusInner > size
      || radiusInner > radiusOuter
      
      
      Error in: "checkIncomingValues" function
      Received values: 
      
      ${props}
      `
          })
        );
        return false;
      }
      return true;
    };
  }
});

// src/utils/createChartSegmentPathDraw/_utils/getPointCoords.ts
var getPointCoords;
var init_getPointCoords = __esm({
  "src/utils/createChartSegmentPathDraw/_utils/getPointCoords.ts"() {
    getPointCoords = (props) => {
      const { angleDegrees, radius, size } = props;
      const halfSize = size / 2;
      const x = radius * Math.cos(angleDegrees * Math.PI / 180) + halfSize;
      const y = -radius * Math.sin(angleDegrees * Math.PI / 180) + halfSize;
      return `${x} ${y}`;
    };
  }
});

// src/utils/createChartSegmentPathDraw/_utils/createSvgCommandsString.ts
var createSvgCommandsString;
var init_createSvgCommandsString = __esm({
  "src/utils/createChartSegmentPathDraw/_utils/createSvgCommandsString.ts"() {
    init_getPointCoords();
    createSvgCommandsString = (props) => {
      const { radiusInner, radiusOuter, size } = props;
      const angleDegrees = Math.min(props.angleDegrees, 359.9999);
      const longPathFlag = angleDegrees > 180 ? 1 : 0;
      const sizeHalf = size / 2;
      const commandM1 = `M ${sizeHalf + radiusOuter} ${sizeHalf}`;
      const coordsPointCommandA1 = getPointCoords({
        angleDegrees,
        radius: radiusOuter,
        size
      });
      const commandA1 = `A ${radiusOuter} ${radiusOuter} 0 ${longPathFlag} 0 ${coordsPointCommandA1}`;
      const coordsPointCommandL1 = getPointCoords({
        angleDegrees,
        radius: radiusInner,
        size
      });
      const commandL1 = `L ${coordsPointCommandL1}`;
      const commandA2 = `A ${radiusInner} ${radiusInner} 0 ${longPathFlag} 1 ${sizeHalf + radiusInner} ${sizeHalf}`;
      const coordsPointCommandL2 = getPointCoords({
        angleDegrees: 0,
        radius: radiusOuter,
        size
      });
      const commandL2 = `L ${coordsPointCommandL2}`;
      return [commandM1, commandA1, commandL1, commandA2, commandL2].join(" ");
    };
  }
});

// src/utils/createChartSegmentPathDraw/createChartSegmentPathDraw.ts
var createChartSegmentPathDraw;
var init_createChartSegmentPathDraw = __esm({
  "src/utils/createChartSegmentPathDraw/createChartSegmentPathDraw.ts"() {
    init_checkIncomingValues();
    init_createSvgCommandsString();
    createChartSegmentPathDraw = (props) => {
      const { radiusInner, radiusOuter, size, valueSegment, valueSegmentsPreviousTotal, valueSegmentsTotal } = props;
      if (!checkIncomingValues(props)) {
        return "";
      }
      const ratioPrev = valueSegmentsPreviousTotal / (valueSegmentsTotal || 1);
      const ratioCurrent = valueSegment / (valueSegmentsTotal || 1);
      const angleStartDegrees = 360 * ratioPrev;
      const angleEndDegrees = 360 * (ratioPrev + ratioCurrent);
      const angleDegrees = angleEndDegrees - angleStartDegrees;
      return createSvgCommandsString({
        angleDegrees,
        radiusInner,
        radiusOuter,
        size
      });
    };
  }
});

// src/utils/isKeyDownEnter.ts
var isKeyDownEnter;
var init_isKeyDownEnter = __esm({
  "src/utils/isKeyDownEnter.ts"() {
    isKeyDownEnter = (e) => {
      var _a, _b, _c, _d;
      return ((_b = (_a = e.code) == null ? void 0 : _a.toLowerCase) == null ? void 0 : _b.call(_a)) === "enter" || e.code && String(e.code) === "13" || e.key && String(e.key) === "13" || ((_d = (_c = e.key) == null ? void 0 : _c.toLowerCase) == null ? void 0 : _d.call(_c)) === "enter";
    };
  }
});

// src/utils/isKeyDownSpace.ts
var isKeyDownSpace;
var init_isKeyDownSpace = __esm({
  "src/utils/isKeyDownSpace.ts"() {
    isKeyDownSpace = (e) => {
      var _a, _b, _c, _d;
      return ((_b = (_a = e.code) == null ? void 0 : _a.toLowerCase) == null ? void 0 : _b.call(_a)) === "space" || e.key === " " || ((_d = (_c = e.key) == null ? void 0 : _c.toLowerCase) == null ? void 0 : _d.call(_c)) === "space";
    };
  }
});

// src/utils/sanitizeNumber.ts
var DEFAULT_SANITISE_NUMBER_VALUE, sanitizeNumber;
var init_sanitizeNumber = __esm({
  "src/utils/sanitizeNumber.ts"() {
    init_console();
    DEFAULT_SANITISE_NUMBER_VALUE = 0;
    sanitizeNumber = (n, defaultNumber = DEFAULT_SANITISE_NUMBER_VALUE) => {
      if (isNaN(n) || !isFinite(n)) {
        consoleError(
          createErrorWithDescription({
            messageMain: "In most cases, this error is caused by invalid props.",
            report: `
      Error in: "sanitizeNumber" function
      Received value: ${n}
      `
          })
        );
        return defaultNumber;
      }
      return n;
    };
  }
});

// src/variables/defaults.ts
var SINGLE_VALUE_CORRECTION_RATIO, DEFAULT_FOCUSED_SEGMENT_STROKE_WIDTH_TO_SIZE_RATIO, DEFAULT_COLOR_SEGMENT_FOCUSED_OUTLINE, DEFAULT_CHART_CENTER_COLOR, DEFAULT_CHART_TEXT_COLOR, DEFAULT_CHART_SEGMENT_SCALE_RATIO, DEFAULT_RESIZE_RE_RENDER_DEBOUNCE_TIME, DEFAULT_ANIMATION_SPEED;
var init_defaults = __esm({
  "src/variables/defaults.ts"() {
    SINGLE_VALUE_CORRECTION_RATIO = 0.99999999;
    DEFAULT_FOCUSED_SEGMENT_STROKE_WIDTH_TO_SIZE_RATIO = 66e-4;
    DEFAULT_COLOR_SEGMENT_FOCUSED_OUTLINE = "#287bc8";
    DEFAULT_CHART_CENTER_COLOR = "#ffffff";
    DEFAULT_CHART_TEXT_COLOR = "#333333";
    DEFAULT_CHART_SEGMENT_SCALE_RATIO = 1.05;
    DEFAULT_RESIZE_RE_RENDER_DEBOUNCE_TIME = 0;
    DEFAULT_ANIMATION_SPEED = 200;
  }
});
var SEGMENT_OFFSET_CORRECTION_ANGLE, TEST_DATA_ID_CHART_GROUP_SEGMENTS, TEST_DATA_ID_CHART_GROUP_SEGMENT, TEST_DATA_ATTR_CHART_GROUP_SEGMENT_ID, TEST_DATA_ATTR_CHART_GROUP_SEGMENT_GAP, TEST_DATA_ATTR_CHART_GROUP_SEGMENT_THICKNESS, TEST_DATA_ATTR_CHART_GROUP_SEGMENT_SELECTED, Chart;
var init_Chart = __esm({
  "src/components/Chart.tsx"() {
    init_computePrefixTotals();
    init_convertPercentToDegrees();
    init_createChartSegmentPathDraw();
    init_isKeyDownEnter();
    init_isKeyDownSpace();
    init_sanitizeNumber();
    init_defaults();
    SEGMENT_OFFSET_CORRECTION_ANGLE = 90;
    TEST_DATA_ID_CHART_GROUP_SEGMENTS = "TEST_DATA_ID_CHART_GROUP_SEGMENTS";
    TEST_DATA_ID_CHART_GROUP_SEGMENT = "TEST_DATA_ID_CHART_GROUP_SEGMENT";
    TEST_DATA_ATTR_CHART_GROUP_SEGMENT_ID = "data-test-id";
    TEST_DATA_ATTR_CHART_GROUP_SEGMENT_GAP = "data-test-gap";
    TEST_DATA_ATTR_CHART_GROUP_SEGMENT_THICKNESS = "data-test-thickness";
    TEST_DATA_ATTR_CHART_GROUP_SEGMENT_SELECTED = "data-test-selected";
    Chart = (props) => {
      const {
        chartRef,
        classNameChartSegment,
        classNameSvgGroupSegments,
        colorSegmentFocusedOutline,
        data,
        donutThickness,
        focusedSegment,
        gap,
        getSegmentAriaLabel,
        handleClearSelects,
        hoverScaleRatio,
        hoveredSegment,
        isScaleOnHover,
        isSelectOnClick,
        isSelectOnKeyEnterDown,
        mouseDownSegment,
        onSegmentClick,
        onSegmentKeyEnterDown,
        radius,
        segmentsStyles,
        selected,
        setFocusedSegment,
        setHoveredSegment,
        setMouseDownSegment,
        setSelected,
        size,
        strokeWidth,
        stylesHoveredSegment,
        tabIndex,
        totalDataValue
      } = props;
      const prefixTotals = React6.useMemo(() => computePrefixTotals(data), [data]);
      if (!data.length) {
        return null;
      }
      return /* @__PURE__ */ React6__default.default.createElement(
        "g",
        {
          className: classNameSvgGroupSegments,
          "data-testid": TEST_DATA_ID_CHART_GROUP_SEGMENTS,
          onBlurCapture: handleClearSelects,
          onMouseLeave: () => {
            if (hoveredSegment) {
              setHoveredSegment(null);
            }
          },
          ref: chartRef
        },
        data.map((item, i) => {
          const isGapSegment = !!gap && i % 2 !== 0;
          const { color, id, value: valueParam } = item;
          let value = valueParam;
          if (data.length === 1) {
            value = value * SINGLE_VALUE_CORRECTION_RATIO;
          }
          let prevTotal = prefixTotals[i] || 0;
          const prevTotalPercentage = sanitizeNumber(prevTotal) / sanitizeNumber(totalDataValue, 1) * 100;
          const currentPercentage = sanitizeNumber(value) / sanitizeNumber(totalDataValue, 1) * 100;
          let segmentOffset = convertPercentToDegrees({ percent: currentPercentage }) - SEGMENT_OFFSET_CORRECTION_ANGLE;
          if (i !== 0) {
            segmentOffset = segmentOffset + convertPercentToDegrees({ percent: prevTotalPercentage });
          }
          const isSelected = selected === id;
          const isHovered = hoveredSegment === id;
          const isFocused = focusedSegment === id;
          const isMouseDown = mouseDownSegment === id;
          let transform = `rotate(${segmentOffset}deg) scale(1)`;
          if (!isGapSegment && (isSelected || isFocused || isScaleOnHover && isHovered)) {
            transform = `rotate(${segmentOffset}deg) scale(${hoverScaleRatio})`;
          }
          const classNameSegmentDefault = "PieDonutChart__segment";
          const classNameSegment = classNameChartSegment ? `${classNameSegmentDefault} ${classNameChartSegment}` : classNameSegmentDefault;
          let stroke = void 0;
          if (!isGapSegment && isFocused && !isMouseDown) {
            stroke = colorSegmentFocusedOutline || DEFAULT_COLOR_SEGMENT_FOCUSED_OUTLINE;
          }
          const segmentPath = createChartSegmentPathDraw({
            radiusInner: donutThickness ? radius - donutThickness : 0,
            radiusOuter: radius,
            size,
            valueSegment: value,
            valueSegmentsPreviousTotal: prevTotal,
            valueSegmentsTotal: totalDataValue
          });
          const segmentAriaLabel = isGapSegment ? void 0 : getSegmentAriaLabel ? getSegmentAriaLabel(item, i) : `Segment ${id != null ? id : i}: value ${value}`;
          const testsAttributesGap = { [TEST_DATA_ATTR_CHART_GROUP_SEGMENT_GAP]: gap };
          const testsAttributes = __spreadValues({
            [TEST_DATA_ATTR_CHART_GROUP_SEGMENT_ID]: id,
            [TEST_DATA_ATTR_CHART_GROUP_SEGMENT_SELECTED]: isSelected,
            [TEST_DATA_ATTR_CHART_GROUP_SEGMENT_THICKNESS]: donutThickness
          }, isGapSegment ? testsAttributesGap : {});
          return /* @__PURE__ */ React6__default.default.createElement(
            "path",
            __spreadProps(__spreadValues({}, testsAttributes), {
              "aria-label": segmentAriaLabel,
              "aria-pressed": isGapSegment ? void 0 : isSelected,
              className: classNameSegment,
              d: segmentPath,
              "data-testid": TEST_DATA_ID_CHART_GROUP_SEGMENT,
              fill: color,
              key: `chart-segment-${id}`,
              role: isGapSegment ? void 0 : "button",
              onClick: () => {
                if (isGapSegment) {
                  return;
                }
                if (isSelectOnClick && selected !== id) {
                  setSelected(id);
                }
                onSegmentClick == null ? void 0 : onSegmentClick(id);
              },
              onFocus: () => {
                if (isGapSegment) {
                  return;
                }
                if (focusedSegment !== id) {
                  setFocusedSegment(id);
                }
              },
              onKeyDownCapture: (e) => {
                if (isGapSegment) {
                  return;
                }
                if (isKeyDownSpace(e)) {
                  e.preventDefault();
                  if (isSelectOnKeyEnterDown && selected !== id) {
                    setSelected(id);
                  }
                  onSegmentKeyEnterDown == null ? void 0 : onSegmentKeyEnterDown(id);
                  return;
                }
                if (isKeyDownEnter(e)) {
                  if (isSelectOnKeyEnterDown && selected !== id) {
                    setSelected(id);
                  }
                  onSegmentKeyEnterDown == null ? void 0 : onSegmentKeyEnterDown(id);
                }
              },
              onMouseDown: () => {
                if (isGapSegment) {
                  return;
                }
                if (mouseDownSegment !== id) {
                  setMouseDownSegment(id);
                }
              },
              onMouseOverCapture: () => {
                if (isGapSegment) {
                  return;
                }
                if (hoveredSegment !== id) {
                  setHoveredSegment(id);
                }
              },
              onMouseUp: (e) => {
                if (isGapSegment) {
                  return;
                }
                setMouseDownSegment(null);
                e.currentTarget.blur();
              },
              stroke,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: isGapSegment ? 0 : strokeWidth,
              style: __spreadValues(__spreadProps(__spreadValues({}, segmentsStyles), {
                cursor: isGapSegment ? "initial" : "pointer",
                outline: "none",
                transform,
                transitionProperty: "all"
              }), !isGapSegment && isHovered && stylesHoveredSegment ? stylesHoveredSegment : {}),
              tabIndex: isGapSegment ? -1 : tabIndex
            })
          );
        })
      );
    };
  }
});
var TEST_DATA_ID_CHART_BACKGROUND, ChartBackground;
var init_ChartBackground = __esm({
  "src/components/ChartBackground.tsx"() {
    TEST_DATA_ID_CHART_BACKGROUND = "TEST_DATA_ID_CHART_BACKGROUND";
    ChartBackground = (props) => {
      const { classNameChartBackground, colorChartBackground, radius } = props;
      if (!colorChartBackground) {
        return null;
      }
      return /* @__PURE__ */ React6__default.default.createElement(
        "circle",
        {
          className: classNameChartBackground,
          cx: radius,
          cy: radius,
          "data-testid": TEST_DATA_ID_CHART_BACKGROUND,
          fill: colorChartBackground,
          r: radius,
          style: { pointerEvents: "none" }
        }
      );
    };
  }
});
var TEST_DATA_ID_CHART_CENTER, ChartCenter;
var init_ChartCenter = __esm({
  "src/components/ChartCenter.tsx"() {
    TEST_DATA_ID_CHART_CENTER = "TEST_DATA_ID_CHART_CENTER";
    ChartCenter = (props) => {
      const { centerSize, classNameChartCenter, colorChartCenter, radius } = props;
      if (!centerSize) {
        return null;
      }
      return /* @__PURE__ */ React6__default.default.createElement(
        "circle",
        {
          className: classNameChartCenter,
          cx: radius,
          cy: radius,
          "data-testid": TEST_DATA_ID_CHART_CENTER,
          fill: colorChartCenter,
          r: centerSize / 2,
          style: { pointerEvents: "none" }
        }
      );
    };
  }
});
var TEST_DATA_ID_CHART_SEGMENTS_BACKGROUND, ChartSegmentsBackground;
var init_ChartSegmentsBackground = __esm({
  "src/components/ChartSegmentsBackground.tsx"() {
    TEST_DATA_ID_CHART_SEGMENTS_BACKGROUND = "TEST_DATA_ID_CHART_SEGMENTS_BACKGROUND";
    ChartSegmentsBackground = (props) => {
      const {
        classNameChartSegmentsBackground,
        classNameSvgGroupSegmentsBackground,
        colorSegmentsBackground,
        donutThickness,
        radius
      } = props;
      if (!colorSegmentsBackground) {
        return null;
      }
      return /* @__PURE__ */ React6__default.default.createElement("g", { className: classNameSvgGroupSegmentsBackground }, /* @__PURE__ */ React6__default.default.createElement(
        "circle",
        {
          className: classNameChartSegmentsBackground,
          cx: radius,
          cy: radius,
          "data-testid": TEST_DATA_ID_CHART_SEGMENTS_BACKGROUND,
          fill: "none",
          r: donutThickness ? radius - donutThickness / 2 : 0,
          stroke: colorSegmentsBackground,
          strokeWidth: donutThickness,
          style: { pointerEvents: "none" }
        }
      ));
    };
  }
});
var TEST_DATA_ID_CHART_TEXT_FOREIGN_OBJECT, ChartText;
var init_ChartText = __esm({
  "src/components/ChartText.tsx"() {
    TEST_DATA_ID_CHART_TEXT_FOREIGN_OBJECT = "TEST_DATA_ID_CHART_TEXT_FOREIGN_OBJECT";
    ChartText = (props) => {
      const {
        children,
        classNameChildren,
        classNameSvgGroupText,
        classNameSvgObjectText,
        classNameText,
        colorText,
        fontSize,
        size,
        text
      } = props;
      if (!text && !children) {
        return null;
      }
      return /* @__PURE__ */ React6__default.default.createElement("g", { className: classNameSvgGroupText, style: { pointerEvents: "none" } }, /* @__PURE__ */ React6__default.default.createElement(
        "foreignObject",
        {
          className: classNameSvgObjectText,
          "data-testid": TEST_DATA_ID_CHART_TEXT_FOREIGN_OBJECT,
          height: size,
          style: { position: "relative" },
          width: size,
          x: "0",
          y: "0"
        },
        text && /* @__PURE__ */ React6__default.default.createElement(
          "div",
          {
            className: classNameText,
            style: {
              alignItems: "center",
              color: colorText,
              display: "flex",
              fontSize: `${fontSize}px`,
              height: "100%",
              justifyContent: "center",
              position: "absolute",
              transition: "font-size .3s, color .3s",
              width: "100%"
            }
          },
          text
        ),
        children && /* @__PURE__ */ React6__default.default.createElement(
          "div",
          {
            className: classNameChildren,
            style: {
              display: "flex",
              height: "100%",
              position: "absolute",
              width: "100%"
            }
          },
          children
        )
      ));
    };
  }
});

// src/hooks/helpers/useHandleResize/resizeHandler.ts
var resizeHandler;
var init_resizeHandler = __esm({
  "src/hooks/helpers/useHandleResize/resizeHandler.ts"() {
    resizeHandler = (props) => {
      const { maxSize, minSize, parentRef, size, updateSize } = props;
      const { offsetHeight, offsetWidth } = (parentRef == null ? void 0 : parentRef.current) || {};
      const h = offsetHeight || size;
      const w = offsetWidth || size;
      if (typeof h !== "number" || typeof w !== "number") {
        return;
      }
      let s = 0;
      if (h === w && w > 0) {
        s = h;
      } else if (h > 0 && w > 0) {
        s = h > w ? w : h;
      } else if (h && h > 0) {
        s = h;
      } else if (w && w > 0) {
        s = w;
      }
      if (s) {
        if (minSize && minSize >= s) {
          updateSize(minSize);
        } else if (maxSize && maxSize <= s) {
          updateSize(maxSize);
        } else {
          updateSize(s);
        }
      } else if (minSize) {
        updateSize(minSize);
      } else {
        updateSize(0);
      }
    };
  }
});

// src/hooks/helpers/useHandleResize/startResizeListener/processResizeMutation.ts
var processResizeMutationDefaultErrText, processResizeMutationNoMutationsErrText, processResizeMutationElNotFoundErrText, processResizeMutationElInvalidErrText, processResizeMutationNoChangesErrText, CUSTOM_NODE_EVENT_NAME_RESIZE, processResizeMutation;
var init_processResizeMutation = __esm({
  "src/hooks/helpers/useHandleResize/startResizeListener/processResizeMutation.ts"() {
    init_console();
    init_env();
    processResizeMutationDefaultErrText = 'Error while processing "processResizeMutation" function:';
    processResizeMutationNoMutationsErrText = "No mutations received";
    processResizeMutationElNotFoundErrText = "Node element is not found in the received mutation";
    processResizeMutationElInvalidErrText = `
Received mutation has invalid Node element.
Node element has invalid "clientWidth" or "clientHeight" param (or both)
`;
    processResizeMutationNoChangesErrText = "Received mutation has no changes";
    CUSTOM_NODE_EVENT_NAME_RESIZE = "resize";
    processResizeMutation = (mutations) => {
      var _a;
      if (!(mutations == null ? void 0 : mutations.length) || mutations && !Array.isArray(mutations)) {
        if (isTest()) {
          consoleError(`
        ${processResizeMutationDefaultErrText}
        ${processResizeMutationNoMutationsErrText}
      `);
        }
        return;
      }
      const el = mutations[0].target;
      if (!el) {
        if (isTest()) {
          consoleError(`
        ${processResizeMutationDefaultErrText}
        ${processResizeMutationElNotFoundErrText}
      `);
        }
        return;
      }
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (typeof w !== "number" || typeof h !== "number") {
        if (isTest()) {
          consoleError(`
        ${processResizeMutationDefaultErrText}
        ${processResizeMutationElInvalidErrText}
      `);
        }
        return;
      }
      const isChange = mutations.find((m) => {
        if (!m.oldValue) {
          return true;
        }
        const oldValue = String(m.oldValue);
        const isWidthChanged = !oldValue.includes(`width: ${w}px`);
        const isHeightChanged = !oldValue.includes(`height: ${h}px`);
        return isWidthChanged || isHeightChanged;
      });
      if (!isChange) {
        if (isTest()) {
          consoleError(`
        ${processResizeMutationDefaultErrText}
        ${processResizeMutationNoChangesErrText}
      `);
        }
        return;
      }
      const event = new CustomEvent(CUSTOM_NODE_EVENT_NAME_RESIZE, {
        detail: {
          height: h,
          width: w
        }
      });
      (_a = el.dispatchEvent) == null ? void 0 : _a.call(el, event);
    };
  }
});

// src/hooks/helpers/useHandleResize/startResizeListener/startResizeListener.ts
var startResizeListener;
var init_startResizeListener = __esm({
  "src/hooks/helpers/useHandleResize/startResizeListener/startResizeListener.ts"() {
    init_processResizeMutation();
    startResizeListener = (props) => {
      const { cb, node } = props;
      if (!(node == null ? void 0 : node.nodeName)) {
        return void 0;
      }
      const observer = new MutationObserver(processResizeMutation);
      observer.observe(node, {
        attributeFilter: ["style"],
        attributeOldValue: true,
        attributes: true
      });
      node.addEventListener("resize", cb);
      return () => {
        observer.disconnect();
        node.removeEventListener("resize", cb);
      };
    };
  }
});
var useIsMounted;
var init_useIsMounted = __esm({
  "src/hooks/helpers/useIsMounted.ts"() {
    init_env();
    useIsMounted = () => {
      const ref = React6.useRef(false);
      React6.useEffect(() => {
        ref.current = true;
        return () => {
          ref.current = false;
        };
      }, []);
      return React6.useCallback(() => {
        if (isTest()) {
          return true;
        }
        return ref.current;
      }, [ref]);
    };
  }
});
var useIsomorphicLayoutEffect;
var init_useIsomorphicLayoutEffect = __esm({
  "src/hooks/helpers/useIsomorphicLayoutEffect.ts"() {
    init_env();
    useIsomorphicLayoutEffect = isClient() ? React6.useLayoutEffect : React6.useEffect;
  }
});

// src/utils/debounce.ts
var debounce;
var init_debounce = __esm({
  "src/utils/debounce.ts"() {
    debounce = (cb, wait) => {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        return new Promise((resolve) => {
          timer = setTimeout(() => resolve(cb(...args)), wait);
        });
      };
    };
  }
});
var useHandleResize;
var init_useHandleResize = __esm({
  "src/hooks/helpers/useHandleResize/useHandleResize.ts"() {
    init_resizeHandler();
    init_startResizeListener();
    init_useIsMounted();
    init_useIsomorphicLayoutEffect();
    init_debounce();
    init_env();
    init_sanitizeNumber();
    useHandleResize = (props) => {
      const {
        animationDuration,
        maxSize,
        minSize,
        parentRef,
        resizeReRenderDebounceTime,
        setAnimationDuration,
        size: sizeProp
      } = props;
      const isMounted = useIsMounted();
      const [size, setSize] = React6.useState(0);
      const [parentRefCurrent, setParentRefCurrent] = React6.useState(null);
      const processUpdate = React6.useCallback(
        (newSize) => {
          if (isMounted()) {
            if (animationDuration !== 0) {
              setAnimationDuration(0);
            }
            setSize(newSize);
          }
        },
        [animationDuration, isMounted, setAnimationDuration]
      );
      const updateSizeDebounced = debounce((newSize) => {
        if (newSize !== size && isMounted()) {
          processUpdate(newSize);
        }
      }, resizeReRenderDebounceTime);
      const updateSize = React6.useCallback(
        (newSize) => {
          const n = sanitizeNumber(newSize, size);
          if (resizeReRenderDebounceTime === 0) {
            processUpdate(newSize);
          } else {
            updateSizeDebounced(n);
          }
        },
        [processUpdate, resizeReRenderDebounceTime, size, updateSizeDebounced]
      );
      const handleResize = React6.useCallback(
        () => resizeHandler({
          maxSize,
          minSize,
          parentRef,
          size: sizeProp,
          updateSize
        }),
        [maxSize, minSize, parentRef, sizeProp, updateSize]
      );
      useIsomorphicLayoutEffect(
        () => startResizeListener({
          cb: handleResize,
          node: (parentRef == null ? void 0 : parentRef.current) || null
        }),
        [handleResize, parentRef]
      );
      useIsomorphicLayoutEffect(() => {
        if (isClient() && !sizeProp) {
          window.addEventListener("resize", handleResize);
          return () => window.removeEventListener("resize", handleResize);
        }
        return void 0;
      }, [handleResize, sizeProp]);
      useIsomorphicLayoutEffect(() => {
        const isReadyForSize = (parentRef == null ? void 0 : parentRef.current) || sizeProp;
        if (isClient() && isReadyForSize && !size) {
          handleResize();
        }
        return void 0;
      }, [handleResize, parentRef, size, sizeProp]);
      React6.useEffect(() => {
        if ((parentRef == null ? void 0 : parentRef.current) && parentRefCurrent !== parentRef.current) {
          setParentRefCurrent(parentRef.current);
          handleResize();
        }
      }, [handleResize, parentRef, parentRefCurrent]);
      React6.useEffect(() => {
        if (sizeProp && size !== sizeProp) {
          handleResize();
        }
      }, [handleResize, parentRef, parentRefCurrent, size, sizeProp]);
      return { size };
    };
  }
});

// src/utils/color.ts
var ChanelRand, rgbRand, rgbToHex, colorRand, randomColorHEX;
var init_color = __esm({
  "src/utils/color.ts"() {
    init_console();
    ChanelRand = () => Math.floor(Math.random() * 256);
    rgbRand = () => [ChanelRand(), ChanelRand(), ChanelRand()];
    rgbToHex = (rgb) => ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
    colorRand = () => rgbToHex(rgbRand());
    randomColorHEX = () => "#" + colorRand();
  }
});

// src/utils/id.ts
var generateUniqueID;
var init_id = __esm({
  "src/utils/id.ts"() {
    generateUniqueID = (complexity = 8) => {
      const cmplxt = typeof complexity === "number" && complexity > 0 ? complexity : 8;
      const chr4 = () => Math.random().toString(16).slice(-4);
      const newIdArr = Array(cmplxt).fill(null).map(chr4);
      if (newIdArr.length === 1) {
        return newIdArr[0];
      }
      return newIdArr.join("-");
    };
  }
});
var USE_CHART_DATA_REMAP_ERR_UNIQUE_ID_TEXT, USE_CHART_DATA_REMAP_ERR_UNIQUE_ORDER_TEXT, useChartDataRemap;
var init_useChartDataRemap = __esm({
  "src/hooks/useChartDataRemap.ts"() {
    init_color();
    init_console();
    init_id();
    USE_CHART_DATA_REMAP_ERR_UNIQUE_ID_TEXT = 'It recommended to you to check provided "data" and make sure all id are unique';
    USE_CHART_DATA_REMAP_ERR_UNIQUE_ORDER_TEXT = 'Items with equal "order" params will be sorted one by another.';
    useChartDataRemap = (props) => {
      const { data: dataProp, gap } = props;
      const incomingData = React6.useMemo(() => {
        const dataValid = dataProp.filter((segment) => {
          if (!segment.value) {
            return false;
          }
          if (!isFinite(segment.value) || segment.value < 0) {
            consoleWarn(`
          Data item param "value" error: Must be a finite positive number.
          
          Provided: "value" = ${segment.value}
          This item will be excluded from the chart.
          `);
            return false;
          }
          return true;
        });
        if (!dataValid.length) {
          return [];
        }
        return dataValid.map((item, i) => {
          var _a;
          let id = item.id;
          if (id && dataValid.filter((dataItem) => dataItem.id === id).length > 1) {
            const newId = generateUniqueID();
            consoleWarn(`
          Data item #${i} param "id" error: Must be unique.
          
          Provided: "id" = ${id}
          This was caught and now one of equals "id" replaced with: "id" = ${newId}
          ${USE_CHART_DATA_REMAP_ERR_UNIQUE_ID_TEXT}
          `);
            id = newId;
          }
          let order = item.order;
          if (typeof order === "number" && dataValid.filter((dataItem) => dataItem.order === order).length > 1) {
            consoleWarn(`
          Data item #${i} param "order" error: Should be unique.
          
          Provided: "order" = ${order}
          ${USE_CHART_DATA_REMAP_ERR_UNIQUE_ORDER_TEXT}
          Just make sure the result on the chart is what you expected.
          `);
          }
          order = 0;
          if (dataValid.length > 1) {
            order = (_a = item.order) != null ? _a : dataValid.length + 1 + i;
          }
          return {
            color: item.color || randomColorHEX(),
            id: id || generateUniqueID(),
            order,
            value: item.value
          };
        }).sort((a, b) => {
          if (a.order < b.order) {
            return -1;
          }
          if (a.order > b.order) {
            return 1;
          }
          return 0;
        });
      }, [dataProp]);
      return React6.useMemo(() => {
        if (!gap) {
          return incomingData;
        }
        const segments = [];
        if (gap) {
          const arrLength = incomingData.length > 1 ? incomingData.length * 2 : 1;
          Array(arrLength).fill(null).forEach((_, i) => {
            if (i === 0) {
              segments.push(__spreadProps(__spreadValues({}, incomingData[0]), {
                order: 0
              }));
              return;
            }
            if (i % 2 !== 0) {
              segments.push({
                color: "transparent",
                id: generateUniqueID(),
                order: i,
                value: gap
              });
              return;
            }
            segments.push(__spreadProps(__spreadValues({}, incomingData[i / 2]), {
              order: i
            }));
          });
        }
        return segments;
      }, [gap, incomingData]);
    };
  }
});
var SINGLE_SEGMENT_COLOR_TEXT_DEFAULT_LIGHT, SINGLE_SEGMENT_COLOR_TEXT_DEFAULT_DARK, useChartParams;
var init_useChartParams = __esm({
  "src/hooks/useChartParams.ts"() {
    init_sanitizeNumber();
    init_defaults();
    SINGLE_SEGMENT_COLOR_TEXT_DEFAULT_LIGHT = "#fff";
    SINGLE_SEGMENT_COLOR_TEXT_DEFAULT_DARK = "#111";
    useChartParams = (props) => {
      const {
        animationDuration,
        chartCenterSize,
        colorChartBackground,
        colorChartCenter,
        colorText: colorTextProp,
        data,
        donutThickness,
        gap,
        isSelectedValueShownInCenter,
        selected,
        size,
        text: textProp
      } = props;
      const totalDataValue = React6.useMemo(() => data.reduce((current, next) => current + next.value, 0) || 0, [data]);
      const biggestValueItem = React6.useMemo(() => {
        let bvi = data[0];
        if (data.length > 1) {
          data.forEach((item) => {
            if (item.value > bvi.value) {
              bvi = item;
            }
          });
        }
        return bvi;
      }, [data]) || 0;
      const viewBox = `0 0 ${size || 0} ${size || 0}`;
      const radius = React6.useMemo(() => sanitizeNumber(size / 2), [size]);
      const centerSize = React6.useMemo(() => {
        if (typeof chartCenterSize !== "undefined" && typeof chartCenterSize === "number") {
          return chartCenterSize;
        }
        if (typeof donutThickness !== "undefined" && donutThickness && typeof donutThickness === "number") {
          return (radius - donutThickness) * 2;
        }
        return 0;
      }, [chartCenterSize, donutThickness, radius]);
      const segmentsStyles = React6.useMemo(
        () => ({
          transformOrigin: "center",
          transition: "ease-in-out",
          transitionDuration: `${animationDuration}ms`
        }),
        [animationDuration]
      );
      const text = React6.useMemo(() => {
        if (textProp) {
          return textProp;
        }
        if (centerSize || donutThickness) {
          if (isSelectedValueShownInCenter && selected) {
            return String(selected.value);
          }
          if (data.length > 1 && gap) {
            return String(totalDataValue - gap * data.length / 2);
          }
          return String(totalDataValue);
        }
        return "";
      }, [centerSize, data.length, donutThickness, gap, isSelectedValueShownInCenter, selected, textProp, totalDataValue]);
      const colorText = React6.useMemo(() => {
        if (colorTextProp) {
          return colorTextProp;
        }
        if (data.length === 1) {
          let textBackgroundColor = colorChartBackground || SINGLE_SEGMENT_COLOR_TEXT_DEFAULT_LIGHT;
          if (centerSize || donutThickness) {
            if (colorChartCenter) {
              textBackgroundColor = colorChartCenter;
            }
          } else if (data[0].color) {
            textBackgroundColor = data[0].color;
          }
          textBackgroundColor.toLocaleLowerCase();
          const colorSegment = (data[0].color || (selected == null ? void 0 : selected.color) || (biggestValueItem == null ? void 0 : biggestValueItem.color) || SINGLE_SEGMENT_COLOR_TEXT_DEFAULT_LIGHT).toLocaleLowerCase();
          let c = SINGLE_SEGMENT_COLOR_TEXT_DEFAULT_LIGHT;
          const isTextBackgroundColorWhite = textBackgroundColor === "white" || textBackgroundColor.slice(0, 3) === "fff";
          if (textBackgroundColor.startsWith("#") && colorSegment.startsWith("#") || textBackgroundColor === colorSegment) {
            const textBackgroundColorClean = textBackgroundColor.replace("#", "");
            const colorSegmentClean = colorSegment.replace("#", "");
            if (textBackgroundColorClean === colorSegmentClean && (isTextBackgroundColorWhite || SINGLE_SEGMENT_COLOR_TEXT_DEFAULT_DARK.toLowerCase().replace("#", "") !== colorSegmentClean)) {
              c = SINGLE_SEGMENT_COLOR_TEXT_DEFAULT_DARK;
            }
          }
          return c;
        }
        if (textProp) {
          return biggestValueItem.color;
        }
        if (selected) {
          return selected.color;
        }
        return DEFAULT_CHART_TEXT_COLOR;
      }, [
        biggestValueItem.color,
        colorTextProp,
        selected,
        textProp,
        centerSize,
        colorChartBackground,
        colorChartCenter,
        data,
        donutThickness
      ]);
      return {
        centerSize,
        colorText,
        donutThickness,
        radius,
        segmentsStyles,
        text,
        totalDataValue,
        viewBox
      };
    };
  }
});
var useChartSelectedSegment;
var init_useChartSelectedSegment = __esm({
  "src/hooks/useChartSelectedSegment.ts"() {
    useChartSelectedSegment = (props) => {
      const { data, focusedSegment, isSelectedValueShownInCenter, selected } = props;
      return React6.useMemo(() => {
        if (!data || !Array.isArray(data) || !data.length || !isSelectedValueShownInCenter || !focusedSegment && !selected) {
          return null;
        }
        if (data.length === 1) {
          return data[0];
        }
        const s = data.find((item) => item.id === focusedSegment || item.id === selected);
        if (!s) {
          return null;
        }
        return s;
      }, [data, focusedSegment, isSelectedValueShownInCenter, selected]);
    };
  }
});
var useClickOutsideDefaultErrText, useClickOutsideNoCbErrText, useClickOutside;
var init_useClickOutside = __esm({
  "src/hooks/helpers/useClickOutside.ts"() {
    init_console();
    init_env();
    useClickOutsideDefaultErrText = 'Error while processing "useClickOutside" hook:';
    useClickOutsideNoCbErrText = "No callback received";
    useClickOutside = (props) => {
      const { callback, isWithKeyEsc, ref } = props;
      React6.useEffect(() => {
        if (!callback) {
          if (isTest()) {
            consoleError(`
        ${useClickOutsideDefaultErrText}
        ${useClickOutsideNoCbErrText}
      `);
          }
          return void 0;
        }
        const handleClick = (e) => {
          const element = ref.current;
          const target = e.target;
          let composedPath = e.composedPath;
          let composedPathArr;
          try {
            if (isTest()) {
              composedPath = void 0;
            }
            composedPathArr = (composedPath == null ? void 0 : composedPath()) || [];
          } catch (e2) {
            composedPathArr = [];
          }
          if (element && element !== target && (composedPath ? !composedPathArr.includes(element) : !element.contains(target))) {
            callback(e);
          }
        };
        const handleKeyUp = (e) => {
          if (e.key.toLowerCase() === "escape") {
            callback(e);
          }
        };
        let active = true;
        setTimeout(() => {
          if (active) {
            window.addEventListener("click", handleClick);
            if (isWithKeyEsc) {
              window.addEventListener("keyup", handleKeyUp);
            }
          }
        }, 0);
        return () => {
          active = false;
          window.removeEventListener("click", handleClick);
          if (isWithKeyEsc) {
            window.removeEventListener("keyup", handleKeyUp);
          }
        };
      }, [ref, callback, isWithKeyEsc]);
    };
  }
});
var SAFETY_ANIMATION_DURATION_UPDATE_TIME, useChartStates;
var init_useChartStates = __esm({
  "src/hooks/useChartStates.ts"() {
    init_useClickOutside();
    init_useIsMounted();
    init_useIsomorphicLayoutEffect();
    SAFETY_ANIMATION_DURATION_UPDATE_TIME = 100;
    useChartStates = (props) => {
      const { animationSpeed: animationSpeedProp } = props;
      const chartRef = React6.useRef(null);
      const isMounted = useIsMounted();
      const [selectedState, setSelected] = React6.useState(null);
      const [mouseDownSegment, setMouseDownSegment] = React6.useState(null);
      const [focusedSegment, setFocusedSegment] = React6.useState(null);
      const [hoveredSegment, setHoveredSegment] = React6.useState(null);
      const [animationDuration, setAnimationDuration] = React6.useState(0);
      const handleClearSelects = React6.useCallback(() => {
        if (focusedSegment) {
          setFocusedSegment(null);
        }
        if (selectedState) {
          setSelected(null);
        }
      }, [focusedSegment, selectedState, setFocusedSegment, setSelected]);
      const updateStateValue = React6.useCallback(
        (p) => {
          const { setter, value } = p;
          if (isMounted()) {
            setter(value);
          }
        },
        [isMounted]
      );
      useClickOutside({
        callback: handleClearSelects,
        isWithKeyEsc: true,
        ref: chartRef
      });
      useIsomorphicLayoutEffect(() => {
        if (typeof animationSpeedProp === "number" && animationDuration !== animationSpeedProp) {
          const timeout = setTimeout(() => {
            updateStateValue({
              setter: setAnimationDuration,
              value: animationSpeedProp
            });
          }, SAFETY_ANIMATION_DURATION_UPDATE_TIME);
          return () => {
            clearTimeout(timeout);
          };
        }
        return void 0;
      }, [animationDuration, animationSpeedProp, updateStateValue]);
      return {
        animationDuration,
        chartRef,
        focusedSegment,
        handleClearSelects,
        hoveredSegment,
        mouseDownSegment,
        selectedState,
        setAnimationDuration: (value) => updateStateValue({
          setter: setAnimationDuration,
          value
        }),
        setFocusedSegment: (value) => updateStateValue({
          setter: setFocusedSegment,
          value
        }),
        setHoveredSegment: (value) => updateStateValue({
          setter: setHoveredSegment,
          value
        }),
        setMouseDownSegment: (value) => updateStateValue({
          setter: setMouseDownSegment,
          value
        }),
        setSelected: (value) => updateStateValue({
          setter: setSelected,
          value
        })
      };
    };
  }
});

// src/utils/string.ts
var lowerCaseFirstLetter;
var init_string = __esm({
  "src/utils/string.ts"() {
    init_console();
    lowerCaseFirstLetter = (str) => {
      if (!str || typeof str !== "string") {
        consoleError(
          createErrorWithDescription({
            messageMain: `
    Something went wrong while working with strings...
    And seems like it's an INTERNAL LIBRARY error.
    `,
            report: `
    Error in: "lowerCaseFirstLetter" function
    Received str: ${str}
    `
          })
        );
        return "";
      }
      return str.charAt(0).toUpperCase() + str.slice(1);
    };
  }
});
var INVALID_DATA_DEFAULT_ERROR, checkPropsErrors;
var init_checkPropsErrors = __esm({
  "src/utils/checkPropsErrors.ts"() {
    init_console();
    init_env();
    init_string();
    INVALID_DATA_DEFAULT_ERROR = "Must be type of Array<TDataItem>";
    checkPropsErrors = (props) => {
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
        widthSegmentFocusedOutline
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
        widthSegmentFocusedOutline
      };
      const booleanUndefinedParams = {
        isScaleOnHover,
        isSelectOnClick,
        isSelectOnKeyEnterDown,
        isSelectedValueShownInCenter
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
        text
      };
      const functionUndefinedParams = {
        onSegmentClick,
        onSegmentKeyEnterDown
      };
      const objectUndefinedParams = { stylesHoveredSegment };
      const properties = [
        ...Object.entries(numberUndefinedParams).map(([key, value]) => ({
          isUndefinedPossible: true,
          name: key,
          type: "number" /* NUMBER */,
          value
        })),
        ...Object.entries(booleanUndefinedParams).map(([key, value]) => ({
          isUndefinedPossible: true,
          name: key,
          type: "boolean" /* BOOLEAN */,
          value
        })),
        ...Object.entries(stringUndefinedParams).map(([key, value]) => ({
          isUndefinedPossible: true,
          name: key,
          type: "string" /* STRING */,
          value
        })),
        ...Object.entries(functionUndefinedParams).map(([key, value]) => ({
          isUndefinedPossible: true,
          name: key,
          type: "function" /* FUNCTION */,
          value
        })),
        ...Object.entries(objectUndefinedParams).map(([key, value]) => ({
          isUndefinedPossible: true,
          name: key,
          type: "object" /* OBJECT */,
          value
        })),
        {
          condition: !!(data && Array.isArray(data)),
          err: INVALID_DATA_DEFAULT_ERROR,
          name: "data"
        }
      ];
      if (!isProduction()) {
        properties.forEach((item) => {
          const { condition, err, isUndefinedPossible, name: nameProp, type, value } = item;
          let name = nameProp;
          if (name.startsWith("color") && name !== "color") {
            name = name.slice(5);
            name = lowerCaseFirstLetter(name);
          } else if (name.startsWith("className") && name !== "className") {
            name = name.slice(9);
            name = lowerCaseFirstLetter(name);
          }
          if (err && typeof condition !== "undefined" && !condition) {
            consoleError(`Parameter "${name}" error: ${err}`);
            return;
          }
          if (typeof type !== "undefined") {
            if (isUndefinedPossible) {
              if (typeof value === "undefined") {
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
        if (children && !React6.isValidElement(children) && typeof children !== "string" && typeof children !== "number") {
          consoleError(`
      Parameter "children" error: Must be type of ReactNode | string | number
      Provided: children = ${children}
      Type: ${typeof children}
      `);
        }
        if (parentRef) {
          const parentRefError = 'Parameter "parentRef" error: invalid ref';
          if (typeof parentRef !== "object") {
            consoleError(parentRefError);
          } else {
            const isParentRefHasKeyCurrent = "current" in parentRef;
            if (!isParentRefHasKeyCurrent) {
              consoleError(parentRefError);
            } else {
              if (parentRef.current) {
                if (typeof parentRef.current !== "object") {
                  consoleError(parentRefError);
                } else {
                  const isParentRefCurrentHasKeyOffsetHeight = "offsetHeight" in parentRef.current;
                  const isParentRefCurrentHasKeyOffsetWidth = "offsetWidth" in parentRef.current;
                  if (!isParentRefCurrentHasKeyOffsetHeight || !isParentRefCurrentHasKeyOffsetWidth || typeof parentRef.current.offsetHeight !== "number" || typeof parentRef.current.offsetWidth !== "number") {
                    consoleError(parentRefError);
                  }
                }
              }
            }
          }
        }
        if (props.data && Array.isArray(props.data)) {
          props.data.forEach((item, i) => {
            const { color, id, order, value } = item;
            let dataItemId = `index of ${i}`;
            if (id && typeof id === "string") {
              dataItemId = `id: ${id}`;
            }
            const paramPrefix = `Data item [${dataItemId}] param`;
            if (typeof color !== "undefined" && typeof color !== "string") {
              consoleError(`
          ${paramPrefix} "color" error: Must be type of string
          Provided: "color" = ${color}
          Type: ${typeof color}
          `);
            }
            if (typeof id !== "undefined" && typeof id !== "string") {
              consoleError(`
          ${paramPrefix} "id" error: Must be type of string
          Provided: "id" = ${id}
          Type: ${typeof id}
          `);
            }
            if (typeof order !== "undefined" && typeof order !== "number") {
              consoleError(`
          ${paramPrefix} "order" error: Must be type of number
          Provided: "order" = ${order}
          Type: ${typeof order}
          `);
            }
            if (typeof value !== "number" && !value) {
              consoleError(`${paramPrefix} "value" error: Must be provided`);
            } else if (typeof value !== "number") {
              consoleError(`
          ${paramPrefix} "value" error: Must be type of number
          Provided: "value" = ${value}
          Type: ${typeof value}
          `);
            }
          });
        }
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
  }
});

// src/utils/getCurrentFontSize.ts
var DEFAULT_FONT_SIZE, FONT_SIZE_VALUE_CORRECTION_RATIO, getCurrentFontSize;
var init_getCurrentFontSize = __esm({
  "src/utils/getCurrentFontSize.ts"() {
    DEFAULT_FONT_SIZE = 16;
    FONT_SIZE_VALUE_CORRECTION_RATIO = 0.9;
    getCurrentFontSize = (props) => {
      const { centerSize, donutThickness, fontSize: fontSizeProp, size: sizeProp, text } = props;
      if (fontSizeProp) {
        return fontSizeProp;
      }
      if (text && sizeProp) {
        let size = centerSize || sizeProp;
        if (!centerSize && donutThickness) {
          size = size - donutThickness * 2;
        }
        return Math.floor(size / text.length * FONT_SIZE_VALUE_CORRECTION_RATIO);
      }
      return DEFAULT_FONT_SIZE;
    };
  }
});
var useChartProps;
var init_useChartProps = __esm({
  "src/hooks/useChartProps.ts"() {
    init_useHandleResize();
    init_useChartDataRemap();
    init_useChartParams();
    init_useChartSelectedSegment();
    init_useChartStates();
    init_checkPropsErrors();
    init_getCurrentFontSize();
    init_defaults();
    useChartProps = (props) => {
      const { props: properties } = props;
      const {
        animationSpeed = DEFAULT_ANIMATION_SPEED,
        ariaLabel,
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
        colorChartCenter = DEFAULT_CHART_CENTER_COLOR,
        colorSegmentFocusedOutline,
        colorSegmentsBackground,
        colorText: colorTextProp,
        data: dataProp = [],
        donutThickness: donutThicknessProp = 0,
        fontSize: fontSizeProp,
        gap = 0,
        getSegmentAriaLabel,
        hoverScaleRatio = DEFAULT_CHART_SEGMENT_SCALE_RATIO,
        isScaleOnHover = true,
        isSelectOnClick = true,
        isSelectOnKeyEnterDown = true,
        isSelectedValueShownInCenter = true,
        maxSize,
        minSize,
        stylesHoveredSegment,
        onSegmentClick,
        onSegmentKeyEnterDown,
        parentRef,
        resizeReRenderDebounceTime = DEFAULT_RESIZE_RE_RENDER_DEBOUNCE_TIME,
        selected: selectedProp,
        size: sizeProp,
        tabIndex = 0,
        text: textProp,
        widthSegmentFocusedOutline
      } = properties;
      const data = useChartDataRemap({
        data: dataProp,
        gap
      });
      const {
        animationDuration,
        chartRef,
        focusedSegment,
        handleClearSelects,
        hoveredSegment,
        mouseDownSegment,
        selectedState,
        setAnimationDuration,
        setFocusedSegment,
        setHoveredSegment,
        setMouseDownSegment,
        setSelected
      } = useChartStates({ animationSpeed });
      const selected = useChartSelectedSegment({
        data,
        focusedSegment,
        isSelectedValueShownInCenter,
        selected: selectedProp || selectedState
      });
      const { size } = useHandleResize({
        animationDuration,
        maxSize,
        minSize,
        parentRef,
        resizeReRenderDebounceTime,
        setAnimationDuration,
        size: sizeProp
      });
      const strokeWidth = React6.useMemo(() => {
        if (widthSegmentFocusedOutline) {
          return widthSegmentFocusedOutline;
        }
        return size * DEFAULT_FOCUSED_SEGMENT_STROKE_WIDTH_TO_SIZE_RATIO;
      }, [size, widthSegmentFocusedOutline]);
      const { centerSize, colorText, donutThickness, radius, segmentsStyles, text, totalDataValue, viewBox } = useChartParams({
        animationDuration,
        chartCenterSize,
        colorChartBackground,
        colorChartCenter,
        colorText: colorTextProp,
        data,
        donutThickness: donutThicknessProp,
        gap,
        isSelectedValueShownInCenter,
        selected,
        size,
        text: textProp
      });
      const fontSize = React6.useMemo(
        () => getCurrentFontSize({
          centerSize,
          donutThickness,
          fontSize: fontSizeProp,
          size,
          text
        }),
        [centerSize, donutThickness, fontSizeProp, size, text]
      );
      React6.useEffect(() => {
        checkPropsErrors(properties);
      }, [properties]);
      return {
        ariaLabel,
        centerSize,
        chartRef,
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
        focusedSegment,
        fontSize,
        gap,
        getSegmentAriaLabel,
        handleClearSelects,
        hoverScaleRatio,
        hoveredSegment,
        isScaleOnHover,
        isSelectOnClick,
        isSelectOnKeyEnterDown,
        minSize,
        mouseDownSegment,
        onSegmentClick,
        onSegmentKeyEnterDown,
        radius,
        segmentsStyles,
        selected: selected == null ? void 0 : selected.id,
        setFocusedSegment,
        setHoveredSegment,
        setMouseDownSegment,
        setSelected,
        size,
        strokeWidth,
        stylesHoveredSegment,
        tabIndex,
        text,
        totalDataValue,
        viewBox
      };
    };
  }
});
var TEST_DATA_ID_CHART_SVG_MAIN, DEFAULT_CHART_ARIA_LABEL, PieDonutChart;
var init_PieDonutChart = __esm({
  "src/components/PieDonutChart.tsx"() {
    init_Chart();
    init_ChartBackground();
    init_ChartCenter();
    init_ChartSegmentsBackground();
    init_ChartText();
    init_useChartProps();
    TEST_DATA_ID_CHART_SVG_MAIN = "TEST_DATA_ID_CHART_SVG_MAIN";
    DEFAULT_CHART_ARIA_LABEL = "Pie donut chart";
    PieDonutChart = (props) => {
      const _a = props, { classNames: classNamesProp, colors: colorsProp } = _a, rest = __objRest(_a, ["classNames", "colors"]);
      const classNames = {
        classNameChartBackground: classNamesProp == null ? void 0 : classNamesProp.chartBackground,
        classNameChartCenter: classNamesProp == null ? void 0 : classNamesProp.chartCenter,
        classNameChartSegment: classNamesProp == null ? void 0 : classNamesProp.chartSegment,
        classNameChartSegmentsBackground: classNamesProp == null ? void 0 : classNamesProp.chartSegmentsBackground,
        classNameChildren: classNamesProp == null ? void 0 : classNamesProp.children,
        classNameSvgGroupSegments: classNamesProp == null ? void 0 : classNamesProp.svgGroupSegments,
        classNameSvgGroupSegmentsBackground: classNamesProp == null ? void 0 : classNamesProp.svgGroupSegmentsBackground,
        classNameSvgGroupText: classNamesProp == null ? void 0 : classNamesProp.svgGroupText,
        classNameSvgObjectText: classNamesProp == null ? void 0 : classNamesProp.svgObjectText,
        classNameText: classNamesProp == null ? void 0 : classNamesProp.text
      };
      const colors = {
        colorChartBackground: colorsProp == null ? void 0 : colorsProp.chartBackground,
        colorChartCenter: colorsProp == null ? void 0 : colorsProp.chartCenter,
        colorSegmentFocusedOutline: colorsProp == null ? void 0 : colorsProp.segmentFocusedOutline,
        colorSegmentsBackground: colorsProp == null ? void 0 : colorsProp.segmentsBackground,
        colorText: colorsProp == null ? void 0 : colorsProp.text
      };
      const properties = useChartProps({
        props: __spreadValues(__spreadValues(__spreadValues({}, classNames), colors), rest)
      });
      return /* @__PURE__ */ React6__default.default.createElement(
        "svg",
        {
          "aria-label": properties.ariaLabel || DEFAULT_CHART_ARIA_LABEL,
          className: properties.className,
          "data-testid": TEST_DATA_ID_CHART_SVG_MAIN,
          role: "img",
          style: {
            alignItems: "center",
            aspectRatio: "1 / 1",
            display: "flex",
            height: `${properties.size || properties.minSize || 0}px`,
            justifyContent: "center",
            overflow: "visible",
            transformOrigin: "center",
            width: `${properties.size || properties.minSize || 0}px`
          },
          viewBox: properties.viewBox
        },
        /* @__PURE__ */ React6__default.default.createElement(ChartBackground, __spreadValues({}, properties)),
        /* @__PURE__ */ React6__default.default.createElement(ChartSegmentsBackground, __spreadValues({}, properties)),
        /* @__PURE__ */ React6__default.default.createElement(Chart, __spreadValues({}, properties)),
        /* @__PURE__ */ React6__default.default.createElement(ChartCenter, __spreadValues({}, properties)),
        /* @__PURE__ */ React6__default.default.createElement(ChartText, __spreadValues({}, properties), properties.children)
      );
    };
  }
});

// src/index.ts
var require_src = __commonJS({
  "src/index.ts"(exports, module) {
    init_PieDonutChart();
    module.exports = PieDonutChart;
  }
});
var index = require_src();

module.exports = index;
