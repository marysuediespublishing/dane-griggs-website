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

## Project Structure

```
src/              # Astro source files (pages, components, layouts)
public/           # Static assets served as-is
public/admin/     # Sveltia CMS admin (online at /admin)
docs/             # Project documentation and specs
tests/unit/       # Jest unit tests
tests/e2e/        # Playwright E2E tests
lib/              # Shared utilities and test mocks
```

## Tech Stack

- [Astro](https://astro.build/) - Static site framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [React](https://react.dev/) - Interactive components
- [Sveltia CMS](https://github.com/sveltia/sveltia-cms) - Content management (Decap-compatible)
- [Three.js](https://threejs.org/) - 3D graphics
- [Framer Motion](https://www.framer.com/motion/) - Animations
