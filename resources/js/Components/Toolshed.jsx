import React, { useEffect, useCallback, useMemo, useState, Suspense } from "react";
import { Image, Card, Badge } from "react-bootstrap";
import axios from "axios";
import Swal from 'sweetalert2';
import { Link } from "@inertiajs/react";
import { getDaysLeft, toggleShare, createSharingLinks, bookmark, pageLink } from "@/utils/Index";
import { router } from '@inertiajs/react';

const DisplayToolshed = ({ data, showLabels }) => {
  const [loadedImages, setLoadedImages] = useState({});

  // Fallback image URL - replace with your actual fallback image
  const fallbackImageUrl = "/img/logo/main_2.png";

  const handleImageError = (e) => {
    e.target.src = fallbackImageUrl;
  };

  useEffect(() => {
    // Small timeout to ensure DOM is fully rendered with new data
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              const dataSrc = img.dataset.src;
              
              if (dataSrc && (img.src.includes('data:image') || img.src.includes('R0lGODlh'))) {
                img.src = dataSrc;
                
                // Set onload handler to handle successful loading
                img.onload = () => {
                  img.classList.remove("lazy-load");
                  const id = img.dataset.id;
                  setLoadedImages(prev => ({...prev, [id]: true}));
                };
                
                // Set onerror handler to use fallback
                img.onerror = handleImageError;
              }
              
              observer.unobserve(img);
            }
          });
        },
        { rootMargin: "200px" } // Increased margin to start loading earlier
      );
  
      // Get all lazy-load images
      const lazyImages = document.querySelectorAll(".lazy-load");
      lazyImages.forEach(img => observer.observe(img));
  
      return () => {
        observer.disconnect();
      };
    }, 50); // Small delay to ensure DOM is ready
    
    return () => clearTimeout(timer);
  }, [data]);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });


  const isValidImage = (img) => {
    return img && typeof img === 'string' && img.trim() !== '';
  };

  const escapeHTML = (text) => {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const truncateText = (text, length) => {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  const stripHTMLTags = (html) => {
    if (!html) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };


  function convertToProperNoun(input) {
    // Check if input is null, undefined, or not a string
    if (!input || typeof input !== 'string') {
        return ''; // Return an empty string or handle the case as needed
    }
    // Split the input string on commas first
    let items = input.split(',');
    let output = "";

    // Process each item
    let badges = items.map((item, index) => {
        // Split the item on spaces, underscores, or hyphens
        let words = item.trim().split(/[\s_-]+/);

        // Capitalize the first letter of each word
        let capitalizedWords = words.map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        );

        // Join the capitalized words back into a string
        output = capitalizedWords.join(" ");

        // Create a badge for each output
        return (<span key={index} className='data-labels poppins-semibold text-secondary my-1 py-1 me-1 fs-8'>
        {output}
        </span>);
    });

    return badges;
}


  // Function to handle image loading manually instead of using the IntersectionObserver
  const handleImageLoad = useCallback((imageId, imageSrc) => {
    return () => {
      setLoadedImages(prev => ({
        ...prev,
        [imageId]: true
      }));
    };
  }, []);


  return (
    <div>
      <style>{`
        .share-btn:hover,
        .share-btn:focus,
        .share-btn:active {
          background-color: transparent !important;
          border-color: transparent !important;
          color: #374151 !important;
          transform: none !important;
          border: none !important;
          box-shadow: none !important;
        }
        
        .share-btn:hover .material-symbols-outlined {
          font-weight: 600 !important;
          color: #374151 !important;
        }
        
        .bookmark-btn:hover,
        .bookmark-btn:focus,
        .bookmark-btn:active {
          background-color: transparent !important;
          border-color: transparent !important;
          transform: none !important;
          border: none !important;
          box-shadow: none !important;
        }
        
        .bookmark-btn:hover .material-symbols-outlined {
          font-weight: 600 !important;
          font-variation-settings: "FILL" 1, "wght" 600, "GRAD" 0, "opsz" 24 !important;
        }
        
        .bookmark-btn:hover svg,
        .bookmark-btn:hover .material-symbols-outlined {
          fill: inherit !important;
        }
      `}</style>

      <div className="row g-4">
      {!data || data.length === 0 ? (
        <div className="col-12">
          <div className="text-center py-5">
            <h4 className="text-muted">No tools found</h4>
            <p className="text-muted">Try adjusting your filters or check back later.</p>
          </div>
        </div>
      ) : (
        data.map((tool, index) => {
          const hasImage = tool.cover_img && isValidImage(tool.cover_img);
          const imageId = `img-${tool.id || index}`;
          // Check if tool is trending
          const isTrending = tool.is_trending;
        
        return (
          <div key={tool.id || index} className="col-md-6 col-lg-4">
            <Card className="h-100 border-0 shadow-sm position-relative tool-card" style={{ transition: 'transform 0.2s' }}>
              {/* Trending Badge */}
              {isTrending && (
                <Badge 
                  className="position-absolute top-0 start-50 translate-middle-x mt-3 trending-badge"
                  style={{ 
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                    fontSize: '10px',
                    fontWeight: '600',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    zIndex: 2,
                    boxShadow: '0 2px 4px rgba(238, 90, 36, 0.3)',
                    animation: 'pulse 2s infinite',
                    border: 'none',
                    color: 'white'
                  }}
                  title={`Trending since ${tool.trending_since ? new Date(tool.trending_since).toLocaleDateString() : 'recently'}`}
                >
                  🔥 Trending
                </Badge>
              )}
              
              <Card.Body className="px-2 py-1 d-flex flex-column" style={{ minHeight: '320px' }}>
                <div className="mb-2">
                  {hasImage ? (
                    <div 
                      className="rounded d-inline-flex align-items-center justify-content-center mb-3"
                      style={{ 
                        width: '60px', 
                        height: '60px',
                        overflow: 'hidden'
                      }}
                    >
                      <Image
                        src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
                        data-src={`${(import.meta.env.VITE_R2_PUBLIC_URL || '').replace(/\/$/, '')}/uploads/prod/${tool.cover_img}`}
                        data-id={imageId}
                        alt={`Cover image for ${tool.product_name}`}
                        className="img-fluid w-100 h-100 object-fit-cover lazy-load rounded"
                        onError={handleImageError}
                        onLoad={handleImageLoad(imageId, tool.cover_img)}
                        style={{ backgroundColor: '#f8f9fa' }}
                      />
                    </div>
                  ) : (
                    <div 
                      className="rounded d-inline-flex align-items-center justify-content-center mb-3"
                      style={{ 
                        width: '60px', 
                        height: '60px', 
                        backgroundColor: '#3b82f6' + '20',
                        fontSize: '24px'
                      }}
                    >
                      🛠️
                    </div>
                  )}
                </div>
                
                {/* Rating Display - Moved to top */}
                <div className="d-flex align-items-center mb-2">
                  <div className="d-flex align-items-center me-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star}
                        className={`material-symbols-outlined ${star <= Math.round(tool.average_rating || 0) ? 'text-warning' : 'text-muted'}`}
                        style={{ 
                          fontSize: '14px',
                          fontVariationSettings: star <= Math.round(tool.average_rating || 0) ? '"FILL" 1' : '"FILL" 0'
                        }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                    {tool.average_rating ? parseFloat(tool.average_rating).toFixed(1) : '0.0'} ({tool.total_ratings || 0})
                  </span>
                </div>

                <Link
                  href={pageLink('product', tool.slug, tool.id)}
                  className="text-decoration-none text-dark tool-title-link"
                >
                  <h5 
                    className="fw-bold mb-2" 
                    style={{ 
                      fontSize: '1.1rem', 
                      transition: 'color 0.3s ease',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'block'
                    }}
                    title={tool.product_name}
                  >
                    {tool.product_name}
                  </h5>
                </Link>
                
                {/* Labels - conditionally shown */}
                {showLabels && (
                  <>
                    {/* Category/Sector Labels - matching other data labels style */}
                    {(tool.category_name || tool.categories) && (
                      <div className="mb-2">
                        {convertToProperNoun(tool.category_name || (tool.categories && tool.categories.length > 0 ? tool.categories[0].name : 'General'))}
                      </div>
                    )}

                    {/* Data Labels - matching opportunities page style */}
                    {tool.brand_labels && (
                      <div className="mb-2">
                        {convertToProperNoun(tool.brand_labels)}
                      </div>
                    )}
                    
                    {tool.tags && (
                      <div className="mb-2">
                        {convertToProperNoun(tool.tags)}
                      </div>
                    )}
                  </>
                )}
                
                {/* Product Description - 50 words max, 2 lines max */}
                <p 
                  className="text-muted mb-3" 
                  style={{ 
                    fontSize: '0.875rem', 
                    lineHeight: '1.5',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: '2',
                    WebkitBoxOrient: 'vertical',
                    minHeight: '2.625rem'
                  }}
                  title={stripHTMLTags(tool.description)}
                >
                  {stripHTMLTags(tool.description)?.split(' ').slice(0, 50).join(' ')}
                </p>
                
                <div className="d-flex justify-content-between align-items-center mb-3 mt-auto">
                  <div className="d-flex align-items-center gap-3">
                    {/* Share Button */}
                    <div className="position-relative">
                      <div className="position-absolute share-panel d-none" style={{
                        top: 'auto',
                        right: '0px',
                        bottom: '45px',
                        zIndex: 1050,
                        minWidth: '280px'
                      }}></div>
                      <button 
                        className="btn p-0 share-btn"
                        data-title={tool.product_name} 
                        data-id={tool.id} 
                        onClick={(e) => toggleShare(e.currentTarget)}
                        style={{ 
                          border: 'none',
                          background: 'transparent',
                          color: '#6b7280',
                          boxShadow: 'none'
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '22px', fontWeight: '400', color: 'inherit' }}>
                          share
                        </span>
                      </button>
                    </div>
                    
                    {/* Bookmark Button - Filled */}
                    <button 
                      className="btn p-0 bookmark-btn"
                      data-id={tool.id}
                      data-title={tool.product_name}
                      data-type="tool"
                      data-url={pageLink('product', tool.id, tool.slug)}
                      onClick={(e) => bookmark(e.currentTarget)}
                      style={{ 
                        border: 'none',
                        background: 'transparent',
                        boxShadow: 'none'
                      }}
                    >
                      <span 
                        className="material-symbols-outlined" 
                        style={{ 
                          fontSize: '22px',
                          fontWeight: '400',
                          fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
                          color: (tool.is_bookmarked === 1) ? '#FFD700' : '#6b7280'
                        }}
                      >
                        bookmark
                      </span>
                    </button>
                  </div>
                </div>
                
                {/* Spacer to push button to bottom */}
                <div className="flex-grow-1"></div>
                
                {/* Try Now Button - Separate at Bottom */}
                <Link
                  href={pageLink('product', tool.slug, tool.id)}
                  className="btn btn-dark w-100 d-flex align-items-center justify-content-center text-decoration-none"
                  style={{ 
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    fontWeight: '500',
                    fontSize: '0.9rem'
                  }}
                >
                  Try Now
                  <span className="material-symbols-outlined ms-2" style={{ fontSize: '16px' }}>arrow_forward</span>
                </Link>
              </Card.Body>
            </Card>
          </div>
        );
      })
      )}
      </div>
    </div>
  );


};

export default DisplayToolshed;