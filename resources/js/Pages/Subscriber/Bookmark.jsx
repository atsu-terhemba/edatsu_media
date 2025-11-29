import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState, useRef } from 'react';
import SubscriberSideNav from './Components/SideNav';
import axios from 'axios';
import DefaultPagination from '@/Components/DefaultPagination';
import { getDaysLeft, toggleShare, bookmark, pageLink, renderLabels, dateStringFormat} from "@/utils/Index";
import { Toast } from '@/utils/Index';

export default function Bookmark() {
    const [loading, setIsloading] = useState(true);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState([]);
    const paginationContainerRef = useRef(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(()=>{
        setIsloading(true)
       axios.get('/fetch-bookmark')
       .then((response)=>{
        const  {data, links, current_page, total, per_page, last_page} = response.data;
        console.log(data);
        setData(data);
        setPagination(links)
       }).catch((error)=>{
        console.log(error);
        setIsloading(false);
       }).finally(()=>{
        setIsloading(false);
       })
    },[refreshTrigger])

          // Then in your triggerPagination function:
  function triggerPagination(url) {
    // Store the current position of the pagination container
    const container = paginationContainerRef.current;
    const containerPosition = container ? container.getBoundingClientRect().top + window.scrollY : 0;
    setIsloading(true);
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
        setIsloading(false)
    });
}


        // Function to generate a page link
    function pageLink(title, id, url_type) {
        // Convert title to lowercase and replace spaces with hyphens
        const formattedTitle = title
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-zA-Z0-9'-]/g, '') // Allow letters, numbers, hyphens, and apostrophes
            .replace(/--+/g, '-')
            .replace(/^-|-$/g, '')
            .trim();

        // Implement the logic to generate the post link
        let link = `op/${id}/${encodeURIComponent(url_type)}`;
        return link;
    }

        // Function to format a date with suffix (e.g., "1st", "2nd", etc.)
    function formatDate(inputDate) {
        const date = new Date(inputDate);
        // Format day with suffix
        const day = date.getDate();
        const dayWithSuffix = day + (
            (day === 1 || day === 21 || day === 31) ? "st" :
            (day === 2 || day === 22) ? "nd" :
            (day === 3 || day === 23) ? "rd" :
            "th"
        );
        // Format month using its name
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        const month = monthNames[date.getMonth()];
        // Format year
        const year = date.getFullYear();
        // Concatenate the formatted parts to get the final formatted date
        const formattedDate = `${dayWithSuffix} ${month} ${year}`;
        return formattedDate;
    }

    // Function to remove a bookmark
    async function removeBookmark(post_id) {
        const newData = data.filter((d) => d.id != post_id);
        
        try {
            const response = await axios.put('/remove-bookmark-feed', {id: post_id}); // Also fixed to use post_id
            
            // Axios automatically parses JSON, so response.data is already the data
            const responseData = response.data;
            
            if (responseData.status == 'success') {
                Toast.fire({
                    icon: "info",
                    title: responseData.message
                });
                setData(newData);
                setRefreshTrigger(prev => prev + 1);
            } else if (responseData.status == 'warning') {
                Toast.fire({
                    icon: "warning",
                    title: responseData.message
                });
            } else {
                Toast.fire({
                    icon: "error",
                    title: responseData.message
                });
            }
        } catch (error) {
            Toast.fire({
                icon: "error",
                title: "Error removing bookmark"
            });
            console.error('There was a problem with the request:', error);
        }
    }
    return (
        <AuthenticatedLayout>
            <Head title="Bookmark" />

            <Container fluid={true}>
                <Container>
                    <Row>
                        <Col sm={3} className="d-none d-md-block">
                            <div className='my-3 fs-9'>
                                <SubscriberSideNav/>
                            </div>
                        </Col>
                        <Col sm={6} xs={12}>
                            <div className='border px-3 py-4 rounded my-3 text-center'>
                                <h2 className='poppins-semibold m-0 py-0'>Bookmark</h2>
                            </div>
                            <div>
                            {
                                data.map((data) => {
                                    // Determine if we're dealing with an opportunity or event
                                    const isOpportunity = data.post_type === "opp" && data.opportunity;
                                    const isEvent = data.post_type !== "opp" && data.event;
                                    
                                    // Extract data from either opportunity or event
                                    let title, post_id, slug, deadline, bookmark_id;
                                    
                                    if (isOpportunity) {
                                        ({ title, id: post_id, slug, deadline, bookmark_id } = data.opportunity);
                                    } else if (isEvent) {
                                        ({ title, id: post_id, slug, deadline, bookmark_id } = data.event);
                                    } else {
                                    // Fallback if neither opportunity nor event is present
                                    return null;
                                    }
                                    
                                    return (
                                    <div className="d-flex align-items-center mb-3 bg-white border rounded py-2 pe-3" key={data.id}>
                                        <div className="w-100 px-3">
                                        <span className="d-block fs-8 text-secondary">Deadline: {formatDate(deadline)}</span>
                                        <Link 
                                            href={pageLink(title, post_id, slug)} 
                                            className="d-block my-1 text-decoration-none text-dark" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                        >
                                            {title}
                                            &nbsp;
                                            <span className="material-symbols-outlined align-middle fs-9">
                                            arrow_outward
                                            </span>
                                        </Link>
                                        <span className="d-block fs-9">{getDaysLeft(deadline)}</span>
                                        </div>
                                        <div 
                                        className="btn border-0 shadow-none" 
                                        id={bookmark_id} 
                                        onClick={() => removeBookmark(data.id)}
                                        >
                                        <span className="material-symbols-outlined align-middle text-danger">
                                        cancel
                                        </span>
                                        </div>
                                    </div>
                                    );
                                })
                                }

                                {(pagination.length > 0) &&
                                    <DefaultPagination 
                                        pagination={pagination} 
                                        triggerPagination={triggerPagination}
                                    />
                                }
                            </div>
                        </Col>
                        <Col sm={3}>
                            {/* <div>main content</div> */}
                        </Col>
                    </Row>
                </Container>
            </Container>
            
        </AuthenticatedLayout>
    );
}
