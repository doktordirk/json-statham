'use strict';

import extend from 'extend';
import { FileSystem } from './filesystem.js';
import { expand } from './expand';
import { Utils } from './utils';
import { flatten } from './flatten';

const MODE_FLAT = 'flat';
const MODE_NESTED = 'nested';
const MODES = [MODE_FLAT, MODE_NESTED];

export let Statham = class Statham {
  static get MODE_NESTED() {
    return MODE_NESTED;
  }

  static get MODE_FLAT() {
    return MODE_FLAT;
  }

  constructor(data, mode, filePath) {
    this.data = data || {};

    this.setMode(mode).setFileLocation(filePath);
  }

  static fromFile(fileName, mode) {
    if (!Utils.isServer()) {
      return Utils.unsupportedEnvironment();
    }

    return FileSystem.fromFile(fileName).then(data => new Statham(data, mode, fileName));
  }

  merge(sources) {
    sources = Array.isArray(sources) ? sources : Array.prototype.slice.call(arguments);
    let mergeData = [];

    sources.forEach(source => {
      if (!source) {
        return;
      }

      mergeData.push(this.isModeFlat() ? flatten(source) : expand(source));
    });

    extend.apply(extend, [true, this.data].concat(mergeData));

    return this;
  }

  setMode(mode) {
    mode = mode || MODE_NESTED;

    if (MODES.indexOf(mode) === -1) {
      throw new Error(`Invalid mode supplied. Must be one of "${ MODES.join('" or "') }"`);
    }

    this.mode = mode;

    return this;
  }

  getMode() {
    return this.mode;
  }

  expand() {
    return this.isModeNested() ? this.data : expand(this.data);
  }

  flatten() {
    return this.isModeFlat() ? this.data : flatten(this.data);
  }

  isModeFlat() {
    return this.mode === MODE_FLAT;
  }

  isModeNested() {
    return this.mode === MODE_NESTED;
  }

  fetch(key, data) {
    let rest = Utils.normalizeKey(key);
    key = rest.shift();
    data = data || this.data;

    return rest.length === 0 ? data[key] : this.fetch(rest, data[key]);
  }

  put(key, value) {
    if (this.isModeFlat() || key.search('.') === -1) {
      this.data[key] = value;

      return this;
    }

    let normalizedKey = Utils.normalizeKey(key);
    let lastKey = normalizedKey.pop();
    let source = this.fetch(normalizedKey);

    if (typeof source === 'object') {
      source[lastKey] = value;
    }

    return this;
  }

  remove(key) {
    if (this.isModeFlat() || key.search('.') === -1) {
      delete this.data[key];

      return this;
    }

    let normalizedKey = Utils.normalizeKey(key);
    let lastKey = normalizedKey.pop();
    let source = this.fetch(normalizedKey);

    if (typeof source === 'object') {
      delete source[lastKey];
    }

    return this;
  }

  setFileLocation(filePath) {
    this.filePath = filePath || undefined;

    return this;
  }

  save(filePath, createPath) {
    if (!Utils.isServer()) {
      return Utils.unsupportedEnvironment();
    }

    if (typeof filePath === 'boolean') {
      createPath = filePath;
      filePath = undefined;
    }

    return FileSystem.save(filePath || this.filePath, !!createPath, this.data);
  }

  search(phrase) {
    let found = [];
    let data = this.data;

    if (this.isModeNested()) {
      data = flatten(this.data);
    }

    Object.getOwnPropertyNames(data).forEach(key => {
      let searchTarget = Array.isArray(data[key]) ? JSON.stringify(data[key]) : data[key];

      if (searchTarget.search(phrase) > -1) {
        found.push({ key: key, value: data[key] });
      }
    });

    return found;
  }
};