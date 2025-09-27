import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import SubscriberSideNav from './Components/SideNav';
import { Link } from '@inertiajs/react';
import axios from 'axios';

export default function BookmarkedTools() {
    const [tools, setTools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchTools();
    }, [currentPage]);

    const fetchTools = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/fetch-tool-bookmark?page=${currentPage}`);
            setTools(response.data);
        } catch (error) {
            console.error('Error fetching tools:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeBookmark = async (bookmarkId) => {
        try {
            const response = await axios.put('/remove-bookmark-feed', { id: bookmarkId });
            if (response.data.status === 'success') {
                fetchTools(); // Refresh the list
            }
        } catch (error) {
            console.error('Error removing bookmark:', error);
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
            <Head title="Bookmarked Tools" />

            <Container fluid={true}>
                <Container>
                    <Row>
                        <Col sm={3}>
                            <div className='my-3 fs-9'>
                                <SubscriberSideNav/>
                            </div>
                        </Col>
                        <Col sm={9}>
                            <div className='border px-3 py-4 rounded my-3'>
                                <div className='d-flex justify-content-between align-items-center mb-3'>
                                    <h2 className='poppins-semibold m-0'>Bookmarked Tools</h2>
                                    <Badge bg="primary">{tools.total || 0} Total</Badge>
                                </div>
                                
                                {loading ? (
                                    <div className='text-center py-5'>
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : tools.data && tools.data.length > 0 ? (
                                    <div>
                                        {tools.data.map((bookmark) => (
                                            <Card key={bookmark.id} className='mb-3 shadow-sm'>
                                                <Card.Body>
                                                    <Row>
                                                        <Col md={8}>
                                                            <div className='d-flex align-items-start mb-2'>
                                                                <img 
                                                                    src={bookmark.product?.cover_img || '/img/default-tool.jpg'} 
                                                                    alt={bookmark.product?.product_name}
                                                                    className='me-3 rounded'
                                                                    style={{width: '80px', height: '80px', objectFit: 'cover'}}
                                                                />
                                                                <div className='flex-grow-1'>
                                                                    <h5 className='poppins-semibold mb-1'>
                                                                        {bookmark.product?.product_name}
                                                                    </h5>
                                                                    <p className='text-muted fs-8 mb-2'>
                                                                        {bookmark.product?.product_description?.substring(0, 150)}...
                                                                    </p>
                                                                    <div className='d-flex align-items-center gap-2'>
                                                                        <Badge bg="success">
                                                                            <i className='bi bi-tools me-1'></i>
                                                                            Tool
                                                                        </Badge>
                                                                        <Badge bg="info">
                                                                            <i className='bi bi-eye me-1'></i>
                                                                            {bookmark.product?.views || 0} Views
                                                                        </Badge>
                                                                        {bookmark.product?.ratings > 0 && (
                                                                            <Badge bg="warning">
                                                                                <i className='bi bi-star-fill me-1'></i>
                                                                                {bookmark.product?.ratings}/5
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col md={4} className='text-end'>
                                                            <div className='d-flex flex-column gap-2'>
                                                                <small className='text-muted'>
                                                                    Bookmarked: {formatDate(bookmark.created_at)}
                                                                </small>
                                                                <div>
                                                                    <Button 
                                                                        href={`/tools/${bookmark.product?.slug}`}
                                                                        variant="outline-primary" 
                                                                        size="sm" 
                                                                        className='me-2'
                                                                    >
                                                                        <i className='bi bi-eye me-1'></i>
                                                                        View
                                                                    </Button>
                                                                    {bookmark.product?.source_url && (
                                                                        <Button 
                                                                            href={bookmark.product.source_url}
                                                                            target="_blank"
                                                                            variant="outline-success" 
                                                                            size="sm" 
                                                                            className='me-2'
                                                                        >
                                                                            <i className='bi bi-box-arrow-up-right me-1'></i>
                                                                            Visit
                                                                        </Button>
                                                                    )}
                                                                    <Button 
                                                                        variant="outline-danger" 
                                                                        size="sm"
                                                                        onClick={() => removeBookmark(bookmark.id)}
                                                                    >
                                                                        <i className='bi bi-bookmark-dash me-1'></i>
                                                                        Remove
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        ))}
                                        
                                        {/* Pagination */}
                                        {tools.last_page > 1 && (
                                            <div className='d-flex justify-content-center mt-4'>
                                                <nav>
                                                    <ul className="pagination">
                                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                            <Button 
                                                                variant="outline-primary" 
                                                                onClick={() => setCurrentPage(currentPage - 1)}
                                                                disabled={currentPage === 1}
                                                            >
                                                                Previous
                                                            </Button>
                                                        </li>
                                                        <li className="page-item active">
                                                            <span className="page-link">
                                                                {currentPage} of {tools.last_page}
                                                            </span>
                                                        </li>
                                                        <li className={`page-item ${currentPage === tools.last_page ? 'disabled' : ''}`}>
                                                            <Button 
                                                                variant="outline-primary" 
                                                                onClick={() => setCurrentPage(currentPage + 1)}
                                                                disabled={currentPage === tools.last_page}
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
                                    <div className='text-center py-5'>
                                        <i className='bi bi-tools text-muted' style={{fontSize: '3rem'}}></i>
                                        <h4 className='mt-3 text-muted'>No Bookmarked Tools</h4>
                                        <p className='text-muted'>Start bookmarking tools to see them here.</p>
                                        <Link href="/toolshed" className="btn btn-primary">
                                            Browse Tools
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Container>
        </AuthenticatedLayout>
    );
}
