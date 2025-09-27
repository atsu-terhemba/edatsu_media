import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col, Card, Badge, Button, Form, Table, Alert, Modal } from 'react-bootstrap';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminSideNav from './Components/SideNav';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';

export default function ManageRegions({ regions, edit }) {
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingRegion, setEditingRegion] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
    
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: ''
    });

    // Set initial form data if editing
    useState(() => {
        if (edit) {
            setFormData({
                name: edit.name || '',
                slug: edit.slug || '',
                description: edit.description || ''
            });
            setShowEditModal(true);
            setEditingRegion(edit);
        }
    }, [edit]);

    const showAlert = (message, type = 'success') => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 5000);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Auto-generate slug from name
        if (name === 'name') {
            const slug = value.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-');
            setFormData(prev => ({
                ...prev,
                slug: slug
            }));
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            slug: '',
            description: ''
        });
        setEditingRegion(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const url = editingRegion ? `/edit-region/${editingRegion.id}` : '/admin-store-region';
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify({
                    ...formData,
                    post_id: editingRegion?.id || null
                })
            });

            const data = await response.json();

            if (data.success) {
                showAlert(data.message, 'success');
                resetForm();
                setShowModal(false);
                setShowEditModal(false);
                // Refresh the page to show updated data
                router.visit(route('admin.regions'), { preserveState: false });
            } else {
                showAlert(data.message || 'An error occurred', 'danger');
            }
        } catch (error) {
            showAlert('An error occurred while saving', 'danger');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (region) => {
        setEditingRegion(region);
        setFormData({
            name: region.name,
            slug: region.slug,
            description: region.description
        });
        setShowEditModal(true);
    };

    const handleDelete = async (regionId) => {
        if (!confirm('Are you sure you want to delete this region?')) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/delete-region', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify({ id: regionId })
            });

            const data = await response.json();

            if (data.success) {
                showAlert(data.message, 'success');
                // Refresh the page to show updated data
                router.visit(route('admin.regions'), { preserveState: false });
            } else {
                showAlert(data.message || 'An error occurred', 'danger');
            }
        } catch (error) {
            showAlert('An error occurred while deleting', 'danger');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manage Regions" />
            
            <Container fluid className="py-4">
                <Row>
                    <Col md={3}>
                        <AdminSideNav />
                    </Col>
                    <Col md={9}>
                        <Card className="shadow-sm">
                            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                                <h4 className="mb-0 d-flex align-items-center gap-2">
                                    <MapPin size={24} />
                                    Manage Regions
                                </h4>
                                <Button 
                                    variant="light" 
                                    size="sm"
                                    onClick={() => setShowModal(true)}
                                    className="d-flex align-items-center gap-1"
                                >
                                    <Plus size={16} />
                                    Add Region
                                </Button>
                            </Card.Header>
                            <Card.Body>
                                {alert.show && (
                                    <Alert variant={alert.type} onClose={() => setAlert({show: false, message: '', type: 'success'})} dismissible>
                                        {alert.message}
                                    </Alert>
                                )}

                                <div className="table-responsive">
                                    <Table striped bordered hover>
                                        <thead className="table-dark">
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Slug</th>
                                                <th>Description</th>
                                                <th>Created At</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {regions.length > 0 ? (
                                                regions.map((region) => (
                                                    <tr key={region.id}>
                                                        <td>{region.id}</td>
                                                        <td>
                                                            <Badge bg="info" className="p-2">
                                                                {region.name}
                                                            </Badge>
                                                        </td>
                                                        <td>
                                                            <code>{region.slug}</code>
                                                        </td>
                                                        <td>{region.description}</td>
                                                        <td>{new Date(region.created_at).toLocaleDateString()}</td>
                                                        <td>
                                                            <div className="d-flex gap-1">
                                                                <Button
                                                                    variant="outline-primary"
                                                                    size="sm"
                                                                    onClick={() => handleEdit(region)}
                                                                    className="d-flex align-items-center gap-1"
                                                                >
                                                                    <Edit size={14} />
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    onClick={() => handleDelete(region.id)}
                                                                    className="d-flex align-items-center gap-1"
                                                                >
                                                                    <Trash2 size={14} />
                                                                    Delete
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="text-center text-muted py-4">
                                                        No regions found. Create your first region!
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Add Region Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Add New Region</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Region Name *</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter region name"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Slug *</Form.Label>
                            <Form.Control
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleInputChange}
                                required
                                placeholder="region-slug"
                            />
                            <Form.Text className="text-muted">
                                URL-friendly version of the name (auto-generated)
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description *</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter region description"
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Region'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Edit Region Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Region</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Region Name *</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter region name"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Slug *</Form.Label>
                            <Form.Control
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleInputChange}
                                required
                                placeholder="region-slug"
                            />
                            <Form.Text className="text-muted">
                                URL-friendly version of the name
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description *</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter region description"
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update Region'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </AuthenticatedLayout>
    );
}
