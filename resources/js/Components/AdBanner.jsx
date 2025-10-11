import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';

/**
 * AdBanner Component - Displays Google Ads or placeholder
 * 
 * Common Google AdSense sizes:
 * - Leaderboard: 728x90
 * - Large Leaderboard: 970x90
 * - Medium Rectangle: 300x250
 * - Large Rectangle: 336x280
 * - Wide Skyscraper: 160x600
 * - Half Page: 300x600
 * - Mobile Banner: 320x50
 * - Large Mobile Banner: 320x100
 * - Responsive: fluid (auto-adjusts)
 */

const AdBanner = ({ 
    slot, 
    size = 'responsive', 
    className = '',
    style = {},
}) => {
    const [isHidden, setIsHidden] = useState(false);
    
    // Get ad settings from page props
    const { adSettings, auth } = usePage().props;
    const isEnabled = adSettings?.enabled || false;
    const showPlaceholders = adSettings?.show_placeholders !== false; // Global placeholder control
    const isAdmin = auth?.user?.role === 'admin';
    
    // Get specific ad slot settings
    const slotSettings = adSettings?.slots?.[slot];
    const slotAdCode = slotSettings?.ad_code;
    const isVisible = slotSettings?.is_visible !== false; // Default to true if not set

    // If global setting hides all placeholders, don't render
    if (!showPlaceholders) {
        return null;
    }

    // If backend has hidden this slot, don't render anything
    if (!isVisible) {
        return null;
    }

    // Predefined sizes
    const sizeMap = {
        'leaderboard': { width: '728px', height: '90px', label: 'Leaderboard 728x90' },
        'large-leaderboard': { width: '970px', height: '90px', label: 'Large Leaderboard 970x90' },
        'medium-rectangle': { width: '300px', height: '250px', label: 'Medium Rectangle 300x250' },
        'large-rectangle': { width: '336px', height: '280px', label: 'Large Rectangle 336x280' },
        'wide-skyscraper': { width: '160px', height: '600px', label: 'Wide Skyscraper 160x600' },
        'half-page': { width: '300px', height: '600px', label: 'Half Page 300x600' },
        'mobile-banner': { width: '320px', height: '50px', label: 'Mobile Banner 320x50' },
        'large-mobile-banner': { width: '320px', height: '100px', label: 'Large Mobile Banner 320x100' },
        'responsive': { width: '100%', height: 'auto', label: 'Responsive' }
    };

    const dimensions = sizeMap[size] || sizeMap['responsive'];

    // If hidden, don't render anything
    if (isHidden) {
        return null;
    }

    // If ads are disabled or no ad code, show placeholder
    if (!isEnabled || !slotAdCode) {
        return (
            <div 
                className={`ad-placeholder ${className}`}
                style={{
                    width: dimensions.width,
                    maxWidth: '100%',
                    height: dimensions.height === 'auto' ? (size === 'responsive' ? '250px' : '90px') : dimensions.height,
                    backgroundColor: '#f3f4f6',
                    border: '2px dashed #d1d5db',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    margin: '0 auto',
                    position: 'relative',
                    ...style
                }}
            >
                {/* Close Button - Admin Only */}
                {isAdmin && (
                    <button
                        onClick={() => setIsHidden(true)}
                        style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '18px',
                            lineHeight: '1',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = '#dc2626';
                            e.target.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = '#ef4444';
                            e.target.style.transform = 'scale(1)';
                        }}
                        title="Hide this ad placeholder (Admin only)"
                    >
                        ×
                    </button>
                )}

                <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#9ca3af', marginBottom: '8px' }}>
                    ad_units
                </span>
                <p style={{ 
                    color: '#6b7280', 
                    fontSize: '14px', 
                    margin: '0',
                    textAlign: 'center',
                    fontWeight: '500'
                }}>
                    {dimensions.label}
                </p>
                <p style={{ 
                    color: '#9ca3af', 
                    fontSize: '12px', 
                    margin: '4px 0 0 0',
                    textAlign: 'center'
                }}>
                    Ad Placeholder - Slot: {slot}
                </p>
            </div>
        );
    }

    // Render actual ad code
    return (
        <div 
            className={`ad-container ${className}`}
            style={{
                width: dimensions.width,
                maxWidth: '100%',
                height: dimensions.height,
                margin: '0 auto',
                ...style
            }}
            dangerouslySetInnerHTML={{ __html: slotAdCode }}
        />
    );
};

export default AdBanner;
