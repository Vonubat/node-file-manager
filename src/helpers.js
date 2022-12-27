import fs from 'fs/promises';
import path from 'path';

export const parseInput = (input) => {
  let args = input.split(' ');
  const quoteRegExp = /"|'/g;
  if (quoteRegExp.test(args)) {
    const quotesRegExp = /["'] | ["']/;
    args = args
      .join(' ')
      .split(quotesRegExp)
      .map((arg) => arg.replace(quoteRegExp, ''));
  }
  return args;
};

const isExist = async (path) => {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
};

export const checkThatExist = async (path) => {
  try {
    return await fs.stat(path);
  } catch {
    throw new Error(`File doesn't exist, but should`);
  }
};

export const checkThatNotExist = async (path) => {
  const isFileExist = await isExist(path);
  if (isFileExist) {
    throw new Error(`File exists, but shouldn't`);
  }
};

export const isPathToFile = (filename) => {
  const dirMarkerRegExp = /\/|\\/g;
  return !dirMarkerRegExp.test(filename);
};

export const checkIsNotFile = async (path) => {
  const pathStat = await checkThatExist(path);
  const isFile = pathStat.isFile();
  if (isFile) {
    throw new Error('Is File');
  }
};

export const getDirFromPath = (filePath) => {
  return path.dirname(filePath);
};
