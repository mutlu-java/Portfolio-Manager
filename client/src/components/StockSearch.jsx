import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { searchStocks } from '../services/stockApi';

const StockSearch = ({ onStockSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length >= 2) {
      setIsSearching(true);
      try {
        const results = await searchStocks(query);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching stocks:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleStockSelect = (stock) => {
    onStockSelect(stock);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="relative">
      <div className="flex items-center bg-white rounded-lg border border-gray-300 overflow-hidden">
        <Search className="w-5 h-5 ml-3 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search for stocks..."
          className="w-full px-3 py-2 focus:outline-none"
        />
      </div>

      {/* Search Results Dropdown */}
      {searchResults.length > 0 && searchQuery && (
        <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-auto">
          {searchResults.map((stock) => (
            <button
              key={stock.symbol}
              onClick={() => handleStockSelect(stock)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex flex-col border-b border-gray-100 last:border-b-0"
            >
              <span className="font-semibold text-gray-900">{stock.symbol}</span>
              <span className="text-sm text-gray-600">{stock.name}</span>
              <span className="text-xs text-gray-500">
                {stock.region} • {stock.type}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Loading State */}
      {isSearching && (
        <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 text-center text-gray-600">
          Searching...
        </div>
      )}
    </div>
  );
};

export default StockSearch;
