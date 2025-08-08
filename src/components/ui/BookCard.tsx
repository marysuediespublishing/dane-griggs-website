import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { CollectionEntry } from 'astro:content';

interface BookCardProps {
  book: CollectionEntry<'books'> & { slug: string; coverUrl?: string };
  variant?: 'standard' | 'compact' | 'featured';
  showDescription?: boolean;
  showSeriesOrder?: boolean;
  className?: string;
}

const BookCard: React.FC<BookCardProps> = ({ 
  book, 
  variant = 'standard', 
  showDescription = true,
  showSeriesOrder = false,
  className = '' 
}) => {
  const [imageError, setImageError] = useState(false);

  const getSpeciesBadgeColor = (species: string) => {
    const colors = {
      cerastean: 'bg-cosmic-rose text-solar-white',
      kraken: 'bg-ocean-teal text-solar-white', 
      dulci: 'bg-nebula-purple text-solar-white',
      human: 'bg-stellar-gold text-deep-space-navy'
    };
    return colors[species as keyof typeof colors] || 'bg-cosmic-rose text-solar-white';
  };

  const getHeatLevelEmoji = (level: string) => {
    const emojis = {
      mild: '🌶️',
      medium: '🌶️🌶️',
      spicy: '🌶️🌶️🌶️'
    };
    return emojis[level as keyof typeof emojis] || '🌶️';
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.4; // Show half star for 0.4 and above
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-stellar-gold">★</span>
      );
    }
    
    // Half star - using a simpler approach
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-stellar-gold">✬</span>
      );
    }
    
    // Empty stars
    const totalStars = fullStars + (hasHalfStar ? 1 : 0);
    const remainingStars = 5 - totalStars;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">☆</span>
      );
    }
    
    return stars;
  };

  const cardVariants = {
    standard: 'w-full max-w-sm',
    compact: 'w-40',
    featured: 'w-full max-w-md'
  };

  const imageVariants = {
    standard: 'h-80',
    compact: 'h-56', 
    featured: 'h-96'
  };

  const handleCardClick = () => {
    if (typeof window !== 'undefined') {
      window.location.href = `/books/${book.slug}`;
    }
  };

  const handleExternalLink = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  };

  return (
    <motion.div
      className={`
        group cursor-pointer transition-all duration-300
        ${cardVariants[variant]} ${className}
      `}
      whileHover={{ 
        y: -8,
        rotateX: 5,
        transition: { duration: 0.3 }
      }}
      onClick={handleCardClick}
    >
      {/* Book Cover Container */}
      <div className="relative mb-4 perspective-1000">
        <motion.div
          className={`
            relative overflow-hidden rounded-lg shadow-lg
            ${imageVariants[variant]}
            group-hover:shadow-cosmic transition-all duration-400
          `}
          whileHover={{
            boxShadow: '0 20px 40px rgba(212, 51, 106, 0.3), 0 0 30px rgba(244, 162, 97, 0.2)'
          }}
        >
          {/* Book Cover Image */}
          {book.coverUrl && !imageError && (
            <img
              src={book.coverUrl}
              alt={`${book.data.title} book cover`}
              className={`
                w-full h-full object-cover transition-all duration-400
                group-hover:scale-105
              `}
              onError={() => setImageError(true)}
              loading="lazy"
            />
          )}
          
          {/* Fallback for missing covers */}
          {(imageError || !book.coverUrl) && (
            <div className="w-full h-full bg-gradient-cosmic flex items-center justify-center">
              <div className="text-center text-solar-white">
                <div className="text-4xl mb-2">📖</div>
                <div className="text-sm font-medium">{book.data.title}</div>
                {!book.coverUrl && (
                  <div className="text-xs text-solar-white/60 mt-1">No cover processed</div>
                )}
              </div>
            </div>
          )}
          
          {/* Hover Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-deep-space-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center p-4"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <div className="text-center space-y-2">
              <button className="btn btn-secondary text-sm px-4 py-2">
                Quick View
              </button>
              {book.data.amazonUrl && (
                <button 
                  className="btn btn-outline text-sm px-4 py-2"
                  onClick={(e) => handleExternalLink(e, book.data.amazonUrl!)}
                >
                  {book.data.isKU ? 'Read Free on KU' : `Buy ${book.data.price || '$4.99'}`}
                </button>
              )}
            </div>
          </motion.div>
          
          {/* Corner badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {book.data.featured && (
              <span className="bg-stellar-gold text-deep-space-navy text-xs px-2 py-1 rounded">
                ⭐ Featured
              </span>
            )}
            {book.data.isKU && (
              <span className="bg-ocean-teal text-solar-white text-xs px-2 py-1 rounded">
                KU
              </span>
            )}
            {showSeriesOrder && book.data.seriesOrder && (
              <span className="bg-cosmic-rose text-solar-white text-xs px-2 py-1 rounded">
                #{book.data.seriesOrder}
              </span>
            )}
          </div>
          
          {/* Heat level indicator */}
          <div className="absolute top-2 right-2">
            <span className="text-lg" title={`Heat level: ${book.data.heatLevel}`}>
              {getHeatLevelEmoji(book.data.heatLevel)}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Book Information */}
      <div className="space-y-2">
        {/* Series Info */}
        {book.data.series && (
          <div className="text-sm text-cosmic-rose font-medium">
            {book.data.series} {book.data.seriesOrder && `#${book.data.seriesOrder}`}
          </div>
        )}
        
        {/* Title */}
        <h3 className={`
          font-primary font-semibold text-deep-space-navy group-hover:text-cosmic-rose transition-colors line-clamp-2
          ${variant === 'compact' ? 'text-sm' : 'text-lg'}
        `}>
          {book.data.title}
        </h3>
        
        {/* Author */}
        <p className={`text-gray-600 ${variant === 'compact' ? 'text-xs' : 'text-sm'}`}>
          by {book.data.author}
        </p>
        
        {/* Rating */}
        {book.data.rating > 0 && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {renderStars(book.data.rating)}
            </div>
            <span className="text-sm text-gray-500">
              {book.data.rating} ({book.data.ratingCount?.toLocaleString() || 0})
            </span>
          </div>
        )}
        
        {/* Species Tags */}
        {(() => {
          const currentSpecies = book.data.species || book.data.alienSpecies || [];
          return currentSpecies.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {currentSpecies.slice(0, variant === 'compact' ? 2 : 4).map((species) => (
                <span 
                  key={species}
                  className={`text-xs px-2 py-1 rounded capitalize ${getSpeciesBadgeColor(species)}`}
                >
                  {species}
                </span>
              ))}
              {currentSpecies.length > (variant === 'compact' ? 2 : 4) && (
                <span className="text-xs text-gray-500">
                  +{currentSpecies.length - (variant === 'compact' ? 2 : 4)} more
                </span>
              )}
            </div>
          );
        })()}
        
        {/* Description */}
        {showDescription && variant !== 'compact' && (
          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
            {book.data.description}
          </p>
        )}
        
        {/* Action Buttons for Featured variant */}
        {variant === 'featured' && (
          <div className="flex space-x-2 pt-2">
            {book.data.amazonUrl && (
              <button 
                className="btn btn-primary flex-1"
                onClick={(e) => handleExternalLink(e, book.data.amazonUrl!)}
              >
                {book.data.isKU ? 'Read Free on KU' : `Buy ${book.data.price || '$4.99'}`}
              </button>
            )}
            {book.data.goodreadsUrl && (
              <button 
                className="btn btn-outline px-3"
                onClick={(e) => handleExternalLink(e, book.data.goodreadsUrl!)}
                title="Add to Goodreads"
              >
                📚
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BookCard;