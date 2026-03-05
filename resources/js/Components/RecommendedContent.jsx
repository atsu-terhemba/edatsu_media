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
    <div>
      {/* Section header with eyebrow */}
      <div className="d-flex flex-column align-items-start mb-4">
        <span
          className="section-eyebrow"
          style={{ color: '#86868b' }}
        >
          Related
        </span>
        <div className="eyebrow-bar" style={{ margin: '8px 0 0' }} />
      </div>
      <h3 style={{
        fontSize: '24px',
        fontWeight: 600,
        color: '#000',
        marginBottom: '24px',
        letterSpacing: '-0.01em',
      }}>
        Recommended Articles
      </h3>

      <div>
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
                className="d-flex gap-3"
                style={{
                  padding: '16px 0',
                  borderBottom: index < similarPosts.slice(0, 6).length - 1 ? '1px solid #f0f0f0' : 'none',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f7'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {/* Thumbnail */}
                <div style={{
                  width: '80px',
                  height: '60px',
                  flexShrink: 0,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: '#f5f5f7'
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
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#000',
                    marginBottom: '4px',
                    lineHeight: 1.3,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {post.title}
                  </h4>
                  <p style={{
                    fontSize: '12px',
                    color: '#86868b',
                    marginBottom: 0
                  }}>
                    {formatDate(post.created_at)}
                    {post.deadline && (
                      <span style={{ color: '#f97316' }}> · {formatDate(post.deadline)}</span>
                    )}
                  </p>
                </div>
              </article>
            </Link>
          );
        })}
      </div>

      {similarPosts.length > 6 && (
        <div className="text-center" style={{ marginTop: '24px' }}>
          <Link
            href="/opportunities"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '10px 24px',
              borderRadius: '9999px',
              border: '1px solid #e5e5e5',
              color: '#000',
              fontSize: '13px',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#000'; e.currentTarget.style.background = '#000'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#000'; }}
          >
            View More
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecommendedContent;
