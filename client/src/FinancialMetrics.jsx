import React from 'react';
import { Calculator } from 'lucide-react';

const MetricCard = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg transition-all duration-200 hover:shadow-md">
    <div className="text-sm text-gray-600">{label}</div>
    <div className="text-xl font-bold text-gray-900">{value}</div>
  </div>
);

const FinancialMetrics = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Calculator className="mr-2" />
        Financial Metrics
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard 
          label="P/E Ratio" 
          value={data.peRatio || '--'} 
        />
        <MetricCard 
          label="P/B Ratio" 
          value={data.pbRatio || '--'} 
        />
        <MetricCard 
          label="Dividend Yield" 
          value={data.dividendYield ? `${data.dividendYield}%` : '--'} 
        />
        <MetricCard 
          label="Market Cap" 
          value={data.marketCap ? `$${data.marketCap}` : '--'} 
        />
        <MetricCard 
          label=" Forward EPS" 
          value={data.forwardEps ? `$${data.forwardEps}` : '--'} 
        />
        <MetricCard 
          label="Volume" 
          value={data.regularMarketVolume || '--'} 
        />
        <MetricCard 
          label="52W High" 
          value={data.fiftyTwoWeekHigh ? `$${data.fiftyTwoWeekHigh}` : '--'} 
        />
        <MetricCard 
          label="52W Low" 
          value={data.fiftyTwoWeekHigh? `$${data.fiftyTwoWeekLow}` : '--'} 
        />
      </div>
    </div>
  );
};

export default FinancialMetrics;
