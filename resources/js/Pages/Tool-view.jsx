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
import AdBanner from '@/Components/AdBanner';

const ReadTool = ({tool_data, similarPosts}) => {

    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const [fullURL, setFullUrl] = useState();
    const [showRating, setShowRating] = useState(false);
    const {props} = usePage();

    useEffect(()=>{
        const fullURL = window.location.href;
        setFullUrl(fullURL);
    },[])

    const coverImageUrl = tool_data.cover_img
        ? `${(import.meta.env.VITE_R2_PUBLIC_URL || '').replace(/\/$/, '')}/uploads/prod/${tool_data.cover_img}`
        : null;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return(
        <GuestLayout>
            <Metadata
                title={tool_data?.title}
                description={tool_data?.meta_description}
                keywords={tool_data?.meta_keywords}
                canonicalUrl={fullURL}
                ogTitle={tool_data?.title}
                ogDescription={tool_data?.meta_description}
                ogImage={coverImageUrl}
                ogUrl={fullURL}
                twitterTitle={tool_data?.title}
                twitterDescription={tool_data?.meta_description}
                twitterImage={coverImageUrl}
            />

            {/* Page Header */}
            <section style={{ paddingTop: '96px', paddingBottom: '32px', background: '#fff' }}>
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={8} md={10}>
                            {/* Eyebrow */}
                            <div className="d-flex flex-column align-items-start mb-4">
                                <span
                                    className="section-eyebrow"
                                    style={{ color: '#86868b' }}
                                >
                                    Toolshed
                                </span>
                                <div className="eyebrow-bar" style={{ margin: '8px 0 0' }} />
                            </div>

                            {/* Tool Header */}
                            <div className="d-flex align-items-start gap-3 mb-4">
                                {coverImageUrl && (
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        flexShrink: 0,
                                        background: '#f5f5f7',
                                    }}>
                                        <img
                                            src={coverImageUrl}
                                            alt={tool_data.title}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
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
                                <div className="flex-grow-1">
                                    <h1 style={{
                                        fontSize: 'clamp(24px, 4vw, 32px)',
                                        fontWeight: 600,
                                        color: '#000',
                                        letterSpacing: '-0.01em',
                                        lineHeight: 1.2,
                                        marginBottom: '8px',
                                    }}>
                                        {tool_data.title}
                                    </h1>
                                    <p style={{
                                        fontSize: '14px',
                                        color: '#86868b',
                                        lineHeight: 1.5,
                                        marginBottom: '8px',
                                        maxWidth: '560px',
                                    }}>
                                        {tool_data.meta_description || 'Productivity tool for your workflow'}
                                    </p>
                                    <span style={{
                                        fontSize: '12px',
                                        color: '#86868b',
                                        fontWeight: 400,
                                    }}>
                                        {formatDate(tool_data.created_at)}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="d-flex flex-wrap gap-2">
                                {tool_data.direct_link && (
                                    <a
                                        href={tool_data.direct_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '10px 24px',
                                            borderRadius: '9999px',
                                            border: 'none',
                                            background: '#000',
                                            color: '#fff',
                                            fontSize: '13px',
                                            fontWeight: 500,
                                            textDecoration: 'none',
                                            transition: 'all 0.15s ease',
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#333'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = '#000'}
                                    >
                                        Try Tool
                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>open_in_new</span>
                                    </a>
                                )}
                                {tool_data.source_url && (
                                    <a
                                        href={tool_data.source_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '10px 24px',
                                            borderRadius: '9999px',
                                            border: '1px solid #e5e5e5',
                                            background: 'transparent',
                                            color: '#000',
                                            fontSize: '13px',
                                            fontWeight: 500,
                                            textDecoration: 'none',
                                            transition: 'all 0.15s ease',
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#000'; e.currentTarget.style.background = '#000'; e.currentTarget.style.color = '#fff'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#000'; }}
                                    >
                                        Website
                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>language</span>
                                    </a>
                                )}
                                <div className="position-relative">
                                    <div className="position-absolute share-panel border rounded fs-8 d-none"></div>
                                    <button
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '10px 24px',
                                            borderRadius: '9999px',
                                            border: '1px solid #e5e5e5',
                                            background: 'transparent',
                                            color: '#000',
                                            fontSize: '13px',
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                            transition: 'all 0.15s ease',
                                        }}
                                        data-title={tool_data.title}
                                        data-id={tool_data.id}
                                        onClick={(e) => toggleShare(e.currentTarget)}
                                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#000'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e5e5'; }}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>share</span>
                                        Share
                                    </button>
                                </div>
                                <button
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '10px 24px',
                                        borderRadius: '9999px',
                                        border: '1px solid #e5e5e5',
                                        background: 'transparent',
                                        color: tool_data.is_bookmarked === 1 ? '#f97316' : '#000',
                                        fontSize: '13px',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease',
                                    }}
                                    data-id={tool_data.id}
                                    data-title={tool_data.title}
                                    data-type="ts"
                                    data-url={pageLink('product', tool_data.slug, tool_data.id)}
                                    onClick={(e) => bookmark(e.currentTarget)}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#000'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e5e5'; }}
                                >
                                    <span
                                        className="material-symbols-outlined"
                                        style={{
                                            fontSize: '16px',
                                            fontVariationSettings: tool_data.is_bookmarked === 1
                                                ? '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24'
                                                : '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24',
                                        }}
                                    >
                                        bookmark
                                    </span>
                                    {tool_data.is_bookmarked === 1 ? 'Saved' : 'Save'}
                                </button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Main Content */}
            <section style={{ paddingBottom: '96px', background: '#f5f5f7' }}>
                <Container>
                    <Row className="g-4 justify-content-center" style={{ paddingTop: '32px' }}>
                        {/* Article Content */}
                        <Col lg={8} md={10}>
                            {/* Video Section */}
                            {tool_data.youtube_link ? (
                                <div style={{
                                    borderRadius: '24px',
                                    overflow: 'hidden',
                                    marginBottom: '32px',
                                    background: '#000',
                                }}>
                                    <div className="ratio ratio-16x9">
                                        <iframe
                                            src={(() => {
                                                let url = tool_data.youtube_link;
                                                if (url.includes('watch?v=')) {
                                                    url = url.replace('watch?v=', 'embed/');
                                                } else if (url.includes('youtu.be/')) {
                                                    url = url.replace('youtu.be/', 'youtube.com/embed/');
                                                } else if (!url.includes('youtube.com/embed/')) {
                                                    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
                                                    if (videoId) {
                                                        url = `https://www.youtube.com/embed/${videoId[1]}`;
                                                    }
                                                }
                                                return url;
                                            })()}
                                            title="Demo"
                                            allowFullScreen
                                            style={{ border: 'none' }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div style={{
                                    borderRadius: '24px',
                                    padding: '48px 24px',
                                    background: '#fff',
                                    border: '1px solid #f0f0f0',
                                    textAlign: 'center',
                                    marginBottom: '32px',
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#e5e5e5', marginBottom: '12px', display: 'block' }}>
                                        play_circle
                                    </span>
                                    <p style={{ fontSize: '14px', color: '#86868b', marginBottom: '16px' }}>Video review coming soon</p>
                                    <button
                                        onClick={showToolsSubscriptionModal}
                                        style={{
                                            padding: '10px 24px',
                                            borderRadius: '9999px',
                                            border: '1px solid #e5e5e5',
                                            background: 'transparent',
                                            color: '#000',
                                            fontSize: '13px',
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                            transition: 'all 0.15s ease',
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = '#000'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#000'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#000'; e.currentTarget.style.borderColor = '#e5e5e5'; }}
                                    >
                                        Get Notified
                                    </button>
                                </div>
                            )}

                            {/* About Section */}
                            <div style={{
                                background: '#fff',
                                borderRadius: '24px',
                                border: '1px solid #f0f0f0',
                                padding: '32px',
                                marginBottom: '24px',
                            }}>
                                <h2 style={{
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: '#86868b',
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    marginBottom: '20px',
                                }}>
                                    About
                                </h2>
                                <div
                                    className="default-font-style article-content"
                                    style={{
                                        fontSize: '15px',
                                        lineHeight: 1.7,
                                        color: '#000',
                                    }}
                                    dangerouslySetInnerHTML={{ __html: tool_data.description }}
                                />
                            </div>

                            {/* Tags */}
                            {(Array.isArray(tool_data.categories) || Array.isArray(tool_data.tags)) && (
                                <div style={{
                                    background: '#fff',
                                    borderRadius: '24px',
                                    border: '1px solid #f0f0f0',
                                    padding: '32px',
                                    marginBottom: '24px',
                                }}>
                                    <h2 style={{
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: '#86868b',
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                        marginBottom: '16px',
                                    }}>
                                        Tags
                                    </h2>
                                    <div className="d-flex flex-wrap gap-2">
                                        {Array.isArray(tool_data.categories) && tool_data.categories.map((cat, i) => (
                                            <span
                                                key={`cat-${i}`}
                                                style={{
                                                    fontSize: '12px',
                                                    fontWeight: 500,
                                                    padding: '6px 14px',
                                                    borderRadius: '9999px',
                                                    backgroundColor: '#f5f5f7',
                                                    color: '#000',
                                                }}
                                            >
                                                {cat.name}
                                            </span>
                                        ))}
                                        {Array.isArray(tool_data.tags) && tool_data.tags.map((tag, i) => (
                                            <span
                                                key={`tag-${i}`}
                                                style={{
                                                    fontSize: '12px',
                                                    fontWeight: 500,
                                                    padding: '6px 14px',
                                                    borderRadius: '9999px',
                                                    backgroundColor: '#f5f5f7',
                                                    color: '#000',
                                                }}
                                            >
                                                {tag.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Rating Section */}
                            <div style={{
                                background: '#fff',
                                borderRadius: '24px',
                                border: '1px solid #f0f0f0',
                                padding: '32px',
                                marginBottom: '24px',
                            }}>
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <h2 style={{
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: '#86868b',
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                        marginBottom: 0,
                                    }}>
                                        Rating
                                    </h2>
                                    <button
                                        onClick={() => setShowRating(!showRating)}
                                        style={{
                                            padding: '6px 16px',
                                            borderRadius: '9999px',
                                            border: '1px solid #e5e5e5',
                                            background: showRating ? '#000' : 'transparent',
                                            color: showRating ? '#fff' : '#000',
                                            fontSize: '12px',
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                            transition: 'all 0.15s ease',
                                        }}
                                    >
                                        {showRating ? 'Hide' : 'Rate this'}
                                    </button>
                                </div>
                                {showRating && (
                                    <ProductRating
                                        productId={tool_data?.id}
                                        isAuthenticated={props?.auth?.user ? true : false}
                                        initialRating={tool_data?.average_rating || 0}
                                        initialCount={tool_data?.total_ratings || 0}
                                        showRatingForm={true}
                                    />
                                )}
                            </div>

                            {/* Recommended */}
                            <div style={{
                                background: '#fff',
                                borderRadius: '24px',
                                border: '1px solid #f0f0f0',
                                padding: '32px',
                            }}>
                                <RecommendedContent similarPosts={similarPosts}/>
                            </div>
                        </Col>

                        {/* Sidebar */}
                        <Col lg={4} className="d-none d-lg-block">
                            <div style={{ position: 'sticky', top: '72px' }}>
                                {/* Ad Banner */}
                                <div style={{ marginBottom: '24px' }}>
                                    <AdBanner slot="tool-view-sidebar" page="tool-view" position="sidebar-right" size="medium-rectangle" />
                                </div>

                                {/* Tool Quick Info */}
                                <div style={{
                                    background: '#fff',
                                    borderRadius: '16px',
                                    border: '1px solid #f0f0f0',
                                    padding: '24px',
                                    marginBottom: '24px',
                                }}>
                                    <h3 style={{
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: '#86868b',
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                        marginBottom: '16px',
                                    }}>
                                        Quick Info
                                    </h3>
                                    <div className="d-flex flex-column gap-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <span style={{ fontSize: '13px', color: '#86868b' }}>Rating</span>
                                            <div className="d-flex align-items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span
                                                        key={star}
                                                        className="material-symbols-outlined"
                                                        style={{
                                                            fontSize: '14px',
                                                            color: star <= Math.round(tool_data.average_rating || 0) ? '#f97316' : '#e5e5e5',
                                                            fontVariationSettings: star <= Math.round(tool_data.average_rating || 0) ? '"FILL" 1' : '"FILL" 0',
                                                        }}
                                                    >
                                                        star
                                                    </span>
                                                ))}
                                                <span style={{ fontSize: '12px', color: '#000', fontWeight: 500, marginLeft: '4px' }}>
                                                    {tool_data.average_rating ? parseFloat(tool_data.average_rating).toFixed(1) : '0.0'}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ height: '1px', background: '#f0f0f0' }} />
                                        <div className="d-flex align-items-center justify-content-between">
                                            <span style={{ fontSize: '13px', color: '#86868b' }}>Reviews</span>
                                            <span style={{ fontSize: '13px', color: '#000', fontWeight: 500 }}>
                                                {tool_data.total_ratings || 0}
                                            </span>
                                        </div>
                                        <div style={{ height: '1px', background: '#f0f0f0' }} />
                                        <div className="d-flex align-items-center justify-content-between">
                                            <span style={{ fontSize: '13px', color: '#86868b' }}>Added</span>
                                            <span style={{ fontSize: '13px', color: '#000', fontWeight: 500 }}>
                                                {formatDate(tool_data.created_at)}
                                            </span>
                                        </div>
                                    </div>

                                    {tool_data.direct_link && (
                                        <a
                                            href={tool_data.direct_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-decoration-none"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '6px',
                                                width: '100%',
                                                padding: '10px 24px',
                                                borderRadius: '9999px',
                                                border: 'none',
                                                background: '#000',
                                                color: '#fff',
                                                fontSize: '13px',
                                                fontWeight: 500,
                                                marginTop: '20px',
                                                transition: 'all 0.15s ease',
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#333'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = '#000'}
                                        >
                                            Try Tool
                                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                                        </a>
                                    )}
                                </div>

                                {/* Newsletter */}
                                <div style={{
                                    padding: '24px',
                                    borderRadius: '16px',
                                    background: '#000',
                                    color: '#fff',
                                }}>
                                    <h5 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#fff' }}>
                                        Stay Updated
                                    </h5>
                                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, marginBottom: '16px' }}>
                                        Get the latest tools & productivity insights
                                    </p>
                                    <button
                                        onClick={showToolsSubscriptionModal}
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
        </GuestLayout>
    )
}

export default ReadTool;
