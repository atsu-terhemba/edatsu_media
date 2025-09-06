import React, { useMemo, useEffect, useState, useCallback } from 'react';

const FilterLabels = ({filter_data, setFilterData}) => {
    
    const updateFilter = (key, itemValue) => {
        setFilterData((prevData) => {
            let updatedData;
    
            const value = prevData[key];
    
            if (!Array.isArray(value)) {
                updatedData = { ...prevData, [key]: itemValue }; // Clear the single value
            } else {
                const updatedArray = value.filter((item) => item.value !== itemValue);
                updatedData = { ...prevData, [key]: updatedArray }; // Update the array
            }
    
            return updatedData;
        });
    };
    
    

    const labels = useMemo(() => {
        return Object.keys(filter_data).map((key) => {
            const selectedOption = filter_data[key];
            const value = selectedOption;
            if (!value) return null;

            if (value.label && (value.value !== '')) {
                console.log(key);
                return (
                    <span className='search-filter-labels mb-3 me-2 bg-light text-dark shadow-sm border' key={key}>
                        {value.label.trim().replace(/_/g, ' ').replace(/&amp;/g, "&")}
                        <span
                        className="material-symbols-outlined text-dark align-middle ms-2"
                        onClick={() => updateFilter(key, '')}
                        >
                        close
                        </span>
                    </span>
                );
            }

            if (Array.isArray(value)) {
                return value.map((item, index) => (
                    <span className='search-filter-labels mb-3 me-2 bg-light text-dark shadow-sm border' key={`${key}-${index}`}>
                        {item.label.trim().replace(/_/g, ' ').replace(/&amp;/g, "&")}
                        <span
                            className="material-symbols-outlined text-dark align-middle ms-2"
                            onClick={() => updateFilter(key, item.value)}
                        >
                        close
                        </span>
                    </span>
                ));
            }
                
            return null;
        });
    }, [filter_data]);

    return <>{labels}</>;
};



export default FilterLabels;
