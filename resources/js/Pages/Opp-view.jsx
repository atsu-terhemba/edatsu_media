import { useEffect, useState } from "react";
import Metadata from '@/Components/Metadata';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import Container from 'react-bootstrap/Container';
import { getDaysLeft, toggleShare, bookmark, pageLink, renderLabels, dateStringFormat} from "@/utils/Index";
import StarRating from "@/Components/Rating";
import { router } from '@inertiajs/react'
import RecommendedContent from "@/Components/RecommendedContent";
import CommentComponent from "@/Components/CommentComponent";
import GoogleAdsense from '@/Components/GoogleAdsense';

const ReadOpportunity = ({opp_posts, similarPosts, total_comments}) => {

    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const [fullURL, setFullUrl] = useState();
    const {props} = usePage();

    useEffect(()=>{
        console.log(props);
        const fullURL = window.location.href;
        setFullUrl(fullURL);
        // console.log(opp_posts);
    },[])

    return(
        <>
<GuestLayout>
<Metadata
    title={opp_posts?.title}
    description={opp_posts?.meta_description}
    keywords={opp_posts?.meta_keywords}
    canonicalUrl={fullURL}
    ogTitle={opp_posts?.title}
    ogDescription={opp_posts?.meta_description}
    ogImage={`/storage/public/uploads/opp/${opp_posts.cover_img}`}
    ogUrl={fullURL}
    twitterTitle={opp_posts?.title}
    twitterDescription={opp_posts?.meta_description}
    twitterImage={`/storage/public/uploads/opp/${opp_posts.cover_img}`}
/>

<Container fluid={true} className="container-fluid container-sm">
        <Row>
            <Col sm={8}>
                <div className="mb-3">
                    <ins
                    className="adsbygoogle"
                    style={{ display: "block" }}
                    data-ad-client="ca-pub-7365396698208751"
                    data-ad-slot="7889919728"
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                    ></ins>
                </div>

                {/* <div className="row mt-3">
                    <div className="col-sm-3">
                        <div className="">
                            <button className="px-0 text-dark btn text-decoration-none w-100 border rounded fs-9" onClick={() => window.history.back()}>
                                <span className="material-symbols-outlined pe-3 align-middle">arrow_back</span>
                                Go Back
                            </button>
                        </div>
                    </div>
                </div> */}

                <div className="py-3 blog-detail rounded mb-3">
                    <h1 className="p-0 m-0 mb-3 poppins-bold">{opp_posts.title}</h1>
                    <p className="m-0 mb-3 text-sm fs-8">
                        Posted on: {new Date(opp_posts.created_at).toLocaleDateString()}
                    </p>

                    {opp_posts.cover_img && (
                   <img
                    src={`/storage/public/uploads/opp/${opp_posts.cover_img}`}
                    className="img-fluid rounded main-blog-image"
                    alt="Blog Cover"
                    onError={(e) => {
                        if (!e.target.getAttribute('data-error-handled')) {
                        e.target.setAttribute('data-error-handled', 'true');
                        e.target.onerror = null;
                        e.target.src = "/img/logo/main_2.png";
                        }
                    }}
                    />
                    )}
                </div>

                <div className="row my-3">
                    <div className="col-sm-4">
                        {opp_posts.deadline &&
                        <p className="my-2 p-0">{getDaysLeft(opp_posts.deadline)}</p>
                        }
                    </div>
                    <div className="col-sm-4">
                        {opp_posts.deadline && <p className="my-2 p-0">Deadline: {dateStringFormat(opp_posts.deadline)}</p>}
                    </div>
                </div>

                <div className="default-font-style" dangerouslySetInnerHTML={{ __html: opp_posts.description }}></div>

                {/* <ul className="m-0 p-0 list-unstyled my-3">
                    {
                    renderLabels(opp_posts.categories)
                    }
                </ul> */}
                <ul className="m-0 p-0 list-unstyled py-3">
                    {["continents", "countries", "categories"].map((key) => 
                        opp_posts[key] && renderLabels(opp_posts[key], key.charAt(0).toUpperCase() + key.slice(1))
                    )}
                </ul>

                <div className="row mt-4">
                    <div className="col-sm-3">
                        {/* <div className="position-absolute share-panel border rounded fs-8 d-none"></div> */}
                        <div className="content-btn-holder">
                            <div className="position-relative">
                            <div className="position-absolute share-panel border rounded fs-8 d-none"></div>
                            <button 
                                className="text-decoration-none btn w-100 poppins-semibold border rounded fs-9"
                                data-title={opp_posts.title} 
                                data-id={opp_posts.id} 
                                onClick={(e) => toggleShare(e.currentTarget)}
                                >
                                <span className="material-symbols-outlined align-middle">
                                share
                                </span>
                            </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-3">
                        <button 
                        className="text-decoration-none btn w-100  border rounded fs-9"
                        data-id={opp_posts.id}
                        data-title={opp_posts.title}
                        data-type="oppo-type"
                        data-url={pageLink(opp_posts.title, opp_posts.id)}
                        onClick={(e) => bookmark(e.currentTarget)}
                      >
                        <svg 
                        className="inline-block align-middle"
                        xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" 
                        fill={`${(opp_posts.is_bookmarked === 1)? '#FFD700' : '#B0B0B0'}`}>
                        <path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Z"/></svg>
                        Bookmark
                      </button>
                    </div>
                    {opp_posts.source_url && (
                        <div className="col-sm-3">
                        <a className="text-decoration-none btn w-100 border rounded fs-9" href={opp_posts.source_url} target="_blank" rel="noopener noreferrer">
                        Read More
                        </a>
                        </div>
                    )}
                    {opp_posts.direct_link && (
                        <div className="col-sm-3">
                        <a className="text-decoration-none btn w-100  border rounded fs-9" href={opp_posts.direct_link} target="_blank" rel="noopener noreferrer">
                        Apply
                        </a>
                        </div>
                    )}
                </div>
                {/* <div className="mt-3">
                <StarRating  postID={opp_posts?.id}/>
                </div> */}

                {/* <div>
                <CommentComponent 
                postId={opp_posts?.id}
                isAuthenticated={(props?.auth?.user)? true : false}
                totalComments={total_comments}/>
                </div> */}

                <div>
                <RecommendedContent similarPosts={similarPosts}/>
                </div>
            </Col>
            <Col sm={4}>
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
                                width="50"
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
            </Col>
        </Row>
</Container>

            </GuestLayout>
        
        </>
    )
}

export default ReadOpportunity;