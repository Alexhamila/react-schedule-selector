"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Text = exports.Subtitle = void 0;

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _colors = _interopRequireDefault(require("./colors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Subtitle = _styledComponents.default.h2.withConfig({
  displayName: "typography__Subtitle",
  componentId: "jsvm8p-0"
})(["font-size:20px;font-weight:400;color:", ";text-align:", ";@media (max-width:700px){font-size:18px;}"], _colors.default.black, props => props.align || 'center');

exports.Subtitle = Subtitle;

const Text = _styledComponents.default.p.withConfig({
  displayName: "typography__Text",
  componentId: "jsvm8p-1"
})(["font-size:14px;font-weight:300;line-height:", "px;color:", ";margin:5px 0;"], 14 * 1.37, _colors.default.grey);

exports.Text = Text;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvdHlwb2dyYXBoeS50cyJdLCJuYW1lcyI6WyJTdWJ0aXRsZSIsInN0eWxlZCIsImgyIiwiY29sb3JzIiwiYmxhY2siLCJwcm9wcyIsImFsaWduIiwiVGV4dCIsInAiLCJncmV5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFFTyxNQUFNQSxRQUFRLEdBQUdDLDBCQUFPQyxFQUFWO0FBQUE7QUFBQTtBQUFBLDRHQUdWQyxnQkFBT0MsS0FIRyxFQUlMQyxLQUFLLElBQUlBLEtBQUssQ0FBQ0MsS0FBTixJQUFlLFFBSm5CLENBQWQ7Ozs7QUFXQSxNQUFNQyxJQUFJLEdBQUdOLDBCQUFPTyxDQUFWO0FBQUE7QUFBQTtBQUFBLG1GQUdBLEtBQUssSUFITCxFQUlOTCxnQkFBT00sSUFKRCxDQUFWIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cydcclxuaW1wb3J0IGNvbG9ycyBmcm9tICcuL2NvbG9ycydcclxuXHJcbmV4cG9ydCBjb25zdCBTdWJ0aXRsZSA9IHN0eWxlZC5oMjx7IGFsaWduPzogc3RyaW5nfT5gXHJcbiAgZm9udC1zaXplOiAyMHB4O1xyXG4gIGZvbnQtd2VpZ2h0OiA0MDA7XHJcbiAgY29sb3I6ICR7Y29sb3JzLmJsYWNrfTtcclxuICB0ZXh0LWFsaWduOiAke3Byb3BzID0+IHByb3BzLmFsaWduIHx8ICdjZW50ZXInfTtcclxuXHJcbiAgQG1lZGlhIChtYXgtd2lkdGg6IDcwMHB4KSB7XHJcbiAgICBmb250LXNpemU6IDE4cHg7XHJcbiAgfVxyXG5gXHJcblxyXG5leHBvcnQgY29uc3QgVGV4dCA9IHN0eWxlZC5wYFxyXG4gIGZvbnQtc2l6ZTogMTRweDtcclxuICBmb250LXdlaWdodDogMzAwO1xyXG4gIGxpbmUtaGVpZ2h0OiAkezE0ICogMS4zN31weDtcclxuICBjb2xvcjogJHtjb2xvcnMuZ3JleX07XHJcbiAgbWFyZ2luOiA1cHggMDtcclxuYFxyXG4iXX0=