import React, { useEffect, useState } from 'react';
import Select from 'react-select'


const OppSearchFilter = ({ categories, continents, countries, brands}) => {
    const [searchKeyword, setSearchKeyword] = useState('');
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
        console.log(categories);
        setStateFromData(categories, setCategoryOptions);
        setStateFromData(continents, setContinentOptions);
        setStateFromData(countries, setCountryOptions);
        setStateFromData(brands, setBrandOptions);
    }, []);

     const programStatus = [
        { value: '', label: 'All Opportunities' },
        { value: 'up_coming', label: 'Earliest Deadline' }
      ];

      const monthOptions = [
        { value: '', label: 'Select Month' },
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
        { value: '', label: 'Date Posted' },
        { value: 'one_day', label: '24 hours Ago' },
        { value: 'one_week', label: '1 Week Ago' },
        { value: 'two_weeks', label: '2 Weeks Ago' },
        { value: 'one_month', label: '1 Month Ago' }
      ];
      

    const yearOptions = [
        { value: '', label: 'Select Year' },
        ...Array.from({ length: 6 }, (_, i) => {
            const year = new Date().getFullYear() + i;
            return { value: year.toString(), label: year.toString() };
        })
    ];

    const [formData, setFormData] = useState({
        searchKeyword: searchKeyword,
        categories: '',
        continents: '',
        countries: '',
        brands: '',
        datePosted: '',
        month: '',
        year: '',
        program_status: '',
    });

    const toggleFilterPanel = () => {
        setIsFilterVisible(!isFilterVisible);
    };

    /**update selection**/
    function updateSelection( selectedOption, fieldName){
        if (selectedOption) {
            let updatedData = { ...formData, [fieldName]: selectedOption };
            setFormData(updatedData);
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission
    };

    return (
        <form onSubmit={handleSubmit} id="search_keyword">
            <div className="row">
                <div className="col-sm-9 col-12">
                    <div className='mb-3'>
                        <input
                            type='text'
                            className="form-control py-3 fs-9 text-secondary"
                            name="search_keyword"
                            placeholder="Search Keywords"
                            id="keyword"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-sm-3 col-12">
                    <div className='mb-3'>
                        <button type="submit" className="text-decoration-none poppins-semibold btn btn-dark border-0 px-4 py-3 shadow-sm w-100">Search</button>
                    </div>
                </div>
            </div>

            <div className="py-3 px-3 border bg-white rounded d-flex justify-content-between mb-3">
                <div>
                    <span className="material-symbols-outlined align-middle">
                        filter_alt
                    </span>
                    <span className="fs-9 text-dark px-3">
                        Use filters to improve search
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
                            <Select
                                defaultValue={formData?.program_status}
                                name="program_status"
                                options={programStatus}
                                className="fs-9"
                                classNamePrefix="select"
                                onChange={(e) => updateSelection(e, 'program_status')}
                            />
                        </div>
                        <div className="col-sm-6">
                            <Select
                                isMulti
                                defaultValue={formData?.categories}
                                name="categories"
                                options={categoryOptions}
                                className="fs-9"
                                classNamePrefix="select"
                                onChange={(e) => updateSelection(e, 'categories')}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-6">
                            <Select
                                isMulti
                                defaultValue={formData?.continents}
                                name="continents"
                                options={continentOptions}
                                className="fs-9"
                                classNamePrefix="select"
                                onChange={(e) => updateSelection(e, 'continents')}
                            />
                        </div>
                        <div className="col-sm-6">
                            <Select
                                isMulti
                                defaultValue={formData?.countries}
                                name="countries"
                                options={countryOptions}
                                className="fs-9"
                                classNamePrefix="select"
                                onChange={(e) => updateSelection(e, 'countries')}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-6">
                        <Select
                                isMulti
                                defaultValue={formData?.brands}
                                name="brands"
                                options={brandOptions}
                                className="fs-9"
                                classNamePrefix="select"
                                onChange={(e) => updateSelection(e, 'brands')}
                            />
                        </div>
                        <div className="col-sm-6">
                        <Select
                                defaultValue={formData?.datePosted}
                                name="datePosted"
                                options={dateOptions}
                                className="fs-9"
                                classNamePrefix="select"
                                onChange={(e) => updateSelection(e, 'datePosted')}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-6">
                            <Select
                                defaultValue={formData?.month}
                                name="month"
                                options={monthOptions}
                                className="fs-9"
                                classNamePrefix="select"
                                onChange={(e) => updateSelection(e, 'month')}
                            />
                        </div>
                        <div className="col-sm-6">
                            <Select
                                defaultValue={formData?.year}
                                name="year"
                                options={yearOptions}
                                className="fs-9"
                                classNamePrefix="select"
                                onChange={(e) => updateSelection(e, 'year')}
                            />
                        </div>
                    </div>
                    <button type="submit" className="text-decoration-none btn btn-dark border-0 px-4 py-3 shadow-sm w-100 poppins-semibold">Filter</button>
                </div>
            )}
        </form>
    );
};

export default OppSearchFilter;