# Dane Griggs Author Website Specs - Astro + Decap CMS

## ☐ Spec 001: Astro Project Foundation Setup

- User runs setup command, sees Astro project created with TypeScript and all integrations installed
- User runs dev server, sees "Welcome to Astro" page loading at localhost:4321 in under 2 seconds
- User checks project structure, sees organized folders for components, layouts, content, and styles
- User runs build command, sees static site generated successfully with optimized assets

WHY: Foundation for high-performance sci-fi romance website that loads fast for Facebook ad traffic
NOTE: Install Astro, React, Tailwind, MDX, Image optimization, and Sitemap integrations

## ☐ Spec 002: Advanced UI Library Integration

- User imports ShadCN component, sees styled button rendering correctly with sci-fi hover effects
- User tests GSAP animation, sees smooth starfield animation on scroll with 60fps performance
- User views Three.js 3D book cover, sees rotating book with cosmic particle effects responding to mouse
- User checks bundle size, sees library imports are tree-shaken and optimized for space theme

WHY: Professional UI components and space animations will make Dane's sci-fi site stand out
NOTE: Setup ShadCN/UI with React integration, GSAP for space animations, Three.js for 3D effects

## ☐ Spec 003: Sci-Fi Romance Content Schema

- User examines books collection schema, sees TypeScript definitions for alien romance metadata
- User checks series collection schema, sees relationships for Saving Ceraste (9 books) and Koko's Harbor (2+ books)
- User views testimonials schema, sees validation for sci-fi romance ratings and platforms
- User tests alien species field, sees dropdown with "Cerastean", "Kraken", "Dulci" species options

WHY: Type-safe content management prevents errors and ensures consistent sci-fi romance data structure
NOTE: Include fields for alien species, space settings, heat levels, sci-fi subgenres, world-building

## ☐ Spec 004: Decap CMS Local Development

- User runs cms development command, sees Decap CMS loading at localhost:4321/admin
- User logs into CMS interface, sees organized collections for Books, Series, Blog, Testimonials
- User creates new book entry for "The Bride Program", sees form with all sci-fi romance fields working
- User previews book content, sees formatted preview matching cosmic site design

WHY: Local CMS development enables Dane to manage sci-fi romance content without requiring deployment
DEPENDS: 003
NOTE: Use decap-server for local development, configure for alien romance book management

## ☐ Spec 005: Cosmic Sci-Fi Brand Design System

