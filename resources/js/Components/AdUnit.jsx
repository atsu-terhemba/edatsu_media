import { useEffect, useRef } from 'react';

const AD_CLIENT = 'ca-pub-7365396698208751';

const AD_SLOTS = {
    horizontal: { slot: '7889919728', format: 'auto', fullWidthResponsive: true },
    infeed: { slot: '7226228488', format: 'fluid', layoutKey: '-h6+1+2-i+l' },
    square: { slot: '1848837203', format: 'auto', fullWidthResponsive: true },
};

export default function AdUnit({ type = 'horizontal', className = '', style = {} }) {
    const adRef = useRef(null);
    const pushed = useRef(false);

    const config = AD_SLOTS[type] || AD_SLOTS.horizontal;

    useEffect(() => {
        if (pushed.current) return;
        try {
            if (adRef.current && adRef.current.childElementCount === 0) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                pushed.current = true;
            }
        } catch (e) {
            // AdSense not loaded or ad blocked
        }
    }, []);

    return (
        <div
            className={className}
            style={{
                background: '#fafafa',
                border: '1px solid #f0f0f0',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center',
                overflow: 'hidden',
                ...style,
            }}
        >
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
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: 'block', ...(type === 'infeed' ? {} : {}) }}
                data-ad-client={AD_CLIENT}
                data-ad-slot={config.slot}
                data-ad-format={config.format}
                {...(config.layoutKey ? { 'data-ad-layout-key': config.layoutKey } : {})}
                {...(config.fullWidthResponsive ? { 'data-full-width-responsive': 'true' } : {})}
            />
        </div>
    );
}
