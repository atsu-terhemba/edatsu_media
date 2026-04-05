import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col } from 'react-bootstrap';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminSideNav from './Components/SideNav';
import axios from 'axios';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
    toast: true, position: 'top-end', showConfirmButton: false, timer: 2000, timerProgressBar: true,
});

const TABS = [
    { key: 'pending', label: 'Pending' },
    { key: 'actioned', label: 'Actioned' },
    { key: 'dismissed', label: 'Dismissed' },
    { key: 'all', label: 'All' },
];

const ForumReports = ({ reports: initialReports = [], status = 'pending', counts = {} }) => {
    const [reports, setReports] = useState(initialReports);
    const [busyId, setBusyId] = useState(null);

    const switchTab = (key) => {
        router.get('/admin-forum-reports', { status: key }, { preserveState: false, preserveScroll: false });
    };

    const action = async (report_id, act) => {
        setBusyId(report_id);
        try {
            await axios.post('/admin-forum-reports/action', { report_id, action: act });
            setReports((prev) => prev.filter((r) => r.id !== report_id));
            const label = act === 'hide' ? 'Content hidden' : act === 'unhide' ? 'Content unhidden' : 'Report dismissed';
            Toast.fire({ icon: 'success', title: label });
        } catch {
            Toast.fire({ icon: 'error', title: 'Action failed' });
        } finally {
            setBusyId(null);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Forum Reports" />
            <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f7' }}>
                <AdminSideNav />
                <div style={{ flex: 1, padding: '32px' }}>
                    <Container fluid>
                        <Row className="mb-4">
                            <Col>
                                <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#000', margin: 0 }}>Forum Reports</h1>
                                <p style={{ fontSize: '13px', color: '#86868b', margin: '4px 0 0' }}>
                                    Moderation queue
                                </p>
                            </Col>
                        </Row>

                        {/* Status tabs */}
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
                            {TABS.map((t) => {
                                const active = status === t.key;
                                const count = counts[t.key] ?? 0;
                                return (
                                    <button
                                        key={t.key}
                                        onClick={() => switchTab(t.key)}
                                        style={{
                                            padding: '6px 14px', borderRadius: '9999px',
                                            border: active ? 'none' : '1px solid #e5e5e5',
                                            background: active ? '#000' : '#fff',
                                            color: active ? '#fff' : '#86868b',
                                            fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                                        }}
                                    >
                                        {t.label}
                                        <span style={{
                                            fontSize: '10px', fontWeight: 600,
                                            background: active ? 'rgba(255,255,255,0.2)' : '#f5f5f7',
                                            color: active ? '#fff' : '#86868b',
                                            padding: '1px 7px', borderRadius: '9999px',
                                        }}>{count}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {reports.length === 0 ? (
                            <div style={{
                                background: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0',
                                padding: '48px 24px', textAlign: 'center',
                            }}>
                                <p style={{ fontSize: '14px', color: '#86868b', margin: 0 }}>No reports in this view.</p>
                            </div>
                        ) : (
                            <Row>
                                {reports.map((r) => (
                                    <Col xs={12} key={r.id} className="mb-3">
                                        <div style={{
                                            background: '#fff', borderRadius: '12px', border: '1px solid #f0f0f0',
                                            padding: '20px',
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '12px' }}>
                                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                    <span style={{
                                                        fontSize: '10px', fontWeight: 600, color: '#f97316',
                                                        textTransform: 'uppercase', letterSpacing: '0.5px',
                                                        background: '#fff7ed', padding: '2px 8px', borderRadius: '9999px',
                                                        border: '1px solid #fed7aa',
                                                    }}>
                                                        {r.type}
                                                    </span>
                                                    {r.target_hidden && (
                                                        <span style={{
                                                            fontSize: '10px', fontWeight: 600, color: '#86868b',
                                                            background: '#f5f5f7', padding: '2px 8px', borderRadius: '9999px',
                                                        }}>
                                                            hidden
                                                        </span>
                                                    )}
                                                </div>
                                                <span style={{ fontSize: '11px', color: '#b0b0b5' }}>{r.created_at}</span>
                                            </div>

                                            <a
                                                href={`/forum/${r.target_id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ textDecoration: 'none' }}
                                            >
                                                <p style={{ fontSize: '13px', color: '#000', margin: '0 0 10px', lineHeight: 1.5 }}>
                                                    {r.target_preview}
                                                </p>
                                            </a>

                                            {r.reason && (
                                                <div style={{ background: '#f5f5f7', padding: '10px 12px', borderRadius: '8px', marginBottom: '12px' }}>
                                                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#86868b', textTransform: 'uppercase', marginBottom: '4px' }}>Reason</div>
                                                    <div style={{ fontSize: '12px', color: '#000' }}>{r.reason}</div>
                                                </div>
                                            )}

                                            <div style={{ fontSize: '11px', color: '#86868b', marginBottom: '12px' }}>
                                                Reported by {r.reporter || 'unknown'}
                                            </div>

                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                {!r.target_hidden && (
                                                    <button
                                                        onClick={() => action(r.id, 'hide')}
                                                        disabled={busyId === r.id}
                                                        style={{
                                                            padding: '8px 16px', borderRadius: '9999px', border: 'none',
                                                            background: '#000', color: '#fff', fontSize: '12px', fontWeight: 500,
                                                            cursor: busyId === r.id ? 'wait' : 'pointer',
                                                        }}
                                                    >
                                                        Hide content
                                                    </button>
                                                )}
                                                {r.target_hidden && (
                                                    <button
                                                        onClick={() => action(r.id, 'unhide')}
                                                        disabled={busyId === r.id}
                                                        style={{
                                                            padding: '8px 16px', borderRadius: '9999px', border: 'none',
                                                            background: '#f97316', color: '#fff', fontSize: '12px', fontWeight: 500,
                                                            cursor: busyId === r.id ? 'wait' : 'pointer',
                                                        }}
                                                    >
                                                        Unhide
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => action(r.id, 'dismiss')}
                                                    disabled={busyId === r.id}
                                                    style={{
                                                        padding: '8px 16px', borderRadius: '9999px', border: '1px solid #e5e5e5',
                                                        background: '#fff', color: '#000', fontSize: '12px', fontWeight: 500,
                                                        cursor: busyId === r.id ? 'wait' : 'pointer',
                                                    }}
                                                >
                                                    Dismiss
                                                </button>
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </Container>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ForumReports;
