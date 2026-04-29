import Container from 'react-bootstrap/Container';
import Metadata from '@/Components/Metadata';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import ToolshedFilter from '@/Components/ToolSearchFilter';
import axios from 'axios';
import DefaultPagination from '@/Components/DefaultPagination';
import React, { useEffect, useCallback, useMemo, useState, Suspense } from "react";
import { useRef } from 'react';
import FilterLabels from '@/Components/FilterSearchLabels';
import { useContext } from 'react';
import { AuthContext } from '@/Layouts/GuestLayout';
import FixedMobileNav from '@/Components/FixedMobileNav';
import ScrollToTop from '@/Components/ScrollToTop';

import { showToolsSubscriptionModal } from '@/Components/SubscriptionModal';
import ToolshedSkeleton from '@/Components/ToolshedSkeleton';
import AdBanner from '@/Components/AdBanner';
import PreferencesBanner from '@/Components/PreferencesBanner';
import CompareBar from '@/Components/CompareBar';
import Swal from 'sweetalert2';
import { showProUpgrade } from '@/utils/proUpgrade';

const DisplayToolshed = React.lazy(() => import('@/Components/Toolshed'));

const LEGACY_COMPARE_STORAGE_KEY = 'edatsu:compareTools';
const compareStorageKey = (userId) => `edatsu:compareTools:${userId ? `u${userId}` : 'guest'}`;
const COMPARE_TIP_DISMISSED_KEY = 'edatsu:compareTipDismissed';

