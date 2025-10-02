import React from 'react';

const DashboardSkeleton = () => {
    return (
        <>
            {/* Header Skeleton */}
            <div className='px-4 py-3 rounded my-3' style={{border: '1px solid #dee2e6'}}>
                <div className='d-flex justify-content-between align-items-center'>
                    <div 
                        className="skeleton-loader"
                        style={{
                            height: '28px',
                            width: '200px',
                            backgroundColor: '#e5e7eb',
                            borderRadius: '4px'
                        }}
                    />
                    <div 
                        className="skeleton-loader"
                        style={{
                            height: '32px',
                            width: '80px',
                            backgroundColor: '#e5e7eb',
                            borderRadius: '6px'
                        }}
                    />
                </div>
            </div>

            {/* Expiring Soon Section Skeleton */}
            <div className='mb-3'>
                <div className='p-3 rounded' style={{border: '1px solid #dee2e6'}}>
                    <div 
                        className="skeleton-loader mb-3"
                        style={{
                            height: '24px',
                            width: '250px',
                            backgroundColor: '#e5e7eb',
                            borderRadius: '4px'
                        }}
                    />
                    {[...Array(2)].map((_, index) => (
                        <div key={index} className='d-flex justify-content-between align-items-center py-2' style={{borderBottom: index === 0 ? '1px solid #dee2e6' : 'none'}}>
                            <div className='flex-grow-1'>
                                <div 
                                    className="skeleton-loader mb-2"
                                    style={{
                                        height: '18px',
                                        width: '60%',
                                        backgroundColor: '#e5e7eb',
                                        borderRadius: '4px'
                                    }}
                                />
                                <div 
                                    className="skeleton-loader"
                                    style={{
                                        height: '14px',
                                        width: '40%',
                                        backgroundColor: '#e5e7eb',
                                        borderRadius: '4px'
                                    }}
                                />
                            </div>
                            <div 
                                className="skeleton-loader"
                                style={{
                                    height: '32px',
                                    width: '32px',
                                    backgroundColor: '#e5e7eb',
                                    borderRadius: '6px'
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Reminders Section Skeleton */}
            <div className='mb-3'>
                <div className='p-3 rounded' style={{border: '1px solid #dee2e6'}}>
                    <div 
                        className="skeleton-loader mb-3"
                        style={{
                            height: '24px',
                            width: '200px',
                            backgroundColor: '#e5e7eb',
                            borderRadius: '4px'
                        }}
                    />
                    {[...Array(2)].map((_, index) => (
                        <div key={index} className='d-flex justify-content-between align-items-center py-2' style={{borderBottom: index === 0 ? '1px solid #dee2e6' : 'none'}}>
                            <div className='flex-grow-1'>
                                <div 
                                    className="skeleton-loader mb-2"
                                    style={{
                                        height: '18px',
                                        width: '70%',
                                        backgroundColor: '#e5e7eb',
                                        borderRadius: '4px'
                                    }}
                                />
                                <div 
                                    className="skeleton-loader mb-1"
                                    style={{
                                        height: '14px',
                                        width: '50%',
                                        backgroundColor: '#e5e7eb',
                                        borderRadius: '4px'
                                    }}
                                />
                                <div 
                                    className="skeleton-loader"
                                    style={{
                                        height: '14px',
                                        width: '45%',
                                        backgroundColor: '#e5e7eb',
                                        borderRadius: '4px'
                                    }}
                                />
                            </div>
                            <div 
                                className="skeleton-loader"
                                style={{
                                    height: '32px',
                                    width: '32px',
                                    backgroundColor: '#e5e7eb',
                                    borderRadius: '6px'
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Activity Section Skeleton */}
            <div className='p-3 rounded' style={{border: '1px solid #dee2e6'}}>
                <div 
                    className="skeleton-loader mb-3"
                    style={{
                        height: '24px',
                        width: '150px',
                        backgroundColor: '#e5e7eb',
                        borderRadius: '4px'
                    }}
                />
                
                <div className='mb-3 pb-3' style={{borderBottom: '1px solid #dee2e6'}}>
                    <div className='d-flex justify-content-between align-items-center mb-2'>
                        <div className='d-flex align-items-center gap-2'>
                            <div 
                                className="skeleton-loader"
                                style={{
                                    height: '32px',
                                    width: '32px',
                                    backgroundColor: '#e5e7eb',
                                    borderRadius: '4px'
                                }}
                            />
                            <div 
                                className="skeleton-loader"
                                style={{
                                    height: '32px',
                                    width: '40px',
                                    backgroundColor: '#e5e7eb',
                                    borderRadius: '4px'
                                }}
                            />
                        </div>
                        <div 
                            className="skeleton-loader"
                            style={{
                                height: '32px',
                                width: '80px',
                                backgroundColor: '#e5e7eb',
                                borderRadius: '6px'
                            }}
                        />
                    </div>
                    <div 
                        className="skeleton-loader"
                        style={{
                            height: '14px',
                            width: '180px',
                            backgroundColor: '#e5e7eb',
                            borderRadius: '4px'
                        }}
                    />
                </div>
                
                <div>
                    <div 
                        className="skeleton-loader mb-2"
                        style={{
                            height: '14px',
                            width: '250px',
                            backgroundColor: '#e5e7eb',
                            borderRadius: '4px'
                        }}
                    />
                    <div 
                        className="skeleton-loader"
                        style={{
                            height: '14px',
                            width: '200px',
                            backgroundColor: '#e5e7eb',
                            borderRadius: '4px'
                        }}
                    />
                </div>
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    0% {
                        background-position: -1000px 0;
                    }
                    100% {
                        background-position: 1000px 0;
                    }
                }
                
                .skeleton-loader {
                    animation: shimmer 2s infinite linear;
                    background: linear-gradient(
                        to right,
                        #e5e7eb 0%,
                        #f3f4f6 50%,
                        #e5e7eb 100%
                    );
                    background-size: 1000px 100%;
                }
            `}</style>
        </>
    );
};

export default DashboardSkeleton;
