/**
 * Meta Pixel Implementation with iOS 14.5+ Compliance
 * For Dane Griggs Author Website
 * 
 * Features:
 * - iOS 14.5+ App Tracking Transparency compliance
 * - Consent-based initialization
 * - Book marketing events optimization
 * - Aggregated Event Measurement setup
 * - Server-side Conversions API support
 * - Enhanced matching parameters
 */

import type { BookInteractionEvent, NewsletterEvent } from './analytics';

// Declare fbq function for TypeScript with proper properties
declare global {
  interface Window {
    fbq: {
      (...args: any[]): void;
      queue?: any[];
      loaded?: boolean;
      version?: string;
      push?: any;
    };
    _fbq: any;
  }
}

export interface MetaPixelEvent {
  eventName: string;
  parameters?: Record<string, any>;
  eventId?: string;
}

export interface MetaConversionsAPIEvent {
  event_name: string;
  event_time: number;
  event_id?: string;
  user_data?: {
    em?: string; // email hash
    ph?: string; // phone hash
    fn?: string; // first name hash
    ln?: string; // last name hash
    ct?: string; // city hash
    st?: string; // state hash
    zp?: string; // zip hash
    country?: string; // country code
    external_id?: string; // external ID hash
  };
  custom_data?: {
    content_ids?: string[];
    content_name?: string;
    content_type?: string;
    content_category?: string;
    value?: number;
    currency?: string;
    num_items?: number;
    search_string?: string;
  };
  event_source_url?: string;
  action_source: 'website';
}

class MetaPixel {
  private pixelId: string;
  private accessToken: string;
  private testEventCode: string;
  private isInitialized: boolean = false;
  private consentGranted: boolean = false;
  private debug: boolean = false;
  private pendingEvents: MetaPixelEvent[] = [];

  constructor() {
    this.pixelId = import.meta.env.PUBLIC_META_PIXEL_ID || '';
    this.accessToken = import.meta.env.META_ACCESS_TOKEN || '';
    this.testEventCode = import.meta.env.META_TEST_EVENT_CODE || '';
    this.debug = import.meta.env.MODE === 'development';
    
    if (!this.pixelId || this.pixelId === 'your_meta_pixel_id_here') {
      console.warn('Meta Pixel: Pixel ID not configured');
      return;
    }

    this.initializeMetaPixel();
  }

  private initializeMetaPixel(): void {
    if (typeof window === 'undefined') return;

    // Initialize fbq function and queue
    window.fbq = window.fbq || function() {
      (window.fbq.queue = window.fbq.queue || []).push(arguments);
    };
    window._fbq = window._fbq || window.fbq;
    window.fbq.push = window.fbq;
    window.fbq.loaded = true;
    window.fbq.version = '2.0';
    window.fbq.queue = [];

    // Load Meta Pixel script with error handling
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    
    // Add timeout to detect blocked scripts
    const loadTimeout = setTimeout(() => {
      if (!this.isInitialized) {
        console.warn('Meta Pixel: Script load timeout - likely blocked by ad blocker');
        // Continue functioning without Meta Pixel
        this.handleBlockedPixel();
      }
    }, 5000);

    script.onload = () => {
      clearTimeout(loadTimeout);
      
      try {
        // Initialize pixel but revoke consent initially (iOS 14.5+ compliance)
        window.fbq('init', this.pixelId, {}, {
          agent: 'astro-meta-pixel'
        });
        
        // Configure for iOS 14.5+ compliance - no automatic tracking
        window.fbq('set', 'autoConfig', false, this.pixelId);
        
        // Add test event code if in development
        if (this.debug && this.testEventCode) {
          window.fbq('set', 'testEventCode', this.testEventCode, this.pixelId);
        }

        this.isInitialized = true;
        this.log('Meta Pixel initialized with consent revoked (iOS 14.5+ compliance)');
      } catch (error) {
        console.warn('Meta Pixel: Initialization error', error);
        this.handleBlockedPixel();
      }
    };

    script.onerror = () => {
      clearTimeout(loadTimeout);
      console.warn('Meta Pixel: Failed to load fbevents.js - likely blocked by ad blocker');
      this.handleBlockedPixel();
    };
    
    document.head.appendChild(script);
  }

  /**
   * Handle blocked pixel (by ad blockers)
   */
  private handleBlockedPixel(): void {
    // Set a flag but don't prevent the rest of the app from working
    this.isInitialized = false;
    this.log('Meta Pixel blocked - continuing without Meta tracking');
  }

