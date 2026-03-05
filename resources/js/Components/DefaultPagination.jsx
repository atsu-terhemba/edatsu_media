const DefaultPagination = ({pagination, triggerPagination, isLoading = false}) => {

  function modifyPaginationLabel(label) {
    return label
      .replace(/&laquo;\s*Previous/g, '«')
      .replace(/Next\s*&raquo;/g, '»')
      .replace(/&[lr]aquo;/g, '');
  }

  const renderPaginationButtons = () => {
    if (!pagination || pagination.length === 0) return null;

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

    if (lastPage <= 1) {
      return pagination.filter(p => !p.label.includes('Previous') && !p.label.includes('Next'));
    }

    let pagesToShow = [];
    const alwaysInclude = [1, currentPage, lastPage];

    if (currentPage > 1) alwaysInclude.push(currentPage - 1);
    if (currentPage < lastPage) alwaysInclude.push(currentPage + 1);
    if (currentPage > 2) alwaysInclude.push(currentPage - 2);
    if (currentPage < lastPage - 1) alwaysInclude.push(currentPage + 2);

    pagesToShow = [...new Set(alwaysInclude)]
      .filter(page => page >= 1 && page <= lastPage)
      .sort((a, b) => a - b);

    const result = [];
    let prevPage = 0;

    pagesToShow.forEach(pageNum => {
      if (pageNum - prevPage > 1) {
        result.push({ isEllipsis: true, key: `ellipsis-${prevPage}-${pageNum}` });
      }
      const pageButton = pagination.find(p => {
        const cleanLabel = modifyPaginationLabel(p.label);
        return cleanLabel == pageNum.toString();
      });
      if (pageButton) {
        result.push(pageButton);
      }
      prevPage = pageNum;
    });

    const prevButton = pagination.find(p => p.label.includes('Previous') || p.label.includes('laquo'));
    const nextButton = pagination.find(p => p.label.includes('Next') || p.label.includes('raquo'));

    return [prevButton, ...result, nextButton].filter(Boolean);
  };

  const handlePaginationClick = (url) => {
    if (isLoading || !url) return;
    triggerPagination(url);
  };

  const buttonBase = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '36px',
    height: '36px',
    padding: '0 12px',
    borderRadius: '9999px',
    fontSize: '13px',
    fontWeight: 500,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    marginRight: '6px',
    marginBottom: '6px',
  };

  return (
    <div className="d-flex flex-wrap justify-content-center align-items-center">
      {renderPaginationButtons()?.map((p) => {
        if (p.isEllipsis) {
          return (
            <span
              key={p.key}
              style={{
                ...buttonBase,
                background: 'transparent',
                color: '#86868b',
                cursor: 'default',
              }}
            >
              ...
            </span>
          );
        }

        const isActive = p.active;
        const isDisabled = isLoading || p.active || !p.url;

        return (
          <button
            key={p.label}
            onClick={() => handlePaginationClick(p.url)}
            disabled={isDisabled}
            style={{
              ...buttonBase,
              background: isActive ? '#000' : '#f5f5f7',
              color: isActive ? '#fff' : '#000',
              opacity: isDisabled && !isActive ? 0.4 : 1,
              cursor: isDisabled ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!isDisabled && !isActive) {
                e.currentTarget.style.background = '#000';
                e.currentTarget.style.color = '#fff';
              }
            }}
            onMouseLeave={(e) => {
              if (!isDisabled && !isActive) {
                e.currentTarget.style.background = '#f5f5f7';
                e.currentTarget.style.color = '#000';
              }
            }}
          >
            {modifyPaginationLabel(p.label)}
          </button>
        );
      })}
    </div>
  );
};

export default DefaultPagination;
