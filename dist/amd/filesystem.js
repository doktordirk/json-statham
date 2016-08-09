define(['exports', 'fs', 'path', 'mkdirp'], function (exports, _fs, _path, _mkdirp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.FileSystem = undefined;

  var _fs2 = _interopRequireDefault(_fs);

  var _path2 = _interopRequireDefault(_path);

  var _mkdirp2 = _interopRequireDefault(_mkdirp);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  

  var FileSystem = exports.FileSystem = function () {
    function FileSystem() {
      
    }

    FileSystem.fromFile = function fromFile(fileName) {
      return new Promise(function (resolve, reject) {
        _fs2.default.readFile(fileName, 'utf8', function (error, data) {
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
          return (0, _mkdirp2.default)(_path2.default.dirname(filePath), function (error) {
            if (error) {
              return reject(error);
            }

            return FileSystem.save(filePath, false, data).then(resolve).catch(reject);
          });
        }

        _fs2.default.writeFile(filePath, JSON.stringify(data), function (error) {
          if (error) {
            return reject(error);
          }

          resolve();
        });
      });
    };

    return FileSystem;
  }();
});