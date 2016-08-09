'use strict';

System.register([], function (_export, _context) {
  "use strict";

  var Utils;

  

  return {
    setters: [],
    execute: function () {
      _export('Utils', Utils = function () {
        function Utils() {
          
        }

        Utils.normalizeKey = function normalizeKey(rest) {
          rest = Array.isArray(rest) ? rest : Array.prototype.slice.call(arguments);
          var key = rest.shift();
          var normalized = Array.isArray(key) ? Utils.normalizeKey(key) : key.split('.');

          return rest.length === 0 ? normalized : normalized.concat(Utils.normalizeKey(rest));
        };

        Utils.isServer = function isServer() {
          return typeof window === 'undefined';
        };

        Utils.unsupportedEnvironment = function unsupportedEnvironment() {
          return Promise.reject(new Error('Unsupported environment. This method only works on the server (node.js).'));
        };

        return Utils;
      }());

      _export('Utils', Utils);
    }
  };
});