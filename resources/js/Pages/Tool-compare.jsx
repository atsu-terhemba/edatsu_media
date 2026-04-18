import { Fragment, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import Metadata from '@/Components/Metadata';
import { Container } from 'react-bootstrap';
import { pageLink } from '@/utils/Index';

const STORAGE_KEY = 'edatsu:compareTools';
const fallbackImageUrl = '/img/logo/main_2.png';

const thumbUrl = (cover_img) => {
    if (!cover_img) return fallbackImageUrl;
    const base = (import.meta.env.VITE_R2_PUBLIC_URL || '').replace(/\/$/, '');
    return `${base}/uploads/prod/${cover_img}`;
};

const stripHTML = (html) => {
    if (!html) return '';
    if (typeof document === 'undefined') return String(html);
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
};

const splitList = (value) => {
    if (!value) return [];
    return String(value)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
};

const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
        });
    } catch (e) {
        return '—';
    }
};

const Cell = ({ children, style }) => (
    <td
        style={{
            padding: '16px',
            verticalAlign: 'top',
            borderBottom: '1px solid #f0f0f0',
            fontSize: 13,
            color: '#1d1d1f',
            minWidth: 240,
            ...style,
        }}
    >
        {children}
    </td>
);

const LabelCell = ({ children }) => (
    <th
        scope="row"
        style={{
            padding: '16px',
            verticalAlign: 'top',
            borderBottom: '1px solid #f0f0f0',
            fontSize: 12,
            fontWeight: 600,
            color: '#86868b',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            background: '#fafafa',
            position: 'sticky',
            left: 0,
            minWidth: 140,
            textAlign: 'left',
        }}
    >
        {children}
    </th>
);

const Chips = ({ items }) => {
    if (!items.length) return <span style={{ color: '#c7c7cc' }}>—</span>;
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {items.map((item, i) => (
                <span
                    key={i}
                    style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: '#1d1d1f',
                        background: '#f5f5f7',
                        padding: '3px 10px',
                        borderRadius: 9999,
                    }}
                >
                    {item}
                </span>
            ))}
        </div>
    );
};

const Stars = ({ rating, total }) => {
    const rounded = Math.round(Number(rating) || 0);
    return (
        <div className="d-flex align-items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className="material-symbols-outlined"
                    style={{
                        fontSize: 14,
                        color: star <= rounded ? '#f97316' : '#e5e5e5',
                        fontVariationSettings: star <= rounded ? '"FILL" 1' : '"FILL" 0',
                    }}
                >
                    star
                </span>
            ))}
            <span style={{ fontSize: 12, color: '#86868b', marginLeft: 4 }}>
                {rating ? parseFloat(rating).toFixed(1) : '0.0'}{' '}
                <span style={{ color: '#d1d1d6' }}>({total || 0})</span>
            </span>
        </div>
    );
};

const removeFromStorage = (id) => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const list = raw ? JSON.parse(raw) : [];
        const next = list.filter((x) => Number(x) !== Number(id));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
        // ignore
    }
};

