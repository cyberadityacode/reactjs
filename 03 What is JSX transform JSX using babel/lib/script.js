"use strict";

var username = 'cyberaditya';
var sampleNameFunc = function sampleNameFunc() {
  return username + ' dc';
};
var showValue = false;
var h2 = /*#__PURE__*/React.createElement("h2", null, "Hello JSX ", /*#__PURE__*/React.createElement("b", null, username), " ", /*#__PURE__*/React.createElement("b", null, sampleNameFunc()), " ", showValue.toString(), " ");
console.log(h2);
var root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(h2);
//# sourceMappingURL=script.js.map