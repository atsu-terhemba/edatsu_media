import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import AdminSideNav from './Components/SideNav';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import DefaultPagination from '@/Components/DefaultPagination';
import { Toast } from '@/utils/Index';

function StatCard({ icon, label, value, subtitle }) {
    const [hovered, setHovered] = useState(false);
    return (
        <Col md={6} lg={3}>
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    padding: '24px', borderRadius: '16px', background: '#fff',
                    border: `1px solid ${hovered ? '#e0e0e0' : '#f0f0f0'}`,
                    height: '100%', transition: 'all 0.3s ease',
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

const statusConfig = {
    published: { color: '#16a34a', bg: '#f0fdf4', label: 'Published' },
    draft: { color: '#6e6e73', bg: '#f5f5f7', label: 'Draft' },
    archived: { color: '#dc2626', bg: '#fef2f2', label: 'Archived' },
};

export default function AllOppty() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [perPageFilter, setPerPageFilter] = useState(20);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState([]);
    const [oppData, setOppData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const paginationContainerRef = useRef(null);

    useEffect(() => {
        axios.get('/fetch-all-opp')
            .then((response) => {
                const { data, links, current_page, per_page } = response.data;
                setOppData(data);
                setPagination(links);
                setCurrentPage(current_page);
                setPerPage(per_page);
            })
            .catch(() => {
                Toast.fire({ icon: "error", title: 'Error loading opportunities' });
            });
    }, []);

    function triggerPagination(url) {
        const container = paginationContainerRef.current;
        const containerPosition = container ? container.getBoundingClientRect().top + window.scrollY : 0;
        setIsLoading(true);
        axios.get(url)
            .then((response) => {
                const { data, links, current_page, per_page } = response.data;
                setOppData(data);
                setPagination(links);
                setCurrentPage(current_page);
                setPerPage(per_page);
                setTimeout(() => {
                    window.scrollTo({ top: containerPosition, behavior: 'instant' });
                }, 100);
            })
            .catch(() => {
                Toast.fire({ icon: "error", title: 'Error loading opportunities' });
            })
            .finally(() => setIsLoading(false));
    }

    const handleStatusChange = (oppId, action) => {
        axios.post(`/${action}/${oppId}`)
            .then((res) => {
                if (res.data.status === 'success') {
                    Toast.fire({ icon: "success", title: res.data.message });
                    setOppData(prev => prev.map(o =>
                        o.id === oppId ? { ...o, status: action === 'publish' ? 'published' : action } : o
                    ));
                }
            })
            .catch(() => {
                Toast.fire({ icon: "error", title: 'Something went wrong.' });
            });
    };

    const handleDelete = (e, oppId) => {
        e.preventDefault();
        if (!confirm('Are you sure you want to delete this opportunity?')) return;
        axios.get(`/admin-delete-opportunity/${oppId}`)
            .then((res) => {
                if (res.data.status === 'success') {
                    Toast.fire({ icon: "success", title: res.data.message });
                    setOppData(prev => prev.map(o =>
                        o.id === oppId ? { ...o, status: 'archived', deleted_at: new Date().toISOString() } : o
                    ));
                }
            })
            .catch(() => {
                Toast.fire({ icon: "error", title: 'Something went wrong.' });
            });
    };

    const statistics = {
        total: oppData.length,
        published: oppData.filter(o => o.status === 'published').length,
        draft: oppData.filter(o => o.status === 'draft').length,
        views: oppData.reduce((sum, o) => sum + (o.views || 0), 0),
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
        });
    };

    return (
        <>
            <Head title="All Opportunities" />
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
                                        }}>All Opportunities</h2>
                                        <p style={{ fontSize: '14px', color: '#86868b', margin: 0 }}>
                                            Manage all posted opportunities
                                        </p>
                                    </div>
                                    <Link
                                        href={route('admin.opp')}
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
                                        New Opportunity
                                    </Link>
                                </div>

                                {/* Stat Cards */}
                                <Row className="g-3 mb-4">
                                    <StatCard icon="work" label="Total" value={statistics.total} subtitle="All opportunities" />
                                    <StatCard icon="check_circle" label="Published" value={statistics.published} subtitle="Live posts" />
                                    <StatCard icon="edit_note" label="Draft" value={statistics.draft} subtitle="Unpublished" />
                                    <StatCard icon="visibility" label="Views" value={statistics.views} subtitle="Total views" />
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
                                                placeholder="Search opportunities..."
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
                                            <option value="published">Published</option>
                                            <option value="draft">Draft</option>
                                            <option value="archived">Archived</option>
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
                                            <option value="20">20 per page</option>
                                            <option value="50">50 per page</option>
                                            <option value="100">100 per page</option>
                                        </select>
                                        {(searchTerm || statusFilter) && (
                                            <button
                                                onClick={() => {
                                                    setSearchTerm(''); setStatusFilter(''); setPerPageFilter(20);
                                                    axios.get('/fetch-all-opp').then((response) => {
                                                        const { data, links, current_page, per_page } = response.data;
                                                        setOppData(data); setPagination(links);
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

                                {/* Opportunities Table */}
                                <div style={{
                                    background: '#fff', border: '1px solid #f0f0f0',
                                    borderRadius: '16px', padding: '28px',
                                }}>
                                    <div style={{ marginBottom: '20px' }}>
                                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#000', margin: '0 0 4px' }}>
                                            Opportunities
                                        </h3>
                                        <span style={{ fontSize: '13px', color: '#86868b' }}>
                                            {oppData.length} opportunities on this page
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
                                    ) : oppData.length > 0 ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                            {/* Header row */}
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: '40px 2.5fr 90px 70px 1fr 140px',
                                                gap: '12px', padding: '8px 14px',
                                                fontSize: '11px', fontWeight: 500, textTransform: 'uppercase',
                                                letterSpacing: '0.1em', color: '#86868b',
                                            }}>
                                                <span>#</span>
                                                <span>Title</span>
                                                <span>Status</span>
                                                <span>Views</span>
                                                <span>Created</span>
                                                <span style={{ textAlign: 'right' }}>Actions</span>
                                            </div>

                                            {oppData.map((opp, index) => {
                                                const cfg = statusConfig[opp.status] || statusConfig.archived;
                                                return (
                                                    <div
                                                        key={opp.id || index}
                                                        style={{
                                                            display: 'grid',
                                                            gridTemplateColumns: '40px 2.5fr 90px 70px 1fr 140px',
                                                            gap: '12px', padding: '12px 14px',
                                                            borderRadius: '12px', alignItems: 'center',
                                                            transition: 'background 0.15s ease',
                                                            opacity: opp.status === 'archived' ? 0.6 : 1,
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                    >
                                                        {/* # */}
                                                        <span style={{ fontSize: '13px', color: '#86868b' }}>
                                                            {(currentPage - 1) * perPage + index + 1}
                                                        </span>

                                                        {/* Title + Deadline */}
                                                        <div style={{ minWidth: 0 }}>
                                                            <span style={{
                                                                fontSize: '14px', fontWeight: 500, color: '#000',
                                                                overflow: 'hidden', textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap', display: 'block',
                                                            }}>
                                                                {opp.title}
                                                            </span>
                                                            {opp.deadline && (
                                                                <span style={{ fontSize: '12px', color: '#b0b0b5', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                                                    <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>schedule</span>
                                                                    Deadline: {formatDate(opp.deadline)}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Status */}
                                                        <div>
                                                            <span style={{
                                                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                                fontSize: '11px', fontWeight: 500,
                                                                color: cfg.color, background: cfg.bg,
                                                                padding: '3px 10px', borderRadius: '9999px',
                                                            }}>
                                                                <span style={{
                                                                    width: '5px', height: '5px', borderRadius: '50%',
                                                                    background: cfg.color,
                                                                }} />
                                                                {cfg.label}
                                                            </span>
                                                        </div>

                                                        {/* Views */}
                                                        <span style={{ fontSize: '13px', color: '#86868b' }}>
                                                            {(opp.views || 0).toLocaleString()}
                                                        </span>

                                                        {/* Created */}
                                                        <span style={{ fontSize: '13px', color: '#86868b' }}>
                                                            {formatDate(opp.created_at)}
                                                        </span>

                                                        {/* Actions */}
                                                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                                                            {/* Preview */}
                                                            <Link
                                                                href={`/op/${opp.id}/${opp.slug}`}
                                                                style={{
                                                                    width: '30px', height: '30px', borderRadius: '8px',
                                                                    background: '#f5f5f7', display: 'flex',
                                                                    alignItems: 'center', justifyContent: 'center',
                                                                    textDecoration: 'none', transition: 'all 0.15s ease',
                                                                }}
                                                                title="Preview"
                                                                onMouseEnter={(e) => e.currentTarget.style.background = '#e5e5e7'}
                                                                onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f7'}
                                                            >
                                                                <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#6e6e73' }}>visibility</span>
                                                            </Link>
                                                            {/* Edit */}
                                                            <Link
                                                                href={`/admin-edit-opportunity/${opp.id}`}
                                                                style={{
                                                                    width: '30px', height: '30px', borderRadius: '8px',
                                                                    background: '#f5f5f7', display: 'flex',
                                                                    alignItems: 'center', justifyContent: 'center',
                                                                    textDecoration: 'none', transition: 'all 0.15s ease',
                                                                }}
                                                                title="Edit"
                                                                onMouseEnter={(e) => e.currentTarget.style.background = '#e5e5e7'}
                                                                onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f7'}
                                                            >
                                                                <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#6e6e73' }}>edit</span>
                                                            </Link>
                                                            {/* Status Toggle */}
                                                            {opp.status === 'draft' && (
                                                                <button
                                                                    onClick={() => handleStatusChange(opp.id, 'publish')}
                                                                    style={{
                                                                        width: '30px', height: '30px', borderRadius: '8px',
                                                                        background: '#f0fdf4', display: 'flex',
                                                                        alignItems: 'center', justifyContent: 'center',
                                                                        border: 'none', cursor: 'pointer', transition: 'all 0.15s ease',
                                                                    }}
                                                                    title="Publish"
                                                                    onMouseEnter={(e) => e.currentTarget.style.background = '#bbf7d0'}
                                                                    onMouseLeave={(e) => e.currentTarget.style.background = '#f0fdf4'}
                                                                >
                                                                    <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#16a34a' }}>publish</span>
                                                                </button>
                                                            )}
                                                            {opp.status === 'published' && (
                                                                <button
                                                                    onClick={() => handleStatusChange(opp.id, 'draft')}
                                                                    style={{
                                                                        width: '30px', height: '30px', borderRadius: '8px',
                                                                        background: '#f5f5f7', display: 'flex',
                                                                        alignItems: 'center', justifyContent: 'center',
                                                                        border: 'none', cursor: 'pointer', transition: 'all 0.15s ease',
                                                                    }}
                                                                    title="Move to Draft"
                                                                    onMouseEnter={(e) => e.currentTarget.style.background = '#e5e5e7'}
                                                                    onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f7'}
                                                                >
                                                                    <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#6e6e73' }}>unpublished</span>
                                                                </button>
                                                            )}
                                                            {/* Delete */}
                                                            {opp.status !== 'archived' && (
                                                                <button
                                                                    onClick={(e) => handleDelete(e, opp.id)}
                                                                    style={{
                                                                        width: '30px', height: '30px', borderRadius: '8px',
                                                                        background: '#fef2f2', display: 'flex',
                                                                        alignItems: 'center', justifyContent: 'center',
                                                                        border: 'none', cursor: 'pointer', transition: 'all 0.15s ease',
                                                                    }}
                                                                    title="Delete"
                                                                    onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
                                                                    onMouseLeave={(e) => e.currentTarget.style.background = '#fef2f2'}
                                                                >
                                                                    <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#dc2626' }}>delete</span>
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
                                                work_off
                                            </span>
                                            <h5 style={{ fontSize: '16px', fontWeight: 600, color: '#000', marginBottom: '4px' }}>
                                                No opportunities found
                                            </h5>
                                            <p style={{ fontSize: '13px', color: '#86868b', margin: 0 }}>
                                                Try adjusting your filters or create a new opportunity.
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
