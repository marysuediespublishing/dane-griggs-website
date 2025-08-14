# Analytics Tracking Documentation

## Overview

This website implements comprehensive analytics tracking using Google Analytics 4 (GA4) and Meta Pixel with full GDPR compliance and iOS 14.5+ support.

## Quick Start

### 1. Environment Configuration

Add the following to your `.env` file:

```env
# Google Analytics
GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Meta Pixel
META_PIXEL_ID=XXXXXXXXXXXXXXX

# Optional: Meta Conversions API
META_ACCESS_TOKEN=your_access_token_here
META_TEST_EVENT_CODE=TEST12345  # For testing only
```

### 2. Verify Installation

1. **Development Testing**:
   ```bash
   npm run dev
   # Open browser with DevTools Network tab
   # Look for requests to google-analytics.com and facebook.com
   ```

2. **Production Testing**:
   ```bash
   npm run build
   npm run preview
   ```

## Custom Events

### Book Marketing Events

| Event Name | GA4 Event | Meta Event | Trigger | Conversion Value |
|------------|-----------|------------|---------|------------------|
| View Book | `view_item` | `ViewContent` | Book page load or card click | - |
| Click Amazon | `select_item` | `InitiateCheckout` | Amazon button click | $2.99-$14.99 |
| Click Kindle Unlimited | `kindle_unlimited_click` | `CustomEvent` | KU button click | $0.50 |
| Newsletter Signup | `generate_lead` | `Lead` | Email submission | $1.00 |
| View Series | `view_item_list` | `ViewContent` | Series page view | - |
| View Species | `view_category` | `ViewContent` | Species page view | - |
| Search Books | `search` | `Search` | Search submission | - |

### Event Parameters

#### Book Events
```javascript
{
  item_id: "ASIN",           // Amazon ASIN
  item_name: "Book Title",
  item_category: "Series Name",
  item_category2: "Species",
  item_category3: "Heat Level",
  price: 14.99,
  currency: "USD"
}
```

#### Newsletter Events
```javascript
{
  method: "website_footer",  // or "popup", "sidebar"
  value: 1.00,
  currency: "USD"
}
```

## Testing Procedures

### 1. Consent Flow Testing

#### Test: No Tracking Before Consent
```bash
# In Chrome DevTools
1. Open Network tab
2. Filter by "collect" (GA4) and "tr" (Meta)
3. Load website in Incognito
4. Verify NO requests until consent given
```

#### Test: Selective Consent
```bash
# Analytics Only
1. Click "Customize" on consent banner
2. Enable Analytics, disable Marketing
3. Save preferences
4. Verify only GA4 requests appear

# Marketing Only  
1. Customize consent
2. Disable Analytics, enable Marketing
3. Verify only Meta Pixel fires
```

### 2. GA4 DebugView Testing

