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
import { Star, ExternalLink, Bookmark, Share2, Calendar, Tag, Globe, Wrench, MessageCircle } from 'lucide-react';

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
<style>{`
    .tool-hero {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 16px;
        padding: 2rem;
        margin-bottom: 2rem;
    }
    
    .tool-card {
        background: white;
        border-radius: 16px;
        border: 1px solid #e2e8f0;
        padding: 2rem;
        margin-bottom: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    
    .action-btn {
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 0.75rem 1rem;
        transition: all 0.3s ease;
        text-decoration: none;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 500;
    }
    
    .action-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 15px rgba(0,0,0,0.1);
    }
    
    .btn-share:hover {
        background-color: #3b82f6;
        border-color: #3b82f6;
        color: white;
    }
    
    .btn-bookmark:hover {
        background-color: #f59e0b;
        border-color: #f59e0b;
        color: white;
    }
    
    .btn-try:hover {
        background-color: #10b981;
        border-color: #10b981;
        color: white;
    }
    
    .btn-bookmark.bookmarked {
        background-color: #fef3c7;
        border-color: #f59e0b;
        color: #92400e;
    }
    
    .tool-badge {
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 50px;
        padding: 0.5rem 1rem;
        color: white;
        font-size: 0.875rem;
        font-weight: 500;
    }
    
    .feature-icon {
        width: 40px;
        height: 40px;
        background: #f1f5f9;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 1rem;
    }
    
    .section-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
`}</style>

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

