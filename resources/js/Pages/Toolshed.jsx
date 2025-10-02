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
import { Wrench, Search, Filter, TrendingUp, Zap, Star } from 'lucide-react';
import Swal from 'sweetalert2';
import ToolshedSkeleton from '@/Components/ToolshedSkeleton';

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

    // SweetAlert2 subscription modal function
    const showSubscriptionModal = () => {
        Swal.fire({
            title: '',
            html: `
                <div style="text-align: center; padding: 20px;">
                    <h3 style="font-weight: bold; margin-bottom: 0.5rem; color: #1f2937; font-size: 1.25rem;">Subscribe</h3>
                    <p style="margin-bottom: 20px; color: #6b7280; font-size: 14px; line-height: 1.4;">
                        Get the latest tools delivered to your inbox
                    </p>
                                
                    <form id="subscription-form" style="display: flex; flex-direction: column; gap: 12px; max-width: 320px; margin: 0 auto;">
                        <input type="text" id="firstName" name="firstName" placeholder="First name" required
                               style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 0.625rem 0.875rem; font-size: 0.875rem; background: #fafbfc; transition: all 0.2s ease;"
                               onfocus="this.style.borderColor='#3b82f6'; this.style.backgroundColor='white'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.08)'"
                               onblur="this.style.borderColor='#e5e7eb'; this.style.backgroundColor='#fafbfc'; this.style.boxShadow='none'">
                        
                        <input type="text" id="lastName" name="lastName" placeholder="Last name" required
                               style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 0.625rem 0.875rem; font-size: 0.875rem; background: #fafbfc; transition: all 0.2s ease;"
                               onfocus="this.style.borderColor='#3b82f6'; this.style.backgroundColor='white'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.08)'"
                               onblur="this.style.borderColor='#e5e7eb'; this.style.backgroundColor='#fafbfc'; this.style.boxShadow='none'">
                        
                        <input type="email" id="email" name="email" placeholder="Enter your email" required
                               style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 0.625rem 0.875rem; font-size: 0.875rem; background: #fafbfc; transition: all 0.2s ease;"
                               onfocus="this.style.borderColor='#3b82f6'; this.style.backgroundColor='white'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.08)'"
                               onblur="this.style.borderColor='#e5e7eb'; this.style.backgroundColor='#fafbfc'; this.style.boxShadow='none'">
                        
                        <button type="submit" id="subscribe-btn"
                                style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; border: none; border-radius: 8px; padding: 0.75rem 1.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);"
                                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(59, 130, 246, 0.4)'"
                                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(59, 130, 246, 0.3)'">
                            Subscribe Now
                        </button>
                    </form>
                    
                    <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                        <p style="color: #6b7280; font-size: 12px; margin: 0;">
                            🔒 Your email is safe with us. No spam, unsubscribe anytime.
                        </p>
                    </div>
                </div>
            `,
            showConfirmButton: false,
            showCloseButton: true,
            width: '480px',
            padding: '0',
            background: 'white',
            customClass: {
                popup: 'subscription-modal-popup',
                closeButton: 'subscription-modal-close'
            },
            didOpen: () => {
                const form = document.getElementById('subscription-form');
                const subscribeBtn = document.getElementById('subscribe-btn');
                
                form.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    
                    // Get form data
                    const firstName = document.getElementById('firstName').value;
                    const lastName = document.getElementById('lastName').value;
                    const email = document.getElementById('email').value;
                    
                    // Disable button and 1oading
                    subscribeBtn.disabled = true;
                    subscribeBtn.innerHTML = 'Subscribing...';
                    
                    try {
                        const response = await axios.post('/subscribe', {
                            first_name: firstName,
                            last_name: lastName,
                            email: email
                        });
                        
                        if (response.data.success) {
                            Swal.fire({
                                title: 'Successfully Subscribed!',
                                text: 'You\'ll receive the latest tools and updates directly in your inbox.',
                                icon: 'success',
                                confirmButtonText: 'Great!',
                                confirmButtonColor: '#3b82f6',
                                buttonsStyling: false,
                                customClass: {
                                    popup: 'compact-swal-popup',
                                    title: 'compact-swal-title',
                                    content: 'compact-swal-content',
                                    confirmButton: 'compact-swal-button compact-swal-button-success'
                                }
                            });
                        }
                    } catch (error) {
                        console.error('Subscription error:', error);
                        
                        let errorMessage = 'An error occurred. Please try again.';
                        if (error.response?.data?.message) {
                            errorMessage = error.response.data.message;
                        }
                        
                        Swal.fire({
                            title: 'Subscription Failed',
                            text: errorMessage,
                            icon: 'error',
                            confirmButtonText: 'Try Again',
                            confirmButtonColor: '#ef4444',
                            buttonsStyling: false,
                            customClass: {
                                popup: 'compact-swal-popup',
                                title: 'compact-swal-title',
                                content: 'compact-swal-content',
                                confirmButton: 'compact-swal-button compact-swal-button-error'
                            }
                        });
                        
                        // Reset button
                        subscribeBtn.disabled = false;
                        subscribeBtn.innerHTML = 'Subscribe';
                    }
                });
            }
        });
    };

    useEffect(() => {
        console.log('Fetching products from search-products endpoint...');
        axios.get('search-products') // Fetch Products
        .then(function (response) {
            console.log('SEARCH ENDPOINT RESPONSE:', response);
            console.log('SEARCH ENDPOINT DATA:', response.data);
            console.log('SEARCH ENDPOINT DATA.DATA:', response.data?.data);
            console.log('SEARCH ENDPOINT DATA.DATA LENGTH:', response.data?.data?.length);
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
                title="Strategic Arsenal - Business Tools Intelligence | Edatsu Media"
                description="Mission-critical business tools curated by our intelligence team. Discover vetted productivity, AI, and operational tools deployed by elite entrepreneurs."
                keywords="business tools, productivity software, AI tools, marketing automation, project management, entrepreneur tools, SaaS reviews, business intelligence tools"
                canonicalUrl="https://www.edatsu.com/toolshed"
                ogTitle="Strategic Arsenal - Mission-Critical Business Tools"
                ogDescription="Intelligence-grade tools deployed by elite entrepreneurs. Each tool undergoes our proprietary vetting algorithm to ensure operational superiority."
                ogImage="/img/logo/default_logo.jpg"
                ogUrl="https://www.edatsu.com/toolshed"
                twitterTitle="Strategic Arsenal - Mission-Critical Business Tools"
                twitterDescription="Intelligence-grade tools deployed by elite entrepreneurs. Each tool undergoes our proprietary vetting algorithm to ensure operational superiority."
                twitterImage="/img/logo/default_logo.jpg"
            />
            
            {/* Hero Section */}
            <section className="py-4 toolshed-hero-section">
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
                                    <Wrench size={24} />
                                </div> */}
                                <div>
                                    <h1 className="h3 fw-bold text-dark mb-1">
                                    Productivity Tools
                                    </h1>
                                    <p className="text-muted mb-0">
                                        Mission-critical tools vetted by our intelligence algorithms
                                    </p>
                                </div>
                            </div>
                        </Col>
                        
                        <Col lg={4} md={5} sm={12}>
                            <div className="d-flex justify-content-end align-items-center gap-3 px-3">
                                <div className="d-flex align-items-center text-success">
                                    <TrendingUp size={16} className="me-1" />
                                    <small className="fw-semibold">Live Intelligence</small>
                                </div>
                                <div className="d-flex align-items-center text-primary">
                                    <Zap size={16} className="me-1" />
                                    <small className="fw-semibold">Elite Grade</small>
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
                            className={`${isMobileSearchVisible ? 'toolshed-mobile-fixed-toggle' : 'd-none d-md-block toolshed-sidebar'}`} 
                            id="searchBar"
                        >
                            <div className="p-4">
                                <div className="d-flex align-items-center mb-4">
                                    <Filter size={20} className="text-primary me-2" />
                                    <h5 className="fw-bold mb-0">Filters</h5>
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
                            
                            {/* Quick Links - Desktop Only */}
                            <div className="px-4 pb-4 d-none d-lg-block">
                                <div className="p-3 rounded-3 toolshed-quick-access-box">
                                    <h6 className="fw-semibold mb-3 text-dark">Quick Access</h6>
                                    <div className="d-flex flex-column gap-2">
                                        <Link 
                                            href="/advertise" 
                                            className="text-decoration-none text-muted small fw-medium toolshed-hover-primary"
                                        >
                                        Advertise Tool
                                        </Link>
                                        <Link 
                                            href="/help" 
                                            className="text-decoration-none text-muted small fw-medium toolshed-hover-primary"
                                        >
                                        Get Help
                                        </Link>
                                        <Link 
                                            href="/terms" 
                                            className="text-decoration-none text-muted small fw-medium toolshed-hover-primary"
                                        >
                                        Terms & Conditions
                                        </Link>
                                    </div>
                                </div>

                         <button
                            onClick={showSubscriptionModal}
                            className="btn btn-flat-primary py-3 w-100 my-3 d-flex align-items-center justify-content-center"
                            >
                            Subscribe
                            </button>
                            </div>
                        </div>
                        
                        {/* Mobile Search Toggle */}
                        <div className="d-md-none position-fixed toolshed-mobile-search-toggle">
                            <button 
                                className="btn btn-primary rounded-circle w-100 h-100"
                                onClick={toggleSearch}
                            >
                                <Search size={20} />
                            </button>
                        </div>
                    </Col>

                    {/* Main Content */}
                    <Col lg={9} md={8} sm={12}>
                        <div className="p-4 toolshed-main-content">
                            {/* Feedback Panel */}
                            {/* <div className="mb-4">
                                <FeedbackPanel />
                            </div> */}

                            {/* Filter Labels */}
                            <div className="mb-4">
                                <FilterLabels filter_data={filter_data} setFilterData={setFilterData}/>
                            </div>

                            {/* Results Section */}
                            <div 
                                className="bg-white rounded-4 shadow-sm border-0 p-4 toolshed-results-section" 
                                ref={paginationContainerRef}
                            >
                                <div className="d-flex align-items-center justify-content-between mb-4">
                                    <div>
                                        {/* empty... */}
                                    </div>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="d-none d-md-flex align-items-center">
                                            <div className="badge rounded-pill px-3 py-2 toolshed-live-badge">
                                                <div className="d-flex align-items-center">
                                                    <div className="rounded-circle me-2 toolshed-pulse-dot"></div>
                                                    Live Intelligence
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            className="btn btn-outline-secondary btn-sm d-flex align-items-center"
                                            onClick={() => setShowLabels(!showLabels)}
                                            style={{
                                                borderRadius: '8px',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '16px', lineHeight: '1', verticalAlign: 'middle' }}>
                                                {showLabels ? 'visibility_off' : 'visibility'}
                                            </span>
                                            <span className="ms-2">{showLabels ? 'Hide Labels' : 'Show Labels'}</span>
                                        </button>
                                    </div>
                                </div>
                                
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
                                <div className="mt-4 pt-4 border-top">
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
            
            <FixedMobileNav isAuthenticated={(props.auth.user)? true : false} toggleSearch={toggleSearch} />
        </GuestLayout>
    );
};

export default Toolshed;
