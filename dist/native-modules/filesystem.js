'use strict';



import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';

export var FileSystem = function () {
  function FileSystem() {
    
  }

  FileSystem.fromFile = function fromFile(fileName) {
    return new Promise(function (resolve, reject) {
      fs.readFile(fileName, 'utf8', function (error, data) {
        if (error) {
          return reject(error);
        }

        var parsed = void 0;

        try {
          parsed = JSON.parse(data);
        } catch (exception) {
          return reject(exception);
        }

        resolve(parsed);
      });
    });
  };

  FileSystem.save = function save(filePath, createPath, data) {
    return new Promise(function (resolve, reject) {
      if (typeof filePath === 'undefined') {
        return reject(new Error('Path undefined.'));
      }

      if (createPath) {
        return mkdirp(path.dirname(filePath), function (error) {
          if (error) {
            return reject(error);
          }

          return FileSystem.save(filePath, false, data).then(resolve).catch(reject);
        });
      }

      fs.writeFile(filePath, JSON.stringify(data), function (error) {
        if (error) {
          return reject(error);
        }

        resolve();
      });
    });
  };

  return FileSystem;
}();