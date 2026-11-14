// The landing system's pure parts: tags on links, per-campaign links, consent, markets, strings.
import { test, expect } from '@playwright/test';
import {
  amazonDp,
  amazonSearch,
  LANDING_EVENTS,
  LANDING_LANGS,
  LANG_MARKET,
  landingDoorsSetup,
  landingLinks,
  landingSetup,
  missingLine,
  langPath,
  landingQuotes,
  marketOf,
  money,
  STOREFRONTS,
  tagFor,
  toLandingReview,
  withTag,
} from '../../src/lib/landing';
import { LANDING_STRINGS } from '../../src/i18n';
import { formatCount, formatRating, type LandingStrings } from '../../src/i18n/landing';
import { showFormerlyKU } from '../../src/lib/kindle-plus';
import { decideConsent, isUsZone, siteMarketingConsent, utmOf } from '../../src/lib/landing-client';
import { DEFAULT_PIXEL_HOSTS, beaconLine, isPixelHost, pixelHosts, pixelLine } from '../../src/lib/pixel-hosts';

const KINDLE = 'https://www.amazon.com/dp/B0B2M4RGCS';
const PRINT = 'https://www.amazon.com/dp/1090344376';
const TAG_A = 'https://www.amazon.com/dp/B0B2M4RGCS?maas=maas_adg_AAA_afap_abs&ref_=aa_maas&tag=maas';
const TAG_P = 'maas=maas_adg_PPP_afap_abs&ref_=aa_maas&tag=maas';
const TAG_X = 'maas=maas_adg_XXX_afap_abs&ref_=aa_maas&tag=maas';

test.describe('withTag', () => {
  test('adds only the query of a whole Attribution URL', () => {
    expect(withTag(KINDLE, TAG_A)).toBe(`${KINDLE}?maas=maas_adg_AAA_afap_abs&ref_=aa_maas&tag=maas`);
  });
  test('takes a bare query string too', () => {
    expect(withTag(PRINT, TAG_P)).toBe(`${PRINT}?${TAG_P}`);
  });
  test('leaves the link alone with no tag', () => {
    expect(withTag(KINDLE, '')).toBe(KINDLE);
    expect(withTag(KINDLE, '   ')).toBe(KINDLE);
    expect(withTag(KINDLE)).toBe(KINDLE);
  });
});

test.describe('landingLinks: a tag per product and door', () => {
  const targets = { kindleUrl: KINDLE, paperbackUrl: PRINT, product: 'the-bride-program-box-set', printProduct: 'the-bride-program' };
  const TAG_KU = 'https://www.amazon.com/dp/B0B2M4RGCS?maas=maas_adg_KU_afap_abs&ref_=aa_maas&tag=maas';
  const attributionTags = {
    US: {
      'the-bride-program-box-set': { ku: TAG_KU, kindle: TAG_A },
      'the-bride-program': { print: TAG_P },
    },
  };

  test('KU and Buy take the box set\'s own KU and Kindle tags; print takes book 1\'s Print tag', () => {
    const { links, missing } = landingLinks(targets, { attributionTags });
    expect(links.ku).toContain('maas_adg_KU');
    expect(links.buy).toContain('maas_adg_AAA');
    expect(links.paperback).toBe(`${PRINT}?${TAG_P}`);
    expect(missing).toEqual([]);
  });

  test('a missing tag, or one for another product page, leaves the bare /dp link and is listed', () => {
    const { links, missing } = landingLinks(targets, {
      attributionTags: { US: { 'the-bride-program-box-set': { ku: 'https://www.amazon.com/dp/B0OTHERASN?maas=x' } } },
    });
    expect(links).toEqual({ ku: KINDLE, buy: KINDLE, paperback: PRINT });
    expect(missing.map((m) => `${m.product}.${m.door}`)).toEqual(['the-bride-program-box-set.ku', 'the-bride-program-box-set.kindle', 'the-bride-program.print']);
  });

  test('the tag is the link\'s storefront\'s', () => {
    expect(tagFor({ UK: { p: { kindle: TAG_X } } }, 'p', 'kindle', 'https://www.amazon.co.uk/dp/B0B2M4RGCS')).toBe(TAG_X);
    expect(tagFor({ UK: { p: { kindle: TAG_X } } }, 'p', 'kindle', KINDLE)).toBeUndefined();
  });

  test('no settings: plain links, the three missing, no pixel, no beacon', () => {
    const { links, config } = landingSetup('p', targets);
    expect(links).toEqual({ ku: KINDLE, buy: KINDLE, paperback: PRINT });
    expect(config).toMatchObject({ page: 'p', pixelId: '', ctrEndpoint: '', pixelHosts: [...DEFAULT_PIXEL_HOSTS] });
    expect(config.missingTags).toHaveLength(3);
  });

  test('site-config pixelHosts reach the browser config', () => {
    expect(landingSetup('p', targets, { pixelHosts: ['Example.com '] }).config.pixelHosts).toEqual(['example.com']);
  });
});

