/**
 * Ad landing pages (the box-set pages the Meta ads send readers to): the build-time
 * half. Turns site-config's landing fields into the links on the three buttons and
 * the config the browser half (landing-client.ts) runs on.
 *
 * Ported from gwen-demarco-website's Sophie Feegle box-set page (job 4212) as a
 * shared piece: a new landing page is one page file using these helpers and the
 * components in src/components/landing/.
 */
import { pixelHosts } from './pixel-hosts';

/** The three buttons: Kindle Unlimited, buy the Kindle edition, and print. */
export type LandingCta = 'ku' | 'buy' | 'paperback';

export const LANDING_CTAS: readonly LandingCta[] = ['ku', 'buy', 'paperback'];

/** Custom pixel events, one per button. Same names as Gwen's, so each site's custom conversions read alike. */
export const LANDING_EVENTS: Readonly<Record<LandingCta, string>> = {
  ku: 'LandingClickKU',
  buy: 'LandingClickBuy',
  paperback: 'LandingClickPaperback',
};

export type LandingLinks = Record<LandingCta, string>;

/**
 * Amazon Attribution tags per product and door (Press ad_desk_007, written by Ad
 * Desk's Import tags): site-config `attributionTags.<market>.<product slug>.<door>`,
 * each the whole Attribution URL. A button takes its product's tag for its door,
 * whatever ad sent the visitor.
 */
export type TagDoor = 'ku' | 'kindle' | 'print';
export type AttributionTags = Record<string, Record<string, Partial<Record<TagDoor, string>>>>;

/** The tag door each button takes: KU's, Kindle's (the Buy button), Print's. */
export const CTA_DOOR: Readonly<Record<LandingCta, TagDoor>> = { ku: 'ku', buy: 'kindle', paperback: 'print' };

/** site-config's landing fields (src/content.config.ts, settings). */
export interface LandingSettings {
  metaPixelId?: string;
  attributionTags?: AttributionTags;
  pressCtrEndpoint?: string;
  /** The hosts the pixel and the beacon fire on; anywhere else they log to the console. */
  pixelHosts?: string[];
}

/** A button with no tag: it links to the bare product page. */
export interface MissingTag {
  product: string;
  door: TagDoor;
  href: string;
}

/** What the browser half needs; serialised into the page. */
export interface LandingConfig {
  /** Names the page in the click events and the CTR beacon. */
  page: string;
  /** The storefront the page's buttons go to, as Press names it (US, DE, FR): sent as `market`
   *  on every click event and the beacon. */
  market: string;
  pixelId: string;
  ctrEndpoint: string;
  /** Production hostnames: the pixel and the beacon send only here (see pixel-hosts.ts). */
  pixelHosts: string[];
  /** The buttons with no Attribution tag, for whoever reads the page. */
  missingTags: MissingTag[];
}

/** Where the buttons go, before any Attribution tag, and the products they are. */
export interface LandingTargets {
  /** The Kindle edition: both the KU and the Buy button. */
  kindleUrl: string;
  /** Print (book 1 in paperback on the box-set pages); '' for none (no print link). */
  paperbackUrl: string;
  /** The Kindle edition's product slug in Press's Books (a box set's own). */
  product: string;
  /** The print link's product slug (book 1's on the box-set pages). */
  printProduct: string;
  /** The edition is in Kindle Unlimited in this storefront (default true); false: no KU link,
   *  and no KU tag is missing. */
  ku?: boolean;
}

/**
 * Adds an Amazon Attribution tag to a link. The tag may be the whole Attribution URL
 * or just its query string (`maas=...&ref_=aa_maas&tag=maas`); only the query is used.
 */
export function withTag(href: string, tag?: string): string {
  const query = tag?.trim().replace(/^[^?]*\?/, '');
  if (!query) return href;
  const url = new URL(href);
  new URLSearchParams(query).forEach((value, key) => url.searchParams.set(key, value));
  return url.toString();
}

