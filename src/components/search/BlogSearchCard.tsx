import React from 'react';

interface BlogSearchCardProps {
  post: {
    id: string;
    title: string;
    description?: string;
    category?: string;
    tags?: string[];
    pubDate?: string;
  };
}

const BlogSearchCard: React.FC<BlogSearchCardProps> = ({ post }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <article className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
      {/* Category banner */}
      {post.category && (
        <div className="h-2 bg-gradient-aurora" />
      )}
      
      <div className="p-5">
        {/* Meta info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {post.category && (
              <span className="text-xs font-semibold text-cosmic-rose uppercase tracking-wider">
                {post.category.replace('-', ' ')}
              </span>
            )}
            {post.pubDate && (
              <>
                <span className="text-gray-400">•</span>
                <time className="text-xs text-gray-500">
                  {formatDate(post.pubDate)}
                </time>
              </>
            )}
          </div>
          <span className="text-2xl opacity-50">✍️</span>
        </div>
        
        {/* Title */}
        <h3 className="font-bold text-lg text-deep-space-navy mb-2 line-clamp-2 group-hover:text-cosmic-rose transition-colors">
          {post.title}
        </h3>
        
        {/* Description */}
        {post.description && (
          <p className="text-sm text-gray-600 line-clamp-3 mb-3">
            {post.description}
          </p>
        )}
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Read more link */}
        <a 
          href={`/blog/${post.id}`}
          className="inline-flex items-center text-sm font-semibold text-cosmic-rose hover:text-nebula-purple transition-colors"
        >
          Read Post
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </article>
  );
};

export default BlogSearchCard;