import { Asset } from './asset/asset';

const path = require('path');
const fs = require('fs');
const bresolve = require('browser-resolve');
const resolve = require('resolve');
const chalk = require('chalk');

function resolveSync(lib, base, exts) {
  try {
    return resolve.sync(lib, {
      basedir: base,
      extensions: exts,
    });
  } catch (e) {}
}

const fileMap = new Map();
function exists(file) {
  if (fileMap.has(file)) return file;
  if (fs.existsSync(file)) {
    fileMap.set(file, file);
    return file;
  }
  return false;
}

const resolveAlias = (lib: string, exts: string[], alias: any, asset: Asset) => {
  const aliasArr = Object.keys(alias);
  for (let i = 0; i < aliasArr.length; i++) {
    if (lib.startsWith(aliasArr[i])) {
      const re = lib.replace(aliasArr[i], '');
      for (let j = 0; j < exts.length; j++) {
        let aliasTarget = alias[aliasArr[i]];
        if (typeof aliasTarget === 'function') {
          aliasTarget = aliasTarget(asset, lib);
          // eslint-disable-next-line no-continue
          if (!aliasTarget) continue;
        }
        let filePath = path.join(aliasTarget, re);
        filePath += filePath.endsWith(exts[j]) ? '' : exts[j];
        if (exists(filePath)) {
          return filePath;
        }
        filePath = path.join(aliasTarget, re, 'index') + (re.endsWith(exts[j]) ? '' : exts[j]);
        if (exists(filePath)) {
          return filePath;
        }
      }
    }
  }
};

module.exports = (lib, asset, exts = [], src = '', alias = {}, ignoreNotFound = false) => {
  let libPath = resolveAlias(lib, exts, alias, asset);
  if (libPath) return libPath;
  if (lib[0] === '.') {
    libPath = resolveSync(lib, asset.dir, exts);
  } else if (lib[0] === '/') {
    if (src) {
      libPath = resolveSync(`.${lib}`, src, exts);
    }
    if (!libPath) {
      for (let j = 0; j < exts.length; j++) {
        const _libPath = lib.endsWith(exts[j]) ? lib : lib + exts[j];
        if (exists(_libPath)) {
          libPath = _libPath;
          break;
        }
      }
    }
  } else {
    // npm ??????
    try {
      // libPath = resolveSync(lib, asset.dir, exts);
      // ??????????????????
      libPath = resolve.sync(path.join(asset.dir, lib), { extensions: exts });
    } catch (e) {
      // ????????????????????????node_modules????????????????????????
      try {
        libPath = bresolve.sync(lib, {
          basedir: asset.dir,
          filename: asset.path,
          extensions: exts,
          includeCoreModules: false,
        });
      } catch (e) {
      } finally {
        // ??????????????????????????????npm???????????????????????????
        // if (!(libPath && libPath.startsWith(process.cwd()))) {
        //     libPath = bresolve.sync(lib, {
        //         basedir: asset.dir,
        //         filename: asset.path,
        //         includeCoreModules: false,
        //     });
        // }
      }
    }
  }
  if (!libPath && !ignoreNotFound) {
    console.error(chalk.red('[mpbuild resolve]'), lib, exts, src, alias);
  }
  return libPath;
};
module.exports.resolveAlias = resolveAlias;
module.exports.resolveSync = resolveSync;
