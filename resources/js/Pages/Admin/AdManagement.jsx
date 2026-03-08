import React, { useState } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col } from 'react-bootstrap';
import AdminSideNav from './Components/SideNav';

const labelStyle = {
    display: 'block', fontSize: '12px', fontWeight: 500, color: '#86868b',
    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px',
};
const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '12px',
    border: '1px solid #e5e5e7', fontSize: '14px', background: '#fff',
    color: '#000', outline: 'none', transition: 'border-color 0.15s ease',
};
const focusH = (e) => { e.currentTarget.style.borderColor = '#000'; };
const blurH = (e) => { e.currentTarget.style.borderColor = '#e5e5e7'; };

function Toggle({ checked, onChange, label }) {
    return (
        <button
            type="button"
            onClick={onChange}
            style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}
        >
            <span style={{
                width: '44px', height: '24px', borderRadius: '9999px',
                background: checked ? '#000' : '#d1d1d6', position: 'relative',
                transition: 'background 0.2s ease', flexShrink: 0,
            }}>
                <span style={{
                    width: '20px', height: '20px', borderRadius: '50%', background: '#fff',
                    position: 'absolute', top: '2px',
                    left: checked ? '22px' : '2px', transition: 'left 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                }} />
            </span>
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#000' }}>{label}</span>
        </button>
    );
}

export default function AdManagement({ globalSettings, adSettings }) {
    const { flash } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [editingAd, setEditingAd] = useState(null);

    const globalForm = useForm({
        ads_enabled: globalSettings.ads_enabled,
        adsense_publisher_id: globalSettings.adsense_publisher_id || ''
    });

    const adForm = useForm({
        slot_name: '', page: 'all', position: 'top', size: 'responsive',
        ad_type: 'adsense', ad_code: '', image_url: '', link_url: '', link_target: '_blank',
        is_active: true, order: 0,
    });

    const toggleGlobalAds = () => {
        router.post('/admin/ads/toggle', { ads_enabled: !globalSettings.ads_enabled }, { preserveScroll: true });
    };
    const togglePlaceholders = () => {
        router.post('/admin/ads/toggle-placeholders', {}, { preserveScroll: true });
    };
    const updateGlobalSettings = (e) => {
        e.preventDefault();
        globalForm.post('/admin/ads/global-settings', { preserveScroll: true });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingAd) {
            adForm.put(`/admin/ads/${editingAd.id}`, {
                onSuccess: () => { setEditingAd(null); setShowModal(false); adForm.reset(); }
            });
        } else {
            adForm.post('/admin/ads', {
                onSuccess: () => { setShowModal(false); adForm.reset(); }
            });
        }
    };
    const deleteAd = (id) => {
        if (confirm('Delete this ad slot?')) adForm.delete(`/admin/ads/${id}`, { preserveScroll: true });
    };
    const toggleAdActive = (id) => {
        adForm.post(`/admin/ads/${id}/toggle`, { preserveScroll: true });
    };
    const toggleAdVisible = (id) => {
        router.post(`/admin/ads/${id}/toggle-visibility`, {}, { preserveScroll: true });
    };
    const openEdit = (ad) => {
        setEditingAd(ad);
        adForm.setData(ad);
        setShowModal(true);
    };
    const openAdd = () => {
        setEditingAd(null);
        adForm.reset();
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false); setEditingAd(null); adForm.reset();
    };

    const adSizes = [
        { value: 'responsive', label: 'Responsive (Auto)' },
        { value: 'leaderboard', label: 'Leaderboard (728x90)' },
        { value: 'large-leaderboard', label: 'Large Leaderboard (970x90)' },
        { value: 'medium-rectangle', label: 'Medium Rectangle (300x250)' },
        { value: 'large-rectangle', label: 'Large Rectangle (336x280)' },
        { value: 'wide-skyscraper', label: 'Wide Skyscraper (160x600)' },
        { value: 'half-page', label: 'Half Page (300x600)' },
        { value: 'mobile-banner', label: 'Mobile Banner (320x50)' },
        { value: 'large-mobile-banner', label: 'Large Mobile Banner (320x100)' },
    ];
    const pages = [
        { value: 'all', label: 'All Pages' }, { value: 'toolshed', label: 'Toolshed' },
        { value: 'tool-view', label: 'Tool View' }, { value: 'opportunities', label: 'Opportunities' },
        { value: 'opp-view', label: 'Opportunity View' },
    ];
    const positions = [
        { value: 'top', label: 'Top of Page' }, { value: 'sidebar-right', label: 'Right Sidebar' },
        { value: 'sidebar-left', label: 'Left Sidebar' }, { value: 'in-content-top', label: 'In Content (Top)' },
        { value: 'in-content-middle', label: 'In Content (Middle)' }, { value: 'in-content-bottom', label: 'In Content (Bottom)' },
        { value: 'bottom', label: 'Bottom of Page' }, { value: 'between-items', label: 'Between Items' },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Ad Management" />
            <Container fluid={true}>
                <Container>
                    <Row className="g-4" style={{ paddingTop: '96px', paddingBottom: '64px' }}>
                        <Col md={3} className="d-none d-md-block">
                            <AdminSideNav />
                        </Col>
                        <Col md={9} xs={12}>
                            {/* Header */}
                            <div style={{ marginBottom: '32px' }}>
                                <h2 style={{ fontSize: 'clamp(24px, 4vw, 28px)', fontWeight: 600, color: '#000', letterSpacing: '-0.02em', marginBottom: '6px' }}>
                                    Ad Management
                                </h2>
                                <p style={{ fontSize: '14px', color: '#86868b', margin: 0 }}>
                                    Manage Google AdSense and custom image ads across your website
                                </p>
                            </div>

                            {/* Flash Message */}
                            {flash?.success && (
                                <div style={{
                                    background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px',
                                    padding: '14px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px',
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#16a34a' }}>check_circle</span>
                                    <span style={{ fontSize: '14px', color: '#166534' }}>{flash.success}</span>
                                </div>
                            )}

                            {/* Global Settings */}
                            <div style={{
                                background: '#000', borderRadius: '16px', padding: '28px', marginBottom: '20px',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                                    <span style={{
                                        width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#fff' }}>settings</span>
                                    </span>
                                    <div>
                                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', margin: 0 }}>Global Settings</h3>
                                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Master controls for all ads</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                                        <div>
                                            <span style={{ fontSize: '14px', color: '#fff', fontWeight: 500 }}>Master Ads Toggle</span>
                                            <span style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                                                {globalSettings.ads_enabled ? 'Ads are currently live' : 'Ads are turned off'}
                                            </span>
                                        </div>
                                        <button type="button" onClick={toggleGlobalAds} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                            <span style={{
                                                width: '44px', height: '24px', borderRadius: '9999px',
                                                background: globalSettings.ads_enabled ? '#16a34a' : 'rgba(255,255,255,0.2)',
                                                position: 'relative', transition: 'background 0.2s ease',
                                            }}>
                                                <span style={{
                                                    width: '20px', height: '20px', borderRadius: '50%', background: '#fff',
                                                    position: 'absolute', top: '2px',
                                                    left: globalSettings.ads_enabled ? '22px' : '2px', transition: 'left 0.2s ease',
                                                }} />
                                            </span>
                                            <span style={{ fontSize: '13px', fontWeight: 500, color: globalSettings.ads_enabled ? '#16a34a' : 'rgba(255,255,255,0.5)' }}>
                                                {globalSettings.ads_enabled ? 'Enabled' : 'Disabled'}
                                            </span>
                                        </button>
                                    </div>

                                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                                        <div>
                                            <span style={{ fontSize: '14px', color: '#fff', fontWeight: 500 }}>Show Placeholders</span>
                                            <span style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                                                Display placeholder boxes where ads will appear
                                            </span>
                                        </div>
                                        <button type="button" onClick={togglePlaceholders} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                            <span style={{
                                                width: '44px', height: '24px', borderRadius: '9999px',
                                                background: globalSettings.show_placeholders !== false ? '#f97316' : 'rgba(255,255,255,0.2)',
                                                position: 'relative', transition: 'background 0.2s ease',
                                            }}>
                                                <span style={{
                                                    width: '20px', height: '20px', borderRadius: '50%', background: '#fff',
                                                    position: 'absolute', top: '2px',
                                                    left: globalSettings.show_placeholders !== false ? '22px' : '2px', transition: 'left 0.2s ease',
                                                }} />
                                            </span>
                                            <span style={{ fontSize: '13px', fontWeight: 500, color: globalSettings.show_placeholders !== false ? '#f97316' : 'rgba(255,255,255,0.5)' }}>
                                                {globalSettings.show_placeholders !== false ? 'Shown' : 'Hidden'}
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                <form onSubmit={updateGlobalSettings}>
                                    <label style={{ ...labelStyle, color: 'rgba(255,255,255,0.5)' }}>AdSense Publisher ID</label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input
                                            type="text"
                                            placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                                            value={globalForm.data.adsense_publisher_id}
                                            onChange={e => globalForm.setData('adsense_publisher_id', e.target.value)}
                                            style={{ ...inputStyle, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', flex: 1 }}
                                            onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'}
                                            onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
                                        />
                                        <button type="submit" disabled={globalForm.processing} style={{
                                            padding: '10px 24px', borderRadius: '9999px', border: 'none',
                                            background: '#fff', color: '#000', fontSize: '13px', fontWeight: 500,
                                            cursor: globalForm.processing ? 'not-allowed' : 'pointer', transition: 'all 0.15s ease', flexShrink: 0,
                                        }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f7'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Ad Slots */}
                            <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '16px', padding: '28px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                                    <div>
                                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#000', margin: '0 0 4px' }}>
                                            Ad Slots
                                        </h3>
                                        <span style={{ fontSize: '13px', color: '#86868b' }}>{adSettings.length} slot{adSettings.length !== 1 ? 's' : ''} configured</span>
                                    </div>
                                    <button onClick={openAdd} style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                        padding: '8px 18px', borderRadius: '9999px', border: 'none',
                                        background: '#000', color: '#fff', fontSize: '13px', fontWeight: 500,
                                        cursor: 'pointer', transition: 'all 0.15s ease',
                                    }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#333'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = '#000'}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
                                        Add Slot
                                    </button>
                                </div>

                                {adSettings.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '48px 0' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#d1d1d6', display: 'block', marginBottom: '12px' }}>ad_units</span>
                                        <p style={{ fontSize: '14px', color: '#86868b', margin: 0 }}>No ad slots yet. Click "Add Slot" to get started.</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {adSettings.map(ad => (
                                            <div key={ad.id} style={{
                                                padding: '16px 20px', borderRadius: '12px', border: '1px solid #f0f0f0',
                                                transition: 'all 0.15s ease',
                                            }}
                                                onMouseEnter={(e) => { e.currentTarget.style.background = '#fafafa'; e.currentTarget.style.borderColor = '#e5e5e7'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#f0f0f0'; }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                                                    <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#000' }}>{ad.slot_name}</span>
                                                            <span style={{
                                                                fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '9999px',
                                                                color: ad.is_active ? '#16a34a' : '#dc2626',
                                                                background: ad.is_active ? '#f0fdf4' : '#fef2f2',
                                                            }}>
                                                                {ad.is_active ? 'Active' : 'Inactive'}
                                                            </span>
                                                            <span style={{
                                                                fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '9999px',
                                                                color: (ad.ad_type || 'adsense') === 'custom' ? '#9333ea' : '#2563eb',
                                                                background: (ad.ad_type || 'adsense') === 'custom' ? '#faf5ff' : '#eff6ff',
                                                            }}>
                                                                {(ad.ad_type || 'adsense') === 'custom' ? 'Custom Image' : 'AdSense'}
                                                            </span>
                                                            {(ad.ad_code || ad.image_url) && (
                                                                <span style={{
                                                                    fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '9999px',
                                                                    color: '#000', background: '#f5f5f7',
                                                                }}>
                                                                    Has Content
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                                            {[
                                                                { icon: 'web', val: pages.find(p => p.value === ad.page)?.label || ad.page },
                                                                { icon: 'pin_drop', val: positions.find(p => p.value === ad.position)?.label || ad.position },
                                                                { icon: 'aspect_ratio', val: adSizes.find(s => s.value === ad.size)?.label || ad.size },
                                                                { icon: 'sort', val: `Order: ${ad.order}` },
                                                            ].map((meta, i) => (
                                                                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#86868b' }}>
                                                                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{meta.icon}</span>
                                                                    {meta.val}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                                                        <button onClick={() => openEdit(ad)} title="Edit" style={{
                                                            width: '32px', height: '32px', borderRadius: '8px', background: '#f5f5f7',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            border: 'none', cursor: 'pointer', transition: 'all 0.15s ease',
                                                        }}
                                                            onMouseEnter={(e) => e.currentTarget.style.background = '#e5e5e7'}
                                                            onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f7'}
                                                        >
                                                            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#6e6e73' }}>edit</span>
                                                        </button>
                                                        <button onClick={() => toggleAdActive(ad.id)} title={ad.is_active ? 'Deactivate' : 'Activate'} style={{
                                                            width: '32px', height: '32px', borderRadius: '8px',
                                                            background: ad.is_active ? '#f0fdf4' : '#f5f5f7',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            border: 'none', cursor: 'pointer', transition: 'all 0.15s ease',
                                                        }}
                                                            onMouseEnter={(e) => e.currentTarget.style.background = ad.is_active ? '#bbf7d0' : '#e5e5e7'}
                                                            onMouseLeave={(e) => e.currentTarget.style.background = ad.is_active ? '#f0fdf4' : '#f5f5f7'}
                                                        >
                                                            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: ad.is_active ? '#16a34a' : '#6e6e73' }}>
                                                                {ad.is_active ? 'toggle_on' : 'toggle_off'}
                                                            </span>
                                                        </button>
                                                        <button onClick={() => deleteAd(ad.id)} title="Delete" style={{
                                                            width: '32px', height: '32px', borderRadius: '8px', background: '#fef2f2',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            border: 'none', cursor: 'pointer', transition: 'all 0.15s ease',
                                                        }}
                                                            onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
                                                            onMouseLeave={(e) => e.currentTarget.style.background = '#fef2f2'}
                                                        >
                                                            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#dc2626' }}>delete</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Container>

            {/* Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 9999,
                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
                }} onClick={closeModal}>
                    <div style={{
                        background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '640px',
                        maxHeight: '90vh', overflowY: 'auto',
                    }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ padding: '24px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#000', margin: 0 }}>
                                {editingAd ? 'Edit Ad Slot' : 'Add New Ad Slot'}
                            </h3>
                            <button onClick={closeModal} style={{
                                width: '32px', height: '32px', borderRadius: '50%', background: '#f5f5f7',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: 'none', cursor: 'pointer',
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#6e6e73' }}>close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={labelStyle}>Slot Name *</label>
                                        <input type="text" placeholder="e.g., home_top_banner" value={adForm.data.slot_name}
                                            onChange={e => adForm.setData('slot_name', e.target.value)} required
                                            style={inputStyle} onFocus={focusH} onBlur={blurH} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Page *</label>
                                        <select value={adForm.data.page} onChange={e => adForm.setData('page', e.target.value)}
                                            style={{ ...inputStyle, cursor: 'pointer' }}>
                                            {pages.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Position *</label>
                                        <select value={adForm.data.position} onChange={e => adForm.setData('position', e.target.value)}
                                            style={{ ...inputStyle, cursor: 'pointer' }}>
                                            {positions.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Ad Size *</label>
                                        <select value={adForm.data.size} onChange={e => adForm.setData('size', e.target.value)}
                                            style={{ ...inputStyle, cursor: 'pointer' }}>
                                            {adSizes.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Display Order</label>
                                        <input type="number" value={adForm.data.order}
                                            onChange={e => adForm.setData('order', parseInt(e.target.value) || 0)}
                                            style={inputStyle} onFocus={focusH} onBlur={blurH} />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '4px' }}>
                                        <Toggle checked={adForm.data.is_active}
                                            onChange={() => adForm.setData('is_active', !adForm.data.is_active)}
                                            label={adForm.data.is_active ? 'Active' : 'Inactive'} />
                                    </div>
                                </div>
                                {/* Ad Type Selector */}
                                <div>
                                    <label style={labelStyle}>Ad Type *</label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {[
                                            { value: 'adsense', label: 'Google AdSense', icon: 'code' },
                                            { value: 'custom', label: 'Custom Image', icon: 'image' },
                                        ].map(t => (
                                            <button key={t.value} type="button"
                                                onClick={() => adForm.setData('ad_type', t.value)}
                                                style={{
                                                    flex: 1, padding: '12px 16px', borderRadius: '12px', cursor: 'pointer',
                                                    border: adForm.data.ad_type === t.value ? '2px solid #000' : '1px solid #e5e5e7',
                                                    background: adForm.data.ad_type === t.value ? '#f5f5f7' : '#fff',
                                                    display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.15s ease',
                                                }}
                                            >
                                                <span className="material-symbols-outlined" style={{
                                                    fontSize: '20px', color: adForm.data.ad_type === t.value ? '#000' : '#86868b',
                                                }}>{t.icon}</span>
                                                <span style={{
                                                    fontSize: '13px', fontWeight: adForm.data.ad_type === t.value ? 600 : 400,
                                                    color: adForm.data.ad_type === t.value ? '#000' : '#86868b',
                                                }}>{t.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* AdSense fields */}
                                {adForm.data.ad_type === 'adsense' && (
                                    <div>
                                        <label style={labelStyle}>Ad Code</label>
                                        <textarea
                                            rows="6" placeholder="Paste your Google AdSense ad unit code here..."
                                            value={adForm.data.ad_code || ''}
                                            onChange={e => adForm.setData('ad_code', e.target.value)}
                                            style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '13px', resize: 'vertical', minHeight: '120px' }}
                                            onFocus={focusH} onBlur={blurH}
                                        />
                                        <span style={{ display: 'block', fontSize: '12px', color: '#b0b0b5', marginTop: '4px' }}>
                                            Paste the full ad unit code from Google AdSense. Leave empty for placeholder only.
                                        </span>
                                    </div>
                                )}

                                {/* Custom image ad fields */}
                                {adForm.data.ad_type === 'custom' && (
                                    <>
                                        <div>
                                            <label style={labelStyle}>Image URL *</label>
                                            <input type="url" placeholder="https://example.com/ad-banner.jpg"
                                                value={adForm.data.image_url || ''}
                                                onChange={e => adForm.setData('image_url', e.target.value)}
                                                style={inputStyle} onFocus={focusH} onBlur={blurH}
                                            />
                                            <span style={{ display: 'block', fontSize: '12px', color: '#b0b0b5', marginTop: '4px' }}>
                                                Direct URL to the ad image (JPG, PNG, GIF, WebP)
                                            </span>
                                        </div>
                                        {adForm.data.image_url && (
                                            <div style={{
                                                padding: '12px', background: '#f5f5f7', borderRadius: '12px',
                                                textAlign: 'center',
                                            }}>
                                                <span style={{ display: 'block', fontSize: '11px', color: '#86868b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>Preview</span>
                                                <img src={adForm.data.image_url} alt="Ad preview"
                                                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', objectFit: 'contain' }}
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                />
                                            </div>
                                        )}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px' }}>
                                            <div>
                                                <label style={labelStyle}>Link URL</label>
                                                <input type="url" placeholder="https://example.com/landing-page"
                                                    value={adForm.data.link_url || ''}
                                                    onChange={e => adForm.setData('link_url', e.target.value)}
                                                    style={inputStyle} onFocus={focusH} onBlur={blurH}
                                                />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Open In</label>
                                                <select value={adForm.data.link_target || '_blank'}
                                                    onChange={e => adForm.setData('link_target', e.target.value)}
                                                    style={{ ...inputStyle, cursor: 'pointer' }}>
                                                    <option value="_blank">New Tab</option>
                                                    <option value="_self">Same Tab</option>
                                                </select>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div style={{
                                padding: '16px 28px 24px', display: 'flex', gap: '8px', justifyContent: 'flex-end',
                            }}>
                                <button type="button" onClick={closeModal} style={{
                                    padding: '10px 24px', borderRadius: '9999px', border: '1px solid #e5e5e7',
                                    background: '#fff', color: '#6e6e73', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                                }}>Cancel</button>
                                <button type="submit" disabled={adForm.processing} style={{
                                    padding: '10px 24px', borderRadius: '9999px', border: 'none',
                                    background: '#000', color: '#fff', fontSize: '13px', fontWeight: 500,
                                    cursor: adForm.processing ? 'not-allowed' : 'pointer', transition: 'all 0.15s ease',
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#333'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = '#000'}
                                >
                                    {editingAd ? 'Update' : 'Create'} Ad Slot
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
