import type { APIRoute } from 'astro';

interface SubscribeRequest {
  email: string;
  name: string;
  source?: string;
}

interface MailchimpResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Get environment variables
    const API_KEY = import.meta.env.MAILCHIMP_API_KEY;
    const LIST_ID = import.meta.env.MAILCHIMP_LIST_ID;
    const SERVER_REGION = import.meta.env.MAILCHIMP_SERVER_REGION;

    // Validate environment variables
    if (!API_KEY || !LIST_ID || !SERVER_REGION) {
      console.error('Missing Mailchimp configuration:', {
        hasApiKey: !!API_KEY,
        hasListId: !!LIST_ID,
        hasServerRegion: !!SERVER_REGION
      });
      
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Server configuration error. Please contact support.'
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse request body
    const body = await request.json() as SubscribeRequest;
    
    // Validate input
    if (!body.email || !body.name) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Email and name are required.'
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Please enter a valid email address.'
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Prepare Mailchimp API request
    const mailchimpUrl = `https://${SERVER_REGION}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;
    
    const mailchimpData = {
      email_address: body.email,
      status: 'subscribed', // Use 'pending' for double opt-in
      merge_fields: {
        FNAME: body.name.split(' ')[0] || '',
        LNAME: body.name.split(' ').slice(1).join(' ') || ''
      },
      tags: body.source ? [body.source] : ['website-signup']
    };

    // Make request to Mailchimp
    const mailchimpResponse = await fetch(mailchimpUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mailchimpData)
    });

    const responseData = await mailchimpResponse.json();

    if (mailchimpResponse.ok) {
      // Success
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Successfully subscribed! Check your email for confirmation.'
        }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } else {
      // Handle specific Mailchimp errors
      let errorMessage = 'Subscription failed. Please try again.';
      
      if (responseData.title === 'Member Exists') {
        errorMessage = 'This email is already subscribed to our newsletter.';
      } else if (responseData.title === 'Invalid Resource') {
        errorMessage = 'Invalid email address format.';
      } else if (responseData.detail) {
        // Log the full error for debugging but don't expose to user
        console.error('Mailchimp API Error:', responseData);
        errorMessage = 'There was a problem with your subscription. Please try again.';
      }

      return new Response(
        JSON.stringify({
          success: false,
          error: errorMessage
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

  } catch (error) {
    console.error('Subscription error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'An unexpected error occurred. Please try again later.'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};