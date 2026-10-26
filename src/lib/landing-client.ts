/**
 * Ad landing pages: the browser half (see landing.ts for the build-time half).
 *
 * - The page's utm_* (which ad sent the visitor), remembered for the tab session,
 *   ride unchanged on every click event; utm_campaign also as `campaign`. The
 *   links' Attribution tags are the build's, per (product, door): no ad changes them.
 * - The Meta pixel loads without a click in a US time zone, after "Allow"
 *   anywhere else, and not at all for a visitor who declined (here, or marketing
 *   cookies in the site's own banner).
 * - Each button fires its custom pixel event (LandingClickKU / Buy / Paperback)
 *   and, once Press has an endpoint, a keepalive `press.landing.ctr` beacon.
 * - Both send only on the production hosts (config.pixelHosts). Anywhere else the
 *   same calls are `[pixel] …` console lines: nothing loads from Meta, nothing posts.
 */
import { LANDING_EVENTS, type LandingConfig, type LandingCta } from './landing';
import { beaconLine, isPixelHost, pixelLine } from './pixel-hosts';

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  push?: unknown;
  loaded?: boolean;
  version?: string;
};
type PixelWindow = Window & { fbq?: Fbq; _fbq?: Fbq };

export type Consent = 'granted' | 'denied' | 'ask' | 'none';

export const CONSENT_KEY = 'dg_marketing_consent';
export const SITE_CONSENT_KEY = 'gdpr-consent';
const AD_KEY = 'dg_landing_from_ad';
const UTM_KEY = 'dg_landing_utm';

// IANA zones for the 50 states and DC; the site is static, so the browser's time
// zone is the region signal.
const US_ZONE =
  /^(America\/(New_York|Detroit|Kentucky\/.+|Indiana\/.+|Chicago|Menominee|North_Dakota\/.+|Denver|Boise|Phoenix|Los_Angeles|Anchorage|Juneau|Sitka|Metlakatla|Yakutat|Nome|Adak)|Pacific\/Honolulu|US\/.+)$/;

export function isUsZone(zone: string): boolean {
  return US_ZONE.test(zone);
}

/** The utm_* of a page's query, in order. */
export function utmOf(params: URLSearchParams): Record<string, string> {
  const utm: Record<string, string> = {};
  params.forEach((value, key) => {
    if (key.startsWith('utm_')) utm[key] = value;
  });
  return utm;
}

/**
 * The site banner's stored choice (CookieConsentBanner): true/false for marketing,
 * or undefined when there is none, it has expired, or it can't be read.
 */
export function siteMarketingConsent(raw: string | null, now = Date.now()): boolean | undefined {
  if (!raw) return undefined;
  try {
    const stored = JSON.parse(raw) as {
      hasConsented?: boolean;
      timestamp?: number;
      expiryDays?: number;
      categories?: { marketing?: boolean };
    };
    if (!stored.hasConsented) return undefined;
    if (stored.timestamp && stored.expiryDays && now > stored.timestamp + stored.expiryDays * 86_400_000) return undefined;
    return Boolean(stored.categories?.marketing);
  } catch {
    return undefined;
  }
}

/** Whether to load the pixel now, ask first, or never. */
export function decideConsent(opts: {
  pixelId: string;
  landingChoice: string | null;
  siteMarketing: boolean | undefined;
  zone: string;
}): Consent {
  if (!opts.pixelId) return 'none';
  if (opts.landingChoice === 'denied') return 'denied';
  if (opts.landingChoice === 'granted') return 'granted';
  if (opts.siteMarketing === false) return 'denied';
  if (opts.siteMarketing === true || isUsZone(opts.zone)) return 'granted';
  return 'ask';
}

function stored(storage: () => Storage, key: string): string | null {
  try {
    return storage().getItem(key);
  } catch {
    return null;
  }
}

function store(storage: () => Storage, key: string, value: string): void {
  try {
    storage().setItem(key, value);
  } catch {
    /* storage blocked: the choice lasts for this page only */
  }
}

/** Meta's base code, unchanged apart from types. */
function loadFbq(w: PixelWindow): Fbq {
  if (w.fbq) return w.fbq;
  const n = function (...args: unknown[]) {
    if (n.callMethod) n.callMethod(...args);
    else n.queue?.push(args);
  } as Fbq;
  w.fbq = n;
  if (!w._fbq) w._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = '2.0';
  n.queue = [];
  const script = w.document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  const first = w.document.getElementsByTagName('script')[0];
  if (first?.parentNode) first.parentNode.insertBefore(script, first);
  else w.document.head.appendChild(script);
  return n;
}

/** Off the production hosts: an fbq that logs each call and sends nothing. */
function consoleFbq(): Fbq {
  return ((...args: unknown[]) => console.log(pixelLine(args))) as Fbq;
}

export function startLanding(config: LandingConfig, w: PixelWindow = window): void {
  const doc = w.document;
  const params = new URLSearchParams(w.location.search);
  const session = () => w.sessionStorage;
  const local = () => w.localStorage;
  const live = isPixelHost(w.location.hostname, config.pixelHosts ?? []);

  // Ad visitor: ?from=ad or utm_source=meta. Only labels the click events' source;
  // the Attribution tags are on every link.
  let fromAd = params.get('from') === 'ad' || (params.get('utm_source') ?? '').toLowerCase() === 'meta';
  if (fromAd) store(session, AD_KEY, '1');
  else fromAd = stored(session, AD_KEY) === '1';

  let utm = utmOf(params);
  if (Object.keys(utm).length) store(session, UTM_KEY, JSON.stringify(utm));
  else {
    try {
      utm = JSON.parse(stored(session, UTM_KEY) ?? '{}') ?? {};
    } catch {
      utm = {};
    }
  }
  const campaign = utm.utm_campaign ?? '';

  const ctas = doc.querySelectorAll<HTMLAnchorElement>('[data-landing-cta]');

  let pixel: Fbq | undefined;
  const loadPixel = () => {
    if (pixel) return;
    pixel = live ? loadFbq(w) : consoleFbq();
    pixel('init', config.pixelId);
    pixel('track', 'PageView', campaign ? { campaign } : {});
  };

  let zone = '';
  try {
    zone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  } catch {
    /* no zone: ask */
  }
  const consent = decideConsent({
    pixelId: config.pixelId,
    landingChoice: stored(local, CONSENT_KEY),
    siteMarketing: siteMarketingConsent(stored(local, SITE_CONSENT_KEY)),
    zone,
  });
  if (consent === 'granted') loadPixel();
  else if (consent === 'ask') {
    const bar = doc.getElementById('landing-consent');
    if (bar) {
      bar.hidden = false;
      bar.addEventListener('click', (event) => {
        const choice = (event.target as Element).closest<HTMLElement>('[data-consent]')?.dataset.consent;
        if (!choice) return;
        store(local, CONSENT_KEY, choice);
        bar.hidden = true;
        if (choice === 'granted') loadPixel();
      });
    }
  }

  ctas.forEach((a) => {
    a.addEventListener('click', () => {
      const cta = a.dataset.landingCta as LandingCta;
      const detail = { page: config.page, cta, source: fromAd ? 'ad' : 'organic', campaign, ...utm };
      if (pixel) pixel('trackCustom', LANDING_EVENTS[cta], detail);
      if (config.ctrEndpoint && !live) {
        console.log(beaconLine({ metric: 'press.landing.ctr', ...detail }));
      } else if (config.ctrEndpoint) {
        try {
          w.fetch(config.ctrEndpoint, {
            method: 'POST',
            keepalive: true,
            // text/plain keeps this a simple request (no CORS preflight).
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ metric: 'press.landing.ctr', ...detail }),
          }).catch(() => {});
        } catch {
          /* the click goes on to Amazon regardless */
        }
      }
    });
  });

  // Phone: slide the fixed bar away while the closing buttons are on screen.
  const bar = doc.getElementById('landing-cta-bar');
  const closing = doc.getElementById('landing-closing');
  if (bar && closing && 'IntersectionObserver' in w) {
    new IntersectionObserver((entries) => {
      bar.classList.toggle('translate-y-full', entries[0].isIntersecting);
    }).observe(closing);
  }
}

/** Runs the page's config, from <script type="application/json" id="landing-config">. */
export function startLandingFromPage(): void {
  const el = document.getElementById('landing-config');
  if (!el?.textContent) return;
  startLanding(JSON.parse(el.textContent) as LandingConfig);
}
