import React, { useEffect, useCallback, useMemo, useState, Suspense } from "react";
import { Image } from "react-bootstrap";
import Swal from 'sweetalert2';
import { getDaysLeft,  toggleShare, createSharingLinks, bookmark, pageLink } from "@/utils/Index";
import { router } from '@inertiajs/react'

const DisplayOpportunities = ({ data, isAuthenticated }) => {
  const [loadedImages, setLoadedImages] = useState({});

  // Fallback image URL - replace with your actual fallback image
  const fallbackImageUrl = "img/logo/main_2.png";

  // Function to show authentication modal
  const showAuthModal = () => {
    Swal.fire({
        title: '',
        html: `
            <div style="text-align: center; padding: 20px;">
                <p style="margin-bottom: 20px; color: #374151; font-size: 16px; font-weight: 500;">
                    Join thousands of entrepreneurs accessing exclusive features
                </p>
                            
                <div style="display: flex; flex-direction: column; gap: 12px; max-width: 320px; margin: 0 auto;">
                    <a href="/auth/google" 
                       style="display: flex; align-items: center; justify-content: center; gap: 12px; 
                              padding: 14px 20px; background: #4285f4; color: white; text-decoration: none; 
                              border-radius: 10px; font-weight: 600; font-size: 15px; transition: all 0.3s ease;
                              box-shadow: 0 2px 8px rgba(66, 133, 244, 0.3);"
                       onmouseover="this.style.background='#3367d6'; this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(66, 133, 244, 0.4)'" 
                       onmouseout="this.style.background='#4285f4'; this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(66, 133, 244, 0.3)'">
                        <img src="https://developers.google.com/identity/images/g-logo.png" 
                             width="22" height="22" style="background: white; padding: 3px; border-radius: 3px;">
                        Continue with Google
                    </a>
                    
                    <a href="/auth/linkedin" 
                       style="display: flex; align-items: center; justify-content: center; gap: 12px; 
                              padding: 14px 20px; background: #0077b5; color: white; text-decoration: none; 
                              border-radius: 10px; font-weight: 600; font-size: 15px; transition: all 0.3s ease;
                              box-shadow: 0 2px 8px rgba(0, 119, 181, 0.3);"
                       onmouseover="this.style.background='#005885'; this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(0, 119, 181, 0.4)'" 
                       onmouseout="this.style.background='#0077b5'; this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0, 119, 181, 0.3)'">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        Continue with LinkedIn
                    </a>
                    
                    <div style="margin: 15px 0; color: #9ca3af; font-size: 14px; font-weight: 500;">or use email</div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <a href="/login" 
                           style="display: flex; align-items: center; justify-content: center; gap: 8px; 
                                  padding: 12px 16px; background: transparent; color: #374151; text-decoration: none; 
                                  border: 2px solid #e5e7eb; border-radius: 8px; font-weight: 500; font-size: 14px; transition: all 0.3s ease;"
                           onmouseover="this.style.borderColor='#9ca3af'; this.style.backgroundColor='#f9fafb'; this.style.transform='translateY(-1px)'" 
                           onmouseout="this.style.borderColor='#e5e7eb'; this.style.backgroundColor='transparent'; this.style.transform='translateY(0)'">
                            Login
                        </a>
                        
                        <a href="/register" 
                           style="display: flex; align-items: center; justify-content: center; gap: 8px; 
                                  padding: 12px 16px; background: #059669; color: white; text-decoration: none; 
                                  border-radius: 8px; font-weight: 500; font-size: 14px; transition: all 0.3s ease;
                                  box-shadow: 0 2px 8px rgba(5, 150, 105, 0.3);"
                           onmouseover="this.style.background='#047857'; this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(5, 150, 105, 0.4)'" 
                           onmouseout="this.style.background='#059669'; this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(5, 150, 105, 0.3)'">
                            Sign Up
                        </a>
                    </div>
                </div>
                
                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px; margin: 0;">
                        Secure • Free Forever • Instant Access
                    </p>
                    <p style="color: #9ca3af; font-size: 11px; margin: 8px 0 0 0;">
                        By continuing, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        `,
        showConfirmButton: false,
        showCloseButton: true,
        width: '480px',
        padding: '0',
        background: 'white',
        customClass: {
            popup: 'auth-modal-popup',
            closeButton: 'auth-modal-close'
        }
    });
  };

  // Custom bookmark handler that checks authentication first
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

  // Reset loaded images when data changes (pagination)
  useEffect(() => {
    setLoadedImages({});
  }, [data]);

  useEffect(() => {
    let observer;
    let timer;

    const setupObserver = () => {
      // Clean up previous observer if it exists
      if (observer) {
        observer.disconnect();
      }

      observer = new IntersectionObserver(
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
        { rootMargin: "200px" }
      );

      // Get all lazy-load images and observe them
      const lazyImages = document.querySelectorAll(".lazy-load");
      lazyImages.forEach(img => {
        // Reset image src to placeholder if it's not already
        if (!img.src.includes('data:image') && !img.src.includes('R0lGODlh')) {
          img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        }
        observer.observe(img);
      });
    };

    // Use a timeout to ensure DOM is ready with new data
    timer = setTimeout(() => {
      setupObserver();
    }, 100); // Slightly increased delay

    // Cleanup function
    return () => {
      if (timer) clearTimeout(timer);
      if (observer) observer.disconnect();
    };
  }, [data]); // This effect runs whenever data changes

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


const stripAndTruncate = (html, maxLength = 150) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  const plainText = tempDiv.textContent || tempDiv.innerText || '';
  return plainText.length > maxLength
    ? plainText.slice(0, maxLength).trim() + '...'
    : plainText;
};


  // Function to handle image loading manually
  const handleImageLoad = useCallback((imageId, imageSrc) => {
    return () => {
      setLoadedImages(prev => ({
        ...prev,
        [imageId]: true
      }));
    };
  }, []);

  return (
    <div className="" id="results-container">
      {data?.map((o, index) => {
        const hasImage = o.cover_img && isValidImage(o.cover_img);
        const imageCol = hasImage ? 'col-sm-2 col-4' : '';
        const bodyCol = hasImage ? 'col-sm-10 col-8' : 'col-sm-12 col-12';
        // Use unique ID that includes the opportunity ID to ensure uniqueness across pagination
        const imageId = `img-${o.id}-${index}`;
        
        return (
          <div key={`${o.id}-${index}`} className="feed-panel text-wrap w-100 position-relative border-bottom">
            <div className="row">
              {hasImage && (
                <div className={imageCol}>
                  <div className="image-container py-3">
                    <Image
                      src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
                      data-src={`storage/public/uploads/opp/${o.cover_img}`}
                      data-id={imageId}
                      alt={`Cover image for ${o.title}`}
                      className="img-fluid w-100 h-100 object-fit-cover lazy-load rounded"
                      onError={handleImageError}
                      onLoad={handleImageLoad(imageId, o.cover_img)}
                    />
                  </div>
                </div>
              )}
              <div className={bodyCol}>
                <div className="py-3">
                  <a 
                  // onClick={(e) => {
                  //     e.preventDefault()
                  //     router.visit(`${pageLink(o.slug, o.id)}`, {
                  //       preserveState: true,
                  //       preserveScroll: true,
                  //     })
                  //   }}
                  target="_blank"
                  className="text-decoration-none text-dark" 
                  href={pageLink('op', o.slug, o.id)}>
                    <h2 className="inline-block page-title m-0 p-0 poppins-semibold mb-2 fs-9">
                      {o.title}
                    </h2>
                  </a>
                  
                  {o.continent_name && (
                    <div className="mb-2">
                      {convertToProperNoun(o.continent_name)}
                    </div>
                  )}
                  
                  <div className="overflow-hidden truncate d-none d-sm-block">
                    {/* <p className="p-0 m-0 text-secondary d-block fs-8"
                    dangerouslySetInnerHTML={{ __html: truncateText(o.description, 150) }}>
                    </p> */}
                    <p className="p-0 m-0 text-secondary d-block fs-8">
                      {stripAndTruncate(o.description, 150)}
                    </p>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="px-3">
                      <p className="m-0 fs-8 poppins-semibold p-0">
                        {getDaysLeft(o.deadline)}
                      </p>
                    </div>

                    <div className="d-flex align-items-center gap-2">
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
                          className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center share-btn"
                          data-title={o.title} 
                          data-id={o.id} 
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
                        data-id={o.id}
                        data-title={o.title}
                        data-type="opp"
                        data-url={pageLink('op', o.id, o.slug)}
                        onClick={handleBookmark}
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
                          fill={`${(o.is_bookmarked === 1)? '#FFD700' : '#6B7280'}`}
                          style={{ transition: 'fill 0.3s ease' }}
                        >
                          <path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Z"/>
                        </svg>
                      </button>
                    </div>
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