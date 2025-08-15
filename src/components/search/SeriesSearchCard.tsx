import React from 'react';

interface SeriesSearchCardProps {
  series: {
    id: string;
    title: string;
    description: string;
    bookCount?: number;
    completionStatus?: string;
    worldBuilding?: string;
  };
}

const SeriesSearchCard: React.FC<SeriesSearchCardProps> = ({ series }) => {
  const statusColor = series.completionStatus === 'complete' 
    ? 'bg-green-100 text-green-700' 
    : 'bg-amber-100 text-amber-700';
  
  return (
    <div className="group relative bg-gradient-to-br from-deep-space-navy to-nebula-purple rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-aurora" />
      
      {/* Content */}
      <div className="p-6 text-solar-white">
        {/* Header with icon */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-stellar-gold/20 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🌌</span>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-1 group-hover:text-stellar-gold transition-colors">
                {series.title}
              </h3>
              <div className="flex items-center space-x-3 text-sm text-solar-white/70">
                {series.bookCount && (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    {series.bookCount} Books
                  </span>
                )}
                {series.completionStatus && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor}`}>
                    {series.completionStatus}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-solar-white/90 text-sm mb-4 line-clamp-3">
          {series.description}
        </p>
        
        {/* World Building Preview */}
        {series.worldBuilding && (
          <div className="mb-4 p-3 bg-black/20 rounded-lg border border-stellar-gold/20">
            <p className="text-xs text-stellar-gold font-semibold mb-1">World Building</p>
            <p className="text-xs text-solar-white/70 line-clamp-2">
              {series.worldBuilding}
            </p>
          </div>
        )}
        
        {/* CTA Button */}
        <a 
          href={`/series/${series.id}`}
          className="inline-flex items-center justify-center w-full px-4 py-2 bg-stellar-gold text-deep-space-navy rounded-lg font-bold text-sm hover:bg-stellar-gold/90 transition-all duration-200 group-hover:shadow-lg"
        >
          Explore Series
          <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default SeriesSearchCard;