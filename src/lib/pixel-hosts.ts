/**
 * Where the Meta pixel may send anything: Dane's production hosts only. Anywhere
 * else (localhost, 127.0.0.1, a preview, the GitHub Pages default domain) the same
 * calls are logged as `[pixel] …` console lines and nothing reaches Meta or Press.
 *
 * The hosts come from site-config (`pixelHosts`); these are the defaults when it
 * lists none. The inline pixel in src/components/MetaPixel.astro repeats
 * isPixelHost and pixelLine in plain JS (it runs before any bundle loads).
 */
export const DEFAULT_PIXEL_HOSTS: readonly string[] = ['danegriggs.com', 'www.danegriggs.com'];

function normalize(host: string): string {
  return host.trim().toLowerCase().replace(/\.$/, '');
}

/** site-config's hosts, normalised; none listed → the defaults. */
export function pixelHosts(configured?: readonly string[]): string[] {
  const hosts = (configured ?? []).map(normalize).filter(Boolean);
  return hosts.length ? hosts : [...DEFAULT_PIXEL_HOSTS];
}

/** Whether this page's hostname may fire the pixel and the CTR beacon. */
export function isPixelHost(hostname: string, hosts: readonly string[]): boolean {
  const host = normalize(hostname);
  return Boolean(host) && hosts.some((h) => normalize(h) === host);
}

/**
 * The console line for an fbq() call off the production hosts:
 * ['track', 'PageView', {…}] → `[pixel] PageView {…}`,
 * ['trackCustom', 'LandingClickKU', {…}] → `[pixel] LandingClickKU {…}`,
 * anything else (init, consent) → `[pixel] init 123`.
 */
export function pixelLine(args: readonly unknown[]): string {
  const [method, ...rest] = args;
  if (method === 'track' || method === 'trackCustom') {
    const [event, data] = rest;
    return `[pixel] ${String(event)} ${JSON.stringify(data ?? {})}`;
  }
  return ['[pixel]', String(method), ...rest.map((a) => (typeof a === 'string' ? a : JSON.stringify(a)))].join(' ');
}

/** The beacon's console line off the production hosts. */
export function beaconLine(body: unknown): string {
  return `[pixel] beacon ${JSON.stringify(body)}`;
}