test.describe('pixel hosts', () => {
  const hosts = pixelHosts(['danegriggs.com', 'www.danegriggs.com']);

  test('only the production hosts fire', () => {
    expect(DEFAULT_PIXEL_HOSTS).toEqual(['danegriggs.com', 'www.danegriggs.com']);
    expect(isPixelHost('danegriggs.com', hosts)).toBe(true);
    expect(isPixelHost('www.danegriggs.com', hosts)).toBe(true);
    expect(isPixelHost('WWW.DaneGriggs.com.', hosts)).toBe(true);
    for (const host of ['localhost', '127.0.0.1', '', 'danegriggs.github.io', 'preview.danegriggs.com', 'danegriggs.com.evil.test', 'danegriggs.test']) {
      expect(isPixelHost(host, hosts), host).toBe(false);
    }
  });

  test('none configured: the defaults', () => {
    expect(pixelHosts()).toEqual(['danegriggs.com', 'www.danegriggs.com']);
    expect(pixelHosts([' ', ''])).toEqual(['danegriggs.com', 'www.danegriggs.com']);
  });

  test('console lines', () => {
    expect(pixelLine(['track', 'PageView', { campaign: 'x' }])).toBe('[pixel] PageView {"campaign":"x"}');
    expect(pixelLine(['track', 'PageView'])).toBe('[pixel] PageView {}');
    expect(pixelLine(['trackCustom', 'LandingClickKU', { cta: 'ku' }])).toBe('[pixel] LandingClickKU {"cta":"ku"}');
    expect(pixelLine(['init', '2527209327539510'])).toBe('[pixel] init 2527209327539510');
    expect(beaconLine({ metric: 'press.landing.ctr' })).toBe('[pixel] beacon {"metric":"press.landing.ctr"}');
  });
});

test('utmOf: every utm_* of the query, unchanged, and nothing else', () => {
  expect(utmOf(new URLSearchParams('from=ad&utm_source=meta&utm_campaign=Bride%20X&fbclid=1&utm_content=a'))).toEqual({
    utm_source: 'meta',
    utm_campaign: 'Bride X',
    utm_content: 'a',
  });
  expect(utmOf(new URLSearchParams(''))).toEqual({});
});

