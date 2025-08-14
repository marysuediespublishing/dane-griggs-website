# Meta Pixel Testing & Verification Guide
## Dane Griggs Author Website

### Overview
This guide walks through testing the Meta Pixel implementation to ensure proper tracking of book marketing events with iOS 14.5+ compliance.

---

## Prerequisites

### 1. Environment Setup
Ensure these variables are configured in your `.env` file:
```bash
# Required
PUBLIC_META_PIXEL_ID=your_meta_pixel_id_here

# Optional (for Conversions API)
META_ACCESS_TOKEN=your_meta_access_token_here
META_TEST_EVENT_CODE=your_test_event_code_here

# Conversion Values
PUBLIC_META_BOOK_PURCHASE_VALUE=4.99
PUBLIC_META_KU_CLICK_VALUE=2.50
PUBLIC_META_NEWSLETTER_VALUE=1.00
PUBLIC_META_ENGAGEMENT_VALUE=0.25
```

### 2. Access Requirements
- Meta Business Manager access
- Events Manager access for your pixel
- Meta Pixel Helper browser extension (Chrome/Edge)

---

## Testing Procedure

### Phase 1: Browser Extension Testing

#### Install Meta Pixel Helper
1. Go to Chrome Web Store
2. Search "Meta Pixel Helper"
3. Install the official Meta extension
4. Pin the extension to your toolbar

#### Test Pixel Loading
1. Open website in incognito mode
2. Click the Meta Pixel Helper extension
3. **Expected Result**: Pixel should load but show "Consent revoked" status
4. **Verify**: No events should fire before consent

#### Test Consent Flow
1. Accept marketing cookies in consent banner
2. Check Meta Pixel Helper again
3. **Expected Result**: 
   - Pixel status changes to "Consent granted"
   - PageView event fires automatically
   - Event shows proper parameters

---

### Phase 2: Events Manager Verification

