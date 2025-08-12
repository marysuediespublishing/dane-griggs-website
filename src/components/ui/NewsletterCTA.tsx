import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NewsletterCTAProps {
  variant?: 'header' | 'hero' | 'sidebar' | 'footer' | 'exit-intent' | 'mobile';
  text?: string;
  className?: string;
  showModal?: boolean;
  onModalToggle?: (isOpen: boolean) => void;
}

const NewsletterCTA: React.FC<NewsletterCTAProps> = ({
  variant = 'header',
  text,
  className = '',
  showModal: externalShowModal,
  onModalToggle
}) => {
  const [internalShowModal, setInternalShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
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
          description: "Join 10,000+ sci-fi romance fans and get exclusive content before you go!",
          benefits: [
            "Free starter pack with bonus stories",
            "Early access to new releases",
            "Exclusive alien species guides",
            "Behind-the-scenes writing insights"
          ]
        };
      default:
        return {
          title: "📧 Get Your Free Book",
          subtitle: "Join the Cosmic Adventure",
          description: "Join your fellow sci-fi romance fans and get exclusive content, early access to new releases, and behind-the-scenes insights into alien world-building.",
          benefits: [
            "Free starter pack with bonus content",
            "Early access to new releases",
            "Exclusive alien species guides",
            "Behind-the-scenes writing insights",
            "Reader-only contests and giveaways",
            "No spam, ever - unsubscribe anytime"
          ]
        };
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Submit to Mailchimp API
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          source: `newsletter-${variant}`
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setIsSuccess(true);
        
        // Trigger celebration animation (only in browser)
        if (typeof window !== 'undefined') {
          const celebrationEvent = new CustomEvent('newsletter-success', {
            detail: { name, email, variant }
          });
          window.dispatchEvent(celebrationEvent);
        }
        
        // Close modal after success
        setTimeout(() => {
          setShowModal(false);
          setIsSuccess(false);
          setEmail('');
          setName('');
        }, 3000);
      } else {
        // Handle API error response
        setError(data.error || 'Something went wrong. Please try again.');
      }
      
    } catch (error) {
      console.error('Newsletter signup failed:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = getModalContent();

  return (
    <>
      {/* CTA Button */}
      <button
        onClick={() => setShowModal(true)}
        className={className || `
          btn btn-primary transition-all duration-200 hover:-translate-y-0.5 
          focus:outline-none focus:ring-2 focus:ring-stellar-gold focus:ring-offset-2
        `}
        aria-label={`Open newsletter signup - ${getButtonText()}`}
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
                className="absolute top-4 right-4 text-solar-white/60 hover:text-solar-white transition-colors"
                aria-label="Close newsletter signup"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {!isSuccess ? (
                <>
                  {/* Header */}
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold font-primary text-solar-white mb-2">
                      {content.title}
                    </h2>
                    <p className="text-stellar-gold font-medium">
                      {content.subtitle}
                    </p>
                    <p className="text-solar-white/80 mt-3">
                      {content.description}
                    </p>
                  </div>

                  {/* Benefits List */}
                  <div className="mb-6">
                    <ul className="space-y-2">
                      {content.benefits.map((benefit, index) => (
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

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Input */}
                    <div>
                      <label htmlFor="newsletter-name" className="block text-sm font-medium text-solar-white mb-2">
                        Your Name
                      </label>
                      <input
                        id="newsletter-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-cosmic w-full"
                        placeholder="Enter your name"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Email Input */}
                    <div>
                      <label htmlFor="newsletter-email" className="block text-sm font-medium text-solar-white mb-2">
                        Email Address
                      </label>
                      <input
                        id="newsletter-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-cosmic w-full"
                        placeholder="Enter your email address"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Error Message */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded-lg p-3"
                      >
                        {error}
                      </motion.div>
                    )}

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full btn btn-secondary py-3 text-base font-semibold relative overflow-hidden"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-deep-space-navy border-t-transparent rounded-full animate-spin" />
                          <span>Joining...</span>
                        </div>
                      ) : (
                        'Get Your Free Book Now'
                      )}
                    </motion.button>
                  </form>

                  {/* Privacy Note */}
                  <div className="mt-4 text-center">
                    <p className="text-xs text-solar-white/60">
                      No spam ever. Unsubscribe anytime. We respect your privacy and are GDPR compliant.
                    </p>
                  </div>
                </>
              ) : (
                /* Success State */
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="text-6xl mb-4">🌟</div>
                  <h3 className="text-2xl font-bold text-solar-white mb-4">
                    Welcome to the Adventure!
                  </h3>
                  <p className="text-solar-white/80 mb-6">
                    You're now part of Dane's exclusive reader community. Check your email for your free books and get ready for cosmic romance updates!
                  </p>
                  <div className="bg-stellar-gold/10 border border-stellar-gold/30 rounded-lg p-4">
                    <p className="text-stellar-gold text-sm font-medium">
                      🚀 Your free alien romance pack is on its way!
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NewsletterCTA;