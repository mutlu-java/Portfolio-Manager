import React from 'react';

const StockForm = ({ 
  selectedStock, 
  buyPrice, 
  setBuyPrice, 
  buyDate, 
  setBuyDate, 
  stockQuantity, 
  setStockQuantity, 
  onAddStock 
}) => {
  const handleSubmit = () => {
    if (buyPrice && stockQuantity) {
      onAddStock(selectedStock);
    }
  };

  return (
    <div className="mb-4 p-4  rounded shadow-amber-50 bg-gray-50 flex gap-4 items-end">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-700 mb-2">
          Selected: {selectedStock?.symbol} - {selectedStock?.name}
        </span>
        
        <div className="flex gap-4 items-end">
          <label className="block text-sm text-gray-600">
            Buy Price:
            <input
              type="number"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              className="ml-2 p-1 border rounded"
              placeholder="Enter buy price"
              required
            />
          </label>
          
          <label className="block text-sm text-gray-600">
            Buy Date:
            <input
              type="date"
              value={buyDate}
              onChange={(e) => setBuyDate(e.target.value)}
              className="ml-2 p-1 border rounded"
            />
          </label>
          
          <label className="block text-sm text-gray-600">
            Quantity:
            <input
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              className="ml-2 p-1 border rounded"
              placeholder="Enter quantity"
              required
            />
          </label>
          
          <button
            onClick={handleSubmit}
            disabled={!buyPrice || !stockQuantity}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Add Stock
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockForm;