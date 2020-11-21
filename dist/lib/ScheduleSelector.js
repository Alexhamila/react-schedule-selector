"use strict";

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.preventScroll = exports.GridCell = void 0;

var React = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _addMinutes = _interopRequireDefault(require("date-fns/addMinutes"));

var _addHours = _interopRequireDefault(require("date-fns/addHours"));

var _addDays = _interopRequireDefault(require("date-fns/addDays"));

var _startOfDay = _interopRequireDefault(require("date-fns/startOfDay"));

var _isSameMinute = _interopRequireDefault(require("date-fns/isSameMinute"));

var _format = _interopRequireDefault(require("date-fns/format"));

var _typography = require("./typography");

var _colors = _interopRequireDefault(require("./colors"));

var _selectionSchemes = _interopRequireDefault(require("./selection-schemes"));

var _locale = require("date-fns/locale");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Import only the methods we need from date-fns in order to keep build size small
const Wrapper = _styledComponents.default.div.withConfig({
  displayName: "ScheduleSelector__Wrapper",
  componentId: "sc-1ke4ka2-0"
})(["display:flex;align-items:center;width:100%;user-select:none;"]);

const Grid = _styledComponents.default.div.withConfig({
  displayName: "ScheduleSelector__Grid",
  componentId: "sc-1ke4ka2-1"
})(["display:grid;grid-template-columns:auto repeat(", ",1fr);grid-template-rows:auto repeat(", ",1fr);column-gap:", ";row-gap:", ";width:100%;"], props => props.columns, props => props.rows, props => props.columnGap, props => props.rowGap);

const GridCell = _styledComponents.default.div.withConfig({
  displayName: "ScheduleSelector__GridCell",
  componentId: "sc-1ke4ka2-2"
})(["place-self:stretch;touch-action:none;"]);

exports.GridCell = GridCell;

const DateCell = _styledComponents.default.div.withConfig({
  displayName: "ScheduleSelector__DateCell",
  componentId: "sc-1ke4ka2-3"
})(["width:100%;height:25px;background-color:", ";&:hover{background-color:", ";}"], props => props.selected ? props.selectedColor : props.unselectedColor, props => props.hoveredColor);

const DateLabel = (0, _styledComponents.default)(_typography.Subtitle).withConfig({
  displayName: "ScheduleSelector__DateLabel",
  componentId: "sc-1ke4ka2-4"
})(["@media (max-width:699px){font-size:12px;}margin:0;margin-bottom:4px;"]);
const TimeText = (0, _styledComponents.default)(_typography.Text).withConfig({
  displayName: "ScheduleSelector__TimeText",
  componentId: "sc-1ke4ka2-5"
})(["@media (max-width:699px){font-size:10px;}text-align:right;margin:0;margin-right:4px;"]);

const preventScroll = e => {
  e.preventDefault();
};

exports.preventScroll = preventScroll;

class ScheduleSelector extends React.Component {
  // documentMouseUpHandler: () => void = () => {}
  // endSelection: () => void = () => {}
  // handleTouchMoveEvent: (event: React.SyntheticTouchEvent<*>) => void
  // handleTouchEndEvent: () => void
  // handleMouseUpEvent: (date: Date) => void
  // handleMouseEnterEvent: (date: Date) => void
  // handleSelectionStartEvent: (date: Date) => void
  static getDerivedStateFromProps(props, state) {
    // As long as the user isn't in the process of selecting, allow prop changes to re-populate selection state
    if (state.selectionStart == null) {
      return {
        selectionDraft: [...props.selection],
        dates: ScheduleSelector.computeDatesMatrix(props)
      };
    }

    return null;
  }

  static computeDatesMatrix(props) {
    const startTime = (0, _startOfDay.default)(props.startDate);
    const dates = [];
    const minutesInChunk = Math.floor(60 / props.hourlyChunks);

    for (let d = 0; d < props.numDays; d += 1) {
      const currentDay = [];

      for (let h = props.minTime; h < props.maxTime; h += 1) {
        for (let c = 0; c < props.hourlyChunks; c += 1) {
          currentDay.push((0, _addMinutes.default)((0, _addHours.default)((0, _addDays.default)(startTime, d), h), c * minutesInChunk));
        }
      }

      dates.push(currentDay);
    }

    return dates;
  }

  constructor(props) {
    super(props);
    this.cellToDate = new Map();
    this.gridRef = null;

    this.renderDateCellWrapper = time => {
      const startHandler = () => {
        this.handleSelectionStartEvent(time);
      };

      const selected = Boolean(this.state.selectionDraft.find(a => (0, _isSameMinute.default)(a, time)));
      return /*#__PURE__*/React.createElement(GridCell, {
        className: "rgdp__grid-cell",
        role: "presentation",
        key: time.toISOString() // Mouse handlers
        ,
        onMouseDown: startHandler,
        onMouseEnter: () => {
          this.handleMouseEnterEvent(time);
        },
        onMouseUp: () => {
          this.handleMouseUpEvent(time);
        } // Touch handlers
        // Since touch events fire on the event where the touch-drag started, there's no point in passing
        // in the time parameter, instead these handlers will do their job using the default Event
        // parameters
        ,
        onTouchStart: startHandler,
        onTouchMove: this.handleTouchMoveEvent,
        onTouchEnd: this.handleTouchEndEvent
      }, this.renderDateCell(time, selected));
    };

    this.renderDateCell = (time, selected) => {
      const refSetter = dateCell => {
        if (dateCell) {
          this.cellToDate.set(dateCell, time);
        }
      };

      if (this.props.renderDateCell) {
        return this.props.renderDateCell(time, selected, refSetter);
      } else {
        return /*#__PURE__*/React.createElement(DateCell, {
          selected: selected,
          ref: refSetter,
          selectedColor: this.props.selectedColor,
          unselectedColor: this.props.unselectedColor,
          hoveredColor: this.props.hoveredColor
        });
      }
    };

    this.renderTimeLabel = time => {
      if (this.props.renderTimeLabel) {
        return this.props.renderTimeLabel(time);
      } else {
        return /*#__PURE__*/React.createElement(TimeText, null, (0, _format.default)(time, this.props.timeFormat, {
          locale: _locale.fr
        }));
      }
    };

    this.renderDateLabel = date => {
      if (this.props.renderDateLabel) {
        return this.props.renderDateLabel(date);
      } else {
        return /*#__PURE__*/React.createElement(DateLabel, null, (0, _format.default)(date, this.props.dateFormat, {
          locale: _locale.fr
        }));
      }
    };

    this.state = {
      selectionDraft: [...this.props.selection],
      // copy it over
      selectionType: null,
      selectionStart: null,
      isTouchDragging: false,
      dates: ScheduleSelector.computeDatesMatrix(props)
    };
    this.selectionSchemeHandlers = {
      linear: _selectionSchemes.default.linear,
      square: _selectionSchemes.default.square
    };
    this.endSelection = this.endSelection.bind(this);
    this.handleMouseUpEvent = this.handleMouseUpEvent.bind(this);
    this.handleMouseEnterEvent = this.handleMouseEnterEvent.bind(this);
    this.handleTouchMoveEvent = this.handleTouchMoveEvent.bind(this);
    this.handleTouchEndEvent = this.handleTouchEndEvent.bind(this);
    this.handleSelectionStartEvent = this.handleSelectionStartEvent.bind(this);
  }

