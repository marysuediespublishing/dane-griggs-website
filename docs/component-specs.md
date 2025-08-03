# Dane Griggs Website - Component Design Specifications

## Overview
This document provides comprehensive design specifications for all components required for Dane Griggs' sci-fi romance author website. The design system reflects the cosmic brand positioning "sexy escapes with no Mary Sues" while maintaining sophisticated, modern aesthetics that appeal to romance readers.

---

## Design System Foundation

### Color Palette & Design Tokens

#### Primary Color System
```css
/* Core Brand Colors */
--color-deep-space-navy: #1a1a2e;     /* Primary dark, authority, depth */
--color-cosmic-rose: #d4336a;          /* Romance, passion, CTAs */
--color-stellar-gold: #f4a261;         /* Premium, accents, highlights */

/* Secondary Colors */
--color-nebula-purple: #6a4c93;        /* Mystery, alien elements */
--color-starlight-silver: #e9ecef;     /* Clean backgrounds, borders */
--color-solar-white: #ffffff;          /* Pure white, cards, text */

/* Accent Colors */
--color-mars-red: #e63946;             /* Error states, urgent CTAs */
--color-ocean-teal: #2a9d8f;           /* Success states, Florida connection */

/* Gradient Definitions */
--gradient-cosmic: linear-gradient(135deg, #1a1a2e 0%, #6a4c93 50%, #d4336a 100%);
--gradient-starfield: radial-gradient(circle at 50% 50%, rgba(244, 162, 97, 0.1) 0%, transparent 50%);
--gradient-aurora: linear-gradient(45deg, #d4336a 0%, #f4a261 50%, #6a4c93 100%);
```

#### Semantic Color System
```css
/* Text Colors */
--text-primary: #1a1a2e;               /* Main content, headers */
--text-secondary: #4a5568;             /* Body text, descriptions */
--text-muted: #718096;                 /* Captions, metadata */
--text-inverse: #ffffff;               /* Text on dark backgrounds */

/* Background Colors */
--bg-primary: #ffffff;                 /* Main backgrounds */
--bg-secondary: #f7fafc;               /* Subtle contrast areas */
--bg-tertiary: #edf2f7;                /* Cards, sections */
--bg-dark: #1a1a2e;                    /* Dark mode, headers */

/* Border Colors */
--border-light: #e2e8f0;               /* Subtle borders */
--border-medium: #cbd5e0;              /* Standard borders */
--border-accent: #d4336a;              /* Highlighted borders */

/* State Colors */
--success: #10b981;                    /* Success states */
--warning: #f59e0b;                    /* Warning states */
--error: #ef4444;                      /* Error states */
--info: #3b82f6;                       /* Information states */
```

### Typography System

#### Font Stack
```css
/* Primary Brand Font - Headers & Titles */
--font-primary: 'Playfair Display', 'Georgia', serif;

/* Secondary Font - Body Text */
--font-secondary: 'Inter', 'Helvetica Neue', 'Arial', sans-serif;

/* Accent Font - Special Elements (Use Sparingly) */
--font-accent: 'Orbitron', 'Courier New', monospace;
```

#### Typography Scale
```css
/* Mobile-First Typography */
--text-xs: 0.75rem;     /* 12px - Captions, tiny labels */
--text-sm: 0.875rem;    /* 14px - Secondary text */
--text-base: 1rem;      /* 16px - Default body text */
--text-lg: 1.125rem;    /* 18px - Large body text */
--text-xl: 1.25rem;     /* 20px - Card titles */
--text-2xl: 1.5rem;     /* 24px - Section headers */
--text-3xl: 1.875rem;   /* 30px - Page titles */
--text-4xl: 2.25rem;    /* 36px - Hero headlines */
--text-5xl: 3rem;       /* 48px - Display headlines */

/* Line Heights */
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;

/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing System
```css
/* 8px Base Grid System */
--space-0: 0;
--space-1: 0.25rem;     /* 4px - Tight spacing */
--space-2: 0.5rem;      /* 8px - Small spacing */
--space-3: 0.75rem;     /* 12px - Compact spacing */
--space-4: 1rem;        /* 16px - Default spacing */
--space-5: 1.25rem;     /* 20px - Medium spacing */
--space-6: 1.5rem;      /* 24px - Large spacing */
--space-8: 2rem;        /* 32px - Section spacing */
--space-10: 2.5rem;     /* 40px - Large sections */
--space-12: 3rem;       /* 48px - Hero spacing */
--space-16: 4rem;       /* 64px - Major sections */
--space-20: 5rem;       /* 80px - Page sections */
```

### Shadow System
```css
/* Elevation Shadows */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

