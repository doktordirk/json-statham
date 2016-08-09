'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonStatham = require('./json-statham');

Object.keys(_jsonStatham).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _jsonStatham[key];
    }
  });
});