test.describe('consent', () => {
  const base = { pixelId: '2527209327539510', landingChoice: null, siteMarketing: undefined, zone: 'Europe/London' };

  test('US time zone loads without a click; elsewhere asks', () => {
    expect(isUsZone('America/New_York')).toBe(true);
    expect(isUsZone('America/Indiana/Indianapolis')).toBe(true);
    expect(isUsZone('Pacific/Honolulu')).toBe(true);
    expect(isUsZone('America/Toronto')).toBe(false);
    expect(decideConsent({ ...base, zone: 'America/Chicago' })).toBe('granted');
    expect(decideConsent(base)).toBe('ask');
    expect(decideConsent({ ...base, zone: '' })).toBe('ask');
  });

  test('a stored choice wins; a site-banner "no" to marketing is a no here too', () => {
    expect(decideConsent({ ...base, landingChoice: 'granted' })).toBe('granted');
    expect(decideConsent({ ...base, zone: 'America/Denver', landingChoice: 'denied' })).toBe('denied');
    expect(decideConsent({ ...base, zone: 'America/Denver', siteMarketing: false })).toBe('denied');
    expect(decideConsent({ ...base, siteMarketing: true })).toBe('granted');
  });

  test('no pixel id: nothing to load or ask', () => {
    expect(decideConsent({ ...base, pixelId: '', zone: 'America/New_York' })).toBe('none');
  });

  test("reads the site banner's stored choice", () => {
    const now = Date.UTC(2026, 9, 22);
    const saved = (marketing: boolean, daysAgo = 1) =>
      JSON.stringify({ hasConsented: true, timestamp: now - daysAgo * 86_400_000, expiryDays: 365, categories: { marketing } });
    expect(siteMarketingConsent(saved(true), now)).toBe(true);
    expect(siteMarketingConsent(saved(false), now)).toBe(false);
    expect(siteMarketingConsent(saved(true, 400), now)).toBeUndefined();
    expect(siteMarketingConsent('not json', now)).toBeUndefined();
    expect(siteMarketingConsent(null, now)).toBeUndefined();
  });
});

test('event names match Gwen’s, for like-for-like custom conversions', () => {
  expect(LANDING_EVENTS).toEqual({ ku: 'LandingClickKU', buy: 'LandingClickBuy', paperback: 'LandingClickPaperback' });
});

test('money and reviews', () => {
  expect(money('9.99')).toBe('$9.99');
  expect(money('$9.99')).toBe('$9.99');
  expect(money('')).toBe('');
  expect(toLandingReview('Title here\n\nBody  one.\nTwo', 'R')).toEqual({ title: 'Title here', body: 'Body one. Two', reviewer: 'R' });
  expect(toLandingReview('Just a body', 'R')).toEqual({ title: '', body: 'Just a body', reviewer: 'R' });
  expect(toLandingReview('T\n\nlong', 'R', 'cut … short').body).toBe('cut … short');
});

// suite_006 §2: a market is a storefront, a tag set and a language.

test.describe('landingQuotes: a landing block\'s pull quote and reviews', () => {
  const entry = (id: string, reviewerName: string, quote: string, reviewerPlatform = 'amazon', bookTitle?: string) => ({
    id,
    data: { quote, reviewerName, reviewerPlatform, bookTitle },
  });
  const testimonials = [
    entry('lead', 'Kindle Customer', 'Oh wow!\n\nLoved it.'),
    entry('two', 'Coder jane', 'Worth the wait!\n\nFirst paragraph.\n\nSecond paragraph.'),
    entry('other', 'Blanca', 'Box set\n\nAll good.', 'goodreads', 'The Bride Program Box Set'),
  ];

  test('a block that names none renders none', () => {
    expect(landingQuotes({}, testimonials, 'A Book')).toEqual({ pullQuote: undefined, reviews: [] });
    expect(landingQuotes({ reviews: [] }, testimonials, 'A Book')).toEqual({ pullQuote: undefined, reviews: [] });
  });

  test('the lead and each review, in the block\'s order, cited with reviewer and platform', () => {
    const q = landingQuotes({ pullQuote: { id: 'lead' }, reviews: [{ id: 'other' }, { id: 'two', excerpt: 'First paragraph.' }] }, testimonials, 'A Book');
    expect(q.pullQuote).toEqual({ title: 'Oh wow!', body: 'Loved it.', reviewer: 'Kindle Customer', cite: 'Kindle Customer, Amazon review of A Book' });
    expect(q.reviews.map((r) => [r.title, r.body, r.cite])).toEqual([
      ['Box set', 'All good.', 'Blanca, Goodreads review of The Bride Program Box Set'],
      ['Worth the wait!', 'First paragraph.', 'Coder jane, Amazon review of A Book'],
    ]);
  });

  test('an id with no testimonial shows nothing', () => {
    expect(landingQuotes({ pullQuote: { id: 'nope' }, reviews: [{ id: 'nope' }] }, testimonials, 'A Book')).toEqual({ pullQuote: undefined, reviews: [] });
  });
});