/* Cosmic Glow Effects */
--glow-cosmic: 0 0 20px rgba(212, 51, 106, 0.3);
--glow-stellar: 0 0 15px rgba(244, 162, 97, 0.4);
--glow-nebula: 0 0 25px rgba(106, 76, 147, 0.2);
```

### Border Radius System
```css
--radius-none: 0;
--radius-sm: 0.125rem;   /* 2px */
--radius-base: 0.25rem;  /* 4px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-2xl: 1rem;      /* 16px */
--radius-full: 9999px;   /* Fully rounded */
```

---

## Component Library Specifications

### Foundation Components

#### Button Component
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}
```

**Button Variants:**
```css
/* Primary Button - Cosmic Rose */
.btn-primary {
  background: var(--color-cosmic-rose);
  color: var(--color-solar-white);
  border: 2px solid var(--color-cosmic-rose);
  box-shadow: var(--shadow-base);
  transition: all 200ms ease-in-out;
}

.btn-primary:hover {
  background: #c12d5e;
  box-shadow: var(--glow-cosmic), var(--shadow-lg);
  transform: translateY(-1px);
}

/* Secondary Button - Stellar Gold */
.btn-secondary {
  background: var(--color-stellar-gold);
  color: var(--color-deep-space-navy);
  border: 2px solid var(--color-stellar-gold);
}

.btn-secondary:hover {
  background: #f39651;
  box-shadow: var(--glow-stellar);
}

/* Outline Button */
.btn-outline {
  background: transparent;
  color: var(--color-cosmic-rose);
  border: 2px solid var(--color-cosmic-rose);
}

.btn-outline:hover {
  background: var(--color-cosmic-rose);
  color: var(--color-solar-white);
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: var(--color-cosmic-rose);
  border: 2px solid transparent;
}

.btn-ghost:hover {
  background: rgba(212, 51, 106, 0.1);
  border-color: var(--color-cosmic-rose);
}

/* Danger Button */
.btn-danger {
  background: var(--color-mars-red);
  color: var(--color-solar-white);
  border: 2px solid var(--color-mars-red);
}
```

**Button Sizes:**
```css
.btn-sm {
  padding: 0.5rem 1rem;
  font-size: var(--text-sm);
  min-height: 2.5rem;
}

.btn-md {
  padding: 0.75rem 1.5rem;
  font-size: var(--text-base);
  min-height: 3rem;
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: var(--text-lg);
  min-height: 3.5rem;
}

.btn-xl {
  padding: 1.25rem 2.5rem;
  font-size: var(--text-xl);
  min-height: 4rem;
}
```

#### Input Component
```typescript
interface InputProps {
  type: 'text' | 'email' | 'search' | 'password';
  placeholder?: string;
  error?: string;
  success?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}
```

**Input Styles:**
```css
.input-base {
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-medium);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  background: var(--bg-primary);
  transition: all 200ms ease-in-out;
}

.input-base:focus {
  outline: none;
  border-color: var(--color-cosmic-rose);
  box-shadow: var(--glow-cosmic);
}

.input-error {
  border-color: var(--error);
}

.input-success {
  border-color: var(--success);
}

.input-disabled {
  background: var(--bg-tertiary);
  color: var(--text-muted);
  cursor: not-allowed;
}
```

#### Card Component
```typescript
interface CardProps {
  variant: 'default' | 'elevated' | 'outlined' | 'cosmic';
  padding: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  children: ReactNode;
}
```