  componentDidMount() {
    // We need to add the endSelection event listener to the document itself in order
    // to catch the cases where the users ends their mouse-click somewhere besides
    // the date cells (in which case none of the DateCell's onMouseUp handlers would fire)
    //
    // This isn't necessary for touch events since the `touchend` event fires on
    // the element where the touch/drag started so it's always caught.
    document.addEventListener('mouseup', this.endSelection); // Prevent page scrolling when user is dragging on the date cells

    this.cellToDate.forEach((value, dateCell) => {
      if (dateCell && dateCell.addEventListener) {
        // @ts-ignore
        dateCell.addEventListener('touchmove', preventScroll, {
          passive: false
        });
      }
    });
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.endSelection);
    this.cellToDate.forEach((value, dateCell) => {
      if (dateCell && dateCell.removeEventListener) {
        // @ts-ignore
        dateCell.removeEventListener('touchmove', preventScroll);
      }
    });
  } // Performs a lookup into this.cellToDate to retrieve the Date that corresponds to
  // the cell where this touch event is right now. Note that this method will only work
  // if the event is a `touchmove` event since it's the only one that has a `touches` list.


  getTimeFromTouchEvent(event) {
    const {
      touches
    } = event;
    if (!touches || touches.length === 0) return null;
    const {
      clientX,
      clientY
    } = touches[0];
    const targetElement = document.elementFromPoint(clientX, clientY);

    if (targetElement) {
      const cellTime = this.cellToDate.get(targetElement);
      return cellTime !== null && cellTime !== void 0 ? cellTime : null;
    }

    return null;
  }

  endSelection() {
    this.props.onChange(this.state.selectionDraft);
    this.setState({
      selectionType: null,
      selectionStart: null
    });
  } // Given an ending Date, determines all the dates that should be selected in this draft


  updateAvailabilityDraft(selectionEnd, callback) {
    const {
      selectionType,
      selectionStart
    } = this.state;
    if (selectionType === null || selectionStart === null) return;
    let newSelection = [];

    if (selectionStart && selectionEnd && selectionType) {
      newSelection = this.selectionSchemeHandlers[this.props.selectionScheme](selectionStart, selectionEnd, this.state.dates);
    }

    let nextDraft = [...this.props.selection];

    if (selectionType === 'add') {
      nextDraft = Array.from(new Set([...nextDraft, ...newSelection]));
    } else if (selectionType === 'remove') {
      nextDraft = nextDraft.filter(a => !newSelection.find(b => (0, _isSameMinute.default)(a, b)));
    }

    this.setState({
      selectionDraft: nextDraft
    }, callback);
  } // Isomorphic (mouse and touch) handler since starting a selection works the same way for both classes of user input


  handleSelectionStartEvent(startTime) {
    // Check if the startTime cell is selected/unselected to determine if this drag-select should
    // add values or remove values
    const timeSelected = this.props.selection.find(a => (0, _isSameMinute.default)(a, startTime));
    this.setState({
      selectionType: timeSelected ? 'remove' : 'add',
      selectionStart: startTime
    });
  }

  handleMouseEnterEvent(time) {
    // Need to update selection draft on mouseup as well in order to catch the cases
    // where the user just clicks on a single cell (because no mouseenter events fire
    // in this scenario)
    this.updateAvailabilityDraft(time);
  }

  handleMouseUpEvent(time) {
    this.updateAvailabilityDraft(time); // Don't call this.endSelection() here because the document mouseup handler will do it
  }

  handleTouchMoveEvent(event) {
    this.setState({
      isTouchDragging: true
    });
    const cellTime = this.getTimeFromTouchEvent(event);

    if (cellTime) {
      this.updateAvailabilityDraft(cellTime);
    }
  }

  handleTouchEndEvent() {
    if (!this.state.isTouchDragging) {
      // Going down this branch means the user tapped but didn't drag -- which
      // means the availability draft hasn't yet been updated (since
      // handleTouchMoveEvent was never called) so we need to do it now
      this.updateAvailabilityDraft(null, () => {
        this.endSelection();
      });
    } else {
      this.endSelection();
    }

    this.setState({
      isTouchDragging: false
    });
  }

  renderFullDateGrid() {
    const flattenedDates = [];
    const numDays = this.state.dates.length;
    const numTimes = this.state.dates[0].length;

    for (let j = 0; j < numTimes; j += 1) {
      for (let i = 0; i < numDays; i += 1) {
        flattenedDates.push(this.state.dates[i][j]);
      }
    }

    const dateGridElements = flattenedDates.map(this.renderDateCellWrapper);

    for (let i = 0; i < numTimes; i += 1) {
      const index = i * numDays;
      const time = this.state.dates[0][i]; // Inject the time label at the start of every row

      dateGridElements.splice(index + i, 0, this.renderTimeLabel(time));
    }

    return [
    /*#__PURE__*/
    // Empty top left corner
    React.createElement("div", {
      key: "topleft"
    }), // Top row of dates
    ...this.state.dates.map((dayOfTimes, index) => /*#__PURE__*/React.cloneElement(this.renderDateLabel(dayOfTimes[0]), {
      key: "date-".concat(index)
    })), // Every row after that
    ...dateGridElements.map((element, index) => /*#__PURE__*/React.cloneElement(element, {
      key: "time-".concat(index)
    }))];
  }

  render() {
    return /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(Grid, {
      columns: this.state.dates.length,
      rows: this.state.dates[0].length,
      columnGap: this.props.columnGap,
      rowGap: this.props.rowGap,
      ref: el => {
        this.gridRef = el;
      }
    }, this.renderFullDateGrid()));
  }

}