#### Access Events Manager
1. Go to [business.facebook.com](https://business.facebook.com)
2. Navigate to "Events Manager"
3. Select your pixel
4. Click "Test Events" tab

#### Configure Test Event Code (Development Only)
1. In Events Manager, click "Generate Test Event Code"
2. Copy the code to your `.env` file as `META_TEST_EVENT_CODE`
3. Restart your development server
4. Events will now appear in Test Events tab

#### Test Core Events

**PageView Event**
- **Trigger**: Accept cookies or visit any page
- **Expected Parameters**:
  ```json
  {
    "content_name": "Page Title",
    "content_category": "Book Marketing"
  }
  ```

**ViewContent Event**
- **Trigger**: View a book card or book detail page
- **Expected Parameters**:
  ```json
  {
    "content_ids": ["ASIN or book title"],
    "content_name": "Book Title",
    "content_type": "product",
    "content_category": "Series Name",
    "value": 0.25,
    "currency": "USD"
  }
  ```

**InitiateCheckout Event**
- **Trigger**: Click "Buy" button on book
- **Expected Parameters**:
  ```json
  {
    "content_ids": ["ASIN"],
    "content_name": "Book Title",
    "content_type": "product",
    "value": 4.99,
    "currency": "USD",
    "num_items": 1
  }
  ```

**Lead Event**
- **Trigger**: Newsletter signup
- **Expected Parameters**:
  ```json
  {
    "content_name": "Newsletter Signup",
    "content_category": "Lead Generation",
    "value": 1.00,
    "currency": "USD"
  }
  ```

**Custom Events**
- **KindleUnlimitedClick**: When user clicks KU button
- **BookPurchase**: For actual purchase tracking
- **Search**: Site search functionality

---

### Phase 3: Event Quality Verification

#### Check Event Match Quality
1. In Events Manager, go to "Diagnostics"
2. Click "Event Match Quality"
3. **Target Score**: 7.0+ (Good), 8.0+ (Excellent)
4. **Common Issues**:
   - Missing external_id (user identification)
   - Missing email/phone hashing
   - Inconsistent content_ids format

#### Verify iOS 14.5+ Compliance
1. Test on iOS Safari (14.5+)
2. Check that tracking requires explicit consent
3. Verify App Tracking Transparency compliance
4. **Expected**: No events fire until user grants tracking permission

---

### Phase 4: Aggregated Event Measurement Setup

#### Configure Event Priority (iOS 14.5+ Requirement)
1. Go to Events Manager > Aggregated Event Measurement
2. Select your domain
3. Configure these 8 priority events (in order):

| Priority | Event Name | Type | Purpose |
|----------|------------|------|---------|
| 1 | Purchase | Standard | Actual book purchases |
| 2 | InitiateCheckout | Standard | Buy button clicks |
| 3 | Lead | Standard | Newsletter signups |
| 4 | ViewContent | Standard | Book page views |
| 5 | Search | Standard | Site search |
| 6 | PageView | Standard | General page views |
| 7 | KindleUnlimitedClick | Custom | KU engagement |
| 8 | Contact | Standard | Contact form |

#### Verify Domain Verification
1. Ensure domain is verified in Business Manager
2. Check SSL certificate is valid
3. Confirm pixel is associated with correct domain

---

## Troubleshooting Common Issues

### Pixel Not Loading
**Symptoms**: Extension shows "No pixel found"
**Solutions**:
- Check `PUBLIC_META_PIXEL_ID` in environment
- Verify pixel ID format (numeric only)
- Clear browser cache and cookies
- Check browser console for JavaScript errors

### Events Not Firing
**Symptoms**: No events in Test Events or Pixel Helper
**Solutions**:
- Verify consent has been granted
- Check browser console for errors
- Ensure analytics consent is enabled
- Test in incognito mode with fresh session

### iOS Tracking Issues
**Symptoms**: Events missing on iOS devices
**Solutions**:
- Verify iOS 14.5+ compliance implementation
- Check App Tracking Transparency consent
- Test with different iOS browsers
- Review consent banner on mobile

### Low Event Match Quality
**Symptoms**: Match quality score below 6.0
**Solutions**:
- Implement enhanced matching parameters
- Add customer information parameters
- Use consistent content_ids format
- Enable Conversions API for server-side data

---

## Production Verification Checklist

### Before Launch
- [ ] Pixel ID correctly configured
- [ ] Test events working in development
- [ ] Consent flow tested thoroughly
- [ ] iOS 14.5+ compliance verified
- [ ] Event parameters validated
- [ ] Domain verification complete
- [ ] Aggregated Event Measurement configured

### Post-Launch Monitoring
- [ ] Events appearing in Events Manager
- [ ] Event match quality score acceptable
- [ ] iOS tracking working properly
- [ ] Conversion data flowing to ads
- [ ] No JavaScript errors in console
- [ ] GDPR/CCPA compliance maintained

---

## Advanced Configuration

### Conversions API Setup
For enhanced tracking and better iOS 14.5+ performance:

1. **Generate System User Token**:
   - Business Manager > Business Settings
   - System Users > Add
   - Generate access token with ads_management permissions

2. **Implement Server-Side Events**:
   - Send duplicate events from your server
   - Use same event_id for deduplication
   - Include enhanced customer matching data

3. **Test Deduplication**:
   - Verify events aren't counted twice
   - Check Event Match Quality improvements

### Enhanced Customer Matching
Add these parameters when available:
```javascript
user_data: {
  em: hashedEmail,          // SHA256 hashed email
  ph: hashedPhone,          // SHA256 hashed phone
  fn: hashedFirstName,      // SHA256 hashed first name  
  ln: hashedLastName,       // SHA256 hashed last name
  external_id: hashedUserId // SHA256 hashed user ID
}
```

---

## Support Resources

### Meta Documentation
- [Meta Pixel Setup Guide](https://developers.facebook.com/docs/facebook-pixel)
- [iOS 14.5+ Changes](https://developers.facebook.com/docs/marketing-api/ios14)
- [Conversions API](https://developers.facebook.com/docs/marketing-api/conversions-api)

### Testing Tools
- [Meta Pixel Helper Extension](https://chrome.google.com/webstore/detail/meta-pixel-helper)
- [Events Manager Test Events](https://business.facebook.com/events_manager2/test_events)
- [Facebook Developer Tools](https://developers.facebook.com/tools/)

### Common Error Codes
- **1006**: Invalid pixel ID
- **1010**: Consent revoked
- **2001**: Invalid event parameters
- **9001**: Network connectivity issues

---

## Next Steps

After successful testing:
1. Remove test event code from production
2. Monitor event quality in Events Manager
3. Set up custom audiences based on events
4. Create conversion-optimized ad campaigns
5. Implement value optimization for book sales
6. Monitor iOS 14.5+ attribution changes

---

**Last Updated**: Implementation Date  
**Next Review**: Quarterly or when Meta updates requirements