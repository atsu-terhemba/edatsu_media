import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col } from 'react-bootstrap';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import SubscriberSideNav from './Components/SideNav';
import Select from 'react-select';
import axios from 'axios';

const selectStyles = {
    control: (base, state) => ({
        ...base,
        borderRadius: '12px',
        border: state.isFocused ? '1px solid #000' : '1px solid #e5e5e7',
        boxShadow: 'none',
        padding: '2px 4px',
        fontSize: '14px',
        minHeight: '42px',
        '&:hover': { borderColor: '#d1d5db' },
    }),
    multiValue: (base) => ({
        ...base,
        background: '#f5f5f7',
        borderRadius: '8px',
        padding: '1px 2px',
    }),
    multiValueLabel: (base) => ({
        ...base,
        fontSize: '13px',
        color: '#000',
        fontWeight: 500,
    }),
    multiValueRemove: (base) => ({
        ...base,
        color: '#86868b',
        borderRadius: '0 8px 8px 0',
        '&:hover': { background: '#e8e8ed', color: '#000' },
    }),
    placeholder: (base) => ({
        ...base,
        fontSize: '14px',
        color: '#b0b0b5',
    }),
    option: (base, state) => ({
        ...base,
        fontSize: '14px',
        background: state.isSelected ? '#000' : state.isFocused ? '#f5f5f7' : '#fff',
        color: state.isSelected ? '#fff' : '#000',
        '&:active': { background: '#e8e8ed' },
    }),
    menu: (base) => ({
        ...base,
        borderRadius: '14px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid #f0f0f0',
        overflow: 'hidden',
    }),
};

function ToggleSwitch({ checked, onChange, id }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            id={id}
            onClick={() => onChange(!checked)}
            style={{
                width: '44px',
                height: '26px',
                borderRadius: '9999px',
                border: 'none',
                padding: '2px',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
                background: checked ? '#000' : '#e5e5e7',
                flexShrink: 0,
            }}
        >
            <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                transition: 'transform 0.2s ease',
                transform: checked ? 'translateX(18px)' : 'translateX(0)',
            }} />
        </button>
    );
}

