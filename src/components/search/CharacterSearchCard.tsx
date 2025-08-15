import React from 'react';

interface CharacterSearchCardProps {
  character: {
    id: string;
    name: string;
    description?: string;
    species?: string;
    books?: string[];
    image?: string;
  };
}

const CharacterSearchCard: React.FC<CharacterSearchCardProps> = ({ character }) => {
  return (
    <div className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
      <div className="flex h-full">
        {/* Avatar Section */}
        <div className="w-24 flex-shrink-0 bg-gradient-to-br from-cosmic-rose/10 to-nebula-purple/10">
          {character.image ? (
            <img 
              src={character.image} 
              alt={character.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cosmic-rose to-nebula-purple flex items-center justify-center text-white text-2xl font-bold">
                {character.name.charAt(0)}
              </div>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 p-4">
          {/* Name and Species */}
          <div className="mb-2">
            <h3 className="font-bold text-deep-space-navy text-lg group-hover:text-cosmic-rose transition-colors">
              {character.name}
            </h3>
            {character.species && (
              <p className="text-sm text-stellar-gold font-medium capitalize">
                {character.species}
              </p>
            )}
          </div>
          
          {/* Description */}
          {character.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {character.description}
            </p>
          )}
          
          {/* Books */}
          {character.books && character.books.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Appears in:</p>
              <div className="flex flex-wrap gap-1">
                {character.books.slice(0, 2).map((book, index) => (
                  <span 
                    key={index}
                    className="text-xs px-2 py-1 bg-nebula-purple/10 text-nebula-purple rounded"
                  >
                    {book.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                ))}
                {character.books.length > 2 && (
                  <span className="text-xs text-gray-500">
                    +{character.books.length - 2} more
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* CTA Link */}
          <a 
            href={`/characters/${character.id}`}
            className="inline-flex items-center text-sm font-semibold text-cosmic-rose hover:text-nebula-purple transition-colors group-hover:underline"
          >
            View Profile
            <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default CharacterSearchCard;