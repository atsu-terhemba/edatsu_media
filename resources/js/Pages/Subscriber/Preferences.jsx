import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import SubscriberSideNav from './Components/SideNav';
import axios from 'axios';

export default function Preferences({ userPreferences, categories, countries, regions, brands, tags }) {
    const [formData, setFormData] = useState({
        // Opportunity preferences
        opportunity_categories: userPreferences?.opportunity_categories || [],
        opportunity_countries: userPreferences?.opportunity_countries || [],
        opportunity_regions: userPreferences?.opportunity_regions || [],
        opportunity_brands: userPreferences?.opportunity_brands || [],
        
        // Product preferences
        product_categories: userPreferences?.product_categories || [],
        product_tags: userPreferences?.product_tags || [],
        product_brands: userPreferences?.product_brands || [],
        
        // Notification preferences
        email_notifications: userPreferences?.email_notifications || false,
        opportunity_notifications: userPreferences?.opportunity_notifications || true,
        product_notifications: userPreferences?.product_notifications || true,
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handleCheckboxChange = (field, value, checked) => {
        setFormData(prev => ({
            ...prev,
            [field]: checked 
                ? [...prev[field], value]
                : prev[field].filter(item => item !== value)
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
        
        try {
            const response = await axios.post('/subscriber/preferences', formData);
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

    const PreferenceSection = ({ title, items, field, selectedItems }) => (
        <Card className="mb-4">
            <Card.Header>
                <h5 className="mb-0 poppins-semibold">{title}</h5>
            </Card.Header>
            <Card.Body>
                <Row>
                    {items.map((item) => (
                        <Col md={6} lg={4} key={item.id} className="mb-2">
                            <Form.Check
                                type="checkbox"
                                id={`${field}-${item.id}`}
                                label={item.name}
                                checked={selectedItems.includes(item.id)}
                                onChange={(e) => handleCheckboxChange(field, item.id, e.target.checked)}
                            />
                        </Col>
                    ))}
                </Row>
            </Card.Body>
        </Card>
    );

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
                        <Col sm={9}>
                            <div className='border px-3 py-4 rounded my-3'>
                                <div className='d-flex justify-content-between align-items-center mb-4'>
                                    <h2 className='poppins-semibold m-0'>Your Preferences</h2>
                                    <i className='bi bi-gear-fill text-primary' style={{fontSize: '1.5rem'}}></i>
                                </div>

                                {message && (
                                    <Alert variant={messageType} className="mb-4">
                                        {message}
                                    </Alert>
                                )}

                                <Form onSubmit={handleSubmit}>
                                    {/* Opportunities Section */}
                                    <div className="mb-5">
                                        <h3 className="poppins-semibold text-primary mb-3">
                                            <i className="bi bi-briefcase me-2"></i>
                                            Opportunity Preferences
                                        </h3>
                                        <p className="text-muted mb-4">
                                            Select your interests to receive personalized opportunity recommendations.
                                        </p>

                                        <PreferenceSection
                                            title="Categories of Interest"
                                            items={categories}
                                            field="opportunity_categories"
                                            selectedItems={formData.opportunity_categories}
                                        />

                                        <PreferenceSection
                                            title="Preferred Countries"
                                            items={countries}
                                            field="opportunity_countries"
                                            selectedItems={formData.opportunity_countries}
                                        />

                                        <PreferenceSection
                                            title="Preferred Regions"
                                            items={regions}
                                            field="opportunity_regions"
                                            selectedItems={formData.opportunity_regions}
                                        />

                                        <PreferenceSection
                                            title="Preferred Brands"
                                            items={brands}
                                            field="opportunity_brands"
                                            selectedItems={formData.opportunity_brands}
                                        />
                                    </div>

                                    {/* Products Section */}
                                    <div className="mb-5">
                                        <h3 className="poppins-semibold text-success mb-3">
                                            <i className="bi bi-tools me-2"></i>
                                            Product Preferences (Toolshed)
                                        </h3>
                                        <p className="text-muted mb-4">
                                            Choose your interests to discover relevant tools and products.
                                        </p>

                                        <PreferenceSection
                                            title="Product Categories"
                                            items={categories}
                                            field="product_categories"
                                            selectedItems={formData.product_categories}
                                        />

                                        <PreferenceSection
                                            title="Product Tags"
                                            items={tags}
                                            field="product_tags"
                                            selectedItems={formData.product_tags}
                                        />

                                        <PreferenceSection
                                            title="Preferred Brands"
                                            items={brands}
                                            field="product_brands"
                                            selectedItems={formData.product_brands}
                                        />
                                    </div>

                                    {/* Notification Settings */}
                                    <Card className="mb-4">
                                        <Card.Header>
                                            <h4 className="mb-0 poppins-semibold text-warning">
                                                <i className="bi bi-bell me-2"></i>
                                                Notification Settings
                                            </h4>
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
                                            variant="primary" 
                                            size="lg"
                                            disabled={loading}
                                            className="px-5"
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
                    </Row>
                </Container>
            </Container>
        </AuthenticatedLayout>
    );
}
