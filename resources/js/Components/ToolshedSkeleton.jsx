import React from 'react';

const ToolshedSkeleton = ({ count = 6 }) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div key={index} className="col-md-6 col-lg-4">
          <div
            style={{
              background: '#fff',
              border: '1px solid #f0f0f0',
              borderRadius: '16px',
              padding: '24px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '320px',
            }}
          >
            {/* Icon Skeleton */}
            <div
              className="skeleton-loader"
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                marginBottom: '16px',
              }}
            />

            {/* Rating Skeleton */}
            <div className="d-flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className="skeleton-loader"
                  style={{ width: '14px', height: '14px', borderRadius: '2px' }}
                />
              ))}
              <div
                className="skeleton-loader"
                style={{ width: '40px', height: '14px', borderRadius: '4px', marginLeft: '4px' }}
              />
            </div>

            {/* Title Skeleton */}
            <div
              className="skeleton-loader"
              style={{
                height: '18px',
                width: '75%',
                borderRadius: '6px',
                marginBottom: '12px',
              }}
            />

            {/* Description Skeleton */}
            <div style={{ marginBottom: '16px', flexGrow: 1 }}>
              <div
                className="skeleton-loader"
                style={{ height: '13px', width: '100%', borderRadius: '4px', marginBottom: '6px' }}
              />
              <div
                className="skeleton-loader"
                style={{ height: '13px', width: '85%', borderRadius: '4px' }}
              />
            </div>

            {/* Actions Skeleton */}
            <div className="d-flex justify-content-between align-items-center" style={{ paddingTop: '12px', borderTop: '1px solid #f5f5f7' }}>
              <div className="d-flex gap-2">
                <div className="skeleton-loader" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                <div className="skeleton-loader" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
              </div>
              <div className="skeleton-loader" style={{ width: '90px', height: '34px', borderRadius: '9999px' }} />
            </div>
          </div>
        </div>
      ))}

      <style>{`
        .skeleton-loader {
          animation: shimmer 1.5s infinite;
          background: linear-gradient(
            90deg,
            #f0f0f0 0%,
            #f8f8f8 40%,
            #f0f0f0 80%
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
    </>
  );
};

export default ToolshedSkeleton;
