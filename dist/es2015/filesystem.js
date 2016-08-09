'use strict';

import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';

export let FileSystem = class FileSystem {
  static fromFile(fileName) {
    return new Promise((resolve, reject) => {
      fs.readFile(fileName, 'utf8', (error, data) => {
        if (error) {
          return reject(error);
        }

        let parsed;

        try {
          parsed = JSON.parse(data);
        } catch (exception) {
          return reject(exception);
        }

        resolve(parsed);
      });
    });
  }

  static save(filePath, createPath, data) {
    return new Promise((resolve, reject) => {
      if (typeof filePath === 'undefined') {
        return reject(new Error('Path undefined.'));
      }

      if (createPath) {
        return mkdirp(path.dirname(filePath), error => {
          if (error) {
            return reject(error);
          }

          return FileSystem.save(filePath, false, data).then(resolve).catch(reject);
        });
      }

      fs.writeFile(filePath, JSON.stringify(data), error => {
        if (error) {
          return reject(error);
        }

        resolve();
      });
    });
  }
};