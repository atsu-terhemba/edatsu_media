import React, { useMemo } from 'react';

const labelStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 12px',
    borderRadius: '9999px',
    background: '#f5f5f7',
    border: '1px solid #f0f0f0',
    fontSize: '12px',
    fontWeight: 500,
    color: '#000',
    marginBottom: '8px',
    marginRight: '8px',
};

const closeIconStyle = {
    fontSize: '14px',
    cursor: 'pointer',
    color: '#86868b',
    transition: 'color 0.15s ease',
};

const FilterLabels = ({filter_data, setFilterData}) => {

    const updateFilter = (key, itemValue) => {
        setFilterData((prevData) => {
            let updatedData;

            const value = prevData[key];

            if (!Array.isArray(value)) {
                updatedData = { ...prevData, [key]: itemValue };
            } else {
                const updatedArray = value.filter((item) => item.value !== itemValue);
                updatedData = { ...prevData, [key]: updatedArray };
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
                return (
                    <span style={labelStyle} key={key}>
                        {value.label.trim().replace(/_/g, ' ').replace(/&amp;/g, "&")}
                        <span
                            className="material-symbols-outlined"
                            style={closeIconStyle}
                            onClick={() => updateFilter(key, '')}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#000'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#86868b'}
                        >
                            close
                        </span>
                    </span>
                );
            }

            if (Array.isArray(value)) {
                return value.map((item, index) => (
                    <span style={labelStyle} key={`${key}-${index}`}>
                        {item.label.trim().replace(/_/g, ' ').replace(/&amp;/g, "&")}
                        <span
                            className="material-symbols-outlined"
                            style={closeIconStyle}
                            onClick={() => updateFilter(key, item.value)}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#000'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#86868b'}
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