<Container fluid={true} className="container-fluid container-sm">
        <Row>
            <Col sm={8}>
                {/* Google Ads */}
                <div className="mb-3">
                    <ins
                    className="adsbygoogle"
                    style={{ display: "block" }}
                    data-ad-client="ca-pub-7365396698208751"
                    data-ad-slot="7889919728"
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                    ></ins>
                </div>

                {/* Tool Hero Section */}
                <div className="tool-hero">
                    <div className="d-flex align-items-start justify-content-between">
                        <div>
                            <h1 className="mb-3 fw-bold" style={{ fontSize: '2.5rem', lineHeight: '1.2' }}>
                                {tool_data.title}
                            </h1>
                            <p className="mb-3 fs-6 opacity-90">
                                Posted on: {new Date(tool_data.created_at).toLocaleDateString()}
                            </p>
                            
                            {/* Category badges */}
                            {tool_data.categories && (
                                <div className="d-flex flex-wrap gap-2 mb-3">
                                    {tool_data.categories.split(',').map((category, index) => (
                                        <span key={index} className="tool-badge">
                                            {category.trim()}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Tool Icon/Logo */}
                        {tool_data.cover_img && (
                            <div className="text-end">
                                <img
                                    src={`/storage/public/uploads/prod/${tool_data.cover_img}`}
                                    className="rounded shadow"
                                    alt="Tool Logo"
                                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
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
                    </div>
                </div>

                {/* Main Content */}
                <div className="tool-card">
                    <h2 className="section-title">
                        <Wrench size={24} className="text-primary" />
                        Tool Overview
                    </h2>
                    <div className="default-font-style" dangerouslySetInnerHTML={{ __html: tool_data.description }}></div>
                </div>

                {/* Tags & Categories */}
                <div className="tool-card">
                    <h3 className="section-title">
                        <Tag size={24} className="text-primary" />
                        Tags & Categories
                    </h3>
                    <ul className="m-0 p-0 list-unstyled">
                        {["continents", "countries", "categories", "tags", "brand_labels"].map((key) => 
                            tool_data[key] && renderLabels(tool_data[key], key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '))
                        )}
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="tool-card">
                    <h3 className="section-title">
                        <ExternalLink size={24} className="text-primary" />
                        Take Action
                    </h3>
                    <div className="row g-3">
                        {/* Share Button */}
                        <div className="col-sm-3">
                            <div className="content-btn-holder">
                                <div className="position-relative">
                                    <div className="position-absolute share-panel d-none" style={{
                                        top: 'auto',
                                        right: '0px',
                                        bottom: '45px',
                                        zIndex: 1050,
                                        minWidth: '280px'
                                    }}></div>
                                    <button 
                                        className="action-btn btn-share w-100"
                                        data-title={tool_data.title} 
                                        data-id={tool_data.id} 
                                        onClick={(e) => toggleShare(e.currentTarget)}
                                    >
                                        <Share2 size={16} className="me-2" />
                                        Share Tool
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Bookmark Button */}
                        <div className="col-sm-3">
                            <button 
                                className={`action-btn btn-bookmark w-100 ${tool_data.is_bookmarked === 1 ? 'bookmarked' : ''}`}
                                data-id={tool_data.id}
                                data-title={tool_data.title}
                                data-type="ts"
                                data-url={pageLink('product', tool_data.slug, tool_data.id)}
                                onClick={(e) => bookmark(e.currentTarget)}
                            >
                                <Bookmark size={16} className="me-2" />
                                {tool_data.is_bookmarked === 1 ? 'Bookmarked' : 'Bookmark'}
                            </button>
                        </div>
                        
                        {/* Try Tool Button */}
                        {tool_data.direct_link && (
                            <div className="col-sm-3">
                                <a 
                                    className="action-btn btn-try w-100" 
                                    href={tool_data.direct_link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    <ExternalLink size={16} className="me-2" />
                                    Try Tool
                                </a>
                            </div>
                        )}
                        
                        {/* Learn More Button */}
                        {tool_data.source_url && (
                            <div className="col-sm-3">
                                <a 
                                    className="action-btn w-100" 
                                    href={tool_data.source_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    <Globe size={16} className="me-2" />
                                    Learn More
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Rating Section */}
                <div className="tool-card">
                    <h3 className="section-title">
                        <Star size={24} className="text-primary" />
                        Ratings & Reviews
                    </h3>
                    <ProductRating 
                        productId={tool_data?.id}
                        isAuthenticated={props?.auth?.user ? true : false}
                        initialRating={tool_data?.average_rating || 0}
                        initialCount={tool_data?.total_ratings || 0}
                    />
                </div>

                {/* Comments Section */}
                <div className="tool-card">
                    <h3 className="section-title">
                        <MessageCircle size={24} className="text-primary" />
                        Comments & Discussion
                    </h3>
                    <ProductComments 
                        productId={tool_data?.id}
                        isAuthenticated={props?.auth?.user ? true : false}
                    />
                </div>

                {/* Recommended Tools */}
                <div className="tool-card">
                    <RecommendedContent similarPosts={similarPosts}/>
                </div>
            </Col>
            
            {/* Sidebar */}
            <Col sm={4}>
                {/* YouTube Video Section - Fixed */}
                {tool_data.youtube_link && (
                    <div className="sticky-top mb-3" style={{ top: '20px' }}>
                        <div className="tool-card">
                            <h4 className="section-title">
                                <ExternalLink size={20} className="text-danger" />
                                Product Demo
                            </h4>
                            <div className="ratio ratio-16x9 mb-3">
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
                                            // Try to extract video ID from any YouTube URL
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
                            <p className="text-muted small mb-0">
                                Watch the full product demonstration and learn how to get started.
                            </p>
                        </div>
                    </div>
                )}

                {/* Telegram CTA */}
                <a 
                    href="https://t.me/+66AGIA3g2dwzMjc0" 
                    target="_blank"
                    style={{ color: "#249fda" }} 
                    className="text-decoration-none text-dark"
                >
                    <div className="my-3 d-flex align-items-center border rounded py-3">
                        <div className="px-2">
                            <img 
                                src='/img/defaults/telegram_icon.png'
                                width="50"
                                className="img-fluid rounded" 
                                alt="Telegram banner"
                            />
                        </div>
                        <div className='pe-2'>
                            <p className="fs-8 m-0 p-0">
                                Join our telegram for daily product updates & tech news
                            </p>
                        </div>
                    </div>
                </a>

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

                <div className="my-3">
                    <GoogleAdsense/>
                </div>
            </Col>
        </Row>
</Container>

            </GuestLayout>
        
        </>
    )
}

export default ReadTool;
