import path from 'path';
import { createInterface } from 'readline/promises';
import { brotli, files, hash, nwd, sysInfo } from 'readline/promises';
import { getDirFromPath, isPathToFile, parseInput } from './helpers.js';
import { MESSAGES } from './messages';

export class App {
  constructor(rootDir) {
    this._currentPath = rootDir;
  }

  _resolvePath(p) {
    return path.resolve(this._currentPath, p);
  }

  async up() {
    const pathToUpperDir = this._resolvePath('..');
    this._currentPath = await nwd.cd(pathToUpperDir);
  }

  async cd() {
    const pathToDir = this._resolvePath(args[0]);
    this._currentPath = await nwd.cd(pathToDir);
  }

  async ls() {
    await nwd.ls(this._currentPath);
  }

  async cat(args) {
    const pathToFile = this._resolvePath(args[0]);
    await files.cat(pathToFile);
  }

  async add(args) {
    const newFileName = this._resolvePath(args[0]);
    await files.add(newFileName);
  }

  async rn(args) {
    const pathToFile = this._resolvePath(args[0]);
    const dir = getDirFromPath(pathToFile);
    const newPathToFile = path.resolve(dir, args[1]);
    await files.rn(pathToFile, newPathToFile);
  }

  async cp(args) {
    const pathToOldFile = this._resolvePath(args[0]);
    const pathToNewFile = this._resolvePath(args[1]);
    await files.cp(pathToOldFile, pathToNewFile);
  }

  async mv(args) {
    const pathToOldFile = this._resolvePath(args[0]);
    const pathToNewFile = this._resolvePath(args[1]);
    await files.mv(pathToOldFile, pathToNewFile);
  }

  async rm(args) {
    const pathToFile = this._resolvePath(args[0]);
    await files.mv(pathToFile);
  }

  os(args) {
    sysInfo(args[0]);
  }

  async hash(args) {
    const pathToFile = this._resolvePath(args[0]);
    await hash(pathToFile);
  }

  async compress(args) {
    const pathToSrc = this._resolvePath(args[0]);
    const pathToDest = this._resolvePath(args[1]);
    await brotli.compress(pathToSrc, pathToDest);
  }

  async decompress(args) {
    const pathToSrc = this._resolvePath(args[0]);
    const pathToDest = this._resolvePath(args[1]);
    await brotli.decompress(pathToSrc, pathToDest);
  }

  ['.exit']() {
    process.exit();
  }

  validate(command, args) {
    switch (command) {
      case 'up':
      case 'ls':
      case '.exit':
        return true;

      case 'cd':
      case 'cat':
      case 'rm':
      case 'os':
      case 'hash':
      case 'cat':
        if (args[0]) {
          return true;
        }

      case 'mw':
      case 'cp':
      case 'compress':
      case 'decompress':
        if (args[0] && args[1]) {
          return true;
        }

      case 'add':
        if (args[0] && isPathToFile(args[0])) {
          return true;
        }

      case 'rn':
        if (args[0] && args[1] && isPathToFile(args[1])) {
          return true;
        }

      default:
        return false;
    }
  }
}
