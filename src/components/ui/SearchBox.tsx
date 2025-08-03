import React, { useState } from 'react';

interface SearchBoxProps {
  mobile?: boolean;
  className?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({ mobile = false, className = '' }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && typeof window !== 'undefined') {
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={mobile ? "Search books, series..." : "Search books, series, alien species..."}
          className={`
            w-full bg-deep-space-navy/50 backdrop-blur-sm border-2 border-cosmic-rose/30 
            rounded-lg px-4 py-2 text-solar-white placeholder-solar-white/60
            focus:outline-none focus:border-cosmic-rose focus:shadow-cosmic
            transition-all duration-200
            ${mobile ? 'text-sm' : 'text-base'}
            ${mobile ? 'px-3 py-2' : 'px-4 py-2'}
          `}
          aria-label="Search"
        />
        
        {/* Search Icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-solar-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </form>
  );
};

export default SearchBox;