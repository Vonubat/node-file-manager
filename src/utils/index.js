import { fileURLToPath } from 'url';
import path from 'path';

export const getDirname = (metaUrl) => fileURLToPath(new URL('.', metaUrl));

export const getFilename = (metaUrl) => fileURLToPath(metaUrl);

export const getPath = (metaUrl, src) => path.join(getDirname(metaUrl), ...src);
