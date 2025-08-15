# Author Dane Griggs Website - Design Notes

## Project Overview

Building a professional author website with blog functionality for Dane Griggs. Focus on clean, dark-themed design that showcases writing and provides excellent reading experience.

## Architecture Decisions

### Technology Stack
- **Astro**: Static site generation with blog template for performance and SEO
- **Tailwind CSS**: Utility-first styling with custom dark theme palette
- **Decap CMS**: Git-based content management for blog posts
- **TypeScript**: Enhanced development experience and type safety
- **Dark Theme Only**: No toggle needed, consistent branded experience

### Design Philosophy
- **Mobile-first responsive design**
- **Professional author branding**
- **Optimized reading experience**
- **Fast loading and SEO-friendly**
- **Easy content management workflow**

## Spec Implementation Details

### Spec 001: Astro Blog Platform Foundation

**What this creates:**
- Complete Astro blog platform with TypeScript support
- Custom dark theme color system
- Decap CMS configuration for blog management
- All necessary configuration files
- Professional layout foundation

**Technical highlights:**
- **Custom color palette**: Dark blue/slate theme with proper contrast
- **CMS integration**: Git-based workflow with Netlify Identity
- **Blog template**: Optimized for author content with proper metadata
- **Development setup**: Local development with hot reloading

**File structure created:**
```
├── astro.config.mjs          # Astro configuration with Tailwind
├── tailwind.config.mjs       # Custom dark theme colors
├── public/admin/             # Decap CMS admin interface
├── src/layouts/Layout.astro  # Base layout with dark theme
└── .env.example              # Environment configuration
```

### Spec 002: Dark Theme Site Header

**What this creates:**
- Professional site navigation
- Author branding prominence
- Responsive mobile design
- Consistent dark theme styling

**Component breakdown:**
- **Header**: Main container with author name and navigation
- **Navigation**: Desktop navigation links (Blog, About, Contact)
- **MobileMenu**: Hamburger menu for mobile devices

**Design specifications:**
- Dark background (#0f172a) with light text (#f8fafc)
- Author name prominently displayed
- Clean typography and spacing
- Touch-friendly mobile interactions

## Future Roadmap

### Immediate Next Steps (Specs 003-005)
- **Blog Post Listing**: Homepage with recent posts and pagination
- **Individual Post Layout**: Optimized reading experience with typography
- **About Page**: Author bio and credentials

### Phase 2 Features (Specs 006-010)
- **Contact Form**: Professional inquiry handling
- **Newsletter Signup**: Reader engagement
- **Search Functionality**: Content discovery
- **Social Media Integration**: Content sharing
- **SEO Optimization**: Meta tags and structured data

### Advanced Features (Specs 011+)
- **Comment System**: Reader engagement
- **Related Posts**: Content discovery
- **Reading Time Estimates**: User experience enhancement
- **Analytics Integration**: Performance tracking

## Content Strategy

### Blog Categories
- Writing craft and techniques
- Publishing industry insights
- Author journey and experiences
- Book reviews and recommendations

### SEO Considerations
- Author-focused keywords
- Writing and publishing topics
- Local author presence (if applicable)
- Book and writing-related long-tail keywords

## Performance Targets

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Green for all measurements
- **Page Load Time**: <2 seconds on mobile
- **Image Optimization**: WebP format with proper sizing

## Accessibility Standards

- **WCAG 2.1 AA compliance**
- **Keyboard navigation support**
- **Screen reader compatibility**
- **Color contrast ratios**: 4.5:1 minimum
- **Semantic HTML structure**

## Development Workflow

### Content Creation
1. Author writes in Decap CMS admin interface
2. Content saved to Git repository
3. Automatic deployment triggers
4. Live site updates with new content

### Feature Development
1. Add spec to docs/specs.md
2. Run `/implement-spec [id]` with Claude Code
3. Quality checks with `/run-all-checks`
4. Manual testing and review
5. Deploy to production

## Brand Guidelines

### Color Palette
- **Primary Background**: #0f172a (dark-bg)
- **Surface Elements**: #1e293b (dark-surface)
- **Borders**: #334155 (dark-border)
- **Primary Text**: #f8fafc (dark-text)
- **Muted Text**: #cbd5e1 (dark-text-muted)

### Typography
- Clean, readable fonts optimized for long-form content
- Proper line height and spacing for reading comfort
- Hierarchy with consistent heading sizes

### Voice and Tone
- Professional but approachable
- Expert authority on writing topics
- Encouraging for aspiring writers
- Clear and direct communication