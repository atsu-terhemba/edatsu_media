import React from 'react';

const OpportunitiesSkeleton = ({ count = 6 }) => {
  return (
    <div className="" id="results-container">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="feed-panel text-wrap w-100 position-relative border-bottom">
          <div className="row d-flex align-items-center">
            {/* Image Skeleton - simple fixed size */}
            <div className="col-sm-2 col-4">
              <div className="py-3">
                <div 
                  className="skeleton-loader rounded"
                  style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#e5e7eb'
                  }}
                />
              </div>
            </div>
            
            {/* Content Skeleton */}
            <div className="col-sm-10 col-8">
              <div className="py-3">
                {/* Title Skeleton */}
                <div className="mb-3">
                  <div 
                    className="skeleton-loader"
                    style={{
                      height: '20px',
                      width: '70%',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                
                {/* Description Skeleton */}
                <div className="mb-3">
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
                    className="skeleton-loader"
                    style={{
                      height: '14px',
                      width: '80%',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                
                {/* Footer Skeleton */}
                <div className="d-flex justify-content-between align-items-center">
                  <div 
                    className="skeleton-loader"
                    style={{
                      height: '14px',
                      width: '80px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '4px'
                    }}
                  />
                  
                  <div 
                    className="skeleton-loader"
                    style={{
                      height: '14px',
                      width: '60px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <style jsx>{`
        .skeleton-loader {
          animation: shimmer 1.2s infinite;
          background: linear-gradient(
            90deg,
            #e2e8f0 0%,
            #f1f5f9 50%,
            #e2e8f0 100%
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
      `}</style>
    </div>
  );
};

export default OpportunitiesSkeleton;
