'use strict';

export function flatten(source, basePath, target) {
  basePath = basePath || '';
  target = target || {};

  Object.getOwnPropertyNames(source).forEach(key => {
    if (source[key].constructor === Object) {
      flatten(source[key], basePath + key + '.', target);

      return;
    }

    target[basePath + key] = source[key];
  });

  return target;
};