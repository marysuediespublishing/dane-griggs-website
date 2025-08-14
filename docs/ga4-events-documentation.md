# GA4 Events Documentation
## Dane Griggs Author Website Analytics

This document provides a comprehensive reference for all custom Google Analytics 4 events implemented for the author website, including parameters, triggers, and business value.

## Event Taxonomy Overview

### Event Categories
1. **Book Interactions** - Reader engagement with books
2. **Newsletter Events** - Email list building and engagement
3. **Search Events** - Site search behavior
4. **Navigation Events** - User journey tracking
5. **Conversion Events** - Business goal completions

### Naming Convention
- Events use `snake_case` naming
- Parameters use `snake_case` naming
- Values are consistent across similar events
- Currency is always USD for this implementation

## Standard GA4 Events Used

### 1. page_view
**Trigger**: Automatic on every page load (after consent)
**Purpose**: Track page views and user sessions

**Parameters**:
```json
{
  "page_title": "Page Title",
  "page_location": "https://example.com/page",
  "page_path": "/page"
}
```

### 2. search
**Trigger**: When user submits search form
**Purpose**: Track internal site searches

**Parameters**:
```json
{
  "search_term": "alien romance",
  "results_count": 15
}
```

### 3. click (Outbound Links)
**Trigger**: When user clicks external links
**Purpose**: Track outbound link clicks

**Parameters**:
```json
{
  "event_category": "outbound",
  "event_label": "https://amazon.com/...",
  "transport_type": "beacon",
  "link_text": "Buy Book"
}
```

### 4. purchase
**Trigger**: When book purchase button is clicked
**Purpose**: E-commerce conversion tracking

**Parameters**:
```json
{
  "transaction_id": "book_1704123456789",
  "value": 4.99,
  "currency": "USD",
  "items": [{
    "item_id": "ASIN123456789",
    "item_name": "Book Title",
    "category": "Book",
    "category2": "Series Name",
    "quantity": 1,
    "price": 4.99
  }]
}
```

### 5. conversion
**Trigger**: Newsletter signups and other business goals
**Purpose**: Conversion tracking for optimization

**Parameters**:
```json
{
  "send_to": "G-MEASUREMENT_ID/newsletter_signup",
  "value": 1.00,
  "currency": "USD"
}
```

## Custom Book Marketing Events

### 1. view_book
**Trigger**: When user clicks on a book card or views book details
**Purpose**: Track book discovery and interest
**Business Value**: Understanding which books generate most interest

**Parameters**:
```json
{
  "book_title": "Captive of the Cerastean Prince",
  "book_asin": "B0123456789",
  "series": "Cerastean Empire",
  "series_order": 1,
  "author": "Dane Griggs",
  "species": ["cerastean"],
  "heat_level": "spicy",
  "source_page": "/books",
  "button_type": "view_book",
  "value": 0.50,
  "currency": "USD"
}
```

**Code Example**:
```typescript
trackBookView({
  book_title: book.data.title,
  book_asin: extractASIN(book.data.amazonUrl),
  series: book.data.series,
  author: book.data.author,
  species: book.data.species,
  heat_level: book.data.heatLevel
});
```

### 2. book_purchase
**Trigger**: When user clicks "Buy" button
**Purpose**: Track purchase intent and conversion funnel
**Business Value**: Measure conversion rates and book performance

**Parameters**:
```json
{
  "book_title": "Captive of the Cerastean Prince",
  "book_asin": "B0123456789",
  "series": "Cerastean Empire",
  "series_order": 1,
  "author": "Dane Griggs",
  "species": ["cerastean"],
  "heat_level": "spicy",
  "source_page": "/books",
  "button_type": "buy",
  "value": 4.99,
  "currency": "USD"
}
```

### 3. kindle_unlimited_click
**Trigger**: When user clicks "Read Free on KU" button
**Purpose**: Track Kindle Unlimited engagement
**Business Value**: Understand KU vs purchase preferences

**Parameters**:
```json
{
  "book_title": "Captive of the Cerastean Prince",
  "book_asin": "B0123456789",
  "series": "Cerastean Empire",
  "series_order": 1,
  "author": "Dane Griggs",
  "species": ["cerastean"],
  "heat_level": "spicy",
  "source_page": "/books",
  "button_type": "kindle_unlimited",
  "value": 0,
  "currency": "USD"
}
```

### 4. goodreads_click
**Trigger**: When user clicks Goodreads button
**Purpose**: Track social proof engagement
**Business Value**: Measure cross-platform engagement

**Parameters**:
```json
{
  "book_title": "Captive of the Cerastean Prince",
  "book_asin": "B0123456789",
  "series": "Cerastean Empire",
  "author": "Dane Griggs",
  "button_type": "goodreads",
  "value": 0.50,
  "currency": "USD"
}
```

## Newsletter Marketing Events

### 1. newsletter_signup
**Trigger**: Successful newsletter subscription
**Purpose**: Track email list growth
**Business Value**: Primary conversion metric for lead generation

**Parameters**:
```json
{
  "form_location": "header",
  "value": 1.00,
  "currency": "USD"
}
```

**Form Locations**:
- `header` - Main navigation newsletter CTA
- `hero` - Homepage hero section
- `sidebar` - Blog/content sidebar
- `footer` - Site footer
- `exit-intent` - Exit intent popup
- `mobile` - Mobile-specific CTAs

