/**
 * *****************************************************************************
 * *****************************************************************************
 *
 * MIT License
 *
 * Copyright (c) 2022 Garvae
 *
 * Author repo: https://github.com/garvae
 * Author email: vgarvae@gmail.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * *****************************************************************************
 * *****************************************************************************
 */

'use strict';

var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);



function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

/**
 * Converts segment percentage to angle degrees
 * @function convertPercentToDegrees
 * @param { TConvertPercentToDegrees } props
 * @returns { number } angle degrees
 */
const convertPercentToDegrees = (props) => {
    const { percent } = props;
    if (typeof percent !== 'number') {
        return 0;
    }
    return percent / 100 * 360;
};

/**
 * Original ENV
 */
process.env;
/**
 * Defines the current environment type (client or server)
 */
const isClient = () => window && typeof window === 'object';
/**
 * Defines the current environment type (development or production)
 */
const isProduction = () => process.env.NODE_ENV === 'production';
/**
 * Defines if the current environment type is "test"
 */
const isTest = () => !isProduction() && process.env.NODE_ENV === 'test';

const alignConsoleTextLeftDefaultErr = `
Something went wrong while working with strings...
And seems like it's an INTERNAL LIBRARY error.

Error in: "lowerCaseFirstLetter" function
`;
const alignConsoleTextLeft = (text) => {
    if (!text || typeof text !== 'string') {
        if (!isProduction()) {
            // eslint-disable-next-line no-console
            console.error([alignConsoleTextLeftDefaultErr, `Received text: ${text}`].join('\n\n'));
        }
        return '';
    }
    return text.replaceAll('  ', '');
};
const defaultReportLinkMessage = `
If you see this error and are sure that all properties passed to the "PieDonutChart" component are valid, 
please open an issue here: https://github.com/garvae/react-pie-donut-chart.
`;
const createErrorWithDescription = (props) => {
    const { messageMain, report: reportProp, } = props;
    const title = '😢 😢 😢 Sorry, but something went wrong while calculating the chart params.';
    const hint = `
Please check:
1. All necessary and valid properties are passed to the "PieDonutChart" component
2. No other errors are displayed in the console

${defaultReportLinkMessage}
`;
    const report = [title];
    if (messageMain && typeof messageMain === 'string') {
        report.push(messageMain);
    }
    report.push(hint);
    if (reportProp && typeof reportProp === 'string') {
        report.push(`
* * * * * * *
If want to open an issue please include the information below in the bug report.

${reportProp}
* * * * * * *
`);
    }
    return report.join('\n\n');
};
const defaultConsolePs = `
- - - - - - - - - - -
P.S. This message will not be shown in the 'production' mode.
`;
/**
 * Manages errors showing in "development" and "production" mods
 * @function { (err: string) => void } consoleError
 * @param { string } err - error to show in console
 */
const consoleError = (err) => {
    if (!isProduction()) {
        // eslint-disable-next-line no-console
        console.error(alignConsoleTextLeft(`
    ${err}
    
    ${defaultConsolePs}
    `));
    }
};
/**
 * Manages warnings showing in "development" and "production" mods
 * @function { (warn: string) => void } consoleWarn
 * @param { string } warn - warning to show in console
 */
const consoleWarn = (warn) => {
    if (!isProduction()) {
        // eslint-disable-next-line no-console
        console.warn(alignConsoleTextLeft(`
    ${warn}
    
    ${defaultConsolePs}
    `));
    }
};

/**
 * Checks the validness of incoming params
 * @function checkIncomingValues
 * @param { TCreateChartSegmentPathDraw } props
 */
