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
import GoogleAdsense from '@/Components/GoogleAdsense';
import { useContext } from 'react';
import { AuthContext } from '@/Layouts/GuestLayout';
import FixedMobileNav from '@/Components/FixedMobileNav';
import { User, Search, Filter, TrendingUp, Globe, Target } from 'lucide-react';
import { showOpportunitiesSubscriptionModal } from '@/Components/SubscriptionModal';
import OpportunitiesSkeleton from '@/Components/OpportunitiesSkeleton';
import AdBanner from '@/Components/AdBanner';

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
                title="Opportunities"
                description="Explore global business opportunities, grants, and finance resources with Edatsu Media. Get the latest news, events, and tools for growth."
                keywords="global business opportunities, business grants and funding, crypto investment opportunities, finance tools and resources, latest global news, blockchain business tools, international business events, cryptocurrency news and updates, decentralized finance (DeFi) tools, global funding opportunities"
                canonicalUrl="https://www.edatsu.com"
                ogTitle="Edatsu Global Hub: News, Events, Funding & Business Resources"
                ogDescription="Explore global business opportunities, grants, and finance resources with Edatsu Media. Get the latest news, events, and tools for growth."
                ogImage="/img/logo/default_logo.jpg"
                ogUrl="https://www.edatsu.com"
                twitterTitle="Edatsu Global Hub: News, Events, Funding & Business Resources"
                twitterDescription="Explore global business opportunities, grants, and finance resources with Edatsu Media. Get the latest news, events, and tools for growth."
                twitterImage="/img/logo/default_logo.jpg"
            />
            
            {/* Hero Section */}
            <section className="py-4" style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <Container fluid={true}>
                    <Row className="align-items-center">
                        <Col lg={8} md={7} sm={12}>
                            <div className="d-flex align-items-center mb-3 px-3">
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
                                    <h1 className="h3 fw-bold text-dark mb-1">
                                        Opportunities
                                    </h1>
                                    <p className="text-muted mb-0">
                                       Discover funding, grants & accelerators to launch and scale your vision
                                    </p>
                                </div>
                            </div>
                        </Col>
                        <Col lg={4} md={5} sm={12}>
                            <div className="d-flex justify-content-end align-items-center gap-3">
                                {/* <div className="d-flex align-items-center text-success">
                                    <TrendingUp size={16} className="me-1" />
                                    <small className="fw-semibold">Live Feed</small>
                                </div> */}
                                <div className="d-flex align-items-center text-primary px-3">
                                    <Globe size={16} className="me-1" />
                                    <small className="fw-semibold">Global Reach</small>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Top Leaderboard Ad */}
            <div className="container my-4">
                <AdBanner slot="opportunities_top_leaderboard" size="large-leaderboard" />
            </div>

            <Container fluid className="px-0">
                <Row className="g-0">
                    {/* Sidebar */}
                    <Col lg={3} md={4} sm={12}>
                        <div 
                            className={`${isMobileSearchVisible ? 'mobile-fixed-toggle' : 'd-none d-md-block'}`} 
                            id="searchBar"
                            style={{ 
                                backgroundColor: 'white',
                                borderRight: '1px solid #e2e8f0',
                                minHeight: isMobileSearchVisible ? 'auto' : '100vh',
                                maxHeight: isMobileSearchVisible ? '85vh' : 'none',
                                overflowY: isMobileSearchVisible ? 'auto' : 'visible',
                                position: 'sticky',
                                top: '0'
                            }}
                        >
                            <div className={`${isMobileSearchVisible ? 'p-3' : 'p-4'}`}>
                                <div className={`d-flex align-items-center ${isMobileSearchVisible ? 'mb-3' : 'mb-4'}`}>
                                    <Filter size={20} className="text-primary me-2" />
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
                                <AdBanner slot="opportunities_sidebar_ad" size="medium-rectangle" className="mb-3" />
                            </div>
                            
                            {/* Quick Links - Desktop Only */}
                            <div className="px-4 pb-4 d-none d-lg-block">
                                <div 
                                    className="p-3 rounded-3"
                                    style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0' }}
                                >
                                   <h6 className="fw-semibold mb-3 text-dark">Quick Access</h6>
                                    <div className="d-flex flex-column gap-2">
                                        <Link 
                                            href="/advertise" 
                                            className="text-decoration-none fs-8 text-muted small fw-medium hover-primary"
                                            style={{ transition: 'color 0.2s' }}
                                        >
                                        Advertise Opportunity
                                        </Link>
                                        <Link 
                                            href="/help" 
                                            className="text-decoration-none fs-8 text-muted small fw-medium hover-primary"
                                            style={{ transition: 'color 0.2s' }}
                                        >
                                        Get Help
                                        </Link>
                                        <Link 
                                            href="/terms" 
                                            className="text-decoration-none fs-8 text-muted small fw-medium hover-primary"
                                            style={{ transition: 'color 0.2s' }}
                                        >
                                        Terms & Conditions
                                        </Link>
                                    </div>
                                </div>

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
                        </div>
                    </Col>

                    {/* Main Content */}
                    <Col lg={9} md={8} sm={12}>
                        <div className="p-2 p-md-3" style={{ backgroundColor: '#fafbfc' }}>
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
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div>
                                        {/* empty... */}
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
                                </div>
                                
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
                                <AdBanner slot="opportunities_bottom_banner" size="responsive" />
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
                    {/* <Col sm={3} xs={12}> */}
                        {/* <a 
                            href="https://t.me/+66AGIA3g2dwzMjc0" 
                            target="_blank"
                            style={{ color: "#249fda" }} 
                            className="text-decoration-none text-dark"
                        >
                            <div className="my-3 d-flex align-items-center border rounded py-3">
                                <div className="px-2">
                                    <img 
                                        src='/img/defaults/telegram_icon.png'
                                        width="80"
                                        className="img-fluid rounded" 
                                        alt="Telegram banner"
                                    />
                                </div>
                                <div className='pe-2'>
                                    <p className="fs-8 m-0 p-0">
                                        Join our telegram for daily opportunities & news updates
                                    </p>
                                </div>
                            </div>
                        </a> */}

                        {/* Custom Ads */}
                        {/* <div className="border rounded px-3 py-3 my-3">
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
                        </div> */}

                        {/* <div className="my-3">
                            <GoogleAdsense/>
                        </div> */}

                        {/* <div className='my-3'>
                            <MailchimpSubscriptionForm />
                        </div> */}
                    {/* </Col> */}
            
            <FixedMobileNav isAuthenticated={(props.auth.user)? true : false} toggleSearch={toggleSearch} />

        </GuestLayout>
    );
};

export default Opportunities;