// The Bride Program box-set landing page, as built (dist/), in a browser.
import { test, expect, type Page } from '@playwright/test';
import { BOX_SET_PATH, CTR_ENDPOINT, ORIGIN, pixelCalls, serveDist, type ConfigEdit } from './harness';

const URL_ = `${ORIGIN}${BOX_SET_PATH}`;
const KINDLE = 'https://www.amazon.com/dp/B0B2M4RGCS';
const PRINT = 'https://www.amazon.com/dp/1090344378';
const X = {
  ku: `${KINDLE}?maas=maas_adg_XXX_afap_abs&ref_=aa_maas&tag=maas`,
  buy: `${KINDLE}?maas=maas_adg_XXX_afap_abs&ref_=aa_maas&tag=maas`,
  paperback: `${PRINT}?maas=maas_adg_XPP_afap_abs&ref_=aa_maas&tag=maas`,
};
// Campaign "x" with its own tags, and the Press endpoint on.
const withCampaignX: ConfigEdit = (config) => ({ ...config, ctrEndpoint: CTR_ENDPOINT, campaignLinks: { x: X } });

// The phone layout shows the closing set; desktop the sidebar.
const where = (page: Page) => ((page.viewportSize()?.width ?? 1280) >= 1024 ? 'side' : 'closing');

test.describe('renders static', () => {
  test.use({ javaScriptEnabled: false, timezoneId: 'America/New_York' });

  test('the whole page and working links with no script at all', async ({ page, context }) => {
    const served = await serveDist(context);
    await page.goto(URL_);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Bride Program Box Set');
    await expect(page.getByTestId('landing-hook')).toContainText('snake-like alien husbands');
    await expect(page.getByTestId('landing-books').locator('li')).toHaveCount(9);
    await expect(page.getByTestId('landing-reviews').locator('figure')).toHaveCount(4);
    for (const cta of ['ku', 'buy'] as const) {
      await expect(page.getByTestId(`landing-cta-${cta}-${where(page)}`)).toHaveAttribute('href', KINDLE);
    }
    await expect(page.getByTestId(`landing-cta-paperback-${where(page)}`)).toHaveAttribute('href', PRINT);
    await expect(page.getByTestId('landing-consent')).toBeHidden();
    expect(served.pixelRequested()).toBe(false);
  });

  test('unlinked and unindexed: no site nav, noindex', async ({ page, context }) => {
    await serveDist(context);
    await page.goto(URL_);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
    await expect(page.getByTestId('site-header')).toHaveCount(0);
    const hrefs = await page.locator('header a, footer a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    expect(hrefs).toEqual(['/', '/privacy-policy', '/cookie-policy']);
  });
});

test.describe('US visitor', () => {
  test.use({ timezoneId: 'America/New_York' });

  test('pixel loads on Dane’s dataset with PageView carrying the campaign', async ({ page, context }) => {
    const served = await serveDist(context, withCampaignX);
    await page.goto(`${URL_}?utm_source=meta&utm_campaign=x`);
    await expect.poll(() => pixelCalls(page)).toContainEqual(['init', '2527209327539510']);
    expect(await pixelCalls(page)).toContainEqual(['track', 'PageView', { campaign: 'x' }]);
    expect(served.pixelRequested()).toBe(true);
    await expect(page.getByTestId('landing-consent')).toBeHidden();
  });

  test('each button fires its event and the CTR beacon', async ({ page, context }) => {
    const served = await serveDist(context, withCampaignX);
    await page.goto(`${URL_}?utm_source=meta&utm_campaign=x`);
    await expect.poll(() => pixelCalls(page)).toContainEqual(['init', '2527209327539510']);
    const events = { ku: 'LandingClickKU', buy: 'LandingClickBuy', paperback: 'LandingClickPaperback' } as const;
    for (const [cta, event] of Object.entries(events)) {
      await page.getByTestId(`landing-cta-${cta}-${where(page)}`).click();
      const detail = { page: 'bride-program-box-set', cta, source: 'ad', campaign: 'x' };
      expect(await pixelCalls(page)).toContainEqual(['trackCustom', event, detail]);
      await expect.poll(() => served.beacons).toContainEqual({ metric: 'press.landing.ctr', ...detail });
    }
    expect(page.url()).toContain(BOX_SET_PATH); // nothing followed
  });

  test('the phone bar fires too, and organic visitors are labelled so', async ({ page, context }) => {
    test.skip((page.viewportSize()?.width ?? 1280) >= 1024, 'the bar is the phone layout');
    await serveDist(context);
    await page.goto(URL_);
    await expect.poll(() => pixelCalls(page)).toContainEqual(['init', '2527209327539510']);
    await page.getByTestId('landing-cta-ku-bar').click();
    expect(await pixelCalls(page)).toContainEqual([
      'trackCustom',
      'LandingClickKU',
      { page: 'bride-program-box-set', cta: 'ku', source: 'organic', campaign: '' },
    ]);
  });
});

test.describe('tags swap by utm_campaign', () => {
  test.use({ timezoneId: 'America/New_York' });

  test('a known campaign gets its own links on every button', async ({ page, context }) => {
    await serveDist(context, withCampaignX);
    await page.goto(`${URL_}?utm_campaign=x`);
    for (const set of ['side', 'closing', 'bar']) {
      for (const cta of ['ku', 'buy', 'paperback'] as const) {
        if (set === 'bar' && cta === 'paperback') continue;
        await expect(page.getByTestId(`landing-cta-${cta}-${set}`)).toHaveAttribute('href', X[cta]);
      }
    }
  });

  test('the campaign is remembered for the tab session', async ({ page, context }) => {
    await serveDist(context, withCampaignX);
    await page.goto(`${URL_}?utm_campaign=x`);
    await page.goto(URL_);
    await expect(page.getByTestId('landing-cta-ku-side')).toHaveAttribute('href', X.ku);
  });

  test('an unknown campaign keeps the default links', async ({ page, context }) => {
    await serveDist(context, withCampaignX);
    await page.goto(`${URL_}?utm_campaign=someone-else`);
    await expect(page.getByTestId('landing-cta-ku-side')).toHaveAttribute('href', KINDLE);
    await expect(page.getByTestId('landing-cta-paperback-side')).toHaveAttribute('href', PRINT);
  });
});

test.describe('visitor outside the US', () => {
  test.use({ timezoneId: 'Europe/London' });

  test('no pixel until Allow; the buttons work either way', async ({ page, context }) => {
    const served = await serveDist(context);
    await page.goto(URL_);
    await expect(page.getByTestId('landing-consent')).toBeVisible();
    expect(served.pixelRequested()).toBe(false);
    await page.getByTestId(`landing-cta-ku-${where(page)}`).click();
    expect(await pixelCalls(page)).toEqual([]);

    await page.getByTestId('landing-consent-allow').click();
    await expect(page.getByTestId('landing-consent')).toBeHidden();
    await expect.poll(() => pixelCalls(page)).toContainEqual(['init', '2527209327539510']);

    await page.reload();
    await expect(page.getByTestId('landing-consent')).toBeHidden();
    await expect.poll(() => pixelCalls(page)).toContainEqual(['init', '2527209327539510']);
  });

  test('No thanks: no pixel, not asked again', async ({ page, context }) => {
    const served = await serveDist(context);
    await page.goto(URL_);
    await page.getByTestId('landing-consent-deny').click();
    await page.reload();
    await expect(page.getByTestId('landing-consent')).toBeHidden();
    expect(served.pixelRequested()).toBe(false);
  });
});