export default function Preferences({ userPreferences, categories, countries, regions, brands, tags }) {
    const categoryOptions = categories.map(item => ({ value: item.id, label: item.name }));
    const countryOptions = countries.map(item => ({ value: item.id, label: item.name }));
    const regionOptions = regions.map(item => ({ value: item.id, label: item.name }));
    const brandOptions = brands.map(item => ({ value: item.id, label: item.name }));
    const tagOptions = tags.map(item => ({ value: item.id, label: item.name }));

    const [formData, setFormData] = useState({
        opportunity_categories: userPreferences?.opportunity_categories?.map(id =>
            categoryOptions.find(opt => opt.value === id)) || [],
        opportunity_countries: userPreferences?.opportunity_countries?.map(id =>
            countryOptions.find(opt => opt.value === id)) || [],
        opportunity_regions: userPreferences?.opportunity_regions?.map(id =>
            regionOptions.find(opt => opt.value === id)) || [],
        opportunity_brands: userPreferences?.opportunity_brands?.map(id =>
            brandOptions.find(opt => opt.value === id)) || [],
        product_categories: userPreferences?.product_categories?.map(id =>
            categoryOptions.find(opt => opt.value === id)) || [],
        product_tags: userPreferences?.product_tags?.map(id =>
            tagOptions.find(opt => opt.value === id)) || [],
        product_brands: userPreferences?.product_brands?.map(id =>
            brandOptions.find(opt => opt.value === id)) || [],
        email_notifications: userPreferences?.email_notifications || false,
        opportunity_notifications: userPreferences?.opportunity_notifications || true,
        product_notifications: userPreferences?.product_notifications || true,
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handleSelectChange = (selectedOptions, field) => {
        setFormData(prev => ({ ...prev, [field]: selectedOptions || [] }));
    };

    const handleSwitchChange = (field, checked) => {
        setFormData(prev => ({ ...prev, [field]: checked }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

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
            setMessageType('error');
        } finally {
            setLoading(false);
        }

        setTimeout(() => { setMessage(''); setMessageType(''); }, 5000);
    };

    const labelStyle = {
        display: 'block',
        fontSize: '12px',
        fontWeight: 500,
        color: '#86868b',
        marginBottom: '6px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    };

    const notificationItems = [
        {
            id: 'email_notifications',
            field: 'email_notifications',
            icon: 'mail',
            title: 'Email Notifications',
            description: 'Get notified when new opportunities or products match your preferences',
        },
        {
            id: 'opportunity_notifications',
            field: 'opportunity_notifications',
            icon: 'event',
            title: 'Opportunity Alerts',
            description: 'Receive alerts about new opportunities that match your interests',
        },
        {
            id: 'product_notifications',
            field: 'product_notifications',
            icon: 'handyman',
            title: 'Product Alerts',
            description: 'Receive alerts about new tools and products that match your interests',
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Preferences" />

            <Container fluid={true}>
                <Container>
                    <Row className="g-4" style={{ paddingTop: '96px', paddingBottom: '64px' }}>
                        <Col md={3} className="d-none d-md-block">
                            <SubscriberSideNav />
                        </Col>
                        <Col md={9} xs={12}>
                            {/* Header */}
                            <div style={{ marginBottom: '32px' }}>
                                <h2 style={{
                                    fontSize: 'clamp(24px, 4vw, 28px)',
                                    fontWeight: 600,
                                    color: '#000',
                                    letterSpacing: '-0.02em',
                                    marginBottom: '6px',
                                }}>
                                    Preferences
                                </h2>
                                <p style={{ fontSize: '14px', color: '#86868b', margin: 0 }}>
                                    Personalize your experience with tailored recommendations
                                </p>
                            </div>

                            {/* Status message */}
                            {message && (
                                <div style={{
                                    padding: '14px 18px',
                                    borderRadius: '12px',
                                    marginBottom: '24px',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    background: messageType === 'success' ? '#f0fdf4' : '#fef2f2',
                                    border: `1px solid ${messageType === 'success' ? '#dcfce7' : '#fecaca'}`,
                                    color: messageType === 'success' ? '#16a34a' : '#dc2626',
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                                        {messageType === 'success' ? 'check_circle' : 'error'}
                                    </span>
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                {/* Opportunity Preferences */}
                                <div style={{
                                    background: '#fff',
                                    border: '1px solid #f0f0f0',
                                    borderRadius: '16px',
                                    padding: '28px',
                                    marginBottom: '12px',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                        <span style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '10px',
                                            background: '#f5f5f7',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#000' }}>event</span>
                                        </span>
                                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#000', margin: 0 }}>
                                            Opportunity Preferences
                                        </h3>
                                    </div>
                                    <p style={{ fontSize: '13px', color: '#86868b', margin: '0 0 24px 42px' }}>
                                        Select your interests to receive personalized recommendations.
                                    </p>

                                    <Row className="g-3">
                                        <Col md={6}>
                                            <label style={labelStyle}>Categories</label>
                                            <Select
                                                isMulti
                                                value={formData.opportunity_categories}
                                                options={categoryOptions}
                                                onChange={(selected) => handleSelectChange(selected, 'opportunity_categories')}
                                                styles={selectStyles}
                                                placeholder="Select categories..."
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <label style={labelStyle}>Countries</label>
                                            <Select
                                                isMulti
                                                value={formData.opportunity_countries}
                                                options={countryOptions}
                                                onChange={(selected) => handleSelectChange(selected, 'opportunity_countries')}
                                                styles={selectStyles}
                                                placeholder="Select countries..."
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <label style={labelStyle}>Regions</label>
                                            <Select
                                                isMulti
                                                value={formData.opportunity_regions}
                                                options={regionOptions}
                                                onChange={(selected) => handleSelectChange(selected, 'opportunity_regions')}
                                                styles={selectStyles}
                                                placeholder="Select regions..."
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <label style={labelStyle}>Brands</label>
                                            <Select
                                                isMulti
                                                value={formData.opportunity_brands}
                                                options={brandOptions}
                                                onChange={(selected) => handleSelectChange(selected, 'opportunity_brands')}
                                                styles={selectStyles}
                                                placeholder="Select brands..."
                                            />
                                        </Col>
                                    </Row>
                                </div>

                                {/* Product Preferences */}
                                <div style={{
                                    background: '#fff',
                                    border: '1px solid #f0f0f0',
                                    borderRadius: '16px',
                                    padding: '28px',
                                    marginBottom: '12px',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                        <span style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '10px',
                                            background: '#f5f5f7',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#000' }}>handyman</span>
                                        </span>
                                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#000', margin: 0 }}>
                                            Toolshed Preferences
                                        </h3>
                                    </div>
                                    <p style={{ fontSize: '13px', color: '#86868b', margin: '0 0 24px 42px' }}>
                                        Choose your interests to discover relevant tools and products.
                                    </p>

                                    <Row className="g-3">
                                        <Col md={6}>
                                            <label style={labelStyle}>Categories</label>
                                            <Select
                                                isMulti
                                                value={formData.product_categories}
                                                options={categoryOptions}
                                                onChange={(selected) => handleSelectChange(selected, 'product_categories')}
                                                styles={selectStyles}
                                                placeholder="Select categories..."
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <label style={labelStyle}>Tags</label>
                                            <Select
                                                isMulti
                                                value={formData.product_tags}
                                                options={tagOptions}
                                                onChange={(selected) => handleSelectChange(selected, 'product_tags')}
                                                styles={selectStyles}
                                                placeholder="Select tags..."
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <label style={labelStyle}>Brands</label>
                                            <Select
                                                isMulti
                                                value={formData.product_brands}
                                                options={brandOptions}
                                                onChange={(selected) => handleSelectChange(selected, 'product_brands')}
                                                styles={selectStyles}
                                                placeholder="Select brands..."
                                            />
                                        </Col>
                                    </Row>
                                </div>

                                {/* Notification Settings */}
                                <div style={{
                                    background: '#fff',
                                    border: '1px solid #f0f0f0',
                                    borderRadius: '16px',
                                    padding: '28px',
                                    marginBottom: '24px',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                        <span style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '10px',
                                            background: '#f5f5f7',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#000' }}>notifications</span>
                                        </span>
                                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#000', margin: 0 }}>
                                            Notification Settings
                                        </h3>
                                    </div>
                                    <p style={{ fontSize: '13px', color: '#86868b', margin: '0 0 24px 42px' }}>
                                        Control how you receive updates and alerts.
                                    </p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {notificationItems.map((item) => (
                                            <div
                                                key={item.id}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    gap: '16px',
                                                    padding: '14px 16px',
                                                    borderRadius: '12px',
                                                    transition: 'background 0.15s ease',
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                                    <span style={{
                                                        width: '36px',
                                                        height: '36px',
                                                        borderRadius: '10px',
                                                        background: '#f5f5f7',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexShrink: 0,
                                                    }}>
                                                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#6e6e73' }}>
                                                            {item.icon}
                                                        </span>
                                                    </span>
                                                    <div>
                                                        <div style={{ fontSize: '14px', fontWeight: 500, color: '#000', marginBottom: '2px' }}>
                                                            {item.title}
                                                        </div>
                                                        <div style={{ fontSize: '12px', color: '#86868b', lineHeight: 1.4 }}>
                                                            {item.description}
                                                        </div>
                                                    </div>
                                                </div>
                                                <ToggleSwitch
                                                    id={item.id}
                                                    checked={formData[item.field]}
                                                    onChange={(checked) => handleSwitchChange(item.field, checked)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Save button */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '12px 32px',
                                            borderRadius: '9999px',
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            background: '#000',
                                            color: '#fff',
                                            border: 'none',
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            transition: 'all 0.15s ease',
                                            opacity: loading ? 0.5 : 1,
                                        }}
                                        onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#1f2937'; }}
                                        onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#000'; }}
                                    >
                                        {loading ? (
                                            <><span className="spinner-border spinner-border-sm" /> Saving...</>
                                        ) : (
                                            <><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check</span> Save Preferences</>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </Col>
                    </Row>
                </Container>
            </Container>
        </AuthenticatedLayout>
    );
}