/** The ASIN of an Amazon `/dp/<ASIN>` link, or ''. */
export function dpAsin(href?: string): string {
  return /\/dp\/([0-9A-Z]{10})(?=[/?#]|$)/i.exec(href ?? '')?.[1]?.toUpperCase() ?? '';
}

export const MARKETS: Record<string, string> = {
  'www.amazon.com': 'US',
  'www.amazon.co.uk': 'UK',
  'www.amazon.ca': 'CA',
  'www.amazon.de': 'DE',
  'www.amazon.fr': 'FR',
  'www.amazon.it': 'IT',
  'www.amazon.es': 'ES',
};

/** The storefront a link goes to, as Press names it ('US'), or ''. */
export function marketOf(href: string): string {
  try {
    return MARKETS[new URL(href).hostname.toLowerCase()] ?? '';
  } catch {
    return '';
  }
}

/** The storefront host per market: the inverse of `marketOf` ('DE' → www.amazon.de). */
export const STOREFRONTS: Record<string, string> = Object.fromEntries(
  Object.entries(MARKETS).map(([host, market]) => [market, host]),
);

function storefront(market: string): string {
  const host = STOREFRONTS[market.toUpperCase()];
  if (!host) throw new Error(`No Amazon storefront for market ${market}`);
  return `https://${host}`;
}

/** `https://www.amazon.<tld>/dp/<ASIN>` in the market's storefront (US by default), or ''. */
export function amazonDp(asin: string | undefined, market = 'US'): string {
  return asin?.trim() ? `${storefront(market)}/dp/${asin.trim()}` : '';
}

/** A Kindle-store search in the market's storefront: the fallback when a product has no ASIN. */
export function amazonSearch(terms: string, market = 'US'): string {
  return `${storefront(market)}/s?${new URLSearchParams({ k: terms, i: 'digital-text' })}`;
}

/** The landing pages' languages besides English, and the market each one sells in. */
export const LANDING_LANGS = ['de', 'fr'] as const;
export type LandingLang = 'en' | (typeof LANDING_LANGS)[number];
export const LANG_MARKET: Readonly<Record<LandingLang, string>> = { en: 'US', de: 'DE', fr: 'FR' };

/** A landing page's path in a language: English at the root, the others under /<lang>. */
export function langPath(lang: LandingLang, path: string): string {
  return lang === 'en' ? path : `/${lang}${path}`;
}

/** The tag for one button: its product's for its door, in the link's storefront,
 *  and only when the tag is for the button's own product page. */
export function tagFor(tags: AttributionTags | undefined, product: string, door: TagDoor, href: string): string | undefined {
  const tag = tags?.[marketOf(href)]?.[product]?.[door]?.trim();
  if (!tag) return undefined;
  const asin = dpAsin(tag);
  return !asin || asin === dpAsin(href) ? tag : undefined;
}

/** The three links, each with its (product, door) tag, and the buttons that have none. */
export function landingLinks(targets: LandingTargets, settings: LandingSettings = {}): { links: LandingLinks; missing: MissingTag[] } {
  const missing: MissingTag[] = [];
  const link = (cta: LandingCta) => {
    const href = cta === 'paperback' ? targets.paperbackUrl : targets.kindleUrl;
    if (!href || (cta === 'ku' && targets.ku === false)) return '';
    const product = cta === 'paperback' ? targets.printProduct : targets.product;
    const tag = tagFor(settings.attributionTags, product, CTA_DOOR[cta], href);
    if (!tag) missing.push({ product, door: CTA_DOOR[cta], href });
    return withTag(href, tag);
  };
  return { links: { ku: link('ku'), buy: link('buy'), paperback: link('paperback') }, missing };
}

/** The page's links and the browser config, from site-config. The build prints the
 *  buttons with no tag, so a product's missing tags are seen. */
export function landingSetup(page: string, targets: LandingTargets, settings: LandingSettings = {}, market = 'US') {
  const { links, missing } = landingLinks(targets, settings);
  return { links, config: landingConfig(page, missing, settings, market) };
}

/** "the-bride-program · Print, a-rosie-christmas · KU": the build's missing-tag line. */
export function missingLine(missing: MissingTag[]): string {
  const label = { ku: 'KU', kindle: 'Kindle', print: 'Print' } as const;
  return missing.map((m) => `${m.product} · ${label[m.door]}`).join(', ');
}

/** A page of several doors (a book's landing page): each door's links, and one config
 *  listing every door's buttons with no tag. */
export function landingDoorsSetup(page: string, doors: LandingTargets[], settings: LandingSettings = {}, market = 'US') {
  const built = doors.map((door) => landingLinks(door, settings));
  const config = landingConfig(page, built.flatMap((b) => b.missing), settings, market);
  return { links: built.map((b) => b.links), config };
}

function landingConfig(page: string, missing: MissingTag[], settings: LandingSettings, market: string): LandingConfig {
  if (missing.length) {
    const where = market === 'US' ? page : `${page} (${market})`;
    console.warn(`[attribution] missing on ${where}: ${missingLine(missing)}`);
  }
  const config: LandingConfig = {
    page,
    market,
    pixelId: settings.metaPixelId?.trim() || '',
    ctrEndpoint: settings.pressCtrEndpoint?.trim() || '',
    pixelHosts: pixelHosts(settings.pixelHosts),
    missingTags: missing,
  };
  return config;
}

/** "9.99" or "$9.99" → "$9.99"; empty → "". */
export function money(value?: string): string {
  const amount = value?.trim().replace(/^\$/, '');
  return amount ? `$${amount}` : '';
}

export interface LandingReview {
  title: string;
  body: string;
  reviewer: string;
}

/**
 * A testimonial as a landing-page review. Testimonial quotes are "Review title\n\nReview body"
 * (or just the body); `excerpt` replaces a long body, with "…" wherever text is cut.
 */
export function toLandingReview(quote: string, reviewer: string, excerpt?: string): LandingReview {
  const [first, ...rest] = quote.trim().split(/\n\s*\n/);
  const hasTitle = rest.length > 0;
  const body = excerpt ?? (hasTitle ? rest.join(' ') : first);
  return { title: hasTitle ? first.trim() : '', body: body.replace(/\s+/g, ' ').trim(), reviewer };
}

/** JSON safe inside a <script> element. */
export function scriptJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
