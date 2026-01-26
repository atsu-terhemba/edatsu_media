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
import FlatButton from '@/Components/FlatButton';
// import GoogleAdsense from '@/Components/GoogleAdsense';
// import AdBanner from '@/Components/AdBanner';

const ReadTool = ({tool_data, similarPosts}) => {

    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const [fullURL, setFullUrl] = useState();
    const [showRating, setShowRating] = useState(false);
    const {props} = usePage();

    useEffect(()=>{
        console.log(props);
        const fullURL = window.location.href;
        setFullUrl(fullURL);
        console.log(tool_data);
    },[])

    // iOS-inspired minimal styles
    const styles = {
        container: {
            minHeight: '100vh',
        },
        header: {
            padding: '20px 0',
        },
        toolIcon: {
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            objectFit: 'cover',
        },
        title: {
            fontSize: '24px',
            fontWeight: '600',
            color: '#1d1d1f',
            letterSpacing: '-0.02em',
            marginBottom: '8px',
            lineHeight: '1.2',
        },
        subtitle: {
            fontSize: '14px',
            color: '#6e6e73',
            fontWeight: '400',
            lineHeight: '1.5',
        },
        metaText: {
            fontSize: '12px',
            color: '#86868b',
            fontWeight: '400',
        },
        sectionTitle: {
            fontSize: '12px',
            fontWeight: '600',
            color: '#86868b',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            marginBottom: '16px',
        },
        button: {
            fontSize: '14px',
            fontWeight: '500',
            padding: '10px 20px',
            borderRadius: '20px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
        },
        primaryButton: {
            backgroundColor: '#1d1d1f',
            color: '#ffffff',
        },
        secondaryButton: {
            backgroundColor: '#f5f5f7',
            color: '#1d1d1f',
        },
        outlineButton: {
            backgroundColor: 'transparent',
            color: '#1d1d1f',
            border: '1px solid #d2d2d7',
        },
        card: {
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #e5e5e5',
        },
        divider: {
            height: '1px',
            backgroundColor: '#f0f0f0',
            margin: '24px 0',
        },
        tag: {
            fontSize: '12px',
            fontWeight: '500',
            padding: '6px 12px',
            borderRadius: '16px',
            backgroundColor: '#f5f5f7',
            color: '#1d1d1f',
            marginRight: '8px',
            marginBottom: '8px',
            display: 'inline-block',
        },
        content: {
            fontSize: '15px',
            lineHeight: '1.7',
            color: '#1d1d1f',
        },
    };

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

<Container fluid={true} className="container-fluid container-lg" style={styles.container}>
        <Row className="g-4">
            <Col lg={8} md={12} sm={12}>
                {/* Header Section */}
                <div style={styles.header} className="mt-3">
                    <div className="d-flex align-items-start gap-3">
                        {tool_data.cover_img && (
                            <img
                                src={`${(import.meta.env.VITE_R2_PUBLIC_URL || '').replace(/\/$/, '')}/uploads/prod/${tool_data.cover_img}`}
                                alt={tool_data.title}
                                style={styles.toolIcon}
                                onError={(e) => {
                                    if (!e.target.getAttribute('data-error-handled')) {
                                        e.target.setAttribute('data-error-handled', 'true');
                                        e.target.onerror = null;
                                        e.target.src = "/img/logo/main_2.png";
                                    }
                                }}
                            />
                        )}
                        <div className="flex-grow-1">
                            <h1 style={styles.title}>{tool_data.title}</h1>
                            <p style={styles.subtitle} className="mb-2">
                                {tool_data.meta_description || 'Productivity tool for your workflow'}
                            </p>
                            <span style={styles.metaText}>
                                {new Date(tool_data.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="mt-3">
                        <div className="d-flex flex-wrap gap-2">
                            {/* Share Button */}
                            <div className="position-relative">
                                <div className="position-absolute share-panel border rounded fs-8 d-none"></div>
                                <button 
                                    className="btn btn-outline-secondary btn-sm px-3"
                                    style={{ fontSize: '13px', borderRadius: '6px' }}
                                    data-title={tool_data.title} 
                                    data-id={tool_data.id} 
                                    onClick={(e) => toggleShare(e.currentTarget)}
                                >
                                    Share
                                </button>
                            </div>
                            
                            {/* Bookmark Button */}
                            <button 
                                className="btn btn-outline-secondary btn-sm px-3"
                                style={{ fontSize: '13px', borderRadius: '6px' }}
                                data-id={tool_data.id}
                                data-title={tool_data.title}
                                data-type="ts"
                                data-url={pageLink('product', tool_data.slug, tool_data.id)}
                                onClick={(e) => bookmark(e.currentTarget)}
                            >
                                {tool_data.is_bookmarked === 1 ? 'Saved' : 'Save'}
                            </button>
                            
                            {/* Try Tool Button */}
                            {tool_data.direct_link && (
                                <a 
                                    className="btn btn-dark btn-sm px-3"
                                    style={{ fontSize: '13px', borderRadius: '6px' }}
                                    href={tool_data.direct_link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    Try Tool
                                </a>
                            )}
                            
                            {/* Website Button */}
                            {tool_data.source_url && (
                                <a 
                                    className="btn btn-outline-dark btn-sm px-3"
                                    style={{ fontSize: '13px', borderRadius: '6px' }}
                                    href={tool_data.source_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    Website
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Video Section */}
                {tool_data.youtube_link ? (
                    <div className="my-4">
                        <div className="ratio ratio-16x9" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                            <iframe
                                src={(() => {
                                    let url = tool_data.youtube_link;
                                    if (url.includes('watch?v=')) {
                                        url = url.replace('watch?v=', 'embed/');
                                    } else if (url.includes('youtu.be/')) {
                                        url = url.replace('youtu.be/', 'youtube.com/embed/');
                                    } else if (url.includes('youtube.com/embed/')) {
                                    } else {
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
                    <div className="my-4" style={{...styles.card, textAlign: 'center', padding: '32px'}}>
                        <p style={{...styles.subtitle, marginBottom: '12px'}}>Video review coming soon</p>
                        <button 
                            style={{...styles.button, ...styles.secondaryButton}}
                            onClick={showToolsSubscriptionModal}
                        >
                            Get Notified
                        </button>
                    </div>
                )}

                <div style={styles.divider}></div>

                {/* Description */}
                <div className="mb-4">
                    <h2 style={styles.sectionTitle}>About</h2>
                    <div 
                        className="default-font-style" 
                        style={{ fontSize: '14px', color: '#1d1d1f', lineHeight: '1.6' }}
                        dangerouslySetInnerHTML={{ __html: tool_data.description }}
                    ></div>
                </div>

                <div style={styles.divider}></div>
                
                {/* Tags */}
                {(Array.isArray(tool_data.categories) || Array.isArray(tool_data.tags)) && (
                    <div className="mb-4">
                        <h2 style={styles.sectionTitle}>Tags</h2>
                        <div className="d-flex flex-wrap">
                            {Array.isArray(tool_data.categories) && tool_data.categories.map((cat, i) => (
                                <span key={`cat-${i}`} style={styles.tag}>{cat.name}</span>
                            ))}
                            {Array.isArray(tool_data.tags) && tool_data.tags.map((tag, i) => (
                                <span key={`tag-${i}`} style={styles.tag}>{tag.name}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Rating Section */}
                <div className="mb-4">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <h2 style={{...styles.sectionTitle, marginBottom: 0}}>Rating</h2>
                        <FlatButton 
                            variant="primary" 
                            size="sm"
                            onClick={() => setShowRating(!showRating)}
                        >
                            {showRating ? 'Hide' : 'Rate this'}
                        </FlatButton>
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
                <div className="mb-4">
                    <h2 style={styles.sectionTitle}>Similar Tools</h2>
                    <RecommendedContent similarPosts={similarPosts}/>
                </div>
            </Col>
            
            {/* Sidebar */}
            <Col lg={4} md={12} sm={12} className="mt-4">
                {/* Ad Placeholder */}
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
                        fontWeight: 500,
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
                        Weekly tools & insights in your inbox.
                    </p>
                    <button
                        onClick={showToolsSubscriptionModal}
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
            </Col>
        </Row>
    </Container>

</GuestLayout>
        
        </>
    )
}

export default ReadTool;
