import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Container, Row, Col } from 'react-bootstrap';
import AdminSideNav from './Components/SideNav';

function Toggle({ checked, onChange, label, description }) {
    return (
        <label style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            padding: '16px 0',
            borderBottom: '1px solid #f0f0f0',
            cursor: 'pointer',
        }}>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#000' }}>{label}</div>
                {description && (
                    <div style={{ fontSize: '13px', color: '#86868b', marginTop: '4px' }}>{description}</div>
                )}
            </div>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                style={{ display: 'none' }}
            />
            <span style={{
                width: '44px',
                height: '26px',
                borderRadius: '9999px',
                background: checked ? '#f97316' : '#d1d1d6',
                position: 'relative',
                transition: 'background 0.2s',
                flexShrink: 0,
                marginTop: '2px',
            }}>
                <span style={{
                    position: 'absolute',
                    top: '3px',
                    left: checked ? '21px' : '3px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#fff',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    transition: 'left 0.2s',
                }} />
            </span>
        </label>
    );
}

function NumberField({ value, onChange, label, description, disabled }) {
    return (
        <div style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0', opacity: disabled ? 0.5 : 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#000' }}>{label}</div>
                    {description && (
                        <div style={{ fontSize: '13px', color: '#86868b', marginTop: '4px' }}>{description}</div>
                    )}
                </div>
                <input
                    type="number"
                    min="0"
                    value={value}
                    disabled={disabled}
                    onChange={(e) => onChange(parseInt(e.target.value || '0', 10))}
                    style={{
                        width: '90px',
                        padding: '8px 12px',
                        border: '1px solid #d1d1d6',
                        borderRadius: '10px',
                        fontSize: '14px',
                        textAlign: 'right',
                    }}
                />
            </div>
        </div>
    );
}

export default function ProGating({ settings }) {
    const { data, setData, post, processing } = useForm({
        enabled: settings.enabled,
        bookmarks_max: settings.bookmarks_max,
        saved_articles_max: settings.saved_articles_max,
        reminders_max: settings.reminders_max,
        custom_feeds_max: settings.custom_feeds_max,
        public_lists_max: settings.public_lists_max ?? 1,
        bulk_export_pro_only: settings.bulk_export_pro_only,
        web_push_pro_only: settings.web_push_pro_only,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.pro_gating.update'));
    };

    const gated = data.enabled;

    return (
        <AuthenticatedLayout>
            <Head title="Pro Gating" />
            <Container fluid>
                <Container>
                    <Row className="g-4" style={{ paddingTop: '96px', paddingBottom: '64px' }}>
                        <Col md={3} className="d-none d-md-block">
                            <AdminSideNav />
                        </Col>
                        <Col md={9} xs={12}>
                            <div style={{ marginBottom: '32px' }}>
                                <h2 style={{
                                    fontSize: 'clamp(24px, 4vw, 28px)',
                                    fontWeight: 600,
                                    color: '#000',
                                    letterSpacing: '-0.02em',
                                    marginBottom: '6px',
                                }}>
                                    Pro Gating
                                </h2>
                                <p style={{ fontSize: '14px', color: '#86868b', margin: 0 }}>
                                    Control which features require a Pro subscription. Toggle the master switch to disable all gating.
                                </p>
                            </div>

                            <form onSubmit={submit}>
                                <div style={{
                                    background: '#fff',
                                    border: '1px solid #d1d1d6',
                                    borderRadius: '16px',
                                    padding: '28px',
                                    marginBottom: '24px',
                                }}>
                                    <Toggle
                                        checked={data.enabled}
                                        onChange={(v) => setData('enabled', v)}
                                        label="Enable Pro gating"
                                        description="Master switch. When off, every feature below is available to all users regardless of plan."
                                    />
                                </div>

                                <div style={{
                                    background: '#fff',
                                    border: '1px solid #d1d1d6',
                                    borderRadius: '16px',
                                    padding: '28px',
                                    marginBottom: '24px',
                                }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#000', margin: '0 0 8px' }}>Free-plan quotas</h3>
                                    <p style={{ fontSize: '13px', color: '#86868b', margin: '0 0 8px' }}>Caps that apply to Free users when gating is on. Pro users are unlimited.</p>
                                    <NumberField
                                        value={data.bookmarks_max}
                                        onChange={(v) => setData('bookmarks_max', v)}
                                        label="Bookmarks"
                                        description="Max saved opportunities + tools combined."
                                        disabled={!gated}
                                    />
                                    <NumberField
                                        value={data.saved_articles_max}
                                        onChange={(v) => setData('saved_articles_max', v)}
                                        label="Saved articles"
                                        description="Max articles saved from feeds."
                                        disabled={!gated}
                                    />
                                    <NumberField
                                        value={data.reminders_max}
                                        onChange={(v) => setData('reminders_max', v)}
                                        label="Active reminders"
                                        description="Max concurrent bookmark reminders."
                                        disabled={!gated}
                                    />
                                    <NumberField
                                        value={data.custom_feeds_max}
                                        onChange={(v) => setData('custom_feeds_max', v)}
                                        label="Custom RSS feeds"
                                        description="Max user-added RSS feeds."
                                        disabled={!gated}
                                    />
                                    <NumberField
                                        value={data.public_lists_max}
                                        onChange={(v) => setData('public_lists_max', v)}
                                        label="Public reading lists"
                                        description="Max collections a free user can publish as shareable lists."
                                        disabled={!gated}
                                    />
                                </div>

                                <div style={{
                                    background: '#fff',
                                    border: '1px solid #d1d1d6',
                                    borderRadius: '16px',
                                    padding: '28px',
                                    marginBottom: '24px',
                                }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#000', margin: '0 0 8px' }}>Pro-only features</h3>
                                    <p style={{ fontSize: '13px', color: '#86868b', margin: '0 0 8px' }}>Features entirely locked to Pro users when gating is on.</p>
                                    <Toggle
                                        checked={data.bulk_export_pro_only}
                                        onChange={(v) => setData('bulk_export_pro_only', v)}
                                        label="Bulk export (CSV / PDF)"
                                        description="Gates /export-bookmarked-opportunities and /export-bookmarked-tools."
                                    />
                                    <Toggle
                                        checked={data.web_push_pro_only}
                                        onChange={(v) => setData('web_push_pro_only', v)}
                                        label="Web push notifications"
                                        description="Users must be Pro to subscribe to browser push."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    style={{
                                        background: '#000',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '9999px',
                                        padding: '12px 28px',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        cursor: processing ? 'not-allowed' : 'pointer',
                                        opacity: processing ? 0.6 : 1,
                                    }}
                                >
                                    {processing ? 'Saving…' : 'Save changes'}
                                </button>
                            </form>
                        </Col>
                    </Row>
                </Container>
            </Container>
        </AuthenticatedLayout>
    );
}
