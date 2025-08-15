import React from 'react';

interface LocationSearchCardProps {
  location: {
    id: string;
    name: string;
    description?: string;
    environmentType?: string;
  };
}

const LocationSearchCard: React.FC<LocationSearchCardProps> = ({ location }) => {
  const getEnvironmentIcon = (type?: string) => {
    if (!type) return '🏛️';
    
    const iconMap: Record<string, string> = {
      'planetary-surface': '🌍',
      'alien-homeworld': '🪐',
      'artificial-orbital': '🛸',
      'vessel-command': '🚀',
      'vessel-transport': '🛰️',
      'medical-complex': '🏥',
      'governmental': '🏛️',
      'ceremonial': '⛩️',
      'celebratory': '🎉',
      'multi-planetary': '🌌',
      'journey': '🧭'
    };
    
    return iconMap[type] || '🏛️';
  };
  
  const formatEnvironmentType = (type?: string) => {
    if (!type) return 'Location';
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };
  
  return (
    <div className="group relative bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-stellar-gold/50">
      <div className="flex h-full">
        {/* Icon Section */}
        <div className="w-20 flex-shrink-0 bg-gradient-to-br from-stellar-gold/20 to-cosmic-rose/20 flex items-center justify-center">
          <span className="text-3xl">
            {getEnvironmentIcon(location.environmentType)}
          </span>
        </div>
        
        {/* Content */}
        <div className="flex-1 p-4">
          {/* Environment Type Badge */}
          {location.environmentType && (
            <span className="inline-block px-2 py-1 bg-stellar-gold/20 text-stellar-gold text-xs font-semibold rounded mb-2">
              {formatEnvironmentType(location.environmentType)}
            </span>
          )}
          
          {/* Name */}
          <h3 className="font-bold text-lg text-deep-space-navy mb-2 group-hover:text-cosmic-rose transition-colors">
            {location.name}
          </h3>
          
          {/* Description */}
          {location.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {location.description}
            </p>
          )}
          
          {/* Explore link */}
          <div className="mt-3">
            <a 
              href={`/locations/${location.id.replace(/\.md$/, '')}`}
              className="inline-flex items-center text-sm font-semibold text-stellar-gold hover:text-cosmic-rose transition-colors"
            >
              Explore
              <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSearchCard;