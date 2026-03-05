import React from 'react';

const NotificationsSkeleton = ({ count = 5 }) => {
    return (
        <>
            {[...Array(count)].map((_, index) => (
                <div
                    key={index}
                    style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '14px',
                        padding: '18px 20px',
                        borderRadius: '16px',
                        background: '#fff',
                        border: '1px solid #f0f0f0',
                        marginBottom: '8px',
                    }}
                >
                    {/* Icon */}
                    <div
                        className="skeleton-loader"
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            flexShrink: 0,
                        }}
                    />
                    <div style={{ flex: 1 }}>
                        {/* Title */}
                        <div
                            className="skeleton-loader"
                            style={{
                                height: '16px',
                                width: `${55 + (index % 3) * 10}%`,
                                borderRadius: '8px',
                                marginBottom: '8px',
                            }}
                        />
                        {/* Message */}
                        <div
                            className="skeleton-loader"
                            style={{
                                height: '14px',
                                width: `${75 + (index % 2) * 10}%`,
                                borderRadius: '8px',
                                marginBottom: '10px',
                            }}
                        />
                        {/* Date */}
                        <div
                            className="skeleton-loader"
                            style={{
                                height: '12px',
                                width: '80px',
                                borderRadius: '8px',
                            }}
                        />
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

export default NotificationsSkeleton;
