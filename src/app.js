import path from 'path';
import { createInterface } from 'readline/promises';
import { brotli, files, hash, nwd, sysInfo } from './commands/index.js';
import { getDirFromPath, isPathToFile, parseInput } from './helpers.js';
import { MESSAGES } from './messages.js';

export class App {
  constructor(rootDir) {
    this._currentPath = rootDir;
  }

  _resolvePath(p) {
    return path.resolve(this._currentPath, p);
  }

  ['.exit']() {
    process.exit();
  }

  async up() {
    const pathToUpperDir = this._resolvePath('..');
    this._currentPath = await nwd.cd(pathToUpperDir);
  }

  async ls() {
    await nwd.ls(this._currentPath);
  }

  os([flag]) {
    sysInfo(flag);
  }

  async cd([src]) {
    const pathToDir = this._resolvePath(src);
    this._currentPath = await nwd.cd(pathToDir);
  }

  async cat([src]) {
    const pathToFile = this._resolvePath(src);
    await files.cat(pathToFile);
  }

  async add([src]) {
    const newFileName = this._resolvePath(src);
    await files.add(newFileName);
  }

  async rm([src]) {
    const pathToFile = this._resolvePath(src);
    await files.rm(pathToFile);
  }

  async hash([src]) {
    const pathToFile = this._resolvePath([src]);
    await hash(pathToFile);
  }

  async rn([src, dest]) {
    const pathToFile = this._resolvePath(src);
    const dir = getDirFromPath(pathToFile);
    const newPathToFile = path.resolve(dir, dest);
    await files.rn(pathToFile, newPathToFile);
  }

  async cp([src, dest]) {
    const pathToOldFile = this._resolvePath(src);
    const pathToNewFile = this._resolvePath(dest);
    await files.cp(pathToOldFile, pathToNewFile);
  }

  async mv([src, dest]) {
    const pathToOldFile = this._resolvePath(src);
    const pathToNewFile = this._resolvePath(dest);
    await files.mv(pathToOldFile, pathToNewFile);
  }

  async compress([src, dest]) {
    const pathToSrc = this._resolvePath(src);
    const pathToDest = this._resolvePath(dest);
    await brotli.compress(pathToSrc, pathToDest);
  }

  async decompress([src, dest]) {
    const pathToSrc = this._resolvePath(src);
    const pathToDest = this._resolvePath(dest);
    await brotli.decompress(pathToSrc, pathToDest);
  }

  validate(command, [src, dest]) {
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
        if (src) {
          return true;
        }

      case 'mw':
      case 'cp':
      case 'compress':
      case 'decompress':
        if (src && dest) {
          return true;
        }

      case 'add':
        if (src && isPathToFile(src)) {
          return true;
        }

      case 'rn':
        if (src && dest && isPathToFile(dest)) {
          return true;
        }

      default:
        return false;
    }
  }

  async start() {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    while (true) {
      const input = await rl.question(
        `You are currently in ${this._currentPath}\n`
      );
      const [command, ...args] = parseInput(input);
      if (this.validate(command, args)) {
        try {
          await this[command](args);
          console.log(MESSAGES.operationSuccessful);
        } catch (error) {
          // console.error(error);
          console.log(MESSAGES.operationFailed);
        }
      } else {
        console.log(MESSAGES.invalidInput);
      }
    }
  }
}
