import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackNewsletterSignup, analytics } from '../../lib/analytics';

interface NewsletterCTAMailchimpProps {
  variant?: 'header' | 'hero' | 'sidebar' | 'footer' | 'exit-intent' | 'mobile';
  text?: string;
  className?: string;
  showModal?: boolean;
  onModalToggle?: (isOpen: boolean) => void;
}

const NewsletterCTAMailchimp: React.FC<NewsletterCTAMailchimpProps> = ({
  variant = 'header',
  text,
  className = '',
  showModal: externalShowModal,
  onModalToggle
}) => {
  const [internalShowModal, setInternalShowModal] = useState(false);
  
  // Use external modal state if provided, otherwise use internal state
  const showModal = externalShowModal !== undefined ? externalShowModal : internalShowModal;
  const setShowModal = onModalToggle || setInternalShowModal;

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

  const getModalContent = () => {
    switch (variant) {
      case 'exit-intent':
        return {
          title: "Wait! Don't Leave Empty-Handed",
          subtitle: "Get Your FREE Alien Romance Pack",
          description: "Join 10,000+ sci-fi romance fans and get exclusive content before you go!"
        };
      default:
        return {
          title: "📧 Get Your Free Book",
          subtitle: "Join the Cosmic Adventure",
          description: "Join your fellow sci-fi romance fans and get exclusive content, early access to new releases, and behind-the-scenes insights into alien world-building."
        };
    }
  };

  const handleCTAClick = () => {
    // Track CTA click
    analytics.trackEngagement({
      engagement_type: 'navigation',
      page_title: `Newsletter CTA - ${variant}`,
    });
    
    trackNewsletterSignup({
      form_location: variant,
      action: 'button_click'
    });
    
    setShowModal(true);
  };

  const content = getModalContent();

  return (
    <>
      {/* CTA Button */}
      <button
        onClick={handleCTAClick}
        className={className || `
          btn btn-primary transition-all duration-200 hover:-translate-y-0.5 
          focus:outline-none focus:ring-2 focus:ring-stellar-gold focus:ring-offset-2
        `}
        aria-label={`Open newsletter signup - ${getButtonText()}`}
        data-testid={`newsletter-cta-${variant}`}
      >
        {getButtonText()}
      </button>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-start justify-center p-4 pt-16"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-gradient-to-br from-deep-space-navy to-nebula-purple p-8 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-cosmic-rose/30 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-solar-white/60 hover:text-solar-white transition-colors z-10"
                aria-label="Close newsletter signup"
                data-testid="newsletter-modal-close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold font-primary text-solar-white mb-2">
                  {content.title}
                </h2>
                <p className="text-stellar-gold font-medium mb-3">
                  {content.subtitle}
                </p>
                <p className="text-solar-white/80">
                  {content.description}
                </p>
              </div>

              {/* Benefits List */}
              <div className="mb-6">
                <ul className="space-y-2">
                  {[
                    "Free starter pack with bonus content",
                    "Early access to new releases", 
                    "Exclusive alien species guides",
                    "Behind-the-scenes writing insights",
                    "Reader-only contests and giveaways"
                  ].map((benefit, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-5 h-5 bg-stellar-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-deep-space-navy" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-solar-white text-sm">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Mailchimp Embedded Form */}
              <div className="mailchimp-form-container">
                <div id="mc_embed_signup">
                  <form 
                    action="https://danegriggs.us20.list-manage.com/subscribe/post?u=2322adeb442320ced691ff200&amp;id=5fa4ad6bbc&amp;f_id=00ae62eef0" 
                    method="post" 
                    id="mc-embedded-subscribe-form" 
                    name="mc-embedded-subscribe-form" 
                    className="validate" 
                    target="_blank"
                    noValidate
                  >
                    <div id="mc_embed_signup_scroll">
                      <div className="mc-field-group">
                        <label htmlFor="mce-EMAIL" className="sr-only">Email Address</label>
                        <input 
                          type="email" 
                          name="EMAIL" 
                          className="required email" 
                          id="mce-EMAIL" 
                          required 
                          placeholder="Enter your email address"
                        />
                      </div>
                      
                      <div id="mce-responses" className="clear">
                        <div className="response" id="mce-error-response" style={{display:'none'}}></div>
                        <div className="response" id="mce-success-response" style={{display:'none'}}></div>
                      </div>
                      
                      {/* Bot protection */}
                      <div aria-hidden="true" style={{position: 'absolute', left: '-5000px'}}>
                        <input 
                          type="text" 
                          name="b_2322adeb442320ced691ff200_5fa4ad6bbc" 
                          tabIndex={-1} 
                          defaultValue="" 
                        />
                      </div>
                      
                      <div className="clear">
                        <motion.input
                          type="submit" 
                          name="subscribe" 
                          id="mc-embedded-subscribe" 
                          className="btn btn-secondary w-full py-3 text-base font-semibold mt-4"
                          value="Get Your Free Book Now"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              {/* Privacy Note */}
              <div className="mt-6 text-center">
                <p className="text-xs text-solar-white/60">
                  No spam ever. Unsubscribe anytime. We respect your privacy and are GDPR compliant.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inline styles for Mailchimp form */}
      <style dangerouslySetInnerHTML={{__html: `
        .mailchimp-form-container input[type="email"],
        .mailchimp-form-container input[type="text"] {
          width: 100%;
          padding: 12px 16px;
          margin: 8px 0;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 16px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        
        .mailchimp-form-container input[type="email"]:focus,
        .mailchimp-form-container input[type="text"]:focus {
          outline: none;
          border-color: #FFD700;
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2);
        }
        
        .mailchimp-form-container input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }
        
        .mailchimp-form-container .response {
          margin: 8px 0;
          padding: 12px;
          border-radius: 6px;
          font-size: 14px;
        }
        
        .mailchimp-form-container #mce-error-response {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #FCA5A5;
        }
        
        .mailchimp-form-container #mce-success-response {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #86EFAC;
        }
      `}} />
    </>
  );
};

export default NewsletterCTAMailchimp;