const Toolshed = () => {
    const paginationContainerRef = useRef(null);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState([]);
    const [rootURL, setRootURL] = useState("search-products");
    const [search_keyword, setSearchKeyword] = useState('');
    const [isloading, setIsLoading] = useState('initial');
    const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);
    const [showLabels, setShowLabels] = useState(false);

    const authUser = useContext(AuthContext);
    const props = usePage().props;

    // Compare selection state (Pro feature: free=2, pro=5)
    const isPro = Boolean(props?.auth?.isPro);
    const compareMax = isPro ? 5 : 2;
    const authUserId = props?.auth?.user?.id ?? null;
    const storageKey = useMemo(() => compareStorageKey(authUserId), [authUserId]);
    const [compareTools, setCompareTools] = useState([]);

    useEffect(() => {
        try {
            // Retire the shared legacy key that leaked selections across accounts
            localStorage.removeItem(LEGACY_COMPARE_STORAGE_KEY);

            const raw = localStorage.getItem(storageKey);
            if (!raw) {
                setCompareTools([]);
                return;
            }
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) {
                setCompareTools([]);
                return;
            }
            if (parsed.length && typeof parsed[0] !== 'object') {
                localStorage.removeItem(storageKey);
                setCompareTools([]);
                return;
            }
            setCompareTools(parsed.filter((t) => t && t.id));
        } catch (e) {
            setCompareTools([]);
        }
    }, [storageKey]);

    const persistCompare = useCallback((next) => {
        setCompareTools(next);
        try {
            localStorage.setItem(storageKey, JSON.stringify(next));
        } catch (e) {
            // ignore
        }
    }, [storageKey]);

    const toggleCompare = useCallback((tool) => {
        if (!tool || !tool.id) return;
        const id = Number(tool.id);
        const already = compareTools.some((t) => Number(t.id) === id);
        if (already) {
            persistCompare(compareTools.filter((t) => Number(t.id) !== id));
            return;
        }
        if (compareTools.length >= compareMax) {
            if (isPro) {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'info',
                    title: `You can compare up to ${compareMax} tools at once`,
                    showConfirmButton: false,
                    timer: 2500,
                });
            } else {
                showProUpgrade({ feature: 'compare_tools', limit: compareMax });
            }
            return;
        }
        const meta = {
            id: Number(tool.id),
            product_name: tool.product_name,
            cover_img: tool.cover_img,
            slug: tool.slug,
        };
        persistCompare([...compareTools, meta]);
    }, [compareTools, compareMax, isPro, persistCompare]);

    const removeCompare = useCallback((toolId) => {
        persistCompare(compareTools.filter((t) => Number(t.id) !== Number(toolId)));
    }, [compareTools, persistCompare]);

    const clearCompare = useCallback(() => {
        persistCompare([]);
    }, [persistCompare]);

    const compareIdSet = useMemo(() => new Set(compareTools.map((t) => Number(t.id))), [compareTools]);

    const [showCompareTip, setShowCompareTip] = useState(false);
    useEffect(() => {
        try {
            if (!localStorage.getItem(COMPARE_TIP_DISMISSED_KEY)) setShowCompareTip(true);
        } catch (e) {
            setShowCompareTip(true);
        }
    }, []);

    const dismissCompareTip = useCallback(() => {
        setShowCompareTip(false);
        try {
            localStorage.setItem(COMPARE_TIP_DISMISSED_KEY, '1');
        } catch (e) {
            // ignore
        }
    }, []);

    const [filter_data, setFilterData] = useState({
        categories: [],
        continents: [],
        countries: [],
        brands:[],
        datePosted:'',
        month: '',
        year: '',
        program_status:'',
    });

    useEffect(() => {
        axios.get('search-products')
        .then(function (response) {
            setData(response.data?.data || []);
            setPagination(response.data?.links || []);
        })
        .catch(function (error) {
            console.error("Error fetching initial products:", error);
            setData([]);
            setPagination([]);
        })
        .finally(() => {
            setIsLoading('');
        });
    }, []);

    const prevKeywordRef = useRef(search_keyword);

    const initSearch = useCallback((e) => {
        e?.preventDefault();
        if (!rootURL) {
            setIsLoading('');
            return;
        }
        const loadingId = e?.target?.id || '';
        setIsLoading(loadingId);

        const isManualSearch = e && (loadingId === 'search-btn' || loadingId === 'filter-btn');

        axios.get(rootURL, { params: {
            ...filter_data,
            search_keyword: search_keyword
            } })
            .then((res) => {
                setData(res.data.data || []);
                setPagination(res.data.links || []);

                if (window.innerWidth <= 768 && isMobileSearchVisible && isManualSearch) {
                    setTimeout(() => {
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                        setIsMobileSearchVisible(false);
                    }, 300);
                }
            })
            .catch((error) => {
                console.error("Error fetching tools:", error);
            })
            .finally(() => {
                setIsLoading('');
            });
    },[rootURL, filter_data, search_keyword, isMobileSearchVisible]);

    useEffect(()=>{
        initSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter_data]);

    useEffect(() => {
        const prev = prevKeywordRef.current;
        prevKeywordRef.current = search_keyword;
        if (prev && !search_keyword) {
            initSearch();
        }
    }, [search_keyword, initSearch]);

    function triggerPagination(url) {
        const container = paginationContainerRef.current;
        const containerPosition = container ? container.getBoundingClientRect().top + window.scrollY : 0;
        setIsLoading('pagination');
        axios.get(url)
        .then((response) => {
            setData(response.data.data || []);
            setPagination(response.data.links || []);
            setTimeout(() => {
                if (container) {
                    window.scrollTo({
                        top: containerPosition - 100,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        })
        .catch((error) => {
            console.error("Error in pagination:", error);
        })
        .finally(() => {
            setIsLoading('');
        });
    }

    const toggleSearch = () => {
        setIsMobileSearchVisible(!isMobileSearchVisible);
    }

    return (
        <GuestLayout>
            <Metadata
                title="Business Tools & Software for Entrepreneurs | Edatsu Toolshed"
                description="Discover curated business tools, productivity software, AI tools, and SaaS solutions reviewed by entrepreneurs. Find the best tools to grow your business with Edatsu Media's Toolshed."
                keywords="business tools, entrepreneur software, productivity tools, AI tools for business, SaaS reviews, marketing tools, project management software, business automation, startup tools, Edatsu Toolshed"
                canonicalUrl="https://www.edatsu.com/toolshed"
                ogTitle="Business Tools & Software for Entrepreneurs | Edatsu Toolshed"
                ogDescription="Curated collection of business tools, productivity software, and AI solutions reviewed by real entrepreneurs. Find your perfect business toolkit."
                ogImage="/img/logo/default_logo.jpg"
                ogUrl="https://www.edatsu.com/toolshed"
                twitterTitle="Business Tools & Software for Entrepreneurs | Edatsu Toolshed"
                twitterDescription="Curated collection of business tools, productivity software, and AI solutions reviewed by real entrepreneurs. Find your perfect business toolkit."
                twitterImage="/img/logo/default_logo.jpg"
            />

            {/* Page Header */}
            <section style={{ paddingTop: '96px', paddingBottom: '48px', background: '#fff' }}>
                <Container>
                    <div className="d-flex flex-column align-items-start">
                        <div className="d-flex flex-column align-items-start mb-3">
                            <span
                                className="section-eyebrow"
                                style={{ color: '#86868b' }}
                            >
                                Discover
                            </span>
                            <div className="eyebrow-bar" style={{ margin: '8px 0 0' }} />
                        </div>
                        <h1
                            style={{
                                fontSize: 'clamp(30px, 5vw, 36px)',
                                fontWeight: 600,
                                color: '#000',
                                letterSpacing: '-0.01em',
                                lineHeight: 1.15,
                                marginBottom: '12px',
                            }}
                        >
                            Toolshed
                        </h1>
                        <p
                            style={{
                                fontSize: '14px',
                                color: '#86868b',
                                lineHeight: 1.625,
                                fontWeight: 400,
                                maxWidth: '480px',
                                margin: 0,
                            }}
                        >
                            Discover the best tools to build, market & scale your business
                        </p>
                    </div>
                </Container>
            </section>

            {/* Main Content */}
            <section style={{ paddingBottom: '96px', background: '#f5f5f7' }}>
                <Container>
                    <div style={{ paddingTop: '32px', paddingBottom: '8px' }}>
                        <PreferencesBanner section="toolshed" />
                    </div>
                    <Row className="g-4">
                        {/* Sidebar */}
                        <Col xs={12} md={4} lg={3} className={isMobileSearchVisible ? '' : 'd-none d-md-block'}>
                            <div
                                className={`${isMobileSearchVisible ? 'mobile-fixed-toggle' : 'd-none d-md-block'}`}
                                id="searchBar"
                                style={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #f0f0f0',
                                    borderRadius: '16px',
                                    position: 'sticky',
                                    top: '72px',
                                    maxHeight: isMobileSearchVisible ? '85vh' : 'calc(100vh - 100px)',
                                    overflowY: 'auto',
                                }}
                            >
                                <div className="p-4">
                                    <div className="d-flex align-items-center justify-content-between mb-4">
                                        <div className="d-flex align-items-center gap-2">
                                            <span
                                                className="material-symbols-outlined d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    backgroundColor: '#000',
                                                    color: '#fff',
                                                    fontSize: '16px',
                                                }}
                                            >
                                                filter_list
                                            </span>
                                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#000' }}>
                                                Filters
                                            </span>
                                        </div>
                                        {isMobileSearchVisible && (
                                            <button
                                                onClick={toggleSearch}
                                                style={{
                                                    background: 'transparent',
                                                    border: '1px solid #e5e5e5',
                                                    borderRadius: '9999px',
                                                    padding: '4px 12px',
                                                    fontSize: '12px',
                                                    fontWeight: 500,
                                                    color: '#000',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.15s ease',
                                                }}
                                            >
                                                Close
                                            </button>
                                        )}
                                    </div>

                                    <ToolshedFilter
                                        isloading={isloading}
                                        filter_data={filter_data}
                                        search_keyword={search_keyword}
                                        setSearchKeyword={setSearchKeyword}
                                        setFilterData={setFilterData}
                                        categories={props.categories}
                                        brands={props.brands}
                                        tags={props.tags}
                                        initSearch={initSearch}
                                    />
                                </div>

                                {/* Subscribe box - Desktop Only */}
                                <div className="px-4 pb-4 d-none d-lg-block">
                                    <div
                                        style={{
                                            padding: '24px',
                                            borderRadius: '12px',
                                            background: '#000',
                                            color: '#fff',
                                        }}
                                    >
                                        <h5 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#fff' }}>Subscribe</h5>
                                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, marginBottom: '16px' }}>
                                            Get tools & productivity insights delivered
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

                                    {/* Quick Links */}
                                    <div className="d-flex gap-3 mt-4" style={{ flexWrap: 'wrap' }}>
                                        {[
                                            { label: 'Advertise', href: '/advertise' },
                                            { label: 'Help', href: '/help' },
                                            { label: 'Terms', href: '/terms' },
                                        ].map((link, i) => (
                                            <Link
                                                key={i}
                                                href={link.href}
                                                style={{
                                                    fontSize: '12px',
                                                    fontWeight: 500,
                                                    color: '#86868b',
                                                    textDecoration: 'none',
                                                    transition: 'color 0.15s ease',
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.color = '#000'}
                                                onMouseLeave={(e) => e.currentTarget.style.color = '#86868b'}
                                            >
                                                {link.label}
                                            </Link>
                                        ))}
                                    </div>

                                    {/* Ad: Sidebar */}
                                    <div style={{ marginTop: '16px' }}>
                                        <AdBanner slot="toolshed_sidebar" page="toolshed" position="sidebar-right" size="medium-rectangle" />
                                    </div>
                                </div>
                            </div>
                        </Col>

                        {/* Main Content */}
                        <Col xs={12} md={8} lg={9}>
                            {/* Mobile Search & Filter toggle */}
                            <div className="d-md-none" style={{ marginBottom: 16 }}>
                                <button
                                    type="button"
                                    onClick={toggleSearch}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        borderRadius: '9999px',
                                        border: '1px solid #e5e5e5',
                                        background: '#fff',
                                        color: '#000',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 8,
                                        cursor: 'pointer',
                                    }}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                                        search
                                    </span>
                                    Search & Filter
                                </button>
                            </div>

                            {/* Ad: Top of Results */}
                            <div style={{ marginBottom: 24 }}>
                                <AdBanner slot="toolshed_top" page="toolshed" position="top" size="leaderboard" />
                            </div>

                            <div
                                style={{
                                    backgroundColor: '#fff',
                                    borderRadius: '16px',
                                    border: '1px solid #f0f0f0',
                                    padding: '24px',
                                }}
                            >
                                {/* Filter Labels */}
                                <div className="mb-3">
                                    <FilterLabels filter_data={filter_data} setFilterData={setFilterData}/>
                                </div>

                                {/* Compare tip */}
                                {showCompareTip && compareTools.length === 0 && (
                                    <div
                                        role="note"
                                        style={{
                                            position: 'relative',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 16,
                                            padding: '16px 20px',
                                            paddingRight: 56,
                                            borderRadius: 16,
                                            background: '#fff7ed',
                                            border: '1px solid #fed7aa',
                                            marginBottom: 16,
                                        }}
                                    >
                                        {/* Compare icon in cool gradient circular container (left) */}
                                        <div
                                            aria-hidden="true"
                                            style={{
                                                flex: '0 0 auto',
                                                width: 36,
                                                height: 36,
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                                            }}
                                        >
                                            <span
                                                className="material-symbols-outlined"
                                                style={{
                                                    fontSize: 18,
                                                    color: '#fff',
                                                    fontVariationSettings: '"FILL" 1',
                                                }}
                                            >
                                                compare_arrows
                                            </span>
                                        </div>

                                        <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: '#9a3412', marginBottom: 2 }}>
                                                Tip: Compare tools side-by-side
                                            </div>
                                            <div style={{ fontSize: 12, color: '#9a3412', lineHeight: 1.5 }}>
                                                Tap the compare icon on any {isPro ? '2–5' : '2'} tool cards, then hit <strong>Compare</strong>.{' '}
                                                {!isPro && (
                                                    <>
                                                        Free plan compares 2 at a time —{' '}
                                                        <Link href="/upgrade-plan" style={{ color: '#9a3412', fontWeight: 600, textDecoration: 'underline' }}>
                                                            upgrade
                                                        </Link>{' '}
                                                        to compare up to 5.
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Circular red close button (top-right) */}
                                        <button
                                            onClick={dismissCompareTip}
                                            aria-label="Dismiss tip"
                                            style={{
                                                position: 'absolute',
                                                top: 10,
                                                right: 10,
                                                width: 26,
                                                height: 26,
                                                borderRadius: '50%',
                                                border: 'none',
                                                background: '#ef4444',
                                                color: '#fff',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: '0 2px 6px rgba(239, 68, 68, 0.35)',
                                                transition: 'transform 0.15s ease, background 0.15s ease',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = '#dc2626';
                                                e.currentTarget.style.transform = 'scale(1.08)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = '#ef4444';
                                                e.currentTarget.style.transform = 'scale(1)';
                                            }}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: '"wght" 600' }}>close</span>
                                        </button>
                                    </div>
                                )}

                                {/* Results Section */}
                                <div
                                    ref={paginationContainerRef}
                                    style={{ minHeight: '400px' }}
                                >
                                    {isloading && isloading !== 'pagination' ? (
                                        <div className="row">
                                            <ToolshedSkeleton count={6} />
                                        </div>
                                    ) : (
                                        <Suspense fallback={
                                            <div className="row">
                                                <ToolshedSkeleton count={6} />
                                            </div>
                                        }>
                                            <DisplayToolshed
                                                data={data}
                                                showLabels={showLabels}
                                                compareIdSet={compareIdSet}
                                                onToggleCompare={toggleCompare}
                                            />
                                        </Suspense>
                                    )}

                                    {/* Pagination */}
                                    <div style={{ marginTop: '32px', paddingTop: '24px' }}>
                                        {(pagination.length > 0) && (
                                            <DefaultPagination
                                                pagination={pagination}
                                                triggerPagination={triggerPagination}
                                                isLoading={isloading === 'pagination'}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Ad: Below Results */}
                            <div style={{ marginTop: 24 }}>
                                <AdBanner slot="toolshed_bottom" page="toolshed" position="bottom" size="leaderboard" />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <ScrollToTop />
            <FixedMobileNav isAuthenticated={(props.auth.user)? true : false} toggleSearch={toggleSearch} />
            {compareTools.length > 0 && <div aria-hidden="true" style={{ height: 88 }} />}
            <CompareBar
                selected={compareTools}
                maxAllowed={compareMax}
                onRemove={removeCompare}
                onClear={clearCompare}
            />
        </GuestLayout>
    );
};

export default Toolshed;