- User views homepage, sees space-black background with cosmic red and stellar blue accents
- User examines typography, sees Orbitron headings and Inter body text for futuristic readability
- User checks color palette, sees cosmic-red (#DC2626), stellar-blue (#1E40AF), nebula-purple highlights
- User tests component theming, sees consistent sci-fi romance branding with space gradients

WHY: Strong cosmic branding reflects Dane's sci-fi romance genre and creates futuristic impression
DEPENDS: 002
NOTE: Use space gradients, starfield backgrounds, cosmic color palette, futuristic typography

## ☐ Spec 006: Sci-Fi Romance Homepage Hero

- User loads homepage, sees Dane's author photo with starfield background and "Sexy escapes with no Mary Sues" tagline
- User views featured book section, sees "The Bride Program" cover with "44M+ pages read" and clear CTA buttons
- User scrolls down, sees statistics bar showing "12 books", "7,339+ ratings", "2 series available"
- User clicks newsletter signup, sees modal with "Free alien romance starter pack" and email capture

WHY: Homepage hero is critical for converting Facebook ad traffic showcasing Dane's sci-fi credentials
DEPENDS: 005
NOTE: Use real statistics from Goodreads research, emphasize "no Mary Sue" positioning

## ☐ Spec 007: Sci-Fi Romance Book Display

- User views books page, sees grid of book covers with cosmic hover effects revealing alien species info
- User clicks "The Bride Program", sees detailed page with Cerastean alien details and purchase links
- User examines series organization, sees Saving Ceraste (9 books complete), Koko's Harbor (2 books ongoing)
- User tests purchase buttons, sees Amazon and KU links with proper sci-fi romance tracking

WHY: Clear sci-fi romance book presentation directly impacts conversion rates from alien romance ad traffic
DEPENDS: 003, 005
NOTE: Highlight alien species, space settings, "no Mary Sue" promise, heat levels

## ☐ Spec 008: Advanced Cosmic Book Carousel

- User views homepage book carousel, sees 3D book covers rotating with starfield particle effects
- User hovers over "Bedside Manners for Aliens", sees cover lift with cosmic glow and alien species info
- User drags carousel on mobile, sees smooth touch scrolling with nebula transitions
- User lets carousel auto-play, sees books cycling every 4 seconds with space-themed transitions

WHY: Interactive cosmic book display creates engagement and showcases Dane's alien romance catalog
DEPENDS: 002, 007
NOTE: Use Swiper.js with space themes, Three.js for cosmic effects, alien species highlighting

## ☐ Spec 009: Alien Romance Search and Filtering

- User types "Cerastean" in search box, sees instant results filtering by alien species and settings
- User selects "Alien Romance" filter, sees Saving Ceraste series prominently displayed
- User combines search and filters, sees "space station" + "fated mates" returning relevant matches
- User filters by heat level, sees books organized by romance intensity with cosmic star ratings

WHY: Sci-fi romance readers need to find books by specific alien species and space settings
DEPENDS: 007
NOTE: Use Fuse.js for fuzzy search, include alien species types, space vs planet settings

## ☐ Spec 010: Author Statistics Dashboard

- User views stats section, sees animated counters for "44M+ pages read", "12 published books"
- User examines series breakdown chart, sees Saving Ceraste dominating with complete 9-book series
- User hovers over chart segments, sees tooltips with specific alien romance statistics
- User views reader demographics, sees sci-fi romance audience data with space-themed visualization

WHY: Impressive statistics build Dane's credibility as established sci-fi romance author
DEPENDS: 003
NOTE: Use real data from Goodreads research, emphasize complete Saving Ceraste series success

## ☐ Spec 011: Reader Testimonials with Sci-Fi Focus

- User scrolls to testimonials, sees rotating carousel of reader reviews praising alien characters
- User views testimonial, sees "The aliens are so sweet you can't help but love them"
- User clicks Amazon source link, sees original review verification on sci-fi romance product page
- User sees testimonial highlighting "no Mary Sue" and realistic character development themes

WHY: Social proof from sci-fi romance readers is crucial for converting potential alien romance fans
DEPENDS: 003, 005
NOTE: Use real testimonials from Amazon research, emphasize character development and alien appeal

## ☐ Spec 012: Series Landing Pages with World-Building

- User visits Saving Ceraste series page, sees Cerastean alien bride program premise with medical exchange
- User views reading order guide, sees 9 books with covers and "Start with The Bride Program" prominent CTA
- User examines world-building section, sees details about Cerastean culture, space stations, alien biology
- User clicks character guide, sees Maya, D'Avii, and alien cast with species relationships

WHY: Sci-fi romance series readers need clear world-building context and alien culture understanding
DEPENDS: 007, 003
NOTE: Emphasize alien bride program concept, space settings, medical sci-fi elements

## ☐ Spec 013: Newsletter Integration with Sci-Fi Lead Magnet

- User clicks newsletter signup, sees modal offering "Free alien romance starter pack"
- User enters email, sees confirmation with immediate download link for bonus sci-fi content
- User receives welcome email, sees branded message with cosmic design and social media links
- User manages preferences, sees options for new releases, alien species guides, space romance updates

WHY: Email list building is essential for sci-fi romance author marketing and series completion
DEPENDS: 006
NOTE: Offer alien romance guide or prequel, integrate with ConvertKit, cosmic email design

## ☐ Spec 014: Sci-Fi Romance Blog System

- User visits blog, sees posts categorized by "Alien Cultures", "World Building", "Writing Process"
- User reads alien species post, sees formatted content with cosmic styling and social sharing
- User filters by "Alien Cultures", sees posts about Cerastean biology with smooth space transitions
- User sees related posts about space station design and alien romance research with cosmic theme

WHY: Blog content improves SEO and provides deeper engagement for sci-fi romance fans
DEPENDS: 003, 005
NOTE: Support MDX for rich content, emphasize alien culture research and space world-building

## ☐ Spec 015: Performance Optimization for Ad Traffic

- User runs Lighthouse audit, sees scores of 95+ for Performance, Accessibility, and SEO
- User tests page load speed, sees homepage loading in under 1.5 seconds on 3G connection
- User checks image optimization, sees book covers in WebP/AVIF with proper lazy loading
- User examines bundle size, sees JavaScript under 100KB with cosmic animations optimized

WHY: Fast loading is critical for Facebook ad conversion and sci-fi romance reader retention
DEPENDS: ALL previous specs
NOTE: Optimize space animations, minimize JavaScript, use Astro's static generation for speed

## ☐ Spec 016: Mobile-First Sci-Fi Romance Design

- User views site on phone, sees cosmic navigation menu with smooth starfield animation
- User scrolls on mobile, sees book covers and space elements properly formatted for small screens
- User tests touch interactions, sees book covers sized appropriately with cosmic hover effects
- User rotates device, sees layout adapting seamlessly with sci-fi branding maintained

WHY: Most Facebook ad traffic comes from mobile devices targeting sci-fi romance readers
DEPENDS: 005, ALL UI specs
NOTE: Ensure cosmic elements work on mobile, touch targets 44px minimum, test space animations

## ☐ Spec 017: SEO for Sci-Fi Romance Discovery

- User views page source, sees Open Graph tags optimized for alien romance social sharing
- User checks meta descriptions, sees compelling descriptions mentioning "sexy escapes" and "no Mary Sues"
- User examines structured data, sees JSON-LD markup for sci-fi romance author and book schema
- User searches "alien romance no Mary Sue", sees Dane's site ranking prominently

WHY: SEO drives organic discovery for sci-fi romance keywords and author brand recognition
DEPENDS: ALL content specs
NOTE: Target "sci-fi romance", "alien romance", "Dane Griggs" keywords, author schema

## ☐ Spec 018: Content Management for Sci-Fi Series

- User adds new Koko's Harbor book via CMS, sees content appearing with proper alien species tagging
- User updates Saving Ceraste series description, sees changes reflected in world-building sections
- User uploads new book cover, sees cosmic styling applied with proper responsive variants
- User publishes blog post about alien biology, sees content indexed with sci-fi romance tags

WHY: Easy content management enables Dane to maintain her sci-fi romance site independently
DEPENDS: 004, ALL content specs
NOTE: Ensure alien species relationships work properly, validate sci-fi romance metadata with Decap CMS

## ☐ Spec 019: Analytics for Sci-Fi Romance Marketing

- User visits site, sees Google Analytics tracking sci-fi romance reader behavior patterns
- User clicks "Read Free on KU" buttons, sees conversion events tracked for alien romance optimization
- User signs up for alien romance pack, sees newsletter conversion goals recorded properly
- User examines analytics, sees traffic sources and popular sci-fi romance content performance

WHY: Analytics data is essential for optimizing Facebook ads targeting sci-fi romance readers
DEPENDS: ALL user interaction specs
NOTE: Track alien species interest, space vs paranormal preferences, series completion rates

## ☐ Spec 020: Production Deployment for Sci-Fi Romance Site

- User runs build command, sees Dane's sci-fi romance site generated with all cosmic optimizations
- User deploys to Netlify, sees danegriggs.com live with space branding and SSL certificate
- User configures CMS authentication, sees GitHub OAuth working for Dane's content management
- User tests all functionality, sees cosmic animations and sci-fi content working perfectly

WHY: Production deployment makes Dane's sci-fi romance site available to real readers and ad traffic
DEPENDS: ALL previous specs
NOTE: Use Netlify hosting, configure environment variables, ensure cosmic branding consistent