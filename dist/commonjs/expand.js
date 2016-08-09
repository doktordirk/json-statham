'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expand = expand;
function expand(source) {
  var destination = {};

  Object.getOwnPropertyNames(source).forEach(function (flatKey) {
    if (flatKey.indexOf('.') === -1) {
      destination[flatKey] = source[flatKey];

      return;
    }

    var tmp = destination;
    var keys = flatKey.split('.');
    var key = keys.pop();

    keys.forEach(function (value) {
      if (typeof tmp[value] === 'undefined') {
        tmp[value] = {};
      }

      tmp = tmp[value];
    });

    tmp[key] = source[flatKey];
  });

  return destination;
};