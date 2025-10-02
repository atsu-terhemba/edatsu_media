import React from 'react';

const OpportunitiesSkeleton = ({ count = 6 }) => {
  return (
    <div className="" id="results-container">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="feed-panel text-wrap w-100 position-relative border-bottom">
          <div className="row d-flex align-items-center">
            {/* Image Skeleton - shown for some items to match real data variation */}
            {index % 3 !== 2 && (
              <div className="col-sm-2 col-4">
                <div className="image-container py-3">
                  <div 
                    className="skeleton-loader rounded"
                    style={{
                      width: '100%',
                      paddingBottom: '100%', // Creates a square aspect ratio
                      backgroundColor: '#e5e7eb'
                    }}
                  />
                </div>
              </div>
            )}
            
            {/* Content Skeleton */}
            <div className={index % 3 !== 2 ? "col-sm-10 col-8" : "col-sm-12 col-12"}>
              <div className="py-3">
                {/* Title Skeleton */}
                <div className="mb-2">
                  <div 
                    className="skeleton-loader mb-2"
                    style={{
                      height: '20px',
                      width: '75%',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '4px'
                    }}
                  />
                  <div 
                    className="skeleton-loader"
                    style={{
                      height: '20px',
                      width: '50%',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                
                {/* Label/Badge Skeleton */}
                <div className="mb-2 d-flex gap-2">
                  <div 
                    className="skeleton-loader"
                    style={{
                      height: '20px',
                      width: '80px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '12px'
                    }}
                  />
                  <div 
                    className="skeleton-loader"
                    style={{
                      height: '20px',
                      width: '100px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '12px'
                    }}
                  />
                </div>
                
                {/* Description Skeleton - Hidden on mobile like real content */}
                <div className="overflow-hidden truncate d-none d-sm-block mb-3">
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
                      width: '60%',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                
                {/* Footer with deadline and action buttons */}
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div 
                      className="skeleton-loader"
                      style={{
                        height: '16px',
                        width: '120px',
                        backgroundColor: '#e5e7eb',
                        borderRadius: '4px'
                      }}
                    />
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    {/* Share Icon Skeleton */}
                    <div 
                      className="skeleton-loader"
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: '#e5e7eb',
                        borderRadius: '2px'
                      }}
                    />
                    
                    {/* Bookmark Icon Skeleton */}
                    <div 
                      className="skeleton-loader"
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: '#e5e7eb',
                        borderRadius: '2px'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
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
      `}</style>
    </div>
  );
};

export default OpportunitiesSkeleton;
