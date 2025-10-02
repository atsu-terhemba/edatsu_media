import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import SubscriberSideNav from './Components/SideNav';
import Select from 'react-select';
import axios from 'axios';

export default function Preferences({ userPreferences, categories, countries, regions, brands, tags }) {
    // Convert data to react-select format
    const categoryOptions = categories.map(item => ({ value: item.id, label: item.name }));
    const countryOptions = countries.map(item => ({ value: item.id, label: item.name }));
    const regionOptions = regions.map(item => ({ value: item.id, label: item.name }));
    const brandOptions = brands.map(item => ({ value: item.id, label: item.name }));
    const tagOptions = tags.map(item => ({ value: item.id, label: item.name }));

    const [formData, setFormData] = useState({
        // Opportunity preferences - convert to react-select format
        opportunity_categories: userPreferences?.opportunity_categories?.map(id => 
            categoryOptions.find(opt => opt.value === id)) || [],
        opportunity_countries: userPreferences?.opportunity_countries?.map(id => 
            countryOptions.find(opt => opt.value === id)) || [],
        opportunity_regions: userPreferences?.opportunity_regions?.map(id => 
            regionOptions.find(opt => opt.value === id)) || [],
        opportunity_brands: userPreferences?.opportunity_brands?.map(id => 
            brandOptions.find(opt => opt.value === id)) || [],
        
        // Product preferences - convert to react-select format
        product_categories: userPreferences?.product_categories?.map(id => 
            categoryOptions.find(opt => opt.value === id)) || [],
        product_tags: userPreferences?.product_tags?.map(id => 
            tagOptions.find(opt => opt.value === id)) || [],
        product_brands: userPreferences?.product_brands?.map(id => 
            brandOptions.find(opt => opt.value === id)) || [],
        
        // Notification preferences
        email_notifications: userPreferences?.email_notifications || false,
        opportunity_notifications: userPreferences?.opportunity_notifications || true,
        product_notifications: userPreferences?.product_notifications || true,
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handleSelectChange = (selectedOptions, field) => {
        setFormData(prev => ({
            ...prev,
            [field]: selectedOptions || []
        }));
    };

    const handleSwitchChange = (field, checked) => {
        setFormData(prev => ({
            ...prev,
            [field]: checked
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Convert react-select format back to IDs
        const submitData = {
            opportunity_categories: formData.opportunity_categories.map(opt => opt.value),
            opportunity_countries: formData.opportunity_countries.map(opt => opt.value),
            opportunity_regions: formData.opportunity_regions.map(opt => opt.value),
            opportunity_brands: formData.opportunity_brands.map(opt => opt.value),
            product_categories: formData.product_categories.map(opt => opt.value),
            product_tags: formData.product_tags.map(opt => opt.value),
            product_brands: formData.product_brands.map(opt => opt.value),
            email_notifications: formData.email_notifications,
            opportunity_notifications: formData.opportunity_notifications,
            product_notifications: formData.product_notifications,
        };
        
        try {
            const response = await axios.post('/subscriber/preferences', submitData);
            if (response.data.status === 'success') {
                setMessage(response.data.message);
                setMessageType('success');
            }
        } catch (error) {
            console.error('Error updating preferences:', error);
            setMessage('Failed to update preferences. Please try again.');
            setMessageType('danger');
        } finally {
            setLoading(false);
        }
        
        // Clear message after 5 seconds
        setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 5000);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Preferences" />

            <Container fluid={true}>
                <Container>
                    <Row>
                        <Col sm={3}>
                            <div className='my-3 fs-9'>
                                <SubscriberSideNav/>
                            </div>
                        </Col>
                        <Col sm={6}>
                            <div className='py-3 rounded my-3' style={{border: '1px solid #dee2e6'}}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h4 className='m-0' style={{fontWeight: 'normal'}}>Your Preferences</h4>
                                    <i className='bi bi-gear text-primary' style={{fontSize: '1.5rem'}}></i>
                                </div>
                            </div>

                            <div>

                                {message && (
                                    <Alert variant={messageType} className="mb-4">
                                        {message}
                                    </Alert>
                                )}

                                <Form onSubmit={handleSubmit}>
                                    {/* Opportunities Section */}
                                    <div className="mb-4">
                                        <h5 className="mb-3" style={{color: '#0d6efd', fontWeight: 'normal'}}>
                                            Opportunity Preferences
                                        </h5>
                                        <p className="text-muted mb-3" style={{fontSize: '0.9rem'}}>
                                            Select your interests to receive personalized opportunity recommendations.
                                        </p>

                                        <Row>
                                            <Col md={6} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label style={{fontWeight: 'normal'}}>
                                                        Categories of Interest
                                                    </Form.Label>
                                                    <Select
                                                        isMulti
                                                        value={formData.opportunity_categories}
                                                        options={categoryOptions}
                                                        onChange={(selected) => handleSelectChange(selected, 'opportunity_categories')}
                                                        className="fs-9"
                                                        classNamePrefix="select"
                                                        placeholder="Select categories..."
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label style={{fontWeight: 'normal'}}>
                                                        Preferred Countries
                                                    </Form.Label>
                                                    <Select
                                                        isMulti
                                                        value={formData.opportunity_countries}
                                                        options={countryOptions}
                                                        onChange={(selected) => handleSelectChange(selected, 'opportunity_countries')}
                                                        className="fs-9"
                                                        classNamePrefix="select"
                                                        placeholder="Select countries..."
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label style={{fontWeight: 'normal'}}>
                                                        Preferred Regions
                                                    </Form.Label>
                                                    <Select
                                                        isMulti
                                                        value={formData.opportunity_regions}
                                                        options={regionOptions}
                                                        onChange={(selected) => handleSelectChange(selected, 'opportunity_regions')}
                                                        className="fs-9"
                                                        classNamePrefix="select"
                                                        placeholder="Select regions..."
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label style={{fontWeight: 'normal'}}>
                                                        Preferred Brands
                                                    </Form.Label>
                                                    <Select
                                                        isMulti
                                                        value={formData.opportunity_brands}
                                                        options={brandOptions}
                                                        onChange={(selected) => handleSelectChange(selected, 'opportunity_brands')}
                                                        className="fs-9"
                                                        classNamePrefix="select"
                                                        placeholder="Select brands..."
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </div>

                                    {/* Products Section */}
                                    <div className="mb-4">
                                        <h5 className="mb-3" style={{color: '#28a745', fontWeight: 'normal'}}>
                                            Product Preferences (Toolshed)
                                        </h5>
                                        <p className="text-muted mb-3" style={{fontSize: '0.9rem'}}>
                                            Choose your interests to discover relevant tools and products.
                                        </p>

                                        <Row>
                                            <Col md={6} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label style={{fontWeight: 'normal'}}>
                                                        Product Categories
                                                    </Form.Label>
                                                    <Select
                                                        isMulti
                                                        value={formData.product_categories}
                                                        options={categoryOptions}
                                                        onChange={(selected) => handleSelectChange(selected, 'product_categories')}
                                                        className="fs-9"
                                                        classNamePrefix="select"
                                                        placeholder="Select categories..."
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label style={{fontWeight: 'normal'}}>
                                                        Product Tags
                                                    </Form.Label>
                                                    <Select
                                                        isMulti
                                                        value={formData.product_tags}
                                                        options={tagOptions}
                                                        onChange={(selected) => handleSelectChange(selected, 'product_tags')}
                                                        className="fs-9"
                                                        classNamePrefix="select"
                                                        placeholder="Select tags..."
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label style={{fontWeight: 'normal'}}>
                                                        Preferred Brands
                                                    </Form.Label>
                                                    <Select
                                                        isMulti
                                                        value={formData.product_brands}
                                                        options={brandOptions}
                                                        onChange={(selected) => handleSelectChange(selected, 'product_brands')}
                                                        className="fs-9"
                                                        classNamePrefix="select"
                                                        placeholder="Select brands..."
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </div>

                                    {/* Notification Settings */}
                                    <Card className="mb-4" style={{border: '1px solid #dee2e6', boxShadow: 'none'}}>
                                        <Card.Header style={{backgroundColor: 'transparent', borderBottom: '1px solid #dee2e6'}}>
                                            <h6 className="mb-0" style={{color: '#fd7e14', fontWeight: 'normal'}}>
                                                Notification Settings
                                            </h6>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="mb-3">
                                                <Form.Check
                                                    type="switch"
                                                    id="email-notifications"
                                                    label="Receive preference notifications via Email"
                                                    checked={formData.email_notifications}
                                                    onChange={(e) => handleSwitchChange('email_notifications', e.target.checked)}
                                                />
                                                <small className="text-muted">
                                                    Get notified when new opportunities or products match your preferences
                                                </small>
                                            </div>
                                            
                                            <div className="mb-3">
                                                <Form.Check
                                                    type="switch"
                                                    id="opportunity-notifications"
                                                    label="Opportunity Notifications"
                                                    checked={formData.opportunity_notifications}
                                                    onChange={(e) => handleSwitchChange('opportunity_notifications', e.target.checked)}
                                                />
                                                <small className="text-muted">
                                                    Receive notifications about new opportunities that match your interests
                                                </small>
                                            </div>
                                            
                                            <div className="mb-3">
                                                <Form.Check
                                                    type="switch"
                                                    id="product-notifications"
                                                    label="Product Notifications"
                                                    checked={formData.product_notifications}
                                                    onChange={(e) => handleSwitchChange('product_notifications', e.target.checked)}
                                                />
                                                <small className="text-muted">
                                                    Receive notifications about new tools and products that match your interests
                                                </small>
                                            </div>
                                        </Card.Body>
                                    </Card>

                                    {/* Submit Button */}
                                    <div className="d-flex justify-content-end">
                                        <Button 
                                            type="submit" 
                                            variant="outline-secondary"
                                            disabled={loading}
                                            className="px-4"
                                            style={{borderRadius: '6px'}}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-check2-circle me-2"></i>
                                                    Save Preferences
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        </Col>
                        <Col sm={3}>
                        </Col>
                    </Row>
                </Container>
            </Container>
        </AuthenticatedLayout>
    );
}
