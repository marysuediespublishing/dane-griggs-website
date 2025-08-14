import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { updateConsent } from '../lib/analytics';

interface CookieConsentBannerProps {
  className?: string;
}

interface ConsentData {
  hasConsented: boolean;
  consentType: 'all' | 'essential' | 'custom';
  timestamp: number;
  expiryDays: number;
  categories: {
    essential: boolean;
    analytics: boolean;
    marketing: boolean;
  };
}

const CONSENT_EXPIRY_DAYS = 365; // 1 year as per GDPR recommendations
const CONSENT_STORAGE_KEY = 'gdpr-consent';

const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ className = '' }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has valid consent
    const storedConsent = getStoredConsent();
    if (!storedConsent || isConsentExpired(storedConsent)) {
      // Clear expired consent
      if (storedConsent && isConsentExpired(storedConsent)) {
        localStorage.removeItem(CONSENT_STORAGE_KEY);
        localStorage.removeItem('cookie-consent'); // Legacy cleanup
      }
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    } else {
      // Apply previous consent choice
      applyStoredConsent(storedConsent);
    }

    // Listen for custom event to reopen settings
    const handleReopenSettings = () => {
      setShowBanner(true);
      setShowDetails(true);
    };
    
    window.addEventListener('reopenCookieSettings', handleReopenSettings);
    return () => window.removeEventListener('reopenCookieSettings', handleReopenSettings);
  }, []);

  const getStoredConsent = (): ConsentData | null => {
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!stored) {
        // Check for legacy consent
        const legacyConsent = localStorage.getItem('cookie-consent');
        if (legacyConsent) {
          // Migrate legacy consent
          const hasConsent = legacyConsent === 'accepted';
          return {
            hasConsented: hasConsent,
            consentType: hasConsent ? 'all' : 'essential',
            timestamp: Date.now(),
            expiryDays: CONSENT_EXPIRY_DAYS,
            categories: {
              essential: true,
              analytics: hasConsent,
              marketing: hasConsent,
            }
          };
        }
        return null;
      }
      return JSON.parse(stored);
    } catch {
      return null;
    }
  };

  const isConsentExpired = (consent: ConsentData): boolean => {
    const expiryTime = consent.timestamp + (consent.expiryDays * 24 * 60 * 60 * 1000);
    return Date.now() > expiryTime;
  };

  const applyStoredConsent = (consent: ConsentData): void => {
    const analyticsConsent = consent.categories.analytics && consent.categories.marketing;
    updateConsent(analyticsConsent);
  };

  const saveConsent = (consentData: Partial<ConsentData>): void => {
    const fullConsent: ConsentData = {
      hasConsented: true,
      consentType: 'custom',
      timestamp: Date.now(),
      expiryDays: CONSENT_EXPIRY_DAYS,
      categories: {
        essential: true,
        analytics: false,
        marketing: false,
      },
      ...consentData
    };

    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(fullConsent));
    // Clean up legacy storage
    localStorage.removeItem('cookie-consent');
    
    // Apply consent
    const analyticsConsent = fullConsent.categories.analytics && fullConsent.categories.marketing;
    updateConsent(analyticsConsent);
  };

  const handleAcceptAll = () => {
    saveConsent({
      consentType: 'all',
      categories: {
        essential: true,
        analytics: true,
        marketing: true,
      }
    });
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    saveConsent({
      consentType: 'essential',
      categories: {
        essential: true,
        analytics: false,
        marketing: false,
      }
    });
    setShowBanner(false);
  };

  const handleCustomize = () => {
    setShowDetails(true);
  };

  const handleSavePreferences = (categories: { analytics: boolean; marketing: boolean }) => {
    saveConsent({
      consentType: 'custom',
      categories: {
        essential: true,
        ...categories
      }
    });
    setShowBanner(false);
    setShowDetails(false);
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`
          fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg
          dark:bg-gray-900 dark:border-gray-700 ${className}
        `}
        role="dialog"
        aria-label="Cookie consent banner"
        aria-describedby="cookie-consent-description"
        data-testid="cookie-consent-banner"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          {!showDetails ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  We value your privacy
                </h3>
                <p id="cookie-consent-description" className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  We use cookies to enhance your browsing experience, provide personalized content, 
                  and analyze our traffic. You can accept all cookies, reject non-essential cookies, 
                  or customize your preferences. Your choice will be remembered for {CONSENT_EXPIRY_DAYS} days.
                </p>
                <div className="flex gap-4 mt-2">
                  <a 
                    href="/privacy-policy" 
                    className="text-sm text-cosmic-rose hover:text-cosmic-rose/80 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="privacy-policy-link"
                  >
                    Privacy Policy
                  </a>
                  <a 
                    href="/cookie-policy" 
                    className="text-sm text-cosmic-rose hover:text-cosmic-rose/80 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="cookie-policy-link"
                  >
                    Cookie Policy
                  </a>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCustomize}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors duration-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                  data-testid="customize-cookies-btn"
                >
                  Customize
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  data-testid="reject-all-cookies-btn"
                >
                  Reject All
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 text-sm font-medium text-white bg-cosmic-rose border border-cosmic-rose rounded-md hover:bg-cosmic-rose/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cosmic-rose focus:ring-offset-2"
                  data-testid="accept-all-cookies-btn"
                >
                  Accept All
                </button>
              </div>
            </div>
          ) : (
            <CookiePreferences onSave={handleSavePreferences} onBack={() => setShowDetails(false)} />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

interface CookiePreferencesProps {
  onSave: (categories: { analytics: boolean; marketing: boolean }) => void;
  onBack: () => void;
}

const CookiePreferences: React.FC<CookiePreferencesProps> = ({ onSave, onBack }) => {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
      data-testid="cookie-preferences"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Cookie Preferences
        </h3>
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Go back to main consent options"
          data-testid="back-btn"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        {/* Essential Cookies */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900 dark:text-white">Essential Cookies</h4>
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">Always Active</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            These cookies are necessary for the website to function and cannot be switched off. 
            They include session management, security features, basic functionality, and consent preferences.
          </p>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            <strong>Retention:</strong> Session cookies expire when you close your browser. 
            Consent preferences are stored for {CONSENT_EXPIRY_DAYS} days.
          </div>
        </div>

        {/* Analytics Cookies */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900 dark:text-white">Analytics Cookies</h4>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={analyticsEnabled}
                onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                className="sr-only peer"
                data-testid="analytics-toggle"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cosmic-rose/20 dark:peer-focus:ring-cosmic-rose/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cosmic-rose"></div>
            </label>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            These cookies help us understand how visitors interact with our website by collecting 
            and reporting information anonymously. We use Google Analytics 4 with privacy-enhanced configuration.
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-md p-3">
            <h5 className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-2">
              Google Analytics 4 Features
            </h5>
            <ul className="text-xs text-blue-600 dark:text-blue-300 space-y-1">
              <li>• Privacy-compliant analytics with IP anonymization</li>
              <li>• Book engagement and page interaction tracking</li>
              <li>• Anonymous behavior analysis for content optimization</li>
              <li>• GDPR Consent Mode v2 compliant</li>
            </ul>
            <div className="mt-2 text-xs text-blue-500 dark:text-blue-400">
              <strong>Retention:</strong> 26 months (Google Analytics standard)
            </div>
          </div>
        </div>

        {/* Marketing Cookies */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900 dark:text-white">Marketing Cookies</h4>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={marketingEnabled}
                onChange={(e) => setMarketingEnabled(e.target.checked)}
                className="sr-only peer"
                data-testid="marketing-toggle"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cosmic-rose/20 dark:peer-focus:ring-cosmic-rose/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cosmic-rose"></div>
            </label>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            These cookies enable personalized book marketing and help us reach readers interested 
            in romance and fantasy genres. They track book interactions and optimize advertising campaigns.
          </p>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-md p-3 mb-3">
            <h5 className="text-sm font-medium text-purple-700 dark:text-purple-400 mb-2">
              Meta Pixel (Facebook) Features
            </h5>
            <ul className="text-xs text-purple-600 dark:text-purple-300 space-y-1">
              <li>• Book marketing optimization and audience building</li>
              <li>• Purchase intent and conversion tracking</li>
              <li>• iOS 14.5+ App Tracking Transparency compliant</li>
              <li>• Personalized book recommendations</li>
            </ul>
            <div className="mt-2 text-xs text-purple-500 dark:text-purple-400">
              <strong>Retention:</strong> 180 days (Meta standard for website events)
            </div>
          </div>

          <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border-l-4 border-yellow-400">
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              <strong>Value Optimization:</strong> These tools help us show relevant book recommendations 
              and optimize ad campaigns to reach readers interested in romance and fantasy genres.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 pt-4">
        <button
          onClick={() => onSave({ analytics: false, marketing: false })}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          data-testid="save-essential-only-btn"
        >
          Save Preferences (Essential Only)
        </button>
        <button
          onClick={() => onSave({ analytics: analyticsEnabled, marketing: marketingEnabled })}
          className="px-6 py-2 text-sm font-medium text-white bg-cosmic-rose border border-transparent rounded-md hover:bg-cosmic-rose/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cosmic-rose focus:ring-offset-2 sm:ml-auto"
          data-testid="save-preferences-btn"
        >
          Save Preferences
        </button>
      </div>
    </motion.div>
  );
};

export default CookieConsentBanner;