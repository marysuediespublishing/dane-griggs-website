/**
 * Unified Analytics Implementation with GA4 and Meta Pixel
 * For Dane Griggs Author Website
 * 
 * Features:
 * - Google Analytics 4 with Consent Mode v2
 * - Meta Pixel with iOS 14.5+ compliance
 * - Book marketing events optimization
 * - Enhanced conversions
 * - Debug mode support
 */

import { metaPixel, updateMetaConsent } from './meta-pixel';

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export interface BookInteractionEvent {
  book_title: string;
  book_asin?: string;
  series?: string;
  series_order?: number;
  button_type?: 'buy' | 'kindle_unlimited' | 'view_book' | 'translation' | 'goodreads' | 'sample';
  value?: number;
  currency?: string;
  source_page?: string;
  author?: string;
  species?: string[];
  heat_level?: string;
}

export interface NewsletterEvent {
  form_location: string;
  value?: number;
  currency?: string;
}

export interface EngagementEvent {
  engagement_type: 'scroll' | 'time_on_page' | 'navigation' | 'search' | 'newsletter_error';
  value?: number;
  currency?: string;
  page_title?: string;
}

class Analytics {
  private measurementId: string;
  private isInitialized: boolean = false;
  private consentGranted: boolean = false;
  private debug: boolean = false;

  constructor() {
    this.measurementId = import.meta.env.PUBLIC_GA_MEASUREMENT_ID || '';
    this.debug = import.meta.env.MODE === 'development';
    
    if (!this.measurementId || this.measurementId === 'G-XXXXXXXXXX') {
      console.warn('GA4: Measurement ID not configured');
      return;
    }

    this.initializeGoogleAnalytics();
  }

  private initializeGoogleAnalytics(): void {
    if (typeof window === 'undefined') return;

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };

    // Configure Consent Mode v2 BEFORE loading gtag
    window.gtag('consent', 'default', {
      'analytics_storage': 'denied',
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied',
      'functionality_storage': 'granted',
      'security_storage': 'granted',
      'wait_for_update': 2000,
    });

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
    document.head.appendChild(script);

