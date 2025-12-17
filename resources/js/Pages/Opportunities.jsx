import Container from 'react-bootstrap/Container';
import Metadata from '@/Components/Metadata';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, usePage } from '@inertiajs/react';
// import MailchimpSubscriptionForm from '@/Components/MailchimpSubscriptionForm';
import OppSearchFilter from '@/Components/OppSearchFilter';
import axios from 'axios';
// import DisplayOpportunities from '@/Components/DisplayOpportunities';
import DefaultPagination from '@/Components/DefaultPagination';
import React,  { useEffect, useCallback, useMemo, useState, Suspense } from "react";
import ThreadLoader from '@/Components/TheadLoader';
import { useRef } from 'react';
import FilterLabels from '@/Components/FilterSearchLabels';
import FeedbackPanel from '@/Components/FeedbackInfo';
// import GoogleAdsense from '@/Components/GoogleAdsense';
import { useContext } from 'react';
import { AuthContext } from '@/Layouts/GuestLayout';
import FixedMobileNav from '@/Components/FixedMobileNav';

import { showOpportunitiesSubscriptionModal } from '@/Components/SubscriptionModal';
import OpportunitiesSkeleton from '@/Components/OpportunitiesSkeleton';
// import AdBanner from '@/Components/AdBanner';

const DisplayOpportunities = React.lazy(() => import('@/Components/DisplayOpportunities'));

