import Container from 'react-bootstrap/Container';
import Metadata from '@/Components/Metadata';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import GuestLayout from '@/Layouts/GuestLayout';
import React, {useState, useEffect} from 'react';
import { usePage, Link } from '@inertiajs/react';
import FixedMobileNav from '@/Components/FixedMobileNav';
import HomeBanner from '@/Components/HomeBanner';
import SuccessSection from '@/Components/SuccessSection';

import TrendingToolsSection from '@/Components/TrendingToolsSection';
import LatestOpportunitiesSection from '@/Components/LatestOpportunitiesSection';


const DisplayOpportunities = React.lazy(() => import('@/Components/DisplayOpportunities'));
const Home = () => {
    const [data, setData] = useState([]); // Set Data
    const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);
    const [trendingTools, setTrendingTools] = useState([]);
    const [latestOpportunities, setLatestOpportunities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const props = usePage().props;

    // Fetch data from backend when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                
                // Fetch trending tools from existing search-products endpoint
                const toolsResponse = await fetch('/search-products');
                const toolsResult = await toolsResponse.json();
                // Extract the first 6 tools from the response data
                const toolsData = toolsResult?.data?.slice(0, 6) || [];
                setTrendingTools(toolsData);
                
                // Fetch latest opportunities
                const oppsResponse = await fetch('/api/latest-opportunities');
                const oppsData = await oppsResponse.json();
                setLatestOpportunities(oppsData);
                
            } catch (error) {
                console.error('Error fetching homepage data:', error);
                // Fallback to empty arrays if API fails
                setTrendingTools([]);
                setLatestOpportunities([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

        // Update your toggle function
    const toggleSearch = () => {
    //console.log('hits');
    setIsMobileSearchVisible(!isMobileSearchVisible);
    }

    return (
        <GuestLayout>
            <Metadata
                title="Edatsu Media - Discover Funding Opportunities, Grants & Business Tools"
                description="Edatsu Media helps entrepreneurs discover funding opportunities, grants, accelerators, and essential business tools to launch and scale their ventures globally. Find your perfect funding match today."
                keywords="funding opportunities, business grants, startup accelerators, entrepreneur tools, business growth resources, venture capital, small business funding, startup resources, Edatsu Media"
                canonicalUrl="https://www.edatsu.com"
                ogTitle="Edatsu Media - Funding Opportunities & Business Tools for Entrepreneurs"
                ogDescription="Discover funding opportunities, grants, accelerators, and essential business tools. Join thousands of entrepreneurs growing their ventures with Edatsu Media."
                ogImage="/img/logo/default_logo.jpg"
                ogUrl="https://www.edatsu.com"
                twitterTitle="Edatsu Media - Funding Opportunities & Business Tools for Entrepreneurs"
                twitterDescription="Discover funding opportunities, grants, accelerators, and essential business tools. Join thousands of entrepreneurs growing their ventures with Edatsu Media."
                twitterImage="/img/logo/default_logo.jpg"
            />
            <HomeBanner />

            <SuccessSection />
            
            {/**
             * 
            <TrendingToolsSection tools={trendingTools} isLoading={isLoading} />
            <LatestOpportunitiesSection opportunities={latestOpportunities} isLoading={isLoading} />
            */}
            
            <FixedMobileNav isAuthenticated={(props.auth.user)? true : false} toggleSearch={toggleSearch} />
        </GuestLayout>
    );
};

export default Home;