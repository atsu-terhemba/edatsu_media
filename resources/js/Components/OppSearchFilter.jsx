import React, { useEffect, useState } from 'react';
import Select from 'react-select'
import ClickEffectButton from './ClickEffectButton';


const OppSearchFilter = ({isloading, search_keyword, setSearchKeyword, filter_data, setFilterData, categories, continents, countries, brands, initSearch}) => {
    
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
        { value: 'up_coming', label: 'Earliest Deadline' }
      ];

      const monthOptions = [
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
        { value: 'one_day', label: '24 hours Ago' },
        { value: 'one_week', label: '1 Week Ago' },
        { value: 'two_weeks', label: '2 Weeks Ago' },
        { value: 'one_month', label: '1 Month Ago' }
      ];

    const yearOptions = [
        ...Array.from({ length: 6 }, (_, i) => {
            const year = new Date().getFullYear() + i;
            return { value: year.toString(), label: year.toString() };
        })
    ];

    const toggleFilterPanel = () => {
        setIsFilterVisible(!isFilterVisible);
    };

    /**update selection**/
    function updateSelection( selectedOption, fieldName){
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
            <div className="row">
                <div className="col-sm-9 col-12">
                    <div className='mb-3'>
                        <input
                            type='text'
                            className="form-control py-3 fs-9 text-secondary"
                            name="search_keyword"
                            placeholder="Search Keywords"
                            id="keyword"
                            value={search_keyword}
                            onChange={(e) => updateInput(e)}
                        />
                    </div>
                </div>
                <div className="col-sm-3 col-12">
                    <div className='mb-3'>
                        <ClickEffectButton id="search-btn" 
                        type="submit"
                        className='w-100 h-50 bg-dark border-0 h-50 py-3 poppins-semibold' 
                        onClick={initSearch}>
                        {isloading == 'search-btn' ? 'Searching..' : 'Search'}
                        </ClickEffectButton>
                    </div>
                </div>
            </div>

            <div className="py-3 px-3 border bg-white rounded d-flex justify-content-between mb-3">
                <div>
                    <span className="material-symbols-outlined align-middle">
                        filter_alt
                    </span>
                    <span className="fs-9 text-dark px-3">
                        Search filters
                    </span>
                </div>
                <span
                    className="material-symbols-outlined cursor d-block align-middle"
                    style={{ cursor: 'pointer' }}
                    id="filter-toggle"
                    onClick={toggleFilterPanel}
                >
                    {isFilterVisible ? 'toggle_on' : 'toggle_off'}
                </span>
            </div>

            {isFilterVisible && (
                <div id="filter-panel" className="bg-white border rounded px-3 py-3 mb-3">
                    <div className="row">
                        <div className="col-sm-6">
                            {/* <label className='poppins-semibold fs-9 mb-2'>Program Status</label> */}
                            <Select
                                placeholder="Select Program Status"
                                value={filter_data?.program_status}
                                name="program_status"
                                options={programStatus}
                                className="fs-9 mb-3"
                                classNamePrefix="Select"
                                onChange={(e) => updateSelection(e, 'program_status')}
                            />
                        </div>
                        <div className="col-sm-6">
                            {/* <label className='poppins-semibold fs-9 mb-2'>Categories</label> */}
                            <Select
                                isMulti
                                placeholder="Select Categories"
                                value={filter_data?.categories}
                                name="categories"
                                options={categoryOptions}
                                className="fs-9 mb-3"
                                classNamePrefix="select"
                                onChange={(e) => updateSelection(e, 'categories')}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-6">
                            {/* <label className='poppins-semibold fs-9 mb-2'>Continents</label> */}
                            <Select
                                isMulti
                                placeholder="Select Continents"
                                value={filter_data?.continents}
                                name="continents"
                                options={continentOptions}
                                className="fs-9 mb-3"
                                classNamePrefix="select"
                                onChange={(e) => updateSelection(e, 'continents')}
                            />
                        </div>
                        <div className="col-sm-6">
                            {/* <label className='poppins-semibold fs-9 mb-2'>Countries</label> */}
                            <Select
                                isMulti
                                value={filter_data?.countries}
                                placeholder="Select Countries"
                                name="countries"
                                options={countryOptions}
                                className="fs-9 mb-3"
                                classNamePrefix="select"
                                onChange={(e) => updateSelection(e, 'countries')}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-6">
                                {/* <label className='poppins-semibold fs-9 mb-2'>Brands</label> */}
                                <Select
                                isMulti
                                value={filter_data?.brands}
                                placeholder="Select Brands"
                                name="brands"
                                options={brandOptions}
                                className="fs-9 mb-3"
                                classNamePrefix="select"
                                onChange={(e) => updateSelection(e, 'brands')}
                            />
                        </div>
                        <div className="col-sm-6">
                            {/* <label className='poppins-semibold fs-9 mb-2'>Published</label> */}
                            <Select
                                value={filter_data?.datePosted}
                                placeholder="Date Posted"
                                name="datePosted"
                                options={dateOptions}
                                className="fs-9 mb-3"
                                classNamePrefix="select"
                                onChange={(e) => updateSelection(e, 'datePosted')}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-6">
                            {/* <label className='poppins-semibold fs-9 mb-2'>Month</label> */}
                            <Select
                                value={filter_data?.month}
                                placeholder="Select Month"
                                name="month"
                                options={monthOptions}
                                className="fs-9 mb-3"
                                classNamePrefix="select"
                                onChange={(e) => updateSelection(e, 'month')}
                            />
                        </div>
                        <div className="col-sm-6">
                            {/* <label className='poppins-semibold fs-9 mb-2'>Year</label> */}
                            <Select
                                value={filter_data?.year}
                                placeholder="Select Year"
                                name="year"
                                options={yearOptions}
                                className="fs-9 mb-3"
                                classNamePrefix="select"
                                onChange={(e) => updateSelection(e, 'year')}
                            />
                        </div>
                    </div>
                    <ClickEffectButton id="filter-btn" 
                    type="submit"
                    className='w-100 h-50 bg-dark border-0 h-50 py-3 poppins-semibold' 
                    onClick={initSearch}>
                    {isloading == 'filter-btn' ? 'Filtering...' : 'Filter'}
                    </ClickEffectButton>
                </div>
            )}
        </form>
    );
};

export default OppSearchFilter;