exports.default = ScheduleSelector;
ScheduleSelector.defaultProps = {
  selection: [],
  selectionScheme: 'square',
  numDays: 7,
  minTime: 9,
  maxTime: 23,
  hourlyChunks: 1,
  startDate: new Date(),
  timeFormat: 'ha',
  dateFormat: 'M/D',
  columnGap: '4px',
  rowGap: '4px',
  selectedColor: _colors.default.blue,
  unselectedColor: _colors.default.paleBlue,
  hoveredColor: _colors.default.lightBlue,
  onChange: () => {}
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvU2NoZWR1bGVTZWxlY3Rvci50c3giXSwibmFtZXMiOlsiV3JhcHBlciIsInN0eWxlZCIsImRpdiIsIkdyaWQiLCJwcm9wcyIsImNvbHVtbnMiLCJyb3dzIiwiY29sdW1uR2FwIiwicm93R2FwIiwiR3JpZENlbGwiLCJEYXRlQ2VsbCIsInNlbGVjdGVkIiwic2VsZWN0ZWRDb2xvciIsInVuc2VsZWN0ZWRDb2xvciIsImhvdmVyZWRDb2xvciIsIkRhdGVMYWJlbCIsIlN1YnRpdGxlIiwiVGltZVRleHQiLCJUZXh0IiwicHJldmVudFNjcm9sbCIsImUiLCJwcmV2ZW50RGVmYXVsdCIsIlNjaGVkdWxlU2VsZWN0b3IiLCJSZWFjdCIsIkNvbXBvbmVudCIsImdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyIsInN0YXRlIiwic2VsZWN0aW9uU3RhcnQiLCJzZWxlY3Rpb25EcmFmdCIsInNlbGVjdGlvbiIsImRhdGVzIiwiY29tcHV0ZURhdGVzTWF0cml4Iiwic3RhcnRUaW1lIiwic3RhcnREYXRlIiwibWludXRlc0luQ2h1bmsiLCJNYXRoIiwiZmxvb3IiLCJob3VybHlDaHVua3MiLCJkIiwibnVtRGF5cyIsImN1cnJlbnREYXkiLCJoIiwibWluVGltZSIsIm1heFRpbWUiLCJjIiwicHVzaCIsImNvbnN0cnVjdG9yIiwiY2VsbFRvRGF0ZSIsIk1hcCIsImdyaWRSZWYiLCJyZW5kZXJEYXRlQ2VsbFdyYXBwZXIiLCJ0aW1lIiwic3RhcnRIYW5kbGVyIiwiaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudCIsIkJvb2xlYW4iLCJmaW5kIiwiYSIsInRvSVNPU3RyaW5nIiwiaGFuZGxlTW91c2VFbnRlckV2ZW50IiwiaGFuZGxlTW91c2VVcEV2ZW50IiwiaGFuZGxlVG91Y2hNb3ZlRXZlbnQiLCJoYW5kbGVUb3VjaEVuZEV2ZW50IiwicmVuZGVyRGF0ZUNlbGwiLCJyZWZTZXR0ZXIiLCJkYXRlQ2VsbCIsInNldCIsInJlbmRlclRpbWVMYWJlbCIsInRpbWVGb3JtYXQiLCJsb2NhbGUiLCJmciIsInJlbmRlckRhdGVMYWJlbCIsImRhdGUiLCJkYXRlRm9ybWF0Iiwic2VsZWN0aW9uVHlwZSIsImlzVG91Y2hEcmFnZ2luZyIsInNlbGVjdGlvblNjaGVtZUhhbmRsZXJzIiwibGluZWFyIiwic2VsZWN0aW9uU2NoZW1lcyIsInNxdWFyZSIsImVuZFNlbGVjdGlvbiIsImJpbmQiLCJjb21wb25lbnREaWRNb3VudCIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImZvckVhY2giLCJ2YWx1ZSIsInBhc3NpdmUiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJnZXRUaW1lRnJvbVRvdWNoRXZlbnQiLCJldmVudCIsInRvdWNoZXMiLCJsZW5ndGgiLCJjbGllbnRYIiwiY2xpZW50WSIsInRhcmdldEVsZW1lbnQiLCJlbGVtZW50RnJvbVBvaW50IiwiY2VsbFRpbWUiLCJnZXQiLCJvbkNoYW5nZSIsInNldFN0YXRlIiwidXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQiLCJzZWxlY3Rpb25FbmQiLCJjYWxsYmFjayIsIm5ld1NlbGVjdGlvbiIsInNlbGVjdGlvblNjaGVtZSIsIm5leHREcmFmdCIsIkFycmF5IiwiZnJvbSIsIlNldCIsImZpbHRlciIsImIiLCJ0aW1lU2VsZWN0ZWQiLCJyZW5kZXJGdWxsRGF0ZUdyaWQiLCJmbGF0dGVuZWREYXRlcyIsIm51bVRpbWVzIiwiaiIsImkiLCJkYXRlR3JpZEVsZW1lbnRzIiwibWFwIiwiaW5kZXgiLCJzcGxpY2UiLCJkYXlPZlRpbWVzIiwiY2xvbmVFbGVtZW50Iiwia2V5IiwiZWxlbWVudCIsInJlbmRlciIsImVsIiwiZGVmYXVsdFByb3BzIiwiRGF0ZSIsImNvbG9ycyIsImJsdWUiLCJwYWxlQmx1ZSIsImxpZ2h0Qmx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBR0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7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Q0FBV0ksS0FBWCxDQUFpQjhELE1BRDVCO0FBRUUsTUFBQSxJQUFJLEVBQUUsS0FBS2xFLEtBQUwsQ0FBV0ksS0FBWCxDQUFpQixDQUFqQixFQUFvQjhELE1BRjVCO0FBR0UsTUFBQSxTQUFTLEVBQUUsS0FBS3hGLEtBQUwsQ0FBV0csU0FIeEI7QUFJRSxNQUFBLE1BQU0sRUFBRSxLQUFLSCxLQUFMLENBQVdJLE1BSnJCO0FBS0UsTUFBQSxHQUFHLEVBQUV1SCxFQUFFLElBQUk7QUFDVCxhQUFLOUUsT0FBTCxHQUFlOEUsRUFBZjtBQUNEO0FBUEgsT0FTRyxLQUFLZCxrQkFBTCxFQVRILENBREYsQ0FERjtBQWVEOztBQTVUaUY7OztBQUEvRDNGLGdCLENBWVowRyxZLEdBQW1DO0FBQ3hDbkcsRUFBQUEsU0FBUyxFQUFFLEVBRDZCO0FBRXhDNEUsRUFBQUEsZUFBZSxFQUFFLFFBRnVCO0FBR3hDbEUsRUFBQUEsT0FBTyxFQUFFLENBSCtCO0FBSXhDRyxFQUFBQSxPQUFPLEVBQUUsQ0FKK0I7QUFLeENDLEVBQUFBLE9BQU8sRUFBRSxFQUwrQjtBQU14Q04sRUFBQUEsWUFBWSxFQUFFLENBTjBCO0FBT3hDSixFQUFBQSxTQUFTLEVBQUUsSUFBSWdHLElBQUosRUFQNkI7QUFReEM5RCxFQUFBQSxVQUFVLEVBQUUsSUFSNEI7QUFTeENLLEVBQUFBLFVBQVUsRUFBRSxLQVQ0QjtBQVV4Q2pFLEVBQUFBLFNBQVMsRUFBRSxLQVY2QjtBQVd4Q0MsRUFBQUEsTUFBTSxFQUFFLEtBWGdDO0FBWXhDSSxFQUFBQSxhQUFhLEVBQUVzSCxnQkFBT0MsSUFaa0I7QUFheEN0SCxFQUFBQSxlQUFlLEVBQUVxSCxnQkFBT0UsUUFiZ0I7QUFjeEN0SCxFQUFBQSxZQUFZLEVBQUVvSCxnQkFBT0csU0FkbUI7QUFleENsQyxFQUFBQSxRQUFRLEVBQUUsTUFBTSxDQUFFO0FBZnNCLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cydcclxuXHJcbi8vIEltcG9ydCBvbmx5IHRoZSBtZXRob2RzIHdlIG5lZWQgZnJvbSBkYXRlLWZucyBpbiBvcmRlciB0byBrZWVwIGJ1aWxkIHNpemUgc21hbGxcclxuaW1wb3J0IGFkZE1pbnV0ZXMgZnJvbSAnZGF0ZS1mbnMvYWRkTWludXRlcydcclxuaW1wb3J0IGFkZEhvdXJzIGZyb20gJ2RhdGUtZm5zL2FkZEhvdXJzJ1xyXG5pbXBvcnQgYWRkRGF5cyBmcm9tICdkYXRlLWZucy9hZGREYXlzJ1xyXG5pbXBvcnQgc3RhcnRPZkRheSBmcm9tICdkYXRlLWZucy9zdGFydE9mRGF5J1xyXG5pbXBvcnQgaXNTYW1lTWludXRlIGZyb20gJ2RhdGUtZm5zL2lzU2FtZU1pbnV0ZSdcclxuaW1wb3J0IGZvcm1hdERhdGUgZnJvbSAnZGF0ZS1mbnMvZm9ybWF0J1xyXG5cclxuaW1wb3J0IHsgVGV4dCwgU3VidGl0bGUgfSBmcm9tICcuL3R5cG9ncmFwaHknXHJcbmltcG9ydCBjb2xvcnMgZnJvbSAnLi9jb2xvcnMnXHJcbmltcG9ydCBzZWxlY3Rpb25TY2hlbWVzLCB7IFNlbGVjdGlvblNjaGVtZVR5cGUsIFNlbGVjdGlvblR5cGUgfSBmcm9tICcuL3NlbGVjdGlvbi1zY2hlbWVzJ1xyXG5pbXBvcnQgeyBmciB9IGZyb20gJ2RhdGUtZm5zL2xvY2FsZSdcclxuXHJcbmNvbnN0IFdyYXBwZXIgPSBzdHlsZWQuZGl2YFxyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICB3aWR0aDogMTAwJTtcclxuICB1c2VyLXNlbGVjdDogbm9uZTtcclxuYFxyXG5cclxuY29uc3QgR3JpZCA9IHN0eWxlZC5kaXY8eyBjb2x1bW5zOiBudW1iZXI7IHJvd3M6IG51bWJlcjsgY29sdW1uR2FwOiBzdHJpbmc7IHJvd0dhcDogc3RyaW5nIH0+YFxyXG4gIGRpc3BsYXk6IGdyaWQ7XHJcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiBhdXRvIHJlcGVhdCgke3Byb3BzID0+IHByb3BzLmNvbHVtbnN9LCAxZnIpO1xyXG4gIGdyaWQtdGVtcGxhdGUtcm93czogYXV0byByZXBlYXQoJHtwcm9wcyA9PiBwcm9wcy5yb3dzfSwgMWZyKTtcclxuICBjb2x1bW4tZ2FwOiAke3Byb3BzID0+IHByb3BzLmNvbHVtbkdhcH07XHJcbiAgcm93LWdhcDogJHtwcm9wcyA9PiBwcm9wcy5yb3dHYXB9O1xyXG4gIHdpZHRoOiAxMDAlO1xyXG5gXHJcblxyXG5leHBvcnQgY29uc3QgR3JpZENlbGwgPSBzdHlsZWQuZGl2YFxyXG4gIHBsYWNlLXNlbGY6IHN0cmV0Y2g7XHJcbiAgdG91Y2gtYWN0aW9uOiBub25lO1xyXG5gXHJcblxyXG5jb25zdCBEYXRlQ2VsbCA9IHN0eWxlZC5kaXY8e1xyXG4gIHNlbGVjdGVkOiBib29sZWFuXHJcbiAgc2VsZWN0ZWRDb2xvcjogc3RyaW5nXHJcbiAgdW5zZWxlY3RlZENvbG9yOiBzdHJpbmdcclxuICBob3ZlcmVkQ29sb3I6IHN0cmluZ1xyXG59PmBcclxuICB3aWR0aDogMTAwJTtcclxuICBoZWlnaHQ6IDI1cHg7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiAocHJvcHMuc2VsZWN0ZWQgPyBwcm9wcy5zZWxlY3RlZENvbG9yIDogcHJvcHMudW5zZWxlY3RlZENvbG9yKX07XHJcblxyXG4gICY6aG92ZXIge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy5ob3ZlcmVkQ29sb3J9O1xyXG4gIH1cclxuYFxyXG5cclxuY29uc3QgRGF0ZUxhYmVsID0gc3R5bGVkKFN1YnRpdGxlKWBcclxuICBAbWVkaWEgKG1heC13aWR0aDogNjk5cHgpIHtcclxuICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICB9XHJcbiAgbWFyZ2luOiAwO1xyXG4gIG1hcmdpbi1ib3R0b206IDRweDtcclxuYFxyXG5cclxuY29uc3QgVGltZVRleHQgPSBzdHlsZWQoVGV4dClgXHJcbiAgQG1lZGlhIChtYXgtd2lkdGg6IDY5OXB4KSB7XHJcbiAgICBmb250LXNpemU6IDEwcHg7XHJcbiAgfVxyXG4gIHRleHQtYWxpZ246IHJpZ2h0O1xyXG4gIG1hcmdpbjogMDtcclxuICBtYXJnaW4tcmlnaHQ6IDRweDtcclxuYFxyXG5cclxudHlwZSBQcm9wc1R5cGUgPSB7XHJcbiAgc2VsZWN0aW9uOiBBcnJheTxEYXRlPlxyXG4gIHNlbGVjdGlvblNjaGVtZTogU2VsZWN0aW9uU2NoZW1lVHlwZVxyXG4gIG9uQ2hhbmdlOiAobmV3U2VsZWN0aW9uOiBBcnJheTxEYXRlPikgPT4gdm9pZFxyXG4gIHN0YXJ0RGF0ZTogRGF0ZVxyXG4gIG51bURheXM6IG51bWJlclxyXG4gIG1pblRpbWU6IG51bWJlclxyXG4gIG1heFRpbWU6IG51bWJlclxyXG4gIGhvdXJseUNodW5rczogbnVtYmVyXHJcbiAgZGF0ZUZvcm1hdDogc3RyaW5nXHJcbiAgdGltZUZvcm1hdDogc3RyaW5nXHJcbiAgY29sdW1uR2FwOiBzdHJpbmdcclxuICByb3dHYXA6IHN0cmluZ1xyXG4gIHVuc2VsZWN0ZWRDb2xvcjogc3RyaW5nXHJcbiAgc2VsZWN0ZWRDb2xvcjogc3RyaW5nXHJcbiAgaG92ZXJlZENvbG9yOiBzdHJpbmdcclxuICByZW5kZXJEYXRlQ2VsbD86IChkYXRldGltZTogRGF0ZSwgc2VsZWN0ZWQ6IGJvb2xlYW4sIHJlZlNldHRlcjogKGRhdGVDZWxsRWxlbWVudDogSFRNTEVsZW1lbnQpID0+IHZvaWQpID0+IEpTWC5FbGVtZW50XHJcbiAgcmVuZGVyVGltZUxhYmVsPzogKHRpbWU6IERhdGUpID0+IEpTWC5FbGVtZW50XHJcbiAgcmVuZGVyRGF0ZUxhYmVsPzogKGRhdGU6IERhdGUpID0+IEpTWC5FbGVtZW50XHJcbn1cclxuXHJcbnR5cGUgU3RhdGVUeXBlID0ge1xyXG4gIC8vIEluIHRoZSBjYXNlIHRoYXQgYSB1c2VyIGlzIGRyYWctc2VsZWN0aW5nLCB3ZSBkb24ndCB3YW50IHRvIGNhbGwgdGhpcy5wcm9wcy5vbkNoYW5nZSgpIHVudGlsIHRoZXkgaGF2ZSBjb21wbGV0ZWRcclxuICAvLyB0aGUgZHJhZy1zZWxlY3QuIHNlbGVjdGlvbkRyYWZ0IHNlcnZlcyBhcyBhIHRlbXBvcmFyeSBjb3B5IGR1cmluZyBkcmFnLXNlbGVjdHMuXHJcbiAgc2VsZWN0aW9uRHJhZnQ6IEFycmF5PERhdGU+XHJcbiAgc2VsZWN0aW9uVHlwZTogU2VsZWN0aW9uVHlwZSB8IG51bGxcclxuICBzZWxlY3Rpb25TdGFydDogRGF0ZSB8IG51bGxcclxuICBpc1RvdWNoRHJhZ2dpbmc6IGJvb2xlYW5cclxuICBkYXRlczogQXJyYXk8QXJyYXk8RGF0ZT4+XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBwcmV2ZW50U2Nyb2xsID0gKGU6IFRvdWNoRXZlbnQpID0+IHtcclxuICBlLnByZXZlbnREZWZhdWx0KClcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NoZWR1bGVTZWxlY3RvciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxQcm9wc1R5cGUsIFN0YXRlVHlwZT4ge1xyXG4gIHNlbGVjdGlvblNjaGVtZUhhbmRsZXJzOiB7IFtrZXk6IHN0cmluZ106IChzdGFydERhdGU6IERhdGUsIGVuZERhdGU6IERhdGUsIGZvbzogQXJyYXk8QXJyYXk8RGF0ZT4+KSA9PiBEYXRlW10gfVxyXG4gIGNlbGxUb0RhdGU6IE1hcDxFbGVtZW50LCBEYXRlPiA9IG5ldyBNYXAoKVxyXG4gIC8vIGRvY3VtZW50TW91c2VVcEhhbmRsZXI6ICgpID0+IHZvaWQgPSAoKSA9PiB7fVxyXG4gIC8vIGVuZFNlbGVjdGlvbjogKCkgPT4gdm9pZCA9ICgpID0+IHt9XHJcbiAgLy8gaGFuZGxlVG91Y2hNb3ZlRXZlbnQ6IChldmVudDogUmVhY3QuU3ludGhldGljVG91Y2hFdmVudDwqPikgPT4gdm9pZFxyXG4gIC8vIGhhbmRsZVRvdWNoRW5kRXZlbnQ6ICgpID0+IHZvaWRcclxuICAvLyBoYW5kbGVNb3VzZVVwRXZlbnQ6IChkYXRlOiBEYXRlKSA9PiB2b2lkXHJcbiAgLy8gaGFuZGxlTW91c2VFbnRlckV2ZW50OiAoZGF0ZTogRGF0ZSkgPT4gdm9pZFxyXG4gIC8vIGhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQ6IChkYXRlOiBEYXRlKSA9PiB2b2lkXHJcbiAgZ3JpZFJlZjogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbFxyXG5cclxuICBzdGF0aWMgZGVmYXVsdFByb3BzOiBQYXJ0aWFsPFByb3BzVHlwZT4gPSB7XHJcbiAgICBzZWxlY3Rpb246IFtdLFxyXG4gICAgc2VsZWN0aW9uU2NoZW1lOiAnc3F1YXJlJyxcclxuICAgIG51bURheXM6IDcsXHJcbiAgICBtaW5UaW1lOiA5LFxyXG4gICAgbWF4VGltZTogMjMsXHJcbiAgICBob3VybHlDaHVua3M6IDEsXHJcbiAgICBzdGFydERhdGU6IG5ldyBEYXRlKCksXHJcbiAgICB0aW1lRm9ybWF0OiAnaGEnLFxyXG4gICAgZGF0ZUZvcm1hdDogJ00vRCcsXHJcbiAgICBjb2x1bW5HYXA6ICc0cHgnLFxyXG4gICAgcm93R2FwOiAnNHB4JyxcclxuICAgIHNlbGVjdGVkQ29sb3I6IGNvbG9ycy5ibHVlLFxyXG4gICAgdW5zZWxlY3RlZENvbG9yOiBjb2xvcnMucGFsZUJsdWUsXHJcbiAgICBob3ZlcmVkQ29sb3I6IGNvbG9ycy5saWdodEJsdWUsXHJcbiAgICBvbkNoYW5nZTogKCkgPT4ge31cclxuICB9XHJcblxyXG4gIHN0YXRpYyBnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMocHJvcHM6IFByb3BzVHlwZSwgc3RhdGU6IFN0YXRlVHlwZSk6IFBhcnRpYWw8U3RhdGVUeXBlPiB8IG51bGwge1xyXG4gICAgLy8gQXMgbG9uZyBhcyB0aGUgdXNlciBpc24ndCBpbiB0aGUgcHJvY2VzcyBvZiBzZWxlY3RpbmcsIGFsbG93IHByb3AgY2hhbmdlcyB0byByZS1wb3B1bGF0ZSBzZWxlY3Rpb24gc3RhdGVcclxuICAgIGlmIChzdGF0ZS5zZWxlY3Rpb25TdGFydCA9PSBudWxsKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgc2VsZWN0aW9uRHJhZnQ6IFsuLi5wcm9wcy5zZWxlY3Rpb25dLFxyXG4gICAgICAgIGRhdGVzOiBTY2hlZHVsZVNlbGVjdG9yLmNvbXB1dGVEYXRlc01hdHJpeChwcm9wcylcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGxcclxuICB9XHJcblxyXG4gIHN0YXRpYyBjb21wdXRlRGF0ZXNNYXRyaXgocHJvcHM6IFByb3BzVHlwZSk6IEFycmF5PEFycmF5PERhdGU+PiB7XHJcbiAgICBjb25zdCBzdGFydFRpbWUgPSBzdGFydE9mRGF5KHByb3BzLnN0YXJ0RGF0ZSlcclxuICAgIGNvbnN0IGRhdGVzOiBBcnJheTxBcnJheTxEYXRlPj4gPSBbXVxyXG4gICAgY29uc3QgbWludXRlc0luQ2h1bmsgPSBNYXRoLmZsb29yKDYwIC8gcHJvcHMuaG91cmx5Q2h1bmtzKVxyXG4gICAgZm9yIChsZXQgZCA9IDA7IGQgPCBwcm9wcy5udW1EYXlzOyBkICs9IDEpIHtcclxuICAgICAgY29uc3QgY3VycmVudERheSA9IFtdXHJcbiAgICAgIGZvciAobGV0IGggPSBwcm9wcy5taW5UaW1lOyBoIDwgcHJvcHMubWF4VGltZTsgaCArPSAxKSB7XHJcbiAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCBwcm9wcy5ob3VybHlDaHVua3M7IGMgKz0gMSkge1xyXG4gICAgICAgICAgY3VycmVudERheS5wdXNoKGFkZE1pbnV0ZXMoYWRkSG91cnMoYWRkRGF5cyhzdGFydFRpbWUsIGQpLCBoKSwgYyAqIG1pbnV0ZXNJbkNodW5rKSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZGF0ZXMucHVzaChjdXJyZW50RGF5KVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRhdGVzXHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3Rvcihwcm9wczogUHJvcHNUeXBlKSB7XHJcbiAgICBzdXBlcihwcm9wcylcclxuXHJcbiAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICBzZWxlY3Rpb25EcmFmdDogWy4uLnRoaXMucHJvcHMuc2VsZWN0aW9uXSwgLy8gY29weSBpdCBvdmVyXHJcbiAgICAgIHNlbGVjdGlvblR5cGU6IG51bGwsXHJcbiAgICAgIHNlbGVjdGlvblN0YXJ0OiBudWxsLFxyXG4gICAgICBpc1RvdWNoRHJhZ2dpbmc6IGZhbHNlLFxyXG4gICAgICBkYXRlczogU2NoZWR1bGVTZWxlY3Rvci5jb21wdXRlRGF0ZXNNYXRyaXgocHJvcHMpXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zZWxlY3Rpb25TY2hlbWVIYW5kbGVycyA9IHtcclxuICAgICAgbGluZWFyOiBzZWxlY3Rpb25TY2hlbWVzLmxpbmVhcixcclxuICAgICAgc3F1YXJlOiBzZWxlY3Rpb25TY2hlbWVzLnNxdWFyZVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZW5kU2VsZWN0aW9uID0gdGhpcy5lbmRTZWxlY3Rpb24uYmluZCh0aGlzKVxyXG4gICAgdGhpcy5oYW5kbGVNb3VzZVVwRXZlbnQgPSB0aGlzLmhhbmRsZU1vdXNlVXBFdmVudC5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLmhhbmRsZU1vdXNlRW50ZXJFdmVudCA9IHRoaXMuaGFuZGxlTW91c2VFbnRlckV2ZW50LmJpbmQodGhpcylcclxuICAgIHRoaXMuaGFuZGxlVG91Y2hNb3ZlRXZlbnQgPSB0aGlzLmhhbmRsZVRvdWNoTW92ZUV2ZW50LmJpbmQodGhpcylcclxuICAgIHRoaXMuaGFuZGxlVG91Y2hFbmRFdmVudCA9IHRoaXMuaGFuZGxlVG91Y2hFbmRFdmVudC5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLmhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQgPSB0aGlzLmhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQuYmluZCh0aGlzKVxyXG4gIH1cclxuXHJcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAvLyBXZSBuZWVkIHRvIGFkZCB0aGUgZW5kU2VsZWN0aW9uIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBkb2N1bWVudCBpdHNlbGYgaW4gb3JkZXJcclxuICAgIC8vIHRvIGNhdGNoIHRoZSBjYXNlcyB3aGVyZSB0aGUgdXNlcnMgZW5kcyB0aGVpciBtb3VzZS1jbGljayBzb21ld2hlcmUgYmVzaWRlc1xyXG4gICAgLy8gdGhlIGRhdGUgY2VsbHMgKGluIHdoaWNoIGNhc2Ugbm9uZSBvZiB0aGUgRGF0ZUNlbGwncyBvbk1vdXNlVXAgaGFuZGxlcnMgd291bGQgZmlyZSlcclxuICAgIC8vXHJcbiAgICAvLyBUaGlzIGlzbid0IG5lY2Vzc2FyeSBmb3IgdG91Y2ggZXZlbnRzIHNpbmNlIHRoZSBgdG91Y2hlbmRgIGV2ZW50IGZpcmVzIG9uXHJcbiAgICAvLyB0aGUgZWxlbWVudCB3aGVyZSB0aGUgdG91Y2gvZHJhZyBzdGFydGVkIHNvIGl0J3MgYWx3YXlzIGNhdWdodC5cclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmVuZFNlbGVjdGlvbilcclxuXHJcbiAgICAvLyBQcmV2ZW50IHBhZ2Ugc2Nyb2xsaW5nIHdoZW4gdXNlciBpcyBkcmFnZ2luZyBvbiB0aGUgZGF0ZSBjZWxsc1xyXG4gICAgdGhpcy5jZWxsVG9EYXRlLmZvckVhY2goKHZhbHVlLCBkYXRlQ2VsbCkgPT4ge1xyXG4gICAgICBpZiAoZGF0ZUNlbGwgJiYgZGF0ZUNlbGwuYWRkRXZlbnRMaXN0ZW5lcikge1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICBkYXRlQ2VsbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBwcmV2ZW50U2Nyb2xsLCB7IHBhc3NpdmU6IGZhbHNlIH0pXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcclxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmVuZFNlbGVjdGlvbilcclxuICAgIHRoaXMuY2VsbFRvRGF0ZS5mb3JFYWNoKCh2YWx1ZSwgZGF0ZUNlbGwpID0+IHtcclxuICAgICAgaWYgKGRhdGVDZWxsICYmIGRhdGVDZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIpIHtcclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgZGF0ZUNlbGwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgcHJldmVudFNjcm9sbClcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIC8vIFBlcmZvcm1zIGEgbG9va3VwIGludG8gdGhpcy5jZWxsVG9EYXRlIHRvIHJldHJpZXZlIHRoZSBEYXRlIHRoYXQgY29ycmVzcG9uZHMgdG9cclxuICAvLyB0aGUgY2VsbCB3aGVyZSB0aGlzIHRvdWNoIGV2ZW50IGlzIHJpZ2h0IG5vdy4gTm90ZSB0aGF0IHRoaXMgbWV0aG9kIHdpbGwgb25seSB3b3JrXHJcbiAgLy8gaWYgdGhlIGV2ZW50IGlzIGEgYHRvdWNobW92ZWAgZXZlbnQgc2luY2UgaXQncyB0aGUgb25seSBvbmUgdGhhdCBoYXMgYSBgdG91Y2hlc2AgbGlzdC5cclxuICBnZXRUaW1lRnJvbVRvdWNoRXZlbnQoZXZlbnQ6IFJlYWN0LlRvdWNoRXZlbnQ8YW55Pik6IERhdGUgfCBudWxsIHtcclxuICAgIGNvbnN0IHsgdG91Y2hlcyB9ID0gZXZlbnRcclxuICAgIGlmICghdG91Y2hlcyB8fCB0b3VjaGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGxcclxuICAgIGNvbnN0IHsgY2xpZW50WCwgY2xpZW50WSB9ID0gdG91Y2hlc1swXVxyXG4gICAgY29uc3QgdGFyZ2V0RWxlbWVudCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoY2xpZW50WCwgY2xpZW50WSlcclxuICAgIGlmICh0YXJnZXRFbGVtZW50KSB7XHJcbiAgICAgIGNvbnN0IGNlbGxUaW1lID0gdGhpcy5jZWxsVG9EYXRlLmdldCh0YXJnZXRFbGVtZW50KVxyXG4gICAgICByZXR1cm4gY2VsbFRpbWUgPz8gbnVsbFxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGxcclxuICB9XHJcblxyXG4gIGVuZFNlbGVjdGlvbigpIHtcclxuICAgIHRoaXMucHJvcHMub25DaGFuZ2UodGhpcy5zdGF0ZS5zZWxlY3Rpb25EcmFmdClcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBzZWxlY3Rpb25UeXBlOiBudWxsLFxyXG4gICAgICBzZWxlY3Rpb25TdGFydDogbnVsbFxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIC8vIEdpdmVuIGFuIGVuZGluZyBEYXRlLCBkZXRlcm1pbmVzIGFsbCB0aGUgZGF0ZXMgdGhhdCBzaG91bGQgYmUgc2VsZWN0ZWQgaW4gdGhpcyBkcmFmdFxyXG4gIHVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0KHNlbGVjdGlvbkVuZDogRGF0ZSB8IG51bGwsIGNhbGxiYWNrPzogKCkgPT4gdm9pZCkge1xyXG4gICAgY29uc3QgeyBzZWxlY3Rpb25UeXBlLCBzZWxlY3Rpb25TdGFydCB9ID0gdGhpcy5zdGF0ZVxyXG5cclxuICAgIGlmIChzZWxlY3Rpb25UeXBlID09PSBudWxsIHx8IHNlbGVjdGlvblN0YXJ0ID09PSBudWxsKSByZXR1cm5cclxuXHJcbiAgICBsZXQgbmV3U2VsZWN0aW9uOiBBcnJheTxEYXRlPiA9IFtdXHJcbiAgICBpZiAoc2VsZWN0aW9uU3RhcnQgJiYgc2VsZWN0aW9uRW5kICYmIHNlbGVjdGlvblR5cGUpIHtcclxuICAgICAgbmV3U2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb25TY2hlbWVIYW5kbGVyc1t0aGlzLnByb3BzLnNlbGVjdGlvblNjaGVtZV0oXHJcbiAgICAgICAgc2VsZWN0aW9uU3RhcnQsXHJcbiAgICAgICAgc2VsZWN0aW9uRW5kLFxyXG4gICAgICAgIHRoaXMuc3RhdGUuZGF0ZXNcclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGxldCBuZXh0RHJhZnQgPSBbLi4udGhpcy5wcm9wcy5zZWxlY3Rpb25dXHJcbiAgICBpZiAoc2VsZWN0aW9uVHlwZSA9PT0gJ2FkZCcpIHtcclxuICAgICAgbmV4dERyYWZ0ID0gQXJyYXkuZnJvbShuZXcgU2V0KFsuLi5uZXh0RHJhZnQsIC4uLm5ld1NlbGVjdGlvbl0pKVxyXG4gICAgfSBlbHNlIGlmIChzZWxlY3Rpb25UeXBlID09PSAncmVtb3ZlJykge1xyXG4gICAgICBuZXh0RHJhZnQgPSBuZXh0RHJhZnQuZmlsdGVyKGEgPT4gIW5ld1NlbGVjdGlvbi5maW5kKGIgPT4gaXNTYW1lTWludXRlKGEsIGIpKSlcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnNldFN0YXRlKHsgc2VsZWN0aW9uRHJhZnQ6IG5leHREcmFmdCB9LCBjYWxsYmFjaylcclxuICB9XHJcblxyXG4gIC8vIElzb21vcnBoaWMgKG1vdXNlIGFuZCB0b3VjaCkgaGFuZGxlciBzaW5jZSBzdGFydGluZyBhIHNlbGVjdGlvbiB3b3JrcyB0aGUgc2FtZSB3YXkgZm9yIGJvdGggY2xhc3NlcyBvZiB1c2VyIGlucHV0XHJcbiAgaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudChzdGFydFRpbWU6IERhdGUpIHtcclxuICAgIC8vIENoZWNrIGlmIHRoZSBzdGFydFRpbWUgY2VsbCBpcyBzZWxlY3RlZC91bnNlbGVjdGVkIHRvIGRldGVybWluZSBpZiB0aGlzIGRyYWctc2VsZWN0IHNob3VsZFxyXG4gICAgLy8gYWRkIHZhbHVlcyBvciByZW1vdmUgdmFsdWVzXHJcbiAgICBjb25zdCB0aW1lU2VsZWN0ZWQgPSB0aGlzLnByb3BzLnNlbGVjdGlvbi5maW5kKGEgPT4gaXNTYW1lTWludXRlKGEsIHN0YXJ0VGltZSkpXHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgc2VsZWN0aW9uVHlwZTogdGltZVNlbGVjdGVkID8gJ3JlbW92ZScgOiAnYWRkJyxcclxuICAgICAgc2VsZWN0aW9uU3RhcnQ6IHN0YXJ0VGltZVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGhhbmRsZU1vdXNlRW50ZXJFdmVudCh0aW1lOiBEYXRlKSB7XHJcbiAgICAvLyBOZWVkIHRvIHVwZGF0ZSBzZWxlY3Rpb24gZHJhZnQgb24gbW91c2V1cCBhcyB3ZWxsIGluIG9yZGVyIHRvIGNhdGNoIHRoZSBjYXNlc1xyXG4gICAgLy8gd2hlcmUgdGhlIHVzZXIganVzdCBjbGlja3Mgb24gYSBzaW5nbGUgY2VsbCAoYmVjYXVzZSBubyBtb3VzZWVudGVyIGV2ZW50cyBmaXJlXHJcbiAgICAvLyBpbiB0aGlzIHNjZW5hcmlvKVxyXG4gICAgdGhpcy51cGRhdGVBdmFpbGFiaWxpdHlEcmFmdCh0aW1lKVxyXG4gIH1cclxuXHJcbiAgaGFuZGxlTW91c2VVcEV2ZW50KHRpbWU6IERhdGUpIHtcclxuICAgIHRoaXMudXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQodGltZSlcclxuICAgIC8vIERvbid0IGNhbGwgdGhpcy5lbmRTZWxlY3Rpb24oKSBoZXJlIGJlY2F1c2UgdGhlIGRvY3VtZW50IG1vdXNldXAgaGFuZGxlciB3aWxsIGRvIGl0XHJcbiAgfVxyXG5cclxuICBoYW5kbGVUb3VjaE1vdmVFdmVudChldmVudDogUmVhY3QuVG91Y2hFdmVudCkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7IGlzVG91Y2hEcmFnZ2luZzogdHJ1ZSB9KVxyXG4gICAgY29uc3QgY2VsbFRpbWUgPSB0aGlzLmdldFRpbWVGcm9tVG91Y2hFdmVudChldmVudClcclxuICAgIGlmIChjZWxsVGltZSkge1xyXG4gICAgICB0aGlzLnVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0KGNlbGxUaW1lKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaGFuZGxlVG91Y2hFbmRFdmVudCgpIHtcclxuICAgIGlmICghdGhpcy5zdGF0ZS5pc1RvdWNoRHJhZ2dpbmcpIHtcclxuICAgICAgLy8gR29pbmcgZG93biB0aGlzIGJyYW5jaCBtZWFucyB0aGUgdXNlciB0YXBwZWQgYnV0IGRpZG4ndCBkcmFnIC0tIHdoaWNoXHJcbiAgICAgIC8vIG1lYW5zIHRoZSBhdmFpbGFiaWxpdHkgZHJhZnQgaGFzbid0IHlldCBiZWVuIHVwZGF0ZWQgKHNpbmNlXHJcbiAgICAgIC8vIGhhbmRsZVRvdWNoTW92ZUV2ZW50IHdhcyBuZXZlciBjYWxsZWQpIHNvIHdlIG5lZWQgdG8gZG8gaXQgbm93XHJcbiAgICAgIHRoaXMudXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQobnVsbCwgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuZW5kU2VsZWN0aW9uKClcclxuICAgICAgfSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZW5kU2VsZWN0aW9uKClcclxuICAgIH1cclxuICAgIHRoaXMuc2V0U3RhdGUoeyBpc1RvdWNoRHJhZ2dpbmc6IGZhbHNlIH0pXHJcbiAgfVxyXG5cclxuICByZW5kZXJEYXRlQ2VsbFdyYXBwZXIgPSAodGltZTogRGF0ZSk6IEpTWC5FbGVtZW50ID0+IHtcclxuICAgIGNvbnN0IHN0YXJ0SGFuZGxlciA9ICgpID0+IHtcclxuICAgICAgdGhpcy5oYW5kbGVTZWxlY3Rpb25TdGFydEV2ZW50KHRpbWUpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBCb29sZWFuKHRoaXMuc3RhdGUuc2VsZWN0aW9uRHJhZnQuZmluZChhID0+IGlzU2FtZU1pbnV0ZShhLCB0aW1lKSkpXHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgPEdyaWRDZWxsXHJcbiAgICAgICAgY2xhc3NOYW1lPVwicmdkcF9fZ3JpZC1jZWxsXCJcclxuICAgICAgICByb2xlPVwicHJlc2VudGF0aW9uXCJcclxuICAgICAgICBrZXk9e3RpbWUudG9JU09TdHJpbmcoKX1cclxuICAgICAgICAvLyBNb3VzZSBoYW5kbGVyc1xyXG4gICAgICAgIG9uTW91c2VEb3duPXtzdGFydEhhbmRsZXJ9XHJcbiAgICAgICAgb25Nb3VzZUVudGVyPXsoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmhhbmRsZU1vdXNlRW50ZXJFdmVudCh0aW1lKVxyXG4gICAgICAgIH19XHJcbiAgICAgICAgb25Nb3VzZVVwPXsoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmhhbmRsZU1vdXNlVXBFdmVudCh0aW1lKVxyXG4gICAgICAgIH19XHJcbiAgICAgICAgLy8gVG91Y2ggaGFuZGxlcnNcclxuICAgICAgICAvLyBTaW5jZSB0b3VjaCBldmVudHMgZmlyZSBvbiB0aGUgZXZlbnQgd2hlcmUgdGhlIHRvdWNoLWRyYWcgc3RhcnRlZCwgdGhlcmUncyBubyBwb2ludCBpbiBwYXNzaW5nXHJcbiAgICAgICAgLy8gaW4gdGhlIHRpbWUgcGFyYW1ldGVyLCBpbnN0ZWFkIHRoZXNlIGhhbmRsZXJzIHdpbGwgZG8gdGhlaXIgam9iIHVzaW5nIHRoZSBkZWZhdWx0IEV2ZW50XHJcbiAgICAgICAgLy8gcGFyYW1ldGVyc1xyXG4gICAgICAgIG9uVG91Y2hTdGFydD17c3RhcnRIYW5kbGVyfVxyXG4gICAgICAgIG9uVG91Y2hNb3ZlPXt0aGlzLmhhbmRsZVRvdWNoTW92ZUV2ZW50fVxyXG4gICAgICAgIG9uVG91Y2hFbmQ9e3RoaXMuaGFuZGxlVG91Y2hFbmRFdmVudH1cclxuICAgICAgPlxyXG4gICAgICAgIHt0aGlzLnJlbmRlckRhdGVDZWxsKHRpbWUsIHNlbGVjdGVkKX1cclxuICAgICAgPC9HcmlkQ2VsbD5cclxuICAgIClcclxuICB9XHJcblxyXG4gIHJlbmRlckRhdGVDZWxsID0gKHRpbWU6IERhdGUsIHNlbGVjdGVkOiBib29sZWFuKTogSlNYLkVsZW1lbnQgPT4ge1xyXG4gICAgY29uc3QgcmVmU2V0dGVyID0gKGRhdGVDZWxsOiBIVE1MRWxlbWVudCB8IG51bGwpID0+IHtcclxuICAgICAgaWYgKGRhdGVDZWxsKSB7XHJcbiAgICAgICAgdGhpcy5jZWxsVG9EYXRlLnNldChkYXRlQ2VsbCwgdGltZSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMucHJvcHMucmVuZGVyRGF0ZUNlbGwpIHtcclxuICAgICAgcmV0dXJuIHRoaXMucHJvcHMucmVuZGVyRGF0ZUNlbGwodGltZSwgc2VsZWN0ZWQsIHJlZlNldHRlcilcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPERhdGVDZWxsXHJcbiAgICAgICAgICBzZWxlY3RlZD17c2VsZWN0ZWR9XHJcbiAgICAgICAgICByZWY9e3JlZlNldHRlcn1cclxuICAgICAgICAgIHNlbGVjdGVkQ29sb3I9e3RoaXMucHJvcHMuc2VsZWN0ZWRDb2xvcn1cclxuICAgICAgICAgIHVuc2VsZWN0ZWRDb2xvcj17dGhpcy5wcm9wcy51bnNlbGVjdGVkQ29sb3J9XHJcbiAgICAgICAgICBob3ZlcmVkQ29sb3I9e3RoaXMucHJvcHMuaG92ZXJlZENvbG9yfVxyXG4gICAgICAgIC8+XHJcbiAgICAgIClcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbmRlclRpbWVMYWJlbCA9ICh0aW1lOiBEYXRlKTogSlNYLkVsZW1lbnQgPT4ge1xyXG4gICAgaWYgKHRoaXMucHJvcHMucmVuZGVyVGltZUxhYmVsKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLnJlbmRlclRpbWVMYWJlbCh0aW1lKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIDxUaW1lVGV4dD57Zm9ybWF0RGF0ZSh0aW1lLCB0aGlzLnByb3BzLnRpbWVGb3JtYXQsIHsgbG9jYWxlOiBmciB9KX08L1RpbWVUZXh0PlxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVuZGVyRGF0ZUxhYmVsID0gKGRhdGU6IERhdGUpOiBKU1guRWxlbWVudCA9PiB7XHJcbiAgICBpZiAodGhpcy5wcm9wcy5yZW5kZXJEYXRlTGFiZWwpIHtcclxuICAgICAgcmV0dXJuIHRoaXMucHJvcHMucmVuZGVyRGF0ZUxhYmVsKGRhdGUpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gPERhdGVMYWJlbD57Zm9ybWF0RGF0ZShkYXRlLCB0aGlzLnByb3BzLmRhdGVGb3JtYXQsIHsgbG9jYWxlOiBmciB9KX08L0RhdGVMYWJlbD5cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbmRlckZ1bGxEYXRlR3JpZCgpOiBBcnJheTxKU1guRWxlbWVudD4ge1xyXG4gICAgY29uc3QgZmxhdHRlbmVkRGF0ZXM6IERhdGVbXSA9IFtdXHJcbiAgICBjb25zdCBudW1EYXlzID0gdGhpcy5zdGF0ZS5kYXRlcy5sZW5ndGhcclxuICAgIGNvbnN0IG51bVRpbWVzID0gdGhpcy5zdGF0ZS5kYXRlc1swXS5sZW5ndGhcclxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgbnVtVGltZXM7IGogKz0gMSkge1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bURheXM7IGkgKz0gMSkge1xyXG4gICAgICAgIGZsYXR0ZW5lZERhdGVzLnB1c2godGhpcy5zdGF0ZS5kYXRlc1tpXVtqXSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgZGF0ZUdyaWRFbGVtZW50cyA9IGZsYXR0ZW5lZERhdGVzLm1hcCh0aGlzLnJlbmRlckRhdGVDZWxsV3JhcHBlcilcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtVGltZXM7IGkgKz0gMSkge1xyXG4gICAgICBjb25zdCBpbmRleCA9IGkgKiBudW1EYXlzXHJcbiAgICAgIGNvbnN0IHRpbWUgPSB0aGlzLnN0YXRlLmRhdGVzWzBdW2ldXHJcbiAgICAgIC8vIEluamVjdCB0aGUgdGltZSBsYWJlbCBhdCB0aGUgc3RhcnQgb2YgZXZlcnkgcm93XHJcbiAgICAgIGRhdGVHcmlkRWxlbWVudHMuc3BsaWNlKGluZGV4ICsgaSwgMCwgdGhpcy5yZW5kZXJUaW1lTGFiZWwodGltZSkpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gW1xyXG4gICAgICAvLyBFbXB0eSB0b3AgbGVmdCBjb3JuZXJcclxuICAgICAgPGRpdiBrZXk9XCJ0b3BsZWZ0XCIgLz4sXHJcbiAgICAgIC8vIFRvcCByb3cgb2YgZGF0ZXNcclxuICAgICAgLi4udGhpcy5zdGF0ZS5kYXRlcy5tYXAoKGRheU9mVGltZXMsIGluZGV4KSA9PlxyXG4gICAgICAgIFJlYWN0LmNsb25lRWxlbWVudCh0aGlzLnJlbmRlckRhdGVMYWJlbChkYXlPZlRpbWVzWzBdKSwgeyBrZXk6IGBkYXRlLSR7aW5kZXh9YCB9KVxyXG4gICAgICApLFxyXG4gICAgICAvLyBFdmVyeSByb3cgYWZ0ZXIgdGhhdFxyXG4gICAgICAuLi5kYXRlR3JpZEVsZW1lbnRzLm1hcCgoZWxlbWVudCwgaW5kZXgpID0+IFJlYWN0LmNsb25lRWxlbWVudChlbGVtZW50LCB7IGtleTogYHRpbWUtJHtpbmRleH1gIH0pKVxyXG4gICAgXVxyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxXcmFwcGVyPlxyXG4gICAgICAgIDxHcmlkXHJcbiAgICAgICAgICBjb2x1bW5zPXt0aGlzLnN0YXRlLmRhdGVzLmxlbmd0aH1cclxuICAgICAgICAgIHJvd3M9e3RoaXMuc3RhdGUuZGF0ZXNbMF0ubGVuZ3RofVxyXG4gICAgICAgICAgY29sdW1uR2FwPXt0aGlzLnByb3BzLmNvbHVtbkdhcH1cclxuICAgICAgICAgIHJvd0dhcD17dGhpcy5wcm9wcy5yb3dHYXB9XHJcbiAgICAgICAgICByZWY9e2VsID0+IHtcclxuICAgICAgICAgICAgdGhpcy5ncmlkUmVmID0gZWxcclxuICAgICAgICAgIH19XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAge3RoaXMucmVuZGVyRnVsbERhdGVHcmlkKCl9XHJcbiAgICAgICAgPC9HcmlkPlxyXG4gICAgICA8L1dyYXBwZXI+XHJcbiAgICApXHJcbiAgfVxyXG59XHJcbiJdfQ==