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
import ThreadLoader from '@/Components/TheadLoader';
import { useRef } from 'react';
import FilterLabels from '@/Components/FilterSearchLabels';
import FeedbackPanel from '@/Components/FeedbackInfo';
import { useContext } from 'react';
import { AuthContext } from '@/Layouts/GuestLayout';
import FixedMobileNav from '@/Components/FixedMobileNav';

import { showToolsSubscriptionModal } from '@/Components/SubscriptionModal';
import ToolshedSkeleton from '@/Components/ToolshedSkeleton';
// import AdBanner from '@/Components/AdBanner';

const DisplayToolshed = React.lazy(() => import('@/Components/Toolshed'));

const Toolshed = () => {
    const paginationContainerRef = useRef(null);
    const [data, setData] = useState([]); // Set Data
    const [pagination, setPagination] = useState([]);
    const [rootURL, setRootURL] = useState("search-products");
    const [search_keyword, setSearchKeyword] = useState('');
    const [isloading, setIsLoading] = useState('initial'); // Set to 'initial' to show skeleton on mount
    const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);
    const [showLabels, setShowLabels] = useState(false);

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
        axios.get('search-products') // Fetch Products
        .then(function (response) {
            setData(response.data?.data || []);
            setPagination(response.data?.links || []);
        })
        .catch(function (error) {
            console.error("Error fetching initial products:", error);
            console.error("Error details:", error.response);
            setData([]);
            setPagination([]);
        })
        .finally(() => {
            setIsLoading(''); // Clear loading state after fetch completes
        });
    }, []);

    useEffect(()=>{
        initSearch();
    }, [filter_data])

    const initSearch = useCallback((e) => {
        e?.preventDefault(); // Only prevent default if `e` exists
        if (!rootURL) {
            setIsLoading('');
            return;
        }
        const loadingId = e?.target?.id || ''; // Prevent errors if `e` is undefined
        setIsLoading(loadingId);
        axios.get(rootURL, { params: {
            ...filter_data, // Include all filters
            search_keyword: search_keyword // Add the search keyword separately
            } })
            .then((res) => {
                setData(res.data.data || []);
                setPagination(res.data.links || []);
            })
            .catch((error) => {
                console.error("Error fetching tools:", error);
            })
            .finally(() => {
                setIsLoading('');
            });
    },[rootURL, filter_data, search_keyword, setIsLoading, setData, setPagination]); // Ensure dependencies are correct

    // Then in your triggerPagination function:
    function triggerPagination(url) {
        // Store the current position of the pagination container
        const container = paginationContainerRef.current;
        const containerPosition = container ? container.getBoundingClientRect().top + window.scrollY : 0;
        setIsLoading('pagination');
        axios.get(url)
        .then((response) => {
            setData(response.data.data || []);
            setPagination(response.data.links || []);
            // Scroll to the container's previous position
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
                                    <Wrench size={24} />
                                </div> */}
                                <div>
                                    <h1 className="h4 h3-md text-dark mb-1 fw-bold">
                                    Toolshed
                                    </h1>
                                    <p className="text-secondary mb-0 small small-md">
                                        Discover the best tools to build, market & scale your business
                                    </p>
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} md={5} lg={4} className="d-none d-md-block">
                            <div className="d-flex justify-content-end align-items-center gap-3">
                                {/* <div className="d-flex align-items-center text-success">
                                    <TrendingUp size={16} className="me-1" />
                                    <small className="fw-semibold">Live Intelligence</small>
                                </div>
                                <div className="d-flex align-items-center text-primary px-3">
                                    <Zap size={16} className="me-1" />
                                    <small className="fw-semibold">Elite Grade</small>
                                </div> */}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Top Leaderboard Ad */}
            {/* <div className="container my-4">
                <AdBanner slot="toolshed_top_leaderboard" size="large-leaderboard" />
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
                                
                                <ToolshedFilter
                                    isloading={isloading}
                                    filter_data={filter_data}
                                    search_keyword={search_keyword}
                                    setSearchKeyword={setSearchKeyword}
                                    setFilterData={setFilterData}
                                    categories={props.categories}
                                    // continents={props.continents}
                                    // countries={props.countries}
                                    brands={props.brands}
                                    tags={props.tags}
                                    initSearch={initSearch}
                                />
                            </div>
                            
                            {/* Sidebar Ad - Desktop Only */}
                            <div className="px-4 pb-4 d-none d-lg-block">
                                {/* <AdBanner slot="toolshed_sidebar_ad" size="medium-rectangle" className="mb-3" /> */}
                            </div>
                            
                            {/* Quick Links - Desktop Only */}
                            <div className="px-4 pb-4 d-none d-lg-block">
                            
                        
                        <div className='subscribe-box'>
                         <h5 className="fw-bold mb-1">Subscribe</h5>
                         <p className='fs-8 text-muted'>
                         Subscribe to get tools & productivity insights
                         </p>
                         <button
                            onClick={showToolsSubscriptionModal}
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
                        <div className="p-0 p-md-3" style={{ backgroundColor: '#fafbfc', borderRadius: '12px' }}>
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
                                {/* <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div>
                                    </div>
                                    <div className="d-none d-md-flex align-items-center">
                                        <div 
                                            className="badge rounded-pill px-3 py-2"
                                            style={{ backgroundColor: '#dcfce7', color: '#166534' }}
                                        >
                                            <div className="d-flex align-items-center">
                                                <div 
                                                    className="rounded-circle me-2 live-updates-pulse"
                                                    style={{ 
                                                        width: '6px', 
                                                        height: '6px', 
                                                        backgroundColor: '#22c55e'
                                                    }}
                                                ></div>
                                                Live Updates
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                
                                {/* Loading state or content */}
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
                                        <DisplayToolshed data={data} showLabels={showLabels} />
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
                                {/* <AdBanner slot="toolshed_bottom_banner" size="responsive" /> */}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
            
            <FixedMobileNav isAuthenticated={(props.auth.user)? true : false} toggleSearch={toggleSearch} />
        </GuestLayout>
    );
};

export default Toolshed;