test.describe('markets: the storefront per market', () => {
  test('amazonDp builds the market’s /dp link, US by default', () => {
    expect(amazonDp('B0B2M4RGCS')).toBe('https://www.amazon.com/dp/B0B2M4RGCS');
    expect(amazonDp('B0FIXDE001', 'DE')).toBe('https://www.amazon.de/dp/B0FIXDE001');
    expect(amazonDp(' B0FIXFR001 ', 'FR')).toBe('https://www.amazon.fr/dp/B0FIXFR001');
    expect(amazonDp(undefined, 'DE')).toBe('');
    expect(() => amazonDp('B0FIXDE001', 'XX')).toThrow('No Amazon storefront for market XX');
  });
  test('the search fallback goes to the market’s storefront too', () => {
    expect(amazonSearch('Bride Program Box Set Dane Griggs')).toBe(
      'https://www.amazon.com/s?k=Bride+Program+Box+Set+Dane+Griggs&i=digital-text',
    );
    expect(amazonSearch('Bride Program', 'FR')).toBe('https://www.amazon.fr/s?k=Bride+Program&i=digital-text');
  });
  test('the storefront table is marketOf the other way round', () => {
    for (const [market, host] of Object.entries(STOREFRONTS)) expect(marketOf(`https://${host}/dp/X`)).toBe(market);
    for (const lang of LANDING_LANGS) expect(marketOf(amazonDp('B0FIXDE001', LANG_MARKET[lang]))).toBe(LANG_MARKET[lang]);
  });
  test('a DE link takes the DE tag, never the US one', () => {
    const tags = {
      US: { 'the-bride-program-box-set': { ku: 'https://www.amazon.com/dp/B0B2M4RGCS?maas=US_KU' } },
      DE: { 'the-bride-program-box-set': { ku: 'https://www.amazon.de/dp/B0FIXDE001?maas=DE_KU' } },
    };
    expect(tagFor(tags, 'the-bride-program-box-set', 'ku', amazonDp('B0FIXDE001', 'DE'))).toBe(tags.DE['the-bride-program-box-set'].ku);
    expect(tagFor(tags, 'the-bride-program-box-set', 'ku', amazonDp('B0FIXFR001', 'FR'))).toBeUndefined();
  });
  test('English pages stay at the root; the others under /<lang>', () => {
    expect(langPath('en', '/series/saving-ceraste/box-set/')).toBe('/series/saving-ceraste/box-set/');
    expect(langPath('de', '/series/saving-ceraste/box-set/')).toBe('/de/series/saving-ceraste/box-set/');
  });
  test('the config names the market; no print link or KU door is no link and no missing tag', () => {
    const targets = { kindleUrl: amazonDp('B0FIXFR001', 'FR'), paperbackUrl: '', product: 'the-bride-program-box-set', printProduct: 'the-bride-program' };
    const { links, config } = landingSetup('bride-program-box-set', targets, {}, 'FR');
    expect(config.market).toBe('FR');
    expect(links.paperback).toBe('');
    expect(config.missingTags.map((m) => m.door)).toEqual(['ku', 'kindle']);
    const notKu = landingSetup('bride-program-box-set', { ...targets, ku: false }, {}, 'FR');
    expect(notKu.links.ku).toBe('');
    expect(notKu.config.missingTags.map((m) => m.door)).toEqual(['kindle']);
  });
});

