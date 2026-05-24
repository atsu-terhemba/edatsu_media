import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col } from 'react-bootstrap';
import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import AdminSideNav from './Components/SideNav';

const WINDOWS = [
    { key: '24h', label: 'Last 24h' },
    { key: '7d', label: 'Last 7 days' },
    { key: '30d', label: 'Last 30 days' },
    { key: '90d', label: 'Last 90 days' },
];

const SERIES_META = [
    { key: 'read', label: 'Reads', color: '#000' },
    { key: 'click', label: 'Clicks', color: '#f97316' },
    { key: 'save', label: 'Saves', color: '#10b981' },
];

function ChangeBadge({ value }) {
    if (value === 0 || value === undefined || value === null) {
        return <span style={{ fontSize: '12px', color: '#86868b' }}>—</span>;
    }
    const positive = value > 0;
    const color = positive ? '#10b981' : '#ef4444';
    const bg = positive ? 'rgba(16,185,129,0.10)' : 'rgba(239,68,68,0.10)';
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '2px',
            fontSize: '11px', fontWeight: 600, color,
            background: bg, padding: '2px 8px', borderRadius: '9999px',
        }}>
            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>
                {positive ? 'trending_up' : 'trending_down'}
            </span>
            {Math.abs(value)}%
        </span>
    );
}

function StatCard({ icon, label, value, change, subtitle }) {
    return (
        <Col xs={6} md={4} lg>
            <div style={{
                padding: '20px',
                borderRadius: '16px',
                background: '#fff',
                border: '1px solid #f0f0f0',
                height: '100%',
            }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        background: '#f5f5f7',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#000' }}>{icon}</span>
                    </span>
                    <ChangeBadge value={change} />
                </div>
                <div style={{
                    fontSize: '11px', fontWeight: 500, textTransform: 'uppercase',
                    letterSpacing: '0.15em', color: '#86868b', marginBottom: '6px',
                }}>
                    {label}
                </div>
                <div style={{
                    fontSize: '24px', fontWeight: 600, color: '#000',
                    letterSpacing: '-0.02em', lineHeight: 1,
                }}>
                    {Number(value || 0).toLocaleString()}
                </div>
                {subtitle && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#86868b' }}>{subtitle}</div>
                )}
            </div>
        </Col>
    );
}

