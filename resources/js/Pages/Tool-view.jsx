import { useEffect, useState } from "react";
import Metadata from '@/Components/Metadata';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import Container from 'react-bootstrap/Container';
import { getDaysLeft, toggleShare, bookmark, pageLink, renderLabels, dateStringFormat} from "@/utils/Index";
import ProductRating from "@/Components/ProductRating";
import ProductComments from "@/Components/ProductComments";
import { router } from '@inertiajs/react'
import RecommendedContent from "@/Components/RecommendedContent";
import GoogleAdsense from '@/Components/GoogleAdsense';
import AdBanner from '@/Components/AdBanner';

const ReadTool = ({tool_data, similarPosts}) => {

    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const [fullURL, setFullUrl] = useState();
    const {props} = usePage();

    useEffect(()=>{
        console.log(props);
        const fullURL = window.location.href;
        setFullUrl(fullURL);
        console.log(tool_data);
    },[])

    return(
        <>
<GuestLayout>

<Metadata
    title={tool_data?.title}
    description={tool_data?.meta_description}
    keywords={tool_data?.meta_keywords}
    canonicalUrl={fullURL}
    ogTitle={tool_data?.title}
    ogDescription={tool_data?.meta_description}
    ogImage={`/storage/public/uploads/prod/${tool_data.cover_img}`}
    ogUrl={fullURL}
    twitterTitle={tool_data?.title}
    twitterDescription={tool_data?.meta_description}
    twitterImage={`/storage/public/uploads/prod/${tool_data.cover_img}`}
/>

<Container fluid={true} className="container-fluid container-lg">
        <Row className="g-4">
            <Col lg={12} md={12} sm={12}>
                {/* Hero Section with Tool Info and Video Side by Side */}
                <div className="border-0 mt-3 mb-4">
                    <Row className="g-4">
                        {/* Left Side - Tool Information */}
                        <Col lg={6} md={12}>
                            <div className="d-flex align-items-center mb-3">
                                {tool_data.cover_img && (
                                    <img
                                        src={`/storage/public/uploads/prod/${tool_data.cover_img}`}
                                        alt={tool_data.title}
                                        className="rounded me-3"
                                        style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                                        onError={(e) => {
                                            if (!e.target.getAttribute('data-error-handled')) {
                                                e.target.setAttribute('data-error-handled', 'true');
                                                e.target.onerror = null;
                                                e.target.src = "/img/logo/main_2.png";
                                            }
                                        }}
                                    />
                                )}
                                <div>
                                    <span className="badge bg-dark text-white rounded-pill px-3 py-2 mb-2">
                                        Tool
                                    </span>
                                </div>
                            </div>
                            
                            <h1 className="text-m-0 p-0 fw-bold mb-3" style={{ fontSize: '2.5em' }}>
                                {tool_data.title}
                            </h1>
                            
                            {/* Star Rating Display */}
                            <div className="d-flex align-items-center mb-3">
                                <div className="d-flex align-items-center me-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            className="material-symbols-outlined"
                                            style={{
                                                fontSize: '20px',
                                                color: star <= Math.round(tool_data.average_rating || 0) ? '#fbbf24' : '#d1d5db',
                                                fontVariationSettings: star <= Math.round(tool_data.average_rating || 0) ? '"FILL" 1, "wght" 400' : '"FILL" 0, "wght" 400',
                                            }}
                                        >
                                            star
                                        </span>
                                    ))}
                                </div>
                                <span className="text-muted">
                                    {tool_data.average_rating ? parseFloat(tool_data.average_rating).toFixed(1) : '0.0'} ({tool_data.total_ratings || 0} user reviews)
                                </span>
                            </div>
                            
                            <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
                                <div className="info-pill">
                                    <span className="material-symbols-outlined" style={{fontSize: '14px'}}>calendar_month</span>
                                    Posted {new Date(tool_data.created_at).toLocaleDateString()}
                                </div>
                            </div>
                            
                            {/* Short Description */}
                            <p className="text-secondary mb-3" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                                {tool_data.meta_description || 'Explore this productivity tool to enhance your workflow.'}
                            </p>
                        </Col>

                        {/* Right Side - YouTube Video or Subscribe Message */}
                        <Col lg={6} md={12}>
                            {tool_data.youtube_link ? (
                                <div className="ratio ratio-16x9 rounded overflow-hidden shadow-sm">
                                    <iframe
                                        src={(() => {
                                            let url = tool_data.youtube_link;
                                            if (url.includes('watch?v=')) {
                                                url = url.replace('watch?v=', 'embed/');
                                            } else if (url.includes('youtu.be/')) {
                                                url = url.replace('youtu.be/', 'youtube.com/embed/');
                                            } else if (url.includes('youtube.com/embed/')) {
                                                // Already in correct format
                                            } else {
                                                const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
                                                if (videoId) {
                                                    url = `https://www.youtube.com/embed/${videoId[1]}`;
                                                }
                                            }
                                            return url;
                                        })()}
                                        title="Product Demo Video"
                                        allowFullScreen
                                        className="rounded"
                                        style={{ border: 'none' }}
                                    />
                                </div>
                            ) : (
                                <div 
                                    className="d-flex flex-column align-items-center justify-content-center rounded shadow-sm"
                                    style={{ 
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        minHeight: '300px',
                                        padding: '2rem'
                                    }}
                                >
                                    <span className="material-symbols-outlined text-white mb-3" style={{ fontSize: '64px' }}>
                                        video_library
                                    </span>
                                    <h4 className="text-white fw-bold mb-2 text-center">Product Review Coming Soon</h4>
                                    <p className="text-white text-center mb-3" style={{ opacity: 0.9 }}>
                                        Subscribe to get notified when we publish our video review
                                    </p>
                                    <button 
                                        className="action-button btn-success-modern px-4 py-2"
                                        onClick={() => {
                                            // Trigger subscription modal or navigate to subscribe
                                            window.location.href = '#subscribe';
                                        }}
                                    >
                                        <span className="material-symbols-outlined me-2" style={{fontSize: '18px'}}>notifications_active</span>
                                        Subscribe for Updates
                                    </button>
                                </div>
                            )}
                        </Col>
                    </Row>
                </div>
            </Col>
        </Row>
        
        <Row className="g-4">
            <Col lg={8} md={12} sm={12}>
                {/* Content Section */}
                <div className="mb-4">
                    <div className="default-font-style" dangerouslySetInnerHTML={{ __html: tool_data.description }}></div>
                </div>

                {/* Tags & Categories */}
                <div className="mb-3">
                    <h5 className="fw-bold mb-3 d-flex align-items-center">
                        <span className="material-symbols-outlined me-2 text-primary" style={{fontSize: '20px'}}>tag</span>
                        Categories & Tags
                    </h5>
                    <div className="d-flex flex-wrap">
                        {["continents", "countries", "categories", "tags", "brand_labels"].map((key) => 
                            tool_data[key] && renderLabels(tool_data[key], key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '))
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mb-3">
                    <div className="">
                        <Row className="">
                            {/* Share Button */}
                            <Col lg={3} md={6} sm={6} xs={6}>
                                <div className="position-relative">
                                    <div className="position-absolute share-panel border rounded fs-8 d-none"></div>
                                    <button 
                                        className="action-button btn-outline-modern w-100 d-flex align-items-center justify-content-center gap-2 py-3"
                                        data-title={tool_data.title} 
                                        data-id={tool_data.id} 
                                        onClick={(e) => toggleShare(e.currentTarget)}
                                    >
                                        <span className="material-symbols-outlined" style={{fontSize: '18px'}}>share</span>
                                        <span className="d-none d-lg-inline">Share</span>
                                    </button>
                                </div>
                            </Col>
                            
                            {/* Bookmark Button */}
                            <Col lg={3} md={6} sm={6} xs={6}>
                                <button 
                                    className="action-button btn-outline-modern w-100 d-flex align-items-center justify-content-center gap-2 py-3"
                                    data-id={tool_data.id}
                                    data-title={tool_data.title}
                                    data-type="ts"
                                    data-url={pageLink('product', tool_data.slug, tool_data.id)}
                                    onClick={(e) => bookmark(e.currentTarget)}
                                >
                                    <span className="material-symbols-outlined" style={{fontSize: '18px', color: tool_data.is_bookmarked === 1 ? '#FFD700' : 'currentColor'}}>
                                        {tool_data.is_bookmarked === 1 ? 'bookmark' : 'bookmark_border'}
                                    </span>
                                    <span className="d-none d-lg-inline">
                                        {tool_data.is_bookmarked === 1 ? 'Saved' : 'Bookmark'}
                                    </span>
                                </button>
                            </Col>
                            
                            {/* Try Tool Button */}
                            {tool_data.direct_link && (
                                <Col lg={3} md={6} sm={6} xs={6}>
                                    <a 
                                        className="action-button btn-success-modern w-100 d-flex align-items-center justify-content-center gap-2 py-3"
                                        href={tool_data.direct_link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        <span className="material-symbols-outlined" style={{fontSize: '18px'}}>target</span>
                                        <span className="d-none d-lg-inline">Try Tool</span>
                                    </a>
                                </Col>
                            )}
                            
                            {/* Learn More Button */}
                            {tool_data.source_url && (
                                <Col lg={3} md={6} sm={6} xs={6}>
                                    <a 
                                        className="action-button btn-primary-modern w-100 d-flex align-items-center justify-content-center gap-2 py-3"
                                        href={tool_data.source_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        <span className="material-symbols-outlined" style={{fontSize: '18px'}}>open_in_new</span>
                                        <span className="d-none d-lg-inline">Learn More</span>
                                    </a>
                                </Col>
                            )}
                        </Row>
                    </div>
                </div>

                {/* Top Ad - After Hero Section */}
                <div className="my-4">
                    <AdBanner slot="tool_view_top" size="leaderboard" />
                </div>

                {/* Rating Section */}
                <div className="tool-card">
                    <h3 className="section-title">
                        Ratings & Reviews
                    </h3>
                    <ProductRating 
                        productId={tool_data?.id}
                        isAuthenticated={props?.auth?.user ? true : false}
                        initialRating={tool_data?.average_rating || 0}
                        initialCount={tool_data?.total_ratings || 0}
                    />
                </div>

                {/* Mid-Content Ad - After Ratings */}
                <div className="my-4">
                    <AdBanner slot="tool_view_mid" size="responsive" />
                </div>

                {/* Comments Section - Disabled in favor of modal reviews */}
                {/* <div className="tool-card">
                    <h3 className="section-title">
                        <span className="material-symbols-outlined me-2 text-primary" style={{fontSize: '20px'}}>chat</span>
                        Comments & Discussion
                    </h3>
                    <ProductComments 
                        productId={tool_data?.id}
                        isAuthenticated={props?.auth?.user ? true : false}
                    />
                </div> */}

                {/* Recommended Tools */}
                <div className="mt-5">
                    <RecommendedContent similarPosts={similarPosts}/>
                </div>
            </Col>
            
            {/* Sidebar */}
            <Col lg={4} md={12} sm={12}>
                {/* Telegram CTA */}
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
                {/* Hostinger Ad */}
                <div className="border rounded px-3 py-3 my-3">
                    <div>
                        <a target="_blank" 
                        className='text-decoration-none'
                        href="https://www.hostinger.com/cart?product=hosting%3Acloud_professional&period=12&referral_type=cart_link&REFERRALCODE=1ATSUDOMINI21&referral_id=0194e7a3-6593-739b-9f80-916a5e15e60c">
                        <h5 className="poppins-semibold m-0 p-0 mb-2">
                            Build a Powerful Business Website with Hostinger Cloud Professional
                            <span className="text-primary"> $16.99/mo</span>
                        </h5>
                        <span className="badge text-bg-warning rounded-0 poppins-semibold text-uppercase mb-3">
                            Limited Offer 20% OFF
                        </span>
                        <img 
                            src='/img/main/hostinger.webp'
                            className="img-fluid rounded" 
                            alt="hostinger-ads"
                        />
                        </a>
                    </div>
                </div>

                {/* <div className="my-3">
                    <GoogleAdsense/>
                </div> */}
            </Col>
        </Row>
</Container>

            </GuestLayout>
        
        </>
    )
}

export default ReadTool;
