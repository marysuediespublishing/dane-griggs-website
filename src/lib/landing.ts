/**
 * Ad landing pages (the box-set pages the Meta ads send readers to): the build-time
 * half. Turns site-config's landing fields into the links on the three buttons and
 * the config the browser half (landing-client.ts) runs on.
 *
 * Ported from gwen-demarco-website's Sophie Feegle box-set page (job 4212) as a
 * shared piece: a new landing page is one page file using these helpers and the
 * components in src/components/landing/.
 */

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

/** site-config's landing fields (src/content.config.ts, settings). */
export interface LandingSettings {
  metaPixelId?: string;
  landingAttributionTag?: string;
  paperbackAttributionTag?: string;
  landingAttributionTags?: { campaign: string; tag?: string; paperbackTag?: string }[];
  pressCtrEndpoint?: string;
}

/** What the browser half needs; serialised into the page. */
export interface LandingConfig {
  /** Names the page in the click events and the CTR beacon. */
  page: string;
  pixelId: string;
  ctrEndpoint: string;
  /** Links per utm_campaign; a campaign not listed keeps the links the page shipped with. */
  campaignLinks: Record<string, LandingLinks>;
}

/** Where the buttons go, before any Attribution tag. */
export interface LandingTargets {
  /** The Kindle edition: both the KU and the Buy button. */
  kindleUrl: string;
  /** Print (book 1 in paperback on the box-set pages). */
  paperbackUrl: string;
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

/**
 * The links every visitor gets (the default tags: the page is unlinked from the site,
 * so everyone on it came from an ad), and each campaign's own. An empty tag in a
 * campaign row falls back to the default one.
 */
export function landingLinks(
  targets: LandingTargets,
  settings: LandingSettings = {},
): { links: LandingLinks; campaignLinks: Record<string, LandingLinks> } {
  const build = (kindleTag?: string, paperbackTag?: string): LandingLinks => {
    const kindle = withTag(targets.kindleUrl, kindleTag);
    return { ku: kindle, buy: kindle, paperback: withTag(targets.paperbackUrl, paperbackTag) };
  };
  const defaultTag = settings.landingAttributionTag;
  const defaultPaperbackTag = settings.paperbackAttributionTag;

  const campaignLinks: Record<string, LandingLinks> = {};
  for (const row of settings.landingAttributionTags ?? []) {
    const campaign = row.campaign?.trim();
    if (!campaign) continue;
    campaignLinks[campaign] = build(row.tag?.trim() || defaultTag, row.paperbackTag?.trim() || defaultPaperbackTag);
  }
  return { links: build(defaultTag, defaultPaperbackTag), campaignLinks };
}

/** The page's links and the browser config, from site-config. */
export function landingSetup(page: string, targets: LandingTargets, settings: LandingSettings = {}) {
  const { links, campaignLinks } = landingLinks(targets, settings);
  const config: LandingConfig = {
    page,
    pixelId: settings.metaPixelId?.trim() || '',
    ctrEndpoint: settings.pressCtrEndpoint?.trim() || '',
    campaignLinks,
  };
  return { links, config };
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
