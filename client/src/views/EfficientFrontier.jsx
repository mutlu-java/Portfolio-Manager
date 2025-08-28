import React from 'react';

import { calculateMetrics } from '../services/financial';
import { useState, useEffect } from 'react';
import StockSearch from '../components/StockSearch.jsx';



const EfficientFrontier = () => {


const[metrics, setMetrics] = useState([]);


 const handleStockSelection =async  (stock) => {
    const stockMetrics = await calculateMetrics(stock.symbol,"2020-01-02","2024-12-31");
    setMetrics([...metrics, { symbol: stock.symbol, ...stockMetrics }]);
    
    console.log(`Metrics for ${stock.symbol}:`, metrics);  

  }


  return (


    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Efficient Frontier</h2>
      <StockSearch  onStockSelect={handleStockSelection} />

       {metrics.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300 mt-4
        ">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-300">Symbol</th>
              <th className="py-2 px-4 border-b border-gray-300">Expected Return</th>
              <th className="py-2 px-4 border-b border-gray-300">Volatility</th>
            </tr>
            </thead>
            <tbody>
              {metrics.map((metric, index) => (
                <tr key={index} className="text-center">
                  <td className="py-2 px-4 border-b border-gray-300">{metric.symbol}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{(metric.annualReturn * 100).toFixed(2)}%</td>
                  <td className="py-2 px-4 border-b border-gray-300">{(metric.annualVolatility * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
        </table>
        ) : (
            <p className="mt-4 text-gray-600">Select stocks to see their metrics.</p>
            )}


      
      
    </div>
  );
}

export default EfficientFrontier;