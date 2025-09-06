import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col, Card, Badge, Button, Form, InputGroup, Table, Pagination, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AdminSideNav from './Components/SideNav';
import { 
    Users, UserPlus, Search, Filter, Eye, Edit, Trash2, Download, Mail,
    Smartphone, Monitor, Tablet, Wifi, WifiOff, Chrome, Globe, Clock,
    MapPin, Activity
} from 'lucide-react';

export default function AdminUsers({ users, statistics, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(filters.per_page || 10);
    const [isLoading, setIsLoading] = useState(false);

    // Handle search
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

    // Handle per page change
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

    // Clear filters
    const clearFilters = () => {
        setSearchTerm('');
        setIsLoading(true);
        router.get(route('admin.users'), {}, {
            preserveState: true,
            onFinish: () => setIsLoading(false)
        });
    };

    // Get device icon
    const getDeviceIcon = (deviceType) => {
        switch (deviceType) {
            case 'mobile':
                return <Smartphone size={16} />;
            case 'tablet':
                return <Tablet size={16} />;
            case 'desktop':
            default:
                return <Monitor size={16} />;
        }
    };

    // Get browser icon (simplified)
    const getBrowserIcon = (browser) => {
        return <Globe size={14} />;
    };

    // Format last seen
    const formatLastSeen = (lastSeen, isOnline) => {
        if (isOnline) {
            return <Badge bg="success" className="d-flex align-items-center gap-1">
                <Wifi size={12} />
                Online
            </Badge>;
        }
        
        if (!lastSeen) {
            return <Badge bg="secondary">Never</Badge>;
        }

        const date = new Date(lastSeen);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 60) {
            return <Badge bg="warning">{diffInMinutes}m ago</Badge>;
        } else if (diffInMinutes < 1440) {
            return <Badge bg="info">{Math.floor(diffInMinutes / 60)}h ago</Badge>;
        } else {
            return <Badge bg="secondary">{Math.floor(diffInMinutes / 1440)}d ago</Badge>;
        }
    };

    // Check if user is online
    const isUserOnline = (user) => {
        return user.is_online && user.last_seen_at && 
               new Date() - new Date(user.last_seen_at) < 5 * 60 * 1000; // 5 minutes
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get user avatar initials
    const getUserInitials = (name) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Get role badge variant
    const getRoleBadgeVariant = (role) => {
        switch (role) {
            case 'admin':
                return 'danger';
            case 'subscriber':
                return 'primary';
            default:
                return 'secondary';
        }
    };

    // Statistics cards
    const StatCard = ({ icon: Icon, title, value, color, subtitle }) => (
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
        if (!users.links || users.links.length <= 3) return null;

        return (
            <div className="d-flex justify-content-between align-items-center mt-4">
                <div className="text-muted">
                    Showing {users.from} to {users.to} of {users.total} results
                </div>
                <Pagination className="mb-0">
                    {users.links.map((link, index) => (
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
            <Head title="All Users - Admin" />

            <div className="users-page">
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
                                        <h1 className="poppins-bold mb-2">All Users</h1>
                                        <p className="text-muted">Manage and monitor all platform users</p>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <Button variant="outline-success" size="sm">
                                            <Download size={16} className="me-1" />
                                            Export
                                        </Button>
                                        <Button variant="primary" size="sm">
                                            <Mail size={16} className="me-1" />
                                            Bulk Email
                                        </Button>
                                    </div>
                                </div>

                                {/* Statistics Cards */}
                                <Row className="mb-4">
                                    <Col lg={3} md={6} className="mb-3">
                                        <StatCard
                                            icon={Users}
                                            title="Total Users"
                                            value={statistics.total_users}
                                            color="primary"
                                            subtitle="All registered users"
                                        />
                                    </Col>
                                    <Col lg={3} md={6} className="mb-3">
                                        <StatCard
                                            icon={Activity}
                                            title="Online Now"
                                            value={statistics.online_users}
                                            color="success"
                                            subtitle="Currently active"
                                        />
                                    </Col>
                                    <Col lg={3} md={6} className="mb-3">
                                        <StatCard
                                            icon={Smartphone}
                                            title="Mobile Users"
                                            value={statistics.mobile_users}
                                            color="info"
                                            subtitle="Online via mobile"
                                        />
                                    </Col>
                                    <Col lg={3} md={6} className="mb-3">
                                        <StatCard
                                            icon={Monitor}
                                            title="Desktop Users"
                                            value={statistics.desktop_users}
                                            color="warning"
                                            subtitle="Online via desktop"
                                        />
                                    </Col>
                                </Row>

                                {/* Filters and Search */}
                                <Card className="border-0 shadow-sm mb-4">
                                    <Card.Body>
                                        <Row className="align-items-end">
                                            <Col md={6}>
                                                <Form onSubmit={handleSearch}>
                                                    <InputGroup>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Search by name, email, or role..."
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
                                            <Col md={3}>
                                                <Form.Select
                                                    value={perPage}
                                                    onChange={(e) => handlePerPageChange(e.target.value)}
                                                >
                                                    <option value="10">10 per page</option>
                                                    <option value="25">25 per page</option>
                                                    <option value="50">50 per page</option>
                                                    <option value="100">100 per page</option>
                                                </Form.Select>
                                            </Col>
                                            <Col md={3}>
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

                                {/* Users Table */}
                                <Card className="border-0 shadow-sm">
                                    <Card.Body className="p-0">
                                        <div className="table-responsive">
                                            <Table className="table-hover mb-0">
                                                <thead>
                                                    <tr>
                                                        <th className="border-0 text-muted fw-normal px-4 py-3">User</th>
                                                        <th className="border-0 text-muted fw-normal py-3">Email</th>
                                                        <th className="border-0 text-muted fw-normal py-3">Status</th>
                                                        <th className="border-0 text-muted fw-normal py-3">Device</th>
                                                        <th className="border-0 text-muted fw-normal py-3">Last Seen</th>
                                                        <th className="border-0 text-muted fw-normal py-3">Role</th>
                                                        <th className="border-0 text-muted fw-normal py-3">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {isLoading ? (
                                                        <tr>
                                                            <td colSpan="7" className="text-center py-5">
                                                                <div className="spinner-border text-primary" role="status">
                                                                    <span className="visually-hidden">Loading...</span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ) : users.data.length > 0 ? (
                                                        users.data.map((user) => (
                                                            <tr key={user.id}>
                                                                <td className="border-0 px-4 py-3">
                                                                    <div className="d-flex align-items-center">
                                                                        <div className={`user-avatar me-3 ${isUserOnline(user) ? 'online' : ''}`}>
                                                                            {getUserInitials(user.name)}
                                                                            {isUserOnline(user) && (
                                                                                <div className="online-indicator"></div>
                                                                            )}
                                                                        </div>
                                                                        <div>
                                                                            <div className="fw-medium">{user.name}</div>
                                                                            <small className="text-muted">ID: {user.id}</small>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="border-0 py-3">
                                                                    <span className="text-break">{user.email}</span>
                                                                </td>
                                                                <td className="border-0 py-3">
                                                                    {formatLastSeen(user.last_seen_at, user.is_online)}
                                                                </td>
                                                                <td className="border-0 py-3">
                                                                    {user.device_type ? (
                                                                        <OverlayTrigger
                                                                            placement="top"
                                                                            overlay={
                                                                                <Tooltip>
                                                                                    {user.device_name || `${user.operating_system} - ${user.browser}`}
                                                                                </Tooltip>
                                                                            }
                                                                        >
                                                                            <div className="d-flex align-items-center gap-2">
                                                                                {getDeviceIcon(user.device_type)}
                                                                                <small className="text-muted">
                                                                                    {user.operating_system}
                                                                                </small>
                                                                                {getBrowserIcon(user.browser)}
                                                                            </div>
                                                                        </OverlayTrigger>
                                                                    ) : (
                                                                        <span className="text-muted">-</span>
                                                                    )}
                                                                </td>
                                                                <td className="border-0 py-3">
                                                                    <div>
                                                                        <div className="small">
                                                                            {user.last_seen_at ? formatDate(user.last_seen_at) : 'Never'}
                                                                        </div>
                                                                        <small className="text-muted">
                                                                            Joined: {formatDate(user.created_at)}
                                                                        </small>
                                                                    </div>
                                                                </td>
                                                                <td className="border-0 py-3">
                                                                    <Badge bg={getRoleBadgeVariant(user.role)}>
                                                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                                    </Badge>
                                                                </td>
                                                                <td className="border-0 py-3">
                                                                    <div className="d-flex gap-1">
                                                                        <OverlayTrigger
                                                                            placement="top"
                                                                            overlay={<Tooltip>View Details</Tooltip>}
                                                                        >
                                                                            <Button variant="outline-primary" size="sm">
                                                                                <Eye size={14} />
                                                                            </Button>
                                                                        </OverlayTrigger>
                                                                        <OverlayTrigger
                                                                            placement="top"
                                                                            overlay={<Tooltip>Edit User</Tooltip>}
                                                                        >
                                                                            <Button variant="outline-secondary" size="sm">
                                                                                <Edit size={14} />
                                                                            </Button>
                                                                        </OverlayTrigger>
                                                                        <OverlayTrigger
                                                                            placement="top"
                                                                            overlay={<Tooltip>Delete User</Tooltip>}
                                                                        >
                                                                            <Button variant="outline-danger" size="sm">
                                                                                <Trash2 size={14} />
                                                                            </Button>
                                                                        </OverlayTrigger>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="7" className="text-center py-5">
                                                                <div className="text-muted">
                                                                    <Users size={48} className="mb-3 opacity-50" />
                                                                    <h5>No users found</h5>
                                                                    <p>Try adjusting your search criteria.</p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </Card.Body>
                                </Card>

                                {/* Pagination */}
                                {renderPagination()}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Container>
            </div>

            {/* Additional Styles */}
            <style jsx>{`
                .user-avatar {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 600;
                    font-size: 0.875rem;
                    position: relative;
                }
                
                .user-avatar.online {
                    border: 2px solid #48bb78;
                }
                
                .online-indicator {
                    position: absolute;
                    bottom: -2px;
                    right: -2px;
                    width: 12px;
                    height: 12px;
                    background: #48bb78;
                    border: 2px solid white;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0% {
                        box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.7);
                    }
                    70% {
                        box-shadow: 0 0 0 10px rgba(72, 187, 120, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(72, 187, 120, 0);
                    }
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
                
                .table th {
                    font-size: 0.875rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    font-weight: 500;
                }
                
                .table td {
                    vertical-align: middle;
                }
                
                .text-break {
                    word-break: break-word;
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
                
                .device-info {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .badge {
                    font-size: 0.75rem;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
