import React from 'react';
import { ListGroup } from 'react-bootstrap';

const NotificationsSkeleton = ({ count = 5 }) => {
    return (
        <>
            {[...Array(count)].map((_, index) => (
                <div 
                    key={index}
                    className='mb-2 p-3 d-flex justify-content-between align-items-start'
                    style={{
                        border: '1px solid #dee2e6',
                        borderRadius: '6px'
                    }}
                >
                    <div className='d-flex align-items-start flex-grow-1'>
                        {/* Icon Skeleton */}
                        <div 
                            className="skeleton-loader me-3 mt-1"
                            style={{
                                height: '24px',
                                width: '24px',
                                backgroundColor: '#e5e7eb',
                                borderRadius: '50%'
                            }}
                        />
                        <div className='flex-grow-1'>
                            {/* Title Skeleton */}
                            <div 
                                className="skeleton-loader mb-2"
                                style={{
                                    height: '20px',
                                    width: '60%',
                                    backgroundColor: '#e5e7eb',
                                    borderRadius: '4px'
                                }}
                            />
                            {/* Message Skeleton */}
                            <div 
                                className="skeleton-loader mb-2"
                                style={{
                                    height: '16px',
                                    width: '90%',
                                    backgroundColor: '#e5e7eb',
                                    borderRadius: '4px'
                                }}
                            />
                            {/* Date Skeleton */}
                            <div 
                                className="skeleton-loader"
                                style={{
                                    height: '14px',
                                    width: '120px',
                                    backgroundColor: '#e5e7eb',
                                    borderRadius: '4px'
                                }}
                            />
                        </div>
                    </div>
                    {/* Button Skeleton */}
                    <div 
                        className="skeleton-loader ms-2"
                        style={{
                            height: '32px',
                            width: '60px',
                            backgroundColor: '#e5e7eb',
                            borderRadius: '6px'
                        }}
                    />
                </div>
            ))}
            
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

export default NotificationsSkeleton;
