import React from 'react';

const BookmarksSkeleton = ({ count = 3 }) => {
    return (
        <>
            {[...Array(count)].map((_, index) => (
                <div
                    key={index}
                    style={{
                        padding: '20px',
                        borderRadius: '16px',
                        border: '1px solid #f0f0f0',
                        background: '#fff',
                        marginBottom: '12px',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div style={{ flex: 1 }}>
                            {/* Title */}
                            <div className="skeleton-loader" style={{ height: '18px', width: '65%', borderRadius: '6px', marginBottom: '12px' }} />
                            {/* Badges */}
                            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                                <div className="skeleton-loader" style={{ height: '24px', width: '100px', borderRadius: '9999px' }} />
                                <div className="skeleton-loader" style={{ height: '24px', width: '80px', borderRadius: '9999px' }} />
                            </div>
                            {/* Meta */}
                            <div className="skeleton-loader" style={{ height: '14px', width: '140px', borderRadius: '4px' }} />
                        </div>
                        {/* Menu button */}
                        <div className="skeleton-loader" style={{ width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0 }} />
                    </div>
                </div>
            ))}

            <style>{`
                @keyframes shimmer {
                    0% { background-position: -1000px 0; }
                    100% { background-position: 1000px 0; }
                }
                .skeleton-loader {
                    animation: shimmer 2s infinite linear;
                    background: linear-gradient(to right, #f0f0f0 0%, #f8f8f8 50%, #f0f0f0 100%);
                    background-size: 1000px 100%;
                }
            `}</style>
        </>
    );
};

export default BookmarksSkeleton;
