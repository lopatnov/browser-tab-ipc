const ts_presets = require('ts-jest/presets');
const puppeteer_preset = require('jest-puppeteer/jest-preset')

module.exports = Object.assign(
    ts_presets,
    puppeteer_preset
)