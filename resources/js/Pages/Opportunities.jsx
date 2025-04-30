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

const DisplayOpportunities = React.lazy(() => import('@/Components/DisplayOpportunities'));

const Opportunities = () => {
    const [data, setData] = useState([]); // Set Data
    const [pagination, setPagination] = useState([]);
    const [rootURL, setRootURL] = useState("search-opportunities");
    const [search_keyword, setSearchKeyword] = useState('');
    const [isloading, setIsLoading] = useState('');
    const paginationContainerRef = useRef(null);
    const authUser = useContext(AuthContext);

    useEffect(()=>{
        console.log(`OPP USER ${authUser}`);
    },[])
    
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
            setData(response.data?.data);
            setPagination(response.data?.links);
        })
        .catch(function (error) {
            // handle error
        });
    }
    , []);

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
                setData(res.data.data);
                setPagination(res.data.links);
            })
            .catch((error) => {
                //console.error("Error fetching jobs:", error);
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
        setIsLoading(true);
        axios.get(url)
        .then((response) => {
            const  {data, links, current_page, total, per_page, last_page} = response.data;
            setData(data); 
            setPagination(links);
            setCurrentPage(current_page); 
            setPerPage(per_page);
            setTimeout(() => {
                window.scrollTo({
                    top: containerPosition,
                    behavior: 'instant'
                });
            }, 100);
        })
        .catch((error) => {
            // Handle error
        })
        .finally(() => {
            setIsLoading(false);
        });
    }
    

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
        <Container fluid={true} className="container-sm">
            <Row>
                <Col sm={3} xs={12}>
                    <div className='mt-3'>
                        <OppSearchFilter
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

                    <div className='px-3 my-3 py-3 fs-8 border rounded d-none d-sm-block d-md-block d-lg-block'>
                        <ul className='m-0 p-0'>
                            <li className='d-inline-block me-3'><Link href="/advertise">Adevertise</Link></li>
                            <li className='d-inline-block me-3'><Link href="/help">Help</Link></li>
                            <li className='d-inline-block'><Link href="/terms">Terms</Link></li>
                        </ul>
                    </div>
                </Col>
                <Col sm={6} xs={12}>
                    <div className='my-3'>
                    <FeedbackPanel />
                    </div>

                    <div className='mb-3'>
                    <FilterLabels filter_data={filter_data} setFilterData={setFilterData}/>
                    </div>

                    <div className='my-3'>
                        <h3 className="m-0 p-0 dm-serif-display-regular mb-1 mt-3" style={{ fontSize: '1.5em' }}>
                        Opportunities
                        </h3>
                        <p className="m-0 p-0 text-secondary mb-3 fs-9">
                        No. 1 Destination for Startups, Business Growth, Funding, Grants, International Markets and Investment Opportunities
                        </p>
                        <Suspense fallback={<ThreadLoader />}>
                            <DisplayOpportunities data={data} />
                            <div className="my-3">
                            {(pagination.length > 0) &&
                            <DefaultPagination 
                                pagination={pagination} 
                                triggerPagination={triggerPagination}
                            />
                            }
                            </div>
                        </Suspense>
                    </div>
                </Col>
                <Col sm={3} xs={12}>
                <a 
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
                </a>

                 {/* Custom Ads */}
                <div className="border rounded px-3 py-3 my-3">
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
                </div>

               <div className="my-3">
                <GoogleAdsense/>
               </div>

                {/* <div className='my-3'>
                    <MailchimpSubscriptionForm />
                </div> */}
                </Col>
            </Row>
        </Container>
    </GuestLayout>
    );
};

export default Opportunities;
