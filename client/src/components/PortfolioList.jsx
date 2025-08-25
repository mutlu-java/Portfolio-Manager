import React from 'react';
import PortfolioHeader from './PortfolioHeader';
import StockItem from './StockItem';

const PortfolioList = ({ portfolio, onRemoveStock }) => {
  if (portfolio.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No stocks in your portfolio yet.</p>
        <p className="text-sm">Search and add stocks to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm ">
      <PortfolioHeader />
      {portfolio.map((stock, index) => (
        <StockItem 
          key={`${stock.symbol}-${index}`} 
          stock={stock} 
          onRemove={onRemoveStock}
        />
      ))}
    </div>
  );
};

export default PortfolioList;