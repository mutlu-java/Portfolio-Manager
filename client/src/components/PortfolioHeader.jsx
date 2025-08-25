import React from 'react';

const PortfolioHeader = () => (
  <div className="grid grid-cols-6 gap-4 px-4 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide">
    <div>SYMBOL</div>
    <div className="text-right">Price</div>
    <div className="text-right">Quantity</div>
    <div className="text-right">Profit/Loss</div>
    <div className="text-right">Share Value</div>
    <div></div>
  </div>
);

export default PortfolioHeader;