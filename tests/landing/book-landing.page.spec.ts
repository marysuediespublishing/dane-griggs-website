// Book landing pages (/books/<slug>/landing/, src/components/landing/BookLandingPage.astro), as
// built (dist/), in a browser: A Rosie Christmas's, the first book with a `landing:` block.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { test, expect } from '@playwright/test';
import { CTR_ENDPOINT, ORIGIN, ROSIE_LANDING_PATH, distFile, pixelCalls, serveDist, type ConfigEdit } from './harness';

const URL_ = `${ORIGIN}${ROSIE_LANDING_PATH}`;
const BOOKS = join(process.cwd(), 'src/content/books');
const rosie = matter(readFileSync(join(BOOKS, 'rosie-christmas-book.md'), 'utf8')).data;
// site-config attributionTags.US, by product and door (Desk's import, de70ad7).
const tags = matter(readFileSync(join(process.cwd(), 'src/content/settings/site-config.md'), 'utf8')).data.attributionTags.US;
const ROSIE = tags['a-rosie-christmas'];
const BOX_SET = tags['the-bride-program-box-set'];
// Book 1's paperback (ISBN-10), the box-set door's print link: Book 1 has no Print tag yet.
const BOOK_ONE_PRINT = 'https://www.amazon.com/dp/1090344376';
const withEndpoint: ConfigEdit = (config) => ({ ...config, ctrEndpoint: CTR_ENDPOINT });

test.describe('which books have one', () => {
  test('a page exists for a book with a landing: block, and only for one', () => {
    const files = readdirSync(BOOKS).filter((f) => f.endsWith('.md'));
    const withBlock = files.filter((f) => matter(readFileSync(join(BOOKS, f), 'utf8')).data.landing).map((f) => f.replace(/\.md$/, ''));
    expect(withBlock).toEqual(['rosie-christmas-book']);
    for (const f of files) {
      const slug = f.replace(/\.md$/, '');
      expect(Boolean(distFile(`/books/${slug}/landing/`)), slug).toBe(withBlock.includes(slug));
    }
  });

  test('unlinked: not in the sitemap, and no built page links to it', () => {
    const sitemap = readFileSync(join(process.cwd(), 'dist/sitemap-0.xml'), 'utf8');
    expect(sitemap).toContain('/books/rosie-christmas-book/');
    expect(sitemap).not.toContain('/landing');
    const pages: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) walk(path);
        else if (entry.name.endsWith('.html')) pages.push(path);
      }
    };
    walk(join(process.cwd(), 'dist'));
    // Any page but a landing page itself (its canonical link names it).
    const linking = pages
      .filter((p) => !p.includes(`${join('/landing', 'index.html')}`))
      .filter((p) => /href="[^"]*\/landing\/?["#?]/.test(readFileSync(p, 'utf8')));
    expect(linking).toEqual([]);
    expect(existsSync(join(process.cwd(), 'dist', ROSIE_LANDING_PATH, 'index.html'))).toBe(true);
  });
});

