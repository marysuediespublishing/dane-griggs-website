// Compares two builds' pages, so "the English pages are unchanged" is a command, not a claim:
//
//   node scripts/compare-dist.mjs <before-dist> <after-dist> [--skip <prefix> …]
//
// Every .html / .xml / .json file in <before> is compared with the same path in <after>, after
// taking out only what differs from one build to the next or what a change is meant to add:
//   - astro-island uids (a fresh id every build);
//   - the hashed file names of Astro's script and CSS chunks (named after the importing route);
//   - `"market":"US",` in a landing page's config (every click event carries market now);
//   - <link rel="alternate" hreflang> lines (an English page gains them when an edition exists);
//   - runs of whitespace, which become one space (HTML renders them alike; text that became an
//     {expression} when the page moved into a component comes out with a space, not a newline).
// Prints each file that still differs, with the first difference, and exits 1 if any does.
// Files only in <after> under a --skip prefix (e.g. de/ fr/) are new pages and are listed.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const [before, after, ...rest] = process.argv.slice(2);
if (!before || !after) {
  console.error('usage: node scripts/compare-dist.mjs <before-dist> <after-dist> [--skip <prefix> …]');
  process.exit(2);
}
const skip = rest.filter((_, i) => rest[i - 1] === '--skip');

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]));

export const normalize = (text) =>
  text
    .replace(/ uid="[^"]*"/g, ' uid=""')
    .replace(/\/_astro\/([^"/]+?)\.[A-Za-z0-9_-]{8}\.(js|css)/g, '/_astro/$1.*.$2')
    .replace(/"market":"US",/g, '')
    .replace(/<link rel="alternate" hreflang="[^"]*" href="[^"]*">/g, '')
    .replace(/\s+/g, ' ');

const pages = (root) => walk(root).filter((f) => /\.(html|xml|json)$/.test(f)).map((f) => relative(root, f));
const beforePages = pages(before);
let differ = 0;
for (const page of beforePages) {
  const other = join(after, page);
  if (!existsSync(other)) {
    console.log(`missing after: ${page}`);
    differ++;
    continue;
  }
  const a = normalize(readFileSync(join(before, page), 'utf8'));
  const b = normalize(readFileSync(other, 'utf8'));
  if (a === b) continue;
  let i = 0;
  while (a[i] === b[i]) i++;
  console.log(`differs: ${page}\n  before: …${a.slice(Math.max(0, i - 80), i + 120)}…\n  after:  …${b.slice(Math.max(0, i - 80), i + 120)}…`);
  differ++;
}
const added = pages(after).filter((p) => !beforePages.includes(p));
for (const page of added) console.log(`${skip.some((s) => page.startsWith(s)) ? 'new page' : 'only after'}: ${page}`);
console.log(`${beforePages.length} files compared, ${differ} differ, ${added.length} new`);
process.exit(differ || added.some((p) => !skip.some((s) => p.startsWith(s))) ? 1 : 0);
