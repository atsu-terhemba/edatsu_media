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
    const [filter, setFilter] = useState('all'); // 'all', 'rated', 'unrated'

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
                    .custom-dropdown-toggle::after {
                        display: none !important;
                    }
                    .tool-card {
                        position: relative;
                    }
                    .tool-card .dropdown.show {
                        z-index: 9999 !important;
                    }
                    .tool-card .dropdown-menu {
                        z-index: 10000 !important;
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
                            <div className='mb-3 py-3 rounded px-3 mt-3' style={{border: '1px solid #dee2e6'}}>
                                <div className='d-flex justify-content-between align-items-center flex-wrap gap-3'>
                                    <div className='flex-grow-1'>
                                        <h4 className='m-0 mb-1 fw-bold' style={{fontWeight: 'normal'}}>
                                            Bookmarked Tools
                                        </h4>
                                        <small className='text-muted'>Track and manage your saved tools and resources</small>
                                    </div>
                                    <Badge bg="light" text="dark" className='px-3 py-2' style={{border: '1px solid #dee2e6'}}>
                                        <span className='material-symbols-outlined me-1' style={{fontSize: '14px', verticalAlign: 'middle'}}>collections_bookmark</span>
                                        {tools.total || 0} Total
                                    </Badge>
                                </div>
                            </div>

                            <div className='mb-3 d-flex gap-2'>
                                <Button 
                                    size="sm" 
                                    variant={filter === 'all' ? 'primary' : 'outline-secondary'}
                                    onClick={() => setFilter('all')}
                                    style={{borderRadius: '4px', padding: '6px 12px'}}
                                >
                                    <span className='material-symbols-outlined me-1' style={{fontSize: '16px', verticalAlign: 'middle'}}>list</span>
                                    All
                                </Button>
                                <Button 
                                    size="sm" 
                                    variant={filter === 'rated' ? 'warning' : 'outline-secondary'}
                                    onClick={() => setFilter('rated')}
                                    style={{borderRadius: '4px', padding: '6px 12px'}}
                                >
                                    <span className='material-symbols-outlined me-1' style={{fontSize: '16px', verticalAlign: 'middle', fontVariationSettings: "'FILL' 1"}}>star</span>
                                    Rated
                                </Button>
                                <Button 
                                    size="sm" 
                                    variant={filter === 'unrated' ? 'secondary' : 'outline-secondary'}
                                    onClick={() => setFilter('unrated')}
                                    style={{borderRadius: '4px', padding: '6px 12px'}}
                                >
                                    <span className='material-symbols-outlined me-1' style={{fontSize: '16px', verticalAlign: 'middle'}}>star</span>
                                    Unrated
                                </Button>
                            </div>
                            <div>
                                
                                {loading ? (
                                    <BookmarksSkeleton count={5} />
                                ) : tools.data && tools.data.length > 0 ? (
                                    <div>
                                        {tools.data
                                            .filter(bookmark => {
                                                if (filter === 'all') return true;
                                                if (filter === 'rated') return bookmark.product?.ratings > 0;
                                                if (filter === 'unrated') return !bookmark.product?.ratings || bookmark.product.ratings === 0;
                                                return true;
                                            })
                                            .map((bookmark, index) => (
                                            <Card 
                                                key={bookmark.id} 
                                                className='mb-3 tool-card'
                                                style={{
                                                    border: '1px solid #dee2e6',
                                                    boxShadow: 'none',
                                                    position: 'relative',
                                                    zIndex: tools.data.length - index
                                                }}
                                            >
                                                <Card.Body className='p-3'>
                                                    <div className='d-flex align-items-start justify-content-between'>
                                                        <div className='flex-grow-1'>
                                                            <h6 className='mb-2' style={{fontSize: '0.9em'}}>
                                                                <Link 
                                                                    href={`/product/${bookmark.product?.id}/${bookmark.product?.slug}`}
                                                                    className='text-decoration-none text-dark'
                                                                >
                                                                    {bookmark.product?.product_name}
                                                                </Link>
                                                            </h6>
                                                            <div className='d-flex align-items-center gap-2 flex-wrap mb-2'>
                                                                <span className='badge' style={{
                                                                    background: '#667eea',
                                                                    color: 'white',
                                                                    padding: '4px 10px',
                                                                    borderRadius: '4px',
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: '500'
                                                                }}>
                                                                    <span className='material-symbols-outlined me-1' style={{fontSize: '14px', verticalAlign: 'middle'}}>handyman</span>
                                                                    Tool
                                                                </span>
                                                                {bookmark.product?.ratings > 0 && (
                                                                    <span className='badge' style={{
                                                                        background: '#ffc107',
                                                                        color: 'white',
                                                                        padding: '4px 10px',
                                                                        borderRadius: '4px',
                                                                        fontSize: '0.75rem',
                                                                        fontWeight: '500'
                                                                    }}>
                                                                        <span className='material-symbols-outlined me-1' style={{fontSize: '14px', verticalAlign: 'middle', fontVariationSettings: "'FILL' 1"}}>star</span>
                                                                        {bookmark.product.ratings}/5
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <small className='text-muted'>
                                                                <span className='material-symbols-outlined me-1' style={{fontSize: '14px', verticalAlign: 'middle'}}>bookmark_check</span>
                                                                {formatDate(bookmark.created_at)}
                                                            </small>
                                                        </div>
                                                        <Dropdown align="end" style={{position: 'relative', zIndex: 1000}}>
                                                            <Dropdown.Toggle 
                                                                variant="light" 
                                                                size="sm" 
                                                                style={{
                                                                    borderRadius: '8px',
                                                                    border: 'none',
                                                                    padding: '6px 10px',
                                                                    background: 'transparent'
                                                                }}
                                                                bsPrefix="custom-dropdown-toggle"
                                                            >
                                                                <span className='material-symbols-outlined' style={{fontSize: '16px'}}>more_vert</span>
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu style={{zIndex: 10000, position: 'absolute'}}>
                                                                <Dropdown.Item 
                                                                    as={Link}
                                                                    href={`/product/${bookmark.product?.id}/${bookmark.product?.slug}`}
                                                                >
                                                                    <span className='material-symbols-outlined me-2' style={{fontSize: '16px', verticalAlign: 'middle'}}>visibility</span>
                                                                    View Details
                                                                </Dropdown.Item>
                                                                {bookmark.product?.source_url && (
                                                                    <>
                                                                        <Dropdown.Divider />
                                                                        <Dropdown.Item 
                                                                            href={bookmark.product.source_url}
                                                                            target="_blank"
                                                                        >
                                                                            <span className='material-symbols-outlined me-2' style={{fontSize: '16px', verticalAlign: 'middle'}}>open_in_new</span>
                                                                            Visit Website
                                                                        </Dropdown.Item>
                                                                    </>
                                                                )}
                                                                <Dropdown.Divider />
                                                                <Dropdown.Item 
                                                                    onClick={() => removeBookmark(bookmark.id)}
                                                                    className='text-danger'
                                                                >
                                                                    <span className='material-symbols-outlined me-2' style={{fontSize: '16px', verticalAlign: 'middle'}}>delete</span>
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
                                            <span className='material-symbols-outlined text-muted' style={{fontSize: '4rem'}}>bookmark_remove</span>
                                        </div>
                                        <h5 className='text-muted mb-2'>No Bookmarked Tools Yet</h5>
                                        <p className='text-muted mb-4'>Start exploring and bookmarking tools to keep track of them here.</p>
                                        <Link href="/toolshed" className="btn btn-outline-secondary" style={{borderRadius: '6px'}}>
                                            <span className='material-symbols-outlined me-2' style={{fontSize: '16px', verticalAlign: 'middle'}}>search</span>
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
