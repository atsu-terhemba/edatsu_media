import { useEffect, useRef, useState } from 'react';

const AD_CLIENT = 'ca-pub-7365396698208751';

const AD_SLOTS = {
    horizontal: { slot: '7889919728', format: 'auto', fullWidthResponsive: true, minHeight: '100px' },
    infeed: { slot: '7226228488', format: 'fluid', layoutKey: '-h6+1+2-i+l', minHeight: '120px' },
    square: { slot: '1848837203', format: 'auto', fullWidthResponsive: true, minHeight: '250px' },
};

export default function AdUnit({ type = 'horizontal', className = '', style = {} }) {
    const adRef = useRef(null);
    const containerRef = useRef(null);
    const pushed = useRef(false);
    const [isClient, setIsClient] = useState(false);
    const [adLoaded, setAdLoaded] = useState(false);

    const config = AD_SLOTS[type] || AD_SLOTS.horizontal;

    // Only render the ad <ins> tag on the client, never during SSR
    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient || pushed.current) return;

        const timer = setTimeout(() => {
            try {
                if (adRef.current && window.adsbygoogle) {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                    pushed.current = true;
                }
            } catch (e) {
                // AdSense not loaded or ad blocked
            }
        }, 300);

        // Check if ad actually rendered after a delay
        const checkTimer = setTimeout(() => {
            if (adRef.current) {
                const adHeight = adRef.current.offsetHeight;
                if (adHeight > 0) {
                    setAdLoaded(true);
                }
            }
        }, 3000);

        return () => {
            clearTimeout(timer);
            clearTimeout(checkTimer);
        };
    }, [isClient]);

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                background: '#fafafa',
                border: '1px solid #e5e5e7',
                borderRadius: '12px',
                padding: '12px 16px',
                textAlign: 'center',
                overflow: 'hidden',
                minHeight: config.minHeight,
                position: 'relative',
                ...style,
            }}
        >
            {/* Sponsored label */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                marginBottom: '8px',
            }}>
                <span style={{
                    fontSize: '10px',
                    fontWeight: 500,
                    color: '#b0b0b0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                }}>
                    Sponsored
                </span>
            </div>

            {/* Placeholder shown until ad loads */}
            {!adLoaded && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: type === 'square' ? '200px' : '60px',
                    color: '#c7c7cc',
                    fontSize: '12px',
                    fontWeight: 400,
                    letterSpacing: '0.05em',
                }}>
                    Advertisement
                </div>
            )}

            {/* AdSense unit — only rendered client-side to avoid SSR/hydration conflicts */}
            {isClient && (
                <ins
                    ref={adRef}
                    className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client={AD_CLIENT}
                    data-ad-slot={config.slot}
                    data-ad-format={config.format}
                    {...(config.layoutKey ? { 'data-ad-layout-key': config.layoutKey } : {})}
                    {...(config.fullWidthResponsive ? { 'data-full-width-responsive': 'true' } : {})}
                />
            )}
        </div>
    );
}
