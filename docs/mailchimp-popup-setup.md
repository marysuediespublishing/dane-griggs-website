# Mailchimp Popup Setup for Static Site

## Overview
Since the site is now static (for GitHub Pages), we use Mailchimp's native popup forms instead of server-side API integration.

## Setup Instructions

### 1. Create Popup Form in Mailchimp
1. Log into Mailchimp
2. Go to **Audience → Signup forms → Subscriber pop-up**
3. Design your popup:
   - Choose fields (email, name, etc.)
   - Set colors to match your brand
   - Add your logo
   - Write compelling copy
   - Configure success message

### 2. Configure Display Rules
In the popup builder, set:
- **Display timing**: When to show (immediately, after X seconds, on exit intent)
- **Display frequency**: How often to show to same visitor
- **Page targeting**: Which pages to show/hide the popup
- **Mobile settings**: Enable/disable on mobile

### 3. Get Your Script Code
1. Click "View Code" or "Publish"
2. You'll get a script like:
```html
<script id="mcjs">!function(c,h,i,m,p){m=c.createElement(h),p=c.getElementsByTagName(h)[0],m.async=1,m.src=i,p.parentNode.insertBefore(m,p)}(document,"script","https://chimpstatic.com/mcjs-connected/js/users/abc123def456/789ghi012jkl.js");</script>
```

3. From the URL, extract:
   - USER_ID: `abc123def456`
   - FORM_ID: `789ghi012jkl`

### 4. Add to Environment Variables
Add to your `.env` file:
```env
PUBLIC_MAILCHIMP_USER_ID=abc123def456
PUBLIC_MAILCHIMP_FORM_ID=789ghi012jkl
```

### 5. Deploy
The popup will automatically load on all pages and follow your Mailchimp configuration.

## Features
- ✅ Works on static sites (GitHub Pages)
- ✅ No server required
- ✅ GDPR compliant
- ✅ Mobile responsive
- ✅ A/B testing available in Mailchimp
- ✅ Analytics tracked in Mailchimp

## Alternative: Keep Custom Modal
If you prefer the custom modal design, you can:
1. Use a form service like FormSpree or Getform
2. Deploy to Netlify/Vercel for serverless functions
3. Use Mailchimp's embedded form (non-popup)

## Testing
1. Clear cookies/localStorage to reset popup display
2. Use incognito mode to test as new visitor
3. Check mobile responsiveness
4. Verify analytics tracking