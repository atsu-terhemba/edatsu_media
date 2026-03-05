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
    indicatorSeparator: () => ({ display: 'none' }),
};

const ToolshedFilter = ({isloading, search_keyword, setSearchKeyword, filter_data, setFilterData, categories, brands, tags, initSearch}) => {

    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState('');
    const [brandOptions, setBrandOptions] = useState('');
    const [tagOptions, setTagOptions] = useState('');

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
        setStateFromData(brands, setBrandOptions);
        setStateFromData(tags, setTagOptions);
    }, []);

    const dateOptions = [
        { value: 'one_day', label: '24 hours Ago' },
        { value: 'one_week', label: '1 Week Ago' },
        { value: 'two_weeks', label: '2 Weeks Ago' },
        { value: 'one_month', label: '1 Month Ago' }
    ];

    const toggleFilterPanel = () => {
        setIsFilterVisible(!isFilterVisible);
    };

    function updateSelection(selectedOption, fieldName){
        if (selectedOption) {
            setFilterData((prevData) => (
                { ...prevData, [fieldName]: selectedOption }
            ));
        }
    }

    function updateInput(e){
        e.preventDefault();
        const {name, value} = e.target;
        setSearchKeyword((prevData)=>{
            return value
        });
    }

    return (
        <form onSubmit={initSearch} id="search_keyword">
            {/* Search Input */}
            <div className="mb-3">
                <input
                    type="text"
                    name="search_keyword"
                    placeholder="Search tools..."
                    id="keyword"
                    value={search_keyword}
                    onChange={(e) => updateInput(e)}
                    style={{
                        width: '100%',
                        padding: '10px 16px',
                        borderRadius: '12px',
                        border: '1px solid #e5e5e5',
                        fontSize: '13px',
                        outline: 'none',
                        transition: 'border-color 0.15s ease',
                        color: '#000',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#000'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
                />
            </div>

            {/* Search Button */}
            <button
                id="search-btn"
                type="submit"
                onClick={initSearch}
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
                    marginBottom: '16px',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#333'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#000'}
            >
                {isloading == 'search-btn' ? 'Searching...' : 'Search'}
            </button>

            {/* Filter Toggle */}
            <div
                className="d-flex justify-content-between align-items-center"
                style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid #f0f0f0',
                    background: '#fff',
                    marginBottom: '12px',
                }}
            >
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#000' }}>
                    Search filters
                </span>
                <span
                    className="material-symbols-outlined"
                    style={{
                        cursor: 'pointer',
                        fontSize: '24px',
                        color: isFilterVisible ? '#f97316' : '#86868b',
                        transition: 'color 0.15s ease',
                    }}
                    onClick={toggleFilterPanel}
                >
                    {isFilterVisible ? 'toggle_on' : 'toggle_off'}
                </span>
            </div>

            {isFilterVisible && (
                <div style={{ marginTop: '8px' }}>
                    <div className="mb-3">
                        <Select
                            isMulti
                            placeholder="Select Categories"
                            value={filter_data?.categories}
                            name="categories"
                            options={categoryOptions}
                            styles={selectStyles}
                            onChange={(e) => updateSelection(e, 'categories')}
                        />
                    </div>

                    <div className="mb-3">
                        <Select
                            isMulti
                            value={filter_data?.brands}
                            placeholder="Select Brands"
                            name="brands"
                            options={brandOptions}
                            styles={selectStyles}
                            onChange={(e) => updateSelection(e, 'brands')}
                        />
                    </div>

                    <div className="mb-3">
                        <Select
                            isMulti
                            value={filter_data?.tags}
                            placeholder="Select Tags"
                            name="tags"
                            options={tagOptions}
                            styles={selectStyles}
                            onChange={(e) => updateSelection(e, 'tags')}
                        />
                    </div>

                    <div className="mb-3">
                        <Select
                            value={filter_data?.datePosted}
                            placeholder="Date Posted"
                            name="datePosted"
                            options={dateOptions}
                            styles={selectStyles}
                            onChange={(e) => updateSelection(e, 'datePosted')}
                        />
                    </div>

                    <button
                        id="filter-btn"
                        type="submit"
                        onClick={initSearch}
                        style={{
                            width: '100%',
                            padding: '10px 24px',
                            borderRadius: '9999px',
                            border: '1px solid #e5e5e5',
                            background: 'transparent',
                            color: '#000',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#000'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#000'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#000'; e.currentTarget.style.borderColor = '#e5e5e5'; }}
                    >
                        {isloading == 'filter-btn' ? 'Filtering...' : 'Filter'}
                    </button>
                </div>
            )}
        </form>
    );
};

export default ToolshedFilter;
