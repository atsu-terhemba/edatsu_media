import { Button } from "react-bootstrap";

const DefaultPagination = ({ pagination, triggerPagination }) => {
  function modifyPaginationLabel(label) {
    return label
      .replace(/&laquo;\s*Previous/g, '«')
      .replace(/Next\s*&raquo;/g, '»')
      .replace(/&[lr]aquo;/g, '');
  }

  const renderPaginationButtons = () => {
    if (!pagination || pagination.length === 0) return null;
    
    // Find current page and last page
    const currentPage = pagination.findIndex(p => p.active) !== -1 
      ? parseInt(pagination.find(p => p.active).label.replace(/\D/g, '')) 
      : 1;
    
    const lastPage = pagination
      .filter(p => p.label.match(/^\d+$/))
      .reduce((max, p) => {
        const pageNum = parseInt(p.label);
        return pageNum > max ? pageNum : max;
      }, 0);
    
    // Determine which pages to show
    let pagesToShow = [];
    
    // Always include first page, current page, and last page
    const alwaysInclude = [1, currentPage, lastPage];
    
    // Add pages adjacent to current page
    if (currentPage > 1) alwaysInclude.push(currentPage - 1);
    if (currentPage < lastPage) alwaysInclude.push(currentPage + 1);
    
    // Filter out duplicates and sort
    pagesToShow = [...new Set(alwaysInclude)].sort((a, b) => a - b);
    
    // Find gaps that need ellipses
    const result = [];
    let prevPage = 0;
    
    pagesToShow.forEach(pageNum => {
      // If there's a gap, add ellipsis
      if (pageNum - prevPage > 1) {
        result.push({ isEllipsis: true, key: `ellipsis-${pageNum}` });
      }
      
      // Add the actual page button
      const pageButton = pagination.find(p => modifyPaginationLabel(p.label) == pageNum.toString());
      if (pageButton) {
        result.push(pageButton);
      }
      
      prevPage = pageNum;
    });
    
    // Add previous and next buttons if they exist
    const prevButton = pagination.find(p => p.label.includes('Previous'));
    const nextButton = pagination.find(p => p.label.includes('Next'));
    
    return [
      prevButton,
      ...result,
      nextButton
    ].filter(Boolean);
  };

  return (
    <>
      {renderPaginationButtons()?.map((p) => {
        if (p.isEllipsis) {
          return (
            <Button 
              className="btn me-3 px-3 border-0 my-2 fs-9" 
              style={{ backgroundColor: '#212529' }}
              key={p.key} 
            >
              ...
            </Button>
          );
        }
        
        let active_bg = (p.active) ? "#FB5607" : '#212529';
        let active_txt = (p.active) ? "" : '';
        
        return (
          <Button 
            className="btn me-3 px-3 border-0 my-2 fs-9" 
            style={{ backgroundColor: active_bg, color: active_txt }}
            key={p.label} 
            onClick={() => triggerPagination(p.url)}
          >
            {modifyPaginationLabel(p.label)}
          </Button>
        );
      })}
    </>
  );
};

export default DefaultPagination;