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
| `npm run test` | Run Jest unit tests |
| `npm run test:e2e` | Run Playwright end-to-end tests |
| `npm run test:e2e:ui` | Run Playwright tests with interactive UI |
| `npm run test:landing` | Landing-page tests: unit tests, then the built pages in a browser. Run `npm run build` first; no server needed |

## Project Structure

```
src/              # Astro source files (pages, components, layouts)
public/           # Static assets served as-is
public/admin/     # Sveltia CMS admin (online at /admin)
docs/             # Project documentation and specs
tests/unit/       # Jest unit tests
tests/e2e/        # Playwright E2E tests
tests/landing/    # Landing-page tests (playwright.landing.config.ts)
lib/              # Shared utilities and test mocks
```

## Box-set landing pages

`/series/saving-ceraste/box-set` is the Meta-ad landing page for *The Bride Program Box Set: Books 1–9*. It is not linked from the site, and it is kept out of search (noindex) and the sitemap. Its design (lo-fi, hi-fi, the walk, a flip-through video) is in `docs/mocks/bride-program-landing/`.

It is built from shared pieces, so the next landing page is a single page file:

- `src/lib/landing.ts`: the Attribution tags on the links, per-campaign links, and the click-event names.
- `src/lib/landing-client.ts`: the browser side. It handles the `utm_campaign` swap, consent, Dane's pixel, the click events and the Press beacon.
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
| `landingAttributionTag` | `src/content/settings/site-config.md` | No Amazon Attribution tag on the KU and Buy buttons. When set (the whole Attribution URL, or just its query `maas=...&ref_=aa_maas&tag=maas`), its query is added for every visitor |
| `paperbackAttributionTag` | `src/content/settings/site-config.md` | No tag on the "Book 1 in paperback" link. When set, it is added the same way |
| `landingAttributionTags` | `src/content/settings/site-config.md` | Every visitor gets the two tags above. Each row has a `campaign` (a `utm_campaign` value) with its own `tag` and `paperbackTag`. A visitor whose `utm_campaign` matches a row gets that row's tags instead. An unknown campaign, or an empty tag in a row, gets the default |
| `pressCtrEndpoint` | `src/content/settings/site-config.md` | Clicks are counted only as the custom pixel events `LandingClickKU` / `LandingClickBuy` / `LandingClickPaperback`. When set, each click also POSTs a keepalive `press.landing.ctr` beacon. `PageView` and the click events carry the visitor's `utm_campaign` as `campaign` |
| `amazonBadge` | `src/content/settings/site-config.md` | No badge. When set, it must be Amazon's official "Available at Amazon" badge, unaltered (Amazon's brand-usage terms) |

These are constants at the top of the page file: the paperback link (`PAPERBACK_URL`, book 1, ISBN 9781090344373), the hook, the one-line book hooks (`BOOK_HOOKS`) and the review picks (testimonial ids). The reviews are Goodreads reviews of the box set, kept in `src/content/testimonials/`. The box-set image and the 1200x630 `og:image` are in `public/images/landing/`.

## Tech Stack

- [Astro](https://astro.build/) - Static site framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [React](https://react.dev/) - Interactive components
- [Sveltia CMS](https://github.com/sveltia/sveltia-cms) - Content management (Decap-compatible)
- [Three.js](https://threejs.org/) - 3D graphics
- [Framer Motion](https://www.framer.com/motion/) - Animations
