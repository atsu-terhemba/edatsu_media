import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, Badge, Button, Form, InputGroup, Table, Pagination, Image, OverlayTrigger, Tooltip } from 'react-bootstrap';
import AdminSideNav from './Components/SideNav';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Package, Plus, Search, Filter, Eye, Edit, Trash2, Download, RotateCcw,
    ExternalLink, TrendingUp, BarChart3, Users, Clock, Star, MessageSquare
} from 'lucide-react';
import axios from 'axios';
import DefaultPagination from '@/Components/DefaultPagination';
import { Toast } from '@/utils/Index';


export default function AllOppty() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [perPageFilter, setPerPageFilter] = useState(20);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState([]);
    const [opp_data, setData] = useState([]); // Keep original name for compatibility
    const [current_page, setCurrentPage] = useState(1);
    const [per_page, setPerPage] = useState(20);
    const paginationContainerRef = useRef(null);

    // Load initial data (keep existing functionality)
    useEffect(() => {
        axios.get('/fetch-all-opp')
        .then((response) => {
            const {data, links, current_page, total, per_page, last_page} = response.data;
            setData(data);
            setPagination(links);
            setCurrentPage(current_page); 
            setPerPage(per_page);
        })
        .catch((error) => {
            console.error("Error fetching initial opportunities:", error);
            Toast.fire({
                icon: "error",
                title: 'Error loading opportunities'
            });
        });
    }, []);
    // Handle pagination (keep existing functionality)
    function triggerPagination(url) {
        const container = paginationContainerRef.current;
        const containerPosition = container ? container.getBoundingClientRect().top + window.scrollY : 0;
        setIsLoading(true);
        axios.get(url)
        .then((response) => {
            const {data, links, current_page, total, per_page, last_page} = response.data;
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
            console.error('Pagination error:', error);
            Toast.fire({
                icon: "error",
                title: 'Error loading opportunities'
            });
        })
        .finally(() => {
            setIsLoading(false);
        });
    }

    // Filter change handler (new UI functionality)
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

    // Apply filters (new UI functionality)
    const applyFilters = () => {
        setIsLoading(true);
        // Here you would implement the filtering logic
        // For now, just reload the data
        axios.get('/fetch-all-opp', {
            params: {
                search: searchTerm,
                status: statusFilter,
                category: categoryFilter,
                per_page: perPageFilter
            }
        })
        .then((response) => {
            const {data, links, current_page, per_page} = response.data;
            setData(data);
            setPagination(links);
            setCurrentPage(current_page); 
            setPerPage(per_page);
        })
        .catch((error) => {
            Toast.fire({
                icon: "error",
                title: 'Error applying filters'
            });
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    // Clear filters (new UI functionality)
    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        setCategoryFilter('');
        setPerPageFilter(20);
        // Reload without filters
        window.location.reload();
    };

    // Keep existing toggleStatus function for opportunities functionality
    const toggleStatus = (status) => {
        switch (status) {
            case 'published':
                return <span className='badge rounded-pill text-bg-success'>Published</span>;
            case 'draft':
                return <span className='badge rounded-pill text-bg-secondary'>Draft</span>;
            case 'archived':
                return <span className='badge rounded-pill text-bg-danger'>Archived</span>;
            default:
                return <span className='badge rounded-pill text-bg-danger'>Error</span>;
        }
    }

    // Keep existing initCrud function for opportunities functionality
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
            Toast.fire({
                icon: "error",
                title: 'Ops! something went wrong.'
            });
        })
    }

    // Calculate statistics for opportunities
    const calculateStatistics = () => {
        const total = opp_data.length;
        const published = opp_data.filter(opp => opp.status === 'published').length;
        const draft = opp_data.filter(opp => opp.status === 'draft').length;
        const archived = opp_data.filter(opp => opp.status === 'archived').length;
        const totalViews = opp_data.reduce((sum, opp) => sum + (opp.views || 0), 0);
        
        return {
            total_opportunities: total,
            published_opportunities: published,
            draft_opportunities: draft,
            archived_opportunities: archived,
            total_views: totalViews
        };
    };

    const statistics = calculateStatistics();

    return (
        <>
            <Head title="All Opportunities" />
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
                                <h2 className="poppins-semibold m-0 p-0 py-3">All Opportunities</h2>
                            </div>

                            {/* Statistics Cards */}
                            <Row className="mb-4">
                                <Col md={3} sm={6} className="mb-3">
                                    <Card className="border-0 shadow-sm h-100">
                                        <Card.Body className="text-center">
                                            <Package className="text-primary mb-2" size={32} />
                                            <h4 className="mb-0">{statistics.total_opportunities}</h4>
                                            <small className="text-muted">Total Opportunities</small>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={3} sm={6} className="mb-3">
                                    <Card className="border-0 shadow-sm h-100">
                                        <Card.Body className="text-center">
                                            <TrendingUp className="text-success mb-2" size={32} />
                                            <h4 className="mb-0">{statistics.published_opportunities}</h4>
                                            <small className="text-muted">Published</small>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={3} sm={6} className="mb-3">
                                    <Card className="border-0 shadow-sm h-100">
                                        <Card.Body className="text-center">
                                            <Clock className="text-warning mb-2" size={32} />
                                            <h4 className="mb-0">{statistics.draft_opportunities}</h4>
                                            <small className="text-muted">Draft</small>
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
                                                <Form.Label>Search Opportunities</Form.Label>
                                                <InputGroup>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Search by title, description..."
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
                                                    <option value="published">Published</option>
                                                    <option value="draft">Draft</option>
                                                    <option value="archived">Archived</option>
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
                                                    {/* Categories would be passed as props in real implementation */}
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
                                                    <option value="20">20</option>
                                                    <option value="50">50</option>
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

                            {/* Opportunities Table */}
                            <div className='table table-responsive fs-9'>
                                <table className='table table-bordered table-hover'>
                                    <thead className='table-dark poppins-semibold'>
                                        <tr>
                                            <th scope='col' className='poppins-regular'>#</th>
                                            <th scope='col' className='poppins-regular'>Title</th>
                                            <th scope='col' className='poppins-regular'>Status</th> 
                                            <th scope='col' className='poppins-regular'>Views</th> 
                                            <th scope='col' className='poppins-regular'>Created</th>
                                            <th scope='col' className='poppins-regular'>Updated</th>
                                            <th scope='col' className='poppins-regular'>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {opp_data?.map((oppty, index) => (
                                            <tr key={oppty.id || index}>
                                                <td>{(current_page - 1) * per_page + index + 1}</td>
                                                <td>
                                                    <div>
                                                        <strong>{oppty.title}</strong>
                                                        {oppty.deadline && (
                                                            <div>
                                                                <small className="text-muted">
                                                                    Deadline: {new Date(oppty.deadline).toLocaleDateString()}
                                                                </small>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>{toggleStatus(oppty.status)}</td>
                                                <td>{oppty.views || 0}</td>
                                                <td>{new Date(oppty.created_at).toLocaleDateString()}</td>
                                                <td>{new Date(oppty.updated_at).toLocaleDateString()}</td>
                                                <td className='text-center'>
                                                    <div className="dropdown">
                                                        <button className="btn fs-9" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                            <span className="material-symbols-outlined align-middle">
                                                                more_vert
                                                            </span>
                                                        </button>
                                                        <ul className="dropdown-menu dropdown-menu-dark fs-9">
                                                            <li><Link className="dropdown-item" href={`/admin-edit-opportunity/${oppty.id}`}>Edit</Link></li>
                                                            <li><a className="dropdown-item" href={`/admin-draft-opportunity/${oppty.id}`} onClick={(e) => initCrud(e)}>Draft</a></li>
                                                            <li><a className="dropdown-item" href={`/admin-publish-opportunity/${oppty.id}`} onClick={(e) => initCrud(e)}>Publish</a></li>
                                                            <li><a className="dropdown-item" href={`/admin-archive-opportunity/${oppty.id}`} onClick={(e) => initCrud(e)}>Archive</a></li>
                                                            <li><Link className="dropdown-item" href={`/op/${oppty.id}/${oppty.slug}`}>Preview</Link></li>
                                                            <li><a className="dropdown-item text-danger" href={`/admin-delete-opportunity/${oppty.id}`} onClick={(e) => initCrud(e)}>Delete</a></li>
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