**Card Variants:**
```css
.card-base {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: all 300ms ease-in-out;
}

.card-default {
  box-shadow: var(--shadow-base);
}

.card-elevated {
  box-shadow: var(--shadow-lg);
}

.card-outlined {
  border: 2px solid var(--border-light);
  box-shadow: none;
}

.card-cosmic {
  background: var(--gradient-starfield);
  border: 1px solid rgba(212, 51, 106, 0.2);
}

.card-hoverable:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.card-cosmic.card-hoverable:hover {
  box-shadow: var(--glow-cosmic), var(--shadow-xl);
}
```

#### Badge Component
```typescript
interface BadgeProps {
  variant: 'species' | 'heat-level' | 'setting' | 'status' | 'default';
  size: 'sm' | 'md' | 'lg';
  children: ReactNode;
}
```

**Badge Styles:**
```css
.badge-base {
  display: inline-flex;
  align-items: center;
  font-weight: var(--font-medium);
  border-radius: var(--radius-full);
  white-space: nowrap;
}

.badge-sm {
  padding: 0.25rem 0.5rem;
  font-size: var(--text-xs);
}

.badge-md {
  padding: 0.375rem 0.75rem;
  font-size: var(--text-sm);
}

.badge-lg {
  padding: 0.5rem 1rem;
  font-size: var(--text-base);
}

/* Species Badges */
.badge-cerastean {
  background: rgba(212, 51, 106, 0.1);
  color: var(--color-cosmic-rose);
  border: 1px solid rgba(212, 51, 106, 0.3);
}

.badge-kraken {
  background: rgba(106, 76, 147, 0.1);
  color: var(--color-nebula-purple);
  border: 1px solid rgba(106, 76, 147, 0.3);
}

.badge-dulci {
  background: rgba(244, 162, 97, 0.1);
  color: var(--color-stellar-gold);
  border: 1px solid rgba(244, 162, 97, 0.3);
}

.badge-human {
  background: rgba(42, 157, 143, 0.1);
  color: var(--color-ocean-teal);
  border: 1px solid rgba(42, 157, 143, 0.3);
}

/* Heat Level Badges */
.badge-heat-mild {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success);
}

.badge-heat-medium {
  background: rgba(245, 158, 11, 0.1);
  color: var(--warning);
}

.badge-heat-spicy {
  background: rgba(239, 68, 68, 0.1);
  color: var(--error);
}
```

### Layout Components

#### Header Component
```typescript
interface HeaderProps {
  sticky?: boolean;
  transparent?: boolean;
  variant: 'light' | 'dark';
}
```

**Header Specifications:**
```css
.header {
  width: 100%;
  background: var(--gradient-cosmic);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 300ms ease-in-out;
}

.header-sticky {
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-scrolled {
  box-shadow: var(--shadow-lg);
  background: rgba(26, 26, 46, 0.95);
}

.header-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header-logo {
  font-family: var(--font-primary);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-solar-white);
  text-decoration: none;
}

.header-nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.header-nav-link {
  color: var(--color-starlight-silver);
  text-decoration: none;
  font-weight: var(--font-medium);
  transition: all 200ms ease-in-out;
  position: relative;
}

.header-nav-link:hover,
.header-nav-link.active {
  color: var(--color-stellar-gold);
}

.header-nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-stellar-gold);
  border-radius: var(--radius-full);
}

/* Mobile Styles */
@media (max-width: 768px) {
  .header-nav-links {
    display: none;
  }
  
  .header-mobile-menu {
    display: block;
  }
}
```

#### Mobile Menu Component
```css
.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  z-index: 60;
  transform: translateX(-100%);
  transition: transform 300ms ease-in-out;
}

.mobile-menu.open {
  transform: translateX(0);
}

.mobile-menu-panel {
  width: 280px;
  height: 100%;
  background: var(--gradient-cosmic);
  padding: 2rem;
  overflow-y: auto;
}

.mobile-menu-nav {
  margin-top: 2rem;
}

.mobile-menu-link {
  display: block;
  color: var(--color-starlight-silver);
  text-decoration: none;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: var(--text-lg);
  transition: color 200ms ease-in-out;
}

.mobile-menu-link:hover {
  color: var(--color-stellar-gold);
}

.mobile-menu-newsletter {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
}
```

