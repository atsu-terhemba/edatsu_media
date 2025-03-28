const ThreadLoader = () => {
    return (
      <>
        <div className="skeleton-container">
          {Array.from({ length: 20 }).map((_, index) => (
            <div className="skeleton-frame" key={index}>
              <div className="skeleton-img"></div>
              <div className="skeleton-content">
                <div className="skeleton-title"></div>
                <div className="skeleton-description"></div>
                <div className="skeleton-tags"></div>
                <div className="skeleton-timer"></div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };
  
  export default ThreadLoader;