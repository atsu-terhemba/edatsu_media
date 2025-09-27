import React, { useEffect, useCallback, useMemo, useState, Suspense } from "react";
import { Image, Card, Badge } from "react-bootstrap";
import axios from "axios";
import Swal from 'sweetalert2';
import { Link } from "@inertiajs/react";
import { getDaysLeft, toggleShare, createSharingLinks, bookmark, pageLink } from "@/utils/Index";
import { router } from '@inertiajs/react';
import { ArrowRight, Star } from 'lucide-react';

const DisplayToolshed = ({ data }) => {
  const [loadedImages, setLoadedImages] = useState({});
  const [showLabels, setShowLabels] = useState(false);

  // Debug logging
  console.log('DisplayToolshed received data:', data);
  console.log('Data type:', typeof data);
  console.log('Data length:', data?.length);

  // Fallback image URL - replace with your actual fallback image
  const fallbackImageUrl = "img/logo/main_2.png";  const handleImageError = (e) => {
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
      {/* Toggle Labels Button */}
      <div className="d-flex justify-content-end mb-3">
        <button 
          className="btn btn-outline-secondary btn-sm"
          onClick={() => setShowLabels(!showLabels)}
          style={{
            borderRadius: '8px',
            transition: 'all 0.3s ease'
          }}
        >
          <span className="material-symbols-outlined me-2" style={{ fontSize: '16px' }}>
            {showLabels ? 'visibility_off' : 'visibility'}
          </span>
          {showLabels ? 'Hide Labels' : 'Show Labels'}
        </button>
      </div>

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
          // Add trending logic - for demo, make first tool trending
          const isTrending = index === 0 || tool.is_trending;
        
        return (
          <div key={tool.id || index} className="col-md-6 col-lg-4">
            <Card className="h-100 border-0 shadow-sm position-relative tool-card" style={{ transition: 'transform 0.2s' }}>
              {/* Trending Badge */}
              {isTrending && (
                <Badge 
                  className="position-absolute top-0 start-50 translate-middle-x mt-3"
                  style={{ 
                    backgroundColor: '#007bff',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    zIndex: 2
                  }}
                >
                  🔥 Trending
                </Badge>
              )}
              
              <Card.Body className="p-4 d-flex flex-column" style={{ height: '400px' }}>
                <div className="mb-3">
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
                        data-src={`storage/public/uploads/prod/${tool.cover_img}`}
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
                
                <Link
                  href={pageLink('product', tool.id, tool.slug)}
                  className="text-decoration-none text-dark tool-title-link"
                >
                  <h5 className="fw-bold mb-2" style={{ fontSize: '1.1rem', transition: 'color 0.3s ease' }}>
                    {truncateText(tool.product_name, 40)}
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
                
                <p className="text-muted mb-4" style={{ 
                  fontSize: '0.9rem', 
                  lineHeight: '1.5',
                  height: showLabels ? 'auto' : '4.5rem',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: showLabels ? 'none' : '3',
                  WebkitBoxOrient: 'vertical'
                }}>
                  {truncateText(tool.description, showLabels ? 200 : 120)}
                </p>
                
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <div className="fw-bold text-dark mb-1" style={{ fontSize: '1.1rem' }}>
                      Free
                    </div>
                    {/* Rating Display */}
                    <div className="d-flex align-items-center">
                      <div className="d-flex align-items-center me-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            size={14} 
                            className={star <= Math.round(tool.average_rating || 0) ? 'text-warning' : 'text-muted'} 
                            fill={star <= Math.round(tool.average_rating || 0) ? 'currentColor' : 'none'}
                          />
                        ))}
                      </div>
                      <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                        {tool.average_rating ? parseFloat(tool.average_rating).toFixed(1) : '0.0'} ({tool.total_ratings || 0})
                      </span>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-center gap-2">
                    {/* Share Button with Panel */}
                    <div className="position-relative">
                      <div className="position-absolute share-panel d-none" style={{
                        top: 'auto',
                        right: '0px',
                        bottom: '45px',
                        zIndex: 1050,
                        minWidth: '280px'
                      }}></div>
                      <button 
                        className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center share-btn"
                        data-title={tool.product_name} 
                        data-id={tool.id} 
                        onClick={(e) => toggleShare(e.currentTarget)}
                        style={{ 
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                          share
                        </span>
                      </button>
                    </div>
                    
                    {/* Bookmark Button */}
                    <button 
                      className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center bookmark-btn"
                      data-id={tool.id}
                      data-title={tool.product_name}
                      data-type="tool"
                      data-url={pageLink('product', tool.id, tool.slug)}
                      onClick={(e) => bookmark(e.currentTarget)}
                      style={{ 
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        height="16px" 
                        viewBox="0 -960 960 960" 
                        width="16px" 
                        fill={`${(tool.is_bookmarked === 1)? '#FFD700' : '#6B7280'}`}
                        style={{ transition: 'fill 0.3s ease' }}
                      >
                        <path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Z"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Spacer to push button to bottom */}
                <div className="flex-grow-1"></div>
                
                {/* Try Now Button - Separate at Bottom */}
                <Link
                  href={tool.direct_link || pageLink('product', tool.id, tool.slug)}
                  target={tool.direct_link ? "_blank" : "_self"}
                  className="btn btn-dark w-100 d-flex align-items-center justify-content-center text-decoration-none"
                  style={{ 
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    fontWeight: '500',
                    fontSize: '0.9rem'
                  }}
                >
                  Try Now
                  <ArrowRight size={16} className="ms-2" />
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