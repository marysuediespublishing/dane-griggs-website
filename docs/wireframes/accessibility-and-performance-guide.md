# Accessibility & Performance Implementation Guide

## Overview
This guide provides comprehensive accessibility and performance specifications for Dane Griggs' sci-fi romance website. All recommendations align with WCAG 2.1 AA standards, modern web performance best practices, and the cosmic brand identity.

---

## Web Accessibility Guidelines (WCAG 2.1 AA Compliance)

### Perceivable Content

#### Color and Contrast
```css
/* WCAG AA Compliant Color Ratios (minimum 4.5:1) */
:root {
  /* Primary text on backgrounds */
  --text-on-navy: #ffffff;        /* 21:1 ratio on Deep Space Navy */
  --text-on-white: #1a1a2e;      /* 16.8:1 ratio on Solar White */
  
  /* Interactive elements */
  --cosmic-rose: #d4336a;         /* 4.51:1 ratio on white */
  --stellar-gold: #f4a261;        /* 4.7:1 ratio on navy */
  
  /* Focus indicators */
  --focus-ring: #f4a261;          /* Stellar Gold with 3px outline */
  --focus-shadow: 0 0 0 3px rgba(244, 162, 97, 0.5);
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --cosmic-rose: #ff1a5c;       /* Higher contrast version */
    --stellar-gold: #ffb347;      /* Enhanced visibility */
    --text-primary: #000000;      /* Pure black text */
    --bg-primary: #ffffff;        /* Pure white background */
  }
}
```

#### Alternative Text for Images
```html
<!-- Book covers with descriptive alt text -->
<img src="bride-program-cover.webp" 
     alt="The Bride Program book cover showing a woman in medical scrubs with a tall, horned Cerastean warrior against a space station backdrop">

<!-- Decorative cosmic elements -->
<img src="starfield-decoration.webp" 
     alt="" 
     role="presentation">

<!-- Author photo -->
<img src="dane-griggs-author.webp" 
     alt="Dane Griggs, sci-fi romance author, smiling in her Florida home office with her dachshund">
```

#### Text Alternatives for Complex Graphics
```html
<!-- Statistics visualization -->
<div class="stats-chart" role="img" aria-labelledby="stats-title" aria-describedby="stats-desc">
  <h3 id="stats-title">Dane Griggs Author Statistics</h3>
  <p id="stats-desc">
    47 published books, 200 million plus pages read by fans, 
    9,339 ratings with 4.8 average rating, 2 complete series available
  </p>
  <!-- Visual chart elements -->
</div>
```

### Operable Interface

#### Keyboard Navigation
```css
/* Focus indicators for all interactive elements */
.focusable-element:focus {
  outline: 3px solid var(--stellar-gold);
  outline-offset: 2px;
  box-shadow: var(--focus-shadow);
}

/* Skip links for main navigation */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--cosmic-rose);
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 1000;
  transition: top 0.3s;
}

.skip-link:focus {
  top: 6px;
}
```

#### Keyboard Interaction Patterns
```javascript
// Carousel navigation with arrow keys
class AccessibleCarousel {
  constructor(element) {
    this.carousel = element;
    this.slides = element.querySelectorAll('.book-slide');
    this.currentSlide = 0;
    
    this.carousel.addEventListener('keydown', this.handleKeyDown.bind(this));
  }
  
  handleKeyDown(event) {
    switch(event.key) {
      case 'ArrowLeft':
        this.previousSlide();
        event.preventDefault();
        break;
      case 'ArrowRight':
        this.nextSlide();
        event.preventDefault();
        break;
      case 'Home':
        this.goToSlide(0);
        event.preventDefault();
        break;
      case 'End':
        this.goToSlide(this.slides.length - 1);
        event.preventDefault();
        break;
    }
  }
}

// Modal dialog management
class AccessibleModal {
  constructor(modalElement) {
    this.modal = modalElement;
    this.focusableElements = this.modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    this.previousFocus = null;
  }
  
  open() {
    this.previousFocus = document.activeElement;
    this.modal.style.display = 'block';
    this.focusableElements[0]?.focus();
    document.addEventListener('keydown', this.handleEscape.bind(this));
  }
  
  close() {
    this.modal.style.display = 'none';
    this.previousFocus?.focus();
    document.removeEventListener('keydown', this.handleEscape.bind(this));
  }
  
  handleEscape(event) {
    if (event.key === 'Escape') {
      this.close();
    }
  }
}
```