### Content Components

#### Book Card Component
```typescript
interface BookCardProps {
  book: {
    id: string;
    title: string;
    cover: string;
    series?: string;
    rating: number;
    species: string[];
    heatLevel: 'mild' | 'medium' | 'spicy';
    isKU?: boolean;
    price?: string;
  };
  variant: 'standard' | 'compact' | 'featured';
  hoverable?: boolean;
}
```

**Book Card Layouts:**
```css
.book-card {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: all 300ms ease-in-out;
  position: relative;
}

.book-card-standard {
  max-width: 280px;
  box-shadow: var(--shadow-base);
}

.book-card-compact {
  max-width: 180px;
}

.book-card-featured {
  max-width: 400px;
  box-shadow: var(--shadow-lg);
}

.book-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: var(--shadow-xl), var(--glow-cosmic);
}

.book-cover {
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
  transition: transform 300ms ease-in-out;
}

.book-card:hover .book-cover {
  transform: scale(1.05);
}

.book-card-content {
  padding: 1.5rem;
}

.book-title {
  font-family: var(--font-primary);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  line-height: var(--leading-tight);
}

.book-series {
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.book-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.book-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--color-stellar-gold);
}

.book-actions {
  display: flex;
  gap: 0.5rem;
}

/* Hover Overlay */
.book-card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(26, 26, 46, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  opacity: 0;
  transition: opacity 300ms ease-in-out;
}

.book-card:hover .book-card-overlay {
  opacity: 1;
}
```

#### Series Card Component
```typescript
interface SeriesCardProps {
  series: {
    id: string;
    title: string;
    bookCount: number;
    covers: string[];
    description: string;
    completionRate?: number;
    status: 'ongoing' | 'complete';
  };
  variant: 'overview' | 'progress';
}
```

**Series Card Styles:**
```css
.series-card {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: 2rem;
  box-shadow: var(--shadow-base);
  transition: all 300ms ease-in-out;
}

.series-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.series-covers {
  display: flex;
  gap: -0.5rem;
  margin-bottom: 1.5rem;
}

.series-cover-stack {
  width: 60px;
  height: 80px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  transition: transform 300ms ease-in-out;
}

.series-cover-stack:nth-child(n+2) {
  margin-left: -1rem;
}

.series-card:hover .series-cover-stack {
  transform: translateX(0.5rem);
}

.series-title {
  font-family: var(--font-primary);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.series-book-count {
  color: var(--text-muted);
  font-size: var(--text-sm);
  margin-bottom: 1rem;
}

.series-description {
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
  margin-bottom: 1.5rem;
}

.series-progress {
  width: 100%;
  height: 8px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: 1rem;
}

.series-progress-fill {
  height: 100%;
  background: var(--gradient-aurora);
  transition: width 500ms ease-in-out;
}

.series-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--text-sm);
  color: var(--text-muted);
}
```

### Interactive Components

#### Search Component
```typescript
interface SearchProps {
  placeholder?: string;
  instant?: boolean;
  categories?: string[];
  onSearch: (query: string) => void;
  onFilter: (filters: SearchFilters) => void;
}
```

**Search Component Styles:**
```css
.search-container {
  position: relative;
  width: 100%;
  max-width: 600px;
}

.search-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid var(--border-medium);
  border-radius: var(--radius-full);
  font-size: var(--text-base);
  background: var(--bg-primary);
  transition: all 300ms ease-in-out;
}

.search-input:focus {
  border-color: var(--color-cosmic-rose);
  box-shadow: var(--glow-cosmic);
  outline: none;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--border-light);
  margin-top: 0.5rem;
  z-index: 50;
  max-height: 400px;
  overflow-y: auto;
}

.search-result-item {
  padding: 1rem;
  border-bottom: 1px solid var(--border-light);
  cursor: pointer;
  transition: background-color 200ms ease-in-out;
}

.search-result-item:hover {
  background: var(--bg-secondary);
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-category {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.search-category-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  object-fit: cover;
}

.search-category-text {
  flex: 1;
}

.search-category-title {
  font-weight: var(--font-medium);
  color: var(--text-primary);
}

.search-category-subtitle {
  font-size: var(--text-sm);
  color: var(--text-muted);
}
```

