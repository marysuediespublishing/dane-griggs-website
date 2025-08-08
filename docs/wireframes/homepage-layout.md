# Homepage Layout Wireframe

## Design Principles
- **Mobile-First**: Design starts with mobile constraints, scales up
- **Cosmic Branding**: Subtle space elements without overwhelming content
- **Conversion Focus**: Clear paths to book purchases and newsletter signup
- **Performance**: Fast loading for Facebook ad traffic

## Layout Structure

### Header Navigation (Sticky)
```
┌─────────────────────────────────────────────────────────────────┐
│ [LOGO] Dane Griggs    [Home] [Books] [Series] [Blog] [Contact]  │
│                                                      [🔍Search]  │
└─────────────────────────────────────────────────────────────────┘
```

**Mobile Navigation:**
```
┌─────────────────────────────────────────┐
│ [☰] Dane Griggs            [🔍] [Newsletter] │
└─────────────────────────────────────────┘
```

**Navigation Specifications:**
- Height: 72px desktop, 64px mobile
- Background: Deep Space Navy (#1a1a2e) with subtle starfield pattern
- Logo: Dane Griggs in Playfair Display, Stellar Gold color
- Links: Solar White, hover to Cosmic Rose
- Mobile: Hamburger menu with smooth slide animation
- Search: Expandable search bar with cosmic glow effect

---

### Hero Section
```
┌─────────────────────────────────────────────────────────────────┐
│                    [Starfield Background]                       │
│  ┌─────────────┐                                               │
│  │   Author    │     "Sexy escapes with no Mary Sues"         │
│  │   Photo     │                                               │
│  │   (150px)   │     Dane Griggs                               │
│  └─────────────┘     Sci-Fi Romance Author                     │
│                                                                 │
│            [Free Alien Romance Pack] [Latest Book]              │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │              Featured Book Spotlight                        │ │
│  │  ┌────────┐   "The Bride Program"                          │ │
│  │  │ Book   │   44M+ pages read                             │ │
│  │  │ Cover  │   [Read Free on KU] [Buy on Amazon]           │ │
│  │  │        │                                                │ │
│  │  └────────┘   "Smart aliens, smarter heroines..."          │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Hero Specifications:**
- Height: 100vh (full viewport)
- Background: Animated starfield with CSS/GSAP particles
- Author photo: Circular crop, 150px diameter, subtle cosmic glow
- Tagline: Playfair Display, 48px desktop / 28px mobile
- CTAs: Cosmic Rose background, Solar White text, 16px height
- Book spotlight: Card with Nebula Purple border, animated hover

---

### Statistics Bar
```
┌─────────────────────────────────────────────────────────────────┐
│  [📚 12 Books]  [⭐ 44M+ Pages]  [📈 7,339+ Ratings]  [✅ Complete Series] │
└─────────────────────────────────────────────────────────────────┘
```

**Statistics Specifications:**
- Background: Gradient from Deep Space Navy to Nebula Purple
- Icons: Stellar Gold, custom cosmic iconography
- Numbers: CountUp.js animation on scroll
- Layout: Flexbox, wraps on mobile to 2x2 grid

---

### Book Carousel Section
```
┌─────────────────────────────────────────────────────────────────┐
│                    "Latest Alien Romance"                       │
│                                                                 │
│ [←] ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ [→] │
│     │ Book 1 │ │ Book 2 │ │ Book 3 │ │ Book 4 │ │ Book 5 │     │
│     │ Cover  │ │ Cover  │ │ Cover  │ │ Cover  │ │ Cover  │     │
│     │ 3D     │ │ 3D     │ │ 3D     │ │ 3D     │ │ 3D     │     │
│     └────────┘ └────────┘ └────────┘ └────────┘ └────────┘     │
│     "Title"    "Title"    "Title"    "Title"    "Title"        │
│     Species    Species    Species    Species    Species        │
└─────────────────────────────────────────────────────────────────┘
```

**Carousel Specifications:**
- Swiper.js with touch support
- 3D book covers using Three.js (optional fallback to CSS 3D)
- Auto-play: 4 second intervals
- Hover effects: Book lift + cosmic glow
- Mobile: Single book view with swipe
- Species tags: Small pills with alien icons

---

### Series Showcase
```
┌─────────────────────────────────────────────────────────────────┐
│                      "Series"                          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Saving Ceraste - 10 Book Series                            │ │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ [+6 more]               │ │
│  │  │ Book 1 │ │ Book 2 │ │ Book 3 │                         │ │
│  │  └────────┘ └────────┘ └────────┘                         │ │
│  │  "Medical exchange program on alien space station..."      │ │
│  │  [Start with Book 1] [View Series Page]                   │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Koko's Harbor - Ongoing Series                            │ │
│  │  ┌────────┐ ┌────────┐ [Coming Soon]                      │ │
│  │  │ Book 1 │ │ Book 2 │                                    │ │
│  │  └────────┘ └────────┘                                    │ │
│  │  "Kraken warriors in underwater alien city..."            │ │
│  │  [Read Book 1] [Get Updates]                              │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Series Specifications:**
- Card-based layout with Cosmic Rose borders
- Progressive disclosure: Show 3 covers + count
- World-building snippets: 2 lines max
- CTA differentiation: Complete vs. ongoing series
- Hover animations: Smooth scale and glow effects

---

### Testimonials Carousel
```
┌─────────────────────────────────────────────────────────────────┐
│                   "What Readers Are Saying"                     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ "The aliens are so sweet you can't help but love them.     │ │
│  │  No silly misunderstandings - just real chemistry!"        │ │
│  │                                          ⭐⭐⭐⭐⭐        │ │
│  │                              - Amazon Verified Purchase     │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                            [◦ ● ◦]                              │
└─────────────────────────────────────────────────────────────────┘
```

**Testimonials Specifications:**
- Auto-rotating cards: 6 second intervals
- Star ratings with Stellar Gold color
- Source attribution for credibility
- Pause on hover/focus for accessibility
- Mobile: Full-width cards, swipe navigation

---

### Newsletter Signup
```
┌─────────────────────────────────────────────────────────────────┐
│                [Cosmic Background Pattern]                      │
│                                                                 │
│         "Get Your Free Alien Romance Starter Pack"             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  📧 [Email Address]          [Get Free Books]              │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│              "No spam. Unsubscribe anytime."                   │
└─────────────────────────────────────────────────────────────────┘
```

**Newsletter Specifications:**
- Full-width section with cosmic gradient background
- Email validation with real-time feedback
- Success state with download instructions
- GDPR-compliant copy and consent
- Integration ready for ConvertKit/Mailchimp

---

### Footer
```
┌─────────────────────────────────────────────────────────────────┐
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Books     │  │   Connect   │  │   Legal     │             │
│  │ • Series    │  │ • Facebook  │  │ • Privacy   │             │
│  │ • Standalones│  │ • Goodreads │  │ • Terms     │             │
│  │ • Free Books│  │ • Newsletter│  │ • Copyright │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│              © 2024 Dane Griggs. All rights reserved.          │
│           "Sexy escapes with heart and humor" ✨               │
└─────────────────────────────────────────────────────────────────┘
```

**Footer Specifications:**
- Background: Deep Space Navy with subtle pattern
- Links: Solar White with Cosmic Rose hover
- Three-column layout, stacks on mobile
- Social icons with cosmic styling
- Copyright and tagline in footer bottom

---

## Mobile Responsive Breakpoints

### Mobile (320px - 768px)
- Single column layout
- Stacked navigation menu
- Hero content reordered: photo, title, tagline, CTAs
- Carousel shows 1.5 books for swipe indication
- Series cards stack vertically
- Newsletter input stacks vertically

### Tablet (768px - 1024px)
- Two-column layout for series cards
- Carousel shows 3 books
- Header maintains desktop layout
- Testimonials show full quotes

### Desktop (1024px+)
- Full multi-column layouts
- Carousel shows 5 books
- All hover effects active
- Optimal spacing and typography

---

## Performance Considerations

### Image Optimization
- Book covers: WebP/AVIF with fallbacks
- Hero background: Optimized for fast loading
- Lazy loading for below-the-fold content
- Responsive image srcsets

### Animation Optimization
- CSS transforms over position changes
- Will-change property for animated elements
- RequestAnimationFrame for smooth scrolling
- Reduce motion respect for accessibility

### Critical Path
- Inline critical CSS for above-the-fold content
- Defer non-essential JavaScript
- Preload key fonts and images
- Optimize for Core Web Vitals

---

## Accessibility Features

### Keyboard Navigation
- Tab order follows logical content flow
- Skip links for main content areas
- Focus indicators with cosmic styling
- Escape key closes modals/menus

### Screen Reader Support
- Semantic HTML structure
- Alt text for all decorative elements
- ARIA labels for interactive elements
- Live regions for dynamic content

### Color and Contrast
- Minimum 4.5:1 contrast ratios
- Color not sole indicator of information
- High contrast mode compatibility
- Reduced motion preferences honored

---

## Brand Integration

### Color Usage
- **Deep Space Navy**: Backgrounds, headers
- **Cosmic Rose**: CTAs, highlights, borders
- **Stellar Gold**: Accents, icons, ratings
- **Solar White**: Text, negative space

### Typography Hierarchy
- **Playfair Display**: Hero headline, section titles
- **Inter**: Body text, navigation, buttons
- **Orbitron**: Accent text, statistics (sparingly)

### Cosmic Elements
- Subtle starfield animations
- Gradient overlays with space colors
- Particle effects on hover/scroll
- Constellation patterns for dividers

This wireframe balances Dane's sophisticated brand with the sci-fi romance genre expectations while maintaining focus on conversion and user experience.