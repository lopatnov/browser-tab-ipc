import path from 'path';
import { default as puppeteer, Browser, Page } from "puppeteer";

describe('Tests', () => {
  var browser: Browser;
  var page1: Page;
  var page2: Page;
  const width = 800;
  const height = 600;
  const relativeUrl = './demo.html';
  const url = 'file:///' + path.join(__dirname, relativeUrl);

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      slowMo: 80,
      timeout: 0,
      args: [`--window-size=${width},${height}`]
    });
    page1 = await browser.newPage();
    page2 = await browser.newPage();
    page1.setViewport({ width, height });
    page2.setViewport({ width, height });
    await page1.goto(url);
    await page2.goto(url);
  });

  it('should be titled correctly', async () => {
    await expect(page1.title()).resolves.toMatch('browser-tab-ipc demo');
    await expect(page2.title()).resolves.toMatch('browser-tab-ipc demo');
  });

  it('should send a message', async () => {
    const message = 'A message from page 1';

    await page1.evaluate(async () => {
      const anchor = document.querySelector('#text') as HTMLInputElement;
      anchor.value = 'A message from page 1';
    });
    await page1.$eval( '#sendBtn', el => (el as HTMLElement).click() );
    await page2.waitForSelector('#history li mark.tertiary', {
      timeout: 3000
    });

    const receivedElement = await page2.$('#history li span.re');
    await expect(receivedElement).toBeTruthy();
    const text = await page2.evaluate(() => {
      const anchor = document.querySelector('#history li span.re');
      return anchor.textContent;
    });
    await expect(text).toBe(message);
  });

  afterAll(async () => {
    await browser?.close();
  });
});
