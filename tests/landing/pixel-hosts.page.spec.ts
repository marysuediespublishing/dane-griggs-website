// The pixel sends only from danegriggs.com / www.: on any other host the landing
// page and the sitewide pixel log `[pixel] …` lines and nothing reaches Meta or Press.
import { test, expect, type BrowserContext, type Page } from '@playwright/test';
import { BOX_SET_PATH, CTR_ENDPOINT, LOCAL_ORIGIN, ORIGIN, pixelCalls, serveDist, type ConfigEdit } from './harness';

const withBeacon: ConfigEdit = (config) => ({ ...config, ctrEndpoint: CTR_ENDPOINT });
const where = (page: Page) => ((page.viewportSize()?.width ?? 1280) >= 1024 ? 'side' : 'closing');

function consoleLines(page: Page): string[] {
  const lines: string[] = [];
  page.on('console', (msg) => {
    if (msg.text().startsWith('[pixel]')) lines.push(msg.text());
  });
  return lines;
}

// Anything the page asks of a host the harness doesn't serve is refused, so a miss can't reach the network.
async function offline(context: BrowserContext) {
  await context.route('**', (route) => route.abort());
}

// The site banner's stored "yes to marketing", so the sitewide pixel tracks a PageView.
async function marketingConsent(context: BrowserContext) {
  await context.addInitScript(() => {
    localStorage.setItem(
      'gdpr-consent',
      JSON.stringify({ hasConsented: true, timestamp: Date.now(), expiryDays: 365, categories: { analytics: false, marketing: true } }),
    );
  });
}

test.use({ timezoneId: 'America/New_York' });

for (const origin of [LOCAL_ORIGIN, 'http://127.0.0.1:4321', 'https://danegriggs.github.io']) {
  test.describe(`landing page on ${origin}`, () => {
    test('logs the PageView, click events and beacon; sends nothing', async ({ page, context }) => {
      await offline(context);
      const served = await serveDist(context, withBeacon, origin);
      const lines = consoleLines(page);
      await page.goto(`${origin}${BOX_SET_PATH}?utm_source=meta&utm_campaign=x`);
      await expect.poll(() => lines).toContain('[pixel] init 2527209327539510');
      expect(lines).toContain('[pixel] PageView {"campaign":"x"}');

      await page.getByTestId(`landing-cta-ku-${where(page)}`).click();
      const detail = JSON.stringify({ page: 'bride-program-box-set', cta: 'ku', source: 'ad', campaign: 'x', utm_source: 'meta', utm_campaign: 'x' });
      await expect.poll(() => lines).toContain(`[pixel] LandingClickKU ${detail}`);
      await expect
        .poll(() => lines)
        .toContain(`[pixel] beacon ${JSON.stringify({ metric: 'press.landing.ctr', ...JSON.parse(detail) })}`);

      expect(served.pixelRequested()).toBe(false);
      expect(served.beacons).toEqual([]);
      expect(served.sent).toEqual([]);
    });
  });
}

test('landing page on danegriggs.com sends, with no [pixel] lines', async ({ page, context }) => {
  await offline(context);
  const served = await serveDist(context, withBeacon);
  const lines = consoleLines(page);
  await page.goto(`${ORIGIN}${BOX_SET_PATH}`);
  await expect.poll(() => pixelCalls(page)).toContainEqual(['init', '2527209327539510']);
  await page.getByTestId(`landing-cta-ku-${where(page)}`).click();
  await expect.poll(() => served.beacons.length).toBe(1);
  expect(served.pixelRequested()).toBe(true);
  expect(lines).toEqual([]);
});

test.describe('sitewide pixel (Layout and BaseHead)', () => {
  for (const path of ['/', '/blog/bride-program-launch/']) {
    test(`${path} on localhost logs the PageView and sends nothing`, async ({ page, context }) => {
      await offline(context);
      await marketingConsent(context);
      const served = await serveDist(context, undefined, LOCAL_ORIGIN);
      const lines = consoleLines(page);
      await page.goto(`${LOCAL_ORIGIN}${path}`);
      await expect.poll(() => lines).toContain('[pixel] PageView {}');
      expect(lines).toContain('[pixel] init 2527209327539510');
      expect(served.sent).toEqual([]);
    });

    test(`${path} on www.danegriggs.com loads Meta's script`, async ({ page, context }) => {
      await offline(context);
      await marketingConsent(context);
      const origin = 'https://www.danegriggs.com';
      const served = await serveDist(context, undefined, origin);
      const lines = consoleLines(page);
      await page.goto(`${origin}${path}`);
      await expect.poll(() => served.pixelRequested()).toBe(true);
      expect(await pixelCalls(page)).toContainEqual(['track', 'PageView']);
      expect(lines).toEqual([]);
    });
  }
});
