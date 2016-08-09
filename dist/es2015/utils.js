
export let Utils = class Utils {
  static normalizeKey(rest) {
    rest = Array.isArray(rest) ? rest : Array.prototype.slice.call(arguments);
    let key = rest.shift();
    let normalized = Array.isArray(key) ? Utils.normalizeKey(key) : key.split('.');

    return rest.length === 0 ? normalized : normalized.concat(Utils.normalizeKey(rest));
  }

  static isServer() {
    return typeof window === 'undefined';
  }

  static unsupportedEnvironment() {
    return Promise.reject(new Error('Unsupported environment. This method only works on the server (node.js).'));
  }
};