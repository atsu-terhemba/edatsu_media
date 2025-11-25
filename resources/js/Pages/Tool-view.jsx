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
import { showToolsSubscriptionModal } from '@/Components/SubscriptionModal';
// import GoogleAdsense from '@/Components/GoogleAdsense';
// import AdBanner from '@/Components/AdBanner';

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
    ogImage={`${(import.meta.env.VITE_R2_PUBLIC_URL || '').replace(/\/$/, '')}/uploads/prod/${tool_data.cover_img}`}
    ogUrl={fullURL}
    twitterTitle={tool_data?.title}
    twitterDescription={tool_data?.meta_description}
    twitterImage={`${(import.meta.env.VITE_R2_PUBLIC_URL || '').replace(/\/$/, '')}/uploads/prod/${tool_data.cover_img}`}
/>

<Container fluid={true} className="container-fluid container-lg">
        <Row className="g-4">
            <Col lg={8} md={12} sm={12}>
                {/* Hero Section with Tool Info */}
                <div className="border-0 mt-3 mb-4">
                    <div className="d-flex align-items-center mb-3">
                                {tool_data.cover_img && (
                                    <img
                                        src={`${(import.meta.env.VITE_R2_PUBLIC_URL || '').replace(/\/$/, '')}/uploads/prod/${tool_data.cover_img}`}
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
                                {/* <div>
                                    <span className="badge bg-dark text-white rounded-pill px-3 py-2 mb-2">
                                        Tool
                                    </span>
                                </div> */}
                            </div>
                            
                            <h1 className="text-m-0 p-0 fw-bold mb-3" style={{ fontSize: '2.5em' }}>
                                {tool_data.title}
                            </h1>
                            
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
                </div>

                {/* YouTube Video Section */}
                {tool_data.youtube_link ? (
                    <div className="mb-4">
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
                    </div>
                ) : (
                    <div className="mb-4">
                        <div 
                            className="d-flex flex-column align-items-center justify-content-center rounded shadow-sm"
                            style={{ 
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                minHeight: '250px',
                                padding: '2rem'
                            }}
                        >
                            <span className="material-symbols-outlined text-white mb-3" style={{ fontSize: '48px' }}>
                                video_library
                            </span>
                            <h5 className="text-white fw-bold mb-2 text-center">Product Review Coming Soon</h5>
                            <p className="text-white text-center mb-3" style={{ opacity: 0.9, fontSize: '0.9rem' }}>
                                Subscribe to get notified when we publish our video review
                            </p>
                            <button 
                                className="action-button btn-success-modern px-4 py-2"
                                onClick={showToolsSubscriptionModal}
                            >
                                <span className="material-symbols-outlined me-2" style={{fontSize: '18px'}}>notifications_active</span>
                                Subscribe for Updates
                            </button>
                        </div>
                    </div>
                )}

                {/* Content Section */}
                <div className="mb-5">
                    <div className="default-font-style" dangerouslySetInnerHTML={{ __html: tool_data.description }}></div>
                </div>

                
                {/* Tags & Categories */}
                <div className="mb-5">
                    <div className="d-flex flex-wrap">
                        {["continents", "countries", "categories", "tags", "brand_labels"].map((key) => 
                            tool_data[key] && renderLabels(tool_data[key], key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '))
                        )}
                    </div>
                </div>


                {/* Rate This Tool Section - Modern Card */}
                <div className="mb-5">
                    <div 
                        className="position-relative overflow-hidden rounded-4 p-4"
                        style={{
                            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)',
                            border: '1px solid #e2e8f0'
                        }}
                    >
                        {/* Decorative Elements */}
                        <div 
                            className="position-absolute"
                            style={{
                                top: '-20px',
                                right: '-20px',
                                width: '100px',
                                height: '100px',
                                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                                borderRadius: '50%',
                                opacity: '0.15',
                                filter: 'blur(20px)'
                            }}
                        />
                        <div 
                            className="position-absolute"
                            style={{
                                bottom: '-30px',
                                left: '20%',
                                width: '80px',
                                height: '80px',
                                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                                borderRadius: '50%',
                                opacity: '0.1',
                                filter: 'blur(15px)'
                            }}
                        />
                        <div className="position-relative">
                            {/* Header with Icon */}
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <div 
                                    className="d-flex align-items-center justify-content-center rounded-circle"
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                                        boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)'
                                    }}
                                >
                                    <span className="material-symbols-outlined text-white" style={{ fontSize: '24px', fontVariationSettings: '"FILL" 1' }}>
                                        star
                                    </span>
                                </div>
                                <div>
                                    <h5 className="fw-bold mb-0" style={{ color: '#1e293b', fontSize: '1.1rem' }}>
                                        Rate this Tool
                                    </h5>
                                    <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
                                        Have you used this tool? Share your experience!
                                    </p>
                                </div>
                            </div>
                            {/* Rating Component - no white background */}
                            <div className="pt-2 pb-1">
                                <ProductRating 
                                    productId={tool_data?.id}
                                    isAuthenticated={props?.auth?.user ? true : false}
                                    initialRating={tool_data?.average_rating || 0}
                                    initialCount={tool_data?.total_ratings || 0}
                                    showRatingForm={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mb-5">
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
                    {/* <AdBanner slot="tool_view_top" size="leaderboard" /> */}
                </div>

                {/* Ratings & Reviews Section - Separate Container */}
                <div className="mb-5">
                    <h6 className="fw-semibold mb-3 d-flex align-items-center text-muted" style={{ fontSize: '0.9rem' }}>
                        <span className="material-symbols-outlined me-2" style={{ fontSize: '18px' }}>reviews</span>
                        User Ratings & Reviews
                    </h6>
                    <ProductRating 
                        productId={tool_data?.id}
                        isAuthenticated={props?.auth?.user ? true : false}
                        initialRating={tool_data?.average_rating || 0}
                        initialCount={tool_data?.total_ratings || 0}
                        showRatingForm={false}
                    />
                </div>

                {/* Mid-Content Ad - After Ratings */}
                <div className="my-4">
                    {/* <AdBanner slot="tool_view_mid" size="responsive" /> */}
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
            <Col lg={4} md={12} sm={12} style={{ marginTop: '15px' }}>
                {/* Subscribe Box */}
                <div className='subscribe-box mb-3 border rounded px-3 py-3' style={{ marginTop: '30px' }}>
                    <h5 className="fw-bold mb-1">Subscribe</h5>
                    <p className='fs-8 text-muted'>
                        Subscribe to get funding & growth insights
                    </p>
                    <button
                        onClick={showToolsSubscriptionModal}
                        className="btn py-3 btn-primary w-100 mt-3 mb-0 d-flex align-items-center justify-content-center"
                        style={{ borderRadius: '12px', fontWeight: '600', fontSize: '0.9rem' }}
                    >
                        Subscribe
                    </button>
                </div>

                {/* Community Sections */}
                {/* <div className="border rounded px-3 py-3 mb-4">
                    <div className="" style={{marginBottom: '15px'}}>
                        <div className="">
                            <div className="message-header">
                                <div className="avatar-container">
                                    <img 
                                        src='/img/defaults/telegram_icon.png'
                                        className="telegram-avatar" 
                                        alt="Telegram Community"
                                    />
                                    <div className="online-indicator"></div>
                                </div>
                                <div className="message-info">
                                    <h6 className="username">Telegram Community</h6>
                                    <span className="status">💬 Join the conversation</span>
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

                    <div className="" style={{marginBottom: '15px'}}>
                        <div className="">
                            <div className="message-header">
                                <div className="avatar-container">
                                    <img 
                                        src='/img/gif/icons8-whatsapp-50.png'
                                        className="telegram-avatar" 
                                        alt="WhatsApp Community"
                                    />
                                    <div className="online-indicator"></div>
                                </div>
                                <div className="message-info">
                                    <h6 className="username">WhatsApp Community</h6>
                                    <span className="status">💬 Join the conversation</span>
                                </div>
                            </div>
                            
                            <div className="message-content">      
                                <a 
                                    href="https://chat.whatsapp.com/YOUR_WHATSAPP_LINK" 
                                    target="_blank"
                                    className="telegram-join-btn"
                                    style={{background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)'}}
                                >
                                    <span className="btn-text">Join WhatsApp Group</span>
                                    <span className="btn-arrow">→</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div> */}
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
