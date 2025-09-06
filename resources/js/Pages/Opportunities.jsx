import Container from 'react-bootstrap/Container';
import Metadata from '@/Components/Metadata';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';
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

const DisplayOpportunities = React.lazy(() => import('@/Components/DisplayOpportunities'));

const Opportunities = () => {
    const [data, setData] = useState([]); // Set Data
    const [pagination, setPagination] = useState([]);
    const [rootURL, setRootURL] = useState("search-opportunities");
    const [search_keyword, setSearchKeyword] = useState('');
    const [isloading, setIsLoading] = useState('initial'); // Set initial loading state
    const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);

    // Subscription modal state
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const [subscriptionForm, setSubscriptionForm] = useState({
        firstName: '',
        lastName: '',
        email: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Subscription modal functions
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
                // Success notification
                Swal.fire({
                    title: 'Subscribed!',
                    text: 'You\'ll receive opportunities in your inbox',
                    iconHtml: '<div style="width: 32px; height: 32px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; font-weight: bold; margin: 0;">✓</div>',
                    confirmButtonText: 'Perfect!',
                    confirmButtonColor: '#10b981',
                    buttonsStyling: false,
                    customClass: {
                        popup: 'compact-swal-popup',
                        title: 'compact-swal-title',
                        content: 'compact-swal-content',
                        confirmButton: 'compact-swal-button'
                    },
                    showClass: {
                        popup: 'animate__animated animate__zoomIn animate__faster'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__zoomOut animate__faster'
                    },
                    timer: 3000,
                    timerProgressBar: true
                });
                setShowSubscriptionModal(false);
                setSubscriptionForm({ firstName: '', lastName: '', email: '' });
            }
        } catch (error) {
            console.error('Subscription error:', error);
            
            let errorMessage = 'Something went wrong. Please try again.';
            
            // Handle validation errors
            if (error.response && error.response.status === 422) {
                const errors = error.response.data.errors;
                if (errors) {
                    // Get the first error message
                    errorMessage = error.response.data.first_error || Object.values(errors)[0][0];
                }
            } else if (error.response && error.response.status === 409) {
                // Handle duplicate email
                errorMessage = error.response.data.message || 'This email is already subscribed.';
            } else if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            }
            
            Swal.fire({
                text: errorMessage,
                iconHtml: '<div style="width: 32px; height: 32px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; font-weight: bold; margin: 0;">✕</div>',
                confirmButtonText: 'Retry',
                confirmButtonColor: '#ef4444',
                buttonsStyling: false,
                customClass: {
                    popup: 'compact-swal-popup',
                    title: 'compact-swal-title',
                    content: 'compact-swal-content',
                    confirmButton: 'compact-swal-button compact-swal-button-error'
                },
                showClass: {
                    popup: 'animate__animated animate__shakeX animate__faster'
                },
                hideClass: {
                    popup: 'animate__animated animate__zoomOut animate__faster'
                }
            });
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
                                        Opportunity Intelligence Platform
                                    </h1>
                                    <p className="text-muted mb-0">
                                        Discover funding, grants & accelerators
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
                            
                            {/* Quick Links - Desktop Only */}
                            <div className="px-4 pb-4 d-none d-lg-block">
                                <div 
                                    className="p-3 rounded-3"
                                    style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0' }}
                                >
                                    <h6 className="fw-semibold mb-3 text-dark">Quick Access</h6>
                                    <div className="d-flex flex-column gap-2">
                                        <button
                                            onClick={() => setShowSubscriptionModal(true)}
                                            className="btn btn-primary w-100 mb-3 d-flex align-items-center justify-content-center"
                                            style={{ borderRadius: '12px', fontWeight: '600', fontSize: '0.9rem' }}
                                        >
                                            <span className="material-symbols-outlined me-2" style={{ fontSize: '18px' }}>
                                                notifications
                                            </span>
                                            Subscribe to Updates
                                        </button>
                                        <Link 
                                            href="/advertise" 
                                            className="text-decoration-none text-muted small fw-medium hover-primary"
                                            style={{ transition: 'color 0.2s' }}
                                        >
                                            📢 Advertise Opportunity
                                        </Link>
                                        <Link 
                                            href="/help" 
                                            className="text-decoration-none text-muted small fw-medium hover-primary"
                                            style={{ transition: 'color 0.2s' }}
                                        >
                                            ❓ Get Help
                                        </Link>
                                        <Link 
                                            href="/terms" 
                                            className="text-decoration-none text-muted small fw-medium hover-primary"
                                            style={{ transition: 'color 0.2s' }}
                                        >
                                            📋 Terms & Conditions
                                        </Link>
                                    </div>
                                </div>
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
                                        <h2 className="h4 fw-bold text-dark mb-1">
                                        Opportunity Feed
                                        </h2>
                                        <p className="text-muted small mb-0">
                                           AI powered data aggregation feeds
                                        </p>
                                    </div>
                                    <div className="d-none d-md-flex align-items-center">
                                        <div 
                                            className="badge rounded-pill px-3 py-2"
                                            style={{ backgroundColor: '#dcfce7', color: '#166534' }}
                                        >
                                            <div className="d-flex align-items-center">
                                                <div 
                                                    className="rounded-circle me-2"
                                                    style={{ 
                                                        width: '6px', 
                                                        height: '6px', 
                                                        backgroundColor: '#22c55e',
                                                        animation: 'pulse 2s infinite' 
                                                    }}
                                                ></div>
                                                Live Updates
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Loading state or content */}
                                {isloading && isloading !== 'pagination' ? (
                                    <div className="text-center py-5">
                                        <ThreadLoader />
                                        <p className="text-muted mt-3">Analyzing global opportunities...</p>
                                    </div>
                                ) : (
                                    <Suspense fallback={
                                        <div className="text-center py-5">
                                            <ThreadLoader />
                                            <p className="text-muted mt-3">Loading intelligence data...</p>
                                        </div>
                                    }>
                                        <DisplayOpportunities data={data} />
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
            
            {/* Modern Subscription Modal */}
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
                            borderRadius: '16px',
                            padding: '1.5rem',
                            maxWidth: '380px',
                            width: '95%',
                            maxHeight: '85vh',
                            overflow: 'auto',
                            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
                            transform: 'scale(1)',
                            animation: 'modalSlideIn 0.3s ease-out',
                            position: 'relative',
                            border: '1px solid rgba(255, 255, 255, 0.18)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeSubscriptionModal}
                            style={{
                                position: 'absolute',
                                top: '0.75rem',
                                right: '0.75rem',
                                background: 'rgba(107, 114, 128, 0.1)',
                                border: 'none',
                                fontSize: '1.25rem',
                                cursor: 'pointer',
                                color: '#6b7280',
                                padding: '0.375rem',
                                borderRadius: '8px',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = 'rgba(107, 114, 128, 0.2)';
                                e.target.style.color = '#374151';
                                e.target.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'rgba(107, 114, 128, 0.1)';
                                e.target.style.color = '#6b7280';
                                e.target.style.transform = 'scale(1)';
                            }}
                        >
                            ×
                        </button>

                        {/* Header */}
                        <div className="text-center mb-3">
                            <div 
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1rem',
                                    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.25)'
                                }}
                            >
                                <span className="material-symbols-outlined text-white" style={{ fontSize: '24px' }}>
                                    notifications_active
                                </span>
                            </div>
                            <h3 className="fw-bold mb-1" style={{ color: '#1f2937', fontSize: '1.25rem' }}>
                                Stay Updated
                            </h3>
                            <p className="text-muted mb-0" style={{ fontSize: '0.875rem', lineHeight: '1.4' }}>
                                Get opportunities in your inbox
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubscriptionSubmit}>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    name="firstName"
                                    className="form-control"
                                    value={subscriptionForm.firstName}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        padding: '0.625rem 0.875rem',
                                        fontSize: '0.875rem',
                                        transition: 'all 0.2s ease',
                                        backgroundColor: '#fafbfc'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#3b82f6';
                                        e.target.style.backgroundColor = 'white';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.08)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e5e7eb';
                                        e.target.style.backgroundColor = '#fafbfc';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                    placeholder="First name"
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    name="lastName"
                                    className="form-control"
                                    value={subscriptionForm.lastName}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        padding: '0.625rem 0.875rem',
                                        fontSize: '0.875rem',
                                        transition: 'all 0.2s ease',
                                        backgroundColor: '#fafbfc'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#3b82f6';
                                        e.target.style.backgroundColor = 'white';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.08)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e5e7eb';
                                        e.target.style.backgroundColor = '#fafbfc';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                    placeholder="Last name"
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    value={subscriptionForm.email}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        padding: '0.625rem 0.875rem',
                                        fontSize: '0.875rem',
                                        transition: 'all 0.2s ease',
                                        backgroundColor: '#fafbfc'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#3b82f6';
                                        e.target.style.backgroundColor = 'white';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.08)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e5e7eb';
                                        e.target.style.backgroundColor = '#fafbfc';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                    placeholder="your@email.com"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="d-flex gap-2">
                                <button
                                    type="button"
                                    onClick={closeSubscriptionModal}
                                    className="btn"
                                    style={{
                                        backgroundColor: 'transparent',
                                        color: '#6b7280',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        padding: '0.625rem 1rem',
                                        fontWeight: '500',
                                        fontSize: '0.875rem',
                                        transition: 'all 0.2s ease',
                                        flex: '0 0 auto'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = '#f9fafb';
                                        e.target.style.borderColor = '#d1d5db';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = 'transparent';
                                        e.target.style.borderColor = '#e5e7eb';
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn flex-fill"
                                    style={{
                                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '0.625rem 1rem',
                                        fontWeight: '600',
                                        fontSize: '0.875rem',
                                        transition: 'all 0.2s ease',
                                        opacity: isSubmitting ? 0.7 : 1
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isSubmitting) {
                                            e.target.style.transform = 'translateY(-1px)';
                                            e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isSubmitting) {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = 'none';
                                        }
                                    }}
                                >
                                    {isSubmitting ? (
                                        <div className="d-flex align-items-center justify-content-center">
                                            <div 
                                                className="spinner-border spinner-border-sm me-2"
                                                style={{ width: '14px', height: '14px' }}
                                            ></div>
                                            Subscribing...
                                        </div>
                                    ) : (
                                        'Subscribe'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </GuestLayout>
    );
};

export default Opportunities;