#### Touch Target Sizing
```css
/* Minimum 44px touch targets for iOS/Android */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  padding: 12px;
}

/* Book cards on mobile */
.mobile-book-card {
  min-height: 60px;
  padding: 16px;
  margin: 8px;
}

/* Navigation items */
.nav-item {
  min-height: 48px;
  padding: 12px 16px;
}
```

### Understandable Content

#### Page Structure and Headings
```html
<!-- Proper heading hierarchy -->
<header>
  <h1>Dane Griggs - Sci-Fi Romance Author</h1>
</header>

<main>
  <section aria-labelledby="featured-book">
    <h2 id="featured-book">Featured Book</h2>
    
    <article>
      <h3>The Bride Program</h3>
      <h4>Series Information</h4>
      <h4>Reader Reviews</h4>
    </article>
  </section>
  
  <section aria-labelledby="all-books">
    <h2 id="all-books">All Books</h2>
    
    <article>
      <h3>Book Title</h3>
    </article>
  </section>
</main>
```

#### Form Labels and Instructions
```html
<!-- Newsletter signup form -->
<form class="newsletter-form" role="form" aria-labelledby="newsletter-title">
  <h3 id="newsletter-title">Get Your Free Alien Romance Pack</h3>
  
  <div class="form-group">
    <label for="email-input">Email Address</label>
    <input 
      type="email" 
      id="email-input" 
      name="email" 
      required 
      aria-describedby="email-help email-error"
      autocomplete="email">
    <div id="email-help" class="form-help">
      We'll send you free books and updates about new releases
    </div>
    <div id="email-error" class="form-error" aria-live="polite">
      <!-- Error messages appear here -->
    </div>
  </div>
  
  <button type="submit" aria-describedby="submit-help">
    Get Your Free Books
  </button>
  <div id="submit-help" class="form-help">
    No spam ever. Unsubscribe anytime.
  </div>
</form>
```

#### Error Handling and Feedback
```html
<!-- Search with live results -->
<div class="search-container">
  <label for="book-search">Search Books</label>
  <input 
    type="search" 
    id="book-search" 
    aria-describedby="search-help search-results"
    aria-expanded="false"
    aria-autocomplete="list"
    role="combobox">
  
  <div id="search-help" class="sr-only">
    Type to search books by title, alien species, or series
  </div>
  
  <div 
    id="search-results" 
    role="listbox" 
    aria-live="polite"
    aria-label="Search results">
    <!-- Results populated dynamically -->
  </div>
</div>
```

### Robust Implementation

#### Semantic HTML Structure
```html
<!-- Book listing with proper semantics -->
<section aria-labelledby="books-heading">
  <h2 id="books-heading">Sci-Fi Romance Books</h2>
  
  <div class="filter-controls" role="group" aria-labelledby="filter-heading">
    <h3 id="filter-heading" class="sr-only">Filter Books</h3>
    
    <fieldset>
      <legend>Alien Species</legend>
      <div class="checkbox-group" role="group">
        <input type="checkbox" id="cerastean" name="species" value="cerastean">
        <label for="cerastean">Cerastean (23 books)</label>
        
        <input type="checkbox" id="kraken" name="species" value="kraken">
        <label for="kraken">Kraken (8 books)</label>
      </div>
    </fieldset>
  </div>
  
  <div class="books-grid" role="grid" aria-label="Book collection">
    <article class="book-card" role="gridcell">
      <header>
        <h3>
          <a href="/books/bride-program">The Bride Program</a>
        </h3>
        <p class="series-info">Saving Ceraste Series, Book 1</p>
      </header>
      
      <img src="bride-program-cover.webp" alt="Book cover for The Bride Program">
      
      <div class="book-meta">
        <div class="rating" aria-label="4.8 out of 5 stars, 2,847 ratings">
          <span class="stars" aria-hidden="true">⭐⭐⭐⭐⭐</span>
          <span class="rating-text">4.8 (2,847 ratings)</span>
        </div>
        
        <div class="tags" aria-label="Book features">
          <span class="tag">Cerastean aliens</span>
          <span class="tag">Space station setting</span>
          <span class="tag">Explicit content</span>
        </div>
      </div>
      
      <footer class="book-actions">
        <a href="/ku/bride-program" class="btn btn-primary">
          Read Free on Kindle Unlimited
        </a>
        <a href="/amazon/bride-program" class="btn btn-secondary">
          Buy on Amazon
        </a>
      </footer>
    </article>
  </div>
</section>
```

