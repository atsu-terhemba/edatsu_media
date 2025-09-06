import Container from 'react-bootstrap/Container';
import Metadata from '@/Components/Metadata';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import GuestLayout from '@/Layouts/GuestLayout';
import React, {useState} from 'react';
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
    
    const props = usePage().props;

        // Update your toggle function
    const toggleSearch = () => {
    //console.log('hits');
    setIsMobileSearchVisible(!isMobileSearchVisible);
    }

    return (
        <GuestLayout>
            <Metadata
                title="Home"
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
            <HomeBanner />
            <SuccessSection />
            <TrendingToolsSection />
            <LatestOpportunitiesSection />
            <FixedMobileNav isAuthenticated={(props.auth.user)? true : false} toggleSearch={toggleSearch} />
        </GuestLayout>
    );
};

export default Home;