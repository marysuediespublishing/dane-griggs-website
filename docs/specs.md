# Author Dane Griggs Website - Development Specifications

## [ ] Spec 001: Astro Blog Platform Foundation

```json
{
  "id": 1,
  "title": "Astro Blog Platform Foundation",
  "why": "Author needs modern blog platform with CMS for content management",
  "system": {
    "complete": false,
    "commands": [
      "npm init -y",
      "npm create astro@latest -- --template blog --typescript --yes --skip-houston",
      "npm install @astrojs/tailwind decap-cms-app"
    ],
    "files": {
      ".gitignore": "# Dependencies\nnode_modules/\n\n# Build outputs\ndist/\n.astro/\n\n# Environment variables\n.env\n.env.local\n.env.production\n.env.staging\n\n# Logs\nlogs/\n*.log\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\n\n# Runtime data\npids\n*.pid\n*.seed\n*.pid.lock\n\n# Coverage directory used by tools like istanbul\ncoverage/\n\n# Editor directories and files\n.vscode/\n.idea/\n*.swp\n*.swo\n*~\n\n# OS generated files\n.DS_Store\n.DS_Store?\n._*\n.Spotlight-V100\n.Trashes\nehthumbs.db\nThumbs.db\n\n# CMS admin build\npublic/admin/dist/",
      "astro.config.mjs": "import { defineConfig } from 'astro/config';\nimport tailwind from '@astrojs/tailwind';\n\nexport default defineConfig({\n  integrations: [tailwind()],\n  site: 'https://danegriggs.com'\n});",
      "tailwind.config.mjs": "/** @type {import('tailwindcss').Config} */\nexport default {\n  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],\n  darkMode: 'class',\n  theme: {\n    extend: {\n      colors: {\n        'dark-bg': '#0f172a',\n        'dark-surface': '#1e293b',\n        'dark-border': '#334155',\n        'dark-text': '#f8fafc',\n        'dark-text-muted': '#cbd5e1'\n      }\n    }\n  },\n  plugins: []\n};",
      "public/admin/config.yml": "backend:\n  name: git-gateway\n  branch: main\n\nmedia_folder: public/images\npublic_folder: /images\n\ncollections:\n  - name: 'blog'\n    label: 'Blog Posts'\n    folder: 'src/content/blog'\n    create: true\n    slug: '{{year}}-{{month}}-{{day}}-{{slug}}'\n    fields:\n      - { label: 'Title', name: 'title', widget: 'string' }\n      - { label: 'Description', name: 'description', widget: 'string' }\n      - { label: 'Author', name: 'author', widget: 'string', default: 'Dane Griggs' }\n      - { label: 'Publish Date', name: 'pubDate', widget: 'datetime' }\n      - { label: 'Hero Image', name: 'heroImage', widget: 'image', required: false }\n      - { label: 'Body', name: 'body', widget: 'markdown' }",
      "public/admin/index.html": "<!DOCTYPE html>\n<html>\n<head>\n  <meta charset=\"utf-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>Content Manager</title>\n  <script src=\"https://identity.netlify.com/v1/netlify-identity-widget.js\"></script>\n</head>\n<body>\n  <script src=\"https://unpkg.com/decap-cms-app@^3.0.0/dist/decap-cms-app.js\"></script>\n</body>\n</html>",
      "src/layouts/Layout.astro": "---\nexport interface Props {\n  title: string;\n}\n\nconst { title } = Astro.props;\n---\n\n<!DOCTYPE html>\n<html lang=\"en\" class=\"dark\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"description\" content=\"Author Dane Griggs - Writing and Insights\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <link rel=\"icon\" type=\"image/svg+xml\" href=\"/favicon.svg\" />\n    <meta name=\"generator\" content={Astro.generator} />\n    <title>{title}</title>\n  </head>\n  <body class=\"bg-dark-bg text-dark-text min-h-screen\">\n    <slot />\n  </body>\n</html>"
    },
    "env_vars": {
      "PUBLIC_SITE_URL": "http://localhost:4321",
      "PUBLIC_SITE_TITLE": "Author Dane Griggs"
    }
  }
}
```

---

## [ ] Spec 002: Dark Theme Site Header

```json
{
  "id": 2,
  "title": "Dark Theme Site Header",
  "why": "Visitors need professional navigation and author branding with consistent dark theme",
  "depends": [1],
  "ui": {
    "complete": false,
    "url": "/",
    "scenarios": [
      {
        "name": "header-display",
        "expect": "see dark themed header with author name, navigation links (Blog, About, Contact), and professional styling"
      },
      {
        "name": "responsive-header",
        "action": "resize to mobile viewport",
        "expect": "header adapts to mobile with hamburger menu and proper spacing"
      }
    ],
    "components": ["Header", "Navigation", "MobileMenu"]
  }
}
```