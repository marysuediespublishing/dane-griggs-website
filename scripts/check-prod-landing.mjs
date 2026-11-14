// The production build's DE/FR box-set pages link only the content's real ASINs:
//
//   npm run build            (runs this as `postbuild`)
//   node scripts/check-prod-landing.mjs [dist]
//
// The test build (`npm run build:landing-test`) sets LANDING_EDITIONS_FIXTURE, and there the
// fixture's made-up editions (ASINs starting B0FIX) win over the content's (src/lib/editions.ts).
// This checks that none of that reaches production: for each of /de/ and /fr/, the page links
// Amazon only at the content's own edition ASINs (asin, paperbackAsin in
// src/content/series/saving-ceraste.md), never a B0FIX one or a FIXTURE tag. And it shows the
// edition's own reader reviews (editions.<lang>.reviews), each with its title, its words and its
// reviewer's name in the reviews band, and no reviews band when the edition has none (#8701).
// And it calls the programme Kindle+ (#8862): Amazon renamed Kindle Unlimited on amazon.de and
// amazon.fr on 2026-10-22, and the DE/FR ads say Kindle+. "Kindle Unlimited" may stand only in
// the "ehemals / anciennement Kindle Unlimited" line (data-formerly-ku, and its parenthesis in
// the meta description) and in a reader's own quoted words (blockquote).
//
// A page that is absent passes: until the content carries a language's edition, production
// builds no /<lang>/ page for it (before #8708 there is no /de/ or /fr/ box-set at all), and
// there is nothing to check. A page that exists while the content has no edition for it fails:
// in a production build it could only have come from the fixture.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

const dist = process.argv[2] ?? 'dist';
const SERIES = 'saving-ceraste';
const MARKET_HOST = { de: 'amazon.de', fr: 'amazon.fr' };
const { data } = matter(readFileSync(`src/content/series/${SERIES}.md`, 'utf8'));

// The reviews band's text, tags dropped, entities decoded and white space collapsed, as a reader sees it.
const text = (s) =>
  s
    .replace(/<[^>]*>/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

// The page with the places "Kindle Unlimited" may stand cut out: what is left must not name it.
const FORMERLY = { de: 'ehemals Kindle Unlimited', fr: 'anciennement Kindle Unlimited' };
const outsideFormerly = (html, lang) =>
  html
    .replace(/<span[^>]*\bdata-formerly-ku\b[^>]*>[^<]*<\/span>/g, '')
    .replace(/<blockquote\b.*?<\/blockquote>/gs, '')
    .replaceAll(` (${FORMERLY[lang]})`, '');
const KINDLE_UNLIMITED = /Kindle(\s|&nbsp;|&#160;|\u00a0|-)+Unlimited/i;

const failures = [];
for (const [lang, host] of Object.entries(MARKET_HOST)) {
  const file = join(dist, lang, 'series', SERIES, 'box-set', 'index.html');
  const edition = data.editions?.[lang];
  if (!existsSync(file)) {
    console.log(`/${lang}/ box-set: not built${edition ? ' (but the content has an edition: is dist a full build?)' : ' (no edition in the content yet)'}`);
    if (edition) failures.push(`/${lang}/: the content has an edition but ${file} is missing`);
    continue;
  }
  const html = readFileSync(file, 'utf8');
  if (!edition) {
    failures.push(`/${lang}/: built, but the content has no ${lang} edition (from the fixture?)`);
    continue;
  }
  const real = new Set([edition.asin, edition.paperbackAsin].filter(Boolean));
  const linked = new Set([...html.matchAll(/amazon\.[a-z.]+\/dp\/([A-Z0-9]+)/g)].map((m) => m[1]));
  if (/B0FIX/.test(html)) failures.push(`/${lang}/: carries a fixture ASIN (B0FIX…)`);
  if (/FIXTURE/.test(html)) failures.push(`/${lang}/: carries a fixture tag (FIXTURE)`);
  for (const asin of linked) if (!real.has(asin)) failures.push(`/${lang}/: links ${asin}, not one of the content's (${[...real].join(', ')})`);
  if (!linked.has(edition.asin)) failures.push(`/${lang}/: never links the edition's ASIN ${edition.asin}`);
  if (!html.includes(host)) failures.push(`/${lang}/: no ${host} link`);
  if (KINDLE_UNLIMITED.test(outsideFormerly(html, lang))) failures.push(`/${lang}/: says "Kindle Unlimited" outside the "${FORMERLY[lang]}" line: the programme is Kindle+ (#8862)`);
  if (!html.includes('Kindle+') && edition.kuEnrolled) failures.push(`/${lang}/: in Kindle+ but never says "Kindle+"`);
  const band = html.match(/data-testid="landing-reviews".*?<\/section>/s)?.[0];
  const reviews = edition.reviews ?? [];
  if (reviews.length && !band) failures.push(`/${lang}/: the edition has ${reviews.length} review(s) but the page has no reviews band`);
  if (!reviews.length && band) failures.push(`/${lang}/: a reviews band, but the edition has no reviews of its own`);
  const shown = band ? text(band) : '';
  for (const r of reviews) {
    for (const [what, words] of [['reviewer', r.reviewer], ['title', r.title], ['body', r.body]]) {
      if (words && !shown.includes(text(words))) failures.push(`/${lang}/: ${r.reviewer}'s review: its ${what} is not in the reviews band`);
    }
  }
  console.log(`/${lang}/ box-set: links ${[...linked].join(', ') || 'nothing'}; reviews by ${reviews.map((r) => r.reviewer).join(', ') || 'nobody'}`);
}

if (failures.length) {
  console.error(`check-prod-landing: ${failures.length} failure(s)\n  ${failures.join('\n  ')}`);
  process.exit(1);
}
console.log('check-prod-landing: ok');
