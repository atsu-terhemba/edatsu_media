import React, { useState, useRef, useEffect } from 'react';

const ShareButton = ({ title, id, type = 'opp', variant = 'icon', className = '' }) => {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const dropdownRef = useRef(null);

    const sluggedTitle = title?.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-') || '';
    const baseUrl = 'https://media.edatsu.com';
    const shareUrl = type === 'tool'
        ? `${baseUrl}/product/${id}/${sluggedTitle}`
        : `${baseUrl}/op/${id}/${sluggedTitle}`;

    const platforms = [
        { name: 'WhatsApp', icon: '/img/gif/icons8-whatsapp-50.png', color: '#25D366', url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}` },
        { name: 'Telegram', icon: '/img/gif/icons8-telegram-50.png', color: '#0088cc', url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}` },
        { name: 'Twitter', icon: '/img/gif/icons8-twitter-50.png', color: '#1da1f2', url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}` },
        { name: 'LinkedIn', icon: '/img/gif/icons8-linkedin-50.png', color: '#0077b5', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
        { name: 'Facebook', icon: '/img/gif/icons8-facebook-50.png', color: '#1877f2', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    ];

    useEffect(() => {
        if (!open) return;
        const handleClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [open]);

    const handleShare = async () => {
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isMobile && navigator.share) {
            try {
                await navigator.share({ title, url: shareUrl });
                return;
            } catch (e) {
                if (e.name === 'AbortError') return;
            }
        }
        setOpen(!open);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => { setCopied(false); setOpen(false); }, 1200);
        } catch {
            // fallback
            const ta = document.createElement('textarea');
            ta.value = shareUrl;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            setCopied(true);
            setTimeout(() => { setCopied(false); setOpen(false); }, 1200);
        }
    };

    // Icon-only variant (for card footers)
    if (variant === 'icon') {
        return (
            <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-flex' }} className={className}>
                <button
                    onClick={handleShare}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f5f7'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#86868b', transition: 'color 0.15s ease' }}>
                        ios_share
                    </span>
                </button>
                {open && <ShareDropdown platforms={platforms} onCopy={handleCopy} copied={copied} position="bottom-end" />}
            </div>
        );
    }

    // Button variant (for detail page action bars)
    return (
        <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-flex' }} className={className}>
            <button
                onClick={handleShare}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: variant === 'button-lg' ? '12px 32px' : '10px 24px',
                    borderRadius: '9999px',
                    border: '1px solid #e5e5e5',
                    background: 'transparent',
                    color: '#000',
                    fontSize: variant === 'button-lg' ? '14px' : '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#000'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e5e5'; }}
            >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>ios_share</span>
                Share
            </button>
            {open && <ShareDropdown platforms={platforms} onCopy={handleCopy} copied={copied} position="top-end" />}
        </div>
    );
};

const ShareDropdown = ({ platforms, onCopy, copied, position }) => {
    const isTop = position.startsWith('top');

    return (
        <div style={{
            position: 'absolute',
            [isTop ? 'bottom' : 'top']: 'calc(100% + 8px)',
            right: 0,
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
            border: '1px solid #f0f0f0',
            padding: '8px',
            zIndex: 1050,
            minWidth: '200px',
            animation: 'shareDropdownIn 0.2s ease',
        }}>
            {platforms.map((p) => (
                <a
                    key={p.name}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '9px 12px',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: '#000',
                        transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f7'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    <span style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: `${p.color}12`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        <img src={p.icon} alt={p.name} style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                    </span>
                    {p.name}
                </a>
            ))}

            <div style={{ height: '1px', background: '#f0f0f0', margin: '4px 0' }} />

            <button
                onClick={onCopy}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: copied ? '#16a34a' : '#000',
                    background: 'transparent',
                    border: 'none',
                    width: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f7'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
                <span style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: copied ? '#dcfce7' : '#f5f5f7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '15px', color: copied ? '#16a34a' : '#86868b' }}>
                        {copied ? 'check' : 'link'}
                    </span>
                </span>
                {copied ? 'Copied!' : 'Copy link'}
            </button>

            <style>{`
                @keyframes shareDropdownIn {
                    from { opacity: 0; transform: scale(0.95) translateY(${isTop ? '4px' : '-4px'}); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default ShareButton;
