import React, { useEffect, useState } from 'react';
import Select from 'react-select'


const selectStyles = {
    control: (base, state) => ({
        ...base,
        borderRadius: '12px',
        border: state.isFocused ? '1px solid #000' : '1px solid #e5e5e5',
        boxShadow: 'none',
        padding: '4px 4px',
        fontSize: '13px',
        minHeight: '40px',
        transition: 'border-color 0.15s ease',
        '&:hover': {
            borderColor: '#000',
        },
    }),
    placeholder: (base) => ({
        ...base,
        color: '#86868b',
        fontSize: '13px',
    }),
    option: (base, state) => ({
        ...base,
        fontSize: '13px',
        backgroundColor: state.isSelected ? '#000' : state.isFocused ? '#f5f5f7' : '#fff',
        color: state.isSelected ? '#fff' : '#000',
        '&:active': {
            backgroundColor: '#000',
            color: '#fff',
        },
    }),
    multiValue: (base) => ({
        ...base,
        backgroundColor: '#f5f5f7',
        borderRadius: '8px',
    }),
    multiValueLabel: (base) => ({
        ...base,
        color: '#000',
        fontSize: '12px',
        fontWeight: 500,
    }),
    multiValueRemove: (base) => ({
        ...base,
        color: '#86868b',
        '&:hover': {
            backgroundColor: '#000',
            color: '#fff',
            borderRadius: '0 8px 8px 0',
        },
    }),
    menu: (base) => ({
        ...base,
        borderRadius: '12px',
        border: '1px solid #f0f0f0',
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        overflow: 'hidden',
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    indicatorSeparator: () => ({ display: 'none' }),
};

const portalTarget = typeof document !== 'undefined' ? document.body : null;

const OppSearchFilter = ({isloading, searchKeyword, setSearchKeyword, filter_data, setFilterData, categories, continents, countries, brands, initSearch}) => {

    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState('');
    const [continentOptions, setContinentOptions] = useState('');
    const [countryOptions, setCountryOptions] = useState('');
    const [brandOptions, setBrandOptions] = useState('');

    function setStateFromData(data, setOptions){
        if (data) {
            const options = data.map((item) => ({
                value: item.id,
                label: item.name,
            }));
            setOptions(options);
        }
    }

    useEffect(() => {
        setStateFromData(categories, setCategoryOptions);
        setStateFromData(continents, setContinentOptions);
        setStateFromData(countries, setCountryOptions);
        setStateFromData(brands, setBrandOptions);
    }, []);

     const programStatus = [
        { value: '', label: 'All Program Status' },
        { value: 'up_coming', label: 'Earliest Deadline' }
      ];

      const monthOptions = [
        { value: '', label: 'All Months' },
        { value: 'january', label: 'January' },
        { value: 'february', label: 'February' },
        { value: 'march', label: 'March' },
        { value: 'april', label: 'April' },
        { value: 'may', label: 'May' },
        { value: 'june', label: 'June' },
        { value: 'july', label: 'July' },
        { value: 'august', label: 'August' },
        { value: 'september', label: 'September' },
        { value: 'october', label: 'October' },
        { value: 'november', label: 'November' },
        { value: 'december', label: 'December' }
      ];

      const dateOptions = [
        { value: '', label: 'Any Time' },
        { value: 'one_day', label: '24 hours Ago' },
        { value: 'one_week', label: '1 Week Ago' },
        { value: 'two_weeks', label: '2 Weeks Ago' },
        { value: 'one_month', label: '1 Month Ago' }
      ];

    const yearOptions = [
        { value: '', label: 'All Years' },
        ...Array.from({ length: 6 }, (_, i) => {
            const year = new Date().getFullYear() + i;
            return { value: year.toString(), label: year.toString() };
        })
    ];

    const toggleFilterPanel = () => {
        setIsFilterVisible(!isFilterVisible);
    };

    function updateSelection( selectedOption, fieldName){
        setFilterData((prevData) => {
            if (!selectedOption || selectedOption.value === '') {
                return { ...prevData, [fieldName]: null };
            }
            return { ...prevData, [fieldName]: selectedOption };
        });
    }

    function updateInput(e){
        e.preventDefault();
        const {name, value} = e.target;
        setSearchKeyword((prevData)=>{
            return value
        });
    }

    function clearKeyword() {
        setSearchKeyword('');
    }

    function clearAllFilters() {
        setFilterData({
            categories: [],
            continents: [],
            countries: [],
            brands: [],
            datePosted: '',
            month: '',
            year: '',
            program_status: '',
        });
    }

    const activeFilterCount = (() => {
        let count = 0;
        Object.values(filter_data || {}).forEach((v) => {
            if (Array.isArray(v)) count += v.length;
            else if (v && v.value !== undefined && v.value !== '') count += 1;
            else if (v && typeof v === 'string' && v !== '') count += 1;
        });
        return count;
    })();

    function handleSearchClick(e) {
        initSearch(e);
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }, 100);
    }

    return (
        <form onSubmit={initSearch} id="search_keyword">
            {/* Search Input */}
            <div className="mb-3" style={{ position: 'relative' }}>
                <span
                    className="material-symbols-outlined"
                    style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '18px',
                        color: '#86868b',
                        pointerEvents: 'none',
                    }}
                >
                    search
                </span>
                <input
                    type='text'
                    name="search_keyword"
                    placeholder="Search opportunities..."
                    id="keyword"
                    value={searchKeyword}
                    onChange={(e) => updateInput(e)}
                    style={{
                        width: '100%',
                        padding: '10px 40px 10px 40px',
                        borderRadius: '12px',
                        border: '1px solid #e5e5e5',
                        fontSize: '13px',
                        color: '#000',
                        outline: 'none',
                        transition: 'border-color 0.15s ease',
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#000'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e5e5e5'}
                />
                {searchKeyword && (
                    <button
                        type="button"
                        onClick={clearKeyword}
                        aria-label="Clear search"
                        style={{
                            position: 'absolute',
                            right: '8px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            border: 'none',
                            background: '#f5f5f7',
                            color: '#86868b',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.15s ease, color 0.15s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#000'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#f5f5f7'; e.currentTarget.style.color = '#86868b'; }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
                    </button>
                )}
            </div>

            {/* Search Button */}
            <div className="mb-4">
                <button
                    id="search-btn"
                    type="submit"
                    onClick={handleSearchClick}
                    style={{
                        width: '100%',
                        padding: '10px 24px',
                        borderRadius: '9999px',
                        border: 'none',
                        background: '#000',
                        color: '#fff',
                        fontSize: '13px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#333'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#000'}
                >
                    {isloading == 'search-btn' ? 'Searching...' : 'Search'}
                </button>
            </div>

            {/* Toggle Filters */}
            <div
                role="button"
                tabIndex={0}
                className="d-flex justify-content-between align-items-center"
                style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    userSelect: 'none',
                }}
                onClick={toggleFilterPanel}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFilterPanel(); } }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#e5e5e5'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#f0f0f0'}
            >
                <span className="d-flex align-items-center gap-2">
                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#000' }}>
                        Filters
                    </span>
                    {activeFilterCount > 0 && (
                        <span
                            aria-label={`${activeFilterCount} active filters`}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: '20px',
                                height: '20px',
                                padding: '0 6px',
                                borderRadius: '9999px',
                                background: '#f97316',
                                color: '#fff',
                                fontSize: '11px',
                                fontWeight: 600,
                            }}
                        >
                            {activeFilterCount}
                        </span>
                    )}
                </span>
                <span
                    className="material-symbols-outlined"
                    style={{
                        fontSize: '20px',
                        color: isFilterVisible ? '#f97316' : '#86868b',
                        transition: 'color 0.15s ease',
                    }}
                >
                    {isFilterVisible ? 'toggle_on' : 'toggle_off'}
                </span>
            </div>

            {activeFilterCount > 0 && (
                <button
                    type="button"
                    onClick={clearAllFilters}
                    style={{
                        marginTop: '8px',
                        width: '100%',
                        padding: '8px 14px',
                        borderRadius: '9999px',
                        border: '1px solid #e5e5e5',
                        background: 'transparent',
                        color: '#86868b',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#000'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#000'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#86868b'; e.currentTarget.style.borderColor = '#e5e5e5'; }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
                    Clear all filters
                </button>
            )}

            {isFilterVisible && (
                <div
                    style={{
                        marginTop: '12px',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1px solid #f0f0f0',
                    }}
                >
                    <div className="mb-3">
                        <Select
                            placeholder="Program Status"
                            value={filter_data?.program_status}
                            name="program_status"
                            options={programStatus}
                            styles={selectStyles}
                            menuPortalTarget={portalTarget}
                            menuPosition="fixed"
                            onChange={(e) => updateSelection(e, 'program_status')}
                        />
                    </div>
                    <div className="mb-3">
                        <Select
                            isMulti
                            placeholder="Categories"
                            value={filter_data?.categories}
                            name="categories"
                            options={categoryOptions}
                            styles={selectStyles}
                            menuPortalTarget={portalTarget}
                            menuPosition="fixed"
                            onChange={(e) => updateSelection(e, 'categories')}
                        />
                    </div>
                    <div className="mb-3">
                        <Select
                            isMulti
                            placeholder="Continents"
                            value={filter_data?.continents}
                            name="continents"
                            options={continentOptions}
                            styles={selectStyles}
                            menuPortalTarget={portalTarget}
                            menuPosition="fixed"
                            onChange={(e) => updateSelection(e, 'continents')}
                        />
                    </div>
                    <div className="mb-3">
                        <Select
                            isMulti
                            value={filter_data?.countries}
                            placeholder="Countries"
                            name="countries"
                            options={countryOptions}
                            styles={selectStyles}
                            menuPortalTarget={portalTarget}
                            menuPosition="fixed"
                            onChange={(e) => updateSelection(e, 'countries')}
                        />
                    </div>
                    <div className="mb-3">
                        <Select
                            isMulti
                            value={filter_data?.brands}
                            placeholder="Brands"
                            name="brands"
                            options={brandOptions}
                            styles={selectStyles}
                            menuPortalTarget={portalTarget}
                            menuPosition="fixed"
                            onChange={(e) => updateSelection(e, 'brands')}
                        />
                    </div>
                    <div className="mb-3">
                        <Select
                            value={filter_data?.datePosted}
                            placeholder="Date Posted"
                            name="datePosted"
                            options={dateOptions}
                            styles={selectStyles}
                            menuPortalTarget={portalTarget}
                            menuPosition="fixed"
                            onChange={(e) => updateSelection(e, 'datePosted')}
                        />
                    </div>
                    <div className="mb-3">
                        <Select
                            value={filter_data?.month}
                            placeholder="Month"
                            name="month"
                            options={monthOptions}
                            styles={selectStyles}
                            menuPortalTarget={portalTarget}
                            menuPosition="fixed"
                            onChange={(e) => updateSelection(e, 'month')}
                        />
                    </div>
                    <div>
                        <Select
                            value={filter_data?.year}
                            placeholder="Year"
                            name="year"
                            options={yearOptions}
                            styles={selectStyles}
                            menuPortalTarget={portalTarget}
                            menuPosition="fixed"
                            onChange={(e) => updateSelection(e, 'year')}
                        />
                    </div>
                </div>
            )}
        </form>
    );
};

export default OppSearchFilter;
