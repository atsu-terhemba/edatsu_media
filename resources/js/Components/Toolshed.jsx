import React, { useEffect, useCallback, useState } from "react";
import { Image } from "react-bootstrap";
import axios from "axios";
import Swal from 'sweetalert2';
import { Link } from "@inertiajs/react";
import { getDaysLeft, bookmark, pageLink } from "@/utils/Index";
import ShareButton from '@/Components/ShareButton';

const DisplayToolshed = ({ data, showLabels }) => {
  const [loadedImages, setLoadedImages] = useState({});
  const fallbackImageUrl = "/img/logo/main_2.png";

  const handleImageError = (e) => {
    e.target.src = fallbackImageUrl;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              const dataSrc = img.dataset.src;
              if (dataSrc && (img.src.includes('data:image') || img.src.includes('R0lGODlh'))) {
                img.src = dataSrc;
                img.onload = () => {
                  img.classList.remove("lazy-load");
                  const id = img.dataset.id;
                  setLoadedImages(prev => ({...prev, [id]: true}));
                };
                img.onerror = handleImageError;
              }
              observer.unobserve(img);
            }
          });
        },
        { rootMargin: "200px" }
      );
      const lazyImages = document.querySelectorAll(".lazy-load");
      lazyImages.forEach(img => observer.observe(img));
      return () => observer.disconnect();
    }, 50);
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

  const stripHTMLTags = (html) => {
    if (!html) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const handleImageLoad = useCallback((imageId) => {
    return () => {
      setLoadedImages(prev => ({
        ...prev,
        [imageId]: true
      }));
    };
  }, []);

  return (
    <div>
      <div className="row g-4">
        {!data || data.length === 0 ? (
          <div className="col-12">
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ padding: '64px 24px' }}>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '48px', color: '#e5e5e5', marginBottom: '16px' }}
              >
                construction
              </span>
              <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#000', marginBottom: '8px' }}>
                No tools found
              </h4>
              <p style={{ fontSize: '13px', color: '#86868b', margin: 0 }}>
                Try adjusting your filters or check back later.
              </p>
            </div>
          </div>
        ) : (
          data.map((tool, index) => {
            const hasImage = tool.cover_img && isValidImage(tool.cover_img);
            const imageId = `img-${tool.id || index}`;
            const isTrending = tool.is_trending;

            return (
              <div key={tool.id || index} className="col-md-6 col-lg-4">
                <div
                  style={{
                    background: '#fff',
                    border: '1px solid #f0f0f0',
                    borderRadius: '16px',
                    padding: '24px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#e5e5e5';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#f0f0f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Trending Badge */}
                  {isTrending && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: '#000',
                        color: '#fff',
                        fontSize: '10px',
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        letterSpacing: '0.02em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Trending
                    </span>
                  )}

                  {/* Tool Icon/Image */}
                  <div style={{ marginBottom: '16px' }}>
                    {hasImage ? (
                      <div
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '14px',
                          overflow: 'hidden',
                          background: '#f5f5f7',
                        }}
                      >
                        <Image
                          src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
                          data-src={`${(import.meta.env.VITE_R2_PUBLIC_URL || '').replace(/\/$/, '')}/uploads/prod/${tool.cover_img}`}
                          data-id={imageId}
                          alt={tool.product_name}
                          className="lazy-load"
                          onError={handleImageError}
                          onLoad={handleImageLoad(imageId)}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '14px',
                          background: '#f5f5f7',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#86868b' }}>
                          construction
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="d-flex align-items-center gap-1" style={{ marginBottom: '8px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className="material-symbols-outlined"
                        style={{
                          fontSize: '14px',
                          color: star <= Math.round(tool.average_rating || 0) ? '#f97316' : '#e5e5e5',
                          fontVariationSettings: star <= Math.round(tool.average_rating || 0) ? '"FILL" 1' : '"FILL" 0',
                        }}
                      >
                        star
                      </span>
                    ))}
                    <span style={{ fontSize: '12px', color: '#86868b', marginLeft: '4px' }}>
                      {tool.average_rating ? parseFloat(tool.average_rating).toFixed(1) : '0.0'}
                      <span style={{ color: '#d1d1d6' }}> ({tool.total_ratings || 0})</span>
                    </span>
                  </div>

                  {/* Title */}
                  <Link
                    href={pageLink('product', tool.slug, tool.id)}
                    className="text-decoration-none"
                  >
                    <h5
                      style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        color: '#000',
                        marginBottom: '6px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        transition: 'color 0.15s ease',
                      }}
                      title={tool.product_name}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#86868b'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#000'}
                    >
                      {tool.product_name}
                    </h5>
                  </Link>

                  {/* Labels */}
                  {showLabels && (tool.category_name || tool.brand_labels || tool.tags) && (
                    <div className="d-flex flex-wrap gap-1" style={{ marginBottom: '8px' }}>
                      {tool.category_name && tool.category_name.split(',').map((cat, i) => (
                        <span
                          key={`cat-${i}`}
                          style={{
                            fontSize: '11px',
                            fontWeight: 500,
                            color: '#86868b',
                            background: '#f5f5f7',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                          }}
                        >
                          {cat.trim().replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Description */}
                  <p
                    style={{
                      fontSize: '13px',
                      color: '#86868b',
                      lineHeight: 1.5,
                      marginBottom: '16px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '39px',
                    }}
                  >
                    {stripHTMLTags(tool.description)?.split(' ').slice(0, 50).join(' ')}
                  </p>

                  {/* Actions */}
                  <div className="d-flex align-items-center justify-content-between" style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #f5f5f7' }}>
                    <div className="d-flex align-items-center gap-2">
                      <ShareButton title={tool.product_name} id={tool.id} type="tool" variant="icon" />
                      <button
                        className="btn p-0"
                        data-id={tool.id}
                        data-title={tool.product_name}
                        data-type="tool"
                        data-url={pageLink('product', tool.id, tool.slug)}
                        onClick={(e) => bookmark(e.currentTarget)}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f7'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{
                            fontSize: '18px',
                            fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
                            color: (tool.is_bookmarked === 1) ? '#f97316' : '#86868b',
                          }}
                        >
                          bookmark
                        </span>
                      </button>
                    </div>

                    <Link
                      href={pageLink('product', tool.slug, tool.id)}
                      className="text-decoration-none"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '8px 20px',
                        borderRadius: '9999px',
                        background: '#000',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 500,
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#333'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#000'}
                    >
                      Try Now
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DisplayToolshed;
