import { useEffect, useState } from "react";
import Metadata from '@/Components/Metadata';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import GuestLayout from '@/Layouts/GuestLayout';
import { Link, usePage } from '@inertiajs/react';
import Container from 'react-bootstrap/Container';
import { getDaysLeft, getDaysLeftText, toggleShare, bookmark, pageLink } from "@/utils/Index";
import RecommendedContent from "@/Components/RecommendedContent";
import FixedMobileNav from '@/Components/FixedMobileNav';
import axios from 'axios';
import Swal from 'sweetalert2';
import { showOpportunitiesSubscriptionModal } from '@/Components/SubscriptionModal';
import AdBanner from '@/Components/AdBanner';

const ReadOpportunity = ({opp_posts, similarPosts, total_comments}) => {

    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const [fullURL, setFullUrl] = useState();
    const {props} = usePage();

    const [subscriptionForm, setSubscriptionForm] = useState({
        firstName: '',
        lastName: '',
        email: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isAuthenticated = props?.auth?.user ? true : false;

    const [showFloatingBookmark, setShowFloatingBookmark] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isFloatingBookmarkVisible, setIsFloatingBookmarkVisible] = useState(false);

    useEffect(()=>{
        const fullURL = window.location.href;
        setFullUrl(fullURL);

        const handleScroll = () => {
            const contentElement = document.querySelector('.article-content');
            if (!contentElement) return;

            const windowHeight = window.innerHeight;
            const contentRect = contentElement.getBoundingClientRect();
            const contentTop = contentRect.top;
            const contentHeight = contentRect.height;

            const scrolledPast = -contentTop;
            const readableHeight = contentHeight - windowHeight;
            const scrollPercent = readableHeight > 0
                ? (scrolledPast / readableHeight) * 100
                : 0;

            setScrollProgress(Math.min(Math.max(scrollPercent, 0), 100));

            const contentInView = contentTop < windowHeight && contentRect.bottom > 0;
            const shouldShow = contentInView && scrollPercent > 5 && scrollPercent < 100;
            setShowFloatingBookmark(shouldShow);

            setTimeout(() => {
                setIsFloatingBookmarkVisible(shouldShow);
            }, 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    },[])

    const showAuthModal = () => {
        Swal.fire({
            title: '',
            html: `
                <div style="text-align: center; padding: 20px;">
                    <p style="margin-bottom: 20px; color: #000; font-size: 16px; font-weight: 600;">
                        Join thousands of entrepreneurs accessing exclusive features
                    </p>
                    <div style="display: flex; flex-direction: column; gap: 12px; max-width: 320px; margin: 0 auto;">
                        <a href="/auth/google"
                           style="display: flex; align-items: center; justify-content: center; gap: 12px;
                                  padding: 12px 20px; background: #000; color: white; text-decoration: none;
                                  border-radius: 9999px; font-weight: 500; font-size: 14px; transition: all 0.15s ease;"
                           onmouseover="this.style.background='#333'"
                           onmouseout="this.style.background='#000'">
                            <img src="https://developers.google.com/identity/images/g-logo.png"
                                 width="18" height="18" style="background: white; padding: 2px; border-radius: 3px;">
                            Continue with Google
                        </a>
                        <a href="/auth/linkedin"
                           style="display: flex; align-items: center; justify-content: center; gap: 12px;
                                  padding: 12px 20px; background: #0077b5; color: white; text-decoration: none;
                                  border-radius: 9999px; font-weight: 500; font-size: 14px; transition: all 0.15s ease;"
                           onmouseover="this.style.background='#005885'"
                           onmouseout="this.style.background='#0077b5'">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                            Continue with LinkedIn
                        </a>
                        <div style="margin: 12px 0; color: #86868b; font-size: 13px;">or use email</div>
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
                Swal.mixin({ toast: true, position: "top-end", showConfirmButton: false, timer: 4000, timerProgressBar: true }).fire({ icon: "success", title: "Successfully subscribed!" });
                setSubscriptionForm({ firstName: '', lastName: '', email: '' });
            }
        } catch (error) {
            let errorMessage = 'An unexpected error occurred.';
            if (error.response?.status === 422) {
                errorMessage = error.response.data.errors?.email?.[0] || error.response.data.message || errorMessage;
            }
            Swal.mixin({ toast: true, position: "top-end", showConfirmButton: false, timer: 4000, timerProgressBar: true }).fire({ icon: "error", title: "Failed", text: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };

    const readingTime = Math.max(1, Math.ceil((opp_posts.description?.replace(/<[^>]*>/g, '').length || 0) / 1500));

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
        <div className="progress-ring">
            <svg className="progress-ring-svg" width="52" height="52">
                <circle className="progress-ring-circle-bg" cx="26" cy="26" r="22" />
                <circle
                    className="progress-ring-circle"
                    cx="26" cy="26" r="22"
                    style={{
                        strokeDasharray: `${scrollProgress * 1.382}, 138.2`,
                        transform: 'rotate(-90deg)',
                        transformOrigin: '26px 26px'
                    }}
                />
            </svg>
            <button
                className="floating-bookmark-btn"
                onClick={handleBookmark}
                data-product-id={opp_posts.id}
                data-bookmarked={opp_posts.is_bookmarked === 1}
                data-id={opp_posts.id}
                data-title={opp_posts.title}
                data-type="opp"
                title={opp_posts.is_bookmarked === 1 ? 'Remove from bookmarks' : 'Add to bookmarks'}
            >
                <span className="material-symbols-outlined bookmark-icon">
                    {opp_posts.is_bookmarked === 1 ? 'bookmark' : 'bookmark_border'}
                </span>
            </button>
        </div>
        <div className="floating-tooltip">
            <div className="tooltip-progress">{Math.round(scrollProgress)}%</div>
        </div>
    </div>
</div>

{/* Article Header Section */}
<section style={{ paddingTop: '80px', background: '#fff' }}>
    <Container>
        <Row className="justify-content-center">
            <Col lg={8} md={10}>
                <div style={{ paddingTop: '32px', paddingBottom: '24px' }}>
                    {/* Eyebrow - Brand/Source */}
                    <div className="d-flex flex-column align-items-start mb-3">
                        <span
                            className="section-eyebrow"
                            style={{ color: '#86868b' }}
                        >
                            {opp_posts.brand_labels && opp_posts.brand_labels.length > 0
                                ? opp_posts.brand_labels[0]?.name
                                : 'Edatsu'}
                        </span>
                        <div className="eyebrow-bar" style={{ margin: '8px 0 0' }} />
                    </div>

                    {/* Title */}
                    <h1
                        style={{
                            fontSize: 'clamp(28px, 5vw, 40px)',
                            fontWeight: 600,
                            lineHeight: 1.15,
                            color: '#000',
                            letterSpacing: '-0.015em',
                            marginBottom: '16px',
                        }}
                    >
                        {opp_posts.title}
                    </h1>

                    {/* Meta info */}
                    <div className="d-flex flex-wrap align-items-center gap-2 mb-3" style={{ fontSize: '13px', color: '#86868b' }}>
                        <span>
                            {opp_posts.brand_labels && opp_posts.brand_labels.length > 0
                                ? opp_posts.brand_labels[0]?.name
                                : 'Edatsu Media'}
                        </span>
                        <span>·</span>
                        <span>
                            {new Date(opp_posts.created_at).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </span>
                        <span>·</span>
                        <span>{readingTime} min read</span>
                    </div>

                    {/* Action bar */}
                    <div
                        className="d-flex align-items-center justify-content-between"
                        style={{
                            paddingTop: '16px',
                            paddingBottom: '16px',
                            borderTop: '1px solid #f0f0f0',
                            borderBottom: '1px solid #f0f0f0',
                        }}
                    >
                        {/* Deadline pill */}
                        {opp_posts.deadline && (
                            <span
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '4px 12px',
                                    borderRadius: '9999px',
                                    background: getDaysLeftText(opp_posts.deadline).includes('Expired') ? '#000' : '#f5f5f7',
                                    color: getDaysLeftText(opp_posts.deadline).includes('Expired') ? '#fff' : '#000',
                                    fontSize: '12px',
                                    fontWeight: 500,
                                }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>schedule</span>
                                {getDaysLeft(opp_posts.deadline)}
                            </span>
                        )}

                        {/* Share + Comments */}
                        <div className="d-flex align-items-center gap-3">
                            <button
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                                data-title={opp_posts.title}
                                data-id={opp_posts.id}
                                onClick={(e) => toggleShare(e.currentTarget)}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#86868b', transition: 'color 0.15s ease' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#000'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#86868b'}
                                >
                                    share
                                </span>
                            </button>
                            <button
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                onClick={() => document.getElementById('comments-section')?.scrollIntoView({behavior: 'smooth'})}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#86868b', transition: 'color 0.15s ease' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#000'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#86868b'}
                                >
                                    chat_bubble_outline
                                </span>
                                {total_comments > 0 && <span style={{ fontSize: '12px', color: '#86868b' }}>{total_comments}</span>}
                            </button>
                        </div>
                    </div>
                </div>
            </Col>
        </Row>
    </Container>
</section>

{/* Cover Image - Full Width */}
{opp_posts.cover_img && (
    <section style={{ background: '#fff', paddingBottom: '32px' }}>
        <Container>
            <Row className="justify-content-center">
                <Col lg={8} md={10}>
                    <div style={{ borderRadius: '24px', overflow: 'hidden' }}>
                        <img
                            src={`${(import.meta.env.VITE_R2_PUBLIC_URL || '').replace(/\/$/, '')}/uploads/opp/${opp_posts.cover_img}`}
                            alt={opp_posts.title}
                            style={{
                                width: '100%',
                                maxHeight: '500px',
                                objectFit: 'cover',
                                display: 'block',
                            }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    </div>
                </Col>
            </Row>
        </Container>
    </section>
)}

{/* Article Content + Sidebar */}
<section style={{ background: '#fff', paddingBottom: '96px' }}>
    <Container>
        <Row className="g-4 justify-content-center">
            {/* Main Content */}
            <Col lg={8} md={10}>
                {/* Article Body */}
                <div className="mb-5">
                    <div
                        className="article-content default-font-style"
                        dangerouslySetInnerHTML={{ __html: opp_posts.description }}
                        style={{
                            fontSize: '15px',
                            lineHeight: 1.7,
                            color: '#1d1d1f',
                            letterSpacing: '-0.01em',
                        }}
                    />
                </div>

                {/* Action Buttons */}
                <div
                    className="mb-5"
                    style={{ paddingTop: '24px', borderTop: '1px solid #f0f0f0' }}
                >
                    <div className="d-flex flex-wrap gap-3">
                        {opp_posts.direct_link && (
                            <a
                                href={opp_posts.direct_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '12px 32px',
                                    borderRadius: '9999px',
                                    background: '#000',
                                    color: '#fff',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    textDecoration: 'none',
                                    transition: 'all 0.15s ease',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#333'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#000'}
                            >
                                Apply Now
                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                            </a>
                        )}

                        {opp_posts.source_url && (
                            <a
                                href={opp_posts.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '12px 32px',
                                    borderRadius: '9999px',
                                    background: 'transparent',
                                    color: '#000',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    textDecoration: 'none',
                                    border: '1px solid #e5e5e5',
                                    transition: 'all 0.15s ease',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#000'; e.currentTarget.style.background = '#000'; e.currentTarget.style.color = '#fff'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#000'; }}
                            >
                                Read More
                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>open_in_new</span>
                            </a>
                        )}

                        <button
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '12px 32px',
                                borderRadius: '9999px',
                                background: 'transparent',
                                color: '#000',
                                fontSize: '14px',
                                fontWeight: 500,
                                border: '1px solid #e5e5e5',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                            }}
                            data-id={opp_posts.id}
                            data-title={opp_posts.title}
                            data-type="opp"
                            data-url={pageLink(opp_posts.title, opp_posts.id)}
                            onClick={handleBookmark}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#000'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e5e5'; }}
                        >
                            <span className="material-symbols-outlined" style={{
                                fontSize: '16px',
                                fontVariationSettings: opp_posts.is_bookmarked === 1 ? '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24' : '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24',
                                color: opp_posts.is_bookmarked === 1 ? '#f97316' : 'inherit',
                            }}>
                                bookmark
                            </span>
                            {opp_posts.is_bookmarked === 1 ? 'Saved' : 'Save'}
                        </button>

                        <div className="position-relative">
                            <div className="position-absolute share-panel border rounded fs-8 d-none"></div>
                            <button
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '12px 32px',
                                    borderRadius: '9999px',
                                    background: 'transparent',
                                    color: '#000',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    border: '1px solid #e5e5e5',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                }}
                                data-title={opp_posts.title}
                                data-id={opp_posts.id}
                                onClick={(e) => toggleShare(e.currentTarget)}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#000'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e5e5'; }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>share</span>
                                Share
                            </button>
                        </div>
                    </div>
                </div>

                {/* Recommended Content */}
                <div style={{ marginTop: '48px' }}>
                    <RecommendedContent similarPosts={similarPosts}/>
                </div>
            </Col>

            {/* Sidebar */}
            <Col lg={4} className="d-none d-lg-block">
                <div style={{ position: 'sticky', top: '72px' }}>
                    {/* Tags / Categories */}
                    <div
                        style={{
                            padding: '24px',
                            borderRadius: '16px',
                            border: '1px solid #f0f0f0',
                            background: '#fff',
                            marginBottom: '16px',
                        }}
                    >
                        <h6 style={{ fontSize: '12px', fontWeight: 500, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '16px' }}>
                            Tags
                        </h6>
                        <div className="d-flex flex-wrap gap-2">
                            {opp_posts?.categories && opp_posts.categories.split(',').filter(Boolean).map((cat, i) => (
                                <span key={`cat-${i}`} style={{
                                    padding: '4px 12px', borderRadius: '9999px', background: '#f5f5f7',
                                    fontSize: '12px', fontWeight: 500, color: '#000',
                                    transition: 'all 0.15s ease', cursor: 'default',
                                }}>
                                    {cat.trim()}
                                </span>
                            ))}
                            {opp_posts?.continents && opp_posts.continents.split(',').filter(Boolean).map((c, i) => (
                                <span key={`cont-${i}`} style={{
                                    padding: '4px 12px', borderRadius: '9999px', background: '#f5f5f7',
                                    fontSize: '12px', fontWeight: 500, color: '#000',
                                }}>
                                    {c.trim()}
                                </span>
                            ))}
                            {opp_posts?.countries && opp_posts.countries.split(',').filter(Boolean).map((c, i) => (
                                <span key={`country-${i}`} style={{
                                    padding: '4px 12px', borderRadius: '9999px', background: '#f5f5f7',
                                    fontSize: '12px', fontWeight: 500, color: '#000',
                                }}>
                                    {c.trim()}
                                </span>
                            ))}
                            {opp_posts?.regions && opp_posts.regions.split(',').filter(Boolean).map((r, i) => (
                                <span key={`region-${i}`} style={{
                                    padding: '4px 12px', borderRadius: '9999px', background: '#f5f5f7',
                                    fontSize: '12px', fontWeight: 500, color: '#000',
                                }}>
                                    {r.trim()}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Ad Banner */}
                    <div style={{ marginBottom: 16 }}>
                        <AdBanner slot="opp-view-sidebar" size="medium-rectangle" />
                    </div>

                    {/* Subscribe Box */}
                    <div
                        style={{
                            padding: '24px',
                            borderRadius: '16px',
                            background: '#000',
                            marginBottom: '16px',
                        }}
                    >
                        <h5 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#fff' }}>Newsletter</h5>
                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, marginBottom: '16px' }}>
                            Weekly opportunities delivered to your inbox.
                        </p>
                        <button
                            onClick={showOpportunitiesSubscriptionModal}
                            style={{
                                width: '100%',
                                padding: '10px 24px',
                                borderRadius: '9999px',
                                border: 'none',
                                background: '#fff',
                                color: '#000',
                                fontSize: '13px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f1f1f1'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                        >
                            Subscribe
                        </button>
                    </div>
                </div>
            </Col>
        </Row>
    </Container>
</section>

<FixedMobileNav isAuthenticated={(props.auth.user)? true : false} />
</GuestLayout>
        </>
    )
}

export default ReadOpportunity;