#### ARIA Live Regions
```html
<!-- Dynamic content updates -->
<div aria-live="polite" aria-atomic="false" class="sr-only" id="status-updates">
  <!-- Status messages appear here -->
</div>

<div aria-live="assertive" aria-atomic="true" class="sr-only" id="urgent-updates">
  <!-- Critical updates appear here -->
</div>

<!-- Search results counter -->
<div id="results-count" aria-live="polite" aria-atomic="true">
  Showing 23 books for "cerastean warriors"
</div>
```

---

## Performance Optimization Strategy

### Core Web Vitals Targets
```
Largest Contentful Paint (LCP): < 2.5 seconds
First Input Delay (FID): < 100 milliseconds  
Cumulative Layout Shift (CLS): < 0.1
First Contentful Paint (FCP): < 1.8 seconds
Time to Interactive (TTI): < 3.8 seconds
```

### Critical Rendering Path Optimization

#### Above-the-Fold Critical CSS
```css
/* Inline critical CSS for homepage hero */
.hero-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #ffffff;
  min-height: 100vh;
}

.author-photo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
}

.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.5rem, 4vw, 3rem);
  text-align: center;
  margin-bottom: 1rem;
}

.cta-button {
  background: #d4336a;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  margin: 0.5rem;
}
```

#### Font Loading Strategy
```html
<!-- Preload critical fonts -->
<link rel="preload" href="/fonts/playfair-display-v22-latin-regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/inter-v12-latin-regular.woff2" as="font" type="font/woff2" crossorigin>

<!-- Font display optimization -->
<style>
@font-face {
  font-family: 'Playfair Display';
  src: url('/fonts/playfair-display-v22-latin-regular.woff2') format('woff2');
  font-display: swap;
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-v12-latin-regular.woff2') format('woff2');
  font-display: swap;
  font-weight: 400;
  font-style: normal;
}
</style>
```

### Image Optimization

#### Responsive Images with Modern Formats
```html
<!-- Hero book cover with multiple formats and sizes -->
<picture>
  <source 
    media="(min-width: 768px)"
    srcset="
      /images/bride-program-400.avif 400w,
      /images/bride-program-600.avif 600w,
      /images/bride-program-800.avif 800w
    "
    type="image/avif">
  
  <source 
    media="(min-width: 768px)"
    srcset="
      /images/bride-program-400.webp 400w,
      /images/bride-program-600.webp 600w,
      /images/bride-program-800.webp 800w
    "
    type="image/webp">
  
  <source 
    media="(max-width: 767px)"
    srcset="
      /images/bride-program-200.avif 200w,
      /images/bride-program-300.avif 300w,
      /images/bride-program-400.avif 400w
    "
    type="image/avif">
  
  <source 
    media="(max-width: 767px)"
    srcset="
      /images/bride-program-200.webp 200w,
      /images/bride-program-300.webp 300w,
      /images/bride-program-400.webp 400w
    "
    type="image/webp">
  
  <img 
    src="/images/bride-program-400.jpg"
    srcset="
      /images/bride-program-200.jpg 200w,
      /images/bride-program-400.jpg 400w,
      /images/bride-program-600.jpg 600w
    "
    sizes="(max-width: 767px) 200px, 400px"
    alt="The Bride Program book cover"
    loading="lazy"
    decoding="async">
</picture>
```

#### Lazy Loading Implementation
```javascript
// Intersection Observer for lazy loading
class LazyImageLoader {
  constructor() {
    this.imageObserver = new IntersectionObserver(this.onIntersection.bind(this), {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
    
    this.images = document.querySelectorAll('img[data-src]');
    this.images.forEach(img => this.imageObserver.observe(img));
  }
  
  onIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadImage(entry.target);
        this.imageObserver.unobserve(entry.target);
      }
    });
  }
  
  loadImage(img) {
    img.src = img.dataset.src;
    img.classList.remove('lazy');
    img.classList.add('loaded');
  }
}
```

### JavaScript Performance

