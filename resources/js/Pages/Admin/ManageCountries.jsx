import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminSideNav from './Components/SideNav';
import axios from 'axios';

function SectionHeader({ eyebrow, title, action }) {
    return (
        <div className="d-flex justify-content-between align-items-start mb-4" style={{ paddingBottom: '16px' }}>
            <div>
                <div style={{ fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#86868b', marginBottom: '8px' }}>{eyebrow}</div>
                <div style={{ width: '24px', height: '2px', backgroundColor: '#f97316', borderRadius: '9999px', marginBottom: '12px' }} />
                <h2 style={{ fontSize: '30px', fontWeight: 600, color: '#000', margin: 0, letterSpacing: '-0.01em' }}>{title}</h2>
            </div>
            {action}
        </div>
    );
}

function ItemCard({ item, icon, onEdit, onDelete }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
            style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#fff', border: `1px solid ${hovered ? '#e5e5e5' : '#f0f0f0'}`, boxShadow: hovered ? '0 20px 40px rgba(0,0,0,0.08)' : 'none', transition: 'all 300ms ease', transform: hovered ? 'translateY(-4px)' : 'translateY(0)', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '9999px', flexShrink: 0, backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 300ms ease', transform: hovered ? 'scale(1.1)' : 'scale(1)' }}>
                <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '22px' }}>{icon}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#000', marginBottom: '2px', letterSpacing: '-0.01em' }}>{item.name}</div>
                <div style={{ fontSize: '13px', color: '#86868b', fontFamily: 'monospace', marginBottom: '4px' }}>{item.slug}</div>
                {item.description && <div style={{ fontSize: '14px', color: '#6e6e73', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</div>}
            </div>
            <div style={{ fontSize: '12px', color: '#86868b', flexShrink: 0, textAlign: 'right', minWidth: '80px' }}>{new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button onClick={() => onEdit(item)} style={{ width: '36px', height: '36px', borderRadius: '9999px', border: '1px solid #e5e5e5', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 150ms ease' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#000'; e.currentTarget.style.borderColor = '#000'; e.currentTarget.querySelector('span').style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.querySelector('span').style.color = '#000'; }}
                    title="Edit"><span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#000', transition: 'color 150ms ease' }}>edit</span></button>
                <button onClick={() => onDelete(item.id)} style={{ width: '36px', height: '36px', borderRadius: '9999px', border: '1px solid #e5e5e5', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 150ms ease' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#dc2626'; e.currentTarget.style.borderColor = '#dc2626'; e.currentTarget.querySelector('span').style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.querySelector('span').style.color = '#dc2626'; }}
                    title="Delete"><span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#dc2626', transition: 'color 150ms ease' }}>delete</span></button>
            </div>
        </div>
    );
}

function StyledModal({ show, onHide, eyebrow, title, children }) {
    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <div style={{ borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ padding: '24px 32px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#86868b', marginBottom: '6px' }}>{eyebrow}</div>
                        <div style={{ width: '20px', height: '2px', backgroundColor: '#f97316', borderRadius: '9999px', marginBottom: '10px' }} />
                        <h3 style={{ fontSize: '22px', fontWeight: 600, color: '#000', margin: 0 }}>{title}</h3>
                    </div>
                    <button onClick={onHide} style={{ width: '32px', height: '32px', borderRadius: '9999px', border: '1px solid #e5e5e5', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#86868b' }}>close</span>
                    </button>
                </div>
                {children}
            </div>
        </Modal>
    );
}

const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e5e5e5', fontSize: '14px', color: '#000', outline: 'none', transition: 'border-color 150ms ease', fontFamily: 'inherit' };
const labelStyle = { fontSize: '12px', fontWeight: 500, color: '#6e6e73', marginBottom: '6px', display: 'block' };

export default function ManageCountries({ countries, edit }) {
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingCountry, setEditingCountry] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({ name: '', slug: '', description: '' });

    useState(() => { if (edit) { setFormData({ name: edit.name || '', slug: edit.slug || '', description: edit.description || '' }); setShowEditModal(true); setEditingCountry(edit); } }, [edit]);

    const showAlertMsg = (message, type = 'success') => { setAlert({ show: true, message, type }); setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 5000); };
    const handleInputChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); if (name === 'name') { setFormData(prev => ({ ...prev, slug: value.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-') })); } };
    const resetForm = () => { setFormData({ name: '', slug: '', description: '' }); setEditingCountry(null); };

    const handleSubmit = async (e) => {
        e.preventDefault(); setIsLoading(true);
        try {
            const url = editingCountry ? `/edit-country/${editingCountry.id}` : '/admin-store-country';
            const response = await axios.post(url, { ...formData, post_id: editingCountry?.id || null });
            if (response.data.success) { showAlertMsg(response.data.message, 'success'); resetForm(); setShowModal(false); setShowEditModal(false); router.visit(route('admin.countries'), { preserveState: false }); }
            else { showAlertMsg(response.data.message || 'An error occurred', 'danger'); }
        } catch (error) { showAlertMsg(error.response?.data?.message || 'An error occurred while saving', 'danger'); }
        finally { setIsLoading(false); }
    };

    const handleEdit = (country) => { setEditingCountry(country); setFormData({ name: country.name, slug: country.slug, description: country.description }); setShowEditModal(true); };
    const handleDelete = async (countryId) => {
        if (!confirm('Are you sure you want to delete this country?')) return;
        setIsLoading(true);
        try {
            const response = await axios.post('/delete-country', { id: countryId });
            if (response.data.success) { showAlertMsg(response.data.message, 'success'); router.visit(route('admin.countries'), { preserveState: false }); }
            else { showAlertMsg(response.data.message || 'An error occurred', 'danger'); }
        } catch (error) { showAlertMsg(error.response?.data?.message || 'An error occurred while deleting', 'danger'); }
        finally { setIsLoading(false); }
    };

    const filtered = countries.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.slug.toLowerCase().includes(searchQuery.toLowerCase()));

    const ItemForm = ({ onCancel, submitLabel }) => (
        <form onSubmit={handleSubmit}>
            <div style={{ padding: '32px' }}>
                <div style={{ marginBottom: '24px' }}><label style={labelStyle}>Country Name *</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Enter country name" style={inputStyle} onFocus={e => e.target.style.borderColor = '#000'} onBlur={e => e.target.style.borderColor = '#e5e5e5'} /></div>
                <div style={{ marginBottom: '24px' }}><label style={labelStyle}>Slug *</label><input type="text" name="slug" value={formData.slug} onChange={handleInputChange} required placeholder="country-slug" style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '13px' }} onFocus={e => e.target.style.borderColor = '#000'} onBlur={e => e.target.style.borderColor = '#e5e5e5'} /><div style={{ fontSize: '12px', color: '#86868b', marginTop: '6px' }}>URL-friendly version of the name (auto-generated)</div></div>
                <div style={{ marginBottom: '8px' }}><label style={labelStyle}>Description *</label><textarea name="description" value={formData.description} onChange={handleInputChange} required rows={3} placeholder="Enter country description" style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} onFocus={e => e.target.style.borderColor = '#000'} onBlur={e => e.target.style.borderColor = '#e5e5e5'} /></div>
            </div>
            <div style={{ padding: '20px 32px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={onCancel} style={{ padding: '10px 24px', borderRadius: '9999px', border: '1px solid #e5e5e5', backgroundColor: '#fff', fontSize: '14px', fontWeight: 500, color: '#000', cursor: 'pointer', transition: 'all 150ms ease' }}>Cancel</button>
                <button type="submit" disabled={isLoading} style={{ padding: '10px 24px', borderRadius: '9999px', border: 'none', backgroundColor: '#000', fontSize: '14px', fontWeight: 500, color: '#fff', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.6 : 1, transition: 'all 150ms ease' }}>{isLoading ? 'Saving...' : submitLabel}</button>
            </div>
        </form>
    );

    return (
        <AuthenticatedLayout>
            <Head title="Manage Countries" />
            <Container style={{ paddingTop: '70px', paddingBottom: '16px', maxWidth: '1280px' }}>
                <Row>
                    <Col md={3}><AdminSideNav /></Col>
                    <Col md={9}>
                        <div style={{ padding: '8px 0' }}>
                            <SectionHeader eyebrow="General" title="Countries" action={
                                <button onClick={() => { resetForm(); setShowModal(true); }} style={{ padding: '10px 24px', borderRadius: '9999px', border: 'none', backgroundColor: '#000', color: '#fff', fontSize: '14px', fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'background-color 150ms ease' }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#333'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#000'}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>Add Country
                                </button>
                            } />
                            {alert.show && (
                                <div style={{ padding: '14px 20px', borderRadius: '12px', backgroundColor: alert.type === 'success' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${alert.type === 'success' ? '#bbf7d0' : '#fecaca'}`, color: alert.type === 'success' ? '#166534' : '#991b1b', fontSize: '14px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{alert.type === 'success' ? 'check_circle' : 'error'}</span>{alert.message}</div>
                                    <button onClick={() => setAlert({ show: false, message: '', type: 'success' })} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}><span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'inherit' }}>close</span></button>
                                </div>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                                <div style={{ fontSize: '14px', color: '#86868b' }}>{filtered.length} {filtered.length === 1 ? 'country' : 'countries'}</div>
                                <div style={{ position: 'relative', width: '280px' }}>
                                    <span className="material-symbols-outlined" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: '#86868b' }}>search</span>
                                    <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search countries..." style={{ ...inputStyle, paddingLeft: '40px', borderColor: '#f0f0f0', backgroundColor: '#f5f5f7' }}
                                        onFocus={e => { e.target.style.borderColor = '#000'; e.target.style.backgroundColor = '#fff'; }} onBlur={e => { e.target.style.borderColor = '#f0f0f0'; e.target.style.backgroundColor = '#f5f5f7'; }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {filtered.length > 0 ? filtered.map(country => <ItemCard key={country.id} item={country} icon="flag" onEdit={handleEdit} onDelete={handleDelete} />) : (
                                    <div style={{ padding: '64px 32px', borderRadius: '16px', backgroundColor: '#f5f5f7', textAlign: 'center' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#d1d1d6', display: 'block', marginBottom: '16px' }}>flag</span>
                                        <div style={{ fontSize: '16px', fontWeight: 600, color: '#000', marginBottom: '8px' }}>{searchQuery ? 'No matching countries' : 'No countries yet'}</div>
                                        <div style={{ fontSize: '14px', color: '#86868b' }}>{searchQuery ? 'Try adjusting your search query.' : 'Create your first country to get started.'}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
            <StyledModal show={showModal} onHide={() => setShowModal(false)} eyebrow="Country" title="Add New Country"><ItemForm onCancel={() => setShowModal(false)} submitLabel="Save Country" /></StyledModal>
            <StyledModal show={showEditModal} onHide={() => setShowEditModal(false)} eyebrow="Country" title="Edit Country"><ItemForm onCancel={() => setShowEditModal(false)} submitLabel="Update Country" /></StyledModal>
        </AuthenticatedLayout>
    );
}
