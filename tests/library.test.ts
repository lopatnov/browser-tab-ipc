import 'expect-puppeteer';
import puppeteer from "puppeteer";

import { BrowserTabIPC, TransportType } from "../src/library";

describe('Google', () => {
  // var browser;
  // var page;
  // const width = 800;
  // const height = 600;
  beforeAll(async () => {
    await page.goto('https://google.com');
    // browser = await puppeteer.launch({
    //   headless: false,
    //   slowMo: 80,
    //   args: [`--window-size=${width},${height}`]
    // });
    // page = await browser.newPage();
    // await page.setViewport({ width, height });
  });

  it('should be titled "Google"', async () => {
    await expect(page.title()).resolves.toMatch('Google');
  });
});

// describe("Base tests", () => {
//   it("should create BrowserTabIPC", () => {
//     const ipc = new BrowserTabIPC();

//     expect(ipc).toBeTruthy();
//   });

//   it("should connect using Session Storage transport", async () => {
//     let actualAvailabilityOfConnection = false;
//     const ipc = new BrowserTabIPC({
//       transportTypes: [TransportType.sessionStorage]
//     });

//     const state = await ipc.connect();
//     actualAvailabilityOfConnection = state.connected;

//     expect(actualAvailabilityOfConnection).toBeTruthy();
//   });
// });
