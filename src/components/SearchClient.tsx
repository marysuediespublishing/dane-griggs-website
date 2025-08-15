import React, { useState, useEffect } from 'react';
import BookCard from './ui/BookCard';

interface SearchData {
  books: any[];
  series: any[];
  blog: any[];
  species: any[];
  characters: any[];
  pages: any[];
  locations: any[];
}

const SearchClient: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<{
    books: any[];
    series: any[];
    blog: any[];
    species: any[];
    characters: any[];
    pages: any[];
    locations: any[];
  }>({
    books: [],
    series: [],
    blog: [],
    species: [],
    characters: [],
    pages: [],
    locations: []
  });

  // Popular searches for empty state
  const popularSearches = [
    'alien romance',
    'cerastean',
    'kraken',
    'cryzorian',
    'space station',
    'medical romance',
    'Saving Ceraste',
    'Ravok',
    'strong heroine'
  ];

  // Load search data and get query from URL
  useEffect(() => {
    // Get query from URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q') || '';
    setSearchQuery(query);

    // Load search index
    fetch('/api/search-index.json')
      .then(res => res.json())
      .then(data => {
        setSearchData(data);
        setLoading(false);
        if (query) {
          performSearch(query, data);
        }
      })
      .catch(err => {
        console.error('Failed to load search data:', err);
        setLoading(false);
      });
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
        pages: [],
        locations: []
      });
      return;
    }

    // Search books
    const foundBooks = data.books.filter(book => 
      matchesQuery(book.title, query) ||
      matchesQuery(book.description, query) ||
      matchesQuery(book.author, query) ||
      matchesQuery(book.series, query) ||
      (book.species && book.species.some((s: string) => matchesQuery(s, query))) ||
      (book.alienSpecies && book.alienSpecies.some((s: string) => matchesQuery(s, query))) ||
      (book.genres && book.genres.some((g: string) => matchesQuery(g, query))) ||
      (book.setting && book.setting.some((s: string) => matchesQuery(s, query)))
    );

    // Search series
    const foundSeries = data.series.filter(s => 
      matchesQuery(s.title, query) ||
      matchesQuery(s.description, query) ||
      matchesQuery(s.worldBuilding, query) ||
      (s.species && s.species.some((sp: string) => matchesQuery(sp, query))) ||
      (s.alienSpecies && s.alienSpecies.some((sp: string) => matchesQuery(sp, query)))
    );

    // Search blog posts
    const foundBlog = data.blog.filter(post => 
      matchesQuery(post.title, query) ||
      matchesQuery(post.description, query) ||
      matchesQuery(post.category, query) ||
      (post.tags && post.tags.some((tag: string) => matchesQuery(tag, query)))
    );

    // Search species
    const foundSpecies = data.species.filter(s => 
      matchesQuery(s.name, query) ||
      matchesQuery(s.description, query) ||
      matchesQuery(s.physicalTraits, query) ||
      matchesQuery(s.cultureNotes, query) ||
      matchesQuery(s.biologyNotes, query)
    );

    // Search characters
    const foundCharacters = data.characters.filter(c => 
      matchesQuery(c.name, query) ||
      matchesQuery(c.description, query) ||
      matchesQuery(c.species, query) ||
      (c.books && c.books.some((book: string) => matchesQuery(book, query))) ||
      (c.cameos && c.cameos.some((cameo: string) => matchesQuery(cameo, query)))
    );

    // Search pages
    const foundPages = data.pages.filter(p => 
      matchesQuery(p.title, query) ||
      matchesQuery(p.heroTitle, query) ||
      matchesQuery(p.heroTagline, query) ||
      matchesQuery(p.authorBio, query)
    );

    // Search locations
    const foundLocations = data.locations.filter(l => 
      matchesQuery(l.name, query) ||
      matchesQuery(l.description, query) ||
      matchesQuery(l.environmentType, query)
    );

    setResults({
      books: foundBooks,
      series: foundSeries,
      blog: foundBlog,
      species: foundSpecies,
      characters: foundCharacters,
      pages: foundPages,
      locations: foundLocations
    });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-600">Loading search...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Search Header */}
      <section className="py-12 bg-gradient-to-br from-deep-space-navy via-nebula-purple to-deep-space-navy">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-primary font-bold text-solar-white mb-6">
              {searchQuery ? (
                <>Search Results for "<span className="text-stellar-gold">{searchQuery}</span>"</>
              ) : (
                <>Search <span className="bg-gradient-aurora bg-clip-text text-transparent">My Books</span></>
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
                         rounded-lg px-6 py-4 text-solar-white placeholder-solar-white/60 text-lg
                         focus:outline-none focus:border-cosmic-rose focus:shadow-cosmic
                         transition-all duration-200"
                  aria-label="Search"
                />
                <button 
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-solar-white/60 hover:text-solar-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
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
                Discover Your Next Favorite Book
              </h2>
              <p className="text-gray-600 mb-8">
                Search through my entire collection of alien romance novels, series, species, characters, and blog posts.
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
                    className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 hover:border-cosmic-rose hover:text-cosmic-rose transition-colors"
                  >
                    {search}
                  </a>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-lg font-semibold text-deep-space-navy mb-2">
                  {searchData.books.length} Books
                </h3>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🌌</div>
                <h3 className="text-lg font-semibold text-deep-space-navy mb-2">
                  {searchData.series.length} Series
                </h3>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">👽</div>
                <h3 className="text-lg font-semibold text-deep-space-navy mb-2">
                  {searchData.species.length} Species
                </h3>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">👤</div>
                <h3 className="text-lg font-semibold text-deep-space-navy mb-2">
                  {searchData.characters.length} Characters
                </h3>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">✍️</div>
                <h3 className="text-lg font-semibold text-deep-space-navy mb-2">
                  {searchData.blog.length} Blog Posts
                </h3>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🏛️</div>
                <h3 className="text-lg font-semibold text-deep-space-navy mb-2">
                  {searchData.locations.length} Locations
                </h3>
              </div>
            </div>
          </div>
        )}

        {searchQuery && totalResults === 0 && (
          /* No Results */
          <div className="text-center py-12">
            <div className="text-6xl mb-6">🔭</div>
            <h2 className="text-2xl font-bold text-deep-space-navy mb-4">
              No Results Found
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We couldn't find anything matching "{searchQuery}".
            </p>
          </div>
        )}

        {searchQuery && totalResults > 0 && (
          /* Search Results */
          <div className="space-y-12">
            {/* Books Results */}
            {results.books.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-deep-space-navy mb-6">
                  Books ({results.books.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {results.books.map((book) => (
                    <BookCard 
                      key={book.id}
                      book={book}
                      variant="standard"
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Series Results */}
            {results.series.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-deep-space-navy mb-6">
                  Series ({results.series.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.series.map((seriesItem) => (
                    <div key={seriesItem.id} className="bg-white rounded-xl p-6 shadow-lg">
                      <h3 className="text-xl font-bold text-deep-space-navy mb-2">
                        {seriesItem.title}
                      </h3>
                      <p className="text-gray-600 mb-4 text-sm">
                        {seriesItem.description}
                      </p>
                      <a 
                        href={`/series/${seriesItem.id}`}
                        className="btn btn-secondary btn-sm"
                      >
                        Explore Series
                      </a>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Other result sections can be added similarly */}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchClient;