import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col, Card, Badge, Button, Form, InputGroup, Table, Pagination, Image, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import AdminSideNav from './Components/SideNav';
import { 
    Package, Plus, Search, Filter, Eye, Edit, Trash2, Download, RotateCcw,
    ExternalLink, TrendingUp, BarChart3, Users, Clock, Star, MessageSquare
} from 'lucide-react';
import axios from 'axios';
import { Toast } from '@/utils/Index';
import DefaultPagination from '@/Components/DefaultPagination';

export default function AllProducts({ products, statistics, categories, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(filters.per_page || 12);
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [isLoading, setIsLoading] = useState(false);

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        setIsLoading(true);
        router.get(route('admin.all_products'), { 
            search: searchTerm, 
            per_page: perPage,
            status: statusFilter
        }, {
            preserveState: true,
            onFinish: () => setIsLoading(false)
        });
    };

    // Handle filter changes
    const handleFilterChange = (filterType, value) => {
        setIsLoading(true);
        const params = {
            search: searchTerm,
            per_page: perPage,
            status: statusFilter
        };
        params[filterType] = value;
        
        if (filterType === 'status') {
            setStatusFilter(value);
        } else if (filterType === 'per_page') {
            setPerPage(value);
        }

        router.get(route('admin.all_products'), params, {
            preserveState: true,
            onFinish: () => setIsLoading(false)
        });
    };

    // Clear filters
    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        setIsLoading(true);
        router.get(route('admin.all_products'), {}, {
            preserveState: true,
            onFinish: () => setIsLoading(false)
        });
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Format views count
    const formatViews = (views) => {
        if (views >= 1000000) {
            return (views / 1000000).toFixed(1) + 'M';
        } else if (views >= 1000) {
            return (views / 1000).toFixed(1) + 'K';
        }
        return views;
    };

    // Get status badge variant
    const getStatusBadgeVariant = (product) => {
        return (product.deleted == 1 || product.deleted_at) ? 'danger' : 'success';
    };

    // Check if product is deleted
    const isProductDeleted = (product) => {
        return product.deleted == 1 || product.deleted_at;
    };

    // Statistics cards
    const StatCard = ({ icon: Icon, title, value, color, subtitle, trend }) => (
        <Card className="stat-card h-100 border-0 shadow-sm">
            <Card.Body className="p-4">
                <div className="d-flex align-items-center">
                    <div className={`stat-icon bg-${color} me-3`}>
                        <Icon size={20} color="white" />
                    </div>
                    <div>
                        <h3 className="stat-number mb-0">{value.toLocaleString()}</h3>
                        <h6 className="stat-title mb-0">{title}</h6>
                        {subtitle && <small className="text-muted">{subtitle}</small>}
                    </div>
                </div>
            </Card.Body>
        </Card>
    );

    // Pagination component
    const renderPagination = () => {
        if (!products.links || products.links.length <= 3) return null;

        return (
            <div className="d-flex justify-content-between align-items-center mt-4">
                <div className="text-muted">
                    Showing {products.from} to {products.to} of {products.total} results
                </div>
                <Pagination className="mb-0">
                    {products.links.map((link, index) => (
                        <Pagination.Item
                            key={index}
                            active={link.active}
                            disabled={!link.url}
                            onClick={() => {
                                if (link.url) {
                                    setIsLoading(true);
                                    router.get(link.url, {}, {
                                        preserveState: true,
                                        onFinish: () => setIsLoading(false)
                                    });
                                }
                            }}
                        >
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        </Pagination.Item>
                    ))}
                </Pagination>
            </div>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="All Products - Admin" />

            <div className="products-page">
                <Container fluid={true}>
                    <Container>
                        <Row>
                            <Col sm={3}>
                                <div className='my-3 fs-9'>
                                    <AdminSideNav/>
                                </div>
                            </Col>
                            <Col sm={9}>
                                <div className='my-3'>
                                    {/* Header */}
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <div>
                                            <h1 className="poppins-bold mb-2">All Products</h1>
                                            <p className="text-muted">Manage and monitor all products on the platform</p>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <Button variant="outline-success" size="sm">
                                                <Download size={16} className="me-1" />
                                                Export
                                            </Button>
                                            <Button 
                                                variant="primary" 
                                                size="sm"
                                                as={Link}
                                                href={route('admin.products')}
                                            >
                                                <Plus size={16} className="me-1" />
                                                Add Product
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Statistics Cards */}
                                    <Row className="mb-4">
                                        <Col lg={3} md={6} className="mb-3">
                                            <StatCard
                                                icon={Package}
                                                title="Total Products"
                                                value={statistics.total_products}
                                                color="primary"
                                                subtitle="All products (including deleted)"
                                            />
                                        </Col>
                                        <Col lg={3} md={6} className="mb-3">
                                            <StatCard
                                                icon={TrendingUp}
                                                title="Active Products"
                                                value={statistics.active_products}
                                                color="success"
                                                subtitle="Currently published"
                                            />
                                        </Col>
                                        <Col lg={3} md={6} className="mb-3">
                                            <StatCard
                                                icon={BarChart3}
                                                title="Total Views"
                                                value={statistics.total_views}
                                                color="warning"
                                                subtitle="All-time views"
                                            />
                                        </Col>
                                        <Col lg={3} md={6} className="mb-3">
                                            <StatCard
                                                icon={Plus}
                                                title="New (30d)"
                                                value={statistics.recent_products}
                                                color="info"
                                                subtitle="Recent additions"
                                            />
                                        </Col>
                                    </Row>

                                    {/* Filters and Search */}
                                    <Card className="border-0 shadow-sm mb-4">
                                        <Card.Body>
                                            <Row className="align-items-end">
                                                <Col md={4}>
                                                    <Form onSubmit={handleSearch}>
                                                        <InputGroup>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Search products..."
                                                                value={searchTerm}
                                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                            />
                                                            <Button 
                                                                variant="outline-primary" 
                                                                type="submit"
                                                                disabled={isLoading}
                                                            >
                                                                <Search size={16} />
                                                            </Button>
                                                        </InputGroup>
                                                    </Form>
                                                </Col>
                                                <Col md={2}>
                                                    <Form.Select
                                                        value={statusFilter}
                                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                                    >
                                                        <option value="">All Status</option>
                                                        <option value="active">Active</option>
                                                        <option value="deleted">Deleted</option>
                                                    </Form.Select>
                                                </Col>
                                                <Col md={2}>
                                                    <Form.Select
                                                        value={perPage}
                                                        onChange={(e) => handleFilterChange('per_page', e.target.value)}
                                                    >
                                                        <option value="12">12 per page</option>
                                                        <option value="24">24 per page</option>
                                                        <option value="48">48 per page</option>
                                                        <option value="96">96 per page</option>
                                                    </Form.Select>
                                                </Col>
                                                <Col md={4}>
                                                    <div className="d-flex gap-2">
                                                        <Button 
                                                            variant="outline-secondary" 
                                                            onClick={clearFilters}
                                                            size="sm"
                                                        >
                                                            Clear Filters
                                                        </Button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>

                                    {/* Products Grid */}
                                    {isLoading ? (
                                        <div className="text-center py-5">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    ) : products.data.length > 0 ? (
                                        <Row>
                                            {products.data.map((product) => (
                                                <Col lg={4} md={6} key={product.id} className="mb-4">
                                                    <Card className="product-card h-100 border-0 shadow-sm">
                                                        <div className="product-image-container">
                                                            <Image 
                                                                src={product.cover_img || '/img/default-product.jpg'} 
                                                                alt={product.product_name}
                                                                className="product-image"
                                                                onError={(e) => {
                                                                    e.target.src = '/img/default-product.jpg';
                                                                }}
                                                            />
                                                            <div className="product-overlay">
                                                                <div className="product-actions">
                                                                    <OverlayTrigger
                                                                        placement="top"
                                                                        overlay={<Tooltip>View Product</Tooltip>}
                                                                    >
                                                                        <Button variant="light" size="sm" className="me-1">
                                                                            <Eye size={14} />
                                                                        </Button>
                                                                    </OverlayTrigger>
                                                                    <OverlayTrigger
                                                                        placement="top"
                                                                        overlay={<Tooltip>Edit Product</Tooltip>}
                                                                    >
                                                                        <Button variant="light" size="sm" className="me-1">
                                                                            <Edit size={14} />
                                                                        </Button>
                                                                    </OverlayTrigger>
                                                                    {product.source_url && (
                                                                        <OverlayTrigger
                                                                            placement="top"
                                                                            overlay={<Tooltip>Visit Source</Tooltip>}
                                                                        >
                                                                            <Button 
                                                                                variant="light" 
                                                                                size="sm" 
                                                                                className="me-1"
                                                                                onClick={() => window.open(product.source_url, '_blank')}
                                                                            >
                                                                                <ExternalLink size={14} />
                                                                            </Button>
                                                                        </OverlayTrigger>
                                                                    )}
                                                                    <OverlayTrigger
                                                                        placement="top"
                                                                        overlay={<Tooltip>{isProductDeleted(product) ? 'Restore' : 'Delete'}</Tooltip>}
                                                                    >
                                                                        <Button 
                                                                            variant={isProductDeleted(product) ? "warning" : "danger"} 
                                                                            size="sm"
                                                                        >
                                                                            {isProductDeleted(product) ? <RotateCcw size={14} /> : <Trash2 size={14} />}
                                                                        </Button>
                                                                    </OverlayTrigger>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Card.Body className="p-3">
                                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                                <Badge bg={getStatusBadgeVariant(product)}>
                                                                    {isProductDeleted(product) ? 'Deleted' : 'Active'}
                                                                </Badge>
                                                                <small className="text-muted">ID: {product.id}</small>
                                                            </div>
                                                            <h6 className="product-title mb-2" title={product.product_name}>
                                                                {product.product_name}
                                                            </h6>
                                                            <p className="product-description text-muted small mb-3">
                                                                {product.product_description 
                                                                    ? product.product_description.slice(0, 100) + '...'
                                                                    : 'No description available'
                                                                }
                                                            </p>
                                                            <div className="product-stats d-flex justify-content-between align-items-center mb-2">
                                                                <div className="d-flex gap-3">
                                                                    <span className="d-flex align-items-center gap-1 text-muted small">
                                                                        <Eye size={12} />
                                                                        {formatViews(product.views || 0)}
                                                                    </span>
                                                                    <span className="d-flex align-items-center gap-1 text-muted small">
                                                                        <MessageSquare size={12} />
                                                                        {product.comments || 0}
                                                                    </span>
                                                                    <span className="d-flex align-items-center gap-1 text-muted small">
                                                                        <Star size={12} />
                                                                        {product.ratings || 0}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="product-meta">
                                                                <small className="text-muted">
                                                                    Created: {formatDate(product.created_at)}
                                                                </small>
                                                                {product.user && (
                                                                    <div>
                                                                        <small className="text-muted">
                                                                            By: {product.user.name}
                                                                        </small>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    ) : (
                                        <Card className="border-0 shadow-sm">
                                            <Card.Body className="text-center py-5">
                                                <Package size={48} className="mb-3 opacity-50 text-muted" />
                                                <h5>No products found</h5>
                                                <p className="text-muted">Try adjusting your search criteria or add a new product.</p>
                                                <Button 
                                                    variant="primary"
                                                    as={Link}
                                                    href={route('admin.products')}
                                                >
                                                    <Plus size={16} className="me-1" />
                                                    Add New Product
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    )}

                                    {/* Pagination */}
                                    {renderPagination()}
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Container>
            </div>

            {/* Styles */}
            <style jsx>{`
                .product-card {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    overflow: hidden;
                }
                
                .product-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
                }
                
                .product-image-container {
                    position: relative;
                    height: 200px;
                    overflow: hidden;
                }
                
                .product-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }
                
                .product-card:hover .product-image {
                    transform: scale(1.05);
                }
                
                .product-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .product-card:hover .product-overlay {
                    opacity: 1;
                }
                
                .product-actions {
                    display: flex;
                    gap: 0.5rem;
                }
                
                .product-title {
                    font-weight: 600;
                    line-height: 1.3;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    min-height: 2.6em;
                }
                
                .product-description {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    line-height: 1.4;
                    min-height: 4.2em;
                }
                
                .stat-card {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                
                .stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
                }
                
                .stat-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .stat-number {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #2d3748;
                    line-height: 1;
                }
                
                .stat-title {
                    color: #4a5568;
                    font-weight: 600;
                    font-size: 0.875rem;
                }
                
                .pagination .page-item .page-link {
                    border: none;
                    color: #667eea;
                    font-weight: 500;
                }
                
                .pagination .page-item.active .page-link {
                    background-color: #667eea;
                    border-color: #667eea;
                }
                
                .pagination .page-item:hover .page-link {
                    background-color: #f8f9fa;
                    color: #5a67d8;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
