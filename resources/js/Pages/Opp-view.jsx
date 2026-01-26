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
// import GoogleAdsense from '@/Components/GoogleAdsense';
import FeedbackPanel from '@/Components/FeedbackInfo';
import FixedMobileNav from '@/Components/FixedMobileNav';
import axios from 'axios';
import Swal from 'sweetalert2';
import { showOpportunitiesSubscriptionModal } from '@/Components/SubscriptionModal';
import FlatButton from '@/Components/FlatButton';
// import AdBanner from '@/Components/AdBanner';

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

        // Scroll tracking for floating bookmark - tracks actual content reading
        const handleScroll = () => {
            const contentElement = document.querySelector('.default-font-style');
            if (!contentElement) return;
            
            const windowHeight = window.innerHeight;
            const contentRect = contentElement.getBoundingClientRect();
            const contentTop = contentRect.top;
            const contentHeight = contentRect.height;
            
            // Calculate how much content has scrolled past the top of viewport
            // When content top is at viewport top, progress = 0
            // When content bottom reaches viewport bottom, progress = 100
            const scrolledPast = -contentTop;
            const readableHeight = contentHeight - windowHeight;
            const scrollPercent = readableHeight > 0 
                ? (scrolledPast / readableHeight) * 100 
                : 0;
            
            setScrollProgress(Math.min(Math.max(scrollPercent, 0), 100));
            
            // Show floating bookmark when content is in view and we've started reading
            const contentInView = contentTop < windowHeight && contentRect.bottom > 0;
            const shouldShow = contentInView && scrollPercent > 5 && scrollPercent < 100;
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
                // Success with Toast notification
                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 4000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                });

                Toast.fire({
                    icon: "success",
                    title: "Successfully subscribed!",
                    text: "You'll receive the latest opportunities in your inbox."
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

            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 4000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            });

            Toast.fire({
                icon: "error",
                title: "Subscription Failed",
                text: errorMessage
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
    ogImage={`${import.meta.env.VITE_R2_PUBLIC_URL || ''}/uploads/opp/${opp_posts.cover_img}`}
    ogUrl={fullURL}
    twitterTitle={opp_posts?.title}
    twitterDescription={opp_posts?.meta_description}
    twitterImage={`${(import.meta.env.VITE_R2_PUBLIC_URL || '').replace(/\/$/, '')}/uploads/opp/${opp_posts.cover_img}`}
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
                {/* Article Header - AP News Style */}
                <div className="mt-4 mb-4">
                    {/* Brand/Source Label with Red Underline */}
                    <div className="mb-3">
                        <div style={{
                            display: 'inline-block',
                            paddingBottom: '4px',
                            borderBottom: '3px solid #dc2626'
                        }}>
                            <span style={{
                                color: '#1a1a1a',
                                fontWeight: '700',
                                fontSize: '1.1rem',
                                letterSpacing: '0.02em'
                            }}>
                                {opp_posts.brand_labels && opp_posts.brand_labels.length > 0 
                                    ? opp_posts.brand_labels[0]?.name 
                                    : 'Edatsu'}
                            </span>
                        </div>
                    </div>
                    
                    {/* Main Title - Large Bold */}
                    <h1 style={{ 
                        fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
                        fontWeight: '700',
                        lineHeight: '1.25',
                        color: '#1a1a1a',
                        marginBottom: '1.25rem',
                        fontFamily: 'Georgia, serif'
                    }}>
                        {opp_posts.title}
                    </h1>
                    
                    {/* Author/Source Name */}
                    <p style={{
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        color: '#1a1a1a',
                        marginBottom: '0.25rem'
                    }}>
                        {opp_posts.brand_labels && opp_posts.brand_labels.length > 0 
                            ? opp_posts.brand_labels[0]?.name 
                            : 'Edatsu Media'}
                    </p>
                    
                    {/* Date, Time & Reading Time with Share/Comments */}
                    <div className="d-flex flex-wrap align-items-center justify-content-between" style={{
                        marginBottom: '1.5rem'
                    }}>
                        <p style={{
                            fontSize: '0.875rem',
                            color: '#6b7280',
                            marginBottom: 0
                        }}>
                            {new Date(opp_posts.created_at).toLocaleDateString('en-US', { 
                                weekday: 'short',
                                month: 'long', 
                                day: 'numeric', 
                                year: 'numeric' 
                            })}
                            {' at '}
                            {new Date(opp_posts.created_at).toLocaleTimeString('en-US', { 
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                            })}
                            <span style={{margin: '0 0.5rem'}}>·</span>
                            <span>{Math.max(1, Math.ceil((opp_posts.description?.replace(/<[^>]*>/g, '').length || 0) / 1500))} min read</span>
                        </p>
                        
                        {/* Share & Comments Actions */}
                        <div className="d-flex align-items-center gap-2 mt-2 mt-md-0">
                            <button 
                                className="d-flex align-items-center justify-content-center"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#374151',
                                    cursor: 'pointer',
                                    padding: '0.5rem',
                                    borderRadius: '4px',
                                    transition: 'background 0.2s'
                                }}
                                data-title={opp_posts.title} 
                                data-id={opp_posts.id} 
                                onClick={(e) => toggleShare(e.currentTarget)}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                                title="Share"
                            >
                                <span className="material-symbols-outlined" style={{fontSize: '22px'}}>ios_share</span>
                            </button>
                            <button 
                                className="d-flex align-items-center gap-1"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#374151',
                                    cursor: 'pointer',
                                    padding: '0.5rem',
                                    borderRadius: '4px',
                                    transition: 'background 0.2s',
                                    fontSize: '0.875rem',
                                    fontWeight: '500'
                                }}
                                onClick={() => document.getElementById('comments-section')?.scrollIntoView({behavior: 'smooth'})}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                                title="Comments"
                            >
                                <span className="material-symbols-outlined" style={{fontSize: '22px'}}>chat_bubble_outline</span>
                                {total_comments > 0 && <span>{total_comments}</span>}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Cover Image - Large Featured Style */}
                {opp_posts.cover_img && (
                    <div className="mb-4" style={{
                        borderRadius: '8px',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        <img
                            src={`${(import.meta.env.VITE_R2_PUBLIC_URL || '').replace(/\/$/, '')}/uploads/opp/${opp_posts.cover_img}`}
                            className="w-100"
                            alt={opp_posts.title}
                            style={{ 
                                objectFit: 'cover', 
                                maxHeight: '500px',
                                width: '100%'
                            }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    </div>
                )}

                {/* Quick Info Pills */}
                {opp_posts.deadline && (
                    <div className="d-flex flex-wrap gap-2 mb-4">
                        <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                            padding: '0.375rem 0.75rem',
                            background: getDaysLeftText(opp_posts.deadline).includes('Expired') ? '#fef2f2' : '#f0fdf4',
                            color: getDaysLeftText(opp_posts.deadline).includes('Expired') ? '#dc2626' : '#16a34a',
                            borderRadius: '50px',
                            fontSize: '0.8rem',
                            fontWeight: '500'
                        }}>
                            <span className="material-symbols-outlined" style={{fontSize: '14px'}}>schedule</span>
                            {getDaysLeft(opp_posts.deadline)}
                        </span>
                    </div>
                )}

                {/* Content Section */}
                <div className="mb-5">
                    <div className="default-font-style" dangerouslySetInnerHTML={{ __html: opp_posts.description }}></div>
                </div>

                {/* Action Buttons - Clean Style */}
                <div className="mb-5 pt-4" style={{borderTop: '1px solid #e5e7eb'}}>
                    <div className="d-flex flex-wrap gap-3">
                        {/* Apply Now Button - Primary Action */}
                        {opp_posts.direct_link && (
                            <a 
                                className="btn btn-success px-4 py-2"
                                style={{ fontSize: '0.9rem', borderRadius: '8px', fontWeight: '600' }}
                                href={opp_posts.direct_link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                Apply Now
                            </a>
                        )}
                        
                        {/* Read More Button */}
                        {opp_posts.source_url && (
                            <a 
                                className="btn btn-primary px-4 py-2"
                                style={{ fontSize: '0.9rem', borderRadius: '8px', fontWeight: '600' }}
                                href={opp_posts.source_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                Read More
                            </a>
                        )}
                        
                        {/* Bookmark Button */}
                        <button 
                            className="btn btn-outline-secondary px-4 py-2"
                            style={{ fontSize: '0.9rem', borderRadius: '8px' }}
                            data-id={opp_posts.id}
                            data-title={opp_posts.title}
                            data-type="opp"
                            data-url={pageLink(opp_posts.title, opp_posts.id)}
                            onClick={handleBookmark}
                        >
                            <span className="material-symbols-outlined me-1" style={{fontSize: '18px', verticalAlign: 'middle'}}>
                                {opp_posts.is_bookmarked === 1 ? 'bookmark' : 'bookmark_border'}
                            </span>
                            {opp_posts.is_bookmarked === 1 ? 'Saved' : 'Save'}
                        </button>
                        
                        {/* Share Button */}
                        <div className="position-relative">
                            <div className="position-absolute share-panel border rounded fs-8 d-none"></div>
                            <button 
                                className="btn btn-outline-secondary px-4 py-2"
                                style={{ fontSize: '0.9rem', borderRadius: '8px' }}
                                data-title={opp_posts.title} 
                                data-id={opp_posts.id} 
                                onClick={(e) => toggleShare(e.currentTarget)}
                            >
                                <span className="material-symbols-outlined me-1" style={{fontSize: '18px', verticalAlign: 'middle'}}>share</span>
                                Share
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mid-Content Ad */}
                <div className="my-4">
                    {/* <AdBanner slot="opp_view_mid" size="responsive" /> */}
                </div>

                {/* Recommended Content */}
                <div className="mt-5">
                    <RecommendedContent similarPosts={similarPosts}/>
                </div>
            </Col>
            <Col lg={4} md={12} sm={12}>
                {/* Sidebar Ad - Desktop Only */}
                <div className="mb-4 d-none d-lg-block">
                    {/* <AdBanner slot="opp_view_sidebar" size="medium-rectangle" /> */}
                </div>

                {/* Categories & Locations */}
                <div style={{
                    width: '100%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    border: '1px dashed #d2d2d7',
                    borderRadius: '12px',
                    background: '#ffffff',
                    padding: '16px',
                    marginTop: 15,
                    marginBottom: 16
                }}>
                    {/* Categories */}
                    {opp_posts?.categories && opp_posts.categories.split(',').filter(Boolean).map((category, index) => (
                        <span 
                            key={`category-${index}`}
                            style={{
                                display: 'inline-block',
                                padding: '6px 14px',
                                background: '#f3f4f6',
                                color: '#374151',
                                borderRadius: '20px',
                                fontSize: '0.85rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#e5e7eb';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#f3f4f6';
                            }}
                        >
                            {category.trim()}
                        </span>
                    ))}
                    
                    {/* Continents */}
                    {opp_posts?.continents && opp_posts.continents.split(',').filter(Boolean).map((continent, index) => (
                        <span 
                            key={`continent-${index}`}
                            style={{
                                display: 'inline-block',
                                padding: '6px 14px',
                                background: '#f3f4f6',
                                color: '#374151',
                                borderRadius: '20px',
                                fontSize: '0.85rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#e5e7eb';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#f3f4f6';
                            }}
                        >
                            {continent.trim()}
                        </span>
                    ))}

                    {/* Countries */}
                    {opp_posts?.countries && opp_posts.countries.split(',').filter(Boolean).map((country, index) => (
                        <span 
                            key={`country-${index}`}
                            style={{
                                display: 'inline-block',
                                padding: '6px 14px',
                                background: '#f3f4f6',
                                color: '#374151',
                                borderRadius: '20px',
                                fontSize: '0.85rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#e5e7eb';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#f3f4f6';
                            }}
                        >
                            {country.trim()}
                        </span>
                    ))}

                    {/* Regions */}
                    {opp_posts?.regions && opp_posts.regions.split(',').filter(Boolean).map((region, index) => (
                        <span 
                            key={`region-${index}`}
                            style={{
                                display: 'inline-block',
                                padding: '6px 14px',
                                background: '#f3f4f6',
                                color: '#374151',
                                borderRadius: '20px',
                                fontSize: '0.85rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#e5e7eb';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#f3f4f6';
                            }}
                        >
                            {region.trim()}
                        </span>
                    ))}
                </div>

                {/* Sidebar Ad Placeholder */}
                <div style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: '1px dashed #d2d2d7',
                    borderRadius: '12px',
                    background: '#fafafa',
                    position: 'relative',
                    minHeight: 200,
                    padding: '16px',
                    marginTop: 15,
                    marginBottom: 16
                }}>
                    <span style={{
                        position: 'absolute',
                        top: 8,
                        left: 12,
                        fontSize: '10px',
                        color: '#86868b',
                        fontWeight: 500
                    }}>Advertisement</span>
                    <ins className="adsbygoogle"
                        style={{ display: 'block' }}
                        data-ad-client="ca-pub-7365396698208751"
                        data-ad-slot="1848837203"
                        data-ad-format="auto"
                        data-full-width-responsive="true"></ins>
                </div>

                {/* Subscribe Box - Minimal */}
                {/* <div style={{
                    borderRadius: '8px',
                    padding: '16px',
                    background: '#f9fafb',
                    marginBottom: '12px',
                    border: '1px dashed #d2d2d7'
                }}>
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="material-symbols-outlined" style={{fontSize: '20px', color: '#3b82f6'}}>mail</span>
                        <span style={{fontSize: '0.9rem', fontWeight: '600', color: '#1a1a1a'}}>Newsletter</span>
                    </div>
                    <p style={{fontSize: '0.85rem', color: '#6b7280', marginBottom: '12px'}}>
                        Weekly opportunities in your inbox.
                    </p>
                    <button
                        onClick={showOpportunitiesSubscriptionModal}
                        className="btn btn-primary btn-sm w-100"
                        style={{fontWeight: '500', borderRadius: '6px'}}
                    >
                        Subscribe
                    </button>
                </div> */}
                
                {/* WhatsApp - Compact */}
                {/* <div style={{
                    borderRadius: '8px',
                    padding: '16px',
                    background: '#f9fafb',
                    marginBottom: '12px',
                    border: '1px dashed #d2d2d7'
                }}>
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: '#25D366',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                        </div>
                        <span style={{fontSize: '0.9rem', fontWeight: '600', color: '#1a1a1a'}}>Community</span>
                        <span style={{fontSize: '0.75rem', color: '#6b7280'}}>2.5k members</span>
                    </div>
                    <a 
                        href="https://whatsapp.com/channel/0029VayPbWa9cDDVXoc44h2N"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm w-100"
                        style={{
                            background: '#25D366',
                            color: 'white',
                            fontWeight: '500',
                            borderRadius: '6px'
                        }}
                    >
                        Join
                    </a>
                </div> */}

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