# Author Dane Griggs Website

Professional author website with blog functionality, built with Astro and managed through a streamlined spec-driven development process.

## Quick Start

### Prerequisites
- Node.js 18+ 
- Claude Code CLI
- Git

### Setup New Project
1. **Create project directory**
   ```bash
   mkdir dane-griggs-website
   cd dane-griggs-website
   ```

2. **Add project files**
   - Copy `docs/specs.md` (the clean specs file)
   - Copy `.claude/` directory with schemas, agents, and commands
   - Initialize git: `git init`

3. **Run implementation**
   ```bash
   /implement-spec 001-002
   ```

This will automatically:
- Set up Astro blog platform with TypeScript
- Install and configure Tailwind CSS with dark theme
- Set up Decap CMS for content management
- Create professional dark-themed header
- Generate all configuration files

### Development Commands

```bash
# Implement features
/implement-spec 001        # Single spec
/implement-spec 001-005    # Range of specs
/implement-spec 001,003,005 # Specific specs

# Quality assurance
/run-all-checks          # Full verification
/auto-fix-issues         # Resolve common problems

# Standard development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
```

## Project Structure

```
├── docs/
│   ├── specs.md           # Implementation specifications
│   └── design-notes.md    # Design decisions and context
├── .claude/
│   ├── schemas/           # Zod validation schemas
│   ├── agents/            # Specialized AI agents
│   └── commands/          # Custom slash commands
├── src/
│   ├── layouts/           # Astro layouts
│   ├── pages/             # Site pages
│   ├── components/        # Reusable components
│   └── content/           # Blog posts and content
├── public/
│   └── admin/             # Decap CMS admin interface
└── tests/                 # Unit and E2E tests
```

## Technology Stack

- **Framework**: Astro (static site generation)
- **Styling**: Tailwind CSS with custom dark theme
- **Content Management**: Decap CMS (Git-based)
- **Language**: TypeScript
- **Testing**: Jest (unit) + Playwright (E2E)
- **Development**: Spec-driven with AI agents

## Features

### ✅ Completed (Specs 001-002)
- Astro blog platform foundation
- Dark theme styling system
- Decap CMS content management
- Professional site header
- Responsive mobile design

### 🔄 Planned (Future Specs)
- Blog post listing page
- Individual post layout
- Author about page
- Contact form
- Newsletter signup
- Search functionality
- SEO optimization

## Content Management

### Writing Blog Posts
1. Visit `/admin` (after setup)
2. Log in with Netlify Identity
3. Create new blog post
4. Write content in markdown editor
5. Publish when ready

### Content Structure
- **Title**: SEO-optimized post title
- **Description**: Meta description for social sharing
- **Author**: Defaults to "Dane Griggs"
- **Publish Date**: Publication timestamp
- **Hero Image**: Optional featured image
- **Body**: Markdown content with full formatting

## Deployment

### Netlify (Recommended)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Enable Netlify Identity for CMS
5. Configure Git Gateway

### Vercel Alternative
1. Connect GitHub repository
2. Framework preset: Astro
3. Build command: `npm run build`
4. Output directory: `dist`

## Development Workflow

### Adding New Features
1. **Plan feature** - Define user value and requirements
2. **Write spec** - Add JSON specification to `docs/specs.md`
3. **Implement** - Run `/implement-spec [id]` with Claude Code
4. **Quality check** - Run `/run-all-checks`
5. **Test manually** - Verify in browser
6. **Deploy** - Push to production

### Spec-Driven Development Benefits
- **Fast implementation**: Minutes instead of hours
- **Consistent quality**: Comprehensive testing built-in
- **Clear progress**: Visual completion tracking
- **Team collaboration**: Structured handoffs

## Customization

### Brand Colors
Edit `tailwind.config.mjs` to customize the dark theme palette:
```javascript
colors: {
  'dark-bg': '#0f172a',      // Main background
  'dark-surface': '#1e293b',  // Card/section backgrounds
  'dark-border': '#334155',   // Borders and dividers
  'dark-text': '#f8fafc',     // Primary text
  'dark-text-muted': '#cbd5e1' // Secondary text
}
```

### Content Configuration
Edit `public/admin/config.yml` to customize:
- Collection fields
- Folder structure
- Publication workflow
- Media handling

### Site Metadata
Edit `astro.config.mjs` for:
- Site URL
- Meta information
- Build settings

## Support

### Documentation
- `docs/design-notes.md` - Architecture and design decisions
- `docs/specs.md` - Implementation specifications
- `.claude/schemas/` - Data validation schemas

### Troubleshooting
- Run `/run-all-checks` for comprehensive diagnostics
- Use `/auto-fix-issues` for automatic problem resolution
- Check development server logs for build issues
- Verify Node.js version compatibility (18+)

### Contributing
1. Follow spec-driven development process
2. Add specs before implementing features
3. Ensure all quality checks pass
4. Update documentation as needed

---

**Built with the streamlined JSON spec system for rapid, reliable development.**