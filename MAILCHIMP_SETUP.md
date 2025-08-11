# Mailchimp Integration Setup Guide

## Overview
Your newsletter signup modal now integrates with Mailchimp to automatically add subscribers to your mailing list. This guide will help you configure the integration.

## Required Information

### 1. Mailchimp API Key
1. Log in to your Mailchimp account
2. Go to **Account** → **Extras** → **API Keys**
3. Create a new API key or copy an existing one
4. The format will be: `key-serverregion` (e.g., `abc123def456789-us19`)

### 2. List ID (Audience ID)
1. In Mailchimp, go to **Audience** → **All contacts**
2. Click on **Settings** → **Audience name and defaults**
3. Look for **Audience ID** (e.g., `1a2b3c4d5e`)

### 3. Server Region
This is the part after the dash in your API key (e.g., `us19`, `us6`, `us1`)

## Environment Variables Setup

### Local Development
1. Copy `.env.example` to `.env.local`
2. Fill in your Mailchimp credentials:

```env
MAILCHIMP_API_KEY=your_actual_api_key_here
MAILCHIMP_LIST_ID=your_actual_list_id_here  
MAILCHIMP_SERVER_REGION=us19
```

### Production Deployment (Vercel)
1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these three variables:
   - `MAILCHIMP_API_KEY`
   - `MAILCHIMP_LIST_ID` 
   - `MAILCHIMP_SERVER_REGION`

## Features

### Automatic Tagging
Subscribers are automatically tagged based on where they signed up:
- `newsletter-header` - Header "Free Books" button
- `newsletter-hero` - Main page call-to-action
- `newsletter-exit-intent` - Exit intent popup

### Error Handling
- Duplicate email detection
- Invalid email format validation
- Network error handling
- User-friendly error messages

### Security
- API key is never exposed to the client
- Server-side validation
- Rate limiting protection

## Testing

### Test the Integration
1. Make sure your environment variables are set
2. Start your development server: `npm run dev`
3. Try signing up with a test email
4. Check your Mailchimp audience to confirm the subscriber was added

### Troubleshooting
- Check browser console for network errors
- Verify environment variables are set correctly
- Ensure your API key has proper permissions
- Confirm your List ID is correct

## Customization Options

### Double Opt-in
To enable double opt-in (recommended for GDPR compliance):
1. In `src/pages/api/subscribe.ts`
2. Change `status: 'subscribed'` to `status: 'pending'`
3. Configure welcome email in Mailchimp

### Additional Fields
You can add custom merge fields in Mailchimp and modify the API call in `subscribe.ts`:

```typescript
merge_fields: {
  FNAME: body.name.split(' ')[0] || '',
  LNAME: body.name.split(' ').slice(1).join(' ') || '',
  // Add custom fields here
  WEBSITE: 'danegriggs.com'
}
```

## Next Steps
1. Set up your environment variables
2. Test the integration
3. Configure welcome emails in Mailchimp
4. Consider setting up automation sequences

## Support
If you encounter issues:
1. Check the browser console for error messages
2. Verify all environment variables are set
3. Test your API key directly in Mailchimp's API playground
4. Ensure your server region matches your API key