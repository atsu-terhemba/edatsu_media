import React, { useEffect, useCallback, useState } from "react";
import { Image } from "react-bootstrap";
import Swal from 'sweetalert2';
import { getDaysLeft, bookmark, pageLink } from "@/utils/Index";
import ShareButton from '@/Components/ShareButton';

const DisplayOpportunities = ({ data, isAuthenticated }) => {
  const [loadedImages, setLoadedImages] = useState({});

  const fallbackImageUrl = "/img/logo/main_2.png";

  const showAuthModal = () => {
    Swal.fire({
        title: '',
        html: `
            <div style="text-align: center; padding: 20px;">
                <p style="margin-bottom: 20px; color: #000; font-size: 16px; font-weight: 600;">
                    Join thousands of entrepreneurs accessing exclusive features
                </p>

                <div style="display: flex; flex-direction: column; gap: 12px; max-width: 320px; margin: 0 auto;">
                    <a href="/auth/redirect/google"
                       style="display: flex; align-items: center; justify-content: center; gap: 12px;
                              padding: 12px 20px; background: #000; color: white; text-decoration: none;
                              border-radius: 9999px; font-weight: 500; font-size: 14px; transition: all 0.15s ease;"
                       onmouseover="this.style.background='#333'"
                       onmouseout="this.style.background='#000'">
                        <img src="https://developers.google.com/identity/images/g-logo.png"
                             width="18" height="18" style="background: white; padding: 2px; border-radius: 3px;">
                        Continue with Google
                    </a>

                    <a href="/auth/redirect/linkedin-openid"
                       style="display: flex; align-items: center; justify-content: center; gap: 12px;
                              padding: 12px 20px; border: 1px solid #e5e5e7; background: #fff; color: #000; text-decoration: none;
                              border-radius: 9999px; font-weight: 500; font-size: 14px; transition: all 0.15s ease;"
                       onmouseover="this.style.borderColor='#000'; this.style.background='#000'; this.style.color='#fff'"
                       onmouseout="this.style.borderColor='#e5e5e7'; this.style.background='#fff'; this.style.color='#000'">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        Continue with LinkedIn
                    </a>

                    <div style="margin: 12px 0; color: #86868b; font-size: 13px; font-weight: 400;">or use email</div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <a href="/login"
                           style="display: flex; align-items: center; justify-content: center;
                                  padding: 10px 16px; background: transparent; color: #000; text-decoration: none;
                                  border: 1px solid #e5e5e5; border-radius: 9999px; font-weight: 500; font-size: 13px; transition: all 0.15s ease;"
                           onmouseover="this.style.borderColor='#000'; this.style.backgroundColor='#000'; this.style.color='#fff'"
                           onmouseout="this.style.borderColor='#e5e5e5'; this.style.backgroundColor='transparent'; this.style.color='#000'">
                            Login
                        </a>

                        <a href="/register"
                           style="display: flex; align-items: center; justify-content: center;
                                  padding: 10px 16px; background: #000; color: white; text-decoration: none;
                                  border-radius: 9999px; font-weight: 500; font-size: 13px; transition: all 0.15s ease;"
                           onmouseover="this.style.background='#333'"
                           onmouseout="this.style.background='#000'">
                            Sign Up
                        </a>
                    </div>
                </div>

                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #f0f0f0;">
                    <p style="color: #86868b; font-size: 11px; margin: 0;">
                        By continuing, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        `,
        showConfirmButton: false,
        showCloseButton: true,
        width: '420px',
        padding: '0',
        background: 'white',
        customClass: {
            popup: 'auth-modal-popup',
            closeButton: 'auth-modal-close'
        }
    });
  };

  const handleBookmark = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      showAuthModal();
      return;
    }
    bookmark(e.currentTarget);
  };

  const handleImageError = (e) => {
    e.target.src = fallbackImageUrl;
  };

  useEffect(() => {
    setLoadedImages({});
  }, [data]);

  useEffect(() => {
    let observer;
    let timer;

    const setupObserver = () => {
      if (observer) observer.disconnect();

      observer = new IntersectionObserver(
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
      lazyImages.forEach(img => {
        if (!img.src.includes('data:image') && !img.src.includes('R0lGODlh')) {
          img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        }
        observer.observe(img);
      });
    };

    timer = setTimeout(() => { setupObserver(); }, 100);

    return () => {
      if (timer) clearTimeout(timer);
      if (observer) observer.disconnect();
    };
  }, [data]);

  const isValidImage = (img) => {
    return img && typeof img === 'string' && img.trim() !== '';
  };

  function convertToProperNoun(input) {
    if (!input || typeof input !== 'string') return '';

    let items = input.split(',');
    return items.map((item, index) => {
        let words = item.trim().split(/[\s_-]+/);
        let capitalizedWords = words.map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        );
        let output = capitalizedWords.join(" ");

        return (
            <span
                key={index}
                style={{
                    display: 'inline-block',
                    padding: '2px 10px',
                    borderRadius: '9999px',
                    background: '#f5f5f7',
                    fontSize: '11px',
                    fontWeight: 500,
                    color: '#86868b',
                    marginRight: '4px',
                    marginBottom: '4px',
                }}
            >
                {output}
            </span>
        );
    });
  }

  const stripAndTruncate = (html, maxLength = 150) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    return plainText.length > maxLength
      ? plainText.slice(0, maxLength).trim() + '...'
      : plainText;
  };

  const handleImageLoad = useCallback((imageId) => {
    return () => {
      setLoadedImages(prev => ({ ...prev, [imageId]: true }));
    };
  }, []);

  return (
    <div id="results-container">
      {data?.map((o, index) => {
        const hasImage = o.cover_img && isValidImage(o.cover_img);
        const imageId = `img-${o.id}-${index}`;

        return (
          <div
            key={`${o.id}-${index}`}
            style={{
                padding: '16px 0',
                borderBottom: '1px solid #f0f0f0',
                transition: 'background-color 0.15s ease',
            }}
          >
            <div className="d-flex align-items-start gap-3">
              {/* Image */}
              {hasImage && (
                <div style={{ flexShrink: 0 }}>
                  <Image
                    src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
                    data-src={`${(import.meta.env.VITE_R2_PUBLIC_URL || '').replace(/\/$/, '')}/uploads/opp/${o.cover_img}`}
                    data-id={imageId}
                    alt={`Cover image for ${o.title}`}
                    className="lazy-load"
                    onError={handleImageError}
                    onLoad={handleImageLoad(imageId)}
                    style={{
                        width: '72px',
                        height: '72px',
                        objectFit: 'cover',
                        borderRadius: '12px',
                        border: '1px solid #f0f0f0',
                    }}
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-grow-1" style={{ minWidth: 0 }}>
                {/* Title + Trending */}
                <div className="d-flex align-items-center gap-2 mb-1">
                  <a
                    target="_blank"
                    href={pageLink('op', o.slug, o.id)}
                    style={{
                        textDecoration: 'none',
                        color: '#000',
                        fontSize: '14px',
                        fontWeight: 600,
                        lineHeight: 1.3,
                        transition: 'color 0.15s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#86868b'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#000'}
                  >
                    {o.title}
                  </a>
                  {o.is_trending && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '2px',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        background: '#000',
                        color: '#fff',
                        fontSize: '10px',
                        fontWeight: 500,
                        flexShrink: 0,
                      }}
                    >
                      Trending
                    </span>
                  )}
                </div>

                {/* Region badges */}
                {o.continent_name && (
                  <div className="mb-1">
                    {convertToProperNoun(o.continent_name)}
                  </div>
                )}

                {/* Description - desktop only */}
                <p
                  className="d-none d-sm-block"
                  style={{
                    fontSize: '13px',
                    color: '#86868b',
                    lineHeight: 1.5,
                    margin: '4px 0',
                  }}
                >
                  {stripAndTruncate(o.description, 150)}
                </p>

                {/* Footer: days left + actions */}
                <div className="d-flex justify-content-between align-items-center mt-1">
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#000' }}>
                    {getDaysLeft(o.deadline)}
                  </span>

                  <div className="d-flex align-items-center gap-2">
                    <ShareButton title={o.title} id={o.id} type="opp" variant="icon" />

                    {/* Bookmark */}
                    <button
                      className="btn p-0"
                      data-id={o.id}
                      data-title={o.title}
                      data-type="opp"
                      data-url={pageLink('op', o.id, o.slug)}
                      onClick={handleBookmark}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontSize: '18px',
                          fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
                          color: (o.is_bookmarked === 1) ? '#f97316' : '#86868b',
                          transition: 'color 0.15s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#f97316'}
                        onMouseLeave={(e) => e.currentTarget.style.color = (o.is_bookmarked === 1) ? '#f97316' : '#86868b'}
                      >
                        bookmark
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DisplayOpportunities;