export default function ToolCompare({ tools = [], maxAllowed = 2, isPro = false, cappedForPlan = false, requestedCount = 0 }) {
    useEffect(() => {
        try {
            const ids = tools.map((t) => t.id);
            if (ids.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
        } catch (e) {
            // ignore
        }
    }, [tools]);

    const removeTool = (id) => {
        removeFromStorage(id);
        const remaining = tools.filter((t) => Number(t.id) !== Number(id)).map((t) => t.id);
        if (remaining.length === 0) {
            router.visit('/toolshed');
            return;
        }
        router.visit(`/tools/compare?ids=${remaining.join(',')}`);
    };

    const noTools = !tools || tools.length === 0;

    return (
        <Fragment>
            <Metadata
                title="Compare Tools Side-by-Side | Edatsu Toolshed"
                description="Compare business tools feature-by-feature to choose the right one for your workflow."
                canonicalUrl="https://www.edatsu.com/tools/compare"
            />
            <GuestLayout>
                <section style={{ paddingTop: 96, paddingBottom: 48, background: '#fff' }}>
                    <Container>
                        <div className="d-flex flex-column align-items-start mb-3">
                            <span className="section-eyebrow" style={{ color: '#86868b' }}>
                                Compare
                            </span>
                            <div className="eyebrow-bar" style={{ margin: '8px 0 0' }} />
                        </div>
                        <h1
                            style={{
                                fontSize: 'clamp(28px, 5vw, 36px)',
                                fontWeight: 600,
                                color: '#000',
                                letterSpacing: '-0.01em',
                                lineHeight: 1.15,
                                marginBottom: 12,
                            }}
                        >
                            Side-by-side comparison
                        </h1>
                        <p style={{ fontSize: 14, color: '#86868b', margin: 0 }}>
                            {isPro
                                ? `Compare up to ${maxAllowed} tools at a time.`
                                : `Free plan compares ${maxAllowed} tools at a time. Upgrade to Pro to compare up to 5.`}
                        </p>
                        {cappedForPlan && requestedCount > maxAllowed && (
                            <div
                                style={{
                                    marginTop: 16,
                                    padding: '12px 16px',
                                    borderRadius: 12,
                                    background: '#fff7ed',
                                    border: '1px solid #fed7aa',
                                    color: '#9a3412',
                                    fontSize: 13,
                                }}
                            >
                                You selected {requestedCount} tools. Showing the first {maxAllowed} — upgrade to Pro to compare up to 5.{' '}
                                <Link href="/upgrade-plan" style={{ color: '#9a3412', fontWeight: 600 }}>
                                    Upgrade →
                                </Link>
                            </div>
                        )}
                    </Container>
                </section>

                <section style={{ paddingBottom: 96, background: '#f5f5f7' }}>
                    <Container>
                        {noTools ? (
                            <div
                                style={{
                                    background: '#fff',
                                    borderRadius: 16,
                                    border: '1px solid #f0f0f0',
                                    padding: '64px 24px',
                                    textAlign: 'center',
                                }}
                            >
                                <span
                                    className="material-symbols-outlined"
                                    style={{ fontSize: 48, color: '#e5e5e5', marginBottom: 16 }}
                                >
                                    compare_arrows
                                </span>
                                <h4 style={{ fontSize: 16, fontWeight: 600, color: '#000', marginBottom: 8 }}>
                                    No tools to compare
                                </h4>
                                <p style={{ fontSize: 13, color: '#86868b', marginBottom: 24 }}>
                                    Head back to the Toolshed and pick 2 or more tools to compare.
                                </p>
                                <Link
                                    href="/toolshed"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        padding: '10px 22px',
                                        borderRadius: 9999,
                                        background: '#000',
                                        color: '#fff',
                                        fontSize: 13,
                                        fontWeight: 500,
                                        textDecoration: 'none',
                                    }}
                                >
                                    Browse Toolshed
                                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                                        arrow_forward
                                    </span>
                                </Link>
                            </div>
                        ) : (
                            <div
                                style={{
                                    background: '#fff',
                                    borderRadius: 16,
                                    border: '1px solid #f0f0f0',
                                    overflow: 'hidden',
                                }}
                            >
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
                                        <thead>
                                            <tr>
                                                <LabelCell>Tool</LabelCell>
                                                {tools.map((tool) => (
                                                    <Cell key={tool.id} style={{ borderBottom: '1px solid #f0f0f0', background: '#fff' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                                <div
                                                                    style={{
                                                                        width: 56,
                                                                        height: 56,
                                                                        borderRadius: 14,
                                                                        overflow: 'hidden',
                                                                        background: '#f5f5f7',
                                                                        flex: '0 0 auto',
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={thumbUrl(tool.cover_img)}
                                                                        alt={tool.title}
                                                                        onError={(e) => (e.currentTarget.src = fallbackImageUrl)}
                                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                    />
                                                                </div>
                                                                <button
                                                                    onClick={() => removeTool(tool.id)}
                                                                    aria-label="Remove from comparison"
                                                                    style={{
                                                                        border: 'none',
                                                                        background: 'transparent',
                                                                        cursor: 'pointer',
                                                                        color: '#86868b',
                                                                        display: 'inline-flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        width: 28,
                                                                        height: 28,
                                                                        borderRadius: '50%',
                                                                    }}
                                                                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f7')}
                                                                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                                                >
                                                                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                                                                        close
                                                                    </span>
                                                                </button>
                                                            </div>
                                                            <Link
                                                                href={pageLink('product', tool.slug, tool.id)}
                                                                className="text-decoration-none"
                                                                style={{
                                                                    fontSize: 15,
                                                                    fontWeight: 600,
                                                                    color: '#000',
                                                                    lineHeight: 1.3,
                                                                }}
                                                            >
                                                                {tool.title}
                                                            </Link>
                                                            <Stars rating={tool.average_rating} total={tool.total_ratings} />
                                                        </div>
                                                    </Cell>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <LabelCell>Description</LabelCell>
                                                {tools.map((tool) => (
                                                    <Cell key={tool.id}>
                                                        {stripHTML(tool.description).slice(0, 280) || <span style={{ color: '#c7c7cc' }}>—</span>}
                                                        {stripHTML(tool.description).length > 280 ? '…' : ''}
                                                    </Cell>
                                                ))}
                                            </tr>
                                            <tr>
                                                <LabelCell>Categories</LabelCell>
                                                {tools.map((tool) => (
                                                    <Cell key={tool.id}>
                                                        <Chips items={splitList(tool.categories)} />
                                                    </Cell>
                                                ))}
                                            </tr>
                                            <tr>
                                                <LabelCell>Brand labels</LabelCell>
                                                {tools.map((tool) => (
                                                    <Cell key={tool.id}>
                                                        <Chips items={splitList(tool.brand_labels)} />
                                                    </Cell>
                                                ))}
                                            </tr>
                                            <tr>
                                                <LabelCell>Tags</LabelCell>
                                                {tools.map((tool) => (
                                                    <Cell key={tool.id}>
                                                        <Chips items={splitList(tool.tags)} />
                                                    </Cell>
                                                ))}
                                            </tr>
                                            <tr>
                                                <LabelCell>Countries</LabelCell>
                                                {tools.map((tool) => (
                                                    <Cell key={tool.id}>
                                                        <Chips items={splitList(tool.countries)} />
                                                    </Cell>
                                                ))}
                                            </tr>
                                            <tr>
                                                <LabelCell>Comments</LabelCell>
                                                {tools.map((tool) => (
                                                    <Cell key={tool.id}>{tool.total_comments || 0}</Cell>
                                                ))}
                                            </tr>
                                            <tr>
                                                <LabelCell>Listed</LabelCell>
                                                {tools.map((tool) => (
                                                    <Cell key={tool.id}>{formatDate(tool.created_at)}</Cell>
                                                ))}
                                            </tr>
                                            <tr>
                                                <LabelCell>Actions</LabelCell>
                                                {tools.map((tool) => (
                                                    <Cell key={tool.id} style={{ borderBottom: 'none' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                            <Link
                                                                href={pageLink('product', tool.slug, tool.id)}
                                                                style={{
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    gap: 4,
                                                                    padding: '8px 16px',
                                                                    borderRadius: 9999,
                                                                    background: '#000',
                                                                    color: '#fff',
                                                                    fontSize: 12,
                                                                    fontWeight: 500,
                                                                    textDecoration: 'none',
                                                                }}
                                                            >
                                                                View details
                                                                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                                                                    arrow_forward
                                                                </span>
                                                            </Link>
                                                            {tool.direct_link && (
                                                                <a
                                                                    href={tool.direct_link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    style={{
                                                                        display: 'inline-flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        gap: 4,
                                                                        padding: '8px 16px',
                                                                        borderRadius: 9999,
                                                                        background: 'transparent',
                                                                        color: '#000',
                                                                        border: '1px solid #e5e5e5',
                                                                        fontSize: 12,
                                                                        fontWeight: 500,
                                                                        textDecoration: 'none',
                                                                    }}
                                                                >
                                                                    Visit site
                                                                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                                                                        open_in_new
                                                                    </span>
                                                                </a>
                                                            )}
                                                        </div>
                                                    </Cell>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        <div style={{ marginTop: 24, textAlign: 'center' }}>
                            <Link
                                href="/toolshed"
                                style={{
                                    fontSize: 13,
                                    color: '#86868b',
                                    textDecoration: 'none',
                                }}
                            >
                                ← Back to Toolshed
                            </Link>
                        </div>
                    </Container>
                </section>
            </GuestLayout>
        </Fragment>
    );
}
