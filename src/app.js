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
}