#### Filter Panel Component
```css
.filter-panel {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  box-shadow: var(--shadow-base);
}

.filter-section {
  margin-bottom: 2rem;
}

.filter-section:last-child {
  margin-bottom: 0;
}

.filter-title {
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-size: var(--text-lg);
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--radius-lg);
  transition: background-color 200ms ease-in-out;
}

.filter-option:hover {
  background: var(--bg-secondary);
}

.filter-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-medium);
  border-radius: var(--radius-base);
  position: relative;
  transition: all 200ms ease-in-out;
}

.filter-checkbox.checked {
  background: var(--color-cosmic-rose);
  border-color: var(--color-cosmic-rose);
}

.filter-checkbox.checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--color-solar-white);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
}

.filter-label {
  flex: 1;
  color: var(--text-secondary);
}

.filter-count {
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.filter-active-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.filter-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(212, 51, 106, 0.1);
  color: var(--color-cosmic-rose);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
}

.filter-pill-remove {
  cursor: pointer;
  color: var(--color-cosmic-rose);
  font-weight: var(--font-bold);
}
```

### Conversion Components

#### Newsletter Signup Component
```typescript
interface NewsletterSignupProps {
  variant: 'inline' | 'modal' | 'sidebar';
  title?: string;
  description?: string;
  benefits?: string[];
  onSubmit: (email: string) => void;
}
```

**Newsletter Component Styles:**
```css
.newsletter-signup {
  background: var(--gradient-cosmic);
  padding: 2rem;
  border-radius: var(--radius-xl);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.newsletter-signup::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--gradient-starfield);
  opacity: 0.5;
}

.newsletter-content {
  position: relative;
  z-index: 2;
}

.newsletter-title {
  font-family: var(--font-primary);
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-solar-white);
  margin-bottom: 1rem;
}

.newsletter-description {
  color: var(--color-starlight-silver);
  font-size: var(--text-lg);
  margin-bottom: 2rem;
  line-height: var(--leading-relaxed);
}

.newsletter-benefits {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
  text-align: left;
}

.newsletter-benefit {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--color-starlight-silver);
}

.newsletter-benefit-icon {
  width: 24px;
  height: 24px;
  color: var(--color-stellar-gold);
}

.newsletter-form {
  display: flex;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto;
}

.newsletter-input {
  flex: 1;
  padding: 1rem;
  border: 2px solid transparent;
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  background: rgba(255, 255, 255, 0.9);
}

.newsletter-input:focus {
  outline: none;
  border-color: var(--color-stellar-gold);
  box-shadow: var(--glow-stellar);
}

.newsletter-submit {
  padding: 1rem 2rem;
  background: var(--color-stellar-gold);
  color: var(--color-deep-space-navy);
  border: none;
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: all 200ms ease-in-out;
}

.newsletter-submit:hover {
  background: #f39651;
  transform: translateY(-2px);
  box-shadow: var(--glow-stellar);
}

.newsletter-privacy {
  font-size: var(--text-sm);
  color: var(--color-starlight-silver);
  margin-top: 1rem;
  opacity: 0.8;
}

/* Modal Variant */
.newsletter-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 2rem;
}

.newsletter-modal-content {
  max-width: 500px;
  width: 100%;
  position: relative;
}

.newsletter-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: var(--color-starlight-silver);
  font-size: var(--text-xl);
  cursor: pointer;
  z-index: 3;
}
```

