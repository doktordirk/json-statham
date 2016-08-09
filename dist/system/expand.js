'use strict';

System.register([], function (_export, _context) {
  "use strict";

  return {
    setters: [],
    execute: function () {
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
      }
      _export('expand', expand);

      ;
    }
  };
});