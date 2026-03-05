import React from 'react';
import { Row, Col } from 'react-bootstrap';

const DashboardSkeleton = () => {
    return (
        <>
            {/* Header Skeleton */}
            <div style={{ paddingBottom: '24px' }}>
                <div className="skeleton-loader" style={{ height: '28px', width: '220px', borderRadius: '6px', marginBottom: '8px' }} />
                <div className="skeleton-loader" style={{ height: '16px', width: '300px', borderRadius: '4px' }} />
            </div>

            {/* Stats Cards Skeleton */}
            <Row className="g-3 mb-4">
                {[0, 1, 2].map((i) => (
                    <Col md={4} key={i}>
                        <div style={{
                            padding: '28px',
                            borderRadius: '16px',
                            border: '1px solid #f0f0f0',
                            background: '#fff',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div className="skeleton-loader" style={{ height: '12px', width: '80px', borderRadius: '4px', marginBottom: '10px' }} />
                                    <div style={{ marginBottom: '10px' }} />
                                    <div className="skeleton-loader" style={{ height: '32px', width: '48px', borderRadius: '6px' }} />
                                </div>
                                <div className="skeleton-loader" style={{ width: '44px', height: '44px', borderRadius: '12px' }} />
                            </div>
                            <div className="skeleton-loader" style={{ height: '24px', width: '120px', borderRadius: '9999px', marginTop: '14px' }} />
                        </div>
                    </Col>
                ))}
            </Row>

            {/* Expiring Section Skeleton */}
            <div style={{
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid #f0f0f0',
                marginBottom: '16px',
            }}>
                <div className="skeleton-loader" style={{ height: '12px', width: '100px', borderRadius: '4px', marginBottom: '6px' }} />
                <div style={{ marginBottom: '16px' }} />
                {[0, 1].map((i) => (
                    <div key={i} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '14px 0',
                        borderBottom: i === 0 ? '1px solid #f5f5f7' : 'none',
                    }}>
                        <div style={{ flex: 1 }}>
                            <div className="skeleton-loader" style={{ height: '16px', width: '60%', borderRadius: '4px', marginBottom: '6px' }} />
                            <div className="skeleton-loader" style={{ height: '12px', width: '35%', borderRadius: '4px' }} />
                        </div>
                        <div className="skeleton-loader" style={{ width: '32px', height: '32px', borderRadius: '9999px', flexShrink: 0, marginLeft: '12px' }} />
                    </div>
                ))}
            </div>

            {/* Activity Section Skeleton */}
            <div style={{
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid #f0f0f0',
                marginBottom: '32px',
            }}>
                <div className="skeleton-loader" style={{ height: '12px', width: '90px', borderRadius: '4px', marginBottom: '6px' }} />
                <div style={{ marginBottom: '16px' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="skeleton-loader" style={{ width: '44px', height: '44px', borderRadius: '12px' }} />
                        <div>
                            <div className="skeleton-loader" style={{ height: '24px', width: '40px', borderRadius: '4px', marginBottom: '4px' }} />
                            <div className="skeleton-loader" style={{ height: '12px', width: '140px', borderRadius: '4px' }} />
                        </div>
                    </div>
                    <div className="skeleton-loader" style={{ height: '36px', width: '90px', borderRadius: '9999px' }} />
                </div>
            </div>

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

export default DashboardSkeleton;
