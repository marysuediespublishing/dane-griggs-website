import React from 'react';

interface BookSearchCardProps {
  book: {
    id: string;
    title: string;
    description: string;
    author?: string;
    series?: string;
    cover?: any;
    genres?: string[];
  };
}

const BookSearchCard: React.FC<BookSearchCardProps> = ({ book }) => {
  const coverSrc = book.cover?.src || book.cover;
  
  return (
    <div className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
      {/* Book Cover */}
      <div className="aspect-[2/3] relative overflow-hidden bg-gradient-to-br from-nebula-purple/20 to-cosmic-rose/20">
        {coverSrc ? (
          <img 
            src={coverSrc} 
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-30">📚</span>
          </div>
        )}
        
        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Series badge */}
        {book.series && (
          <div className="mb-2">
            <span className="inline-block px-2 py-1 bg-stellar-gold/20 text-stellar-gold text-xs font-semibold rounded-full">
              {book.series}
            </span>
          </div>
        )}
        
        {/* Title */}
        <h3 className="font-bold text-deep-space-navy text-lg mb-2 line-clamp-2 group-hover:text-cosmic-rose transition-colors">
          {book.title}
        </h3>
        
        {/* Author */}
        {book.author && (
          <p className="text-sm text-gray-500 mb-2">
            by {book.author}
          </p>
        )}
        
        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-3 mb-3">
          {book.description}
        </p>
        
        {/* Genres */}
        {book.genres && book.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {book.genres.slice(0, 3).map((genre, index) => (
              <span 
                key={index}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
              >
                {genre}
              </span>
            ))}
          </div>
        )}
        
        {/* CTA Button */}
        <a 
          href={`/books/${book.id}`}
          className="inline-flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-cosmic-rose to-nebula-purple text-white rounded-lg font-semibold text-sm hover:from-cosmic-rose/90 hover:to-nebula-purple/90 transition-all duration-200 group-hover:shadow-lg"
        >
          View Book
          <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default BookSearchCard;