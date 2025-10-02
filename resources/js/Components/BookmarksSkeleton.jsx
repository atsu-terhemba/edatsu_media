import React from 'react';
import { Card } from 'react-bootstrap';

const BookmarksSkeleton = ({ count = 3 }) => {
    return (
        <>
            {[...Array(count)].map((_, index) => (
                <Card 
                    key={index} 
                    className='mb-3'
                    style={{
                        border: '1px solid #dee2e6',
                        boxShadow: 'none'
                    }}
                >
                    <Card.Body className='p-3'>
                        <div className='d-flex align-items-start justify-content-between'>
                            <div className='flex-grow-1'>
                                {/* Title Skeleton */}
                                <div 
                                    className="skeleton-loader mb-2"
                                    style={{
                                        height: '20px',
                                        width: '70%',
                                        backgroundColor: '#e5e7eb',
                                        borderRadius: '4px'
                                    }}
                                />
                                
                                {/* Badges Skeleton */}
                                <div className='d-flex align-items-center gap-2 mb-2'>
                                    <div 
                                        className="skeleton-loader"
                                        style={{
                                            height: '24px',
                                            width: '80px',
                                            backgroundColor: '#e5e7eb',
                                            borderRadius: '4px'
                                        }}
                                    />
                                    <div 
                                        className="skeleton-loader"
                                        style={{
                                            height: '24px',
                                            width: '100px',
                                            backgroundColor: '#e5e7eb',
                                            borderRadius: '4px'
                                        }}
                                    />
                                </div>
                                
                                {/* Date Skeleton */}
                                <div 
                                    className="skeleton-loader"
                                    style={{
                                        height: '16px',
                                        width: '150px',
                                        backgroundColor: '#e5e7eb',
                                        borderRadius: '4px'
                                    }}
                                />
                            </div>
                            
                            {/* Button Skeleton */}
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
                    </Card.Body>
                </Card>
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

export default BookmarksSkeleton;
