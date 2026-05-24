import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const REACTIONS = [
    { key: 'like', icon: 'thumb_up', label: 'Like', color: '#3b82f6' },
    { key: 'insightful', icon: 'lightbulb', label: 'Insightful', color: '#eab308' },
    { key: 'fire', icon: 'local_fire_department', label: 'Fire', color: '#f97316' },
];

const showAuthPrompt = () => {
    Swal.fire({
        title: '',
        html: `
            <div style="text-align: center; padding: 20px;">
                <span class="material-symbols-outlined" style="font-size: 48px; color: #f97316; margin-bottom: 16px; display: block; font-variation-settings: 'FILL' 1;">favorite</span>
                <h3 style="font-weight: 600; margin-bottom: 8px; color: #000; font-size: 1.15rem; font-family: 'Poppins', sans-serif;">React to articles</h3>
                <p style="color: #86868b; font-size: 14px; line-height: 1.5; margin-bottom: 24px;">
                    Create a free account to react to articles and shape what's trending.
                </p>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <a href="/login" style="padding: 10px 24px; border-radius: 9999px; border: 1px solid #e5e5e5; background: #fff; color: #000; font-size: 13px; font-weight: 500; text-decoration: none; font-family: 'Poppins', sans-serif;">Login</a>
                    <a href="/sign-up" style="padding: 10px 24px; border-radius: 9999px; border: none; background: #000; color: #fff; font-size: 13px; font-weight: 500; text-decoration: none; font-family: 'Poppins', sans-serif;">Sign Up Free</a>
                </div>
            </div>
        `,
        showConfirmButton: false,
        showCloseButton: true,
        width: '420px',
        padding: '0',
        background: 'white',
    });
};

const ReactionBar = ({ article, feed, reactions, isAuthenticated, onChange, size = 'sm' }) => {
    const [pending, setPending] = useState(null);

    const counts = reactions?.counts || { like: 0, insightful: 0, fire: 0 };
    const mine = reactions?.mine || [];

    const handleToggle = async (type) => {
        if (!isAuthenticated) {
            showAuthPrompt();
            return;
        }
        if (pending) return;

        const previously = { counts: { ...counts }, mine: [...mine] };
        const isOn = mine.includes(type);
        const optimistic = {
            counts: { ...counts, [type]: Math.max(0, counts[type] + (isOn ? -1 : 1)) },
            mine: isOn ? mine.filter((t) => t !== type) : [...mine, type],
        };

        setPending(type);
        onChange?.(article.link, optimistic);

        try {
            const res = await axios.post('/api/news-feeds/react', {
                article_link: article.link,
                article_title: article.title || '(untitled)',
                feed_title: feed?.title || article.feed_title || '',
                feed_favicon: feed?.favicon || article.feed_favicon || '',
                feed_url: feed?.feed_url || article.feed_url || '',
                reaction_type: type,
            });
            onChange?.(article.link, {
                counts: res.data.counts,
                mine: res.data.mine,
            });
        } catch (err) {
            onChange?.(article.link, previously);
            console.error('Failed to toggle reaction:', err);
        } finally {
            setPending(null);
        }
    };

    const padding = size === 'md' ? '6px 12px' : '4px 10px';
    const iconSize = size === 'md' ? '16px' : '14px';
    const fontSize = size === 'md' ? '12px' : '11px';

    return (
        <div style={{ display: 'inline-flex', gap: '6px', flexWrap: 'wrap' }}>
            {REACTIONS.map((r) => {
                const active = mine.includes(r.key);
                const count = counts[r.key] || 0;
                return (
                    <button
                        key={r.key}
                        onClick={(e) => { e.stopPropagation(); handleToggle(r.key); }}
                        title={active ? `Remove ${r.label}` : r.label}
                        disabled={pending === r.key}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding,
                            borderRadius: '9999px',
                            border: active ? `1px solid ${r.color}` : '1px solid #e5e5e5',
                            background: active ? `${r.color}1a` : '#fff',
                            color: active ? r.color : '#86868b',
                            fontSize,
                            fontWeight: 600,
                            cursor: pending === r.key ? 'wait' : 'pointer',
                            transition: 'all 0.15s ease',
                            fontFamily: "'Poppins', sans-serif",
                            opacity: pending && pending !== r.key ? 0.6 : 1,
                            lineHeight: 1,
                        }}
                        onMouseEnter={(e) => {
                            if (!active && !pending) {
                                e.currentTarget.style.borderColor = r.color;
                                e.currentTarget.style.color = r.color;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!active && !pending) {
                                e.currentTarget.style.borderColor = '#e5e5e5';
                                e.currentTarget.style.color = '#86868b';
                            }
                        }}
                    >
                        <span
                            className="material-symbols-outlined"
                            style={{
                                fontSize: iconSize,
                                fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                            }}
                        >
                            {r.icon}
                        </span>
                        {count > 0 && <span>{count}</span>}
                    </button>
                );
            })}
        </div>
    );
};

export default ReactionBar;
