import React from 'react';
import { Card } from 'react-bootstrap';

const ToolshedSkeleton = ({ count = 6 }) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div key={index} className="col-md-6 col-lg-4">
          <Card 
            className="h-100 border-0 shadow-sm position-relative tool-card"
            style={{ 
              transition: 'transform 0.2s'
            }}
          >
            <Card.Body className="p-4 d-flex flex-column" style={{ height: '400px' }}>
              {/* Image/Icon Skeleton */}
              <div className="mb-3">
                <div 
                  className="rounded skeleton-loader"
                  style={{ 
                    width: '60px', 
                    height: '60px',
                    backgroundColor: '#e5e7eb'
                  }}
                />
              </div>
              
              {/* Title Skeleton */}
              <div className="mb-3">
                <div 
                  className="skeleton-loader mb-2"
                  style={{
                    height: '24px',
                    width: '85%',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '4px'
                  }}
                />
                <div 
                  className="skeleton-loader"
                  style={{
                    height: '24px',
                    width: '60%',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '4px'
                  }}
                />
              </div>
              
              {/* Description Skeleton */}
              <div className="mb-4 flex-grow-1">
                <div 
                  className="skeleton-loader mb-2"
                  style={{
                    height: '14px',
                    width: '100%',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '4px'
                  }}
                />
                <div 
                  className="skeleton-loader mb-2"
                  style={{
                    height: '14px',
                    width: '95%',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '4px'
                  }}
                />
                <div 
                  className="skeleton-loader"
                  style={{
                    height: '14px',
                    width: '80%',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '4px'
                  }}
                />
              </div>
              
              {/* Price and Rating Section Skeleton */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <div 
                    className="skeleton-loader mb-2"
                    style={{
                      height: '20px',
                      width: '50px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '4px'
                    }}
                  />
                  <div 
                    className="skeleton-loader"
                    style={{
                      height: '14px',
                      width: '100px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>
              
              {/* Button Skeleton */}
              <div className="mt-auto">
                <div 
                  className="skeleton-loader"
                  style={{
                    height: '44px',
                    width: '100%',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '8px'
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </div>
      ))}
      
      <style jsx>{`
        .skeleton-loader {
          animation: shimmer 1.5s infinite;
          background: linear-gradient(
            90deg,
            #e5e7eb 0%,
            #f3f4f6 40%,
            #e5e7eb 80%
          );
          background-size: 200% 100%;
        }
        
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        
        .tool-card:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </>
  );
};

export default ToolshedSkeleton;