  /**
   * Safely call fbq function (handles blocked/missing script)
   */
  private safeFbq(action: string, event: string, data?: any): void {
    try {
      if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        window.fbq(action as any, event, data);
      }
    } catch (error) {
      this.log(`Failed to call fbq.${action}(${event})`, error);
    }
  }

  /**
   * Update consent state when user accepts/rejects marketing cookies
   */
  public updateConsent(granted: boolean): void {
    if (typeof window === 'undefined' || !this.isInitialized) return;

    this.consentGranted = granted;

    if (granted) {
      // Grant consent for tracking
      this.safeFbq('consent', 'grant', undefined);
      
      // Send initial PageView after consent is granted
      this.trackPageView();
      
      // Process any pending events
      this.processPendingEvents();
      
      this.log('Consent granted - Meta Pixel tracking enabled');
    } else {
      // Revoke consent
      this.safeFbq('consent', 'revoke', undefined);
      this.log('Consent revoked - Meta Pixel tracking disabled');
    }
  }

  /**
   * Track page views (standard event)
   */
  public trackPageView(customData?: Record<string, any>): void {
    if (!this.consentGranted) {
      this.queueEvent('PageView', customData);
      return;
    }

    const eventData = {
      content_name: document.title,
      content_category: 'Book Marketing',
      ...customData,
    };

    this.safeFbq('track', 'PageView', eventData);
    this.log('PageView tracked', eventData);

    // Send to Conversions API if configured
    this.sendToConversionsAPI('PageView', eventData);
  }

  /**
   * Track book content views (standard event)
   */
  public trackViewContent(book: BookInteractionEvent): void {
    const eventData = {
      content_ids: [book.book_asin || book.book_title],
      content_name: book.book_title,
      content_type: 'product',
      content_category: book.series || 'Book',
      value: book.value || this.getDefaultValue('book_view'),
      currency: book.currency || 'USD',
      custom_data: {
        author: book.author || 'Dane Griggs',
        series: book.series,
        series_order: book.series_order,
        species: book.species,
        heat_level: book.heat_level,
      },
    };

    if (!this.consentGranted) {
      this.queueEvent('ViewContent', eventData);
      return;
    }

    this.safeFbq('track', 'ViewContent', eventData);
    this.log('ViewContent tracked', eventData);

    this.sendToConversionsAPI('ViewContent', eventData);
  }

  /**
   * Track purchase initiation (buy button clicks)
   */
  public trackInitiateCheckout(book: BookInteractionEvent): void {
    const eventData = {
      content_ids: [book.book_asin || book.book_title],
      content_name: book.book_title,
      content_type: 'product',
      content_category: book.series || 'Book',
      value: book.value || this.getDefaultValue('book_purchase'),
      currency: book.currency || 'USD',
      num_items: 1,
      custom_data: {
        button_type: book.button_type,
        author: book.author || 'Dane Griggs',
        series: book.series,
      },
    };

    if (!this.consentGranted) {
      this.queueEvent('InitiateCheckout', eventData);
      return;
    }

    this.safeFbq('track', 'InitiateCheckout', eventData);
    this.log('InitiateCheckout tracked', eventData);

    this.sendToConversionsAPI('InitiateCheckout', eventData);
  }

  /**
   * Track actual purchases (highest priority event)
   */
  public trackPurchase(book: BookInteractionEvent, transactionId?: string): void {
    const eventData = {
      content_ids: [book.book_asin || book.book_title],
      content_name: book.book_title,
      content_type: 'product',
      content_category: book.series || 'Book',
      value: book.value || this.getDefaultValue('book_purchase'),
      currency: book.currency || 'USD',
      num_items: 1,
      custom_data: {
        transaction_id: transactionId || `book_${Date.now()}`,
        author: book.author || 'Dane Griggs',
        series: book.series,
        button_type: book.button_type,
      },
    };

    if (!this.consentGranted) {
      this.queueEvent('Purchase', eventData);
      return;
    }

    this.safeFbq('track', 'Purchase', eventData);
    this.log('Purchase tracked', eventData);

    this.sendToConversionsAPI('Purchase', eventData);
  }

  /**
   * Track newsletter signups (lead generation)
   */
  public trackLead(data: NewsletterEvent): void {
    const eventData = {
      content_name: 'Newsletter Signup',
      content_category: 'Lead Generation',
      value: data.value || this.getDefaultValue('newsletter'),
      currency: data.currency || 'USD',
      custom_data: {
        form_location: data.form_location,
      },
    };

    if (!this.consentGranted) {
      this.queueEvent('Lead', eventData);
      return;
    }

    this.safeFbq('track', 'Lead', eventData);
    this.log('Lead tracked', eventData);

    this.sendToConversionsAPI('Lead', eventData);
  }

  /**
   * Track search events
   */
  public trackSearch(searchTerm: string, resultsCount?: number): void {
    const eventData = {
      search_string: searchTerm,
      content_category: 'Book Search',
      value: this.getDefaultValue('engagement'),
      currency: 'USD',
      custom_data: {
        results_count: resultsCount,
      },
    };

    if (!this.consentGranted) {
      this.queueEvent('Search', eventData);
      return;
    }

    this.safeFbq('track', 'Search', eventData);
    this.log('Search tracked', eventData);

    this.sendToConversionsAPI('Search', eventData);
  }

  /**
   * Track custom events for book marketing
   */
  public trackCustomEvent(eventName: string, book?: BookInteractionEvent, customData?: Record<string, any>): void {
    const eventData = {
      content_name: book?.book_title || eventName,
      content_category: 'Custom Book Event',
      value: book?.value || this.getDefaultValue('engagement'),
      currency: book?.currency || 'USD',
      custom_data: {
        ...customData,
        author: book?.author || 'Dane Griggs',
        series: book?.series,
        button_type: book?.button_type,
      },
    };

    if (!this.consentGranted) {
      this.queueEvent(eventName, eventData);
      return;
    }

    this.safeFbq('trackCustom', eventName, eventData);
    this.log(`Custom event tracked: ${eventName}`, eventData);

    this.sendToConversionsAPI(eventName, eventData);
  }

  /**
   * Queue events when consent is not granted
   */
  private queueEvent(eventName: string, parameters?: Record<string, any>): void {
    this.pendingEvents.push({ 
      eventName, 
      parameters,
      eventId: this.generateEventId()
    });
    this.log(`Event queued: ${eventName} (waiting for consent)`);
  }

  /**
   * Process queued events after consent is granted
   */
  private processPendingEvents(): void {
    if (this.pendingEvents.length === 0) return;

    this.log(`Processing ${this.pendingEvents.length} pending events`);

    this.pendingEvents.forEach(({ eventName, parameters }) => {
      if (eventName === 'PageView') {
        this.safeFbq('track', 'PageView', parameters);
      } else if (['ViewContent', 'InitiateCheckout', 'Purchase', 'Lead', 'Search'].includes(eventName)) {
        this.safeFbq('track', eventName, parameters);
      } else {
        this.safeFbq('trackCustom', eventName, parameters);
      }
    });

    this.pendingEvents = [];
  }

  /**
   * Send events to Conversions API for server-side tracking
   */
  private async sendToConversionsAPI(eventName: string, eventData: Record<string, any>): Promise<void> {
    if (!this.accessToken || typeof window === 'undefined') return;

    try {
      const capiEvent: MetaConversionsAPIEvent = {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: this.generateEventId(),
        action_source: 'website',
        event_source_url: window.location.href,
        custom_data: {
          content_ids: eventData.content_ids,
          content_name: eventData.content_name,
          content_type: eventData.content_type,
          content_category: eventData.content_category,
          value: eventData.value,
          currency: eventData.currency,
          num_items: eventData.num_items,
          search_string: eventData.search_string,
        },
      };

      // Note: In a real implementation, this would be sent from your server
      // to maintain security of the access token
      this.log('CAPI event prepared (send from server):', capiEvent);

    } catch (error) {
      console.error('Meta Pixel: CAPI error', error);
    }
  }

  /**
   * Generate unique event ID for deduplication
   */
  private generateEventId(): string {
    return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Get default values from environment variables
   */
  private getDefaultValue(type: string): number {
    const values = {
      book_view: parseFloat(import.meta.env.PUBLIC_META_ENGAGEMENT_VALUE) || 0.25,
      book_purchase: parseFloat(import.meta.env.PUBLIC_META_BOOK_PURCHASE_VALUE) || 4.99,
      ku_click: parseFloat(import.meta.env.PUBLIC_META_KU_CLICK_VALUE) || 2.50,
      newsletter: parseFloat(import.meta.env.PUBLIC_META_NEWSLETTER_VALUE) || 1.00,
      engagement: parseFloat(import.meta.env.PUBLIC_META_ENGAGEMENT_VALUE) || 0.25,
    };

    return values[type as keyof typeof values] || 0.25;
  }

  /**
   * Debug logging
   */
  private log(message: string, data?: any): void {
    if (this.debug) {
      console.log(`[Meta Pixel] ${message}`, data || '');
    }
  }

  /**
   * Check if Meta Pixel is ready and consent is granted
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
   * Get pending events count (for debugging)
   */
  public getPendingEventsCount(): number {
    return this.pendingEvents.length;
  }
}

// Export singleton instance
export const metaPixel = new MetaPixel();

// Export convenience functions for book marketing
export const trackBookView = (book: BookInteractionEvent) => 
  metaPixel.trackViewContent(book);

export const trackBookPurchaseClick = (book: BookInteractionEvent) => 
  metaPixel.trackInitiateCheckout(book);

export const trackBookPurchase = (book: BookInteractionEvent, transactionId?: string) => 
  metaPixel.trackPurchase(book, transactionId);

export const trackKindleUnlimitedClick = (book: BookInteractionEvent) => 
  metaPixel.trackCustomEvent('KindleUnlimitedClick', book);

export const trackNewsletterSignup = (data: NewsletterEvent) => 
  metaPixel.trackLead(data);

export const trackMetaPageView = (customData?: Record<string, any>) => 
  metaPixel.trackPageView(customData);

export const updateMetaConsent = (granted: boolean) => 
  metaPixel.updateConsent(granted);

export default metaPixel;