### 2. engagement_navigation
**Trigger**: When user interacts with navigation elements
**Purpose**: Track user journey and engagement patterns
**Business Value**: Optimize site structure and content discovery

**Parameters**:
```json
{
  "engagement_type": "navigation",
  "page_title": "Species: Cerastean",
  "value": 0.50,
  "currency": "USD"
}
```

**Use Cases**:
- Newsletter CTA clicks
- Species badge clicks
- Menu navigation
- Internal link clicks

### 3. engagement_search
**Trigger**: When user performs site search
**Purpose**: Track search behavior and content discovery
**Business Value**: Understand user intent and content gaps

**Parameters**:
```json
{
  "engagement_type": "search",
  "page_title": "Search: alien romance",
  "value": 0.50,
  "currency": "USD"
}
```

### 4. engagement_newsletter_error
**Trigger**: When newsletter signup fails
**Purpose**: Track and optimize signup flow
**Business Value**: Identify and fix conversion barriers

**Parameters**:
```json
{
  "engagement_type": "newsletter_error",
  "page_title": "Newsletter Error - header",
  "value": 0,
  "currency": "USD"
}
```

## Enhanced E-commerce Events

### Enhanced Purchase Event
**Purpose**: Detailed purchase tracking with full product data
**Triggers**: Combined with book_purchase events

```json
{
  "event_name": "purchase",
  "transaction_id": "book_1704123456789",
  "value": 4.99,
  "currency": "USD",
  "items": [{
    "item_id": "B0123456789",
    "item_name": "Captive of the Cerastean Prince",
    "item_category": "Book",
    "item_category2": "Cerastean Empire",
    "item_variant": "Digital",
    "price": 4.99,
    "quantity": 1
  }]
}
```

## Event Values and Conversion Tracking

### Value Assignment Strategy
Events are assigned monetary values to enable ROI tracking:

- **Book Purchase**: Actual book price (e.g., $4.99)
- **Newsletter Signup**: $1.00 (lead value)
- **Book View**: $0.50 (engagement value)
- **Kindle Unlimited**: $0 (no direct revenue)
- **General Engagement**: $0.50 (brand value)

### Conversion Goals
Primary conversions tracked:
1. **Book Purchases** - Direct revenue
2. **Newsletter Signups** - Lead generation
3. **Kindle Unlimited Clicks** - Platform engagement

## Parameter Definitions

### Book-Specific Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `book_title` | string | Full book title | "Captive of the Cerastean Prince" |
| `book_asin` | string | Amazon Standard Identification Number | "B0123456789" |
| `series` | string | Book series name | "Cerastean Empire" |
| `series_order` | number | Book number in series | 1 |
| `author` | string | Book author | "Dane Griggs" |
| `species` | array | Alien species featured | ["cerastean", "human"] |
| `heat_level` | string | Romance heat level | "mild", "medium", "spicy" |
| `button_type` | string | Action button clicked | "buy", "kindle_unlimited", "view_book" |
| `source_page` | string | Page where interaction occurred | "/books", "/series/cerastean-empire" |

### Universal Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `value` | number | Monetary value in USD | 4.99 |
| `currency` | string | Currency code | "USD" |
| `engagement_type` | string | Type of engagement | "navigation", "search" |
| `form_location` | string | Newsletter form location | "header", "footer" |
| `page_title` | string | Current page title | "Book Title - Dane Griggs" |

## Custom Dimensions and Metrics

### Recommended Custom Dimensions
Set up in GA4 for enhanced analysis:

1. **Book Series** (book_series)
2. **Alien Species** (alien_species)
3. **Heat Level** (heat_level)
4. **Form Location** (form_location)
5. **Button Type** (button_type)

### Calculated Metrics
- **Book Engagement Rate**: view_book events / page_views
- **Purchase Conversion Rate**: book_purchase events / view_book events
- **Newsletter Conversion Rate**: newsletter_signup / page_views
- **Average Book Value**: Total purchase value / book_purchase events

## Implementation Notes

### Code Organization
Events are centrally managed in `/src/lib/analytics.ts`:
- Type-safe interfaces for all events
- Consistent parameter validation
- Debugging support in development

### Privacy Compliance
- All tracking respects Consent Mode v2
- No personal data in event parameters
- GDPR-compliant consent management
- Users can opt-out at any time

### Performance Considerations
- Events use `transport_type: 'beacon'` for reliability
- Minimal performance impact on page load
- Async loading of analytics library
- Fallback handling for blocked requests

## Reporting and Analysis

### Key Reports to Monitor

1. **Book Performance Report**
   - Most viewed books
   - Conversion rates by book
   - Series performance comparison

2. **Newsletter Funnel Analysis**
   - CTA click rates by location
   - Signup conversion rates
   - Error rate analysis

3. **User Journey Analysis**
   - Page flow from book discovery to purchase
   - Drop-off points in conversion funnel
   - Cross-series reading patterns

4. **Species Interest Analysis**
   - Most popular alien species
   - Species impact on engagement
   - Reader preference trends

### Custom Exploration Ideas

1. **Cohort Analysis**: Track reader behavior over time
2. **Funnel Analysis**: Book discovery → view → purchase
3. **Path Analysis**: Most common user journeys
4. **Attribution Analysis**: Which marketing drives best conversions

---

**Last Updated**: January 2025  
**Version**: 1.0  
**Maintained By**: Analytics Implementation Team