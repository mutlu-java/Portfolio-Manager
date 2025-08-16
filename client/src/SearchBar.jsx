import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(query);
        }
    };
// styling for the search bar
    return (
        <form onSubmit={handleSubmit} className="flex items-center space-x-2 p-4 bg-gray-100 rounded-lg shadow-md">
            <input
                className="flex-1 p-2 border border-white-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="Search stocks..."
                value={query}
                onChange={handleChange}
            />
            
            <button type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >Search</button>
        </form>
    );
};

export default SearchBar;