test.describe('renders static', () => {
  test.use({ javaScriptEnabled: false, timezoneId: 'America/New_York' });

  test('the hook, two doors and no reviews, with working links and no script', async ({ page, context }) => {
    const served = await serveDist(context);
    await page.goto(URL_);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('A Rosie Christmas');
    await expect(page.getByTestId('landing-hook')).toHaveText(rosie.landing.hook);
    // Arm A's primary text in Studio (test 6c0900e2…, copy 85ea28f3…), as read from Press on #8672 (#61887).
    expect(rosie.landing.hook).toBe(
      'Some Christmas miracles come wrapped in stardust and seven feet of alien warrior. A cozy holiday novella.',
    );
    // This book, then the start of its series: the Bride Program box set. No same-world door.
    expect(await page.locator('[data-door]').evaluateAll((els) => els.map((e) => e.getAttribute('data-door')))).toEqual([
      'rosie-christmas-book',
      'series-start',
    ]);
    await expect(page.getByTestId('landing-door-series-start')).toContainText('The Bride Program Box Set');
    // The reviews collection has no review of this book: no pull-quote, no reviews.
    await expect(page.getByTestId('landing-pull-quote')).toHaveCount(0);
    await expect(page.getByTestId('landing-reviews')).toHaveCount(0);
    await expect(page.getByTestId('landing-pitch')).toContainText('Rosie Simson is committed to serving as the Human Bride Liaison');
    await expect(page.getByTestId('landing-consent')).toBeHidden();
    expect(served.pixelRequested()).toBe(false);
  });

  test('the KU door says Kindle+', async ({ page, context }) => {
    await serveDist(context);
    await page.goto(URL_);
    for (const door of ['rosie-christmas-book', 'series-start']) {
      await expect(page.getByTestId(`landing-cta-ku-${door}`)).toHaveText('Read free with Kindle+');
    }
    await expect(page.locator('body')).toContainText('Free for Kindle+ members');
    await expect(page.locator('body')).not.toContainText('Kindle Unlimited');
  });

  test('no site nav: the landing chrome only, noindex', async ({ page, context }) => {
    await serveDist(context);
    await page.goto(URL_);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
    await expect(page.getByTestId('site-header')).toHaveCount(0);
    await expect(page.locator('nav')).toHaveCount(0);
    const hrefs = await page.locator('header a, footer a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    expect(hrefs).toEqual(['/', '/privacy-policy', '/cookie-policy']);
  });
});

test.describe('tags per product and door', () => {
  test.use({ timezoneId: 'America/New_York' });

  test("Rosie's buttons carry attributionTags.US.a-rosie-christmas; the box set's KU and Kindle its own; Book 1's print is bare and listed missing", async ({ page, context }) => {
    await serveDist(context);
    await page.goto(`${URL_}?utm_campaign=x`);
    await expect(page.getByTestId('landing-cta-ku-rosie-christmas-book')).toHaveAttribute('href', ROSIE.ku);
    await expect(page.getByTestId('landing-cta-buy-rosie-christmas-book')).toHaveAttribute('href', ROSIE.kindle);
    await expect(page.getByTestId('landing-cta-paperback-rosie-christmas-book')).toHaveAttribute('href', ROSIE.print);
    await expect(page.getByTestId('landing-cta-ku-series-start')).toHaveAttribute('href', BOX_SET.ku);
    await expect(page.getByTestId('landing-cta-buy-series-start')).toHaveAttribute('href', BOX_SET.kindle);
    await expect(page.getByTestId('landing-cta-paperback-series-start')).toHaveAttribute('href', BOOK_ONE_PRINT);
    const config = JSON.parse((await page.locator('#landing-config').textContent()) ?? '{}');
    expect(config.page).toBe('rosie-christmas-book-landing');
    expect(config.missingTags).toEqual([{ product: 'the-bride-program', door: 'print', href: BOOK_ONE_PRINT }]);
  });
});

test.describe('click events', () => {
  test.use({ timezoneId: 'America/New_York' });

  test('every button fires its event with its door as target, the market, and every utm_* unchanged', async ({ page, context }) => {
    const served = await serveDist(context, withEndpoint);
    await page.goto(`${URL_}?utm_source=meta&utm_medium=paid&utm_campaign=rosie-xmas&utm_content=arm-a&utm_term=t`);
    await expect.poll(() => pixelCalls(page)).toContainEqual(['init', '2527209327539510']);
    expect(await pixelCalls(page)).toContainEqual(['track', 'PageView', { campaign: 'rosie-xmas' }]);
    const utm = { utm_source: 'meta', utm_medium: 'paid', utm_campaign: 'rosie-xmas', utm_content: 'arm-a', utm_term: 't' };
    const events = { ku: 'LandingClickKU', buy: 'LandingClickBuy', paperback: 'LandingClickPaperback' } as const;
    for (const target of ['rosie-christmas-book', 'series-start']) {
      for (const [cta, event] of Object.entries(events)) {
        await page.getByTestId(`landing-cta-${cta}-${target}`).click();
        const detail = { page: 'rosie-christmas-book-landing', market: 'US', cta, target, source: 'ad', campaign: 'rosie-xmas', ...utm };
        expect(await pixelCalls(page)).toContainEqual(['trackCustom', event, detail]);
        await expect.poll(() => served.beacons).toContainEqual({ metric: 'press.landing.ctr', ...detail });
      }
    }
    expect(page.url()).toContain(ROSIE_LANDING_PATH); // nothing followed
  });

  test('outside the US: no pixel until Allow; the buttons work either way', async ({ browser }) => {
    const context = await browser.newContext({ timezoneId: 'Europe/London' });
    const page = await context.newPage();
    const served = await serveDist(context);
    await page.goto(URL_);
    await expect(page.getByTestId('landing-consent')).toBeVisible();
    await page.getByTestId('landing-cta-ku-rosie-christmas-book').click();
    expect(await pixelCalls(page)).toEqual([]);
    expect(served.pixelRequested()).toBe(false);
    await page.getByTestId('landing-consent-allow').click();
    await expect.poll(() => pixelCalls(page)).toContainEqual(['init', '2527209327539510']);
    await context.close();
  });
});
