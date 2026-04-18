import { useMemo } from 'react';
import { router } from '@inertiajs/react';

const fallbackImageUrl = '/img/logo/main_2.png';

const thumbUrl = (cover_img) => {
    if (!cover_img) return fallbackImageUrl;
    const base = (import.meta.env.VITE_R2_PUBLIC_URL || '').replace(/\/$/, '');
    return `${base}/uploads/prod/${cover_img}`;
};

export default function CompareBar({ selected, maxAllowed, onRemove, onClear }) {
    const hasItems = selected.length > 0;
    const canCompare = selected.length >= 2;

    const ids = useMemo(() => selected.map((t) => t.id).join(','), [selected]);

    const goCompare = () => {
        if (!canCompare) return;
        router.visit(`/tools/compare?ids=${ids}`);
    };

    if (!hasItems) return null;

    return (
        <div
            style={{
                position: 'fixed',
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1040,
                background: '#000',
                color: '#fff',
                padding: '12px 16px',
                boxShadow: '0 -8px 24px rgba(0,0,0,0.2)',
            }}
        >
            <div
                style={{
                    maxWidth: 1200,
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    flexWrap: 'wrap',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 auto', minWidth: 0 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
                        Compare ({selected.length}/{maxAllowed})
                    </span>
                    <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
                        {selected.map((tool) => (
                            <div
                                key={tool.id}
                                style={{
                                    position: 'relative',
                                    flex: '0 0 auto',
                                    width: 44,
                                    height: 44,
                                    borderRadius: 10,
                                    overflow: 'hidden',
                                    background: '#333',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                }}
                                title={tool.product_name}
                            >
                                <img
                                    src={thumbUrl(tool.cover_img)}
                                    alt={tool.product_name}
                                    onError={(e) => (e.currentTarget.src = fallbackImageUrl)}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <button
                                    onClick={() => onRemove(tool.id)}
                                    aria-label={`Remove ${tool.product_name}`}
                                    style={{
                                        position: 'absolute',
                                        top: -4,
                                        right: -4,
                                        width: 18,
                                        height: 18,
                                        borderRadius: '50%',
                                        border: 'none',
                                        background: '#f97316',
                                        color: '#fff',
                                        fontSize: 11,
                                        lineHeight: 1,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                        onClick={onClear}
                        style={{
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.3)',
                            color: '#fff',
                            fontSize: 12,
                            fontWeight: 500,
                            padding: '8px 16px',
                            borderRadius: 9999,
                            cursor: 'pointer',
                        }}
                    >
                        Clear
                    </button>
                    <button
                        onClick={goCompare}
                        disabled={!canCompare}
                        style={{
                            background: canCompare ? '#f97316' : 'rgba(255,255,255,0.15)',
                            border: 'none',
                            color: '#fff',
                            fontSize: 12,
                            fontWeight: 600,
                            padding: '8px 20px',
                            borderRadius: 9999,
                            cursor: canCompare ? 'pointer' : 'not-allowed',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                        }}
                    >
                        Compare
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                            arrow_forward
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
