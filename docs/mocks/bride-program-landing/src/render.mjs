// Renders the frames below to ../lofi/<name>.png and ../hifi/<name>.png, and with
// --video records ../flip-through.mp4: the hi-fi frames in walk order, each held,
// scrolled to its foot, and the buttons hovered where the frame says so.
//
//   node docs/mocks/bride-program-landing/src/render.mjs [--video]
//
// Uses this repo's @playwright/test Chromium; the video needs ffmpeg on the PATH.
/* global process, document, console, innerHeight, scrollTo */
import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { readdirSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '..');
const page = pathToFileURL(join(here, 'page.html')).href;
const DESKTOP = { width: 1280, height: 800 };
const PHONE = { width: 390, height: 844 };

// name, viewport, query, what to do before the shot (full page unless `fold`)
const FRAMES = [
	{ name: '01-desktop', size: DESKTOP, query: '' },
	{ name: '02-phone-fold', size: PHONE, query: '', fold: true },
	{ name: '03-phone-full', size: PHONE, query: '' },
	{ name: '04-phone-closing', size: PHONE, query: '', fold: true, scrollTo: '#closing-ctas' },
	{ name: '05-desktop-consent', size: DESKTOP, query: 'consent', fold: true },
	{ name: '06-campaign-hover-ku', size: DESKTOP, query: 'utm_campaign=x', fold: true, hover: '.side [data-cta="ku"]' },
	{ name: '07-campaign-hover-buy', size: DESKTOP, query: 'utm_campaign=x', fold: true, hover: '.side [data-cta="buy"]' },
	{ name: '08-campaign-hover-paperback', size: DESKTOP, query: 'utm_campaign=x', fold: true, hover: '.side [data-cta="paperback"]' },
];

const url = (frame, lo) => `${page}?${[lo ? 'lo' : '', frame.query].filter(Boolean).join('&')}`;

async function open(p, frame, lo) {
	await p.setViewportSize(frame.size);
	await p.goto(url(frame, lo));
	await p.waitForLoadState('networkidle');
	await p.evaluate(() => document.fonts.ready);
	if (frame.scrollTo) await p.locator(frame.scrollTo).scrollIntoViewIfNeeded();
	if (frame.hover) await p.hover(frame.hover);
	await p.waitForTimeout(400);
}

const browser = await chromium.launch();
for (const skin of ['lofi', 'hifi']) {
	rmSync(join(out, skin), { recursive: true, force: true });
	mkdirSync(join(out, skin), { recursive: true });
	const p = await browser.newPage({ deviceScaleFactor: 1 });
	for (const frame of FRAMES) {
		await open(p, frame, skin === 'lofi');
		await p.screenshot({ path: join(out, skin, `${frame.name}.png`), fullPage: !frame.fold });
		console.log(`${skin}/${frame.name}.png`);
	}
	await p.close();
}

if (process.argv.includes('--video')) {
	const tmp = join(out, '.video');
	rmSync(tmp, { recursive: true, force: true });
	const context = await browser.newContext({ viewport: DESKTOP, recordVideo: { dir: tmp, size: DESKTOP } });
	const p = await context.newPage();
	for (const frame of FRAMES) {
		// The phone frames play in a phone-wide strip of the desktop video.
		await open(p, frame, false);
		await p.waitForTimeout(1200);
		if (!frame.fold) {
			const height = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
			for (let y = 0; y < height; y += 24) {
				await p.evaluate((top) => scrollTo(0, top), y);
				await p.waitForTimeout(25);
			}
		}
		await p.waitForTimeout(1500);
	}
	await context.close();
	const [webm] = readdirSync(tmp);
	execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', join(tmp, webm), '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
		'-crf', '26', '-movflags', '+faststart', join(out, 'flip-through.mp4')]);
	rmSync(tmp, { recursive: true, force: true });
	console.log('flip-through.mp4');
}
await browser.close();
