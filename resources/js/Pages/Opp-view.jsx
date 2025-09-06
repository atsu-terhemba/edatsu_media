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

    useEffect(()=>{
        console.log(props);
        const fullURL = window.location.href;
        setFullUrl(fullURL);
        // console.log(opp_posts);
    },[])

    // Subscription modal functions
    const handleSubscriptionSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await axios.post('/api/subscribe', {
                first_name: subscriptionForm.firstName,
                last_name: subscriptionForm.lastName,
                email: subscriptionForm.email
            });

            if (response.data.success) {
                // Success notification
                alert('Thank you for subscribing! You will receive our latest opportunities.');
                setShowSubscriptionModal(false);
                setSubscriptionForm({ firstName: '', lastName: '', email: '' });
            }
        } catch (error) {
            console.error('Subscription error:', error);
            alert('There was an error processing your subscription. Please try again.');
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
<style>{`
    .modern-card {
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        border: 1px solid #f1f5f9;
        transition: all 0.3s ease;
    }
    
    .modern-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    }
    
    .hero-section {
        background: white;
        color: #2d3748;
        border: 2px solid #e2e8f0;
        border-radius: 16px;
        padding: 2rem;
        margin-bottom: 2rem;
    }
    
    .deadline-badge {
        background: #f56565;
        color: white;
        border-radius: 50px;
        padding: 8px 16px;
        font-weight: 600;
        font-size: 0.875rem;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin: 0 8px 8px 0;
    }
    
    .deadline-badge.expired {
        background: #6c757d;
    }
    
    .deadline-badge.soon {
        background: #e53e3e;
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    .action-button {
        border-radius: 12px;
        padding: 12px 20px;
        font-weight: 600;
        transition: all 0.3s ease;
        border: 2px solid transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        text-decoration: none !important;
    }
    
    .action-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }
    
    .btn-primary-modern {
        background: #3182ce;
        color: white;
        border: 2px solid #3182ce;
        margin: 4px;
    }
    
    .btn-primary-modern:hover {
        background: #2c5282;
        border-color: #2c5282;
        color: white;
    }
    
    .btn-success-modern {
        background: #38a169;
        color: white;
        border: 2px solid #38a169;
        margin: 4px;
    }
    
    .btn-success-modern:hover {
        background: #2f855a;
        border-color: #2f855a;
        color: white;
    }
    
    .btn-warning-modern {
        background: #dd6b20;
        color: white;
        border: 2px solid #dd6b20;
        margin: 4px;
    }
    
    .btn-warning-modern:hover {
        background: #c05621;
        border-color: #c05621;
        color: white;
    }
    
    .btn-outline-modern {
        background: white;
        color: #4a5568;
        border: 2px solid #e2e8f0;
        margin: 4px;
    }
    
    .btn-outline-modern:hover {
        background: #f7fafc;
        border-color: #cbd5e0;
        color: #2d3748;
    }
    
    .info-pill {
        background: #f7fafc;
        color: #4a5568;
        border: 1px solid #e2e8f0;
        border-radius: 20px;
        padding: 6px 12px;
        font-size: 0.8rem;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin: 4px 8px 4px 0;
    }
    
    .content-section {
        background: white;
        border-radius: 16px;
        padding: 2rem;
        margin-bottom: 2rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        border: 1px solid #f1f5f9;
    }
    
    .meta-info {
        background: #f8fafc;
        border-radius: 12px;
        padding: 1.5rem;
        border-left: 4px solid #3182ce;
        margin-bottom: 1.5rem;
    }
    
    .sidebar-card {
        background: white;
        border-radius: 16px;
        padding: 2rem;
        margin-bottom: 2rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        border: 1px solid #f1f5f9;
        transition: all 0.3s ease;
    }
    
    .sidebar-card:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
    
    /* Responsive Design Improvements */
    @media (max-width: 576px) {
        .content-section {
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 12px;
        }
        
        .sidebar-card {
            padding: 1.5rem;
            margin-bottom: 1rem;
            border-radius: 12px;
        }
        
        .meta-info {
            padding: 1rem;
            margin-bottom: 1rem;
        }
        
        .action-button {
            padding: 0.75rem 0.5rem;
            font-size: 0.875rem;
        }
        
        .subscription-card {
            text-align: center;
            padding: 1.5rem 1rem;
        }
        
        .subscription-card .material-symbols-outlined {
            font-size: 36px !important;
        }
        
        .info-pill {
            font-size: 0.75rem;
            padding: 4px 8px;
            margin: 2px 4px 2px 0;
        }
    }
    
    @media (min-width: 577px) and (max-width: 768px) {
        .content-section {
            padding: 1.5rem;
        }
        
        .sidebar-card {
            padding: 1.75rem;
        }
    }
    
    @media (min-width: 1200px) {
        .content-section {
            padding: 2.5rem;
        }
        
        .sidebar-card {
            padding: 2.5rem;
        }
    }
    
    /* Modal Responsive Improvements */
    @media (max-width: 576px) {
        .modal-content {
            padding: 1.5rem !important;
            border-radius: 16px !important;
            margin: 1rem !important;
            width: calc(100% - 2rem) !important;
        }
        
        .modal-content h2 {
            font-size: 1.5rem !important;
        }
        
        .modal-content .form-control {
            padding: 0.5rem 0.75rem !important;
        }
    }
    
    .telegram-card {
        background: #0088cc;
        color: white;
        border: 2px solid #0088cc;
    }
    
    .telegram-card:hover {
        background: #006bb3;
        border-color: #006bb3;
    }
    
    .hostinger-card {
        background: #673ab7;
        color: white;
        border: 2px solid #673ab7;
    }
    
    .hostinger-card:hover {
        background: #5e35b1;
        border-color: #5e35b1;
    }
    
    .image-container {
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        margin: 2rem 0;
        border: 1px solid #e2e8f0;
    }
    
    .image-container img {
        width: 100%;
        height: auto;
        transition: transform 0.3s ease;
    }
    
    .image-container:hover img {
        transform: scale(1.02);
    }
    
    .tag-container {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin: 1.5rem 0;
    }
    
    .modern-tag {
        background: #f7fafc;
        color: #4a5568;
        border: 1px solid #e2e8f0;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 500;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin: 4px 8px 4px 0;
    }
    
    .page-header {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        padding: 2rem;
        margin-bottom: 2rem;
    }
`}</style>
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

<Container fluid={true} className="container-fluid container-lg">
        <Row className="g-4">
            <Col lg={8} md={12} sm={12}>
                {/* Hero Section */}
                <div className="hero-section">
                    <div className="d-flex align-items-center mb-3">
                        <span className="material-symbols-outlined me-2 text-primary">target</span>
                        <span className="badge bg-primary text-white rounded-pill px-3 py-2">
                            Opportunity
                        </span>
                    </div>
                    <h1 className="h2 fw-bold mb-3 lh-base text-dark">{opp_posts.title}</h1>
                    <div className="d-flex flex-wrap align-items-center gap-3">
                        <div className="info-pill">
                            <span className="material-symbols-outlined" style={{fontSize: '14px'}}>calendar_month</span>
                            Posted {new Date(opp_posts.created_at).toLocaleDateString()}
                        </div>
                        {opp_posts.deadline && (
                            <div className={`deadline-badge ${getDaysLeftText(opp_posts.deadline).includes('Expired') ? 'expired' : getDaysLeftText(opp_posts.deadline).includes('day') && parseInt(getDaysLeftText(opp_posts.deadline)) <= 7 ? 'soon' : ''}`}>
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
                <div className="content-section">
                    <div className="default-font-style" dangerouslySetInnerHTML={{ __html: opp_posts.description }}></div>
                </div>

                {/* Tags Section */}
                <div className="content-section">
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
                <div className="content-section">
                    <h5 className="fw-bold mb-4">Take Action</h5>
                    <Row className="g-3">
                        <Col md={3} sm={6}>
                            <div className="content-btn-holder">
                                <div className="position-relative">
                                    <div className="position-absolute share-panel border rounded fs-8 d-none"></div>
                                    <button 
                                        className="action-button btn-outline-modern w-100"
                                        data-title={opp_posts.title} 
                                        data-id={opp_posts.id} 
                                        onClick={(e) => toggleShare(e.currentTarget)}
                                    >
                                        <span className="material-symbols-outlined" style={{fontSize: '18px'}}>share</span>
                                        Share
                                    </button>
                                </div>
                            </div>
                        </Col>
                        <Col md={3} sm={6}>
                            <button 
                                className="action-button btn-outline-modern w-100"
                                data-id={opp_posts.id}
                                data-title={opp_posts.title}
                                data-type="opp"
                                data-url={pageLink(opp_posts.title, opp_posts.id)}
                                onClick={(e) => bookmark(e.currentTarget)}
                            >
                                <span className="material-symbols-outlined" style={{fontSize: '18px', color: opp_posts.is_bookmarked === 1 ? '#FFD700' : 'currentColor'}}>
                                    {opp_posts.is_bookmarked === 1 ? 'bookmark' : 'bookmark_border'}
                                </span>
                                Bookmark
                            </button>
                        </Col>
                        {opp_posts.source_url && (
                            <Col md={3} sm={6}>
                                <a className="action-button btn-primary-modern w-100" href={opp_posts.source_url} target="_blank" rel="noopener noreferrer">
                                    <span className="material-symbols-outlined" style={{fontSize: '18px'}}>open_in_new</span>
                                    Read More
                                </a>
                            </Col>
                        )}
                        {opp_posts.direct_link && (
                            <Col md={3} sm={6}>
                                <a className="action-button btn-success-modern w-100" href={opp_posts.direct_link} target="_blank" rel="noopener noreferrer">
                                    <span className="material-symbols-outlined" style={{fontSize: '18px'}}>target</span>
                                    Apply Now
                                </a>
                            </Col>
                        )}
                    </Row>
                </div>

                {/* Feedback Section */}
                <div className="content-section">
                    <FeedbackPanel />
                </div>

                {/* Recommended Content */}
                <div className="content-section">
                    <RecommendedContent similarPosts={similarPosts}/>
                </div>
            </Col>
            <Col lg={4} md={12} sm={12}>
                {/* Telegram Card */}
                <div className="sidebar-card telegram-card">
                    <a 
                        href="https://t.me/+66AGIA3g2dwzMjc0" 
                        target="_blank"
                        className="text-decoration-none text-white d-flex align-items-center"
                    >
                        <div className="me-3">
                            <img 
                                src='/img/defaults/telegram_icon.png'
                                width="60"
                                className="img-fluid rounded-circle" 
                                alt="Telegram"
                                style={{ border: '3px solid rgba(255,255,255,0.3)' }}
                            />
                        </div>
                        <div className="flex-grow-1">
                            <h6 className="fw-bold mb-1 text-white">
                                <span className="material-symbols-outlined me-2" style={{fontSize: '16px'}}>groups</span>
                                Join Our Community
                            </h6>
                            <p className="small mb-0 opacity-90">
                                Get daily opportunities & news updates on Telegram
                            </p>
                        </div>
                    </a>
                </div>

                {/* Subscription Card */}
                <div className="sidebar-card subscription-card">
                    <div className="text-center">
                        <div className="mb-3">
                            <span className="material-symbols-outlined text-primary" style={{fontSize: '48px'}}>
                                mail
                            </span>
                        </div>
                        <h5 className="fw-bold mb-2 text-dark">
                            Get Daily Opportunities
                        </h5>
                        <p className="text-muted small mb-3">
                            Never miss out on new opportunities. Get them delivered straight to your inbox every day.
                        </p>
                        <button 
                            className="btn btn-primary w-100 fw-bold"
                            onClick={handleSubscribeClick}
                        >
                            <span className="material-symbols-outlined me-2" style={{fontSize: '16px'}}>
                                notifications
                            </span>
                            Subscribe Now
                        </button>
                    </div>
                </div>

                {/* Hostinger Ad Card */}
                <div className="sidebar-card hostinger-card">
                    <a 
                        target="_blank" 
                        className='text-decoration-none text-white'
                        href="https://www.hostinger.com/cart?product=hosting%3Acloud_professional&period=12&referral_type=cart_link&REFERRALCODE=1ATSUDOMINI21&referral_id=0194e7a3-6593-739b-9f80-916a5e15e60c"
                    >
                        <div className="mb-3">
                            <span className="badge bg-warning text-dark rounded-pill px-3 py-2 fw-bold">
                                LIMITED OFFER - 20% OFF
                            </span>
                        </div>
                        <h5 className="fw-bold mb-3 text-white">
                            Build a Powerful Business Website
                        </h5>
                        <div className="d-flex align-items-center mb-3">
                            <span className="material-symbols-outlined me-2" style={{fontSize: '20px'}}>language</span>
                            <span className="h6 mb-0">Hostinger Cloud Professional</span>
                        </div>
                        <div className="mb-3">
                            <span className="h4 fw-bold text-warning">$16.99/mo</span>
                        </div>
                        <img 
                            src='/img/main/hostinger.webp'
                            className="img-fluid rounded" 
                            alt="Hostinger"
                            style={{ borderRadius: '12px' }}
                        />
                    </a>
                </div>

                {/* Google Adsense */}
                <div className="sidebar-card">
                    <GoogleAdsense/>
                </div>
            </Col>
        </Row>
</Container>

            <FixedMobileNav isAuthenticated={(props.auth.user)? true : false} />

            {/* Subscription Modal */}
            {showSubscriptionModal && (
                <div 
                    className="modal-backdrop"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        zIndex: 1055,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'fadeIn 0.3s ease-in-out'
                    }}
                    onClick={closeSubscriptionModal}
                >
                    <div 
                        className="modal-content"
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '20px',
                            padding: '2.5rem',
                            maxWidth: '500px',
                            width: '90%',
                            maxHeight: '90vh',
                            overflow: 'auto',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                            transform: 'scale(1)',
                            animation: 'modalSlideIn 0.4s ease-out',
                            position: 'relative'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeSubscriptionModal}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'none',
                                border: 'none',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                color: '#6b7280',
                                padding: '0.5rem',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#f3f4f6';
                                e.target.style.color = '#374151';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = '#6b7280';
                            }}
                        >
                            ×
                        </button>

                        {/* Header */}
                        <div className="text-center mb-4">
                            <div 
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    backgroundColor: '#3b82f6',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1.5rem',
                                    boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
                                }}
                            >
                                <span className="material-symbols-outlined text-white" style={{ fontSize: '32px' }}>
                                    notifications_active
                                </span>
                            </div>
                            <h2 className="fw-bold mb-2" style={{ color: '#1f2937', fontSize: '1.75rem' }}>
                                Stay Updated
                            </h2>
                            <p className="text-muted mb-0" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                                Get the latest opportunities delivered directly to your inbox
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubscriptionSubmit}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold" style={{ color: '#374151' }}>
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        className="form-control"
                                        value={subscriptionForm.firstName}
                                        onChange={handleInputChange}
                                        required
                                        style={{
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '12px',
                                            padding: '0.75rem 1rem',
                                            fontSize: '1rem',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#3b82f6';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#e5e7eb';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                        placeholder="John"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold" style={{ color: '#374151' }}>
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        className="form-control"
                                        value={subscriptionForm.lastName}
                                        onChange={handleInputChange}
                                        required
                                        style={{
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '12px',
                                            padding: '0.75rem 1rem',
                                            fontSize: '1rem',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#3b82f6';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#e5e7eb';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>
                            
                            <div className="mb-4 mt-3">
                                <label className="form-label fw-semibold" style={{ color: '#374151' }}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    value={subscriptionForm.email}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '12px',
                                        padding: '0.75rem 1rem',
                                        fontSize: '1rem',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#3b82f6';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e5e7eb';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                    placeholder="john.doe@example.com"
                                />
                            </div>

                            {/* Benefits */}
                            <div className="mb-4 p-3" style={{ backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <h6 className="fw-semibold mb-2" style={{ color: '#374151' }}>What you'll receive:</h6>
                                <div className="d-flex flex-column gap-2">
                                    <div className="d-flex align-items-center">
                                        <span className="material-symbols-outlined text-success me-2" style={{ fontSize: '16px' }}>
                                            check_circle
                                        </span>
                                        <small className="text-muted">Weekly opportunities digest</small>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <span className="material-symbols-outlined text-success me-2" style={{ fontSize: '16px' }}>
                                            check_circle
                                        </span>
                                        <small className="text-muted">Early access to new listings</small>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <span className="material-symbols-outlined text-success me-2" style={{ fontSize: '16px' }}>
                                            check_circle
                                        </span>
                                        <small className="text-muted">Exclusive funding alerts</small>
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="d-flex gap-3">
                                <button
                                    type="button"
                                    onClick={closeSubscriptionModal}
                                    className="btn flex-fill"
                                    style={{
                                        backgroundColor: '#f3f4f6',
                                        color: '#6b7280',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '12px',
                                        padding: '0.75rem 1.5rem',
                                        fontWeight: '600',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = '#e5e7eb';
                                        e.target.style.color = '#374151';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = '#f3f4f6';
                                        e.target.style.color = '#6b7280';
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn flex-fill"
                                    style={{
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        border: '2px solid #3b82f6',
                                        borderRadius: '12px',
                                        padding: '0.75rem 1.5rem',
                                        fontWeight: '600',
                                        transition: 'all 0.2s ease',
                                        opacity: isSubmitting ? 0.7 : 1
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isSubmitting) {
                                            e.target.style.backgroundColor = '#2563eb';
                                            e.target.style.borderColor = '#2563eb';
                                            e.target.style.transform = 'translateY(-1px)';
                                            e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isSubmitting) {
                                            e.target.style.backgroundColor = '#3b82f6';
                                            e.target.style.borderColor = '#3b82f6';
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = 'none';
                                        }
                                    }}
                                >
                                    {isSubmitting ? (
                                        <div className="d-flex align-items-center justify-content-center">
                                            <div 
                                                className="spinner-border spinner-border-sm me-2"
                                                style={{ width: '16px', height: '16px' }}
                                            ></div>
                                            Subscribing...
                                        </div>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined me-2" style={{ fontSize: '18px' }}>
                                                send
                                            </span>
                                            Subscribe Now
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes modalSlideIn {
                    from { 
                        opacity: 0;
                        transform: scale(0.9) translateY(-20px);
                    }
                    to { 
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
            `}</style>

            </GuestLayout>
        
        </>
    )
}

export default ReadOpportunity;