#### Purchase CTA Component
```css
.purchase-cta {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.purchase-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.purchase-button {
  flex: 1;
  min-width: 200px;
  padding: 1rem 1.5rem;
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  text-decoration: none;
  text-align: center;
  transition: all 200ms ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.purchase-button-primary {
  background: var(--color-cosmic-rose);
  color: var(--color-solar-white);
  border: 2px solid var(--color-cosmic-rose);
}

.purchase-button-primary:hover {
  background: #c12d5e;
  transform: translateY(-2px);
  box-shadow: var(--glow-cosmic);
}

.purchase-button-secondary {
  background: var(--color-stellar-gold);
  color: var(--color-deep-space-navy);
  border: 2px solid var(--color-stellar-gold);
}

.purchase-button-secondary:hover {
  background: #f39651;
  transform: translateY(-2px);
  box-shadow: var(--glow-stellar);
}

.purchase-button-outline {
  background: transparent;
  color: var(--color-cosmic-rose);
  border: 2px solid var(--color-cosmic-rose);
}

.purchase-button-outline:hover {
  background: var(--color-cosmic-rose);
  color: var(--color-solar-white);
}

.purchase-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  color: var(--text-muted);
}

.purchase-price {
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.purchase-availability {
  color: var(--success);
}
```

---

## Responsive Breakpoints

### Breakpoint System
```css
/* Mobile First Approach */
:root {
  --breakpoint-sm: 640px;    /* Small tablets */
  --breakpoint-md: 768px;    /* Tablets */
  --breakpoint-lg: 1024px;   /* Small desktops */
  --breakpoint-xl: 1280px;   /* Large desktops */
  --breakpoint-2xl: 1536px;  /* Extra large */
}

/* Mobile (Default) */
.container {
  padding: 1rem;
  max-width: 100%;
}

/* Small tablets and up */
@media (min-width: 640px) {
  .container {
    padding: 1.5rem;
  }
  
  .book-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Tablets and up */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
  
  .header-nav-links {
    display: flex;
  }
  
  .mobile-menu-toggle {
    display: none;
  }
  
  .book-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Small desktops and up */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .book-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .filter-panel {
    position: sticky;
    top: 2rem;
  }
}

/* Large desktops and up */
@media (min-width: 1280px) {
  .book-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}
```

---

## Animation & Micro-Interactions

### Cosmic Animation System
```css
/* Keyframe Animations */
@keyframes cosmic-glow {
  0% {
    box-shadow: 0 0 5px rgba(212, 51, 106, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(212, 51, 106, 0.6);
  }
  100% {
    box-shadow: 0 0 5px rgba(212, 51, 106, 0.3);
  }
}

@keyframes stellar-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes starfield {
  0% {
    transform: scale(1) rotate(0deg);
  }
  100% {
    transform: scale(1.1) rotate(360deg);
  }
}

/* Animation Classes */
.animate-cosmic-glow {
  animation: cosmic-glow 2s ease-in-out infinite;
}

.animate-stellar-pulse {
  animation: stellar-pulse 1.5s ease-in-out infinite;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-starfield {
  animation: starfield 20s linear infinite;
}

/* Hover Transitions */
.hover-lift {
  transition: transform 300ms ease-in-out;
}

.hover-lift:hover {
  transform: translateY(-8px);
}

.hover-glow {
  transition: box-shadow 300ms ease-in-out;
}

.hover-glow:hover {
  box-shadow: var(--glow-cosmic);
}

.hover-scale {
  transition: transform 300ms ease-in-out;
}

.hover-scale:hover {
  transform: scale(1.05);
}
```

### Loading States
```css
.skeleton {
  background: linear-gradient(90deg, 
    var(--bg-tertiary) 25%, 
    var(--bg-secondary) 50%, 
    var(--bg-tertiary) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--bg-tertiary);
  border-top: 3px solid var(--color-cosmic-rose);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.cosmic-spinner {
  width: 60px;
  height: 60px;
  position: relative;
}

.cosmic-spinner::before,
.cosmic-spinner::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  animation: cosmic-spin 2s linear infinite;
}

.cosmic-spinner::before {
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top: 3px solid var(--color-cosmic-rose);
}

.cosmic-spinner::after {
  width: 80%;
  height: 80%;
  top: 10%;
  left: 10%;
  border: 2px solid transparent;
  border-bottom: 2px solid var(--color-stellar-gold);
  animation-direction: reverse;
}

@keyframes cosmic-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

---

## Accessibility Specifications

### Focus Management
```css
/* Focus Indicators */
*:focus {
  outline: none;
}

