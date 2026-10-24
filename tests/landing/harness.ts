/**
 * Serves the built site (dist/) to the browser through request routing, so the
 * landing tests need no server: `npm run build`, then `npm run test:landing`.
 * Meta's script, Amazon and the Press endpoint are stubbed; what the page sends
 * them is recorded.
 */
import { existsSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import type { BrowserContext, Page } from '@playwright/test';
import type { LandingConfig } from '../../src/lib/landing';

/** Dane's production host: the pixel and the beacon send only here (routed, so nothing leaves the machine). */
export const ORIGIN = 'https://danegriggs.com';
/** A local build: the pixel and the beacon only log `[pixel] …` lines. */
export const LOCAL_ORIGIN = 'http://localhost:4321';
export const BOX_SET_PATH = '/series/saving-ceraste/box-set/';
export const CTR_ENDPOINT = 'https://press.test/ctr';
const DIST = join(process.cwd(), 'dist');

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml',
};

export function distFile(path: string): string | undefined {
  const file = join(DIST, decodeURIComponent(path), path.endsWith('/') ? 'index.html' : '');
  return existsSync(file) ? file : undefined;
}

export interface Served {
  /** Bodies POSTed to the Press CTR endpoint. */
  beacons: Record<string, unknown>[];
  /** Whether the browser asked for Meta's fbevents.js. */
  pixelRequested: () => boolean;
  /** Requests to Meta (fbevents.js, /tr) and the CTR endpoint, as URLs. */
  sent: string[];
}

/** Edits the page's landing config before the browser sees it (e.g. to add a campaign). */
export type ConfigEdit = (config: LandingConfig) => LandingConfig;

export async function serveDist(context: BrowserContext, edit?: ConfigEdit, origin = ORIGIN): Promise<Served> {
  if (!existsSync(join(DIST, BOX_SET_PATH, 'index.html'))) {
    throw new Error('dist/ has no box-set page: run `npm run build` first');
  }
  const beacons: Record<string, unknown>[] = [];
  const sent: string[] = [];
  let pixel = false;

  await context.route(`${origin}/**`, async (route) => {
    const { pathname } = new URL(route.request().url());
    const file = distFile(pathname);
    if (!file) return route.fulfill({ status: 404, body: 'not found' });
    let body = readFileSync(file);
    if (edit && pathname === BOX_SET_PATH) {
      const html = body.toString('utf8').replace(
        /(<script type="application\/json" id="landing-config">)(.*?)(<\/script>)/s,
        (_m, open: string, json: string, close: string) =>
          open + JSON.stringify(edit(JSON.parse(json) as LandingConfig)).replace(/</g, '\\u003c') + close,
      );
      body = Buffer.from(html, 'utf8');
    }
    return route.fulfill({ status: 200, body, contentType: TYPES[extname(file)] ?? 'application/octet-stream' });
  });
  // Meta's script is stubbed empty: fbq() calls stay in window.fbq.queue, where the tests read them.
  await context.route('https://connect.facebook.net/**', (route) => {
    pixel = true;
    sent.push(route.request().url());
    return route.fulfill({ status: 200, contentType: 'text/javascript', body: '' });
  });
  await context.route('https://www.facebook.com/tr**', (route) => {
    sent.push(route.request().url());
    return route.fulfill({ status: 204, body: '' });
  });
  await context.route('https://fonts.googleapis.com/**', (route) => route.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  await context.route('https://www.amazon.com/**', (route) => route.fulfill({ status: 200, contentType: 'text/html', body: 'amazon' }));
  await context.route(`${CTR_ENDPOINT}**`, async (route) => {
    sent.push(route.request().url());
    beacons.push(JSON.parse(route.request().postData() ?? '{}') as Record<string, unknown>);
    return route.fulfill({ status: 204, body: '' });
  });
  // Clicks are recorded, never followed: the page's own listener runs first, then this stops the navigation.
  await context.addInitScript(() => {
    window.addEventListener('click', (event) => {
      if ((event.target as Element | null)?.closest?.('[data-landing-cta]')) event.preventDefault();
    });
  });
  return { beacons, pixelRequested: () => pixel, sent };
}

/** The fbq() calls the page has made, as argument lists. */
export async function pixelCalls(page: Page): Promise<unknown[][]> {
  return page.evaluate(() => {
    const fbq = (window as unknown as { fbq?: { queue?: ArrayLike<unknown>[] } }).fbq;
    return (fbq?.queue ?? []).map((args) => Array.from(args));
  });
}
