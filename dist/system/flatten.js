'use strict';

System.register([], function (_export, _context) {
  "use strict";

  return {
    setters: [],
    execute: function () {
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
      }
      _export('flatten', flatten);

      ;
    }
  };
});