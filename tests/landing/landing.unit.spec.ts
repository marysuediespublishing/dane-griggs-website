// The landing system's pure parts: tags on links, per-campaign links, consent.
import { test, expect } from '@playwright/test';
import { LANDING_EVENTS, landingLinks, landingSetup, money, tagFor, toLandingReview, withTag } from '../../src/lib/landing';
import { decideConsent, isUsZone, siteMarketingConsent, utmOf } from '../../src/lib/landing-client';
import { DEFAULT_PIXEL_HOSTS, beaconLine, isPixelHost, pixelHosts, pixelLine } from '../../src/lib/pixel-hosts';

const KINDLE = 'https://www.amazon.com/dp/B0B2M4RGCS';
const PRINT = 'https://www.amazon.com/dp/1090344378';
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