const Opportunities = () => {
    const [data, setData] = useState([]); // Set Data
    const [pagination, setPagination] = useState([]);
    const [rootURL, setRootURL] = useState("search-opportunities");
    const [search_keyword, setSearchKeyword] = useState('');
    const [isloading, setIsLoading] = useState('initial'); // Set initial loading state
    const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);

    // Remove old subscription modal state - now using SweetAlert2

    // Add missing pagination state variables
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
        axios.get('search-opportunities') // Fetch Opportunities
        .then(function (response) {
            setData(response.data?.data || []);
            setPagination(response.data?.links || []);
            
            // Set pagination info if available
            if (response.data) {
                setCurrentPage(response.data.current_page || 1);
                setPerPage(response.data.per_page || 10);
                setTotalPages(response.data.last_page || 1);
            }
        })
        .catch(function (error) {
            console.error("Error fetching initial opportunities:", error);
            // Set empty states on error
            setData([]);
            setPagination([]);
        })
        .finally(() => {
            setIsLoading(''); // Clear loading state after initial fetch
        });
    }, []);

    // Track if this is the initial mount
    const [isInitialMount, setIsInitialMount] = useState(true);

    useEffect(()=>{
        // Skip initSearch on initial mount to prevent double loading
        if (isInitialMount) {
            setIsInitialMount(false);
            return;
        }
        // Only run if we actually have filter changes
        const hasFilters = Object.values(filter_data).some(value => 
            Array.isArray(value) ? value.length > 0 : value !== ''
        );
        if (hasFilters) {
            initSearch();
        }
    }, [filter_data])

    const initSearch = useCallback((e) => {
        e?.preventDefault(); // Only prevent default if `e` exists
        if (!rootURL) {
            setIsLoading('');
            return;
        }
        const loadingId = e?.target?.id || ''; // Prevent errors if `e` is undefined
        setIsLoading(loadingId);
        
        // Check if this is a manual search button click (not automatic filter change)
        const isManualSearch = e && (loadingId === 'search-btn' || loadingId === 'filter-btn');
        
        axios.get(rootURL, { 
            params: {
                ...filter_data, // Include all filters
                search_keyword: search_keyword // Add the search keyword separately
            } 
        })
        .then((res) => {
            setData(res.data?.data || []);
            setPagination(res.data?.links || []);
            
            // Update pagination info
            if (res.data) {
                setCurrentPage(res.data.current_page || 1);
                setPerPage(res.data.per_page || 10);
                setTotalPages(res.data.last_page || 1);
            }

            // Auto-scroll to top on mobile only when search button is manually clicked
            if (window.innerWidth <= 768 && isMobileSearchVisible && isManualSearch) {
                setTimeout(() => {
                    window.scrollTo({ 
                        top: 0, 
                        behavior: 'smooth' 
                    });
                    // Close mobile search after manual search
                    setIsMobileSearchVisible(false);
                }, 300);
            }
        })
        .catch((error) => {
            console.error("Error fetching search results:", error);
            // Set empty states on error
            setData([]);
            setPagination([]);
        })
        .finally(() => {
            setIsLoading('');
        });
    },[rootURL, filter_data, search_keyword, isMobileSearchVisible]); // Removed setIsLoading, setData, setPagination from dependencies as they're not needed
    
    // Fixed triggerPagination function
    function triggerPagination(url) {
        // Store the current position of the pagination container
        const container = paginationContainerRef.current;
        const containerPosition = container ? container.getBoundingClientRect().top + window.scrollY : 0;
        
        setIsLoading('pagination');
        
        axios.get(url)
        .then((response) => {
            const { data, links, current_page, total, per_page, last_page } = response.data;
            
            // Update all states
            setData(data || []);
            setPagination(links || []);
            setCurrentPage(current_page || 1); 
            setPerPage(per_page || 10);
            setTotalPages(last_page || 1);
            
            // Smooth scroll to pagination container after a short delay
            setTimeout(() => {
                if (container) {
                    window.scrollTo({
                        top: containerPosition - 100, // Add some offset for better UX
                        behavior: 'smooth' // Use smooth instead of instant
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

    /**
     * simple state update top to bottom approacth 
     * we'll test with redux to see if state is passed better. 
     */

    // Update your toggle function
    const toggleSearch = () => {
    //console.log('hits');
    setIsMobileSearchVisible(!isMobileSearchVisible);
    }

    // Subscription modal moved to reusable component
    

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
            
            {/* Hero Section */}
            <section className="py-3 py-md-4" style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <Container>
                    <Row className="align-items-center">
                        <Col xs={12} md={7} lg={8}>
                            <div className="d-flex align-items-center mb-2 mb-md-3">
                                {/* <div 
                                    className="rounded-circle d-inline-flex align-items-center justify-content-center me-3"
                                    style={{ 
                                        width: '50px', 
                                        height: '50px', 
                                        backgroundColor: '#3b82f6', 
                                        color: 'white' 
                                    }}
                                >
                                    <Target size={24} />
                                </div> */}
                                <div>
                                    <h1 className="h4 h3-md text-dark mb-1 fw-bold">
                                        Opportunities
                                    </h1>
                                    <p className="text-secondary mb-0 small small-md">
                                       Discover funding, grants & accelerators to launch and scale your vision
                                    </p>
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} md={5} lg={4} className="d-none d-md-block">
                            <div className="d-flex justify-content-end align-items-center gap-3">
                                {/* <div className="d-flex align-items-center text-success">
                                    <TrendingUp size={16} className="me-1" />
                                    <small className="fw-semibold">Live Feed</small>
                                </div> */}
                                {/* <div className="d-flex align-items-center text-primary px-3">
                                    <Globe size={16} className="me-1" />
                                    <small className="fw-semibold">Global Reach</small>
                                </div> */}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Top Leaderboard Ad */}
            {/* <div className="container my-4">
                <AdBanner slot="opportunities_top_leaderboard" size="large-leaderboard" />
            </div> */}


            <Container className="py-3 py-md-4">
                <Row className="g-0 g-md-3">
                    {/* Sidebar */}
                    <Col xs={12} md={4} lg={3}>
                        <div 
                            className={`${isMobileSearchVisible ? 'mobile-fixed-toggle' : 'd-none d-md-block'}`} 
                            id="searchBar"
                            style={{ 
                                backgroundColor: 'white',
                                borderRight: '1px solid #e2e8f0',
                                minHeight: isMobileSearchVisible ? 'auto' : 'calc(100vh - 150px)',
                                maxHeight: isMobileSearchVisible ? '85vh' : 'none',
                                overflowY: isMobileSearchVisible ? 'auto' : 'visible',
                                position: 'sticky',
                                top: '20px',
                                borderRadius: '12px'
                            }}
                        >
                            <div className={`${isMobileSearchVisible ? 'px-3 py-3' : 'px-3 py-3'}`}>
                                <div className={`d-flex align-items-center ${isMobileSearchVisible ? 'mb-3' : 'mb-4'}`}>
                                    <span className="material-symbols-outlined text-primary me-2" style={{fontSize: '20px'}}>filter_list</span>
                                    <h5 className="fw-bold mb-0">Filters</h5>
                                    {isMobileSearchVisible && (
                                        <button 
                                            className="btn btn-sm btn-outline-secondary ms-auto"
                                            onClick={toggleSearch}
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
                            
                            {/* Sidebar Ad - Desktop Only */}
                            <div className="px-4 pb-4 d-none d-lg-block">
                                {/* <AdBanner slot="opportunities_sidebar_ad" size="medium-rectangle" className="mb-3" /> */}
                            </div>
                            
                            {/* Quick Links - Desktop Only */}
                            <div className="px-4 pb-4 d-none d-lg-block">
                            
                        
                        <div className='subscribe-box'>
                         <h5 className="fw-bold mb-1">Subscribe</h5>
                         <p className='fs-8 text-muted'>
                         Subscribe to get funding & growth insights
                         </p>
                         <button
                            onClick={showOpportunitiesSubscriptionModal}
                            className="btn py-3 btn-primary w-100 my-3 d-flex align-items-center justify-content-center"
                            style={{ borderRadius: '12px', fontWeight: '600', fontSize: '0.9rem' }}
                            >
                            {/* <span className="material-symbols-outlined me-2" style={{ fontSize: '18px' }}>
                                notifications
                            </span> */}
                            Subscribe
                            </button>
                        </div>

                                <div className="">
                                        <Link 
                                            href="/advertise" 
                                            className="text-decoration-none fs-8 me-2 small fw-medium hover-primary"
                                            style={{ transition: 'color 0.2s' }}
                                        >
                                        Advertise
                                        </Link>
                                        <Link 
                                            href="/help" 
                                            className="text-decoration-none fs-8 me-2 small fw-medium hover-primary"
                                            style={{ transition: 'color 0.2s' }}
                                        >
                                       Help
                                        </Link>
                                        <Link 
                                            href="/terms" 
                                            className="text-decoration-none fs-8 small fw-medium hover-primary"
                                            style={{ transition: 'color 0.2s' }}
                                        >
                                        Terms
                                        </Link>
                                    </div>

                            </div>
                        </div>
                    </Col>

                    {/* Main Content */}
                    <Col xs={12} md={8} lg={9}>


            {/* Main Content Ad Banner - moved inside main content thread */}

            {/* e_media_display_horizontal_ad_1 */}
            <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                border: '1.5px solid #e2e8f0',
                borderRadius: '12px',
                background: '#f8fafc',
                boxShadow: '0 2px 8px rgba(44,62,80,0.04)',
                position: 'relative',
                minHeight: 90,
                padding: '18px 0',
                marginBottom: 24
            }}>
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7365396698208751" crossOrigin="anonymous"></script>
                <ins className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client="ca-pub-7365396698208751"
                    data-ad-slot="7889919728"
                    data-ad-format="auto"
                    data-full-width-responsive="true"></ins>
                <script>{`(adsbygoogle = window.adsbygoogle || []).push({});`}</script>
            </div>


                        <div className="p-0 p-md-3" style={{ backgroundColor: '#fafbfc', borderRadius: '12px' }}>

                            {/* Feedback Panel */}
                            {/* <div className="mb-4">
                                <FeedbackPanel />
                            </div> */}

                            {/* Filter Labels */}
                            <div className="mb-2 mb-md-3">
                                <FilterLabels filter_data={filter_data} setFilterData={setFilterData}/>
                            </div>

                            {/* Results Section */}
                            <div 
                                className="bg-white rounded-4 shadow-sm border-0 p-2 p-md-3" 
                                ref={paginationContainerRef}
                                style={{ minHeight: '400px' }}
                            >
                                {/* Loading state or content */}
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
                                <div className="mt-4 pt-4">
                                    {(pagination.length > 0) && (
                                        <DefaultPagination 
                                            pagination={pagination} 
                                            triggerPagination={triggerPagination}
                                            isLoading={isloading === 'pagination'}
                                        />
                                    )}
                                </div>
                            </div>
                            {/* Bottom Ad */}
                            <div className="my-4">
                                {/* <AdBanner slot="opportunities_bottom_banner" size="responsive" /> */}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>            
            <FixedMobileNav isAuthenticated={(props.auth.user)? true : false} toggleSearch={toggleSearch} />
        </GuestLayout>
    );
};

export default Opportunities;