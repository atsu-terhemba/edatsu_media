import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import { Head, Link } from '@inertiajs/react';
import AdminSideNav from './Components/SideNav';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import { Toast } from '@/utils/Index';
import DefaultPagination from '@/Components/DefaultPagination';

function StatCard({ icon, label, value, subtitle }) {
    const [hovered, setHovered] = useState(false);
    return (
        <Col md={6} lg={3}>
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    padding: '24px',
                    borderRadius: '16px',
                    background: '#fff',
                    border: `1px solid ${hovered ? '#e0e0e0' : '#f0f0f0'}`,
                    height: '100%',
                    transition: 'all 0.3s ease',
                    transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
                    boxShadow: hovered ? '0 8px 30px rgba(0,0,0,0.06)' : 'none',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                        <span style={{
                            fontSize: '11px', fontWeight: 500, textTransform: 'uppercase',
                            letterSpacing: '0.15em', color: '#86868b', display: 'block',
                        }}>{label}</span>
                        <div style={{
                            marginTop: '10px', fontSize: '32px', fontWeight: 600,
                            color: '#000', lineHeight: 1, letterSpacing: '-0.02em',
                        }}>{typeof value === 'number' ? value.toLocaleString() : value}</div>
                    </div>
                    <span style={{
                        width: '44px', height: '44px', borderRadius: '50%', background: '#f5f5f7',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'transform 0.3s ease', transform: hovered ? 'scale(1.08)' : 'scale(1)',
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#000' }}>{icon}</span>
                    </span>
                </div>
                {subtitle && (
                    <div style={{ marginTop: '12px' }}>
                        <span style={{ fontSize: '12px', color: '#86868b' }}>{subtitle}</span>
                    </div>
                )}
            </div>
        </Col>
    );
}

export default function AllProducts({ products, statistics, categories, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [categoryFilter, setCategoryFilter] = useState(filters.category || '');
    const [perPageFilter, setPerPageFilter] = useState(filters.per_page || 12);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState([]);
    const [productData, setProductData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(12);
    const paginationContainerRef = useRef(null);

    useEffect(() => {
        axios.get('/fetch-all-products')
            .then((response) => {
                const { data, links, current_page, per_page } = response.data;
                setProductData(data);
                setPagination(links);
                setCurrentPage(current_page);
                setPerPage(per_page);
            })
            .catch(() => {
                Toast.fire({ icon: "error", title: 'Error loading products' });
            });
    }, []);

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
                    window.scrollTo({ top: containerPosition, behavior: 'instant' });
                }, 100);
            })
            .catch(() => {
                Toast.fire({ icon: "error", title: 'Error loading products' });
            })
            .finally(() => setIsLoading(false));
    }

    const isProductDeleted = (product) => product.deleted == 1 || product.deleted_at;

    const handleDelete = (e, productId) => {
        e.preventDefault();
        if (!confirm('Are you sure you want to delete this product?')) return;
        axios.get(`/admin-delete-product/${productId}`)
            .then((res) => {
                if (res.data.status === 'success') {
                    Toast.fire({ icon: "success", title: res.data.message });
                    setProductData(prev => prev.map(p =>
                        p.id === productId ? { ...p, deleted: 1, deleted_at: new Date().toISOString() } : p
                    ));
                }
            })
            .catch(() => {
                Toast.fire({ icon: "error", title: 'Something went wrong.' });
            });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
        });
    };

    const getInitialColor = (name) => {
        if (!name) return '#000';
        const colors = ['#000', '#374151', '#1e3a5f', '#3f3f46', '#44403c', '#1e293b', '#27272a', '#292524'];
        return colors[name.charCodeAt(0) % colors.length];
    };

    return (
        <>
            <Head title="All Products" />
            <AuthenticatedLayout>
                <Container fluid={true}>
                    <Container>
                        <Row className="g-4" style={{ paddingTop: '96px', paddingBottom: '64px' }}>
                            <Col md={3} className="d-none d-md-block">
                                <AdminSideNav />
                            </Col>
                            <Col md={9} xs={12}>
                                {/* Header */}
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                                    marginBottom: '32px', flexWrap: 'wrap', gap: '16px',
                                }}>
                                    <div>
                                        <h2 style={{
                                            fontSize: 'clamp(24px, 4vw, 28px)', fontWeight: 600,
                                            color: '#000', letterSpacing: '-0.02em', marginBottom: '6px',
                                        }}>All Products</h2>
                                        <p style={{ fontSize: '14px', color: '#86868b', margin: 0 }}>
                                            Manage all toolshed products
                                        </p>
                                    </div>
                                    <Link
                                        href={route('admin.products')}
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                                            padding: '8px 18px', borderRadius: '9999px', border: 'none',
                                            background: '#000', fontSize: '13px', fontWeight: 500,
                                            color: '#fff', textDecoration: 'none', transition: 'all 0.15s ease',
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#333'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = '#000'}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
                                        New Product
                                    </Link>
                                </div>

                                {/* Stat Cards */}
                                <Row className="g-3 mb-4">
                                    <StatCard icon="inventory_2" label="Total" value={statistics.total_products} subtitle="All products" />
                                    <StatCard icon="check_circle" label="Active" value={statistics.active_products} subtitle="Published" />
                                    <StatCard icon="delete" label="Deleted" value={statistics.deleted_products} subtitle="Removed" />
                                    <StatCard icon="visibility" label="Views" value={statistics.total_views} subtitle="Total views" />
                                </Row>

                                {/* Filters */}
                                <div style={{
                                    background: '#fff', border: '1px solid #f0f0f0',
                                    borderRadius: '16px', padding: '20px 24px', marginBottom: '20px',
                                }}>
                                    <div style={{
                                        display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap',
                                    }}>
                                        <div style={{ flex: '1 1 220px', position: 'relative' }}>
                                            <span className="material-symbols-outlined" style={{
                                                position: 'absolute', left: '14px', top: '50%',
                                                transform: 'translateY(-50%)', fontSize: '18px', color: '#86868b',
                                            }}>search</span>
                                            <input
                                                type="text"
                                                placeholder="Search products..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                style={{
                                                    width: '100%', padding: '10px 14px 10px 42px',
                                                    borderRadius: '12px', border: '1px solid #e5e5e7',
                                                    fontSize: '14px', background: '#fff', color: '#000', outline: 'none',
                                                }}
                                                onFocus={(e) => e.currentTarget.style.borderColor = '#000'}
                                                onBlur={(e) => e.currentTarget.style.borderColor = '#e5e5e7'}
                                            />
                                        </div>
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            style={{
                                                padding: '10px 14px', borderRadius: '12px',
                                                border: '1px solid #e5e5e7', fontSize: '14px',
                                                background: '#fff', color: '#000', outline: 'none', cursor: 'pointer',
                                            }}
                                        >
                                            <option value="">All Status</option>
                                            <option value="active">Active</option>
                                            <option value="deleted">Deleted</option>
                                        </select>
                                        <select
                                            value={categoryFilter}
                                            onChange={(e) => setCategoryFilter(e.target.value)}
                                            style={{
                                                padding: '10px 14px', borderRadius: '12px',
                                                border: '1px solid #e5e5e7', fontSize: '14px',
                                                background: '#fff', color: '#000', outline: 'none', cursor: 'pointer',
                                            }}
                                        >
                                            <option value="">All Categories</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={perPageFilter}
                                            onChange={(e) => setPerPageFilter(e.target.value)}
                                            style={{
                                                padding: '10px 14px', borderRadius: '12px',
                                                border: '1px solid #e5e5e7', fontSize: '14px',
                                                background: '#fff', color: '#000', outline: 'none', cursor: 'pointer',
                                            }}
                                        >
                                            <option value="12">12 per page</option>
                                            <option value="24">24 per page</option>
                                            <option value="48">48 per page</option>
                                            <option value="100">100 per page</option>
                                        </select>
                                        {(searchTerm || statusFilter || categoryFilter) && (
                                            <button
                                                onClick={() => {
                                                    setSearchTerm(''); setStatusFilter(''); setCategoryFilter('');
                                                    setPerPageFilter(12);
                                                    axios.get('/fetch-all-products').then((response) => {
                                                        const { data, links, current_page, per_page } = response.data;
                                                        setProductData(data); setPagination(links);
                                                        setCurrentPage(current_page); setPerPage(per_page);
                                                    });
                                                }}
                                                style={{
                                                    padding: '10px 20px', borderRadius: '9999px',
                                                    border: '1px solid #e5e5e7', background: '#fff',
                                                    color: '#6e6e73', fontSize: '13px', fontWeight: 500,
                                                    cursor: 'pointer', transition: 'all 0.15s ease',
                                                }}
                                                onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f5f7'; e.currentTarget.style.color = '#000'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#6e6e73'; }}
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Products Table */}
                                <div style={{
                                    background: '#fff', border: '1px solid #f0f0f0',
                                    borderRadius: '16px', padding: '28px',
                                }}>
                                    <div style={{ marginBottom: '20px' }}>
                                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#000', margin: '0 0 4px' }}>
                                            Products
                                        </h3>
                                        <span style={{ fontSize: '13px', color: '#86868b' }}>
                                            {productData.length} products on this page
                                        </span>
                                    </div>

                                    {isLoading ? (
                                        <div style={{ textAlign: 'center', padding: '48px 0' }}>
                                            <div style={{
                                                width: '32px', height: '32px',
                                                border: '3px solid #f0f0f0', borderTopColor: '#000',
                                                borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                                                margin: '0 auto 12px',
                                            }} />
                                            <span style={{ fontSize: '13px', color: '#86868b' }}>Loading...</span>
                                        </div>
                                    ) : productData.length > 0 ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                            {/* Header row */}
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: '40px 2fr 1fr 80px 1fr 100px',
                                                gap: '12px', padding: '8px 14px',
                                                fontSize: '11px', fontWeight: 500, textTransform: 'uppercase',
                                                letterSpacing: '0.1em', color: '#86868b',
                                            }}>
                                                <span>#</span>
                                                <span>Product</span>
                                                <span>Author</span>
                                                <span>Views</span>
                                                <span>Created</span>
                                                <span style={{ textAlign: 'right' }}>Actions</span>
                                            </div>

                                            {productData.map((product, index) => {
                                                const deleted = isProductDeleted(product);
                                                return (
                                                    <div
                                                        key={product.id}
                                                        style={{
                                                            display: 'grid',
                                                            gridTemplateColumns: '40px 2fr 1fr 80px 1fr 100px',
                                                            gap: '12px', padding: '12px 14px',
                                                            borderRadius: '12px', alignItems: 'center',
                                                            transition: 'background 0.15s ease',
                                                            opacity: deleted ? 0.5 : 1,
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                    >
                                                        {/* # */}
                                                        <span style={{ fontSize: '13px', color: '#86868b' }}>
                                                            {(currentPage - 1) * perPage + index + 1}
                                                        </span>

                                                        {/* Product Name + Status */}
                                                        <div style={{ minWidth: 0 }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <span style={{
                                                                    fontSize: '14px', fontWeight: 500, color: '#000',
                                                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                                }}>
                                                                    {product.product_name}
                                                                </span>
                                                                <span style={{
                                                                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                                    fontSize: '11px', fontWeight: 500, flexShrink: 0,
                                                                    color: deleted ? '#dc2626' : '#16a34a',
                                                                    background: deleted ? '#fef2f2' : '#f0fdf4',
                                                                    padding: '2px 8px', borderRadius: '9999px',
                                                                }}>
                                                                    <span style={{
                                                                        width: '5px', height: '5px', borderRadius: '50%',
                                                                        background: deleted ? '#dc2626' : '#16a34a',
                                                                    }} />
                                                                    {deleted ? 'Deleted' : 'Active'}
                                                                </span>
                                                            </div>
                                                            {product.categories && (
                                                                <span style={{ fontSize: '12px', color: '#b0b0b5' }}>
                                                                    {product.categories.split(',').slice(0, 2).join(', ')}
                                                                    {product.categories.split(',').length > 2 && '...'}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Author */}
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                                                            <div style={{
                                                                width: '28px', height: '28px', borderRadius: '50%',
                                                                background: getInitialColor(product.user_name || 'U'),
                                                                color: '#fff', display: 'flex', alignItems: 'center',
                                                                justifyContent: 'center', fontSize: '11px', fontWeight: 600, flexShrink: 0,
                                                            }}>
                                                                {(product.user_name || 'U').charAt(0).toUpperCase()}
                                                            </div>
                                                            <span style={{
                                                                fontSize: '13px', color: '#86868b',
                                                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                            }}>
                                                                {product.user_name || 'Unknown'}
                                                            </span>
                                                        </div>

                                                        {/* Views */}
                                                        <span style={{ fontSize: '13px', color: '#86868b' }}>
                                                            {(product.views || 0).toLocaleString()}
                                                        </span>

                                                        {/* Created */}
                                                        <span style={{ fontSize: '13px', color: '#86868b' }}>
                                                            {formatDate(product.created_at)}
                                                        </span>

                                                        {/* Actions */}
                                                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                                                            {/* Preview */}
                                                            <Link
                                                                href={`/ts/${product.id}/${product.slug}`}
                                                                style={{
                                                                    width: '32px', height: '32px', borderRadius: '8px',
                                                                    background: '#f5f5f7', display: 'flex',
                                                                    alignItems: 'center', justifyContent: 'center',
                                                                    textDecoration: 'none', transition: 'all 0.15s ease',
                                                                }}
                                                                title="Preview"
                                                                onMouseEnter={(e) => e.currentTarget.style.background = '#e5e5e7'}
                                                                onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f7'}
                                                            >
                                                                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#6e6e73' }}>visibility</span>
                                                            </Link>
                                                            {/* Edit */}
                                                            <Link
                                                                href={`/admin-edit-product/${product.id}`}
                                                                style={{
                                                                    width: '32px', height: '32px', borderRadius: '8px',
                                                                    background: '#f5f5f7', display: 'flex',
                                                                    alignItems: 'center', justifyContent: 'center',
                                                                    textDecoration: 'none', transition: 'all 0.15s ease',
                                                                }}
                                                                title="Edit"
                                                                onMouseEnter={(e) => e.currentTarget.style.background = '#e5e5e7'}
                                                                onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f7'}
                                                            >
                                                                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#6e6e73' }}>edit</span>
                                                            </Link>
                                                            {/* Delete */}
                                                            {!deleted && (
                                                                <button
                                                                    onClick={(e) => handleDelete(e, product.id)}
                                                                    style={{
                                                                        width: '32px', height: '32px', borderRadius: '8px',
                                                                        background: '#fef2f2', display: 'flex',
                                                                        alignItems: 'center', justifyContent: 'center',
                                                                        border: 'none', cursor: 'pointer',
                                                                        transition: 'all 0.15s ease',
                                                                    }}
                                                                    title="Delete"
                                                                    onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
                                                                    onMouseLeave={(e) => e.currentTarget.style.background = '#fef2f2'}
                                                                >
                                                                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#dc2626' }}>delete</span>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '48px 0' }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#d1d1d6', display: 'block', marginBottom: '12px' }}>
                                                inventory_2
                                            </span>
                                            <h5 style={{ fontSize: '16px', fontWeight: 600, color: '#000', marginBottom: '4px' }}>
                                                No products found
                                            </h5>
                                            <p style={{ fontSize: '13px', color: '#86868b', margin: 0 }}>
                                                Try adjusting your filters or create a new product.
                                            </p>
                                        </div>
                                    )}

                                    {/* Pagination */}
                                    {pagination.length > 0 && (
                                        <div ref={paginationContainerRef} style={{ marginTop: '20px' }}>
                                            <DefaultPagination
                                                pagination={pagination}
                                                triggerPagination={triggerPagination}
                                            />
                                        </div>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Container>

                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </AuthenticatedLayout>
        </>
    );
}
