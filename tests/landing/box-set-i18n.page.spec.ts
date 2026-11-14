// The Bride Program box set in German and French (Press suite_006 §2), as built with the
// test editions (tests/fixtures/landing-editions.json):
//   npm run build:landing-test
// DE: in KU, a paperback, every tag. FR: not in KU, no paperback, a Kindle tag for another
// ASIN (so refused), one review of its own.
// In that build the fixture's editions win over the content's (src/lib/editions.ts), so these
// made-up cases hold whatever real DE/FR editions saving-ceraste.md carries: it is the only
// box-set page, and the real editions need not reach every branch. That production links only
// the content's real ASINs is checked against `npm run build` by scripts/check-prod-landing.mjs.
import { readFileSync } from 'node:fs';
import { test, expect, type Page } from '@playwright/test';
import { BOX_SET_PATH, CTR_ENDPOINT, ORIGIN, distFile, pixelCalls, serveDist, type ConfigEdit } from './harness';
import { LANDING_STRINGS } from '../../src/i18n';
import { en } from '../../src/i18n/landing.en';
import { showFormerlyKU } from '../../src/lib/kindle-plus';

const fixture = JSON.parse(readFileSync('tests/fixtures/landing-editions.json', 'utf8')) as {
  series: { 'saving-ceraste': Record<'de' | 'fr', { title: string; hook: string }> };
  attributionTags: Record<string, Record<string, Record<string, string>>>;
};
const DE_TAGS = fixture.attributionTags.DE;
const withEndpoint: ConfigEdit = (config) => ({ ...config, ctrEndpoint: CTR_ENDPOINT });
const where = (page: Page) => ((page.viewportSize()?.width ?? 1280) >= 1024 ? 'side' : 'closing');
const url = (lang: string) => `${ORIGIN}/${lang}${BOX_SET_PATH}`;
// "ehemals / anciennement Kindle Unlimited" shows through site-config kindlePlusFormerlyUntil
// (the build's date decides; a build and its test run the same day).
const until = readFileSync('src/content/settings/site-config.md', 'utf8').match(/^kindlePlusFormerlyUntil:\s*"?([0-9-]+)"?/m)?.[1];
const formerly = showFormerlyKU(until);

test.beforeAll(() => {
  if (!distFile(`/de${BOX_SET_PATH}`)) {
    throw new Error('dist/ has no /de/ box-set page: run `npm run build:landing-test`');
  }
});

// Every line of English fixed copy the page could carry; none may show on a DE or FR page.
const ENGLISH = [
  en.readFree,
  en.freeFor,
  en.buyBoxSet(),
  en.preferPaper,
  'The complete',
  'books inside',
  'average across the series',
  'ratings across',
  en.readersSay,
  'Goodreads',
  en.closing(9),
  en.consent.text,
  en.consent.allow,
  en.consent.deny,
  en.chrome.skip,
  en.chrome.privacy,
  'Book 1',
];

