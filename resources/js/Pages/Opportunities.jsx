import React, { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Metadata from '@/Components/Metadata';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import MailchimpSubscriptionForm from '@/Components/MailchimpSubscriptionForm';


const Opportunities = () => {
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
                <Col sm={8} xs={12}>
                    <div className='my-3'>
                        <h3 className="m-0 p-0 dm-serif-display-regular mb-1 mt-3" style={{ fontSize: '1.5em' }}>
                        Opportunities
                        </h3>
                        <p className="m-0 p-0 text-secondary mb-3 fs-9">
                        No. 1 Destination for Startups, Business Growth, Funding, Grants, International Markets and Investment Opportunities
                        </p>
                        <span id="search-result"></span>
                        <span id="filter-entries"></span>
                        <div id="opportunity-feeds"></div>
                        <div id="pagination" className="pagination_holder"></div>
                    </div>
                </Col>
                <Col sm={4} xs={12} className="col-sm-4 col-12">
                <a 
                    href="https://t.me/+66AGIA3g2dwzMjc0" 
                    target="_blank"
                    style={{ color: "#249fda" }} 
                    className="text-decoration-none text-dark"
                >
                <div className="my-3 d-flex align-items-center border rounded content-meta-data py-3">
                    <div className="px-2">
                        <img 
                            src='/img/defaults/telegram_icon.png'
                            width="100"
                            className="img-fluid rounded" 
                            alt="Telegram banner"
                        />
                    </div>
                    <div>
                        <span className="fs-9">
                            Join our telegram for daily opportunities straight to your inbox
                        </span>
                    </div>
                </div>
                </a>

                 {/* Custom Ads */}
                <div className="border rounded px-3 py-3 my-3">
                    <div>
                        <a target="_blank" 
                        className='text-decoration-none'
                        href="https://www.hostinger.com/cart?product=hosting%3Acloud_professional&period=12&referral_type=cart_link&REFERRALCODE=1ATSUDOMINI21&referral_id=0194e7a3-6593-739b-9f80-916a5e15e60c">
                        <h5 className="poppins-semibold m-0 p-0 mb-2 text-dark shadow-sm">
                            Build a Powerful Business Website with Hostinger Cloud Professional
                            <span className="text-primary">$16.99/mo</span>
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

                {/* Podcast */}
                {/* <div className="my-3 d-flex align-items-center border rounded content-meta-data py-3">
                    <div className="px-3">
                        <img 
                            src='/img/main/podcast.jpg'
                            width="400"
                            className="img-fluid rounded" 
                            alt="Telegram banner"
                        />
                    </div>
                    <div>
                        <span className="fs-9">
                            Join our <Link
                                href={route('podcast')}
                                target="_blank" 
                                className="poppins-semibold text-primary"
                            >
                                Podcast
                            </Link> for the latest insights on technology, business, and finance.
                        </span>
                    </div>
                </div> */}
                <div className='my-3'>
                    <MailchimpSubscriptionForm />
                </div>
                </Col>
            </Row>
        </Container>
    </GuestLayout>
    );
};

export default Opportunities;