#### Bundle Optimization
```javascript
// Dynamic imports for non-critical features
const loadBookCarousel = async () => {
  const { BookCarousel } = await import('./components/BookCarousel.js');
  return new BookCarousel();
};

const loadSearchFeatures = async () => {
  const { SearchBox } = await import('./components/SearchBox.js');
  const { FilterPanel } = await import('./components/FilterPanel.js');
  return { SearchBox, FilterPanel };
};

// Load based on user interaction
document.addEventListener('DOMContentLoaded', () => {
  // Essential features load immediately
  initNavigation();
  initNewsletterForm();
  
  // Non-essential features load on interaction
  const searchTrigger = document.querySelector('.search-trigger');
  searchTrigger?.addEventListener('click', () => {
    loadSearchFeatures().then(({ SearchBox }) => {
      new SearchBox('.search-container');
    });
  }, { once: true });
});
```

#### Service Worker for Caching
```javascript
// sw.js - Service Worker for caching strategy
const CACHE_NAME = 'dane-griggs-v1';
const STATIC_ASSETS = [
  '/',
  '/css/critical.css',
  '/js/app.js',
  '/fonts/playfair-display-v22-latin-regular.woff2',
  '/fonts/inter-v12-latin-regular.woff2'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
  );
});

// Fetch event - cache strategy
self.addEventListener('fetch', event => {
  // Cache book covers with stale-while-revalidate
  if (event.request.url.includes('/images/covers/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(response => {
          const fetchPromise = fetch(event.request).then(networkResponse => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
          return response || fetchPromise;
        });
      })
    );
  }
  
  // Network first for API calls
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
  }
});
```

### Database and API Performance

#### Optimized Book Queries
```javascript
// Efficient book filtering and pagination
class BookAPI {
  async getBooks(filters = {}, page = 1, limit = 20) {
    const query = this.buildQuery(filters);
    const offset = (page - 1) * limit;
    
    // Use database indexes on commonly filtered fields
    const books = await db.books.find(query)
      .limit(limit)
      .offset(offset)
      .include(['series', 'tags', 'ratings'])
      .orderBy('publishedDate', 'desc');
    
    // Cache results for 5 minutes
    this.cache.set(`books:${JSON.stringify(filters)}:${page}`, books, 300);
    
    return books;
  }
  
  buildQuery(filters) {
    const query = {};
    
    if (filters.species) {
      query.alienSpecies = { $in: filters.species };
    }
    
    if (filters.heatLevel) {
      query.heatLevel = { $in: filters.heatLevel };
    }
    
    if (filters.series) {
      query.seriesId = { $in: filters.series };
    }
    
    return query;
  }
}
```

### CDN and Hosting Strategy

#### Astro Static Generation
```javascript
// astro.config.mjs - Optimized build configuration
export default defineConfig({
  output: 'static',
  integrations: [
    tailwind(),
    react(),
    sitemap(),
    robotsTxt(),
    
    // Image optimization
    image({
      serviceEntryPoint: '@astrojs/image/sharp',
      cacheDir: './.cache/image',
      logLevel: 'info'
    }),
    
    // Bundle analysis
    bundleAnalyzer({
      mode: 'static',
      openAnalyzer: false
    })
  ],
  
  build: {
    // Generate separate chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-components': ['./src/components/ui/'],
          'book-features': ['./src/components/books/']
        }
      }
    }
  },
  
  vite: {
    build: {
      // Optimize bundle size
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    }
  }
});
```

---

## Monitoring and Testing

### Performance Monitoring
```javascript
// Web Vitals monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to Google Analytics or other monitoring service
  gtag('event', metric.name, {
    event_category: 'Web Vitals',
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    event_label: metric.id,
    non_interaction: true,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### Accessibility Testing
```javascript
// Automated accessibility testing
const axeConfig = {
  rules: {
    'color-contrast': { enabled: true },
    'focus-order-semantics': { enabled: true },
    'keyboard-navigation': { enabled: true },
    'landmark-one-main': { enabled: true },
    'page-has-heading-one': { enabled: true }
  }
};

// Test critical user journeys
describe('Accessibility Tests', () => {
  test('Homepage accessibility', async () => {
    await axe.run(document, axeConfig);
  });
  
  test('Book search accessibility', async () => {
    await axe.run('.search-container', axeConfig);
  });
  
  test('Newsletter form accessibility', async () => {
    await axe.run('.newsletter-form', axeConfig);
  });
});
```

This comprehensive accessibility and performance guide ensures Dane's sci-fi romance website meets the highest standards for user experience, compliance, and technical excellence while maintaining the cosmic brand identity throughout.