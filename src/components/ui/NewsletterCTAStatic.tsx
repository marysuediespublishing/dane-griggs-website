import React from 'react';
import { trackNewsletterSignup, analytics } from '../../lib/analytics';

interface NewsletterCTAStaticProps {
  variant?: 'header' | 'hero' | 'sidebar' | 'footer' | 'exit-intent' | 'mobile';
  text?: string;
  className?: string;
}

/**
 * Static version of NewsletterCTA that triggers Mailchimp's native popup
 * This works with the Mailchimp popup script loaded in Layout.astro
 */
const NewsletterCTAStatic: React.FC<NewsletterCTAStaticProps> = ({
  variant = 'header',
  text,
  className = '',
}) => {
  const getButtonText = () => {
    if (text) return text;
    
    switch (variant) {
      case 'header':
        return 'Free Book';
      case 'hero':
        return 'Get Your Free Alien Romance Book';
      case 'sidebar':
        return 'Join Newsletter';
      case 'footer':
        return 'Subscribe';
      case 'exit-intent':
        return 'Wait! Get Free Books';
      case 'mobile':
        return '📧';
      default:
        return 'Join Newsletter';
    }
  };

  const getButtonClass = () => {
    const baseClass = 'transition-all duration-200 hover:scale-105 active:scale-95';
    
    switch (variant) {
      case 'header':
        return `${baseClass} bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full font-bold hover:from-pink-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform`;
      case 'hero':
        return `${baseClass} bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:from-pink-600 hover:to-purple-700 shadow-xl hover:shadow-2xl transform`;
      case 'sidebar':
        return `${baseClass} bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 w-full`;
      case 'footer':
        return `${baseClass} bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700`;
      case 'exit-intent':
        return `${baseClass} bg-gradient-to-r from-pink-500 to-purple-600 text-white px-10 py-5 rounded-full text-xl font-bold hover:from-pink-600 hover:to-purple-700 shadow-2xl transform`;
      case 'mobile':
        return `${baseClass} bg-gradient-to-r from-pink-500 to-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl`;
      default:
        return `${baseClass} bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700`;
    }
  };

  const handleClick = () => {
    // Track the click
    trackNewsletterSignup({
      form_location: variant,
      action: 'button_click'
    });
    
    // Trigger Mailchimp popup
    // The Mailchimp script adds a global function to show the popup
    if (typeof window !== 'undefined' && (window as any).dojoRequire) {
      (window as any).dojoRequire(["mojo/signup-forms/Loader"], function(L) { 
        L.start({"baseUrl":"mc.us21.list-manage.com","uuid":"YOUR_UUID","lid":"YOUR_LID","uniqueMethods":true}) 
      });
    } else {
      // Fallback: Try to trigger any existing Mailchimp popup
      // Some Mailchimp scripts auto-show on page load, so we might need to 
      // programmatically trigger it differently based on your setup
      const event = new CustomEvent('mailchimp:show-popup');
      window.dispatchEvent(event);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${getButtonClass()} ${className}`}
      aria-label="Subscribe to newsletter"
    >
      {getButtonText()}
    </button>
  );
};

export default NewsletterCTAStatic;