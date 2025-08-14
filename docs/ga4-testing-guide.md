# GA4 Testing and Verification Guide
## Dane Griggs Author Website

This guide provides step-by-step instructions for testing and verifying the Google Analytics 4 implementation with Consent Mode v2.

## Prerequisites

1. **GA4 Property Setup**: Ensure you have a GA4 property configured
2. **Measurement ID**: Update `PUBLIC_GA_MEASUREMENT_ID` in `.env` with your actual measurement ID
3. **Browser Extensions**: Install Google Analytics Debugger (optional but recommended)

## Testing Environment Setup

### 1. Local Development Testing

```bash
# Start the development server
npm run dev

# The site will be available at http://localhost:4321
# GA4 debug mode is automatically enabled in development
```

### 2. Environment Variables

Verify your `.env` file contains:
```env
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX  # Your actual measurement ID
PUBLIC_GA_BOOK_PURCHASE_VALUE=4.99
PUBLIC_GA_NEWSLETTER_VALUE=1.00
PUBLIC_GA_ENGAGEMENT_VALUE=0.50
```

## Testing Checklist

### ✅ Initial Page Load Testing

1. **Open Developer Tools** (F12)
2. **Navigate to Network Tab**
3. **Visit the website**
4. **Verify NO GA4 requests** are sent initially (due to consent mode)

**Expected Behavior:**
- Cookie consent banner appears
- No `google-analytics.com` or `googletagmanager.com` requests
- Console shows: "GA4 initialized with Consent Mode v2"

### ✅ Consent Mode Testing

#### Test 1: Accept All Cookies
1. Click "Accept All" on the consent banner
2. Check Network tab for GA4 requests
3. Verify page_view event is sent

**Expected Network Requests:**
- `https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`
- `https://www.google-analytics.com/g/collect` (page_view event)

#### Test 2: Reject All Cookies
1. Refresh the page
2. Click "Reject All" on the consent banner
3. Verify no tracking requests are sent

**Expected Behavior:**
- Banner disappears
- No analytics requests in Network tab
- Limited functionality tracking only

#### Test 3: Custom Preferences
1. Refresh the page
2. Click "Customize" on the consent banner
3. Toggle analytics cookies off/on
4. Save preferences
5. Verify tracking behavior matches selections

### ✅ Book Interaction Testing

#### Test Book Card Interactions
1. **Accept cookies** if not already done
2. **Click on a book card**
3. **Check Network tab** for custom events

**Expected Events:**
- `view_book` event with book parameters
- Parameters: `book_title`, `series`, `author`, `species`, etc.

#### Test Purchase/KU Buttons
1. **Click "Buy" or "Read Free on KU"** buttons
2. **Verify outbound click tracking**

**Expected Events:**
- `book_purchase` or `kindle_unlimited_click`
- `click` event for outbound links
- Proper book metadata in parameters

#### Test Goodreads Links
1. **Click Goodreads buttons**
2. **Verify tracking**

**Expected Events:**
- `goodreads_click` event
- Outbound link tracking

### ✅ Newsletter Testing

#### Test Newsletter Signup Flow
1. **Click any newsletter CTA**
2. **Fill out the form**
3. **Submit successfully**

**Expected Events:**
- CTA click: `engagement_navigation`
- Successful signup: `newsletter_signup`
- Conversion: `conversion` event

#### Test Newsletter Errors
1. **Submit form with invalid email**
2. **Verify error tracking**

**Expected Events:**
- `engagement_newsletter_error` event

### ✅ Search Testing

1. **Use the search box**
2. **Submit a search query**

**Expected Events:**
- `search` event with search term
- `engagement_search` event

### ✅ Species/Navigation Testing

1. **Click on species badges**
2. **Navigate between pages**

**Expected Events:**
- `engagement_navigation` events
- Proper page_view tracking on new pages

## GA4 DebugView Verification

### Access DebugView

