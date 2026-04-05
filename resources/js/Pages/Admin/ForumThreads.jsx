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

const FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'visible', label: 'Visible' },
    { key: 'hidden', label: 'Hidden' },
];

const ForumThreads = ({ threads: initialThreads = [], filter = 'all' }) => {
    const [threads, setThreads] = useState(initialThreads);
    const [busyId, setBusyId] = useState(null);

    const switchFilter = (key) => {
        router.get('/admin-forum-threads', { filter: key }, { preserveState: false, preserveScroll: false });
    };

    const toggleVisibility = async (t) => {
        setBusyId(t.id);
        const act = t.is_hidden ? 'unhide' : 'hide';
        try {
            await axios.post(`/admin-forum-threads/${t.id}/action`, { action: act });
            setThreads((prev) => prev.map((x) => x.id === t.id ? { ...x, is_hidden: !t.is_hidden } : x));
            Toast.fire({ icon: 'success', title: act === 'hide' ? 'Thread hidden' : 'Thread visible' });
        } catch {
            Toast.fire({ icon: 'error', title: 'Action failed' });
        } finally {
            setBusyId(null);
        }
    };

    const deleteThread = async (t) => {
        const { isConfirmed } = await Swal.fire({
            title: 'Delete thread?',
            html: `<p style="font-size:13px;color:#86868b;margin:0;">${t.title}</p><p style="font-size:12px;color:#b0b0b5;margin-top:8px;">This will delete all replies and cannot be undone.</p>`,
            showCancelButton: true,
            confirmButtonText: 'Delete',
            confirmButtonColor: '#dc3545',
        });
        if (!isConfirmed) return;
        setBusyId(t.id);
        try {
            await axios.delete(`/admin-forum-threads/${t.id}`);
            setThreads((prev) => prev.filter((x) => x.id !== t.id));
            Toast.fire({ icon: 'success', title: 'Thread deleted' });
        } catch {
            Toast.fire({ icon: 'error', title: 'Delete failed' });
        } finally {
            setBusyId(null);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Forum Threads" />
            <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f7' }}>
                <AdminSideNav />
                <div style={{ flex: 1, padding: '32px' }}>
                    <Container fluid>
                        <Row className="mb-4">
                            <Col>
                                <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#000', margin: 0 }}>Forum Threads</h1>
                                <p style={{ fontSize: '13px', color: '#86868b', margin: '4px 0 0' }}>
                                    {threads.length} threads
                                </p>
                            </Col>
                        </Row>

                        <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
                            {FILTERS.map((f) => {
                                const active = filter === f.key;
                                return (
                                    <button
                                        key={f.key}
                                        onClick={() => switchFilter(f.key)}
                                        style={{
                                            padding: '6px 14px', borderRadius: '9999px',
                                            border: active ? 'none' : '1px solid #e5e5e5',
                                            background: active ? '#000' : '#fff',
                                            color: active ? '#fff' : '#86868b',
                                            fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                                        }}
                                    >
                                        {f.label}
                                    </button>
                                );
                            })}
                        </div>

                        {threads.length === 0 ? (
                            <div style={{
                                background: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0',
                                padding: '48px 24px', textAlign: 'center',
                            }}>
                                <p style={{ fontSize: '14px', color: '#86868b', margin: 0 }}>No threads.</p>
                            </div>
                        ) : (
                            <Row>
                                {threads.map((t) => (
                                    <Col xs={12} key={t.id} className="mb-3">
                                        <div style={{
                                            background: '#fff', borderRadius: '12px', border: '1px solid #f0f0f0',
                                            padding: '20px', opacity: t.is_hidden ? 0.6 : 1,
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                                                        {t.categories.map((c) => (
                                                            <span key={c.id} style={{
                                                                fontSize: '10px', fontWeight: 500, color: '#f97316',
                                                                background: '#fff7ed', border: '1px solid #fed7aa',
                                                                padding: '2px 8px', borderRadius: '9999px',
                                                            }}>{c.name}</span>
                                                        ))}
                                                        {t.is_hidden && (
                                                            <span style={{
                                                                fontSize: '10px', fontWeight: 600, color: '#86868b',
                                                                background: '#f5f5f7', padding: '2px 8px', borderRadius: '9999px',
                                                            }}>hidden</span>
                                                        )}
                                                    </div>
                                                    <a href={`/forum/${t.id}`} target="_blank" rel="noopener noreferrer"
                                                        style={{ textDecoration: 'none', color: '#000' }}>
                                                        <h3 style={{ fontSize: '14px', fontWeight: 600, margin: 0, lineHeight: 1.4 }}>{t.title}</h3>
                                                    </a>
                                                    <div style={{ fontSize: '11px', color: '#86868b', marginTop: '6px' }}>
                                                        {t.user?.name || 'Anonymous'} · {t.created_at} · {t.posts_count} {t.posts_count === 1 ? 'reply' : 'replies'}
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                                                    <button
                                                        onClick={() => toggleVisibility(t)}
                                                        disabled={busyId === t.id}
                                                        style={{
                                                            padding: '6px 12px', borderRadius: '9999px',
                                                            border: '1px solid #e5e5e5', background: '#fff',
                                                            color: '#000', fontSize: '11px', fontWeight: 500,
                                                            cursor: busyId === t.id ? 'wait' : 'pointer',
                                                        }}
                                                    >
                                                        {t.is_hidden ? 'Unhide' : 'Hide'}
                                                    </button>
                                                    <button
                                                        onClick={() => deleteThread(t)}
                                                        disabled={busyId === t.id}
                                                        style={{
                                                            padding: '6px 12px', borderRadius: '9999px',
                                                            border: 'none', background: '#dc3545', color: '#fff',
                                                            fontSize: '11px', fontWeight: 500,
                                                            cursor: busyId === t.id ? 'wait' : 'pointer',
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
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

export default ForumThreads;
