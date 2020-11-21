"use strict";

require("core-js/modules/es.array.reduce");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isBefore = _interopRequireDefault(require("date-fns/isBefore"));

var dateUtils = _interopRequireWildcard(require("../date-utils"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const linear = (selectionStart, selectionEnd, dateList) => {
  let selected = [];

  if (selectionEnd == null) {
    if (selectionStart) selected = [selectionStart];
  } else if (selectionStart) {
    const reverseSelection = (0, _isBefore.default)(selectionEnd, selectionStart);
    selected = dateList.reduce((acc, dayOfTimes) => acc.concat(dayOfTimes.filter(t => selectionStart && selectionEnd && dateUtils.dateHourIsBetween(reverseSelection ? selectionEnd : selectionStart, t, reverseSelection ? selectionStart : selectionEnd))), []);
  }

  return selected;
};

var _default = linear;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvc2VsZWN0aW9uLXNjaGVtZXMvbGluZWFyLnRzIl0sIm5hbWVzIjpbImxpbmVhciIsInNlbGVjdGlvblN0YXJ0Iiwic2VsZWN0aW9uRW5kIiwiZGF0ZUxpc3QiLCJzZWxlY3RlZCIsInJldmVyc2VTZWxlY3Rpb24iLCJyZWR1Y2UiLCJhY2MiLCJkYXlPZlRpbWVzIiwiY29uY2F0IiwiZmlsdGVyIiwidCIsImRhdGVVdGlscyIsImRhdGVIb3VySXNCZXR3ZWVuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7QUFFQTs7Ozs7Ozs7QUFFQSxNQUFNQSxNQUFNLEdBQUcsQ0FBQ0MsY0FBRCxFQUE4QkMsWUFBOUIsRUFBeURDLFFBQXpELEtBQXVHO0FBQ3BILE1BQUlDLFFBQXFCLEdBQUcsRUFBNUI7O0FBQ0EsTUFBSUYsWUFBWSxJQUFJLElBQXBCLEVBQTBCO0FBQ3hCLFFBQUlELGNBQUosRUFBb0JHLFFBQVEsR0FBRyxDQUFDSCxjQUFELENBQVg7QUFDckIsR0FGRCxNQUVPLElBQUlBLGNBQUosRUFBb0I7QUFDekIsVUFBTUksZ0JBQWdCLEdBQUcsdUJBQVNILFlBQVQsRUFBdUJELGNBQXZCLENBQXpCO0FBQ0FHLElBQUFBLFFBQVEsR0FBR0QsUUFBUSxDQUFDRyxNQUFULENBQ1QsQ0FBQ0MsR0FBRCxFQUFNQyxVQUFOLEtBQ0VELEdBQUcsQ0FBQ0UsTUFBSixDQUNFRCxVQUFVLENBQUNFLE1BQVgsQ0FDRUMsQ0FBQyxJQUNDVixjQUFjLElBQ2RDLFlBREEsSUFFQVUsU0FBUyxDQUFDQyxpQkFBVixDQUNFUixnQkFBZ0IsR0FBR0gsWUFBSCxHQUFrQkQsY0FEcEMsRUFFRVUsQ0FGRixFQUdFTixnQkFBZ0IsR0FBR0osY0FBSCxHQUFvQkMsWUFIdEMsQ0FKSixDQURGLENBRk8sRUFjVCxFQWRTLENBQVg7QUFnQkQ7O0FBQ0QsU0FBT0UsUUFBUDtBQUNELENBeEJEOztlQTBCZUosTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBpc0JlZm9yZSBmcm9tICdkYXRlLWZucy9pc0JlZm9yZSdcclxuXHJcbmltcG9ydCAqIGFzIGRhdGVVdGlscyBmcm9tICcuLi9kYXRlLXV0aWxzJ1xyXG5cclxuY29uc3QgbGluZWFyID0gKHNlbGVjdGlvblN0YXJ0OiBEYXRlIHwgbnVsbCwgc2VsZWN0aW9uRW5kOiBEYXRlIHwgbnVsbCwgZGF0ZUxpc3Q6IEFycmF5PEFycmF5PERhdGU+Pik6IEFycmF5PERhdGU+ID0+IHtcclxuICBsZXQgc2VsZWN0ZWQ6IEFycmF5PERhdGU+ID0gW11cclxuICBpZiAoc2VsZWN0aW9uRW5kID09IG51bGwpIHtcclxuICAgIGlmIChzZWxlY3Rpb25TdGFydCkgc2VsZWN0ZWQgPSBbc2VsZWN0aW9uU3RhcnRdXHJcbiAgfSBlbHNlIGlmIChzZWxlY3Rpb25TdGFydCkge1xyXG4gICAgY29uc3QgcmV2ZXJzZVNlbGVjdGlvbiA9IGlzQmVmb3JlKHNlbGVjdGlvbkVuZCwgc2VsZWN0aW9uU3RhcnQpXHJcbiAgICBzZWxlY3RlZCA9IGRhdGVMaXN0LnJlZHVjZShcclxuICAgICAgKGFjYywgZGF5T2ZUaW1lcykgPT5cclxuICAgICAgICBhY2MuY29uY2F0KFxyXG4gICAgICAgICAgZGF5T2ZUaW1lcy5maWx0ZXIoXHJcbiAgICAgICAgICAgIHQgPT5cclxuICAgICAgICAgICAgICBzZWxlY3Rpb25TdGFydCAmJlxyXG4gICAgICAgICAgICAgIHNlbGVjdGlvbkVuZCAmJlxyXG4gICAgICAgICAgICAgIGRhdGVVdGlscy5kYXRlSG91cklzQmV0d2VlbihcclxuICAgICAgICAgICAgICAgIHJldmVyc2VTZWxlY3Rpb24gPyBzZWxlY3Rpb25FbmQgOiBzZWxlY3Rpb25TdGFydCxcclxuICAgICAgICAgICAgICAgIHQsXHJcbiAgICAgICAgICAgICAgICByZXZlcnNlU2VsZWN0aW9uID8gc2VsZWN0aW9uU3RhcnQgOiBzZWxlY3Rpb25FbmRcclxuICAgICAgICAgICAgICApXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgKSxcclxuICAgICAgW11cclxuICAgIClcclxuICB9XHJcbiAgcmV0dXJuIHNlbGVjdGVkXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGxpbmVhclxyXG4iXX0=