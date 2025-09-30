import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col, Card, Badge, Button, Form, Table, Alert, Modal } from 'react-bootstrap';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminSideNav from './Components/SideNav';
import { Plus, Edit, Trash2, Folder, FolderOpen, Upload } from 'lucide-react';
import axios from 'axios';

export default function ManageCategories({ categories, edit }) {
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
    
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        cover_img: null
    });

    // Set initial form data if editing
    useState(() => {
        if (edit) {
            setFormData({
                name: edit.name || '',
                slug: edit.slug || '',
                description: edit.description || '',
                cover_img: null
            });
            setShowEditModal(true);
            setEditingCategory(edit);
        }
    }, [edit]);

    const showAlert = (message, type = 'success') => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 5000);
    };

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        
        if (type === 'file') {
            setFormData(prev => ({
                ...prev,
                [name]: files[0]
            }));
        } else {
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
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            slug: '',
            description: '',
            cover_img: null
        });
        setEditingCategory(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const url = editingCategory ? `/edit-category/${editingCategory.id}` : '/admin-store-category';
            
            // Create FormData for file upload
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('slug', formData.slug);
            formDataToSend.append('description', formData.description);
            
            if (formData.cover_img) {
                formDataToSend.append('cover_img', formData.cover_img);
            }
            
            if (editingCategory) {
                formDataToSend.append('post_id', editingCategory.id);
            }

            // Add HMAC signature for security
            const signature = await generateSignature(editingCategory?.id || '');
            formDataToSend.append('signature', signature);

            const response = await axios.post(url, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            const data = response.data;

            if (data.success) {
                showAlert(data.message, 'success');
                resetForm();
                setShowModal(false);
                setShowEditModal(false);
                // Refresh the page to show updated data
                router.visit(route('admin.categories'), { preserveState: false });
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

    // Simple signature generation (this should match your backend logic)
    const generateSignature = async (postId) => {
        // This is a simplified version - you might need to implement proper HMAC
        return btoa(postId + 'your-app-key'); // Basic encoding - implement proper HMAC
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            slug: category.slug,
            description: category.description,
            cover_img: null
        });
        setShowEditModal(true);
    };

    const handleDelete = async (categoryId) => {
        if (!confirm('Are you sure you want to delete this category?')) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post('/delete-category', {
                id: categoryId
            });

            const data = response.data;

            if (data.success) {
                showAlert(data.message, 'success');
                // Refresh the page to show updated data
                router.visit(route('admin.categories'), { preserveState: false });
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
            <Head title="Manage Opportunity Categories" />
            
            <Container fluid className="py-4">
                <Row>
                    <Col md={3}>
                        <AdminSideNav />
                    </Col>
                    <Col md={9}>
                        <Card className="shadow-sm">
                            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                                <h4 className="mb-0 d-flex align-items-center gap-2">
                                    <FolderOpen size={24} />
                                    Manage Opportunity Categories
                                </h4>
                                <Button 
                                    variant="light" 
                                    size="sm"
                                    onClick={() => setShowModal(true)}
                                    className="d-flex align-items-center gap-1"
                                >
                                    <Plus size={16} />
                                    Add Category
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
                                                <th>Cover Image</th>
                                                <th>Created At</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {categories.length > 0 ? (
                                                categories.map((category) => (
                                                    <tr key={category.id}>
                                                        <td>{category.id}</td>
                                                        <td>
                                                            <Badge bg="primary" className="p-2">
                                                                {category.name}
                                                            </Badge>
                                                        </td>
                                                        <td>
                                                            <code>{category.slug}</code>
                                                        </td>
                                                        <td>{category.description}</td>
                                                        <td>
                                                            {category.cover_img ? (
                                                                <img 
                                                                    src={`/storage/uploads/channels/${category.cover_img}`} 
                                                                    alt={category.name}
                                                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                                    className="rounded"
                                                                />
                                                            ) : (
                                                                <span className="text-muted">No image</span>
                                                            )}
                                                        </td>
                                                        <td>{new Date(category.created_at).toLocaleDateString()}</td>
                                                        <td>
                                                            <div className="d-flex gap-1">
                                                                <Button
                                                                    variant="outline-primary"
                                                                    size="sm"
                                                                    onClick={() => handleEdit(category)}
                                                                    className="d-flex align-items-center gap-1"
                                                                >
                                                                    <Edit size={14} />
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    onClick={() => handleDelete(category.id)}
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
                                                    <td colSpan="7" className="text-center text-muted py-4">
                                                        No categories found. Create your first category!
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

            {/* Add Category Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Add New Category</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Category Name *</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter category name"
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
                                placeholder="category-slug"
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
                                placeholder="Enter category description"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Cover Image</Form.Label>
                            <Form.Control
                                type="file"
                                name="cover_img"
                                onChange={handleInputChange}
                                accept="image/*"
                            />
                            <Form.Text className="text-muted">
                                Upload a cover image for this category (optional)
                            </Form.Text>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Category'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Edit Category Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Category</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Category Name *</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter category name"
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
                                placeholder="category-slug"
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
                                placeholder="Enter category description"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Cover Image</Form.Label>
                            <Form.Control
                                type="file"
                                name="cover_img"
                                onChange={handleInputChange}
                                accept="image/*"
                            />
                            <Form.Text className="text-muted">
                                Upload a new cover image (leave empty to keep current image)
                            </Form.Text>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update Category'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </AuthenticatedLayout>
    );
}