    script.onload = () => {
      window.gtag('js', new Date());
      
      // Configure GA4 with enhanced settings
      window.gtag('config', this.measurementId, {
        // Don't send page_view automatically - wait for consent
        send_page_view: false,
        // Enhanced measurement settings
        enhanced_measurement: {
          scrolls: true,
          outbound_clicks: true,
          site_search: true,
          video_engagement: true,
          file_downloads: true,
        },
        // Custom parameters for book marketing
        custom_map: {
          'custom_parameter_1': 'book_title',
          'custom_parameter_2': 'series',
          'custom_parameter_3': 'author',
        },
        // Debug mode in development
        debug_mode: this.debug,
        // Cookie settings
        cookie_flags: 'SameSite=None;Secure',
        // Anonymize IP (GDPR compliance)
        anonymize_ip: true,
      });

      this.isInitialized = true;
      this.log('GA4 initialized with Consent Mode v2');
    };
  }

  /**
   * Update consent state when user accepts/rejects cookies
   * Updates both GA4 and Meta Pixel consent
   */
  public updateConsent(granted: boolean): void {
    if (typeof window === 'undefined' || !this.isInitialized) return;

    this.consentGranted = granted;

    // Update GA4 consent
    window.gtag('consent', 'update', {
      'analytics_storage': granted ? 'granted' : 'denied',
      'ad_storage': granted ? 'granted' : 'denied',
      'ad_user_data': granted ? 'granted' : 'denied',
      'ad_personalization': granted ? 'granted' : 'denied',
    });

    // Update Meta Pixel consent
    updateMetaConsent(granted);

    if (granted) {
      // Send initial page view after consent is granted
      this.trackPageView();
      this.log('Consent granted - GA4 and Meta Pixel tracking enabled');
    } else {
      this.log('Consent denied - limited tracking only');
    }
  }

  /**
   * Track page views (only after consent)
   * Sends to both GA4 and Meta Pixel
   */
  public trackPageView(title?: string, path?: string): void {
    if (!this.consentGranted || typeof window === 'undefined') return;

    // Send to GA4
    window.gtag('event', 'page_view', {
      page_title: title || document.title,
      page_location: window.location.href,
      page_path: path || window.location.pathname,
    });

    // Send to Meta Pixel
    metaPixel.trackPageView({
      content_name: title || document.title,
      content_category: 'Book Marketing',
    });

    this.log('Page view tracked to GA4 and Meta Pixel', { title, path });
  }

  /**
   * Track book interactions (views, purchases, etc.)
   * Sends to both GA4 and Meta Pixel with appropriate events
   */
  public trackBookInteraction(action: string, data: BookInteractionEvent): void {
    if (!this.consentGranted || typeof window === 'undefined') return;

    const eventData = {
      ...data,
      currency: data.currency || 'USD',
      value: data.value || this.getDefaultValue('book_interaction'),
      source_page: data.source_page || window.location.pathname,
      author: data.author || 'Dane Griggs',
    };

    // Send to GA4
    window.gtag('event', action, eventData);

    // Send to Meta Pixel with appropriate event type
    if (action.includes('view') || action === 'view_book') {
      metaPixel.trackViewContent(data);
    } else if (action.includes('purchase') || action.includes('buy')) {
      // For purchase clicks (not actual purchases)
      if (action.includes('click') || action.includes('initiate')) {
        metaPixel.trackInitiateCheckout(data);
      } else {
        // Actual purchase
        metaPixel.trackPurchase(data);
      }
      
      // Also send GA4 purchase event for actual purchases
      if (!action.includes('click') && !action.includes('initiate')) {
        window.gtag('event', 'purchase', {
          transaction_id: `book_${Date.now()}`,
          value: eventData.value,
          currency: eventData.currency,
          items: [{
            item_id: data.book_asin || data.book_title,
            item_name: data.book_title,
            category: 'Book',
            category2: data.series || 'Standalone',
            quantity: 1,
            price: eventData.value,
          }]
        });
      }
    } else if (action === 'kindle_unlimited_click') {
      metaPixel.trackCustomEvent('KindleUnlimitedClick', data);
    } else {
      // Other custom events
      metaPixel.trackCustomEvent(action, data);
    }

    this.log('Book interaction tracked to GA4 and Meta Pixel', { action, data: eventData });
  }

  /**
   * Track newsletter signups
   * Sends to both GA4 and Meta Pixel as Lead events
   */
  public trackNewsletterSignup(data: NewsletterEvent): void {
    if (!this.consentGranted || typeof window === 'undefined') return;

    const eventData = {
      ...data,
      currency: data.currency || 'USD',
      value: data.value || this.getDefaultValue('newsletter'),
    };

    // Send to GA4
    window.gtag('event', 'newsletter_signup', eventData);
    window.gtag('event', 'conversion', {
      send_to: this.measurementId,
      value: eventData.value,
      currency: eventData.currency,
    });

    // Send to Meta Pixel as Lead event
    metaPixel.trackLead(data);

    this.log('Newsletter signup tracked to GA4 and Meta Pixel', eventData);
  }

  /**
   * Track general engagement events
   */
  public trackEngagement(data: EngagementEvent): void {
    if (!this.consentGranted || typeof window === 'undefined') return;

    const eventData = {
      ...data,
      currency: data.currency || 'USD',
      value: data.value || this.getDefaultValue('engagement'),
      page_title: data.page_title || document.title,
    };

    // Send to GA4
    window.gtag('event', `engagement_${data.engagement_type}`, eventData);

    // Send search events to Meta Pixel
    if (data.engagement_type === 'search') {
      // Extract search term from eventData if available
      const searchTerm = (data as any).search_term || '';
      if (searchTerm) {
        metaPixel.trackSearch(searchTerm);
      }
    }

    this.log('Engagement tracked', eventData);
  }

  /**
   * Track outbound link clicks
   */
  public trackOutboundClick(url: string, linkText?: string): void {
    if (!this.consentGranted || typeof window === 'undefined') return;

    // Send to GA4
    window.gtag('event', 'click', {
      event_category: 'outbound',
      event_label: url,
      transport_type: 'beacon',
      link_text: linkText,
    });

    this.log('Outbound click tracked', { url, linkText });
  }

  /**
   * Track site search
   * Sends to both GA4 and Meta Pixel
   */
  public trackSearch(searchTerm: string, resultsCount?: number): void {
    if (!this.consentGranted || typeof window === 'undefined') return;

    // Send to GA4
    window.gtag('event', 'search', {
      search_term: searchTerm,
      results_count: resultsCount,
    });

    // Send to Meta Pixel
    metaPixel.trackSearch(searchTerm, resultsCount);

    this.log('Search tracked to GA4 and Meta Pixel', { searchTerm, resultsCount });
  }

  /**
   * Track custom conversions
   */
  public trackConversion(conversionName: string, value?: number): void {
    if (!this.consentGranted || typeof window === 'undefined') return;

    // Send to GA4
    window.gtag('event', 'conversion', {
      send_to: `${this.measurementId}/${conversionName}`,
      value: value || 1,
      currency: 'USD',
    });

    this.log('Conversion tracked', { conversionName, value });
  }

  /**
   * Get default values from environment variables
   */
  private getDefaultValue(type: string): number {
    const values = {
      book_interaction: parseFloat(import.meta.env.PUBLIC_GA_BOOK_PURCHASE_VALUE) || 4.99,
      newsletter: parseFloat(import.meta.env.PUBLIC_GA_NEWSLETTER_VALUE) || 1.00,
      engagement: parseFloat(import.meta.env.PUBLIC_GA_ENGAGEMENT_VALUE) || 0.50,
    };

    return values[type as keyof typeof values] || 1.00;
  }

  /**
   * Debug logging
   */
  private log(message: string, data?: any): void {
    if (this.debug) {
      console.log(`[Analytics] ${message}`, data || '');
    }
  }

  /**
   * Check if analytics is ready and consent is granted
   */
  public isReady(): boolean {
    return this.isInitialized && this.consentGranted;
  }

  /**
   * Get current consent state
   */
  public hasConsent(): boolean {
    return this.consentGranted;
  }

  /**
   * Get analytics status for debugging
   */
  public getStatus(): {
    ga4: { initialized: boolean; consent: boolean };
    metaPixel: { initialized: boolean; consent: boolean; pendingEvents: number };
  } {
    return {
      ga4: {
        initialized: this.isInitialized,
        consent: this.consentGranted,
      },
      metaPixel: {
        initialized: metaPixel.isReady(),
        consent: metaPixel.hasConsent(),
        pendingEvents: metaPixel.getPendingEventsCount(),
      },
    };
  }
}

// Export singleton instance
export const analytics = new Analytics();

// Export initialization function
export const initializeAnalytics = () => {
  // Analytics auto-initializes on instantiation
  console.log('Analytics initialized');
};

// Export convenience functions that work with both GA4 and Meta Pixel
export const trackBookView = (book: BookInteractionEvent) => 
  analytics.trackBookInteraction('view_book', book);

export const trackBookPurchase = (book: BookInteractionEvent) => 
  analytics.trackBookInteraction('book_purchase', book);

export const trackBookPurchaseClick = (book: BookInteractionEvent) => 
  analytics.trackBookInteraction('book_purchase_click', book);

export const trackKindleUnlimited = (book: BookInteractionEvent) => 
  analytics.trackBookInteraction('kindle_unlimited_click', book);

export const trackNewsletterSignup = (data: NewsletterEvent) => 
  analytics.trackNewsletterSignup(data);

export const trackPageView = (title?: string, path?: string) => 
  analytics.trackPageView(title, path);

export const updateConsent = (granted: boolean) => 
  analytics.updateConsent(granted);

export const getAnalyticsStatus = () => 
  analytics.getStatus();

export default analytics;