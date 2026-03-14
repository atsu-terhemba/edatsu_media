import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, Badge, Button, Form, InputGroup, Table, Pagination, Image, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Head, Link, router } from '@inertiajs/react';
import AdminSideNav from './Components/SideNav';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    Package, Plus, Search, Filter, Eye, Edit, Trash2, Download, RotateCcw,
    ExternalLink, TrendingUp, BarChart3, Users, Clock, Star, MessageSquare
} from 'lucide-react';
import axios from 'axios';
import { Toast } from '@/utils/Index';
import DefaultPagination from '@/Components/DefaultPagination';

export default function AllProducts({ products, statistics, categories, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [categoryFilter, setCategoryFilter] = useState(filters.category || '');
    const [perPageFilter, setPerPageFilter] = useState(filters.per_page || 12);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState(products.links || []);
    const [productData, setProductData] = useState(products.data || []);
    const [currentPage, setCurrentPage] = useState(products.current_page || 1);
    const [perPage, setPerPage] = useState(products.per_page || 12);
    const paginationContainerRef = useRef(null);

    // Handle pagination like AllOppty.jsx
    function triggerPagination(url) {
        const container = paginationContainerRef.current;
        const containerPosition = container ? container.getBoundingClientRect().top + window.scrollY : 0;
        setIsLoading(true);
        
        axios.get(url)
        .then((response) => {
            const { data, links, current_page, per_page } = response.data;
            setProductData(data); 
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
            console.error('Pagination error:', error);
            Toast.fire({
                icon: "error",
                title: 'Error loading products'
            });
        })
        .finally(() => {
            setIsLoading(false);
        });
    }

    // Check if product is deleted
    const isProductDeleted = (product) => {
        return product.deleted == 1 || product.deleted_at;
    };

    // Status display function like AllOppty.jsx
    const toggleStatus = (product) => {
        if (isProductDeleted(product)) {
            return <span className='badge rounded-pill text-bg-danger'>Deleted</span>;
        }
        return <span className='badge rounded-pill text-bg-success'>Active</span>;
    };

    // Filter change handler
    const handleFilterChange = (filterType, value) => {
        if (filterType === 'search') {
            setSearchTerm(value);
        } else if (filterType === 'status') {
            setStatusFilter(value);
        } else if (filterType === 'category') {
            setCategoryFilter(value);
        } else if (filterType === 'per_page') {
            setPerPageFilter(value);
        }
    };

    // Apply filters
    const applyFilters = () => {
        setIsLoading(true);
        
        router.get(route('admin.all-products'), {
            search: searchTerm,
            status: statusFilter,
            category: categoryFilter,
            per_page: perPageFilter
        }, {
            preserveState: true,
            onSuccess: () => setIsLoading(false),
            onError: () => {
                setIsLoading(false);
                Toast.fire({
                    icon: "error",
                    title: 'Error applying filters'
                });
            }
        });
    };

    // Clear filters
    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        setCategoryFilter('');
        setPerPageFilter(12);
        
        router.get(route('admin.all-products'), {}, {
            preserveState: true
        });
    };

    // CRUD operations handler like AllOppty.jsx
    const initCrud = async (e) => {
        e?.preventDefault();
        const url = e.target.href;
        axios.get(url).then((res) => {
            console.log(res);
            if (res.data.status == 'success') {
                Toast.fire({
                    icon: "success",
                    title: res.data.message
                });
                // Refresh the page data
                window.location.reload();
            }
        }).catch((err) => {
            console.log(err);
            const errorMessage = err.response?.data?.message || 'Something went wrong.';
            Toast.fire({
                icon: "error",
                title: errorMessage
            });
        })
    };

    return (
        <>
            <Head title="All Products" />
            <AuthenticatedLayout>
                <Container>
                    <Row>
                        <Col sm={3}>
                            <div className='my-3 fs-9'>
                                <AdminSideNav />
                            </div>
                        </Col>
                        <Col sm={9}>
                            <div className="px-3 py-2 rounded border text-center bg-white my-3">
                                <h2 className="poppins-semibold m-0 p-0 py-3">All Products</h2>
                            </div>

                            {/* Statistics Cards */}
                            <Row className="mb-4">
                                <Col md={3} sm={6} className="mb-3">
                                    <Card className="border-0 shadow-sm h-100">
                                        <Card.Body className="text-center">
                                            <Package className="text-primary mb-2" size={32} />
                                            <h4 className="mb-0">{statistics.total_products}</h4>
                                            <small className="text-muted">Total Products</small>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={3} sm={6} className="mb-3">
                                    <Card className="border-0 shadow-sm h-100">
                                        <Card.Body className="text-center">
                                            <TrendingUp className="text-success mb-2" size={32} />
                                            <h4 className="mb-0">{statistics.active_products}</h4>
                                            <small className="text-muted">Active Products</small>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={3} sm={6} className="mb-3">
                                    <Card className="border-0 shadow-sm h-100">
                                        <Card.Body className="text-center">
                                            <Trash2 className="text-danger mb-2" size={32} />
                                            <h4 className="mb-0">{statistics.deleted_products}</h4>
                                            <small className="text-muted">Deleted Products</small>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={3} sm={6} className="mb-3">
                                    <Card className="border-0 shadow-sm h-100">
                                        <Card.Body className="text-center">
                                            <Eye className="text-info mb-2" size={32} />
                                            <h4 className="mb-0">{statistics.total_views.toLocaleString()}</h4>
                                            <small className="text-muted">Total Views</small>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            {/* Filters */}
                            <Card className="mb-4">
                                <Card.Body>
                                    <Row>
                                        <Col md={4} className="mb-3">
                                            <Form.Group>
                                                <Form.Label>Search Products</Form.Label>
                                                <InputGroup>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Search by name, description, or author..."
                                                        value={searchTerm}
                                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                                    />
                                                    <Button 
                                                        variant="outline-primary" 
                                                        onClick={applyFilters}
                                                        disabled={isLoading}
                                                    >
                                                        <Search size={16} />
                                                    </Button>
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>
                                        <Col md={2} className="mb-3">
                                            <Form.Group>
                                                <Form.Label>Status</Form.Label>
                                                <Form.Select
                                                    value={statusFilter}
                                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                                >
                                                    <option value="">All Status</option>
                                                    <option value="active">Active</option>
                                                    <option value="deleted">Deleted</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={2} className="mb-3">
                                            <Form.Group>
                                                <Form.Label>Category</Form.Label>
                                                <Form.Select
                                                    value={categoryFilter}
                                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                                >
                                                    <option value="">All Categories</option>
                                                    {categories.map(category => (
                                                        <option key={category.id} value={category.id}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={2} className="mb-3">
                                            <Form.Group>
                                                <Form.Label>Per Page</Form.Label>
                                                <Form.Select
                                                    value={perPageFilter}
                                                    onChange={(e) => handleFilterChange('per_page', e.target.value)}
                                                >
                                                    <option value="12">12</option>
                                                    <option value="24">24</option>
                                                    <option value="48">48</option>
                                                    <option value="100">100</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={2} className="mb-3 d-flex align-items-end">
                                            <Button 
                                                variant="outline-secondary" 
                                                onClick={clearFilters}
                                                className="w-100"
                                            >
                                                Clear
                                            </Button>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            {/* Products Table */}
                            <div className='table table-responsive fs-9'>
                                <table className='table table-bordered table-hover'>
                                    <thead className='table-dark poppins-semibold'>
                                        <tr>
                                            <th scope='col' className='poppins-regular'>#</th>
                                            <th scope='col' className='poppins-regular'>Image</th>
                                            <th scope='col' className='poppins-regular'>Product Name</th>
                                            <th scope='col' className='poppins-regular'>Status</th>
                                            <th scope='col' className='poppins-regular'>Views</th>
                                            <th scope='col' className='poppins-regular'>Author</th>
                                            <th scope='col' className='poppins-regular'>Created</th>
                                            <th scope='col' className='poppins-regular'>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productData?.map((product, index) => (
                                            <tr key={product.id}>
                                                <td>{(currentPage - 1) * perPage + index + 1}</td>
                                                <td>
                                                    <Image 
                                                        src={product.cover_img || '/img/default-product.jpg'} 
                                                        alt={product.product_name}
                                                        width={40}
                                                        height={40}
                                                        className="rounded"
                                                        style={{ objectFit: 'cover' }}
                                                        onError={(e) => {
                                                            e.target.src = '/img/default-product.jpg';
                                                        }}
                                                    />
                                                </td>
                                                <td>
                                                    <div>
                                                        <strong>{product.product_name}</strong>
                                                        {product.categories && (
                                                            <div>
                                                                <small className="text-muted">
                                                                    {product.categories.split(',').slice(0, 2).join(', ')}
                                                                    {product.categories.split(',').length > 2 && '...'}
                                                                </small>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>{toggleStatus(product)}</td>
                                                <td>{product.views || 0}</td>
                                                <td>{product.user_name || 'Unknown'}</td>
                                                <td>{new Date(product.created_at).toLocaleDateString()}</td>
                                                <td className='text-center'>
                                                    <div className="dropdown">
                                                        <button className="btn fs-9" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                            <span className="material-symbols-outlined align-middle">
                                                                more_vert
                                                            </span>
                                                        </button>
                                                        <ul className="dropdown-menu dropdown-menu-dark fs-9">
                                                            <li><Link className="dropdown-item" href={`/admin-edit-product/${product.id}`}>Edit</Link></li>
                                                            {product.source_url && (
                                                                <li><a className="dropdown-item" href={product.source_url} target="_blank" rel="noopener noreferrer">View Source</a></li>
                                                            )}
                                                            {product.direct_link && (
                                                                <li><a className="dropdown-item" href={product.direct_link} target="_blank" rel="noopener noreferrer">Direct Link</a></li>
                                                            )}
                                                            <li><Link className="dropdown-item" href={`/ts/${product.id}/${product.slug}`}>Preview</Link></li>
                                                            {isProductDeleted(product) ? (
                                                                <li><a className="dropdown-item" href={`/admin-restore-product/${product.id}`} onClick={(e) => initCrud(e)}>Restore</a></li>
                                                            ) : (
                                                                <li><a className="dropdown-item text-danger" href={`/admin-delete-product/${product.id}`} onClick={(e) => initCrud(e)}>Delete</a></li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>    
                                </table>
                            </div>

                            {/* Pagination */}
                            {(pagination.length > 0) && (
                                <div ref={paginationContainerRef}>
                                    <DefaultPagination 
                                        pagination={pagination} 
                                        triggerPagination={triggerPagination}
                                    />
                                </div>
                            )}
                        </Col>
                    </Row>
                </Container>
            </AuthenticatedLayout>
        </>
    );
}
