import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col } from 'react-bootstrap';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminSideNav from './Components/SideNav';

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
                            fontSize: '11px',
                            fontWeight: 500,
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em',
                            color: '#86868b',
                            display: 'block',
                        }}>
                            {label}
                        </span>
                        <div style={{
                            marginTop: '10px',
                            fontSize: '32px',
                            fontWeight: 600,
                            color: '#000',
                            lineHeight: 1,
                            letterSpacing: '-0.02em',
                        }}>
                            {value.toLocaleString()}
                        </div>
                    </div>
                    <span style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: '#f5f5f7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.3s ease',
                        transform: hovered ? 'scale(1.08)' : 'scale(1)',
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#000' }}>
                            {icon}
                        </span>
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

export default function AdminUsers({ users, statistics, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(filters.per_page || 10);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        setIsLoading(true);
        router.get(route('admin.users'), {
            search: searchTerm,
            per_page: perPage
        }, {
            preserveState: true,
            onFinish: () => setIsLoading(false)
        });
    };

    const handlePerPageChange = (newPerPage) => {
        setPerPage(newPerPage);
        setIsLoading(true);
        router.get(route('admin.users'), {
            search: searchTerm,
            per_page: newPerPage
        }, {
            preserveState: true,
            onFinish: () => setIsLoading(false)
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setIsLoading(true);
        router.get(route('admin.users'), {}, {
            preserveState: true,
            onFinish: () => setIsLoading(false)
        });
    };

    const isUserOnline = (user) => {
        return user.is_online && user.last_seen_at &&
            new Date() - new Date(user.last_seen_at) < 5 * 60 * 1000;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
        });
    };

    const formatLastSeen = (lastSeen, isOnline) => {
        if (isOnline) return 'Online';
        if (!lastSeen) return 'Never';
        const date = new Date(lastSeen);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    const getInitialColor = (name) => {
        const colors = ['#000', '#374151', '#1e3a5f', '#3f3f46', '#44403c', '#1e293b', '#27272a', '#292524'];
        return colors[name.charCodeAt(0) % colors.length];
    };

    const getDeviceIcon = (deviceType) => {
        switch (deviceType) {
            case 'mobile': return 'smartphone';
            case 'tablet': return 'tablet';
            default: return 'desktop_windows';
        }
    };

    const renderPagination = () => {
        if (!users.links || users.links.length <= 3) return null;

        return (
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '20px',
                flexWrap: 'wrap',
                gap: '12px',
            }}>
                <span style={{ fontSize: '13px', color: '#86868b' }}>
                    Showing {users.from} to {users.to} of {users.total} results
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                    {users.links.map((link, index) => (
                        <button
                            key={index}
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
                            style={{
                                padding: '6px 12px',
                                borderRadius: '8px',
                                border: 'none',
                                background: link.active ? '#000' : '#f5f5f7',
                                color: link.active ? '#fff' : !link.url ? '#d1d1d6' : '#6e6e73',
                                fontSize: '13px',
                                fontWeight: link.active ? 600 : 400,
                                cursor: link.url ? 'pointer' : 'default',
                                transition: 'all 0.15s ease',
                            }}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="All Users - Admin" />

            <Container fluid={true}>
                <Container>
                    <Row className="g-4" style={{ paddingTop: '96px', paddingBottom: '64px' }}>
                        <Col md={3} className="d-none d-md-block">
                            <AdminSideNav />
                        </Col>
                        <Col md={9} xs={12}>
                            {/* Header */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: '32px',
                                flexWrap: 'wrap',
                                gap: '16px',
                            }}>
                                <div>
                                    <h2 style={{
                                        fontSize: 'clamp(24px, 4vw, 28px)',
                                        fontWeight: 600,
                                        color: '#000',
                                        letterSpacing: '-0.02em',
                                        marginBottom: '6px',
                                    }}>
                                        All Users
                                    </h2>
                                    <p style={{ fontSize: '14px', color: '#86868b', margin: 0 }}>
                                        Manage and monitor all platform users
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '8px 18px',
                                            borderRadius: '9999px',
                                            border: '1px solid #e5e5e7',
                                            background: '#fff',
                                            fontSize: '13px',
                                            fontWeight: 500,
                                            color: '#000',
                                            cursor: 'pointer',
                                            transition: 'all 0.15s ease',
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f5f7'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>download</span>
                                        Export
                                    </button>
                                    <button
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '8px 18px',
                                            borderRadius: '9999px',
                                            border: 'none',
                                            background: '#000',
                                            fontSize: '13px',
                                            fontWeight: 500,
                                            color: '#fff',
                                            cursor: 'pointer',
                                            transition: 'all 0.15s ease',
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = '#333'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = '#000'; }}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>mail</span>
                                        Bulk Email
                                    </button>
                                </div>
                            </div>

                            {/* Stat Cards */}
                            <Row className="g-3 mb-4">
                                <StatCard icon="group" label="Total Users" value={statistics.total_users} subtitle="All registered users" />
                                <StatCard icon="radio_button_checked" label="Online Now" value={statistics.online_users} subtitle="Currently active" />
                                <StatCard icon="smartphone" label="Mobile Users" value={statistics.mobile_users} subtitle="Online via mobile" />
                                <StatCard icon="desktop_windows" label="Desktop Users" value={statistics.desktop_users} subtitle="Online via desktop" />
                            </Row>

                            {/* Search & Filters */}
                            <div style={{
                                background: '#fff',
                                border: '1px solid #f0f0f0',
                                borderRadius: '16px',
                                padding: '20px 24px',
                                marginBottom: '20px',
                            }}>
                                <form onSubmit={handleSearch} style={{
                                    display: 'flex',
                                    gap: '12px',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                }}>
                                    <div style={{ flex: '1 1 280px', position: 'relative' }}>
                                        <span className="material-symbols-outlined" style={{
                                            position: 'absolute',
                                            left: '14px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            fontSize: '18px',
                                            color: '#86868b',
                                        }}>
                                            search
                                        </span>
                                        <input
                                            type="text"
                                            placeholder="Search by name, email, or role..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '10px 14px 10px 42px',
                                                borderRadius: '12px',
                                                border: '1px solid #e5e5e7',
                                                fontSize: '14px',
                                                background: '#fff',
                                                color: '#000',
                                                outline: 'none',
                                            }}
                                            onFocus={(e) => e.currentTarget.style.borderColor = '#000'}
                                            onBlur={(e) => e.currentTarget.style.borderColor = '#e5e5e7'}
                                        />
                                    </div>
                                    <select
                                        value={perPage}
                                        onChange={(e) => handlePerPageChange(e.target.value)}
                                        style={{
                                            padding: '10px 14px',
                                            borderRadius: '12px',
                                            border: '1px solid #e5e5e7',
                                            fontSize: '14px',
                                            background: '#fff',
                                            color: '#000',
                                            outline: 'none',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <option value="10">10 per page</option>
                                        <option value="25">25 per page</option>
                                        <option value="50">50 per page</option>
                                        <option value="100">100 per page</option>
                                    </select>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        style={{
                                            padding: '10px 20px',
                                            borderRadius: '9999px',
                                            border: 'none',
                                            background: '#000',
                                            color: '#fff',
                                            fontSize: '13px',
                                            fontWeight: 500,
                                            cursor: isLoading ? 'not-allowed' : 'pointer',
                                            transition: 'all 0.15s ease',
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = '#333'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = '#000'; }}
                                    >
                                        {isLoading ? 'Searching...' : 'Search'}
                                    </button>
                                    {(searchTerm || filters.search) && (
                                        <button
                                            type="button"
                                            onClick={clearFilters}
                                            style={{
                                                padding: '10px 20px',
                                                borderRadius: '9999px',
                                                border: '1px solid #e5e5e7',
                                                background: '#fff',
                                                color: '#6e6e73',
                                                fontSize: '13px',
                                                fontWeight: 500,
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease',
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f5f7'; e.currentTarget.style.color = '#000'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#6e6e73'; }}
                                        >
                                            Clear
                                        </button>
                                    )}
                                </form>
                            </div>

                            {/* Users Table */}
                            <div style={{
                                background: '#fff',
                                border: '1px solid #f0f0f0',
                                borderRadius: '16px',
                                padding: '28px',
                            }}>
                                <div style={{ marginBottom: '20px' }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#000', margin: '0 0 4px' }}>
                                        Users
                                    </h3>
                                    <span style={{ fontSize: '13px', color: '#86868b' }}>
                                        {users.total} total users
                                    </span>
                                </div>

                                {isLoading ? (
                                    <div style={{ textAlign: 'center', padding: '48px 0' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            border: '3px solid #f0f0f0',
                                            borderTopColor: '#000',
                                            borderRadius: '50%',
                                            animation: 'spin 0.8s linear infinite',
                                            margin: '0 auto 12px',
                                        }} />
                                        <span style={{ fontSize: '13px', color: '#86868b' }}>Loading users...</span>
                                    </div>
                                ) : users.data.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                        {/* Header row */}
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: '2fr 2fr 1fr 1fr 80px',
                                            gap: '16px',
                                            padding: '8px 14px',
                                            fontSize: '11px',
                                            fontWeight: 500,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.1em',
                                            color: '#86868b',
                                        }}>
                                            <span>User</span>
                                            <span>Email</span>
                                            <span>Status</span>
                                            <span>Joined</span>
                                            <span>Role</span>
                                        </div>

                                        {users.data.map((user) => {
                                            const online = isUserOnline(user);
                                            return (
                                                <div
                                                    key={user.id}
                                                    style={{
                                                        display: 'grid',
                                                        gridTemplateColumns: '2fr 2fr 1fr 1fr 80px',
                                                        gap: '16px',
                                                        padding: '12px 14px',
                                                        borderRadius: '12px',
                                                        alignItems: 'center',
                                                        transition: 'background 0.15s ease',
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                >
                                                    {/* User */}
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                                                        <div style={{ position: 'relative', flexShrink: 0 }}>
                                                            <div style={{
                                                                width: '36px',
                                                                height: '36px',
                                                                borderRadius: '50%',
                                                                background: getInitialColor(user.name),
                                                                color: '#fff',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: '13px',
                                                                fontWeight: 600,
                                                            }}>
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            {online && (
                                                                <span style={{
                                                                    position: 'absolute',
                                                                    bottom: '0',
                                                                    right: '0',
                                                                    width: '10px',
                                                                    height: '10px',
                                                                    borderRadius: '50%',
                                                                    background: '#16a34a',
                                                                    border: '2px solid #fff',
                                                                }} />
                                                            )}
                                                        </div>
                                                        <div style={{ minWidth: 0 }}>
                                                            <div style={{
                                                                fontSize: '14px',
                                                                fontWeight: 500,
                                                                color: '#000',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                            }}>
                                                                {user.name}
                                                            </div>
                                                            {user.device_type && (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                                                    <span className="material-symbols-outlined" style={{ fontSize: '12px', color: '#b0b0b5' }}>
                                                                        {getDeviceIcon(user.device_type)}
                                                                    </span>
                                                                    <span style={{ fontSize: '11px', color: '#b0b0b5' }}>
                                                                        {user.operating_system || user.device_type}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Email */}
                                                    <span style={{
                                                        fontSize: '13px',
                                                        color: '#86868b',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}>
                                                        {user.email}
                                                    </span>

                                                    {/* Status */}
                                                    <div>
                                                        <span style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '4px',
                                                            fontSize: '12px',
                                                            fontWeight: 500,
                                                            color: online ? '#16a34a' : '#86868b',
                                                            background: online ? '#f0fdf4' : '#f5f5f7',
                                                            padding: '3px 10px',
                                                            borderRadius: '9999px',
                                                        }}>
                                                            <span style={{
                                                                width: '5px',
                                                                height: '5px',
                                                                borderRadius: '50%',
                                                                background: online ? '#16a34a' : '#d1d1d6',
                                                            }} />
                                                            {formatLastSeen(user.last_seen_at, online)}
                                                        </span>
                                                    </div>

                                                    {/* Joined */}
                                                    <span style={{ fontSize: '13px', color: '#86868b' }}>
                                                        {formatDate(user.created_at)}
                                                    </span>

                                                    {/* Role */}
                                                    <span style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        fontSize: '12px',
                                                        fontWeight: 500,
                                                        color: user.role === 'admin' ? '#dc2626' : '#000',
                                                        background: user.role === 'admin' ? '#fef2f2' : '#f5f5f7',
                                                        padding: '3px 10px',
                                                        borderRadius: '9999px',
                                                        textTransform: 'capitalize',
                                                        width: 'fit-content',
                                                    }}>
                                                        {user.role}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '48px 0' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#d1d1d6', marginBottom: '12px', display: 'block' }}>
                                            group_off
                                        </span>
                                        <h5 style={{ fontSize: '16px', fontWeight: 600, color: '#000', marginBottom: '4px' }}>
                                            No users found
                                        </h5>
                                        <p style={{ fontSize: '13px', color: '#86868b', margin: 0 }}>
                                            Try adjusting your search criteria.
                                        </p>
                                    </div>
                                )}

                                {/* Pagination */}
                                {renderPagination()}
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
    );
}
