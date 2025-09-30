import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col, Card, Badge, Button, Form, Table, Alert, Modal } from 'react-bootstrap';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminSideNav from './Components/SideNav';
import { Plus, Edit, Trash2, Award } from 'lucide-react';
import axios from 'axios';

export default function ManageBrandLabels({ labels, edit }) {
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingLabel, setEditingLabel] = useState(null);
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
            setEditingLabel(edit);
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
        setEditingLabel(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const url = editingLabel ? `/edit-brand-label/${editingLabel.id}` : '/admin-store-label';
            
            const response = await axios.post(url, {
                ...formData,
                post_id: editingLabel?.id || null
            });

            const data = response.data;

            if (data.success) {
                showAlert(data.message, 'success');
                resetForm();
                setShowModal(false);
                setShowEditModal(false);
                // Refresh the page to show updated data
                router.visit(route('admin.brand-labels'), { preserveState: false });
            } else {
                showAlert(data.message || 'An error occurred', 'danger');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred while saving';
            showAlert(errorMessage, 'danger');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (label) => {
        setEditingLabel(label);
        setFormData({
            name: label.name,
            slug: label.slug,
            description: label.description
        });
        setShowEditModal(true);
    };

    const handleDelete = async (labelId) => {
        if (!confirm('Are you sure you want to delete this brand label?')) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post('/delete-label', {
                id: labelId
            });

            const data = response.data;

            if (data.success) {
                showAlert(data.message, 'success');
                // Refresh the page to show updated data
                router.visit(route('admin.brand-labels'), { preserveState: false });
            } else {
                showAlert(data.message || 'An error occurred', 'danger');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred while deleting';
            showAlert(errorMessage, 'danger');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manage Brand Labels" />
            
            <Container fluid className="py-4">
                <Row>
                    <Col md={3}>
                        <AdminSideNav />
                    </Col>
                    <Col md={9}>
                        <Card className="shadow-sm">
                            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                                <h4 className="mb-0 d-flex align-items-center gap-2">
                                    <Award size={24} />
                                    Manage Brand Labels
                                </h4>
                                <Button 
                                    variant="light" 
                                    size="sm"
                                    onClick={() => setShowModal(true)}
                                    className="d-flex align-items-center gap-1"
                                >
                                    <Plus size={16} />
                                    Add Brand Label
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
                                            {labels.length > 0 ? (
                                                labels.map((label) => (
                                                    <tr key={label.id}>
                                                        <td>{label.id}</td>
                                                        <td>
                                                            <Badge bg="dark" className="p-2">
                                                                {label.name}
                                                            </Badge>
                                                        </td>
                                                        <td>
                                                            <code>{label.slug}</code>
                                                        </td>
                                                        <td>{label.description}</td>
                                                        <td>{new Date(label.created_at).toLocaleDateString()}</td>
                                                        <td>
                                                            <div className="d-flex gap-1">
                                                                <Button
                                                                    variant="outline-primary"
                                                                    size="sm"
                                                                    onClick={() => handleEdit(label)}
                                                                    className="d-flex align-items-center gap-1"
                                                                >
                                                                    <Edit size={14} />
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    onClick={() => handleDelete(label.id)}
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
                                                        No brand labels found. Create your first brand label!
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

            {/* Add Brand Label Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Add New Brand Label</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Brand Label Name *</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter brand label name"
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
                                placeholder="brand-label-slug"
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
                                placeholder="Enter brand label description"
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Brand Label'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Edit Brand Label Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Brand Label</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Brand Label Name *</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter brand label name"
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
                                placeholder="brand-label-slug"
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
                                placeholder="Enter brand label description"
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update Brand Label'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </AuthenticatedLayout>
    );
}
