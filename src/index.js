import os from 'os';
import { App } from './app.js';
import { createDialog } from './dialogue.js';

createDialog();
const app = new App(os.homedir());
await app.start();
