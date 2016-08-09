'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Statham = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extend = require('extend');

var _extend2 = _interopRequireDefault(_extend);

var _filesystem = require('./filesystem.js');

var _expand2 = require('./expand');

var _utils = require('./utils');

var _flatten2 = require('./flatten');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }



var MODE_FLAT = 'flat';
var MODE_NESTED = 'nested';
var MODES = [MODE_FLAT, MODE_NESTED];

var Statham = exports.Statham = function () {
  _createClass(Statham, null, [{
    key: 'MODE_NESTED',
    get: function get() {
      return MODE_NESTED;
    }
  }, {
    key: 'MODE_FLAT',
    get: function get() {
      return MODE_FLAT;
    }
  }]);

  function Statham(data, mode, filePath) {
    

    this.data = data || {};

    this.setMode(mode).setFileLocation(filePath);
  }

  Statham.fromFile = function fromFile(fileName, mode) {
    if (!_utils.Utils.isServer()) {
      return _utils.Utils.unsupportedEnvironment();
    }

    return _filesystem.FileSystem.fromFile(fileName).then(function (data) {
      return new Statham(data, mode, fileName);
    });
  };

  Statham.prototype.merge = function merge(sources) {
    var _this = this;

    sources = Array.isArray(sources) ? sources : Array.prototype.slice.call(arguments);
    var mergeData = [];

    sources.forEach(function (source) {
      if (!source) {
        return;
      }

      mergeData.push(_this.isModeFlat() ? (0, _flatten2.flatten)(source) : (0, _expand2.expand)(source));
    });

    _extend2.default.apply(_extend2.default, [true, this.data].concat(mergeData));

    return this;
  };

  Statham.prototype.setMode = function setMode(mode) {
    mode = mode || MODE_NESTED;

    if (MODES.indexOf(mode) === -1) {
      throw new Error('Invalid mode supplied. Must be one of "' + MODES.join('" or "') + '"');
    }

    this.mode = mode;

    return this;
  };

  Statham.prototype.getMode = function getMode() {
    return this.mode;
  };

  Statham.prototype.expand = function expand() {
    return this.isModeNested() ? this.data : (0, _expand2.expand)(this.data);
  };

  Statham.prototype.flatten = function flatten() {
    return this.isModeFlat() ? this.data : (0, _flatten2.flatten)(this.data);
  };

  Statham.prototype.isModeFlat = function isModeFlat() {
    return this.mode === MODE_FLAT;
  };

  Statham.prototype.isModeNested = function isModeNested() {
    return this.mode === MODE_NESTED;
  };

  Statham.prototype.fetch = function fetch(key, data) {
    var rest = _utils.Utils.normalizeKey(key);
    key = rest.shift();
    data = data || this.data;

    return rest.length === 0 ? data[key] : this.fetch(rest, data[key]);
  };

  Statham.prototype.put = function put(key, value) {
    if (this.isModeFlat() || key.search('.') === -1) {
      this.data[key] = value;

      return this;
    }

    var normalizedKey = _utils.Utils.normalizeKey(key);
    var lastKey = normalizedKey.pop();
    var source = this.fetch(normalizedKey);

    if ((typeof source === 'undefined' ? 'undefined' : _typeof(source)) === 'object') {
      source[lastKey] = value;
    }

    return this;
  };

  Statham.prototype.remove = function remove(key) {
    if (this.isModeFlat() || key.search('.') === -1) {
      delete this.data[key];

      return this;
    }

    var normalizedKey = _utils.Utils.normalizeKey(key);
    var lastKey = normalizedKey.pop();
    var source = this.fetch(normalizedKey);

    if ((typeof source === 'undefined' ? 'undefined' : _typeof(source)) === 'object') {
      delete source[lastKey];
    }

    return this;
  };

  Statham.prototype.setFileLocation = function setFileLocation(filePath) {
    this.filePath = filePath || undefined;

    return this;
  };

  Statham.prototype.save = function save(filePath, createPath) {
    if (!_utils.Utils.isServer()) {
      return _utils.Utils.unsupportedEnvironment();
    }

    if (typeof filePath === 'boolean') {
      createPath = filePath;
      filePath = undefined;
    }

    return _filesystem.FileSystem.save(filePath || this.filePath, !!createPath, this.data);
  };

  Statham.prototype.search = function search(phrase) {
    var found = [];
    var data = this.data;

    if (this.isModeNested()) {
      data = (0, _flatten2.flatten)(this.data);
    }

    Object.getOwnPropertyNames(data).forEach(function (key) {
      var searchTarget = Array.isArray(data[key]) ? JSON.stringify(data[key]) : data[key];

      if (searchTarget.search(phrase) > -1) {
        found.push({ key: key, value: data[key] });
      }
    });

    return found;
  };

  return Statham;
}();