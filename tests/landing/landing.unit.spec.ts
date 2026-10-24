// The landing system's pure parts: tags on links, per-campaign links, consent.
import { test, expect } from '@playwright/test';
import { LANDING_EVENTS, landingLinks, landingSetup, money, toLandingReview, withTag } from '../../src/lib/landing';
import { decideConsent, isUsZone, linksForCampaign, siteMarketingConsent } from '../../src/lib/landing-client';
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

test.describe('landingLinks', () => {
  const targets = { kindleUrl: KINDLE, paperbackUrl: PRINT };

  test('KU and Buy share the Kindle link; print has its own tag', () => {
    const { links } = landingLinks(targets, { landingAttributionTag: TAG_A, paperbackAttributionTag: TAG_P });
    expect(links.ku).toContain('maas_adg_AAA');
    expect(links.buy).toBe(links.ku);
    expect(links.paperback).toContain('maas_adg_PPP');
  });

  test('each campaign gets its own tags; an empty one falls back to the default', () => {
    const { campaignLinks } = landingLinks(targets, {
      landingAttributionTag: TAG_A,
      paperbackAttributionTag: TAG_P,
      landingAttributionTags: [
        { campaign: 'x', tag: TAG_X, paperbackTag: '' },
        { campaign: '  ', tag: TAG_X },
      ],
    });
    expect(Object.keys(campaignLinks)).toEqual(['x']);
    expect(campaignLinks.x.ku).toContain('maas_adg_XXX');
    expect(campaignLinks.x.buy).toContain('maas_adg_XXX');
    expect(campaignLinks.x.paperback).toContain('maas_adg_PPP');
  });

  test('no settings: plain links, no campaigns, no pixel, no beacon', () => {
    const { links, config } = landingSetup('p', targets);
    expect(links).toEqual({ ku: KINDLE, buy: KINDLE, paperback: PRINT });
    expect(config).toEqual({ page: 'p', pixelId: '', ctrEndpoint: '', pixelHosts: [...DEFAULT_PIXEL_HOSTS], campaignLinks: {} });
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

test('linksForCampaign: a known campaign swaps, unknown or none keeps the page links', () => {
  const x = { ku: 'k', buy: 'b', paperback: 'p' };
  const config = { page: 'p', pixelId: '1', ctrEndpoint: '', pixelHosts: [], campaignLinks: { x } };
  expect(linksForCampaign(config, 'x')).toBe(x);
  expect(linksForCampaign(config, 'y')).toBeUndefined();
  expect(linksForCampaign(config, '')).toBeUndefined();
  expect(linksForCampaign(config, 'constructor')).toBeUndefined();
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
