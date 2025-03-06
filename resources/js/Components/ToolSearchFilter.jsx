import React, { useState } from 'react';
import ToolSearchFilter from '@/Components/ToolSearchFilter';

const OppSearchFilter = ({ categories, continents, countries }) => {
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedContinent, setSelectedContinent] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [datePosted, setDatePosted] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

    const toggleFilterPanel = () => {
        setIsFilterVisible(!isFilterVisible);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission
        console.log({
            searchKeyword,
            selectedCategory,
            selectedContinent,
            selectedCountry,
            datePosted,
            selectedMonth,
            selectedYear
        });
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
                            <select
                                className="form-select py-3 mb-3 text-secondary fs-9"
                                id="event_status"
                                name="event_status"
                                value={datePosted}
                                onChange={(e) => setDatePosted(e.target.value)}
                            >
                                <option value="">All Opportunities</option>
                                <option value="up_coming">Earliest Deadline</option>
                            </select>
                        </div>
                        <div className="col-sm-6">
                            <select
                                className="form-select py-3 mb-3 text-secondary fs-9"
                                id="category"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-6">
                            <select
                                className="form-select py-3 mb-3 text-secondary fs-9"
                                id="continent"
                                value={selectedContinent}
                                onChange={(e) => setSelectedContinent(e.target.value)}
                            >
                                <option value="">Select Continent</option>
                                {continents.map(cont => (
                                    <option key={cont.id} value={cont.id}>{cont.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-sm-6">
                            <select
                                className="form-select py-3 mb-3 text-secondary fs-9"
                                id="country"
                                value={selectedCountry}
                                onChange={(e) => setSelectedCountry(e.target.value)}
                            >
                                <option value="">Select Country</option>
                                {countries.map(count => (
                                    <option key={count.id} value={count.id}>{count.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-6">
                            <select
                                className="form-select py-3 mb-3 text-secondary fs-9"
                                id="date_posted"
                                name="date_posted"
                                value={datePosted}
                                onChange={(e) => setDatePosted(e.target.value)}
                            >
                                <option value="">Date Posted</option>
                                <option value="one_day">24 hours Ago</option>
                                <option value="one_week">1 Week Ago</option>
                                <option value="two_weeks">2 Weeks Ago</option>
                                <option value="one_month">1 Month Ago</option>
                            </select>
                        </div>
                        <div className="col-sm-6">
                            <select
                                className="form-select py-3 mb-3 text-secondary fs-9"
                                name="month"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                            >
                                <option value="">Select Month</option>
                                <option value="january">January</option>
                                <option value="february">February</option>
                                <option value="march">March</option>
                                <option value="april">April</option>
                                <option value="may">May</option>
                                <option value="june">June</option>
                                <option value="july">July</option>
                                <option value="august">August</option>
                                <option value="september">September</option>
                                <option value="october">October</option>
                                <option value="november">November</option>
                                <option value="december">December</option>
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-6">
                            <select
                                className="form-select py-3 mb-3 text-secondary fs-9"
                                name="year"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                            >
                                <option value="">Year</option>
                                {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() + i).map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="text-decoration-none btn btn-dark border-0 px-4 py-3 shadow-sm w-100 poppins-semibold">Filter</button>
                </div>
            )}
        </form>
    );
};

export default OppSearchFilter;