import { useEffect, useState } from "react";
import Metadata from '@/Components/Metadata';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import Container from 'react-bootstrap/Container';
import { getDaysLeft, getDaysLeftText, toggleShare, bookmark, pageLink, renderLabels, dateStringFormat} from "@/utils/Index";
import StarRating from "@/Components/Rating";
import { router } from '@inertiajs/react'
import RecommendedContent from "@/Components/RecommendedContent";
import CommentComponent from "@/Components/CommentComponent";
import GoogleAdsense from '@/Components/GoogleAdsense';
import FeedbackPanel from '@/Components/FeedbackInfo';
import FixedMobileNav from '@/Components/FixedMobileNav';
import axios from 'axios';
import Swal from 'sweetalert2';
import AdBanner from '@/Components/AdBanner';

const ReadOpportunity = ({opp_posts, similarPosts, total_comments}) => {

    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const [fullURL, setFullUrl] = useState();
    const {props} = usePage();

    // Subscription modal state
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const [subscriptionForm, setSubscriptionForm] = useState({
        firstName: '',
        lastName: '',
        email: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Check if user is authenticated
    const isAuthenticated = props?.auth?.user ? true : false;

    // Floating bookmark state
    const [showFloatingBookmark, setShowFloatingBookmark] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isFloatingBookmarkVisible, setIsFloatingBookmarkVisible] = useState(false);

    useEffect(()=>{
        console.log(props);
        const fullURL = window.location.href;
        setFullUrl(fullURL);
        // console.log(opp_posts);

        // Scroll tracking for floating bookmark
        const handleScroll = () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            setScrollProgress(scrollPercent);
            
            // Show floating bookmark after scrolling 20% and before reaching 95%
            const shouldShow = scrollPercent > 20 && scrollPercent < 95;
            setShowFloatingBookmark(shouldShow);
            
            // Add slight delay for smooth appearance
            setTimeout(() => {
                setIsFloatingBookmarkVisible(shouldShow);
            }, 100);
        };

        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    },[])

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
                                  border-radius: 4px; font-weight: 600; font-size: 15px; transition: all 0.2s ease;
                                  border: 1px solid #4285f4;"
                           onmouseover="this.style.background='#3367d6'; this.style.borderColor='#3367d6'" 
                           onmouseout="this.style.background='#4285f4'; this.style.borderColor='#4285f4'">
                            <img src="https://developers.google.com/identity/images/g-logo.png" 
                                 width="22" height="22" style="background: white; padding: 3px; border-radius: 3px;">
                            Continue with Google
                        </a>
                        
                        <a href="/auth/linkedin" 
                           style="display: flex; align-items: center; justify-content: center; gap: 12px; 
                                  padding: 14px 20px; background: #0077b5; color: white; text-decoration: none; 
                                  border-radius: 4px; font-weight: 600; font-size: 15px; transition: all 0.2s ease;
                                  border: 1px solid #0077b5;"
                           onmouseover="this.style.background='#005885'; this.style.borderColor='#005885'" 
                           onmouseout="this.style.background='#0077b5'; this.style.borderColor='#0077b5'">
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
                                      border: 1px solid #e5e7eb; border-radius: 4px; font-weight: 500; font-size: 14px; transition: all 0.2s ease;"
                               onmouseover="this.style.borderColor='#9ca3af'; this.style.backgroundColor='#f9fafb'" 
                               onmouseout="this.style.borderColor='#e5e7eb'; this.style.backgroundColor='transparent'">
                                Login
                            </a>
                            
                            <a href="/register" 
                               style="display: flex; align-items: center; justify-content: center; gap: 8px; 
                                      padding: 12px 16px; background: #107c10; color: white; text-decoration: none; 
                                      border-radius: 4px; font-weight: 500; font-size: 14px; transition: all 0.2s ease;
                                      border: 1px solid #107c10;"
                               onmouseover="this.style.background='#0e6b0e'; this.style.borderColor='#0e6b0e'" 
                               onmouseout="this.style.background='#107c10'; this.style.borderColor='#107c10'">
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

    // Subscription modal functions
    const handleSubscriptionSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await axios.post('subscribe', {
                first_name: subscriptionForm.firstName,
                last_name: subscriptionForm.lastName,
                email: subscriptionForm.email
            });

            if (response.data.success) {
                // Success with SweetAlert
                Swal.fire({
                    title: 'Subscribed!',
                    text: 'You\'ve been successfully subscribed to our newsletter. You\'ll receive the latest opportunities directly in your inbox.',
                    icon: 'success',
                    confirmButtonText: 'Great!',
                    confirmButtonColor: '#0078d4',
                    showClass: {
                        popup: 'animate__animated animate__zoomIn animate__faster'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__zoomOut animate__faster'
                    },
                    customClass: {
                        popup: 'swal-modern-popup',
                        title: 'swal-modern-title',
                        content: 'swal-modern-content',
                        confirmButton: 'swal-modern-confirm'
                    }
                });

                setShowSubscriptionModal(false);
                setSubscriptionForm({ firstName: '', lastName: '', email: '' });
            }
        } catch (error) {
            console.error('Subscription error:', error);
            
            let errorMessage = 'An unexpected error occurred. Please try again.';
            
            if (error.response && error.response.status === 422) {
                const validationErrors = error.response.data.errors;
                if (validationErrors && validationErrors.email) {
                    errorMessage = validationErrors.email[0];
                } else if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
            } else if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message || 'This email is already subscribed.';
            }

            Swal.fire({
                title: 'Subscription Failed',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'Try Again',
                confirmButtonColor: '#d13438',
                showClass: {
                    popup: 'animate__animated animate__shakeX animate__faster'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOut animate__faster'
                },
                customClass: {
                    popup: 'swal-modern-popup',
                    title: 'swal-modern-title',
                    content: 'swal-modern-content',
                    confirmButton: 'swal-modern-confirm'
                }
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSubscriptionForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const closeSubscriptionModal = () => {
        setShowSubscriptionModal(false);
        setSubscriptionForm({ firstName: '', lastName: '', email: '' });
    };

    const handleSubscribeClick = () => {
        setShowSubscriptionModal(true);
    };

    return(
        <>
<GuestLayout>

<Metadata
    title={opp_posts?.title}
    description={opp_posts?.meta_description}
    keywords={opp_posts?.meta_keywords}
    canonicalUrl={fullURL}
    ogTitle={opp_posts?.title}
    ogDescription={opp_posts?.meta_description}
    ogImage={`/storage/public/uploads/opp/${opp_posts.cover_img}`}
    ogUrl={fullURL}
    twitterTitle={opp_posts?.title}
    twitterDescription={opp_posts?.meta_description}
    twitterImage={`/storage/public/uploads/opp/${opp_posts.cover_img}`}
/>

{/* Floating Bookmark Button */}
<div className={`floating-bookmark-container ${showFloatingBookmark ? 'visible' : 'hidden'} ${isFloatingBookmarkVisible ? 'animate-in' : 'animate-out'}`}>
    <div className="floating-bookmark-wrapper">
        {/* Progress Ring */}
        <div className="progress-ring">
            <svg className="progress-ring-svg" width="60" height="60">
                <circle
                    className="progress-ring-circle-bg"
                    cx="30"
                    cy="30"
                    r="25"
                />
                <circle
                    className="progress-ring-circle"
                    cx="30"
                    cy="30"
                    r="25"
                    style={{
                        strokeDasharray: `${scrollProgress * 1.57}, 157`,
                        transform: 'rotate(-90deg)',
                        transformOrigin: '30px 30px'
                    }}
                />
            </svg>
            
            {/* Bookmark Button */}
            <button
                className="floating-bookmark-btn"
                onClick={handleBookmark}
                data-product-id={opp_posts.id}
                data-bookmarked={opp_posts.is_bookmarked === 1}
                title={opp_posts.is_bookmarked === 1 ? 'Remove from bookmarks' : 'Add to bookmarks'}
            >
                <span className="material-symbols-outlined bookmark-icon">
                    {opp_posts.is_bookmarked === 1 ? 'bookmark' : 'bookmark_border'}
                </span>
            </button>
        </div>
        
        {/* Floating Tooltip */}
        <div className="floating-tooltip">
            <span className="tooltip-text">
                {opp_posts.is_bookmarked === 1 ? 'Bookmarked!' : 'Save for later'}
            </span>
            <div className="tooltip-progress">{Math.round(scrollProgress)}% read</div>
        </div>
    </div>
</div>

<Container fluid={true} className="container-fluid container-lg">
        <Row className="g-4">
            <Col lg={8} md={12} sm={12}>
                {/* Hero Section */}
                <div className="border-0 mt-3">
                    <div className="d-flex align-items-center mb-3">
                        <span className="badge bg-dark text-white rounded-pill px-3 py-2">
                            Opportunity
                        </span>
                    </div>
                    <h1 className="text-m-0 p-0 fw-bold" style={{ fontSize: '2.5em' }}>
                        {opp_posts.title}
                    </h1>
                    <div className="d-flex flex-wrap align-items-center gap-3">
                        <div className="info-pill">
                            <span className="material-symbols-outlined" style={{fontSize: '14px'}}>calendar_month</span>
                            Posted {new Date(opp_posts.created_at).toLocaleDateString()}
                        </div>
                        {opp_posts.deadline && (
                            <div className={`info-pill ${getDaysLeftText(opp_posts.deadline).includes('Expired') ? 'expired' : 'active'}`}>
                                <span className="material-symbols-outlined" style={{fontSize: '14px'}}>schedule</span>
                                {getDaysLeft(opp_posts.deadline)}
                            </div>
                        )}
                        {opp_posts.deadline && (
                            <div className="info-pill">
                                <span className="material-symbols-outlined" style={{fontSize: '14px'}}>calendar_month</span>
                                Deadline: {dateStringFormat(opp_posts.deadline)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Ad - After Hero */}
                <div className="my-4">
                    <AdBanner slot="opp_view_top" size="leaderboard" />
                </div>

                {/* Google Ads */}
                <div className="mb-4">
                    <ins
                    className="adsbygoogle"
                    style={{ display: "block" }}
                    data-ad-client="ca-pub-7365396698208751"
                    data-ad-slot="7889919728"
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                    ></ins>
                </div>

                {/* Cover Image */}
                {opp_posts.cover_img && (
                    <div className="image-container">
                        <img
                            src={`/storage/public/uploads/opp/${opp_posts.cover_img}`}
                            className="img-fluid"
                            alt="Opportunity Cover"
                            onError={(e) => {
                                if (!e.target.getAttribute('data-error-handled')) {
                                    e.target.setAttribute('data-error-handled', 'true');
                                    e.target.onerror = null;
                                    e.target.src = "/img/logo/main_2.png";
                                }
                            }}
                        />
                    </div>
                )}

                {/* Content Section */}
                <div className="">
                    <div className="default-font-style" dangerouslySetInnerHTML={{ __html: opp_posts.description }}></div>
                </div>

                {/* Tags Section */}
                <div className="mb-3">
                    <h5 className="fw-bold mb-3 d-flex align-items-center">
                        <span className="material-symbols-outlined me-2 text-primary" style={{fontSize: '20px'}}>tag</span>
                        Categories & Locations
                    </h5>
                    <div className="tag-container">
                        {["continents", "countries", "categories"].map((key) => 
                            opp_posts[key] && renderLabels(opp_posts[key], key.charAt(0).toUpperCase() + key.slice(1))
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mb-3">
                    {/* <h5 className="fw-bold mb-4 text-center text-md-start">Take Action</h5> */}
                    <div className="">
                        <Row className="">
                            {/* Share Button */}
                            <Col lg={3} md={6} sm={6} xs={6}>
                                <div className="position-relative">
                                    <div className="position-absolute share-panel border rounded fs-8 d-none"></div>
                                    <button 
                                        className="action-button btn-outline-modern w-100 d-flex align-items-center justify-content-center gap-2 py-3"
                                        data-title={opp_posts.title} 
                                        data-id={opp_posts.id} 
                                        onClick={(e) => toggleShare(e.currentTarget)}
                                    >
                                        <span className="material-symbols-outlined" style={{fontSize: '18px'}}>
                                            share
                                        </span>
                                        <span className="d-none d-lg-inline">Share</span>
                                    </button>
                                </div>
                            </Col>
                            
                            {/* Bookmark Button */}
                            <Col lg={3} md={6} sm={6} xs={6}>
                                <button 
                                    className="action-button btn-outline-modern w-100 d-flex align-items-center justify-content-center gap-2 py-3"
                                    data-id={opp_posts.id}
                                    data-title={opp_posts.title}
                                    data-type="opp"
                                    data-url={pageLink(opp_posts.title, opp_posts.id)}
                                    onClick={handleBookmark}
                                >
                                    <span className="material-symbols-outlined" style={{fontSize: '18px', color: opp_posts.is_bookmarked === 1 ? '#FFD700' : 'currentColor'}}>
                                        {opp_posts.is_bookmarked === 1 ? 'bookmark' : 'bookmark_border'}
                                    </span>
                                    <span className="d-none d-lg-inline">
                                        {opp_posts.is_bookmarked === 1 ? 'Saved' : 'Bookmark'}
                                    </span>
                                </button>
                            </Col>
                            
                            {/* Read More Button (if available) */}
                            {opp_posts.source_url && (
                                <Col lg={3} md={6} sm={6} xs={6}>
                                    <a 
                                        className="action-button btn-primary-modern w-100 d-flex align-items-center justify-content-center gap-2 py-3"
                                        href={opp_posts.source_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        <span className="material-symbols-outlined" style={{fontSize: '18px'}}>
                                            open_in_new
                                        </span>
                                        <span className="d-none d-lg-inline">Read More</span>
                                    </a>
                                </Col>
                            )}
                            
                            {/* Apply Now Button (if available) */}
                            {opp_posts.direct_link && (
                                <Col lg={3} md={6} sm={6} xs={6}>
                                    <a 
                                        className="action-button btn-success-modern w-100 d-flex align-items-center justify-content-center gap-2 py-3"
                                        href={opp_posts.direct_link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        <span className="material-symbols-outlined" style={{fontSize: '18px'}}>
                                            target
                                        </span>
                                        <span className="d-none d-lg-inline">Apply Now</span>
                                    </a>
                                </Col>
                            )}
                        </Row>
                    </div>
                </div>

                
                {/* <FeedbackPanel /> */}

                {/* Mid-Content Ad */}
                <div className="my-4">
                    <AdBanner slot="opp_view_mid" size="responsive" />
                </div>
          

                {/* Recommended Content */}
                <div className="mt-5">
                    <RecommendedContent similarPosts={similarPosts}/>
                </div>
            </Col>
            <Col lg={4} md={12} sm={12}>
                {/* Sidebar Ad - Desktop Only */}
                <div className="mb-4 d-none d-lg-block">
                    <AdBanner slot="opp_view_sidebar" size="medium-rectangle" />
                </div>
                
                {/* Telegram Community - Cool Message Button */}
                <div className="telegram-community-container border-0">
                    <div className="telegram-message-bubble border-0">
                        <div className="message-header">
                            <div className="avatar-container">
                                <img 
                                    src='/img/defaults/telegram_icon.png'
                                    className="telegram-avatar" 
                                    alt="Edatsu Community"
                                />
                                <div className="online-indicator"></div>
                            </div>
                            <div className="message-info">
                                <h6 className="username">Edatsu Community</h6>
                                <span className="status">🔥 Active now</span>
                            </div>
                        </div>
                        
                        <div className="message-content">      
                            <a 
                                href="https://t.me/+66AGIA3g2dwzMjc0" 
                                target="_blank"
                                className="telegram-join-btn"
                            >
                                <span className="btn-text">Join Community Now</span>
                                <span className="btn-arrow">→</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Google Adsense - Commented out for clean design */}
                {/* <div className="sidebar-card">
                    <GoogleAdsense/>
                </div> */}
            </Col>
        </Row>
</Container>
<FixedMobileNav isAuthenticated={(props.auth.user)? true : false} />
</GuestLayout>
        </>
    )
}

export default ReadOpportunity;