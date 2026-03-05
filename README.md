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

### Run the CMS locally

In a separate terminal, start the Decap CMS proxy server:

```bash
npm run admin
```

Then visit `http://localhost:4321/admin/` to access the CMS.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Astro dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run admin` | Start the Decap CMS local proxy server |
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
public/admin/     # Decap CMS admin interface
docs/             # Project documentation and specs
tests/unit/       # Jest unit tests
tests/e2e/        # Playwright E2E tests
lib/              # Shared utilities and test mocks
```

## Tech Stack

- [Astro](https://astro.build/) - Static site framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [React](https://react.dev/) - Interactive components
- [Decap CMS](https://decapcms.org/) - Content management
- [Three.js](https://threejs.org/) - 3D graphics
- [Framer Motion](https://www.framer.com/motion/) - Animations