test.describe('strings: one table per language', () => {
  const sample = (s: LandingStrings): string[] => [
    s.readFree,
    s.freeFor,
    s.buyBoxSet('9'),
    s.buyBoxSet(),
    s.valueLine(9, 'a', 'b'),
    s.preferPaper,
    s.completeSeries('X', 9),
    s.completeSet(9),
    s.booksInside(9),
    s.book(1),
    s.coverOf('X'),
    s.boxSetAlt('X', 9),
    s.seriesAverage('4'),
    s.ratingsAcross('1', 'X'),
    s.ratingsAcrossShort('1'),
    s.readersSay,
    s.reviewCite('R'),
    s.quote('Q'),
    s.closing(9),
    s.availableAtAmazon,
    s.pageTitle('X', 9),
    s.pageDescription('X', 9, true),
    ...Object.values(s.consent),
    ...Object.values(s.chrome),
  ];
  test('every table has every key', () => {
    const keys = Object.keys(LANDING_STRINGS.en).sort();
    for (const lang of LANDING_LANGS) expect(Object.keys(LANDING_STRINGS[lang]).sort()).toEqual(keys);
  });
  test('the English table is the copy the page has always carried', () => {
    const en = LANDING_STRINGS.en;
    expect(en.completeSeries('Bride Program', 9)).toBe('The complete Bride Program · 9 books');
    expect(en.booksInside(9)).toBe('All nine books inside');
    // Kindle Unlimited became Kindle+ (2026-10-22): Gwen's English landing pages' words.
    expect(en.readFree).toBe('Read free with Kindle+');
    expect(en.freeFor).toBe('Free for Kindle+ members');
    expect(en.pageDescription('The Bride Program Box Set', 9, true)).not.toMatch(/Kindle Unlimited/);
    expect(en.booksInside(8)).toBe('All 8 books inside');
    expect(en.buyBoxSet('$9.99')).toBe('Buy the Kindle box set — $9.99');
    expect(formatRating(en, 4.5)).toBe('4.5');
    expect(formatCount(en, 7344)).toBe('7,344');
  });
  for (const lang of LANDING_LANGS) {
    test(`${lang}: no English fixed copy`, () => {
      const english = new Set(sample(LANDING_STRINGS.en));
      const ours = sample(LANDING_STRINGS[lang]);
      // Nothing may match English (Kindle+ is the one word every language shares).
      expect(ours.filter((line) => english.has(line))).toEqual([]);
      for (const line of ours) expect(line).not.toMatch(/\b(the|books|with|members|buy|review|ratings|average|Goodreads)\b/i);
    });
  }
  // Kindle Unlimited became Kindle+ on amazon.de and amazon.fr on 2026-10-22, as in the US
  // (#8862): the DE/FR ads say Kindle+, and so do the doors they land on. Gwen's DE/FR words.
  test('DE and FR doors say Kindle+; "Kindle Unlimited" only in the formerly line', () => {
    const { de, fr } = LANDING_STRINGS;
    expect(de.readFree).toBe('Gratis lesen mit Kindle+');
    expect(de.freeFor).toBe('Für Kindle+-Mitglieder kostenlos');
    expect(de.formerlyKU).toBe('ehemals Kindle Unlimited');
    expect(de.pageDescription('Das Bräute-Programm', 9, true)).toBe('Das Bräute-Programm: alle neun Bände in einem Sammelband. Für Kindle+-Mitglieder kostenlos.');
    expect(de.pageDescription('Das Bräute-Programm', 9, true, true)).toBe(
      'Das Bräute-Programm: alle neun Bände in einem Sammelband. Für Kindle+-Mitglieder (ehemals Kindle Unlimited) kostenlos.',
    );
    expect(fr.readFree).toBe('Lire gratuitement avec Kindle+');
    expect(fr.freeFor).toBe('Gratuit pour les membres Kindle+');
    expect(fr.formerlyKU).toBe('anciennement Kindle Unlimited');
    expect(fr.pageDescription('Le Programme', 9, true, true)).toBe(
      'Le Programme\u00a0: les neuf tomes réunis en une intégrale. Gratuit pour les membres Kindle+ (anciennement Kindle Unlimited).',
    );
    expect(fr.pageDescription('Le Programme', 9, false, true)).not.toMatch(/Kindle/);
    // English has no formerly line: the English page does not change.
    expect(LANDING_STRINGS.en.formerlyKU).toBe('');
    for (const s of [de, fr]) {
      const lines = [...sample(s), s.pageDescription('X', 9, true, false), s.pageDescription('X', 9, true, true).replace(` (${s.formerlyKU})`, '')];
      for (const line of lines) expect(line).not.toMatch(/Kindle[\s\u00a0-]+Unlimited/i);
    }
  });
  test('the formerly window: through kindlePlusFormerlyUntil, inclusive, UTC', () => {
    expect(showFormerlyKU('2027-01-20', new Date('2027-01-20T23:59:59Z'))).toBe(true);
    expect(showFormerlyKU('2027-01-20', new Date('2027-01-21T00:00:00Z'))).toBe(false);
    expect(showFormerlyKU(new Date('2027-01-20'), new Date('2026-11-13T12:00:00Z'))).toBe(true);
    expect(showFormerlyKU(undefined)).toBe(false);
    expect(showFormerlyKU('not a date')).toBe(false);
  });
  test('numbers as the language writes them', () => {
    expect(formatRating(LANDING_STRINGS.de, 4.4)).toBe('4,4');
    expect(formatCount(LANDING_STRINGS.de, 1234)).toBe('1.234');
    expect(formatRating(LANDING_STRINGS.fr, 4.4)).toBe('4,4');
  });
});