function LineChart({ data }) {
    const width = 800;
    const height = 280;
    const padding = { top: 20, right: 16, bottom: 36, left: 40 };
    const innerW = width - padding.left - padding.right;
    const innerH = height - padding.top - padding.bottom;

    const maxY = useMemo(() => {
        let m = 0;
        data.forEach((d) => {
            SERIES_META.forEach((s) => { if (d[s.key] > m) m = d[s.key]; });
        });
        return Math.max(m, 4);
    }, [data]);

    if (data.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#86868b', fontSize: '13px' }}>
                No engagement data in this window yet.
            </div>
        );
    }

    const x = (i) => padding.left + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
    const y = (v) => padding.top + innerH - (v / maxY) * innerH;

    const buildPath = (key) => data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(d[key])}`).join(' ');

    const ticks = 4;
    const yTicks = Array.from({ length: ticks + 1 }, (_, i) => Math.round((maxY / ticks) * i));

    const xLabelStep = Math.max(1, Math.ceil(data.length / 8));

    return (
        <div style={{ width: '100%', overflowX: 'auto' }}>
            <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', minWidth: '500px', display: 'block' }}>
                {yTicks.map((t, i) => (
                    <g key={i}>
                        <line
                            x1={padding.left} x2={width - padding.right}
                            y1={y(t)} y2={y(t)}
                            stroke="#f0f0f0" strokeWidth="1"
                            strokeDasharray={i === 0 ? '' : '3,3'}
                        />
                        <text
                            x={padding.left - 8} y={y(t) + 4}
                            textAnchor="end" fontSize="11" fill="#86868b"
                        >
                            {t.toLocaleString()}
                        </text>
                    </g>
                ))}

                {data.map((d, i) => i % xLabelStep === 0 && (
                    <text
                        key={i}
                        x={x(i)} y={height - padding.bottom + 18}
                        textAnchor="middle" fontSize="10" fill="#86868b"
                    >
                        {d.label}
                    </text>
                ))}

                {SERIES_META.map((s) => (
                    <g key={s.key}>
                        <path
                            d={buildPath(s.key)}
                            fill="none" stroke={s.color}
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        />
                        {data.map((d, i) => (
                            <circle
                                key={i}
                                cx={x(i)} cy={y(d[s.key])}
                                r="2.5" fill={s.color}
                            >
                                <title>{`${s.label} · ${d.label} · ${d[s.key]}`}</title>
                            </circle>
                        ))}
                    </g>
                ))}
            </svg>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '18px', marginTop: '10px', flexWrap: 'wrap' }}>
                {SERIES_META.map((s) => (
                    <span key={s.key} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6e6e73' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.color }} />
                        {s.label}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function Engagement({ window, stats, time_series, top_feeds, top_articles }) {
    const [activeWindow, setActiveWindow] = useState(window || '7d');

    const changeWindow = (w) => {
        if (w === activeWindow) return;
        setActiveWindow(w);
        router.get(route('admin.engagement'), { window: w }, {
            preserveState: false,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Engagement Analytics" />

            <Container fluid>
                <Container>
                    <Row className="g-4" style={{ paddingTop: '96px', paddingBottom: '64px' }}>
                        <Col md={3} className="d-none d-md-block">
                            <AdminSideNav />
                        </Col>
                        <Col md={9} xs={12}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                                <div>
                                    <h2 style={{
                                        fontSize: 'clamp(24px, 4vw, 28px)',
                                        fontWeight: 600, color: '#000',
                                        letterSpacing: '-0.02em', marginBottom: '6px',
                                    }}>
                                        Engagement
                                    </h2>
                                    <p style={{ fontSize: '14px', color: '#86868b', margin: 0 }}>
                                        Reads, clicks and saves across the platform
                                    </p>
                                </div>

                                <div style={{
                                    display: 'inline-flex',
                                    background: '#e8e8ed',
                                    borderRadius: '9999px',
                                    padding: '4px',
                                }}>
                                    {WINDOWS.map((w) => {
                                        const active = activeWindow === w.key;
                                        return (
                                            <button
                                                key={w.key}
                                                onClick={() => changeWindow(w.key)}
                                                style={{
                                                    padding: '7px 14px',
                                                    borderRadius: '9999px',
                                                    border: 'none',
                                                    background: active ? '#000' : 'transparent',
                                                    color: active ? '#fff' : '#6e6e73',
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                }}
                                            >
                                                {w.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <Row className="g-3 mb-4">
                                <StatCard icon="visibility" label="Reads" value={stats.reads.value} change={stats.reads.change} />
                                <StatCard icon="open_in_new" label="Clicks" value={stats.clicks.value} change={stats.clicks.change} />
                                <StatCard icon="bookmark" label="Saves" value={stats.saves.value} change={stats.saves.change} />
                                <StatCard icon="bolt" label="Total Events" value={stats.total.value} change={stats.total.change} />
                                <StatCard icon="person" label="Active Users" value={stats.unique_users.value} change={stats.unique_users.change} />
                            </Row>

                            <div style={{
                                background: '#fff',
                                border: '1px solid #f0f0f0',
                                borderRadius: '16px',
                                padding: '24px',
                                marginBottom: '24px',
                            }}>
                                <div style={{ marginBottom: '12px' }}>
                                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#000', margin: '0 0 2px' }}>
                                        Engagement over time
                                    </h3>
                                    <span style={{ fontSize: '12px', color: '#86868b' }}>
                                        {activeWindow === '24h' ? 'Hourly buckets' : 'Daily buckets'}
                                    </span>
                                </div>
                                <LineChart data={time_series} />
                            </div>

                            <Row className="g-3">
                                <Col lg={6}>
                                    <div style={{
                                        background: '#fff',
                                        border: '1px solid #f0f0f0',
                                        borderRadius: '16px',
                                        padding: '24px',
                                        height: '100%',
                                    }}>
                                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#000', margin: '0 0 16px' }}>
                                            Top sources
                                        </h3>
                                        {top_feeds.length === 0 ? (
                                            <div style={{ fontSize: '13px', color: '#86868b', padding: '20px 0' }}>No source data yet.</div>
                                        ) : (
                                            top_feeds.map((f, i) => (
                                                <div key={i} style={{
                                                    display: 'flex', alignItems: 'center', gap: '10px',
                                                    padding: '10px 0',
                                                    borderTop: i > 0 ? '1px solid #f5f5f7' : 'none',
                                                }}>
                                                    <span style={{ fontSize: '12px', color: '#b0b0b5', minWidth: '20px', fontWeight: 600 }}>
                                                        {i + 1}
                                                    </span>
                                                    {f.feed_favicon ? (
                                                        <img src={f.feed_favicon} alt="" width={16} height={16} style={{ borderRadius: '3px', flexShrink: 0 }} onError={(e) => e.target.style.display = 'none'} />
                                                    ) : (
                                                        <span style={{ width: 16, height: 16, background: '#f0f0f0', borderRadius: 3, flexShrink: 0 }} />
                                                    )}
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ fontSize: '13px', fontWeight: 500, color: '#000', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {f.feed_title}
                                                        </div>
                                                        <div style={{ fontSize: '11px', color: '#86868b' }}>
                                                            {f.reads} reads · {f.clicks} clicks · {f.saves} saves
                                                        </div>
                                                    </div>
                                                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#000' }}>
                                                        {Number(f.events).toLocaleString()}
                                                    </span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </Col>

                                <Col lg={6}>
                                    <div style={{
                                        background: '#fff',
                                        border: '1px solid #f0f0f0',
                                        borderRadius: '16px',
                                        padding: '24px',
                                        height: '100%',
                                    }}>
                                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#000', margin: '0 0 16px' }}>
                                            Top articles
                                        </h3>
                                        {top_articles.length === 0 ? (
                                            <div style={{ fontSize: '13px', color: '#86868b', padding: '20px 0' }}>No article data yet.</div>
                                        ) : (
                                            top_articles.map((a, i) => (
                                                <div key={i} style={{
                                                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                                                    padding: '10px 0',
                                                    borderTop: i > 0 ? '1px solid #f5f5f7' : 'none',
                                                }}>
                                                    <span style={{ fontSize: '12px', color: '#b0b0b5', minWidth: '20px', fontWeight: 600, paddingTop: '2px' }}>
                                                        {i + 1}
                                                    </span>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <a
                                                            href={a.article_link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{
                                                                fontSize: '13px', fontWeight: 500, color: '#000',
                                                                lineHeight: 1.35, textDecoration: 'none',
                                                                display: '-webkit-box', WebkitLineClamp: 2,
                                                                WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                                            }}
                                                        >
                                                            {a.article_title}
                                                        </a>
                                                        <div style={{ fontSize: '11px', color: '#86868b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            {a.feed_favicon && (
                                                                <img src={a.feed_favicon} alt="" width={12} height={12} style={{ borderRadius: '2px' }} onError={(e) => e.target.style.display = 'none'} />
                                                            )}
                                                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                {a.feed_title || '—'}
                                                            </span>
                                                            <span>·</span>
                                                            <span>{a.reads}r / {a.clicks}c / {a.saves}s</span>
                                                        </div>
                                                    </div>
                                                    <span style={{
                                                        fontSize: '11px', fontWeight: 600, color: '#f97316',
                                                        background: 'rgba(249,115,22,0.1)',
                                                        padding: '3px 8px', borderRadius: '9999px', flexShrink: 0,
                                                    }}>
                                                        {Number(a.score).toLocaleString()}
                                                    </span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </Container>
        </AuthenticatedLayout>
    );
}
