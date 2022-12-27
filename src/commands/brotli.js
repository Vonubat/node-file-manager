import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { checkThatExist, checkThatNotExist } from '../helpers.js';
import { MESSAGES } from '../messages.js';

const ACTIONS = {
  compress: 'compress',
  decompress: 'decompress',
};

const implementBrotli = async (pathToSrc, pathToDest, action) => {
  await checkThatExist(pathToSrc);
  await checkThatNotExist(pathToDest);

  const brotli =
    action === ACTIONS.decompress
      ? createBrotliDecompress()
      : createBrotliCompress();
  const srcStream = createReadStream(pathToSrc);
  const destStream = createWriteStream(pathToDest);

  await pipeline(srcStream, brotli, destStream);
  console.log(MESSAGES.operationSuccessful);
};

export const compress = async (...args) => {
  await implementBrotli(...args, ACTIONS.compress);
};

export const decompress = async (...args) => {
  await implementBrotli(...args, ACTIONS.decompress);
};
