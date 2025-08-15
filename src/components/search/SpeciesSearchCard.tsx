import React from 'react';

interface SpeciesSearchCardProps {
  species: {
    id: string;
    name: string;
    description?: string;
    physicalTraits?: string;
    image?: string;
  };
}

const SpeciesSearchCard: React.FC<SpeciesSearchCardProps> = ({ species }) => {
  return (
    <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-cosmic-rose/30">
      {/* Alien emoji header */}
      <div className="h-20 bg-gradient-to-r from-deep-space-navy via-nebula-purple to-deep-space-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-repeat" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />
        </div>
        <div className="relative h-full flex items-center justify-center">
          {species.image ? (
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-stellar-gold/50">
              <img 
                src={species.image} 
                alt={species.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ) : (
            <span className="text-4xl">👽</span>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Name */}
        <h3 className="font-bold text-xl text-deep-space-navy text-center mb-3 group-hover:text-cosmic-rose transition-colors">
          {species.name}
        </h3>
        
        {/* Description */}
        {species.description && (
          <p className="text-sm text-gray-600 line-clamp-3 mb-3">
            {species.description}
          </p>
        )}
        
        {/* Physical Traits */}
        {species.physicalTraits && (
          <div className="mb-3 p-2 bg-stellar-gold/10 rounded-lg">
            <p className="text-xs font-semibold text-stellar-gold mb-1">Physical Traits</p>
            <p className="text-xs text-gray-600 line-clamp-2">
              {species.physicalTraits}
            </p>
          </div>
        )}
        
        {/* CTA Button */}
        <a 
          href={`/species/${species.id}`}
          className="block text-center px-4 py-2 bg-gradient-to-r from-deep-space-navy to-nebula-purple text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity group-hover:shadow-lg"
        >
          Learn More
        </a>
      </div>
    </div>
  );
};

export default SpeciesSearchCard;