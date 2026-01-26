import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

const RecommendedContent = ({similarPosts = []}) => {
  const [loadedImages, setLoadedImages] = useState({});
  const defaultImage = '/img/logo/main.png';

  const handleImageError = (postId) => {
    setLoadedImages(prev => ({
      ...prev,
      [postId]: defaultImage
    }));
  };

  const truncateText = (text, length) => {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  const stripTags = (html) => {
    if (!html) return '';
    return html.replace(/<\/?[^>]+(>|$)/g, '');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (!similarPosts || similarPosts.length === 0) {
    return null;
  }

  return (
    <div className="my-4">
      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: '1.5rem',
        paddingBottom: '0.75rem',
        borderBottom: '2px solid #e5e7eb'
      }}>
        Recommended Articles
      </h3>
      
      <div className="recommended-list">
        {similarPosts.slice(0, 6).map((post, index) => {
          const imageUrl = `${(import.meta.env.VITE_R2_PUBLIC_URL || '').replace(/\/$/, '')}/uploads/opp/${post.cover_img}`;
          const coverImage = loadedImages[post.id] || imageUrl;

          return (
            <Link 
              key={post.id} 
              href={`/op/${post.id}/${post.slug}`}
              className="text-decoration-none"
            >
              <article 
                className="d-flex gap-3 py-3"
                style={{
                  borderBottom: index < similarPosts.slice(0, 6).length - 1 ? '1px solid #f3f4f6' : 'none',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {/* Thumbnail */}
                <div style={{
                  width: '100px',
                  height: '75px',
                  flexShrink: 0,
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: '#f3f4f6'
                }}>
                  <img 
                    src={coverImage}
                    loading="lazy"
                    alt={post.title}
                    onError={() => handleImageError(post.id)}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                
                {/* Content */}
                <div className="flex-grow-1" style={{minWidth: 0}}>
                  <h4 style={{
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    marginBottom: '0.375rem',
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {post.title}
                  </h4>
                  <p style={{
                    fontSize: '0.8rem',
                    color: '#6b7280',
                    marginBottom: 0
                  }}>
                    {formatDate(post.created_at)}
                    {post.deadline && (
                      <span style={{color: '#dc2626'}}> · Deadline: {formatDate(post.deadline)}</span>
                    )}
                  </p>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
      
      {similarPosts.length > 6 && (
        <div className="text-center mt-3">
          <Link 
            href="/opportunities"
            className="btn btn-outline-secondary btn-sm px-4"
            style={{borderRadius: '8px', fontSize: '0.85rem'}}
          >
            View More Opportunities
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecommendedContent;