import {Browser, Page, default as puppeteer} from 'puppeteer';
import {spawn, ChildProcess} from 'node:child_process';
import http from 'node:http';
import {resolve} from 'node:path';
import kill from 'tree-kill';

const BASE_URL = 'http://localhost:4444';
const DEMO_URL = `${BASE_URL}/docs/demo.html`;
const PROJECT_ROOT = resolve(__dirname, '..');

// ── Helpers ────────────────────────────────────────────────────────────────

/** Poll the dev server until it responds (or timeout). */
function waitForServer(timeoutMs = 30_000): Promise<void> {
  return new Promise((res, rej) => {
    const deadline = Date.now() + timeoutMs;
    function attempt() {
      if (Date.now() > deadline) {
        return rej(new Error(`Dev server did not start within ${timeoutMs}ms`));
      }
      http
        .get(BASE_URL, (r) => {
          r.resume();
          res();
        })
        .on('error', () => setTimeout(attempt, 300));
    }
    attempt();
  });
}

async function selectTransport(page: Page, radioId: string): Promise<void> {
  await page.evaluate((id) => {
    const el = document.getElementById(id) as HTMLInputElement | null;
    el?.click();
  }, radioId);
}

/** Click Connect and wait for the system status message (connection established). */
async function connectAndWait(page: Page): Promise<void> {
  await page.$eval('#connectBtn', (el) => (el as HTMLElement).click());
  await page.waitForSelector('.msg.system:not(.error)', {timeout: 8_000});
}

async function sendMessage(page: Page, text: string): Promise<void> {
  await page.evaluate((msg) => {
    const input = document.querySelector('#text') as HTMLInputElement | null;
    if (input) input.value = msg;
  }, text);
  await page.$eval('#sendBtn', (el) => (el as HTMLElement).click());
}

/** Wait until a received message bubble with exactly `expectedText` appears. */
async function waitForMessage(page: Page, expectedText: string): Promise<void> {
  await page.waitForFunction(
    (text) => Array.from(document.querySelectorAll('.msg.received .msg-bubble')).some((el) => el.textContent === text),
    {timeout: 8_000},
    expectedText,
  );
}

// ── Test suite ─────────────────────────────────────────────────────────────

describe('BrowserTabIPC', () => {
  let cmd: ChildProcess;
  let browser: Browser;
  let page1: Page;
  let page2: Page;

  jest.setTimeout(60_000);

  beforeAll(async () => {
    cmd = spawn('yarn', ['serve'], {cwd: PROJECT_ROOT, shell: true});
    await waitForServer();

    browser = await puppeteer.launch({
      headless: true,
      args: ['--window-size=1024,768', '--no-sandbox', '--disable-setuid-sandbox'],
    });

    page1 = await browser.newPage();
    page2 = await browser.newPage();
    await page1.setViewport({width: 1024, height: 768});
    await page2.setViewport({width: 1024, height: 768});
  });

  beforeEach(async () => {
    // Fresh page load between tests for DOM isolation
    await Promise.all([page1.goto(DEMO_URL), page2.goto(DEMO_URL)]);
  });

  afterAll(async () => {
    await browser?.close();
    if (cmd?.pid) kill(cmd.pid);
  });

  // ── Basic ────────────────────────────────────────────────────────────────

  it('has correct page title', async () => {
    await expect(page1.title()).resolves.toBe('browser-tab-ipc demo');
    await expect(page2.title()).resolves.toBe('browser-tab-ipc demo');
  });

  // ── Transport: BroadcastChannel ──────────────────────────────────────────

  it('sends a message via BroadcastChannel transport', async () => {
    const message = 'Hello via BroadcastChannel';
    await selectTransport(page1, 'broadcastChannelTransport');
    await selectTransport(page2, 'broadcastChannelTransport');
    await connectAndWait(page1);
    await connectAndWait(page2);
    await sendMessage(page1, message);
    await waitForMessage(page2, message);
  });

  // ── Transport: SessionStorage ────────────────────────────────────────────

  it('sends a message via SessionStorage transport', async () => {
    const message = 'Hello via SessionStorage';
    await selectTransport(page1, 'localStorageTransport');
    await selectTransport(page2, 'localStorageTransport');
    await connectAndWait(page1);
    await connectAndWait(page2);
    await sendMessage(page1, message);
    await waitForMessage(page2, message);
  });

  // ── Transport: auto fallback (default) ───────────────────────────────────

  it('sends a message using auto transport (default)', async () => {
    const message = 'Hello via auto transport';
    // anyTransport is the default selection — library picks the best available
    await connectAndWait(page1);
    await connectAndWait(page2);
    await sendMessage(page1, message);
    await waitForMessage(page2, message);
  });

  // ── Multi-message ────────────────────────────────────────────────────────

  it('delivers multiple messages in order', async () => {
    const messages = ['first', 'second', 'third'];
    await selectTransport(page1, 'broadcastChannelTransport');
    await selectTransport(page2, 'broadcastChannelTransport');
    await connectAndWait(page1);
    await connectAndWait(page2);

    for (const msg of messages) {
      await sendMessage(page1, msg);
    }

    for (const msg of messages) {
      await waitForMessage(page2, msg);
    }
  });

  // ── Bidirectional ────────────────────────────────────────────────────────

  it('delivers messages in both directions', async () => {
    await selectTransport(page1, 'broadcastChannelTransport');
    await selectTransport(page2, 'broadcastChannelTransport');
    await connectAndWait(page1);
    await connectAndWait(page2);

    await sendMessage(page1, 'from page1');
    await waitForMessage(page2, 'from page1');

    await sendMessage(page2, 'from page2');
    await waitForMessage(page1, 'from page2');
  });
});
