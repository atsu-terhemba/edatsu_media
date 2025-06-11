import { Button } from "react-bootstrap";

const DefaultPagination = ({pagination, triggerPagination, isLoading = false}) => {

  function modifyPaginationLabel(label) {
    return label
      .replace(/&laquo;\s*Previous/g, '«')
      .replace(/Next\s*&raquo;/g, '»')
      .replace(/&[lr]aquo;/g, '');
  }

  const renderPaginationButtons = () => {
    if (!pagination || pagination.length === 0) return null;
    
    // Find current page and last page
    const activePage = pagination.find(p => p.active);
    const currentPage = activePage 
      ? parseInt(activePage.label.replace(/\D/g, '')) 
      : 1;
    
    const lastPage = pagination
      .filter(p => p.label.match(/^\d+$/))
      .reduce((max, p) => {
        const pageNum = parseInt(p.label);
        return pageNum > max ? pageNum : max;
      }, 0);
    
    // If there's only one page or no pages, don't show complex pagination
    if (lastPage <= 1) {
      return pagination.filter(p => !p.label.includes('Previous') && !p.label.includes('Next'));
    }
    
    // Determine which pages to show
    let pagesToShow = [];
    
    // Always include first page, current page, and last page
    const alwaysInclude = [1, currentPage, lastPage];
    
    // Add pages adjacent to current page
    if (currentPage > 1) alwaysInclude.push(currentPage - 1);
    if (currentPage < lastPage) alwaysInclude.push(currentPage + 1);
    
    // Add one more page on each side if there's room
    if (currentPage > 2) alwaysInclude.push(currentPage - 2);
    if (currentPage < lastPage - 1) alwaysInclude.push(currentPage + 2);
    
    // Filter out duplicates, invalid pages, and sort
    pagesToShow = [...new Set(alwaysInclude)]
      .filter(page => page >= 1 && page <= lastPage)
      .sort((a, b) => a - b);
    
    // Find gaps that need ellipses
    const result = [];
    let prevPage = 0;
    
    pagesToShow.forEach(pageNum => {
      // If there's a gap greater than 1, add ellipsis
      if (pageNum - prevPage > 1) {
        result.push({ isEllipsis: true, key: `ellipsis-${prevPage}-${pageNum}` });
      }
      
      // Add the actual page button
      const pageButton = pagination.find(p => {
        const cleanLabel = modifyPaginationLabel(p.label);
        return cleanLabel == pageNum.toString();
      });
      
      if (pageButton) {
        result.push(pageButton);
      }
      
      prevPage = pageNum;
    });
    
    // Add previous and next buttons if they exist
    const prevButton = pagination.find(p => p.label.includes('Previous') || p.label.includes('laquo'));
    const nextButton = pagination.find(p => p.label.includes('Next') || p.label.includes('raquo'));
    
    return [
      prevButton,
      ...result,
      nextButton
    ].filter(Boolean);
  };

  const handlePaginationClick = (url) => {
    // Don't trigger pagination if already loading or if URL is null/undefined
    if (isLoading || !url) return;
    triggerPagination(url);
  };

  return (
    <div className="d-flex flex-wrap justify-content-center align-items-center">
      {renderPaginationButtons()?.map((p) => {
        if (p.isEllipsis) {
          return (
            <Button 
              className="btn me-2 px-3 border-0 my-1 fs-9" 
              style={{ backgroundColor: '#6c757d', cursor: 'default' }}
              key={p.key}
              disabled
            >
              ...
            </Button>
          );
        }
        
        let active_bg = (p.active) ? "#FB5607" : '#212529';
        let active_txt = (p.active) ? "white" : 'white';
        
        // Disable button if loading or if it's the current active page
        const isDisabled = isLoading || p.active || !p.url;
        
        return (
          <Button 
            className="btn me-2 px-3 border-0 my-1 fs-9" 
            style={{ 
              backgroundColor: active_bg, 
              color: active_txt,
              opacity: isDisabled ? 0.6 : 1,
              cursor: isDisabled ? 'not-allowed' : 'pointer'
            }}
            key={p.label} 
            onClick={() => handlePaginationClick(p.url)}
            disabled={isDisabled}
          >
            {modifyPaginationLabel(p.label)}
          </Button>
        );
      })}
    </div>
  );
};

export default DefaultPagination;