// The build's walk (job 4212): the built page (dist/) opened with ?utm_campaign=x,
// each button hovered and none clicked, at desktop and phone widths. Writes
// ../build/<n>-*.png and prints, per button, where it goes and what the pixel was
// told. A status line is drawn on hover because a screenshot has no browser chrome.
//
//   npm run build && node docs/mocks/bride-program-landing/src/walk.mjs
//
// Served by request routing (no server); Meta's script and Amazon are stubbed.
/* global console, document, window, process */
import { chromium, devices } from '@playwright/test';
import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '..', 'build');
const dist = join(process.cwd(), 'dist');
const ORIGIN = 'https://danegriggs.test';
const URL_ = `${ORIGIN}/series/saving-ceraste/box-set/?utm_source=meta&utm_campaign=x`;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml' };

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();

for (const [label, device] of [['desktop', { viewport: { width: 1280, height: 800 } }], ['phone', devices['Pixel 5']]]) {
	const context = await browser.newContext({ ...device, timezoneId: 'America/New_York' });
	await context.route(`${ORIGIN}/**`, (route) => {
		const path = decodeURIComponent(new URL(route.request().url()).pathname);
		const file = join(dist, path, path.endsWith('/') ? 'index.html' : '');
		if (!existsSync(file)) return route.fulfill({ status: 404, body: '' });
		return route.fulfill({ body: readFileSync(file), contentType: TYPES[extname(file)] ?? 'application/octet-stream' });
	});
	await context.route('https://connect.facebook.net/**', (route) => route.fulfill({ contentType: 'text/javascript', body: '' }));
	await context.addInitScript(() => {
		document.addEventListener('mouseover', (e) => {
			const a = e.target.closest?.('[data-landing-cta]');
			let s = document.getElementById('walk-status');
			if (!s) {
				s = document.createElement('div');
				s.id = 'walk-status';
				s.style.cssText = 'position:fixed;left:0;bottom:0;z-index:99;padding:3px 8px;font:12px system-ui;background:#f1f3f4;border:1px solid #c4c7c5;color:#202124;max-width:90%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis';
				document.body.append(s);
			}
			s.hidden = !a;
			if (a) s.textContent = a.href;
		});
	});
	const page = await context.newPage();
	await page.goto(URL_);
	await page.waitForLoadState('networkidle');
	await page.screenshot({ path: join(out, `${label}-0-full.png`), fullPage: true });
	await page.screenshot({ path: join(out, `${label}-1-open.png`) });
	console.log(`${label}: opened ${URL_}`);

	const set = label === 'desktop' ? 'side' : 'closing';
	const ctas = label === 'desktop' ? ['ku', 'buy', 'paperback'] : ['ku-bar', 'buy-bar', 'ku', 'buy', 'paperback'];
	let n = 2;
	for (const cta of ctas) {
		const id = cta.endsWith('-bar') ? `landing-cta-${cta}` : `landing-cta-${cta}-${set}`;
		const el = page.getByTestId(id);
		await el.hover();
		await page.waitForTimeout(250);
		await page.screenshot({ path: join(out, `${label}-${n++}-hover-${cta}.png`) });
		console.log(`${label}: hover ${id} → ${await el.getAttribute('href')}`);
	}
	const calls = await page.evaluate(() => (window.fbq?.queue ?? []).map((a) => Array.from(a)));
	console.log(`${label}: pixel calls ${JSON.stringify(calls)}; still on ${new URL(page.url()).pathname}`);
	await context.close();
}
await browser.close();
