import React, { useState, useEffect } from 'react';
import BookSearchCard from './search/BookSearchCard';
import SeriesSearchCard from './search/SeriesSearchCard';
import CharacterSearchCard from './search/CharacterSearchCard';
import SpeciesSearchCard from './search/SpeciesSearchCard';
import BlogSearchCard from './search/BlogSearchCard';

interface SearchData {
  books: any[];
  series: any[];
  blog: any[];
  species: any[];
  characters: any[];
  pages: any[];
}

const SearchClientEnhanced: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'books' | 'series' | 'characters' | 'species' | 'blog'>('all');
  const [results, setResults] = useState<{
    books: any[];
    series: any[];
    blog: any[];
    species: any[];
    characters: any[];
    pages: any[];
    }>({
    books: [],
    series: [],
    blog: [],
    species: [],
    characters: [],
    pages: []
  });

  // Popular searches for empty state
  const popularSearches = [
    'alien romance',
    'cerastean',
    'kraken',
    'cryzorian',
    'medical romance',
    'Saving Ceraste',
    'Ravok',
    'strong heroine'
  ];

  // Load search data and get query from URL
  useEffect(() => {
    try {
      // Get query from URL
      const urlParams = new URLSearchParams(window.location.search);
      const query = urlParams.get('q') || '';
      setSearchQuery(query);

      // Load search index
      fetch('/api/search-index.json')
        .then(res => {
          if (!res.ok) throw new Error('Failed to load search index');
          return res.json();
        })
        .then(data => {
          setSearchData(data);
          setLoading(false);
          if (query) {
            performSearch(query, data);
          }
        })
        .catch(err => {
          console.error('Failed to load search data:', err);
          setError('Failed to load search data');
          setLoading(false);
        });
    } catch (err) {
      console.error('Error in useEffect:', err);
      setError('An error occurred');
      setLoading(false);
    }
  }, []);

  // Helper functions for search
  const normalizeForSearch = (text: string): string => {
    return text.replace(/\s+/g, '-').toLowerCase();
  };

  const matchesQuery = (text: string | undefined, query: string): boolean => {
    if (!text) return false;
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const normalizedQuery = normalizeForSearch(query);
    
    return lowerText.includes(lowerQuery) || lowerText.includes(normalizedQuery);
  };

  // Perform search
  const performSearch = (query: string, data: SearchData) => {
    if (!query || !data) {
      setResults({
        books: [],
        series: [],
        blog: [],
        species: [],
        characters: [],
        pages: []
      });
      return;
    }

    try {
      // Search books
      const foundBooks = data.books.filter(book => 
        matchesQuery(book.title, query) ||
        matchesQuery(book.description, query) ||
        matchesQuery(book.author, query) ||
        matchesQuery(book.series, query)
      );

      // Search series
      const foundSeries = data.series.filter(s => 
        matchesQuery(s.title, query) ||
        matchesQuery(s.description, query)
      );

      // Search blog posts
      const foundBlog = data.blog.filter(post => 
        matchesQuery(post.title, query) ||
        matchesQuery(post.description, query)
      );

      // Search species
      const foundSpecies = data.species.filter(s => 
        matchesQuery(s.name, query) ||
        matchesQuery(s.description, query)
      );

      // Search characters
      const foundCharacters = data.characters.filter(c => 
        matchesQuery(c.name, query) ||
        matchesQuery(c.description, query)
      );

      // Search pages
      const foundPages = data.pages.filter(p => 
        matchesQuery(p.title, query)
      );


      setResults({
        books: foundBooks,
        series: foundSeries,
        blog: foundBlog,
        species: foundSpecies,
        characters: foundCharacters,
        pages: foundPages
      });
    } catch (err) {
      console.error('Error in performSearch:', err);
    }
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('q') as string;
    
    if (query) {
      // Update URL
      window.history.pushState({}, '', `/search?q=${encodeURIComponent(query)}`);
      setSearchQuery(query);
      
      if (searchData) {
        performSearch(query, searchData);
      }
    }
  };

  const totalResults = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);

  // Get filtered results based on active tab
  const getFilteredResults = () => {
    if (activeTab === 'all') return results;
    return {
      books: activeTab === 'books' ? results.books : [],
      series: activeTab === 'series' ? results.series : [],
      blog: activeTab === 'blog' ? results.blog : [],
      species: activeTab === 'species' ? results.species : [],
      characters: activeTab === 'characters' ? results.characters : [],
      pages: []
    };
  };

  const filteredResults = getFilteredResults();

  if (error) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="text-4xl mb-4">❌</div>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-pulse">🔍</div>
            <p className="text-gray-600">Loading search...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Search Header */}
      <section className="py-12 bg-gradient-to-br from-deep-space-navy via-nebula-purple to-deep-space-navy relative overflow-hidden">
        {/* Animated background stars */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            animation: 'twinkle 3s ease-in-out infinite'
          }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-primary font-bold text-solar-white mb-6">
              {searchQuery ? (
                <>Search Results for "<span className="text-stellar-gold">{searchQuery}</span>"</>
              ) : (
                <>Search <span className="bg-gradient-aurora bg-clip-text text-transparent">My Universe</span></>
              )}
            </h1>
            
            {searchQuery && (
              <p className="text-lg text-solar-white/80 mb-6">
                Found {totalResults} result{totalResults !== 1 ? 's' : ''} matching your search
              </p>
            )}
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  name="q"
                  defaultValue={searchQuery}
                  placeholder="Search books, series, species, characters..."
                  className="w-full bg-solar-white/10 backdrop-blur-sm border-2 border-cosmic-rose/30 
                         rounded-lg px-6 py-4 pl-12 text-solar-white placeholder-solar-white/60 text-lg
                         focus:outline-none focus:border-cosmic-rose focus:shadow-cosmic
                         transition-all duration-200"
                  aria-label="Search"
                />
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-solar-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-stellar-gold text-deep-space-navy rounded font-bold text-sm hover:bg-stellar-gold/90 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {!searchQuery && searchData && (
          /* Empty State */
          <div className="text-center">
            <div className="max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl font-bold text-deep-space-navy mb-4">
                Discover Your Next Favorite Story
              </h2>
              <p className="text-gray-600 mb-8">
                Explore my entire universe of alien romance novels, fascinating species, memorable characters, and immersive worlds.
              </p>
            </div>

            {/* Popular Searches */}
            <div className="mb-12">
              <h3 className="text-lg font-semibold text-deep-space-navy mb-4">Popular Searches</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {popularSearches.map((search) => (
                  <a 
                    key={search}
                    href={`/search?q=${encodeURIComponent(search)}`}
                    className="group px-4 py-2 bg-white border-2 border-gray-200 rounded-full text-sm text-gray-700 hover:border-cosmic-rose hover:text-cosmic-rose hover:shadow-lg transition-all duration-200"
                  >
                    <span className="group-hover:scale-105 inline-block transition-transform">
                      {search}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                { icon: '📚', count: searchData.books.length, label: 'Books', color: 'from-cosmic-rose to-nebula-purple' },
                { icon: '🌌', count: searchData.series.length, label: 'Series', color: 'from-deep-space-navy to-nebula-purple' },
                { icon: '👽', count: searchData.species.length, label: 'Species', color: 'from-stellar-gold to-cosmic-rose' },
                { icon: '👤', count: searchData.characters.length, label: 'Characters', color: 'from-nebula-purple to-cosmic-rose' },
                { icon: '✍️', count: searchData.blog.length, label: 'Blog Posts', color: 'from-cosmic-rose to-stellar-gold' },
              ].map((stat, index) => (
                <div key={index} className="group cursor-pointer transform hover:scale-105 transition-all duration-200">
                  <div className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white shadow-lg hover:shadow-2xl`}>
                    <div className="text-4xl mb-3 transform group-hover:rotate-12 transition-transform">
                      {stat.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-1">
                      {stat.count}
                    </h3>
                    <p className="text-sm opacity-90">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {searchQuery && totalResults === 0 && (
          /* No Results */
          <div className="text-center py-12">
            <div className="text-6xl mb-6 animate-bounce">🔭</div>
            <h2 className="text-2xl font-bold text-deep-space-navy mb-4">
              No Results Found
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We couldn't find anything matching "{searchQuery}". Try a different search term or explore our popular categories.
            </p>
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-deep-space-navy mb-4">Try these instead:</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {popularSearches.slice(0, 4).map((search) => (
                  <a 
                    key={search}
                    href={`/search?q=${encodeURIComponent(search)}`}
                    className="px-4 py-2 bg-gradient-to-r from-cosmic-rose to-nebula-purple text-white rounded-full hover:shadow-lg transition-all duration-200"
                  >
                    {search}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {searchQuery && totalResults > 0 && (
          /* Search Results with Tabs */
          <div>
            {/* Results Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {[
                { key: 'all', label: 'All', count: totalResults },
                { key: 'books', label: 'Books', count: results.books.length },
                { key: 'series', label: 'Series', count: results.series.length },
                { key: 'characters', label: 'Characters', count: results.characters.length },
                { key: 'species', label: 'Species', count: results.species.length },
                { key: 'blog', label: 'Blog', count: results.blog.length },
              ].map((tab) => (
                tab.count > 0 && (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 ${
                      activeTab === tab.key
                        ? 'bg-gradient-to-r from-cosmic-rose to-nebula-purple text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:shadow-md border border-gray-200'
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                )
              ))}
            </div>

            {/* Search Results */}
            <div className="space-y-12">
              {/* Books Results */}
              {filteredResults.books.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-deep-space-navy mb-6 flex items-center">
                    <span className="text-3xl mr-3">📚</span>
                    Books ({filteredResults.books.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredResults.books.map((book) => (
                      <BookSearchCard key={book.id} book={book} />
                    ))}
                  </div>
                </section>
              )}

              {/* Series Results */}
              {filteredResults.series.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-deep-space-navy mb-6 flex items-center">
                    <span className="text-3xl mr-3">🌌</span>
                    Series ({filteredResults.series.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResults.series.map((seriesItem) => (
                      <SeriesSearchCard key={seriesItem.id} series={seriesItem} />
                    ))}
                  </div>
                </section>
              )}

              {/* Characters Results */}
              {filteredResults.characters.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-deep-space-navy mb-6 flex items-center">
                    <span className="text-3xl mr-3">👤</span>
                    Characters ({filteredResults.characters.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredResults.characters.map((character) => (
                      <CharacterSearchCard key={character.id} character={character} />
                    ))}
                  </div>
                </section>
              )}

              {/* Species Results */}
              {filteredResults.species.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-deep-space-navy mb-6 flex items-center">
                    <span className="text-3xl mr-3">👽</span>
                    Species ({filteredResults.species.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResults.species.map((item) => (
                      <SpeciesSearchCard key={item.id} species={item} />
                    ))}
                  </div>
                </section>
              )}

              {/* Blog Results */}
              {filteredResults.blog.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-deep-space-navy mb-6 flex items-center">
                    <span className="text-3xl mr-3">✍️</span>
                    Blog Posts ({filteredResults.blog.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResults.blog.map((post) => (
                      <BlogSearchCard key={post.id} post={post} />
                    ))}
                  </div>
                </section>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchClientEnhanced;