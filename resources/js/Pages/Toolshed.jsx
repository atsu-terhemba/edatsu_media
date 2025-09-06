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

const DisplayToolshed = React.lazy(() => import('@/Components/Toolshed'));

const Toolshed = () => {
    const paginationContainerRef = useRef(null);
    const [data, setData] = useState([]); // Set Data
    const [pagination, setPagination] = useState([]);
    const [rootURL, setRootURL] = useState("search-products");
    const [search_keyword, setSearchKeyword] = useState('');
    const [isloading, setIsLoading] = useState('');
    const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);

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
            console.log('SEARCH ENDPOINT', response.data);
            setData(response.data?.data || []);
            setPagination(response.data?.links || []);
        })
        .catch(function (error) {
            console.error("Error fetching initial products:", error);
            setData([]);
            setPagination([]);
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
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                
                .hover-primary:hover {
                    color: #3b82f6 !important;
                }
                
                .mobile-fixed-toggle {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: white;
                    z-index: 1050;
                    overflow-y: auto;
                    padding: 1rem;
                }
                
                @media (max-width: 768px) {
                    .mobile-fixed-toggle {
                        padding-top: 4rem;
                    }
                }
                
                .tool-card {
                    transition: all 0.3s ease;
                    border: 1px solid #e2e8f0;
                }
                
                .tool-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 35px rgba(0,0,0,0.15);
                }
                
                .filter-chip {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    transition: all 0.3s ease;
                }
                
                .filter-chip:hover {
                    transform: scale(1.05);
                }
                
                .share-btn:hover {
                    background-color: #3b82f6 !important;
                    border-color: #3b82f6 !important;
                    color: white !important;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                }
                
                .bookmark-btn:hover {
                    background-color: #f59e0b !important;
                    border-color: #f59e0b !important;
                    color: white !important;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
                }
                
                .bookmark-btn:hover svg {
                    fill: white !important;
                }
                
                .share-modal {
                    animation-duration: 0.4s;
                }
                
                .tool-title-link:hover h5 {
                    color: #3b82f6 !important;
                    transform: translateY(-1px);
                }
                
                .tool-title-link {
                    transition: all 0.3s ease;
                }
            `}</style>
            
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
                            className={`${isMobileSearchVisible ? 'mobile-fixed-toggle' : 'd-none d-md-block'}`} 
                            id="searchBar"
                            style={{ 
                                backgroundColor: 'white',
                                borderRight: '1px solid #e2e8f0',
                                minHeight: '100vh',
                                position: 'sticky',
                                top: '0'
                            }}
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
                                        <Link 
                                            href="/advertise" 
                                            className="text-decoration-none text-muted small fw-medium hover-primary"
                                            style={{ transition: 'color 0.2s' }}
                                        >
                                            📢 Advertise Tool
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
                        
                        {/* Mobile Search Toggle */}
                        <div className="d-md-none position-fixed" style={{ top: '20px', right: '20px', zIndex: 1100 }}>
                            <button 
                                className="btn btn-primary rounded-circle"
                                onClick={toggleSearch}
                                style={{ width: '50px', height: '50px' }}
                            >
                                <Search size={20} />
                            </button>
                        </div>
                    </Col>

                    {/* Main Content */}
                    <Col lg={9} md={8} sm={12}>
                        <div className="p-4" style={{ backgroundColor: '#fafbfc' }}>
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
                                className="bg-white rounded-4 shadow-sm border-0 p-4" 
                                ref={paginationContainerRef}
                                style={{ minHeight: '400px' }}
                            >
                                <div className="d-flex align-items-center justify-content-between mb-4">
                                    <div>
                                        <h2 className="h4 fw-bold text-dark mb-1">
                                            Strategic Arsenal
                                        </h2>
                                        <p className="text-muted small mb-0">
                                            Mission-critical tools curated by intelligence algorithms
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
                                                Live Intelligence
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Loading state or content */}
                                {isloading && isloading !== 'pagination' ? (
                                    <div className="text-center py-5">
                                        <ThreadLoader />
                                        <p className="text-muted mt-3">Analyzing tool intelligence...</p>
                                    </div>
                                ) : (
                                    <Suspense fallback={
                                        <div className="text-center py-5">
                                            <ThreadLoader />
                                            <p className="text-muted mt-3">Loading strategic arsenal...</p>
                                        </div>
                                    }>
                                        <DisplayToolshed data={data} />
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