const checkIncomingValues = (props) => {
    const { radiusInner, radiusOuter, size, valueSegment, valueSegmentsPreviousTotal, valueSegmentsTotal, } = props;
    const isNotValid = isNaN(valueSegment)
        || isNaN(valueSegmentsPreviousTotal)
        || isNaN(size)
        || isNaN(valueSegmentsTotal)
        || isNaN(radiusOuter)
        || isNaN(radiusInner)
        || valueSegment > valueSegmentsTotal
        || valueSegmentsPreviousTotal > valueSegmentsTotal
        || radiusOuter > size
        || radiusInner > size
        || radiusInner > radiusOuter;
    if (isNotValid) {
        consoleError(createErrorWithDescription({
            messageMain: 'In most cases, this error is caused by invalid props.',
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
      `,
        }));
        return false;
    }
    return true;
};

/**
 * Converts incoming params to the point coordinates
 * @function { (props: TGetStartPointCoords): string } getPointCoords
 * @param { TGetStartPointCoords } props
 * @return { string } coords 'x y'
 */
const getPointCoords = (props) => {
    const { angleDegrees, radius, size, } = props;
    const halfSize = size / 2;
    const x = radius * Math.cos((angleDegrees * Math.PI) / 180) + halfSize;
    const y = -radius * Math.sin((angleDegrees * Math.PI) / 180) + halfSize;
    return `${x} ${y}`;
};

/**
 * Calculates chart segment path
 * @function createSvgCommandsString
 * @param { TCreateSvgCommandsString } props
 * @return { string } path
 */
const createSvgCommandsString = (props) => {
    const { angleDegrees, radiusInner, radiusOuter, size, } = props;
    /**
     * Here we determine which way the arc will be formed to the point - along a short or long one.
     */
    const longPathFlag = angleDegrees > 180 ? 1 : 0;
    const sizeHalf = size / 2;
    const commandM1 = `M ${sizeHalf + radiusOuter} ${sizeHalf}`;
    const coordsPointCommandA1 = getPointCoords({
        angleDegrees,
        radius: radiusOuter,
        size,
    });
    const commandA1 = `A ${radiusOuter} ${radiusOuter} 0 ${longPathFlag} 0 ${coordsPointCommandA1}`;
    const coordsPointCommandL1 = getPointCoords({
        angleDegrees,
        radius: radiusInner,
        size,
    });
    const commandL1 = `L ${coordsPointCommandL1}`;
    const commandA2 = `A ${radiusInner} ${radiusInner} 0 ${longPathFlag} 1 ${sizeHalf + radiusInner} ${sizeHalf}`;
    const coordsPointCommandL2 = getPointCoords({
        angleDegrees: 0,
        radius: radiusOuter,
        size,
    });
    const commandL2 = `L ${coordsPointCommandL2}`;
    return [
        commandM1,
        commandA1,
        commandL1,
        commandA2,
        commandL2,
    ].join(' ');
};

/**
 * Prepares data for the chart segment path calculations
 * @function createChartSegmentPathDraw
 * @param { TCreateChartSegmentPathDraw } props
 * @return { string } path
 */
const createChartSegmentPathDraw = (props) => {
    const { radiusInner, radiusOuter, size, valueSegment, valueSegmentsPreviousTotal, valueSegmentsTotal, } = props;
    if (!checkIncomingValues(props)) {
        return '';
    }
    /**
     * proportion of previous segments
     */
    const ratioPrev = valueSegmentsPreviousTotal / valueSegmentsTotal;
    /**
     * proportion of the current segment to total chart
     */
    const ratioCurrent = valueSegment / valueSegmentsTotal;
    /**
     * start angle of the current segment
     */
    const angleStartDegrees = 360 * ratioPrev;
    /**
     * end angle of the current segment
     */
    const angleEndDegrees = 360 * (ratioPrev + ratioCurrent);
    /**
     * angle of the current segment
     */
    const angleDegrees = angleEndDegrees - angleStartDegrees;
    return createSvgCommandsString({
        angleDegrees,
        radiusInner,
        radiusOuter,
        size,
    });
};

/**
 * Defines is current event is fired by the "enter" key press or not
 * @function { (e: React.KeyboardEvent) => boolean } isKeyDownEnter
 * @param { React.KeyboardEvent } e - KeyboardEvent
 * @return { boolean } - is current event is fired by the "enter" key press
 */
const isKeyDownEnter = (e) => {
    var _a, _b, _c, _d;
    return ((_b = (_a = e.code) === null || _a === void 0 ? void 0 : _a.toLowerCase) === null || _b === void 0 ? void 0 : _b.call(_a)) === 'enter' ||
        (e.code && String(e.code) === '13') ||
        (e.key && String(e.key) === '13') ||
        ((_d = (_c = e.key) === null || _c === void 0 ? void 0 : _c.toLowerCase) === null || _d === void 0 ? void 0 : _d.call(_c)) === 'enter';
};

const DEFAULT_SANITISE_NUMBER_VALUE = 0;
/**
 * Sanitizes number
 * @function { (e: React.KeyboardEvent) => boolean } isKeyDownEnter
 * @param { number } n                 - number to sanitize
 * @param { number = 0 } defaultNumber - default number
 * @return { number } - sanitized number
 */
const sanitizeNumber = (n, defaultNumber = DEFAULT_SANITISE_NUMBER_VALUE) => {
    if (isNaN(n)) {
        consoleError(createErrorWithDescription({
            messageMain: 'In most cases, this error is caused by invalid props.',
            report: `
      Error in: "sanitizeNumber" function
      Received value: ${n}
      `,
        }));
        return defaultNumber;
    }
    return n;
};

/** correction ratio when passed only one data item */
const SINGLE_VALUE_CORRECTION_RATIO = 0.99999999;
/** default focused segment stroke width to size ratio */
const DEFAULT_FOCUSED_SEGMENT_STROKE_WIDTH_TO_SIZE_RATIO = 0.0066;
/** default outline color of focused segment */
const DEFAULT_COLOR_SEGMENT_FOCUSED_OUTLINE = '#287bc8';
/** default chart center color */
const DEFAULT_CHART_CENTER_COLOR = '#ffffff';
/** default chart text color */
const DEFAULT_CHART_TEXT_COLOR = '#333333';
/** default chart segment scale ratio */
const DEFAULT_CHART_SEGMENT_SCALE_RATIO = 1.05;
/** default resize re render debounce time */
const DEFAULT_RESIZE_RE_RENDER_DEBOUNCE_TIME = 0 /* ms */;
/** default animation speed */
const DEFAULT_ANIMATION_SPEED = 200 /* ms */;

/** segment offset correction angle */
const SEGMENT_OFFSET_CORRECTION_ANGLE = 90;
const TEST_DATA_ID_CHART_GROUP_SEGMENTS = 'TEST_DATA_ID_CHART_GROUP_SEGMENTS';
const TEST_DATA_ID_CHART_GROUP_SEGMENT = 'TEST_DATA_ID_CHART_GROUP_SEGMENT';
const TEST_DATA_ATTR_CHART_GROUP_SEGMENT_ID = 'data-test-id';
const TEST_DATA_ATTR_CHART_GROUP_SEGMENT_GAP = 'data-test-gap';
const TEST_DATA_ATTR_CHART_GROUP_SEGMENT_THICKNESS = 'data-test-thickness';
const TEST_DATA_ATTR_CHART_GROUP_SEGMENT_SELECTED = 'data-test-selected';
/**
 * Main chart component
 * @component Chart
 * @param { TChartProps } props
 * @returns { JSX.Element } returns svg group <g> of <path> (segments)
 */
const Chart = (props) => {
    const { chartRef, classNameChartSegment, classNameSvgGroupSegments, colorSegmentFocusedOutline, data, donutThickness, focusedSegment, gap, handleClearSelects, hoverScaleRatio, hoveredSegment, isScaleOnHover, isSelectOnClick, isSelectOnKeyEnterDown, mouseDownSegment, onSegmentClick, onSegmentKeyEnterDown, radius, segmentsStyles, selected, setFocusedSegment, setHoveredSegment, setMouseDownSegment, setSelected, size, strokeWidth, stylesHoveredSegment, tabIndex, totalDataValue, } = props;
    if (!data.length) {
        return null;
    }
    return (React__default["default"].createElement("g", { className: classNameSvgGroupSegments, "data-testid": TEST_DATA_ID_CHART_GROUP_SEGMENTS, onBlurCapture: handleClearSelects, onMouseLeave: () => {
            if (hoveredSegment) {
                setHoveredSegment(null);
            }
        }, ref: chartRef }, data.map((item, i) => {
        var _a;
        /**
         * if current segment is a gap
         */
        const isGapSegment = !!gap && i % 2 !== 0;
        const { color, id, value: valueParam, } = item;
        let value = valueParam;
        /**
         * correction when only one item in data
         */
        if (data.length === 1) {
            value = value * SINGLE_VALUE_CORRECTION_RATIO;
        }
        /**
         * the sum of previous segments values
         */
        const prevTotal = ((_a = data === null || data === void 0 ? void 0 : data.filter((_, index) => index < i)) === null || _a === void 0 ? void 0 : _a.reduce((c, n) => c + n.value, 0)) || 0;
        /**
         * the proportion of previous segments
         */
        const prevTotalPercentage = sanitizeNumber(prevTotal) / sanitizeNumber(totalDataValue, 1) * 100;
        /**
         * the proportion of the current segment
         */
        const currentPercentage = sanitizeNumber(value) / sanitizeNumber(totalDataValue, 1) * 100;
        /**
         * the offset of the current segment
         * + corrections depends on index and svg rotation
         */
        let segmentOffset = convertPercentToDegrees({ percent: currentPercentage }) - SEGMENT_OFFSET_CORRECTION_ANGLE;
        if (i !== 0) {
            segmentOffset = segmentOffset + convertPercentToDegrees({ percent: prevTotalPercentage });
        }
        /**
         * is current segment selected
         */
        const isSelected = selected === id;
        /**
         * is current segment hovered
         */
        const isHovered = hoveredSegment === id;
        /**
         * is current segment focused
         */
        const isFocused = focusedSegment === id;
        /**
         * is mouse down on current segment
         */
        const isMouseDown = mouseDownSegment === id;
        /**
         * the 'transform' of the current segment
         */
        let transform = `rotate(${segmentOffset}deg) scale(1)`;
        if (!isGapSegment && (isSelected || isFocused || (isScaleOnHover && isHovered))) {
            transform = `rotate(${segmentOffset}deg) scale(${hoverScaleRatio})`;
        }
        /**
         * className
         */
        const classNameSegmentDefault = 'PieDonutChart__segment';
        const classNameSegment = classNameChartSegment
            ? `${classNameSegmentDefault} ${classNameChartSegment}`
            : classNameSegmentDefault;
        /**
         * stroke on focus
         */
        let stroke = undefined;
        if (!isGapSegment && isFocused && !isMouseDown) {
            stroke = colorSegmentFocusedOutline || DEFAULT_COLOR_SEGMENT_FOCUSED_OUTLINE;
        }
        /**
         * create the segment path
         */
        const segmentPath = createChartSegmentPathDraw({
            radiusInner: donutThickness ? radius - donutThickness : 0,
            radiusOuter: radius,
            size,
            valueSegment: value,
            valueSegmentsPreviousTotal: prevTotal,
            valueSegmentsTotal: totalDataValue,
        });
        /**
         * Tests attributes (gap segments)
         */
        const testsAttributesGap = { [TEST_DATA_ATTR_CHART_GROUP_SEGMENT_GAP]: gap };
        /**
         * Tests attributes
         */
        const testsAttributes = Object.assign({ [TEST_DATA_ATTR_CHART_GROUP_SEGMENT_ID]: id, [TEST_DATA_ATTR_CHART_GROUP_SEGMENT_SELECTED]: isSelected, [TEST_DATA_ATTR_CHART_GROUP_SEGMENT_THICKNESS]: donutThickness }, (isGapSegment ? testsAttributesGap : {}));
        return (React__default["default"].createElement("path", Object.assign({}, testsAttributes, { className: classNameSegment, d: segmentPath, "data-testid": TEST_DATA_ID_CHART_GROUP_SEGMENT, fill: color, key: `chart-segment-${id}`, onClick: () => {
                if (isGapSegment) {
                    return;
                }
                if (isSelectOnClick && selected !== id) {
                    setSelected(id);
                }
                onSegmentClick === null || onSegmentClick === void 0 ? void 0 : onSegmentClick(id);
            }, onFocus: () => {
                if (isGapSegment) {
                    return;
                }
                if (focusedSegment !== id) {
                    setFocusedSegment(id);
                }
            }, onKeyDownCapture: e => {
                if (isGapSegment) {
                    return;
                }
                /**
                 * fires only if key === 'enter'
                 */
                if (isKeyDownEnter(e)) {
                    if (isSelectOnKeyEnterDown && selected !== id) {
                        setSelected(id);
                    }
                    onSegmentKeyEnterDown === null || onSegmentKeyEnterDown === void 0 ? void 0 : onSegmentKeyEnterDown(id);
                }
            }, onMouseDown: () => {
                if (isGapSegment) {
                    return;
                }
                if (mouseDownSegment !== id) {
                    setMouseDownSegment(id);
                }
            }, onMouseOverCapture: () => {
                if (isGapSegment) {
                    return;
                }
                if (hoveredSegment !== id) {
                    setHoveredSegment(id);
                }
            }, onMouseUp: e => {
                if (isGapSegment) {
                    return;
                }
                setMouseDownSegment(null);
                e.currentTarget.blur();
            }, stroke: stroke, strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: isGapSegment ? 0 : strokeWidth, style: Object.assign(Object.assign(Object.assign({}, segmentsStyles), { cursor: isGapSegment ? 'initial' : 'pointer', outline: 'none', transform, transitionProperty: 'all' }), (!isGapSegment && isHovered && stylesHoveredSegment ? stylesHoveredSegment : {})), tabIndex: isGapSegment ? -1 : tabIndex })));
    })));
};

const TEST_DATA_ID_CHART_BACKGROUND = 'TEST_DATA_ID_CHART_BACKGROUND';
/**
 * Chart's background
 * @component ChartBackground
 * @param { TChartBackground } props
 * @returns { JSX.Element } returns svg circle <circle>
 */
const ChartBackground = props => {
    const { classNameChartBackground, colorChartBackground, radius, } = props;
    if (!colorChartBackground) {
        return null;
    }
    return (React__default["default"].createElement("circle", { className: classNameChartBackground, cx: radius, cy: radius, "data-testid": TEST_DATA_ID_CHART_BACKGROUND, fill: colorChartBackground, r: radius, style: { pointerEvents: 'none' } }));
};

const TEST_DATA_ID_CHART_CENTER = 'TEST_DATA_ID_CHART_CENTER';
/**
 * Chart's center ("donut hole")
 * @component ChartCenter
 * @param { TChartCenter } props
 * @returns { JSX.Element } returns svg circle <circle>
 */
const ChartCenter = props => {
    const { centerSize, classNameChartCenter, colorChartCenter, radius, } = props;
    if (!centerSize) {
        return null;
    }
    return (React__default["default"].createElement("circle", { className: classNameChartCenter, cx: radius, cy: radius, "data-testid": TEST_DATA_ID_CHART_CENTER, fill: colorChartCenter, r: centerSize / 2, style: { pointerEvents: 'none' } }));
};

const TEST_DATA_ID_CHART_SEGMENTS_BACKGROUND = 'TEST_DATA_ID_CHART_SEGMENTS_BACKGROUND';
/**
 * Chart segments background. Same shape as chart's segments but without gap.
 * @component ChartSegmentsBackground
 * @param { TChartSegmentsBackground } props
 * @returns { JSX.Element } returns svg group <g> of <path>
 */
const ChartSegmentsBackground = props => {
    const { classNameChartSegmentsBackground, classNameSvgGroupSegmentsBackground, colorSegmentsBackground, donutThickness, radius, } = props;
    if (!colorSegmentsBackground) {
        return null;
    }
    return (React__default["default"].createElement("g", { className: classNameSvgGroupSegmentsBackground },
        React__default["default"].createElement("circle", { className: classNameChartSegmentsBackground, cx: radius, cy: radius, "data-testid": TEST_DATA_ID_CHART_SEGMENTS_BACKGROUND, fill: "none", r: donutThickness ? radius - donutThickness / 2 : 0, stroke: colorSegmentsBackground, strokeWidth: donutThickness, style: { pointerEvents: 'none' } })));
};

const TEST_DATA_ID_CHART_TEXT_FOREIGN_OBJECT = 'TEST_DATA_ID_CHART_TEXT_FOREIGN_OBJECT';
/**
 * Chart's "text" or (and) "children"
 * @component ChartText
 * @param { TChartText } props
 * @returns { JSX.Element } returns svg group <g> of <foreignObject> which contains passed "text" or (and) "children"
 */
const ChartText = props => {
    const { children, classNameChildren, classNameSvgGroupText, classNameSvgObjectText, classNameText, colorText, fontSize, size, text, } = props;
    if (!text && !children) {
        return null;
    }
    return (React__default["default"].createElement("g", { className: classNameSvgGroupText, style: { pointerEvents: 'none' } },
        React__default["default"].createElement("foreignObject", { className: classNameSvgObjectText, "data-testid": TEST_DATA_ID_CHART_TEXT_FOREIGN_OBJECT, height: size, style: { position: 'relative' }, width: size, x: "0", y: "0" },
            text && (React__default["default"].createElement("div", { className: classNameText, style: {
                    alignItems: 'center',
                    color: colorText,
                    display: 'flex',
                    fontSize: `${fontSize}px`,
                    height: '100%',
                    justifyContent: 'center',
                    position: 'absolute',
                    transition: 'font-size .3s, color .3s',
                    width: '100%',
                } }, text)),
            children && (React__default["default"].createElement("div", { className: classNameChildren, style: {
                    display: 'flex',
                    height: '100%',
                    position: 'absolute',
                    width: '100%',
                } }, children)))));
};

/**
 * Resize handler
 * Checks if new size is can be calculated, if it's valid when calculated
 * and fires callback when new valid size calculated
 */
const resizeHandler = (props) => {
    const { maxSize, minSize, parentRef, size, updateSize, } = props;
    const { offsetHeight, offsetWidth, } = (parentRef === null || parentRef === void 0 ? void 0 : parentRef.current) || {};
    const h = offsetHeight || size;
    const w = offsetWidth || size;
    if (typeof h !== 'number' || typeof w !== 'number') {
        return;
    }
    let s = 0;
    if (h === w && w > 0) {
        s = h;
    }
    else if (h > 0 && w > 0) {
        s = h > w ? w : h;
    }
    else if (h && h > 0) {
        s = h;
    }
    else if (w && w > 0) {
        s = w;
    }
    if (s) {
        if (minSize && (minSize >= s)) {
            updateSize(minSize);
        }
        else if (maxSize && (maxSize <= s)) {
            updateSize(maxSize);
        }
        else {
            updateSize(s);
        }
    }
    else if (minSize) {
        updateSize(minSize);
    }
    else {
        updateSize(0);
    }
};

const processResizeMutationDefaultErrText = 'Error while processing "processResizeMutation" function:';
const processResizeMutationNoMutationsErrText = 'No mutations received';
const processResizeMutationElNotFoundErrText = 'Node element is not found in the received mutation';
const processResizeMutationElInvalidErrText = `
Received mutation has invalid Node element.
Node element has invalid "clientWidth" or "clientHeight" param (or both)
`;
const processResizeMutationNoChangesErrText = 'Received mutation has no changes';
/**
 * Mutations calls subscription processing
 * @param {MutationRecord[]} mutations
 */
const processResizeMutation = (mutations) => {
    var _a;
    if (!(mutations === null || mutations === void 0 ? void 0 : mutations.length) || (mutations && !Array.isArray(mutations))) {
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
    if (typeof w !== 'number' || typeof h !== 'number') {
        if (isTest()) {
            consoleError(`
        ${processResizeMutationDefaultErrText}
        ${processResizeMutationElInvalidErrText}
      `);
        }
        return;
    }
    const isChange = mutations
        .find(m => {
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
    const event = new CustomEvent(CUSTOM_NODE_EVENT_NAME_RESIZE, { detail: {
            height: h,
            width: w,
        } });
    (_a = el.dispatchEvent) === null || _a === void 0 ? void 0 : _a.call(el, event);
};

/**
 * Custom node event name
 */
const CUSTOM_NODE_EVENT_NAME_RESIZE = 'resize';
/**
 * Inspired by: https://stackoverflow.com/a/46555778/14140292
 *
 * @param {TResizeListener} props
 * @function useResizeListener (hook)
 */
const startResizeListener = (props) => {
    const { cb, node, } = props;
    /**
     * Custom mutation calls subscription
     */
    const observer = new MutationObserver(processResizeMutation);
    if (node === null || node === void 0 ? void 0 : node.nodeName) {
        observer.observe(node, {
            attributeFilter: ['style'],
            attributeOldValue: true,
            attributes: true,
        });
        node.addEventListener('resize', cb);
    }
};

/**
 * Hook allows you to determine if the component is in the DOM or the component is already unmounted
 * @function useIsMounted (hook)
 * @return { TUseIsMountedReturn } - returns function that returns a boolean value
 */
const useIsMounted = () => {
    const ref = React.useRef(false);
    React.useEffect(() => {
        ref.current = true;
        return () => {
            ref.current = false;
        };
    }, []);
    return React.useCallback(() => {
        /**
         * It's safer for tests. I think so =)
         */
        if (isTest()) {
            return true;
        }
        return ref.current;
    }, [ref]);
};

/**
 * Debounce passed callback
 * @function { (cb: (...args: T) => void, wait: number): (...args: T) => void } debounce
 *
 * @typeParam T - Type of params passed to the callback arguments
 * @param { string } cb - callback to debounce
 * @param { number } wait - debounce time
 *
 * @return debounce passed callback;
 *
 * @example
 * ```
 * const debouncedFunction = debounce(() => {
 *    // some code to debounce
 * }, 50);
 * ```
 */
const debounce = (cb, wait) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        return new Promise(resolve => {
            timer = setTimeout(() => resolve(cb(...args)), wait);
        });
    };
};

/**
 * Hook manages chart size param.
 * This hook listens for window or chart's container "resize" events,
 * and incoming chart's size props (maxSize, minSize, etc...) changes
 * @function useHandleResize (hook)
 * @param { TUseHandleResize } props
 * @return { TUseHandleResizeReturn } - current chart's params (size)
 */
const useHandleResize = (props) => {
    const { animationDuration, maxSize, minSize, parentRef, resizeReRenderDebounceTime, setAnimationDuration, size: sizeProp, } = props;
    const isMounted = useIsMounted();
    const [size, setSize] = React.useState(0);
    const [parentRefCurrent, setParentRefCurrent] = React.useState(null);
    const processUpdate = React.useCallback((newSize) => {
        if (isMounted()) {
            /**
             * Freezes animation to prevent unnecessary animation bugs while resize.
             * It will be restored automatically
             */
            if (animationDuration !== 0) {
                setAnimationDuration(0);
            }
            setSize(newSize);
        }
    }, [
        animationDuration,
        isMounted,
        setAnimationDuration,
    ]);
    /**
     * debounced size updater
     */
    const updateSizeDebounced = debounce((newSize) => {
        if (newSize !== size && isMounted()) {
            processUpdate(newSize);
        }
    }, resizeReRenderDebounceTime);
    /**
     * updates size
     */
    const updateSize = React.useCallback((newSize) => {
        const n = sanitizeNumber(newSize, size);
        if (resizeReRenderDebounceTime === 0) {
            processUpdate(newSize);
        }
        else {
            updateSizeDebounced(n);
        }
    }, [
        processUpdate,
        resizeReRenderDebounceTime,
        size,
        updateSizeDebounced,
    ]);
    /**
     * resize handler
     */
    const handleResize = React.useCallback(() => resizeHandler({
        maxSize,
        minSize,
        parentRef,
        size: sizeProp,
        updateSize,
    }), [
        maxSize,
        minSize,
        parentRef,
        sizeProp,
        updateSize,
    ]);
    /**
     * useResizeListener callback
     */
    /**
     * listens for the 'resize' custom event on the parent container
     */
    React.useLayoutEffect(() => {
        startResizeListener({
            cb: handleResize,
            node: (parentRef === null || parentRef === void 0 ? void 0 : parentRef.current) || null,
        });
    }, [handleResize, parentRef]);
    /**
     * fires handleResize on window's 'resize' event
     */
    React.useLayoutEffect(() => {
        if (isClient() && !sizeProp) {
            window.addEventListener('resize', handleResize) /* re-renders svg if parent container resized */;
            return () => window.removeEventListener('resize', handleResize);
        }
        return undefined;
    }, [handleResize, sizeProp]);
    /**
     * initializes size
     */
    React.useLayoutEffect(() => {
        const isReadyForSize = (parentRef === null || parentRef === void 0 ? void 0 : parentRef.current) || sizeProp;
        if (isClient() && isReadyForSize && !size) {
            handleResize();
        }
        return undefined;
    }, [
        handleResize,
        parentRef,
        size,
        sizeProp,
    ]);
    /**
     * Listen for "parentRef" prop changes
     */
    React.useEffect(() => {
        if ((parentRef === null || parentRef === void 0 ? void 0 : parentRef.current) && parentRefCurrent !== parentRef.current) {
            setParentRefCurrent(parentRef.current);
            handleResize();
        }
    }, [
        handleResize,
        parentRef,
        parentRefCurrent,
    ]);
    /**
     * Listen for "size" prop changes
     */
    React.useEffect(() => {
        if (sizeProp && size !== sizeProp) {
            handleResize();
        }
    }, [
        handleResize,
        parentRef,
        parentRefCurrent,
        size,
        sizeProp,
    ]);
    return { size };
};

const ChanelRand = () => Math.floor(Math.random() * (256 + 1));
const rgbRand = () => [
    ChanelRand(),
    ChanelRand(),
    ChanelRand(),
];
const rgbToHex = (rgb) => ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
const colorRand = () => rgbToHex(rgbRand());
/**
 * Generates random HEX color string
 * @function { () => string } randomColorHEX
 * @return { string } returns random HEX color string
 */
const randomColorHEX = () => '#' + colorRand();

/**
 * Generates unique ID string
 * @function { (complexity?: number) => string } generateUniqueID
 * @param { number } complexity - complexity of the generated ID string
 * @return { string } unique id
 *
 * @example
 * ```
 * const id = generateUniqueID() // 'XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX'
 * const idLite = generateUniqueID(2) // 'XXXX-XXXX'
 * ```
 */
const generateUniqueID = (complexity = 8) => {
    const cmplxt = typeof complexity === 'number' && complexity > 0 ? complexity : 8;
    const chr4 = () => Math.random()
        .toString(16)
        .slice(-4);
    const newIdArr = Array(cmplxt)
        .fill(null)
        .map(chr4);
    if (newIdArr.length === 1) {
        return newIdArr[0];
    }
    return newIdArr.join('-');
};

const USE_CHART_DATA_REMAP_ERR_UNIQUE_ID_TEXT = 'It recommended to you to check provided "data" and make sure all id are unique';
const USE_CHART_DATA_REMAP_ERR_UNIQUE_ORDER_TEXT = 'Items with equal "order" params will be sorted one by another.';
/**
 * 1. checks if some fields in data items are undefined
 * 2. sorts data items
 * 3. add gaps if it's needed
 *
 * @function useChartDataRemap (hook)
 * @param { TUseChartDataRemap } props
 * @return { TDataItemRequired[] } returns "re-mapped" sorted data (with all necessary params) and fake "gap" segments (if it's needed)
 */
const useChartDataRemap = (props) => {
    const { data: dataProp, gap, } = props;
    const incomingData = React.useMemo(() => dataProp
        .map((item, i) => {
        let id = item.id;
        if (id && dataProp.filter(dataItem => dataItem.id === id).length > 1) {
            const newId = generateUniqueID();
            consoleWarn(`
        Data item #${i} param "id" error: Must be unique.
        
        Provided: "id" = ${id}
        This was caught and now one of equals "id" replaced with: "id" = ${newId}
        ${USE_CHART_DATA_REMAP_ERR_UNIQUE_ID_TEXT}
        `);
            id = newId;
        }
        const order = item.order;
        if (typeof order === 'number' && dataProp.filter(dataItem => dataItem.order === order).length > 1) {
            consoleWarn(`
        Data item #${i} param "order" error: Should be unique.
        
        Provided: "order" = ${order}
        ${USE_CHART_DATA_REMAP_ERR_UNIQUE_ORDER_TEXT}
        Just make sure the result on the chart is what you expected.
        `);
        }
        return {
            color: item.color || randomColorHEX(),
            id: id || generateUniqueID(),
            order: item.order || dataProp.length + 1 + i,
            value: item.value,
        };
    })
        .sort((a, b) => {
        if (a.order < b.order) {
            return -1;
        }
        if (a.order > b.order) {
            return 1;
        }
        return 0;
    }), [dataProp]);
    return React.useMemo(() => {
        if (!gap) {
            return incomingData;
        }
        const segments = [];
        if (gap) {
            Array(incomingData.length * 2)
                .fill(null)
                .forEach((_, i) => {
                if (i === 0) {
                    segments.push(Object.assign(Object.assign({}, incomingData[0]), { order: 0 }));
                    return;
                }
                if (i % 2 !== 0) {
                    segments.push({
                        color: 'transparent',
                        id: generateUniqueID(),
                        order: i,
                        value: gap,
                    });
                    return;
                }
                segments.push(Object.assign(Object.assign({}, incomingData[i / 2]), { order: i }));
            });
        }
        return segments;
    }, [gap, incomingData]);
};

/**
 * Listens for some incoming params changes and calculates some of current chart params
 * @function useChartParams (hook)
 * @param { TUseChartParams } props
 * @return { TUseChartParamsReturn } returns chart params (centerSize, colorText, etc...)
 */
const useChartParams = (props) => {
    const { animationDuration, chartCenterSize, colorText: colorTextProp, data, donutThickness, gap, isSelectedValueShownInCenter, selected, size, text: textProp, } = props;
    /**
     * sum of data item's values
     */
    const totalDataValue = React.useMemo(() => data.reduce((current, next) => current + next.value, 0) || 0, [data]);
    /**
     * the item with the biggest value in data
     */
    const biggestValueItem = React.useMemo(() => {
        let bvi = data[0];
        if (data.length > 1) {
            data.forEach(item => {
                if (item.value > bvi.value) {
                    bvi = item;
                }
            });
        }
        return bvi;
    }, [data]) || 0;
    /**
     * chart viewBox
     */
    const viewBox = `0 0 ${size || 0} ${size || 0}`;
    /**
     * chart radius
     */
    const radius = React.useMemo(() => sanitizeNumber(size / 2), [size]);
    /**
     * chart center circle radius
     */
    const centerSize = React.useMemo(() => {
        if (typeof chartCenterSize !== 'undefined' && typeof chartCenterSize === 'number') {
            return chartCenterSize;
        }
        if (typeof donutThickness !== 'undefined' && donutThickness && typeof donutThickness === 'number') {
            return (radius - donutThickness) * 2;
        }
        return 0;
    }, [
        chartCenterSize,
        donutThickness,
        radius,
    ]);
    const segmentsStyles = React.useMemo(() => ({
        transformOrigin: 'center',
        transition: 'ease-in-out',
        transitionDuration: `${animationDuration}ms`,
    }), [animationDuration]);
    const text = React.useMemo(() => {
        if (textProp) {
            return textProp;
        }
        if (centerSize || donutThickness) {
            if (isSelectedValueShownInCenter && selected) {
                return String(selected.value);
            }
            if (gap) {
                return String(totalDataValue - gap * data.length / 2);
            }
            return String(totalDataValue);
        }
        return '';
    }, [
        centerSize,
        data.length,
        donutThickness,
        gap,
        isSelectedValueShownInCenter,
        selected,
        textProp,
        totalDataValue,
    ]);
    /**
     * current text color
     */
    const colorText = React.useMemo(() => {
        if (colorTextProp) {
            return colorTextProp;
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
    ]);
    return {
        centerSize,
        colorText,
        donutThickness,
        radius,
        segmentsStyles,
        text,
        totalDataValue,
        viewBox,
    };
};

/**
 * Determines if there is a selected segment in chart
 * @function useChartSelectedSegment (hook)
 * @param { TUseChartSelectedSegment } props
 * @return { TDataItemRequired | null } returns chart's selected segment
 */
const useChartSelectedSegment = (props) => {
    const { data, focusedSegment, isSelectedValueShownInCenter, selected, } = props;
    return React.useMemo(() => {
        if (!data || !Array.isArray(data) || !data.length || !isSelectedValueShownInCenter || (!focusedSegment && !selected)) {
            return null;
        }
        const s = data.find(item => item.id === focusedSegment || item.id === selected);
        if (!s) {
            return null;
        }
        return s;
    }, [
        data,
        focusedSegment,
        isSelectedValueShownInCenter,
        selected,
    ]);
};

const useClickOutsideDefaultErrText = 'Error while processing "useClickOutside" hook:';
const useClickOutsideNoCbErrText = 'No callback received';
/**
 * Hook to listen for clicks outside the target component or the "escape" key press
 * @function useClickOutside (hook)
 * @param {TUseClickOutside} props
 *
 * @example
 * ```
 *  const elementRef = useRef<HTMLElement>(null);
 *  const handleClickOutside = () => {
 *     // some actions
 *  };
 *
 *  useClickOutside({
 *    callback: handleClickOutside,
 *    ref: elementRef,
 *    isWithKeyEsc: true,
 *  });
 * ```
 */
const useClickOutside = (props) => {
    const { callback, isWithKeyEsc, ref, } = props;
    React.useEffect(() => {
        if (!callback) {
            if (isTest()) {
                consoleError(`
        ${useClickOutsideDefaultErrText}
        ${useClickOutsideNoCbErrText}
      `);
            }
            return undefined;
        }
        const handleClick = (e) => {
            const element = ref.current;
            const target = e.target;
            let composedPath = e.composedPath;
            let composedPathArr;
            /**
             * This is workaround.
             * I didn't find a way to mock MouseEvent.composedPath.
             * I tried running "fireEvent.click(button, {composedPath: undefined})" but that didn't work.
             *
             * If you are reading this, and you know how to solve this - please contact me =)
             */
            try {
                if (isTest()) {
                    composedPath = undefined;
                }
                composedPathArr = (composedPath === null || composedPath === void 0 ? void 0 : composedPath()) || [];
            }
            catch (_a) {
                composedPathArr = [];
            }
            if (element &&
                element !== target &&
                (composedPath
                    ? !composedPathArr.includes(element)
                    : !element.contains(target))) {
                callback(e);
            }
        };
        const handleKeyUp = (e) => {
            if (e.key.toLowerCase() === 'escape') {
                callback(e);
            }
        };
        let active = true;
        setTimeout(() => {
            if (active) {
                window.addEventListener('click', handleClick);
                if (isWithKeyEsc) {
                    window.addEventListener('keyup', handleKeyUp);
                }
            }
        }, 0);
        return () => {
            active = false;
            window.removeEventListener('click', handleClick);
            if (isWithKeyEsc) {
                window.removeEventListener('keyup', handleKeyUp);
            }
        };
    }, [
        ref,
        callback,
        isWithKeyEsc,
    ]);
};

const SAFETY_ANIMATION_DURATION_UPDATE_TIME = 100;
/**
 * Hook manages chart states
 * @function { (props: TUseChartStates) => TUseChartStatesReturn } useChartStates (hook)
 * @param { TUseChartStates } props
 */
const useChartStates = (props) => {
    const { animationSpeed: animationSpeedProp } = props;
    const chartRef = React.useRef(null);
    const isMounted = useIsMounted();
    const [selectedState, setSelected] = React.useState(null);
    const [mouseDownSegment, setMouseDownSegment] = React.useState(null);
    const [focusedSegment, setFocusedSegment] = React.useState(null);
    const [hoveredSegment, setHoveredSegment] = React.useState(null);
    const [animationDuration, setAnimationDuration] = React.useState(0);
    const handleClearSelects = React.useCallback(() => {
        if (focusedSegment) {
            setFocusedSegment(null);
        }
        if (selectedState) {
            setSelected(null);
        }
    }, [
        focusedSegment,
        selectedState,
        setFocusedSegment,
        setSelected,
    ]);
    /**
     * Safety states update
     * @param {TUpdateStateValue} p
     */
    const updateStateValue = React.useCallback((p) => {
        const { setter, value, } = p;
        if (isMounted()) {
            setter(value);
        }
    }, [isMounted]);
    useClickOutside({
        callback: handleClearSelects,
        isWithKeyEsc: true,
        ref: chartRef,
    });
    /**
     * Safely update "animationDuration" state avoiding animation bugs
     */
    React.useLayoutEffect(() => {
        if (typeof animationSpeedProp === 'number' && animationDuration !== animationSpeedProp) {
            const timeout = setTimeout(() => {
                updateStateValue({
                    setter: setAnimationDuration,
                    value: animationSpeedProp,
                });
            }, SAFETY_ANIMATION_DURATION_UPDATE_TIME);
            return () => {
                clearTimeout(timeout);
            };
        }
        return undefined;
    }, [
        animationDuration,
        animationSpeedProp,
        updateStateValue,
    ]);
    return {
        animationDuration,
        chartRef,
        focusedSegment,
        handleClearSelects,
        hoveredSegment,
        mouseDownSegment,
        selectedState,
        setAnimationDuration: value => updateStateValue({
            setter: setAnimationDuration,
            value,
        }),
        setFocusedSegment: value => updateStateValue({
            setter: setFocusedSegment,
            value,
        }),
        setHoveredSegment: value => updateStateValue({
            setter: setHoveredSegment,
            value,
        }),
        setMouseDownSegment: value => updateStateValue({
            setter: setMouseDownSegment,
            value,
        }),
        setSelected: value => updateStateValue({
            setter: setSelected,
            value,
        }),
    };
};

const lowerCaseFirstLetter = (str) => {
    if (!str || typeof str !== 'string') {
        consoleError(createErrorWithDescription({
            messageMain: `
    Something went wrong while working with strings...
    And seems like it's an INTERNAL LIBRARY error.
    `,
            report: `
    Error in: "lowerCaseFirstLetter" function
    Received str: ${str}
    `,
        }));
        return '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const INVALID_DATA_DEFAULT_ERROR = 'Must be type of Array<TDataItem>';
var ETypeofType;
(function (ETypeofType) {
    ETypeofType["BOOLEAN"] = "boolean";
    ETypeofType["FUNCTION"] = "function";
    ETypeofType["NUMBER"] = "number";
    ETypeofType["OBJECT"] = "object";
    ETypeofType["STRING"] = "string";
})(ETypeofType || (ETypeofType = {}));
/**
 * Checks the validness of incoming params and shows to user console.error (and tips)
 * @function checkPropsErrors
 * @param { TPieDonutChartPropsInternal } props
 */
const checkPropsErrors = (props) => {
    const { animationSpeed, chartCenterSize, children, className, classNameChartBackground, classNameChartCenter, classNameChartSegment, classNameChartSegmentsBackground, classNameChildren, classNameSvgGroupSegments, classNameSvgGroupSegmentsBackground, classNameSvgGroupText, classNameSvgObjectText, classNameText, colorChartBackground, colorChartCenter, colorSegmentFocusedOutline, colorSegmentsBackground, colorText, data, donutThickness, fontSize, gap, hoverScaleRatio, isScaleOnHover, isSelectOnClick, isSelectOnKeyEnterDown, isSelectedValueShownInCenter, maxSize, minSize, onSegmentClick, onSegmentKeyEnterDown, parentRef, resizeReRenderDebounceTime, selected, size, stylesHoveredSegment, tabIndex, text, widthSegmentFocusedOutline, } = props;
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
    const properties = [
        ...Object.entries(numberUndefinedParams).map(([key, value]) => ({
            isUndefinedPossible: true,
            name: key,
            type: ETypeofType.NUMBER,
            value,
        })),
        ...Object.entries(booleanUndefinedParams).map(([key, value]) => ({
            isUndefinedPossible: true,
            name: key,
            type: ETypeofType.BOOLEAN,
            value,
        })),
        ...Object.entries(stringUndefinedParams).map(([key, value]) => ({
            isUndefinedPossible: true,
            name: key,
            type: ETypeofType.STRING,
            value,
        })),
        ...Object.entries(functionUndefinedParams).map(([key, value]) => ({
            isUndefinedPossible: true,
            name: key,
            type: ETypeofType.FUNCTION,
            value,
        })),
        ...Object.entries(objectUndefinedParams).map(([key, value]) => ({
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
            const { condition, err, isUndefinedPossible, name: nameProp, type, value, } = item;
            let name = nameProp;
            if (name.startsWith('color') && name !== 'color') {
                name = name.slice(5);
                name = lowerCaseFirstLetter(name);
            }
            else if (name.startsWith('className') && name !== 'className') {
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
        if (children && !React.isValidElement(children) && typeof children !== 'string' && typeof children !== 'number') {
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
            }
            else {
                const isParentRefHasKeyCurrent = 'current' in parentRef;
                if (!isParentRefHasKeyCurrent) {
                    consoleError(parentRefError);
                }
                else {
                    if (parentRef.current) {
                        if (typeof parentRef.current !== 'object') {
                            consoleError(parentRefError);
                        }
                        else {
                            const isParentRefCurrentHasKeyOffsetHeight = 'offsetHeight' in parentRef.current;
                            const isParentRefCurrentHasKeyOffsetWidth = 'offsetWidth' in parentRef.current;
                            if (!isParentRefCurrentHasKeyOffsetHeight
                                || !isParentRefCurrentHasKeyOffsetWidth
                                || typeof parentRef.current.offsetHeight !== 'number'
                                || typeof parentRef.current.offsetWidth !== 'number') {
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
                const { color, id, order, value, } = item;
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
                }
                else if (typeof value !== 'number') {
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

const DEFAULT_FONT_SIZE = 16;
const FONT_SIZE_VALUE_CORRECTION_RATIO = 0.9;
/**
 * Calculates current chart font size
 * @function { (props: TGetCurrentFontSizeProps) => number } getCurrentFontSize
 * @param { TGetCurrentFontSizeProps } props
 * @return { number } returns chart font size
 */
const getCurrentFontSize = (props) => {
    const { centerSize, donutThickness, fontSize: fontSizeProp, size: sizeProp, text, } = props;
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

/**
 * Collects and processes all incoming and internal-calculated chart params
 * @function useChartProps (hook)
 * @param { TUseChartProps } props
 * @return all params for chart
 */
const useChartProps = (props) => {
    const { props: properties } = props;
    const { animationSpeed = DEFAULT_ANIMATION_SPEED, chartCenterSize, children, className, classNameChartBackground, classNameChartCenter, classNameChartSegment, classNameChartSegmentsBackground, classNameChildren, classNameSvgGroupSegments, classNameSvgGroupSegmentsBackground, classNameSvgGroupText, classNameSvgObjectText, classNameText, colorChartBackground, colorChartCenter = DEFAULT_CHART_CENTER_COLOR, colorSegmentFocusedOutline, colorSegmentsBackground, colorText: colorTextProp, data: dataProp = [], donutThickness: donutThicknessProp = 0, fontSize: fontSizeProp, gap = 0, hoverScaleRatio = DEFAULT_CHART_SEGMENT_SCALE_RATIO, isScaleOnHover = true, isSelectOnClick = true, isSelectOnKeyEnterDown = true, isSelectedValueShownInCenter = true, maxSize, minSize, stylesHoveredSegment, onSegmentClick, onSegmentKeyEnterDown, parentRef, resizeReRenderDebounceTime = DEFAULT_RESIZE_RE_RENDER_DEBOUNCE_TIME, selected: selectedProp, size: sizeProp, tabIndex = 0, text: textProp, widthSegmentFocusedOutline, } = properties;
    const data = useChartDataRemap({
        data: dataProp,
        gap,
    });
    const { animationDuration, chartRef, focusedSegment, handleClearSelects, hoveredSegment, mouseDownSegment, selectedState, setAnimationDuration, setFocusedSegment, setHoveredSegment, setMouseDownSegment, setSelected, } = useChartStates({ animationSpeed });
    const selected = useChartSelectedSegment({
        data,
        focusedSegment,
        isSelectedValueShownInCenter,
        selected: selectedProp || selectedState,
    });
    const { size } = useHandleResize({
        animationDuration,
        maxSize,
        minSize,
        parentRef,
        resizeReRenderDebounceTime,
        setAnimationDuration,
        size: sizeProp,
    });
    const strokeWidth = React.useMemo(() => {
        if (widthSegmentFocusedOutline) {
            return widthSegmentFocusedOutline;
        }
        return size * DEFAULT_FOCUSED_SEGMENT_STROKE_WIDTH_TO_SIZE_RATIO;
    }, [size, widthSegmentFocusedOutline]);
    const { centerSize, colorText, donutThickness, radius, segmentsStyles, text, totalDataValue, viewBox, } = useChartParams({
        animationDuration,
        chartCenterSize,
        colorText: colorTextProp,
        data,
        donutThickness: donutThicknessProp,
        gap,
        isSelectedValueShownInCenter,
        selected,
        size,
        text: textProp,
    });
    /**
     * Chart font-size
     */
    const fontSize = React.useMemo(() => getCurrentFontSize({
        centerSize,
        donutThickness,
        fontSize: fontSizeProp,
        size,
        text,
    }), [
        centerSize,
        donutThickness,
        fontSizeProp,
        size,
        text,
    ]);
    React.useEffect(() => {
        checkPropsErrors(properties);
    }, [properties]);
    return {
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
        selected: selected === null || selected === void 0 ? void 0 : selected.id,
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
        viewBox,
    };
};

const TEST_DATA_ID_CHART_SVG_MAIN = 'TEST_DATA_ID_CHART_SVG_MAIN';
const PieDonutChart = (props) => {
    const { classNames: classNamesProp, colors: colorsProp } = props, rest = __rest(props, ["classNames", "colors"]);
    const classNames = {
        classNameChartBackground: classNamesProp === null || classNamesProp === void 0 ? void 0 : classNamesProp.chartBackground,
        classNameChartCenter: classNamesProp === null || classNamesProp === void 0 ? void 0 : classNamesProp.chartCenter,
        classNameChartSegment: classNamesProp === null || classNamesProp === void 0 ? void 0 : classNamesProp.chartSegment,
        classNameChartSegmentsBackground: classNamesProp === null || classNamesProp === void 0 ? void 0 : classNamesProp.chartSegmentsBackground,
        classNameChildren: classNamesProp === null || classNamesProp === void 0 ? void 0 : classNamesProp.children,
        classNameSvgGroupSegments: classNamesProp === null || classNamesProp === void 0 ? void 0 : classNamesProp.svgGroupSegments,
        classNameSvgGroupSegmentsBackground: classNamesProp === null || classNamesProp === void 0 ? void 0 : classNamesProp.svgGroupSegmentsBackground,
        classNameSvgGroupText: classNamesProp === null || classNamesProp === void 0 ? void 0 : classNamesProp.svgGroupText,
        classNameSvgObjectText: classNamesProp === null || classNamesProp === void 0 ? void 0 : classNamesProp.svgObjectText,
        classNameText: classNamesProp === null || classNamesProp === void 0 ? void 0 : classNamesProp.text,
    };
    const colors = {
        colorChartBackground: colorsProp === null || colorsProp === void 0 ? void 0 : colorsProp.chartBackground,
        colorChartCenter: colorsProp === null || colorsProp === void 0 ? void 0 : colorsProp.chartCenter,
        colorSegmentFocusedOutline: colorsProp === null || colorsProp === void 0 ? void 0 : colorsProp.segmentFocusedOutline,
        colorSegmentsBackground: colorsProp === null || colorsProp === void 0 ? void 0 : colorsProp.segmentsBackground,
        colorText: colorsProp === null || colorsProp === void 0 ? void 0 : colorsProp.text,
    };
    const properties = useChartProps({ props: Object.assign(Object.assign(Object.assign({}, classNames), colors), rest) });
    return (React__default["default"].createElement("svg", { className: properties.className, "data-testid": TEST_DATA_ID_CHART_SVG_MAIN, style: {
            alignItems: 'center',
            aspectRatio: '1 / 1',
            display: 'flex',
            height: `${properties.size || properties.minSize || 0}px`,
            justifyContent: 'center',
            overflow: 'visible',
            transformOrigin: 'center',
            width: `${properties.size || properties.minSize || 0}px`,
        }, viewBox: properties.viewBox },
        React__default["default"].createElement(ChartBackground, Object.assign({}, properties)),
        React__default["default"].createElement(ChartSegmentsBackground, Object.assign({}, properties)),
        React__default["default"].createElement(Chart, Object.assign({}, properties)),
        React__default["default"].createElement(ChartCenter, Object.assign({}, properties)),
        React__default["default"].createElement(ChartText, Object.assign({}, properties), properties.children)));
};

module.exports = PieDonutChart;
