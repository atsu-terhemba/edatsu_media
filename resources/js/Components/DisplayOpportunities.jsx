import React, { useEffect, useCallback, useMemo, useState, Suspense } from "react";
import { Image } from "react-bootstrap";
import axios from "axios";
import Swal from 'sweetalert2';
import { Link } from "@inertiajs/react";
import { getDaysLeft,  toggleShare, createSharingLinks, bookmark, pageLink } from "@/utils/Index";
import { router } from '@inertiajs/react'

const DisplayOpportunities = ({ data }) => {
  const [loadedImages, setLoadedImages] = useState({});

  // Fallback image URL - replace with your actual fallback image
  const fallbackImageUrl = "img/logo/main_2.png"; 

  const handleImageError = (e) => {
    // console.log(e);
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
    <div className="" id="results-container">
      {data?.map((o, index) => {
        const hasImage = o.cover_img && isValidImage(o.cover_img);
        const imageCol = hasImage ? 'col-sm-2 col-4' : '';
        const bodyCol = hasImage ? 'col-sm-10 col-8' : 'col-sm-12 col-12';
        const imageId = `img-${o.id || index}`;
        
        return (
          <div key={index} className="feed-panel text-wrap w-100 position-relative border-bottom">
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
                  <a onClick={(e) => {
                      e.preventDefault()
                      router.visit(`${pageLink(o.slug, o.id)}`, {
                        preserveState: true,
                        preserveScroll: true,
                      })
                    }}
                  className="text-decoration-none text-dark" href={pageLink(o.slug, o.id)}>
                    <h2 className="inline-block page-title m-0 p-0 poppins-semibold mb-2">
                      {escapeHTML(o.title)}
                    </h2>
                  </a>
                  
                  {o.continent_name && (
                    <div className="mb-2">
                      {convertToProperNoun(o.continent_name)}
                    </div>
                  )}
                  
                  <div className="overflow-hidden truncate d-none d-sm-block">
                    <p className="p-0 m-0 text-secondary d-block fs-9">
                      {truncateText(o.description, 150)}
                    </p>
                  </div>
                  
                  <div className="d-flex justify-content-end align-items-center">
                    <div className="px-3">
                      <p className="m-0 fs-9 poppins-semibold p-0">
                        {getDaysLeft(o.deadline)}
                      </p>
                    </div>
                    
                    <div className="content-btn-holder">
                      <div className="position-relative">
                        <div className="position-absolute share-panel border rounded fs-8 d-none"></div>
                        <button 
                          className="btn" 
                          data-title={o.title} 
                          data-id={o.id} 
                          onClick={(e) => toggleShare(e.currentTarget)}
                        >
                          <span className="material-symbols-outlined align-middle">
                            share
                          </span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="d-flex justify-content-end">
                      <button 
                        className="btn"
                        data-id={o.id}
                        data-title={o.title}
                        data-type="oppo-type"
                        data-url={pageLink(o.title, o.id)}
                        onClick={(e) => bookmark(e.currentTarget)}
                      >
                        <div>
                        <svg 
                        xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" 
                        fill={`${(o.is_bookmarked === 1)? '#FFD700' : '#B0B0B0'}`}>
                        <path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Z"/></svg>
                        </div>
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