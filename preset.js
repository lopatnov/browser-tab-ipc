const {defaults: tsjestDefaults} = require('ts-jest/presets');
const puppeteerPreset = require('jest-puppeteer/jest-preset');

module.exports = Object.assign({}, tsjestDefaults, puppeteerPreset);
