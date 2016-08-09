define(['exports', './json-statham'], function (exports, _jsonStatham) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.keys(_jsonStatham).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _jsonStatham[key];
      }
    });
  });
});