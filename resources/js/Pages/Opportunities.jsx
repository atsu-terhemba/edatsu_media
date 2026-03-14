import Container from 'react-bootstrap/Container';
import Metadata from '@/Components/Metadata';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import OppSearchFilter from '@/Components/OppSearchFilter';
import axios from 'axios';
import DefaultPagination from '@/Components/DefaultPagination';
import React,  { useEffect, useCallback, useMemo, useState, Suspense } from "react";
import { useRef } from 'react';
import FilterLabels from '@/Components/FilterSearchLabels';
import { useContext } from 'react';
import { AuthContext } from '@/Layouts/GuestLayout';
import FixedMobileNav from '@/Components/FixedMobileNav';

import { showOpportunitiesSubscriptionModal } from '@/Components/SubscriptionModal';
import OpportunitiesSkeleton from '@/Components/OpportunitiesSkeleton';
import AdBanner from '@/Components/AdBanner';
import AdUnit from '@/Components/AdUnit';

const DisplayOpportunities = React.lazy(() => import('@/Components/DisplayOpportunities'));

const Opportunities = () => {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState([]);
    const [rootURL, setRootURL] = useState("search-opportunities");
    const [search_keyword, setSearchKeyword] = useState('');
    const [isloading, setIsLoading] = useState('initial');
    const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const paginationContainerRef = useRef(null);
    const authUser = useContext(AuthContext);

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

    const props = usePage().props;

    useEffect(() => {
        axios.get('search-opportunities')
        .then(function (response) {
            setData(response.data?.data || []);
            setPagination(response.data?.links || []);

            if (response.data) {
                setCurrentPage(response.data.current_page || 1);
                setPerPage(response.data.per_page || 10);
                setTotalPages(response.data.last_page || 1);
            }
        })
        .catch(function (error) {
            console.error("Error fetching initial opportunities:", error);
            setData([]);
            setPagination([]);
        })
        .finally(() => {
            setIsLoading('');
        });
    }, []);

    const [isInitialMount, setIsInitialMount] = useState(true);

    useEffect(()=>{
        if (isInitialMount) {
            setIsInitialMount(false);
            return;
        }
        const hasFilters = Object.values(filter_data).some(value =>
            Array.isArray(value) ? value.length > 0 : value !== ''
        );
        if (hasFilters) {
            initSearch();
        }
    }, [filter_data])

    const initSearch = useCallback((e) => {
        e?.preventDefault();
        if (!rootURL) {
            setIsLoading('');
            return;
        }
        const loadingId = e?.target?.id || '';
        setIsLoading(loadingId);

        const isManualSearch = e && (loadingId === 'search-btn' || loadingId === 'filter-btn');

        axios.get(rootURL, {
            params: {
                ...filter_data,
                search_keyword: search_keyword
            }
        })
        .then((res) => {
            setData(res.data?.data || []);
            setPagination(res.data?.links || []);

            if (res.data) {
                setCurrentPage(res.data.current_page || 1);
                setPerPage(res.data.per_page || 10);
                setTotalPages(res.data.last_page || 1);
            }

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
            console.error("Error fetching search results:", error);
            setData([]);
            setPagination([]);
        })
        .finally(() => {
            setIsLoading('');
        });
    },[rootURL, filter_data, search_keyword, isMobileSearchVisible]);

    function triggerPagination(url) {
        const container = paginationContainerRef.current;
        const containerPosition = container ? container.getBoundingClientRect().top + window.scrollY : 0;

        setIsLoading('pagination');

        axios.get(url)
        .then((response) => {
            const { data, links, current_page, total, per_page, last_page } = response.data;

            setData(data || []);
            setPagination(links || []);
            setCurrentPage(current_page || 1);
            setPerPage(per_page || 10);
            setTotalPages(last_page || 1);

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
                title="Funding Opportunities, Grants & Accelerators for Entrepreneurs"
                description="Discover curated funding opportunities, business grants, startup accelerators, and investment programs from around the world. Find the perfect funding match for your venture with Edatsu Media."
                keywords="funding opportunities, business grants, startup accelerators, venture capital, angel investors, seed funding, small business grants, entrepreneur funding, startup funding, investment opportunities, Edatsu Media"
                canonicalUrl="https://www.edatsu.com/opportunities"
                ogTitle="Funding Opportunities & Grants for Entrepreneurs | Edatsu Media"
                ogDescription="Browse thousands of funding opportunities, grants, and accelerators curated for entrepreneurs. Launch and scale your business with the right funding."
                ogImage="/img/logo/default_logo.jpg"
                ogUrl="https://www.edatsu.com/opportunities"
                twitterTitle="Funding Opportunities & Grants for Entrepreneurs | Edatsu Media"
                twitterDescription="Browse thousands of funding opportunities, grants, and accelerators curated for entrepreneurs. Launch and scale your business with the right funding."
                twitterImage="/img/logo/default_logo.jpg"
            />

            {/* Page Header - No banner, clean minimal header */}
            <section style={{ paddingTop: '96px', paddingBottom: '48px', background: '#fff' }}>
                <Container>
                    <div className="d-flex flex-column align-items-start">
                        <div className="d-flex flex-column align-items-start mb-3">
                            <span
                                className="section-eyebrow"
                                style={{ color: '#86868b' }}
                            >
                                Explore
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
                            Opportunities
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
                            Discover funding, grants & accelerators to launch and scale your vision
                        </p>
                    </div>
                </Container>
            </section>

            {/* Main Content */}
            <section style={{ paddingBottom: '96px', background: '#f5f5f7' }}>
                <Container>
                    <Row className="g-4" style={{ paddingTop: '32px' }}>
                        {/* Sidebar */}
                        <Col xs={12} md={4} lg={3}>
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

                                    <OppSearchFilter
                                        isloading={isloading}
                                        filter_data={filter_data}
                                        searchKeyword={search_keyword}
                                        setSearchKeyword={setSearchKeyword}
                                        setFilterData={setFilterData}
                                        categories={props.categories}
                                        continents={props.continents}
                                        countries={props.countries}
                                        brands={props.brands}
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
                                            Get funding & growth insights delivered
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
                                        <AdUnit type="square" />
                                    </div>
                                </div>
                            </div>
                        </Col>

                        {/* Main Content */}
                        <Col xs={12} md={8} lg={9}>
                            {/* Ad: Top of Results */}
                            <div style={{ marginBottom: 24 }}>
                                <AdUnit type="horizontal" />
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

                                {/* Results Section */}
                                <div
                                    ref={paginationContainerRef}
                                    style={{ minHeight: '400px' }}
                                >
                                    {isloading && isloading !== 'pagination' ? (
                                        <OpportunitiesSkeleton count={8} />
                                    ) : (
                                        <Suspense fallback={<div>Loading...</div>}>
                                            <DisplayOpportunities
                                                data={data}
                                                isAuthenticated={!!authUser || !!props.auth.user}
                                            />
                                        </Suspense>
                                    )}

                                    {/* Pagination */}
                                    <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #f0f0f0' }}>
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
                                <AdUnit type="horizontal" />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <FixedMobileNav isAuthenticated={(props.auth.user)? true : false} toggleSearch={toggleSearch} />
        </GuestLayout>
    );
};

export default Opportunities;