1. **Open GA4 Property** (analytics.google.com)
2. **Navigate to**: Admin → DebugView
3. **Add debug parameter** to your local URL: `http://localhost:4321?_debug=1`
4. **Refresh the page**

### DebugView Testing

#### 1. Real-Time Event Monitoring
- Events should appear within seconds
- Each event shows detailed parameters
- Verify all custom parameters are passed correctly

#### 2. Event Parameter Validation

**Book Events Should Include:**
```json
{
  "book_title": "Book Title",
  "book_asin": "XXXXXXXXXX",
  "series": "Series Name",
  "author": "Dane Griggs",
  "species": ["cerastean", "kraken"],
  "heat_level": "spicy",
  "button_type": "buy",
  "value": 4.99,
  "currency": "USD"
}
```

**Newsletter Events Should Include:**
```json
{
  "form_location": "header",
  "value": 1.00,
  "currency": "USD"
}
```

#### 3. Conversion Tracking
- Purchase events show in Conversions section
- Newsletter signups tracked as conversions
- Values are properly assigned

### Browser Console Verification

Check for console messages:
```
[GA4] GA4 initialized with Consent Mode v2
[GA4] Consent granted - tracking enabled
[GA4] Book interaction tracked {action: "view_book", data: {...}}
[GA4] Newsletter signup tracked {...}
```

## Common Issues and Troubleshooting

### Issue: No Events in DebugView

**Possible Causes:**
1. Wrong measurement ID
2. Ad blockers interfering
3. Consent not granted
4. Debug parameter missing (`?_debug=1`)

**Solutions:**
1. Verify `PUBLIC_GA_MEASUREMENT_ID` in `.env`
2. Disable ad blockers
3. Accept cookies via consent banner
4. Add `?_debug=1` to URL

### Issue: Events Missing Parameters

**Possible Causes:**
1. TypeScript interface mismatch
2. Missing book data
3. Component not importing analytics correctly

**Solutions:**
1. Check browser console for errors
2. Verify book collection has required fields
3. Ensure analytics import paths are correct

### Issue: Consent Banner Not Appearing

**Possible Causes:**
1. React/React-DOM not loading
2. JavaScript errors preventing banner mount
3. CSS conflicts hiding banner

**Solutions:**
1. Check Network tab for React loading errors
2. Check Console for JavaScript errors
3. Inspect element to verify banner is in DOM

### Issue: Outbound Links Not Tracking

**Possible Causes:**
1. Links opening too quickly
2. Analytics not loaded before click
3. Event not firing before navigation

**Solutions:**
1. Add small delay before navigation
2. Ensure consent granted before link clicks
3. Use `transport_type: 'beacon'` for reliable delivery

## Production Testing

### Before Deploying

1. **Test with production GA4 property**
2. **Verify all events work correctly**
3. **Test across different browsers**
4. **Test on mobile devices**
5. **Verify GDPR compliance**

### After Deployment

1. **Monitor GA4 Real-time reports**
2. **Check for any console errors**
3. **Verify conversion tracking**
4. **Monitor for 24-48 hours**

### Performance Monitoring

- Page load times should remain under 2.5s
- GA4 script should not block rendering
- Cookie consent should not impact Core Web Vitals

## Continuous Monitoring

### Weekly Checks
- Review GA4 reports for data accuracy
- Check for any tracking errors
- Monitor conversion rates
- Verify book interaction data

### Monthly Reviews
- Analyze book performance metrics
- Review newsletter conversion rates
- Optimize tracking based on insights
- Update event parameters if needed

## Support and Documentation

- **GA4 Help**: https://support.google.com/analytics/
- **Consent Mode Documentation**: https://developers.google.com/tag-platform/gtagjs/consent
- **Debug View Guide**: https://support.google.com/analytics/answer/7201382

---

**Last Updated**: January 2025  
**Version**: 1.0  
**Author**: Claude Code Assistant