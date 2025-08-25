import React from 'react';
import PieChart from './PieChart';
import { Pie } from 'recharts';

 const PortfolioSummary = ({ totalInvested, currentValue, profitLoss,pieChartData}) => (
  <div className="p-4 bg-white rounded shadow-md w-3xl mr-0.5">
    <h3 className="text-lg font-semibold mb-2">Portfolio Summary</h3>
    <p>Total Invested: ₺{totalInvested.toFixed(2)}</p>
    <p>Current Value: ₺{currentValue.toFixed(2)}</p>
    <p className={profitLoss >= 0 ? "text-green-500" : "text-red-500"}>
      Total Profit/Loss: ₺{profitLoss.toFixed(2)}
    </p>

   <PieChart data={pieChartData}/> 

      
  </div>
);
export default PortfolioSummary;