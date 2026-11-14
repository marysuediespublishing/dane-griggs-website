# Dane Griggs Website

Built on Astro

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- npm (comes with Node.js)

## Getting Started

### Install dependencies

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

This starts the Astro development server at `http://localhost:4321` with hot module reloading.

### Edit content (CMS)

The admin is [Sveltia CMS](https://github.com/sveltia/sveltia-cms), which uses Decap-compatible config in `public/admin/config.yml`.

- **Online (normal way):** go to `https://danegriggs.com/admin`, click **Sign In Using Access Token**, and paste a GitHub fine-grained token. Each save commits to `main`, and GitHub Actions redeploys in about 1–2 minutes. If a save doesn't show up, check the repo's Actions tab.
- **Locally:** run `npm run dev`, open `http://localhost:4321/admin`, click **Work with Local Repository** (Chrome or Edge) and pick this folder. Changes are written to disk, so commit and push them yourself. Pull first if anything was edited online.

**Token:** create it at https://github.com/settings/personal-access-tokens/new:
- **Resource owner:** `marysuediespublishing`
- **Repository access:** this repo only. One token can also cover several of the org's sites.
- **Permissions:** Contents → **Read and write**
- **Expiration:** set one, then regenerate the token when it expires.

If the org requires approval, approve the token under org Settings → Personal access tokens. "Sign in with GitHub" isn't configured; it would need an OAuth server.

**Notes:**
- The CMS version is pinned in `public/admin/index.html`. Bump it deliberately.
- Don't add a `src/pages/admin` route: its build output overwrites the CMS page. In dev, `/admin/` is served by a small rewrite in `astro.config.mjs`.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Astro dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run lint` | Lint source files with ESLint |
| `npm run format` | Format source files with Prettier |
| `npm run test` | The landing unit test (`tests/landing/landing.unit.spec.ts`) under Playwright. Fast, no build |
| `npm run test:e2e` | Run the Playwright tests in `tests/e2e/` |
| `npm run test:e2e:ui` | Run Playwright tests with interactive UI |
| `npm run test:landing` | Landing-page tests: unit tests (`book-page-unchanged.unit.spec.ts` included), then the built pages in a browser, English, German and French. Run `npm run build:landing-test` first (the build with the test editions); no server needed |
| `npm run build:landing-test` | The build the landing tests run on: `npm run build` plus made-up DE/FR editions and tags (`tests/fixtures/landing-editions.json`). Never deploy it |

## Testing

There are no Jest tests. Every test runs under Playwright (`@playwright/test`).

- `npm run test` runs the landing unit test, `tests/landing/landing.unit.spec.ts`, under Playwright. It is fast and needs no build.
- `npm run test:landing` (after `npm run build:landing-test`) runs all of `tests/landing/`, the unit tests (`book-page-unchanged.unit.spec.ts` included) and then the built pages in a browser. `book-page-unchanged` reads the built `dist/` and builds the merge-base with main, so it is slow.
- `npm run test:e2e` runs `tests/e2e/`.

New unit tests go in `tests/landing/` as `*.unit.spec.ts` with `@playwright/test`, not in `tests/unit/` with Jest.

No CI or lander runs `npm run test`: the Pages deploy runs `npm ci` and `npm run build` only, and the repo has no `verify` script.

## Project Structure

```
src/              # Astro source files (pages, components, layouts)
public/           # Static assets served as-is
public/admin/     # Sveltia CMS admin (online at /admin)
docs/             # Project documentation and specs
tests/e2e/        # Playwright E2E tests
tests/landing/    # Landing-page tests (playwright.landing.config.ts); unit tests are *.unit.spec.ts
lib/              # Shared utilities and test mocks
```

## Box-set landing pages

`/series/saving-ceraste/box-set` is the Meta-ad landing page for *The Bride Program Box Set: Books 1–9*. It is not linked from the site, and it is kept out of search (noindex) and the sitemap. Its design (lo-fi, hi-fi, the walk, a flip-through video) is in `docs/mocks/bride-program-landing/`.

`/de/series/saving-ceraste/box-set` and `/fr/series/saving-ceraste/box-set` are the same page in German and French (Press suite_006 §2), for the DE and FR ads. Each is built only when the series has that edition (`editions.de` / `editions.fr`); otherwise the build prints `[landing] not built: /de/… (… has no de edition)` and there is no page. A language page:

- links to that market's storefront (`amazon.de`, `amazon.fr`) with that market's Attribution tags (`attributionTags.DE` / `.FR`, same products and doors as the English page);
- takes the box set's words from the edition (title, hook, tagline, blurb, price, rating, reviews: the edition's own only — a translated English review is not one) and each book's title in the list from the book's `editions.<lang>.title` (its English title when Books has none);
- shows the KU button only when the edition's `kuEnrolled` is true, and the print link only when it has a `paperbackAsin` (Book 1 in paperback in that storefront);
- takes its fixed copy from `src/i18n/landing.<lang>.ts`. **The German and French tables are machine-drafted**: a native reader checks them before the first ad in that market (a step of the first run's approve card);
- sends `market` (`US`, `DE`, `FR`) with every click event and the Press beacon; the English page sends `US`.

The English page and the language pages link each other with `<link rel="alternate" hreflang>` (only when there is more than one). The template is `src/components/landing/BrideProgramBoxSet.astro`; `src/pages/series/saving-ceraste/box-set.astro` renders it in English and `src/pages/[lang]/series/saving-ceraste/box-set.astro` in German and French. The walk in a language: `npm run build:landing-test && node docs/mocks/bride-program-landing/src/walk.mjs de` (screenshots in `build-de/`). To check a change leaves the English pages as they were, build before and after and run `node scripts/compare-dist.mjs <before-dist> <after-dist> --skip de/ --skip fr/`.

It is built from shared pieces, so the next landing page is a single page file:

- `src/lib/landing.ts`: the Attribution tags on the links, per product and door, and the click-event names.
- `src/lib/landing-client.ts`: the browser side. It handles consent, Dane’s pixel, and the click events (carrying the page’s `utm_*` unchanged) and the Press beacon.
- `src/layouts/LandingLayout.astro`: the slim chrome, with no site pixel, cookie banner or popup.
- `src/components/landing/`: `LandingCtas`, `LandingConsentBar` and `LandingTracking`.

The page's inputs are CMS fields, all optional:

| Field | Where | Effect when empty |
| --- | --- | --- |
| `boxSetAsin` | `src/content/series/saving-ceraste.md` | The buttons go to an Amazon Kindle search for the box set |
| `boxSetBlurb` | `src/content/series/saving-ceraste.md` | The pitch uses the series `description`. Either way only the first three paragraphs show |
| `boxSetPrice` | `src/content/series/saving-ceraste.md` | The Buy button reads "Buy the Kindle box set" with no price. When set (e.g. `9.99`), it reads "Buy the Kindle box set — $9.99" |
| `boxSetSeparatePrice` | `src/content/series/saving-ceraste.md` | No value line. When `boxSetPrice` is also set, "9 books for $X — $Y bought separately" shows under the Buy button |
| `metaPixelId` | `src/content/settings/site-config.md` | No pixel loads. When set (Dane's dataset `2527209327539510`), it is the pixel for the whole site too (`src/components/MetaPixel.astro`). On a landing page it loads without a click if the browser's time zone is a US zone. Anyone else sees an in-page Allow / No thanks bar first. A visitor who declined marketing cookies in the site's own banner gets no pixel |
| `pixelHosts` | `src/content/settings/site-config.md` | `danegriggs.com` and `www.danegriggs.com`. The pixel (sitewide and on the landing pages) and the Press beacon send only from these hostnames. On any other host (localhost, 127.0.0.1, a preview, the GitHub Pages default domain) the same calls are logged to the console as `[pixel] PageView {…}`, `[pixel] LandingClickKU {…}`, `[pixel] beacon {…}`, and nothing is sent. `npx astro preview` serves whatever is in `dist/`, so rebuild before a local walk |
| `boxSetCover` | `src/content/series/saving-ceraste.md` | The page fails to build: it is the box-set image (`/images/bride-program-box-set.jpg`). Every `astro dev` / `astro build` makes the page's 640-wide hero and the 1200x630 share image from it into `public/images/landing/` (not in git; `src/integrations/landing-covers.mjs`). A bigger image dropped in its place reaches both with nothing else to do |
| `editions` | `src/content/series/saving-ceraste.md` (and each book's) | No German or French page. Per language (`de`, `fr`): `asin`, `title`, `blurb`, `kuEnrolled` required; `paperbackAsin`, `cover` (the edition's own box-set image; the build makes its copies too), `seriesName`, `hook`, `tagline`, `price` / `separatePrice` (as the storefront shows them, e.g. `9,99 €`), `rating` / `ratingCount`, `reviews`. Written from Press's Books |
| `paperbackAsin` | `src/content/books/the-bride-program-book.md` (Book 1) | No print link on the English page. Book 1's paperback on amazon.com as ISBN-10 or ASIN (`1090344376`, ISBN 9781090344373); the "Prefer paper?" link goes to its `/dp/` page |
| `boxSetSlug` | `src/content/series/saving-ceraste.md` | The box set's product key is `<series>-box-set`. Set to its slug in Press's Books (`the-bride-program-box-set`), the key its Attribution tags are kept under |
| `attributionTags` | `src/content/settings/site-config.md` | No Amazon Attribution tag: each button is the bare `/dp/<ASIN>` link and the build prints `[attribution] missing on <page>: …`. Written by Press's Ad Desk (Attribution → Import tags, ad_desk_007): `<market>` → `<product slug>` → `ku` / `kindle` / `print`, each the Attribution URL. KU and Buy take the box set's `ku` and `kindle` tags, the paperback link book 1's `print` tag (`PRINT_PRODUCT`, `the-bride-program`) — for every visitor, whatever ad sent them. A tag whose `/dp/<ASIN>` is not the button's own is not used |
| `pressCtrEndpoint` | `src/content/settings/site-config.md` | Clicks are counted only as the custom pixel events `LandingClickKU` / `LandingClickBuy` / `LandingClickPaperback`. When set, each click also POSTs a keepalive `press.landing.ctr` beacon. `PageView` and the click events carry the visitor's `utm_campaign` as `campaign` |
| `amazonBadge` | `src/content/settings/site-config.md` | No badge. When set, it must be Amazon's official "Available at Amazon" badge, unaltered (Amazon's brand-usage terms) |

These are constants at the top of the page file: the hook, the one-line book hooks (`BOOK_HOOKS`) and the review picks (testimonial ids). The reviews are Goodreads reviews of the box set, kept in `src/content/testimonials/`. The box-set image is `public/images/bride-program-box-set.jpg` (`boxSetCover`); the build makes the page's copies of it.

## Book landing pages

`/books/<slug>/landing/` is built for every book whose frontmatter has a `landing:` block (Books → Landing Page in the CMS), as on gwen-demarco-website; the first is `/books/rosie-christmas-book/landing/`. The template is `src/components/landing/BookLandingPage.astro`, built from the box-set page's pieces and in its look: the slim landing chrome (no site menu), the consent bar, noindex, kept out of the sitemap and linked from nowhere. Up to three doors, in this order, each with a Kindle+ / Kindle / Print button:

| Door | `target` | Goes to |
| --- | --- | --- |
| 1. This book | the book's slug (`rosie-christmas-book`) | the book's `asin` (else its `amazonUrl`) and `paperbackAsin` |
| 2. Start the series | `series-start` | the box set of the series whose `readingOrder` holds the book, if it has a `boxSetAsin` (print: book 1's paperback); else book 1. Left out when the book is book 1 |
| 3. Same world | `landing.sameWorld.target` | `landing.sameWorld.series`: its box set, or its book 1. Only when the block names one |

Attribution is per product and door: each button takes `attributionTags.US.<product>.<ku|kindle|print>` from site config, the product being the book's `productSlug` (its slug in Press's Books; default the file name without `-book`, so `the-bride-program-book` → `the-bride-program`; A Rosie Christmas's is `a-rosie-christmas`) or the series' `boxSetSlug`. A button with no tag is the bare `/dp` link, and the build lists it (`[attribution] missing on <slug>-landing: …`, and `missingTags` in the page's landing config). Every button fires `LandingClickKU` / `LandingClickBuy` / `LandingClickPaperback` with `page: <slug>-landing`, `target`, `market`, `cta`, `source`, `campaign` and the page's `utm_*` unchanged.

The block (src/content.config.ts) is Gwen's: `hook` (the approved ad's own words), `pullQuote` and `reviews` (testimonial ids, with an optional `excerpt`), and each door's `title`, `line` and `review`. The pitch is the body's `## Synopsis` (else the description), first three paragraphs. English only for now.

Tests: `npm run build:landing-test`, then `npm run test:landing` (`tests/landing/book-landing.page.spec.ts`; `book-page-unchanged.unit.spec.ts` builds the merge-base with main and checks the book's own page is unchanged).

## Tech Stack

- [Astro](https://astro.build/) - Static site framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [React](https://react.dev/) - Interactive components
- [Sveltia CMS](https://github.com/sveltia/sveltia-cms) - Content management (Decap-compatible)
- [Three.js](https://threejs.org/) - 3D graphics
- [Framer Motion](https://www.framer.com/motion/) - Animations