test.describe('landingDoorsSetup (a book page of several doors)', () => {
  const tags = {
    US: {
      'a-rosie-christmas': { ku: 'maas=maas_adg_RKU_afap_abs&ref_=aa_maas&tag=maas', kindle: 'maas=maas_adg_RK_afap_abs&ref_=aa_maas&tag=maas' },
      'the-bride-program-box-set': { ku: TAG_A },
    },
  };
  const doors = [
    { kindleUrl: 'https://www.amazon.com/dp/B0CPB2FSSQ', paperbackUrl: 'https://www.amazon.com/dp/B0CPHSRX29', product: 'a-rosie-christmas', printProduct: 'a-rosie-christmas' },
    { kindleUrl: KINDLE, paperbackUrl: PRINT, product: 'the-bride-program-box-set', printProduct: 'the-bride-program' },
  ];

  test('each door takes its own product\'s tags; every door\'s untagged buttons are listed once, in the build line too', () => {
    const warn = console.warn;
    const lines: string[] = [];
    console.warn = (line: string) => lines.push(line);
    try {
      const { links, config } = landingDoorsSetup('rosie-christmas-book-landing', doors, { attributionTags: tags });
      expect(links[0].ku).toBe('https://www.amazon.com/dp/B0CPB2FSSQ?maas=maas_adg_RKU_afap_abs&ref_=aa_maas&tag=maas');
      expect(links[0].buy).toBe('https://www.amazon.com/dp/B0CPB2FSSQ?maas=maas_adg_RK_afap_abs&ref_=aa_maas&tag=maas');
      expect(links[1].ku).toBe(TAG_A);
      expect(links[1].paperback).toBe(PRINT);
      expect(config.page).toBe('rosie-christmas-book-landing');
      expect(config.missingTags).toEqual([
        { product: 'a-rosie-christmas', door: 'print', href: 'https://www.amazon.com/dp/B0CPHSRX29' },
        { product: 'the-bride-program-box-set', door: 'kindle', href: KINDLE },
        { product: 'the-bride-program', door: 'print', href: PRINT },
      ]);
      expect(lines).toEqual([
        `[attribution] missing on rosie-christmas-book-landing: ${missingLine(config.missingTags)}`,
      ]);
      expect(missingLine(config.missingTags)).toBe('a-rosie-christmas · Print, the-bride-program-box-set · Kindle, the-bride-program · Print');
    } finally {
      console.warn = warn;
    }
  });
});
