import React, { useState, useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';

const sizeMap = {
    'leaderboard': { width: '728px', height: '90px', label: '728 x 90' },
    'large-leaderboard': { width: '970px', height: '90px', label: '970 x 90' },
    'medium-rectangle': { width: '300px', height: '250px', label: '300 x 250' },
    'large-rectangle': { width: '336px', height: '280px', label: '336 x 280' },
    'wide-skyscraper': { width: '160px', height: '600px', label: '160 x 600' },
    'half-page': { width: '300px', height: '600px', label: '300 x 600' },
    'mobile-banner': { width: '320px', height: '50px', label: '320 x 50' },
    'large-mobile-banner': { width: '320px', height: '100px', label: '320 x 100' },
    'responsive': { width: '100%', height: 'auto', label: 'Responsive' },
};

const AdBanner = ({ slot, size = 'responsive', className = '', style = {} }) => {
    const [hidden, setHidden] = useState(false);
    const adRef = useRef(null);
    const { adSettings, auth } = usePage().props;

    const enabled = adSettings?.enabled || false;
    const showPlaceholders = adSettings?.show_placeholders !== false;
    const isAdmin = auth?.user?.role === 'admin';

    const slotSettings = adSettings?.slots?.[slot];
    const adCode = slotSettings?.ad_code;
    const isVisible = slotSettings?.is_visible !== false;
    const publisherId = adSettings?.publisher_id;

    const dimensions = sizeMap[slotSettings?.size] || sizeMap[size] || sizeMap['responsive'];

    // Execute ad code scripts after mount
    useEffect(() => {
        if (!enabled || !adCode || !adRef.current || hidden) return;

        const container = adRef.current;
        container.innerHTML = '';

        // Parse the ad code HTML
        const temp = document.createElement('div');
        temp.innerHTML = adCode;

        // Ensure AdSense library is loaded
        if (publisherId) {
            const src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
            if (!document.querySelector(`script[src="${src}"]`)) {
                const lib = document.createElement('script');
                lib.src = src;
                lib.async = true;
                lib.crossOrigin = 'anonymous';
                document.head.appendChild(lib);
            }
        }

        // Insert non-script nodes first, then create and execute scripts
        Array.from(temp.childNodes).forEach((node) => {
            if (node.nodeName === 'SCRIPT') {
                const script = document.createElement('script');
                // Copy attributes
                Array.from(node.attributes || []).forEach((attr) => {
                    script.setAttribute(attr.name, attr.value);
                });
                script.textContent = node.textContent;
                container.appendChild(script);
            } else {
                container.appendChild(node.cloneNode(true));
            }
        });

        // Push adsbygoogle if an <ins> tag was inserted
        if (container.querySelector('ins.adsbygoogle')) {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                // Ad already pushed or blocked
            }
        }
    }, [enabled, adCode, hidden, publisherId]);

    if (hidden || !isVisible) return null;

    // No ads enabled and no placeholders → render nothing
    if (!enabled && !showPlaceholders) return null;
    if (!adCode && !showPlaceholders) return null;

    // Show placeholder when ads disabled or no code configured
    if (!enabled || !adCode) {
        return (
            <div className={`ad-placeholder ${className}`} style={{
                width: dimensions.width, maxWidth: '100%',
                height: dimensions.height === 'auto' ? '120px' : dimensions.height,
                background: '#f5f5f7', border: '1px dashed #d2d2d7', borderRadius: '12px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: '4px', margin: '0 auto', position: 'relative', ...style,
            }}>
                {isAdmin && (
                    <button onClick={() => setHidden(true)} style={{
                        position: 'absolute', top: '8px', right: '8px', background: '#86868b',
                        color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        fontSize: '14px', lineHeight: 1,
                    }} title="Hide placeholder">×</button>
                )}
                <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#86868b' }}>ad_units</span>
                <span style={{ fontSize: '12px', color: '#86868b', fontWeight: 500 }}>{dimensions.label}</span>
                <span style={{ fontSize: '11px', color: '#aeaeb2' }}>Ad — {slot}</span>
            </div>
        );
    }

    // Render actual ad code via ref (scripts execute properly)
    return (
        <div
            ref={adRef}
            className={`ad-container ${className}`}
            style={{
                width: dimensions.width, maxWidth: '100%',
                minHeight: dimensions.height === 'auto' ? '90px' : dimensions.height,
                margin: '0 auto', textAlign: 'center', ...style,
            }}
        />
    );
};

export default AdBanner;
