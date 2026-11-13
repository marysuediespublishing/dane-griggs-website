// A Rosie Christmas's English book page (/books/rosie-christmas-book/) is what it was before
// the book had a landing page: this build's HTML (dist/, `npm run build:landing-test`) against a
// build of the base (BOOK_PAGE_BASE_REF, default the merge-base with main), byte for byte but for
// what differs between two builds of the base itself (tests/landing/normalize-book-page.ts).
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test, expect } from '@playwright/test';
import { normalizeBookPage } from './normalize-book-page';

const PAGES = ['books/rosie-christmas-book'];

test('the English book page builds the same HTML as the base', async () => {
  test.setTimeout(300_000);
  const git = (...args: string[]) => execFileSync('git', args, { encoding: 'utf8' }).trim();
  const main = ['origin/main', 'main'].find((ref) => {
    try {
      git('rev-parse', '--verify', '--quiet', ref);
      return true;
    } catch {
      return false;
    }
  });
  const base = process.env.BOOK_PAGE_BASE_REF || (main ? git('merge-base', 'HEAD', main) : '');
  test.skip(!base || base === git('rev-parse', 'HEAD'), 'no base to compare with (this is the base)');
  const dir = mkdtempSync(join(tmpdir(), 'dg-book-page-base-'));
  try {
    git('worktree', 'add', '--detach', dir, base);
    symlinkSync(join(process.cwd(), 'node_modules'), join(dir, 'node_modules'));
    execFileSync('npm', ['run', 'build'], { cwd: dir, stdio: 'ignore' });
    for (const path of PAGES) {
      const before = normalizeBookPage(readFileSync(join(dir, 'dist', path, 'index.html'), 'utf8'));
      const after = normalizeBookPage(readFileSync(join('dist', path, 'index.html'), 'utf8'));
      expect(after, `/${path}/ against ${base.slice(0, 7)}`).toBe(before);
    }
  } finally {
    try {
      git('worktree', 'remove', '--force', dir);
    } catch {
      rmSync(dir, { recursive: true, force: true });
    }
  }
});

test('the normalisation sets aside only per-build ids and the related-book cards', () => {
  const island = (uid: string, book: string) =>
    `<astro-island uid="${uid}" component-url="/_astro/BookCard.HMiJtmf-.js" props="{&quot;id&quot;:&quot;${book}&quot;}"></astro-island>`;
  const a = `<p>x</p>${island('Z1', 'a')}${island('Z2', 'b')}<astro-island uid="Q1" component-url="/_astro/Nav.js"></astro-island>`;
  const b = `<p>x</p>${island('Y1', 'c')}${island('Y2', 'd')}<astro-island uid="Q9" component-url="/_astro/Nav.js"></astro-island>`;
  expect(normalizeBookPage(a)).toBe(normalizeBookPage(b));
  expect(normalizeBookPage(`${island('Z1', 'a')}`)).not.toBe(normalizeBookPage(`${island('Z1', 'a')}${island('Z2', 'b')}`));
  expect(normalizeBookPage('<p>x</p>')).not.toBe(normalizeBookPage('<p>y</p>'));
  expect(normalizeBookPage('<link href="/_astro/_slug_.96-J9cV2.css">')).not.toBe(normalizeBookPage('<link href="/_astro/_slug_.D_Jf70c9.css">'));
});