.focus-visible {
  outline: 3px solid var(--color-stellar-gold);
  outline-offset: 2px;
  border-radius: var(--radius-base);
}

/* High contrast focus for better visibility */
@media (prefers-contrast: high) {
  .focus-visible {
    outline: 4px solid #000000;
    outline-offset: 3px;
  }
}

/* Focus within containers */
.focus-within:focus-within {
  box-shadow: var(--glow-stellar);
}

/* Skip links */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--color-deep-space-navy);
  color: var(--color-solar-white);
  padding: 8px;
  border-radius: var(--radius-base);
  text-decoration: none;
  z-index: 100;
  transition: top 300ms ease-in-out;
}

.skip-link:focus {
  top: 6px;
}
```

### Screen Reader Support
```css
/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Screen reader only but focusable */
.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}

/* Live regions for dynamic content */
.live-region {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
```

### Reduced Motion Support
```css
/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .parallax {
    transform: none !important;
  }
  
  .auto-scroll {
    scroll-behavior: auto !important;
  }
}

/* Alternative indicators for reduced motion */
@media (prefers-reduced-motion: reduce) {
  .hover-lift:hover {
    transform: none;
    border: 2px solid var(--color-cosmic-rose);
  }
  
  .animate-float {
    animation: none;
    transform: none;
  }
}
```

---

## Dark Mode Implementation

### Dark Mode Color Scheme
```css
/* Dark mode variables */
@media (prefers-color-scheme: dark) {
  :root {
    --text-primary: #e2e8f0;
    --text-secondary: #cbd5e0;
    --text-muted: #a0aec0;
    --text-inverse: #1a1a2e;
    
    --bg-primary: #1a202c;
    --bg-secondary: #2d3748;
    --bg-tertiary: #4a5568;
    --bg-dark: #0d1117;
    
    --border-light: #4a5568;
    --border-medium: #718096;
  }
}

/* Manual dark mode toggle */
[data-theme="dark"] {
  --text-primary: #e2e8f0;
  --text-secondary: #cbd5e0;
  --text-muted: #a0aec0;
  --text-inverse: #1a1a2e;
  
  --bg-primary: #1a202c;
  --bg-secondary: #2d3748;
  --bg-tertiary: #4a5568;
  --bg-dark: #0d1117;
  
  --border-light: #4a5568;
  --border-medium: #718096;
}

/* Dark mode specific adjustments */
@media (prefers-color-scheme: dark) {
  .card-cosmic {
    background: rgba(26, 26, 46, 0.8);
    backdrop-filter: blur(10px);
  }
  
  .book-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-light);
  }
  
  .newsletter-input {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }
}
```

---

## Performance Optimizations

### Critical CSS Strategy
```css
/* Above-the-fold critical styles */
.critical {
  /* Header, hero section, and basic layout */
  /* Should be inlined in <head> */
}

/* Lazy-loaded component styles */
.lazy-load {
  /* Non-critical components */
  /* Loaded after initial render */
}

/* Progressive enhancement */
.no-js .enhanced-only {
  display: none;
}

.js .fallback-only {
  display: none;
}
```

### Image Optimization
```css
/* Responsive images */
.responsive-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  loading: lazy;
}

/* Image placeholders */
.image-placeholder {
  background: var(--gradient-starfield);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  aspect-ratio: 2/3;
}

/* Intersection observer loading */
.lazy-image {
  opacity: 0;
  transition: opacity 300ms ease-in-out;
}

.lazy-image.loaded {
  opacity: 1;
}
```

This comprehensive component specification provides the foundation for building a sophisticated, accessible, and performant website that reflects Dane Griggs' cosmic sci-fi romance brand while ensuring excellent user experience across all devices and platforms.