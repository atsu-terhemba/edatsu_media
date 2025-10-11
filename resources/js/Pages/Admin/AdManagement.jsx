import React, { useState } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col } from 'react-bootstrap';
import AdminSideNav from './Components/SideNav';

export default function AdManagement({ globalSettings, adSettings }) {
    const { flash } = usePage().props;
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingAd, setEditingAd] = useState(null);

    const globalForm = useForm({
        ads_enabled: globalSettings.ads_enabled,
        adsense_publisher_id: globalSettings.adsense_publisher_id || ''
    });

    const adForm = useForm({
        slot_name: '',
        page: 'all',
        position: 'top',
        size: 'responsive',
        ad_code: '',
        is_active: true,
        order: 0
    });

    const toggleGlobalAds = () => {
        router.post('/admin/ads/toggle', {
            ads_enabled: !globalSettings.ads_enabled
        }, {
            preserveScroll: true
        });
    };

    const updateGlobalSettings = (e) => {
        e.preventDefault();
        globalForm.post('/admin/ads/global-settings', {
            preserveScroll: true
        });
    };

    const handleAddAd = (e) => {
        e.preventDefault();
        adForm.post('/admin/ads', {
            onSuccess: () => {
                setShowAddModal(false);
                adForm.reset();
            }
        });
    };

    const handleUpdateAd = (e) => {
        e.preventDefault();
        adForm.put(`/admin/ads/${editingAd.id}`, {
            onSuccess: () => {
                setEditingAd(null);
                adForm.reset();
            }
        });
    };

    const deleteAd = (id) => {
        if (confirm('Are you sure you want to delete this ad slot?')) {
            adForm.delete(`/admin/ads/${id}`, {
                preserveScroll: true
            });
        }
    };

    const toggleAdActive = (id) => {
        adForm.post(`/admin/ads/${id}/toggle`, {
            preserveScroll: true
        });
    };

    const toggleAdVisible = (id) => {
        router.post(`/admin/ads/${id}/toggle-visibility`, {}, {
            preserveScroll: true
        });
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
        { value: 'large-mobile-banner', label: 'Large Mobile Banner (320x100)' }
    ];

    const pages = [
        { value: 'all', label: 'All Pages' },
        { value: 'toolshed', label: 'Toolshed' },
        { value: 'tool-view', label: 'Tool View' },
        { value: 'opportunities', label: 'Opportunities' },
        { value: 'opp-view', label: 'Opportunity View' }
    ];

    const positions = [
        { value: 'top', label: 'Top of Page' },
        { value: 'sidebar-right', label: 'Right Sidebar' },
        { value: 'sidebar-left', label: 'Left Sidebar' },
        { value: 'in-content-top', label: 'In Content (Top)' },
        { value: 'in-content-middle', label: 'In Content (Middle)' },
        { value: 'in-content-bottom', label: 'In Content (Bottom)' },
        { value: 'bottom', label: 'Bottom of Page' },
        { value: 'between-items', label: 'Between Items' }
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Ad Management" />
            
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
                                <div className="row mb-4">
                                    <div className="col">
                                        <h2 className="mb-0">Ad Management</h2>
                                        <p className="text-muted">Manage Google AdSense placements across your website</p>
                                    </div>
                                </div>

                {flash?.success && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        {flash.success}
                        <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                )}

                {/* Global Settings Card */}
                <div className="card mb-4">
                    <div className="card-header bg-primary text-white">
                        <h5 className="mb-3">Global Ad Settings</h5>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span>Master Ads Toggle</span>
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    checked={globalSettings.ads_enabled}
                                    onChange={toggleGlobalAds}
                                    style={{ fontSize: '1.5rem', cursor: 'pointer' }}
                                />
                                <label className="form-check-label text-white ms-2">
                                    <strong>{globalSettings.ads_enabled ? 'Ads Enabled' : 'Ads Disabled'}</strong>
                                </label>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                            <span>Show Placeholders</span>
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    checked={globalSettings.show_placeholders !== false}
                                    onChange={() => router.post('/admin/ads/toggle-placeholders', {}, { preserveScroll: true })}
                                    style={{ fontSize: '1.5rem', cursor: 'pointer' }}
                                />
                                <label className="form-check-label text-white ms-2">
                                    <strong>{globalSettings.show_placeholders !== false ? 'Placeholders Shown' : 'Placeholders Hidden'}</strong>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <form onSubmit={updateGlobalSettings}>
                            <div className="mb-3">
                                <label className="form-label">AdSense Publisher ID</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                                    value={globalForm.data.adsense_publisher_id}
                                    onChange={e => globalForm.setData('adsense_publisher_id', e.target.value)}
                                />
                                <small className="text-muted">Your Google AdSense publisher ID</small>
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={globalForm.processing}>
                                Save Global Settings
                            </button>
                        </form>
                    </div>
                </div>

                {/* Ad Slots Management */}
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Ad Slots ({adSettings.length})</h5>
                        <button className="btn btn-success btn-sm" onClick={() => setShowAddModal(true)}>
                            <span className="material-symbols-outlined" style={{ fontSize: '18px', verticalAlign: 'middle' }}>add</span>
                            Add New Ad Slot
                        </button>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Slot Name</th>
                                        <th>Page</th>
                                        <th>Position</th>
                                        <th>Size</th>
                                        <th>Status</th>
                                        <th>Visible</th>
                                        <th>Order</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adSettings.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="text-center text-muted py-4">
                                                No ad slots configured yet. Click "Add New Ad Slot" to get started.
                                            </td>
                                        </tr>
                                    ) : (
                                        adSettings.map(ad => (
                                            <tr key={ad.id}>
                                                <td><strong>{ad.slot_name}</strong></td>
                                                <td><span className="badge bg-secondary">{ad.page}</span></td>
                                                <td>{ad.position}</td>
                                                <td>{ad.size}</td>
                                                <td>
                                                    <span className={`badge ${ad.is_active ? 'bg-success' : 'bg-danger'}`}>
                                                        {ad.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${ad.is_visible ? 'bg-info' : 'bg-warning'}`}>
                                                        {ad.is_visible ? 'Shown' : 'Hidden'}
                                                    </span>
                                                </td>
                                                <td>{ad.order}</td>
                                                <td>
                                                    <div className="btn-group btn-group-sm">
                                                        <button
                                                            className="btn btn-outline-primary"
                                                            onClick={() => {
                                                                setEditingAd(ad);
                                                                adForm.setData(ad);
                                                            }}
                                                            title="Edit"
                                                        >
                                                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>
                                                        </button>
                                                        <button
                                                            className={`btn btn-outline-${ad.is_active ? 'warning' : 'success'}`}
                                                            onClick={() => toggleAdActive(ad.id)}
                                                            title={ad.is_active ? 'Deactivate Ad' : 'Activate Ad'}
                                                        >
                                                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                                                                {ad.is_active ? 'visibility_off' : 'visibility'}
                                                            </span>
                                                        </button>
                                                        <button
                                                            className={`btn btn-outline-${ad.is_visible ? 'secondary' : 'info'}`}
                                                            onClick={() => toggleAdVisible(ad.id)}
                                                            title={ad.is_visible ? 'Hide Placeholder' : 'Show Placeholder'}
                                                        >
                                                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                                                                {ad.is_visible ? 'hide_source' : 'web'}
                                                            </span>
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-danger"
                                                            onClick={() => deleteAd(ad.id)}
                                                            title="Delete"
                                                        >
                                                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            {/* Add/Edit Modal */}
            {(showAddModal || editingAd) && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{editingAd ? 'Edit Ad Slot' : 'Add New Ad Slot'}</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setEditingAd(null);
                                        adForm.reset();
                                    }}
                                ></button>
                            </div>
                            <form onSubmit={editingAd ? handleUpdateAd : handleAddAd}>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Slot Name *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="e.g., home_top_banner"
                                                value={adForm.data.slot_name}
                                                onChange={e => adForm.setData('slot_name', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Page *</label>
                                            <select
                                                className="form-select"
                                                value={adForm.data.page}
                                                onChange={e => adForm.setData('page', e.target.value)}
                                                required
                                            >
                                                {pages.map(page => (
                                                    <option key={page.value} value={page.value}>{page.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Position *</label>
                                            <select
                                                className="form-select"
                                                value={adForm.data.position}
                                                onChange={e => adForm.setData('position', e.target.value)}
                                                required
                                            >
                                                {positions.map(pos => (
                                                    <option key={pos.value} value={pos.value}>{pos.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Ad Size *</label>
                                            <select
                                                className="form-select"
                                                value={adForm.data.size}
                                                onChange={e => adForm.setData('size', e.target.value)}
                                                required
                                            >
                                                {adSizes.map(size => (
                                                    <option key={size.value} value={size.value}>{size.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Display Order</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={adForm.data.order}
                                                onChange={e => adForm.setData('order', parseInt(e.target.value))}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Status</label>
                                            <div className="form-check form-switch mt-2">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={adForm.data.is_active}
                                                    onChange={e => adForm.setData('is_active', e.target.checked)}
                                                />
                                                <label className="form-check-label">
                                                    {adForm.data.is_active ? 'Active' : 'Inactive'}
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-12 mb-3">
                                            <label className="form-label">Ad Code (Leave empty for placeholder)</label>
                                            <textarea
                                                className="form-control font-monospace"
                                                rows="6"
                                                placeholder="Paste your Google AdSense code here..."
                                                value={adForm.data.ad_code}
                                                onChange={e => adForm.setData('ad_code', e.target.value)}
                                            />
                                            <small className="text-muted">The HTML code from Google AdSense</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary" 
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setEditingAd(null);
                                            adForm.reset();
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={adForm.processing}>
                                        {editingAd ? 'Update' : 'Create'} Ad Slot
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Container>
        </AuthenticatedLayout>
    );
}
