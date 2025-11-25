import React, { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Link } from '@inertiajs/react';

const RecommendedContent = ({similarPosts = []}) => {
  const sliderRef = useRef(null);
  const [loadedImages, setLoadedImages] = useState({});
  const defaultImage = '/img/logo/main.png';

  const handleImageError = (postId) => {
    setLoadedImages(prev => ({
      ...prev,
      [postId]: defaultImage
    }));
  };

  const loadImage = (postId, imageUrl) => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      setLoadedImages(prev => ({
        ...prev,
        [postId]: imageUrl
      }));
    };
    img.onerror = () => {
      setLoadedImages(prev => ({
        ...prev,
        [postId]: defaultImage
      }));
    };
  };

  const truncateText = (text, length) => {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  const stripTags = (html) => {
    if (!html) return '';
    return html.replace(/<\/?[^>]+(>|$)/g, '');
  };

  const NextArrow = ({ onClick }) => (
    <button 
      onClick={onClick} 
      className="carousel-arrow next-arrow btn btn-light rounded-circle position-absolute"
      style={{
        right: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1,
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
      type="button"
    >
      <span className="material-symbols-outlined align-middle">
        skip_next
      </span>
    </button>
  );
  
  const PrevArrow = ({ onClick }) => (
    <button 
      onClick={onClick} 
      className="carousel-arrow prev-arrow btn btn-light rounded-circle position-absolute"
      style={{
        left: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1,
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
      type="button"
    >
      <span className="material-symbols-outlined align-middle">
        skip_previous
      </span>
    </button>
  );

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    adaptiveHeight: true, // Adjusts height to current slide
    centerMode: false, // Consider true if you want to highlight current slide
    focusOnSelect: true, // Allows clicking to select slide
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <div className="my-3">
      {(similarPosts.length > 0) &&
        <>
          <h3 className="font-semibold mb-3 poppins-semibold">Recommended</h3>
          <div className="container-fluid relative">
            <Slider ref={sliderRef} {...settings} className="blog-carousel mb-5 row">
              {similarPosts?.map(post => {
                const cleanText = post.description;
                const imageUrl = `${(import.meta.env.VITE_R2_PUBLIC_URL || '').replace(/\/$/, '')}/uploads/opp/${post.cover_img}`;
                const coverImage = loadedImages[post.id] || defaultImage;
                
                // Load the image if not already loaded
                if (!loadedImages[post.id]) {
                  loadImage(post.id, imageUrl);
                }

                return (
                  <div key={post.id} className="col-sm-4">
                    <div className="px-1" style={{ height: '380px' }}>
                      <div style={{ 
                        width: '100%', 
                        height: '250px', 
                        overflow: 'hidden', 
                        borderRadius: '8px',
                        marginBottom: '12px'
                      }}>
                        <img 
                          src={coverImage}
                          loading="lazy"
                          className="rounded border"
                          alt={post.title}
                          onError={() => handleImageError(post.id)}
                          style={{
                            width: '500px',
                            height: '250px',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />
                      </div>
                      <h6 className="poppins-semibold m-0 p-0 mb-2">
                        <Link
                          href={`/op/${post.id}/${post.slug}`} 
                          className="hover:underline"
                        >
                          {truncateText(post.title, 30)}
                        </Link>
                      </h6>
                      <p className="text-gray-500 m-0 p-0 fs-9">
                        {truncateText(stripTags(cleanText), 50)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>
        </>
      }
    </div>
  );
};

export default RecommendedContent;