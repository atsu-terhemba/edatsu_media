import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col, Card, Badge, Button, Dropdown } from 'react-bootstrap';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import SubscriberSideNav from './Components/SideNav';
import axios from 'axios';
import Swal from 'sweetalert2';
import BookmarksSkeleton from '@/Components/BookmarksSkeleton';

export default function BookmarkedTools({ tools: initialTools }) {
    const [tools, setTools] = useState(initialTools || { data: [], total: 0 });
    const [loading, setLoading] = useState(false);

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });

    const removeBookmark = async (bookmarkId) => {
        try {
            const response = await axios.put('/remove-bookmark-feed', { id: bookmarkId });
            if (response.data.status === 'success') {
                // Update the local state to remove the bookmark immediately
                setTools(prevData => ({
                    ...prevData,
                    data: prevData.data.filter(bookmark => bookmark.id !== bookmarkId),
                    total: prevData.total - 1
                }));
                
                Toast.fire({
                    icon: "success",
                    title: "Bookmark removed successfully"
                });
            }
        } catch (error) {
            console.error('Error removing bookmark:', error);
            Toast.fire({
                icon: "error", 
                title: "Error removing bookmark"
            });
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Bookmarked Tools">
                <style dangerouslySetInnerHTML={{__html: `
                    .last-child-no-border:last-child {
                        border-bottom: none !important;
                    }
                `}} />
            </Head>

            <Container fluid={true}>
                <Container>
                    <Row>
                        <Col sm={3}>
                            <div className='my-3 fs-9' style={{position: 'relative', zIndex: 1000}}>
                                <SubscriberSideNav/>
                            </div>
                        </Col>
                        <Col sm={6}>
                            <div className='mb-3 py-3 rounded' style={{border: '1px solid #dee2e6'}}>
                                <div className='d-flex justify-content-between align-items-center flex-wrap gap-3'>
                                    <div className='flex-grow-1'>
                                        <h4 className='m-0 mb-1' style={{fontWeight: 'normal'}}>
                                            Bookmarked Tools
                                        </h4>
                                        <small className='text-muted'>Your saved tools and resources</small>
                                    </div>
                                    <Badge bg="light" text="dark" className='px-3 py-2' style={{border: '1px solid #dee2e6'}}>
                                        <i className='bi bi-collection me-1'></i>
                                        {tools.total || 0} Total
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                
                                {loading ? (
                                    <BookmarksSkeleton count={5} />
                                ) : tools.data && tools.data.length > 0 ? (
                                    <div>
                                        {tools.data.map((bookmark) => (
                                            <Card 
                                                key={bookmark.id} 
                                                className='mb-3 opportunity-card'
                                                style={{
                                                    border: '1px solid #dee2e6',
                                                    boxShadow: 'none'
                                                }}
                                            >
                                                <Card.Body className='p-3'>
                                                    <div className='d-flex align-items-start justify-content-between'>
                                                        <div className='flex-grow-1'>
                                                            <h6 className='mb-2'>
                                                                <Link 
                                                                    href={`/tools/${bookmark.product?.slug}`}
                                                                    className='text-decoration-none text-dark'
                                                                >
                                                                    {bookmark.product?.product_name}
                                                                </Link>
                                                            </h6>
                                                            <div className='d-flex align-items-center gap-2 flex-wrap mb-2'>
                                                                <Badge bg="light" text="dark" className='border'>
                                                                    <i className='bi bi-tools me-1'></i>
                                                                    Tool
                                                                </Badge>
                                                                {bookmark.product?.ratings > 0 && (
                                                                    <Badge bg="warning">
                                                                        <i className='bi bi-star-fill me-1'></i>
                                                                        {bookmark.product.ratings}/5
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <small className='text-muted'>
                                                                <i className='bi bi-bookmark-check me-1'></i>
                                                                {formatDate(bookmark.created_at)}
                                                            </small>
                                                        </div>
                                                        <Dropdown align="end">
                                                            <Dropdown.Toggle variant="outline-secondary" size="sm" style={{borderRadius: '6px'}}>
                                                                <i className='bi bi-three-dots-vertical'></i>
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu>
                                                                <Dropdown.Item 
                                                                    as={Link}
                                                                    href={`/tools/${bookmark.product?.slug}`}
                                                                >
                                                                    <i className='bi bi-eye me-2'></i>
                                                                    View Details
                                                                </Dropdown.Item>
                                                                {bookmark.product?.source_url && (
                                                                    <>
                                                                        <Dropdown.Divider />
                                                                        <Dropdown.Item 
                                                                            href={bookmark.product.source_url}
                                                                            target="_blank"
                                                                        >
                                                                            <i className='bi bi-box-arrow-up-right me-2'></i>
                                                                            Visit Website
                                                                        </Dropdown.Item>
                                                                    </>
                                                                )}
                                                                <Dropdown.Divider />
                                                                <Dropdown.Item 
                                                                    onClick={() => removeBookmark(bookmark.id)}
                                                                    className='text-danger'
                                                                >
                                                                    <i className='bi bi-trash3 me-2'></i>
                                                                    Remove Bookmark
                                                                </Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        ))}
                                        
                                        {/* Pagination */}
                                        {tools.last_page > 1 && (
                                            <div className='d-flex justify-content-center mt-4'>
                                                <nav>
                                                    <ul className="pagination">
                                                        <li className={`page-item ${tools.current_page === 1 ? 'disabled' : ''}`}>
                                                            <Button 
                                                                variant="outline-primary" 
                                                                onClick={() => router.visit(`/bookmarked-tools?page=${tools.current_page - 1}`)}
                                                                disabled={tools.current_page === 1}
                                                            >
                                                                Previous
                                                            </Button>
                                                        </li>
                                                        <li className="page-item active">
                                                            <span className="page-link">
                                                                {tools.current_page} of {tools.last_page}
                                                            </span>
                                                        </li>
                                                        <li className={`page-item ${tools.current_page === tools.last_page ? 'disabled' : ''}`}>
                                                            <Button 
                                                                variant="outline-primary" 
                                                                onClick={() => router.visit(`/bookmarked-tools?page=${tools.current_page + 1}`)}
                                                                disabled={tools.current_page === tools.last_page}
                                                            >
                                                                Next
                                                            </Button>
                                                        </li>
                                                    </ul>
                                                </nav>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className='text-center py-5 rounded' style={{border: '1px solid #dee2e6'}}>
                                        <div className='mb-4'>
                                            <i className='bi bi-tools text-muted' style={{fontSize: '4rem'}}></i>
                                        </div>
                                        <h5 className='text-muted mb-2'>No Bookmarked Tools Yet</h5>
                                        <p className='text-muted mb-4'>Start exploring and bookmarking tools to keep track of them here.</p>
                                        <Link href="/toolshed" className="btn btn-outline-secondary" style={{borderRadius: '6px'}}>
                                            <i className='bi bi-search me-2'></i>
                                            Explore Tools
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </Col>
                        <Col sm={3}>
                        </Col>
                    </Row>
                </Container>
            </Container>
        </AuthenticatedLayout>
    );
}
