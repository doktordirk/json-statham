define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.flatten = flatten;
  function flatten(source, basePath, target) {
    basePath = basePath || '';
    target = target || {};

    Object.getOwnPropertyNames(source).forEach(function (key) {
      if (source[key].constructor === Object) {
        flatten(source[key], basePath + key + '.', target);

        return;
      }

      target[basePath + key] = source[key];
    });

    return target;
  };
});