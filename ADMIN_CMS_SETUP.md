# Admin CMS Setup - Local Development Only

This project uses Decap CMS (formerly Netlify CMS) for content management, configured for **local editing only**.

## Setup Instructions

1. **Start the Decap server** (required for CMS to work):
   ```bash
   npx decap-server
   ```
   This starts a local proxy server on port 8081

2. **Start the development server** in another terminal:
   ```bash
   npm run dev
   ```
   This starts the Astro site on port 4321

3. **Access the CMS**:
   - Navigate to http://localhost:4321/admin
   - No login required (local access only)
   - Edit content through the user-friendly interface

## How It Works

- **Local Only**: The CMS only works on your local machine
- **Direct File Editing**: Changes are saved directly to markdown files in your repository
- **Git Workflow**: After editing, commit and push changes normally:
  ```bash
  git add .
  git commit -m "Updated content via CMS"
  git push
  ```

## Important Notes

- **Production Admin**: The `/admin` route will NOT work in production (this is intentional)
- **No Authentication**: Since it's local-only, no login is needed
- **Multiple Editors**: Each person needs their own local setup to edit content

## Content Locations

- **Books**: `src/content/books/`
- **Blog Posts**: `src/content/blog/`
- **Series**: `src/content/series/`
- **Characters**: `src/content/characters/`
- **Species**: `src/content/species/`
- **Locations**: `src/content/locations/`
- **Images**: `public/images/`

## Troubleshooting

If the CMS doesn't load:
1. Ensure `npx decap-server` is running (port 8081)
2. Check that `local_backend: true` is enabled in `public/admin/config.yml`
3. Clear browser cache and reload

## Why Local-Only?

This approach:
- Avoids complex OAuth setup
- Requires no external services
- Keeps content editing simple
- Maintains full version control through Git