1. **Enable Debug Mode**:
   - Install [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
   - Or add `?gtm_debug=true` to URL

2. **Open DebugView**:
   - GA4 Property → Configure → DebugView
   - Events appear in real-time

3. **Verify Events**:
   - ✅ page_view on load
   - ✅ user_engagement periodically
   - ✅ Custom events with parameters

### 3. Meta Events Manager Testing

1. **Install Meta Pixel Helper**:
   - [Chrome Extension](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)

2. **Test Event Flow**:
   ```
   PageView → ViewContent → InitiateCheckout → Purchase
   ```

3. **Verify in Events Manager**:
   - Business Manager → Events Manager → Your Pixel
   - Check "Test Events" tab
   - Verify event parameters and values

### 4. Cross-Browser Testing

Run automated tests:
```bash
npm run test:e2e -- tests/e2e/analytics-tracking.spec.ts
```

Manual testing checklist:

| Browser | Extensions | Strict Mode | Expected Result |
|---------|------------|-------------|-----------------|
| Chrome | AdBlock | No | Consent works, tracking after accept |
| Safari | None | Yes | ITP handled, tracking works |
| Firefox | uBlock | Yes | Consent required, respects choice |
| Edge | None | No | Full functionality |
| Mobile Safari | - | - | iOS compliance active |
| Chrome Mobile | - | - | Full functionality |

## Troubleshooting

### Common Issues

#### 1. "GA4 not firing"
- Check GA_MEASUREMENT_ID format (G-XXXXXXXXXX)
- Verify consent granted for analytics
- Check browser extensions blocking
- Test in Incognito mode

#### 2. "Meta Pixel blocked"
- Verify META_PIXEL_ID is numeric
- Check marketing consent granted
- Disable Facebook Container extension
- Clear cookies and retry

#### 3. "Events not showing in DebugView"
- Enable debug mode properly
- Check event names (no spaces, lowercase)
- Verify parameters are valid
- Wait 1-2 minutes for processing

#### 4. "Consent banner keeps appearing"
- Check localStorage not blocked
- Verify no JavaScript errors
- Test cookie persistence
- Check privacy settings

### Debug Commands

```javascript
// Console commands for debugging

// Check consent state
JSON.parse(localStorage.getItem('cookie-consent'))

// Check GA4 initialization
typeof gtag !== 'undefined'

// Check Meta Pixel
typeof fbq !== 'undefined'

// View dataLayer
window.dataLayer

// Trigger test event
gtag('event', 'test_event', { test_param: 'test_value' })

// Check Meta Pixel events
fbq('track', 'Test')
```

## Privacy & Compliance

### GDPR Compliance
- ✅ Explicit consent required before tracking
- ✅ Granular consent options (Analytics vs Marketing)
- ✅ Consent withdrawal supported
- ✅ Data retention controls in GA4/Meta

### iOS 14.5+ Compliance
- ✅ No tracking before consent (ATT compliance)
- ✅ Limited event types (8 events maximum)
- ✅ Value optimization configured
- ✅ Aggregated Event Measurement ready

### Cookie Usage
| Cookie | Purpose | Duration | Category |
|--------|---------|----------|----------|
| `_ga` | GA4 user ID | 2 years | Analytics |
| `_ga_*` | GA4 session | 2 years | Analytics |
| `_fbp` | Meta browser ID | 90 days | Marketing |
| `_fbc` | Meta click ID | 90 days | Marketing |
| `cookie-consent` | User preferences | 365 days | Necessary |

## Conversion Tracking Setup

### GA4 Conversions
1. GA4 → Configure → Conversions
2. Mark events as conversions:
   - `generate_lead` (Newsletter)
   - `purchase` (Book sales)
   - `kindle_unlimited_click` (KU engagement)

### Meta Conversions
1. Events Manager → Your Pixel → Settings
2. Configure Aggregated Event Measurement:
   - Priority 1: Purchase
   - Priority 2: InitiateCheckout
   - Priority 3: Lead
   - Priority 4: ViewContent

## Performance Monitoring

### Page Load Impact
- GA4 script: ~28KB gzipped
- Meta Pixel: ~44KB gzipped
- Consent banner: ~5KB
- Total: ~77KB (lazy loaded after consent)

### Best Practices
1. **Batch Events**: Group related events
2. **Debounce Scroll**: Limit engagement events
3. **Lazy Load**: Scripts load after consent
4. **Cache Control**: 7-day browser caching

## Integration with Marketing

### Google Ads
- Link GA4 property to Google Ads
- Import conversions for Smart Bidding
- Create audiences for remarketing

### Meta Ads
- Verify domain in Business Manager
- Set up Conversions API (optional)
- Create Custom Audiences from pixel data
- Use Value Optimization for book campaigns

## Maintenance

### Monthly Tasks
- [ ] Review consent acceptance rate
- [ ] Check for new browser warnings
- [ ] Verify events still firing correctly
- [ ] Update conversion values if needed

### Quarterly Tasks
- [ ] Audit custom events usage
- [ ] Review privacy policy alignment
- [ ] Test new browser versions
- [ ] Update iOS compliance if needed

## Support

For issues or questions:
1. Check browser console for errors
2. Review this documentation
3. Test in GA4 DebugView
4. Verify in Meta Events Manager

## Event Flow Diagram

```
User Lands → Consent Banner → User Chooses →
  ├─ Reject All → No Tracking
  ├─ Analytics Only → GA4 Only
  ├─ Marketing Only → Meta Only
  └─ Accept All → GA4 + Meta →
      ├─ Page View
      ├─ User Engagement
      ├─ Book Interactions
      ├─ Newsletter Signup
      └─ Purchase Events
```

## Version History

- v1.0.0 (2024-01-14): Initial implementation with GA4 and Meta Pixel
- Consent Mode v2 support
- iOS 14.5+ compliance
- Book marketing events