test.describe('DE: amazon.de, the DE tags, German words', () => {
  test.use({ timezoneId: 'Europe/Berlin', locale: 'de-DE' });
  const de = LANDING_STRINGS.de;

  test('the edition’s words and the market’s storefront and tags', async ({ page, context }) => {
    await serveDist(context);
    await page.goto(url('de'));
    await expect(page.locator('html')).toHaveAttribute('lang', 'de');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(fixture.series['saving-ceraste'].de.title);
    await expect(page.getByTestId('landing-hook')).toHaveText(fixture.series['saving-ceraste'].de.hook);
    await expect(page).toHaveTitle('Das Bräute-Programm: Sammelband: alle neun Bände | Dane Griggs');
    const w = where(page);
    await expect(page.getByTestId(`landing-cta-ku-${w}`)).toHaveAttribute('href', DE_TAGS['the-bride-program-box-set'].ku);
    await expect(page.getByTestId(`landing-cta-ku-${w}`)).toHaveText(de.readFree);
    await expect(page.getByTestId(`landing-cta-buy-${w}`)).toHaveAttribute('href', DE_TAGS['the-bride-program-box-set'].kindle);
    await expect(page.getByTestId(`landing-cta-buy-${w}`)).toHaveText(de.buyBoxSet('9,99 €'));
    await expect(page.getByTestId(`landing-cta-paperback-${w}`)).toHaveAttribute('href', DE_TAGS['the-bride-program'].print);
    await expect(page.getByTestId(`landing-cta-paperback-${w}`)).toHaveText(de.preferPaper);
    await expect(page.getByTestId(`landing-ctas-${w}`)).toContainText(de.valueLine(9, '9,99 €', '26,91 €'));
    await expect(page.getByTestId('landing-books').locator('li')).toHaveCount(9);
    await expect(page.getByTestId('landing-books').locator('li').first()).toContainText('Band 1');
    await expect(page.getByTestId('landing-books').locator('li').first()).toContainText('Das Bräute-Programm');
    await expect(page.getByTestId('landing-books').locator('li').nth(1)).not.toContainText('A doctor and a clueless alien physician.');
    // The edition has no reviews of its own: no band, and no English one translated in.
    await expect(page.getByTestId('landing-reviews')).toHaveCount(0);
    await expect(page.getByText(de.seriesAverage('4,4')).first()).toBeVisible();
    const links = await page.locator('a[href*="amazon."]').evaluateAll((as) => as.map((a) => new URL((a as HTMLAnchorElement).href).hostname));
    expect(new Set(links)).toEqual(new Set(['www.amazon.de']));
  });

  test('no English fixed copy on the page', async ({ page, context }) => {
    await serveDist(context);
    await page.goto(url('de'));
    const text = await page.locator('body').innerText();
    for (const line of ENGLISH) expect(text, line).not.toContain(line);
    const consent = await page.getByTestId('landing-consent').innerText();
    expect(consent).toContain(de.consent.text);
  });

  test('a visitor in Germany is asked first; events and the beacon carry market DE', async ({ page, context }) => {
    const served = await serveDist(context, withEndpoint);
    await page.goto(`${url('de')}?utm_source=meta&utm_campaign=bride-program-box-set-de-landing`);
    await expect(page.getByTestId('landing-consent')).toBeVisible();
    await expect(page.getByTestId('landing-consent-allow')).toHaveText(de.consent.allow);
    await page.getByTestId('landing-consent-allow').click();
    await expect.poll(() => pixelCalls(page)).toContainEqual(['init', '2527209327539510']);
    for (const [cta, event] of [['ku', 'LandingClickKU'], ['buy', 'LandingClickBuy']] as const) {
      await page.getByTestId(`landing-cta-${cta}-${where(page)}`).click();
      const detail = {
        page: 'bride-program-box-set',
        market: 'DE',
        cta,
        source: 'ad',
        campaign: 'bride-program-box-set-de-landing',
        utm_source: 'meta',
        utm_campaign: 'bride-program-box-set-de-landing',
      };
      await expect.poll(() => pixelCalls(page)).toContainEqual(['trackCustom', event, detail]);
      await expect.poll(() => served.beacons).toContainEqual({ metric: 'press.landing.ctr', ...detail });
    }
  });

  test('the box-set image and share image load', async ({ page, context }) => {
    await serveDist(context);
    await page.goto(url('de'));
    const hero = page.locator('main img').first();
    await expect(hero).toHaveAttribute('alt', de.boxSetAlt(fixture.series['saving-ceraste'].de.title, 9));
    expect(await hero.evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    const og = await page.locator('meta[property="og:image"]').getAttribute('content');
    const res = await page.request.get(og!.replace('https://danegriggs.com', ORIGIN));
    expect(res.status()).toBe(200);
  });
});

test.describe('FR: amazon.fr, not in KU, no paperback', () => {
  test.use({ timezoneId: 'Europe/Paris', locale: 'fr-FR' });
  const fr = LANDING_STRINGS.fr;

  test('two doors: no KU button anywhere, no print link; a tag for another ASIN is refused', async ({ page, context }) => {
    await serveDist(context);
    await page.goto(url('fr'));
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(fixture.series['saving-ceraste'].fr.title);
    await expect(page.locator('[data-landing-cta="ku"]')).toHaveCount(0);
    await expect(page.locator('[data-landing-cta="paperback"]')).toHaveCount(0);
    await expect(page.getByText(fr.freeFor)).toHaveCount(0);
    await expect(page.getByTestId(`landing-cta-buy-${where(page)}`)).toHaveAttribute('href', 'https://www.amazon.fr/dp/B0FIXFR001');
    await expect(page.getByTestId(`landing-cta-buy-${where(page)}`)).toHaveText(fr.buyBoxSet());
    const config = JSON.parse((await page.locator('#landing-config').textContent()) ?? '{}');
    expect(config.market).toBe('FR');
    // No KU button, so no KU tag is missing; the Kindle tag is for another ASIN, so it is.
    expect(config.missingTags).toEqual([
      { product: 'the-bride-program-box-set', door: 'kindle', href: 'https://www.amazon.fr/dp/B0FIXFR001' },
    ]);
  });

  test('its own review only, cited as Amazon.fr; no rating it does not have; no English fixed copy', async ({ page, context }) => {
    await serveDist(context);
    await page.goto(url('fr'));
    await expect(page.getByTestId('landing-reviews').locator('figure')).toHaveCount(1);
    await expect(page.getByTestId('landing-reviews')).toContainText(fr.reviewCite('Camille'));
    await expect(page.getByTestId('landing-reviews')).toContainText(fr.quote('Génial'));
    await expect(page.getByText('★')).toHaveCount(0);
    const text = await page.locator('body').innerText();
    for (const line of ENGLISH) expect(text, line).not.toContain(line);
  });

  test('the click event carries market FR', async ({ page, context }) => {
    const served = await serveDist(context, withEndpoint);
    await page.goto(url('fr'));
    await page.getByTestId('landing-consent-allow').click();
    await expect.poll(() => pixelCalls(page)).toContainEqual(['init', '2527209327539510']);
    await page.getByTestId(`landing-cta-buy-${where(page)}`).click();
    const detail = { page: 'bride-program-box-set', market: 'FR', cta: 'buy', source: 'organic', campaign: '' };
    await expect.poll(() => pixelCalls(page)).toContainEqual(['trackCustom', 'LandingClickBuy', detail]);
    await expect.poll(() => served.beacons).toContainEqual({ metric: 'press.landing.ctr', ...detail });
  });
});

// Kindle Unlimited is Kindle+ on amazon.de and amazon.fr too (2026-10-22, #8862): the DE/FR ads
// say Kindle+, so must the page. "Kindle Unlimited" may stand only in the formerly line (beside
// each Kindle+ note, and in parentheses in the meta description) and in a reader's quoted words.
test.describe('DE and FR: Kindle+, never "Kindle Unlimited" outside the formerly line', () => {
  for (const lang of ['de', 'fr'] as const) {
    const s = LANDING_STRINGS[lang];
    test(`/${lang}/: no "Kindle Unlimited" in the page, its title or its description, but in the formerly line`, async ({ page, context }) => {
      await serveDist(context);
      await page.goto(url(lang));
      const rest = await page.evaluate(() => {
        const copy = document.documentElement.cloneNode(true) as HTMLElement;
        copy.querySelectorAll('[data-formerly-ku], blockquote, script, style').forEach((el) => el.remove());
        return copy.textContent ?? '';
      });
      expect(rest).not.toMatch(/Kindle[\s\u00a0-]+Unlimited/i);
      const description = (await page.locator('meta[name="description"]').getAttribute('content')) ?? '';
      expect(description.replace(` (${s.formerlyKU})`, '')).not.toMatch(/Kindle[\s\u00a0-]+Unlimited/i);
      expect(await page.title()).not.toMatch(/Unlimited/i);
      const kuButtons = await page.locator('[data-landing-cta="ku"]').count();
      // Every formerly line sits beside a Kindle+ note, one per KU button (none when not in Kindle+).
      await expect(page.locator('[data-formerly-ku]')).toHaveCount(formerly ? kuButtons : 0);
      for (const line of await page.locator('[data-formerly-ku]').allTextContents()) expect(line).toBe(s.formerlyKU);
      if (kuButtons) expect(description).toContain(formerly ? `${s.formerlyKU})` : 'Kindle+');
    });
  }

  test('/de/: the three doors\' words: Kindle+, the Kindle box set, Book 1 in paperback', async ({ page, context }) => {
    const de = LANDING_STRINGS.de;
    await serveDist(context);
    await page.goto(url('de'));
    const w = where(page);
    await expect(page.getByTestId(`landing-cta-ku-${w}`)).toHaveText('Gratis lesen mit Kindle+');
    await expect(page.getByTestId(`landing-ctas-${w}`).locator('p').first()).toHaveText(
      formerly ? 'Für Kindle+-Mitglieder kostenlos · ehemals Kindle Unlimited' : 'Für Kindle+-Mitglieder kostenlos',
    );
    await expect(page.getByTestId(`landing-cta-buy-${w}`)).toHaveText(de.buyBoxSet('9,99 €'));
    await expect(page.getByTestId(`landing-cta-paperback-${w}`)).toHaveText(de.preferPaper);
    // The phone's bar says it too.
    await expect(page.getByTestId('landing-cta-ku-bar')).toHaveText('Gratis lesen mit Kindle+');
  });
});

test.describe('hreflang: each language links the others', () => {
  for (const path of [BOX_SET_PATH, `/de${BOX_SET_PATH}`, `/fr${BOX_SET_PATH}`]) {
    test(path, async ({ page, context }) => {
      await serveDist(context);
      await page.goto(`${ORIGIN}${path}`);
      const alternates = await page
        .locator('link[rel="alternate"][hreflang]')
        .evaluateAll((ls) => ls.map((l) => `${l.getAttribute('hreflang')} ${l.getAttribute('href')}`));
      expect(alternates).toEqual([
        `en https://danegriggs.com${BOX_SET_PATH}`,
        `de https://danegriggs.com/de${BOX_SET_PATH}`,
        `fr https://danegriggs.com/fr${BOX_SET_PATH}`,
      ]);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
    });
  }
});
