"use strict";

require("core-js/modules/es.array.reduce");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isBefore = _interopRequireDefault(require("date-fns/isBefore"));

var _startOfDay = _interopRequireDefault(require("date-fns/startOfDay"));

var dateUtils = _interopRequireWildcard(require("../date-utils"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const square = (selectionStart, selectionEnd, dateList) => {
  let selected = [];

  if (selectionEnd == null) {
    if (selectionStart) selected = [selectionStart];
  } else if (selectionStart) {
    const dateIsReversed = (0, _isBefore.default)((0, _startOfDay.default)(selectionEnd), (0, _startOfDay.default)(selectionStart));
    const timeIsReversed = selectionStart.getHours() > selectionEnd.getHours();
    selected = dateList.reduce((acc, dayOfTimes) => acc.concat(dayOfTimes.filter(t => selectionStart && selectionEnd && dateUtils.dateIsBetween(dateIsReversed ? selectionEnd : selectionStart, t, dateIsReversed ? selectionStart : selectionEnd) && dateUtils.timeIsBetween(timeIsReversed ? selectionEnd : selectionStart, t, timeIsReversed ? selectionStart : selectionEnd))), []);
  }

  return selected;
};

var _default = square;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvc2VsZWN0aW9uLXNjaGVtZXMvc3F1YXJlLnRzIl0sIm5hbWVzIjpbInNxdWFyZSIsInNlbGVjdGlvblN0YXJ0Iiwic2VsZWN0aW9uRW5kIiwiZGF0ZUxpc3QiLCJzZWxlY3RlZCIsImRhdGVJc1JldmVyc2VkIiwidGltZUlzUmV2ZXJzZWQiLCJnZXRIb3VycyIsInJlZHVjZSIsImFjYyIsImRheU9mVGltZXMiLCJjb25jYXQiLCJmaWx0ZXIiLCJ0IiwiZGF0ZVV0aWxzIiwiZGF0ZUlzQmV0d2VlbiIsInRpbWVJc0JldHdlZW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUVBOzs7Ozs7OztBQUVBLE1BQU1BLE1BQU0sR0FBRyxDQUFDQyxjQUFELEVBQThCQyxZQUE5QixFQUF5REMsUUFBekQsS0FBdUc7QUFDcEgsTUFBSUMsUUFBcUIsR0FBRyxFQUE1Qjs7QUFDQSxNQUFJRixZQUFZLElBQUksSUFBcEIsRUFBMEI7QUFDeEIsUUFBSUQsY0FBSixFQUFvQkcsUUFBUSxHQUFHLENBQUNILGNBQUQsQ0FBWDtBQUNyQixHQUZELE1BRU8sSUFBSUEsY0FBSixFQUFvQjtBQUN6QixVQUFNSSxjQUFjLEdBQUcsdUJBQVMseUJBQVdILFlBQVgsQ0FBVCxFQUFtQyx5QkFBV0QsY0FBWCxDQUFuQyxDQUF2QjtBQUNBLFVBQU1LLGNBQWMsR0FBR0wsY0FBYyxDQUFDTSxRQUFmLEtBQTRCTCxZQUFZLENBQUNLLFFBQWIsRUFBbkQ7QUFFQUgsSUFBQUEsUUFBUSxHQUFHRCxRQUFRLENBQUNLLE1BQVQsQ0FDVCxDQUFDQyxHQUFELEVBQU1DLFVBQU4sS0FDRUQsR0FBRyxDQUFDRSxNQUFKLENBQ0VELFVBQVUsQ0FBQ0UsTUFBWCxDQUNFQyxDQUFDLElBQ0NaLGNBQWMsSUFDZEMsWUFEQSxJQUVBWSxTQUFTLENBQUNDLGFBQVYsQ0FDRVYsY0FBYyxHQUFHSCxZQUFILEdBQWtCRCxjQURsQyxFQUVFWSxDQUZGLEVBR0VSLGNBQWMsR0FBR0osY0FBSCxHQUFvQkMsWUFIcEMsQ0FGQSxJQU9BWSxTQUFTLENBQUNFLGFBQVYsQ0FDRVYsY0FBYyxHQUFHSixZQUFILEdBQWtCRCxjQURsQyxFQUVFWSxDQUZGLEVBR0VQLGNBQWMsR0FBR0wsY0FBSCxHQUFvQkMsWUFIcEMsQ0FUSixDQURGLENBRk8sRUFtQlQsRUFuQlMsQ0FBWDtBQXFCRDs7QUFFRCxTQUFPRSxRQUFQO0FBQ0QsQ0FoQ0Q7O2VBa0NlSixNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGlzQmVmb3JlIGZyb20gJ2RhdGUtZm5zL2lzQmVmb3JlJ1xyXG5pbXBvcnQgc3RhcnRPZkRheSBmcm9tICdkYXRlLWZucy9zdGFydE9mRGF5J1xyXG5cclxuaW1wb3J0ICogYXMgZGF0ZVV0aWxzIGZyb20gJy4uL2RhdGUtdXRpbHMnXHJcblxyXG5jb25zdCBzcXVhcmUgPSAoc2VsZWN0aW9uU3RhcnQ6IERhdGUgfCBudWxsLCBzZWxlY3Rpb25FbmQ6IERhdGUgfCBudWxsLCBkYXRlTGlzdDogQXJyYXk8QXJyYXk8RGF0ZT4+KTogQXJyYXk8RGF0ZT4gPT4ge1xyXG4gIGxldCBzZWxlY3RlZDogQXJyYXk8RGF0ZT4gPSBbXVxyXG4gIGlmIChzZWxlY3Rpb25FbmQgPT0gbnVsbCkge1xyXG4gICAgaWYgKHNlbGVjdGlvblN0YXJ0KSBzZWxlY3RlZCA9IFtzZWxlY3Rpb25TdGFydF1cclxuICB9IGVsc2UgaWYgKHNlbGVjdGlvblN0YXJ0KSB7XHJcbiAgICBjb25zdCBkYXRlSXNSZXZlcnNlZCA9IGlzQmVmb3JlKHN0YXJ0T2ZEYXkoc2VsZWN0aW9uRW5kKSwgc3RhcnRPZkRheShzZWxlY3Rpb25TdGFydCkpXHJcbiAgICBjb25zdCB0aW1lSXNSZXZlcnNlZCA9IHNlbGVjdGlvblN0YXJ0LmdldEhvdXJzKCkgPiBzZWxlY3Rpb25FbmQuZ2V0SG91cnMoKVxyXG5cclxuICAgIHNlbGVjdGVkID0gZGF0ZUxpc3QucmVkdWNlKFxyXG4gICAgICAoYWNjLCBkYXlPZlRpbWVzKSA9PlxyXG4gICAgICAgIGFjYy5jb25jYXQoXHJcbiAgICAgICAgICBkYXlPZlRpbWVzLmZpbHRlcihcclxuICAgICAgICAgICAgdCA9PlxyXG4gICAgICAgICAgICAgIHNlbGVjdGlvblN0YXJ0ICYmXHJcbiAgICAgICAgICAgICAgc2VsZWN0aW9uRW5kICYmXHJcbiAgICAgICAgICAgICAgZGF0ZVV0aWxzLmRhdGVJc0JldHdlZW4oXHJcbiAgICAgICAgICAgICAgICBkYXRlSXNSZXZlcnNlZCA/IHNlbGVjdGlvbkVuZCA6IHNlbGVjdGlvblN0YXJ0LFxyXG4gICAgICAgICAgICAgICAgdCxcclxuICAgICAgICAgICAgICAgIGRhdGVJc1JldmVyc2VkID8gc2VsZWN0aW9uU3RhcnQgOiBzZWxlY3Rpb25FbmRcclxuICAgICAgICAgICAgICApICYmXHJcbiAgICAgICAgICAgICAgZGF0ZVV0aWxzLnRpbWVJc0JldHdlZW4oXHJcbiAgICAgICAgICAgICAgICB0aW1lSXNSZXZlcnNlZCA/IHNlbGVjdGlvbkVuZCA6IHNlbGVjdGlvblN0YXJ0LFxyXG4gICAgICAgICAgICAgICAgdCxcclxuICAgICAgICAgICAgICAgIHRpbWVJc1JldmVyc2VkID8gc2VsZWN0aW9uU3RhcnQgOiBzZWxlY3Rpb25FbmRcclxuICAgICAgICAgICAgICApXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgKSxcclxuICAgICAgW11cclxuICAgIClcclxuICB9XHJcblxyXG4gIHJldHVybiBzZWxlY3RlZFxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBzcXVhcmVcclxuIl19