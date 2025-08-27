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
      {/* current market */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard 
          label="P/E Ratio" 
          value={ parseFloat(data.financialData.currentPrice / data.keyStatistics.trailingEps).toFixed(2) || '--'} 
        />
        <MetricCard 
          label="P/B Ratio" 
          value={data.keyStatistics.priceToBook ? `${data.keyStatistics.priceToBook}` : '--'}
        />
        <MetricCard 
          label="Dividend Yield" 
          value={data.quote.dividendYield ? `${data.quote.dividendYield}%` : '--'} 
        />
        <MetricCard 
          label="Market Cap" 
          value={data.quote.marketCap ? ` ${data.financialData.financialCurrency} ${data.quote.marketCap}` : '--'} 
        />
        <MetricCard 
          label="EPS" 
          value={data.keyStatistics.trailingEps ? `${data.financialData.financialCurrency} 
           ${data.keyStatistics.trailingEps}` : '--'} 
        />
        <MetricCard 
          label="Volume" 
          value={  data.quote.regularMarketVolume ? ` ${data.financialData.financialCurrency} 
          ${data.quote.regularMarketVolume}` : '--'} 
        />
        <MetricCard 
          label="52W High" 
          value={data.quote.fiftyTwoWeekHigh ? ` ${data.financialData.financialCurrency}  
          ${data.quote.fiftyTwoWeekHigh}` : '--'} 
        />
        <MetricCard 
          label="52W Low" 
          value={data.quote.fiftyTwoWeekHigh? ` ${data.financialData.financialCurrency}  ${data.quote.fiftyTwoWeekLow}` : '--'} 
        />

          <MetricCard 
            label="Beta" 
            value={data.summaryDetail.beta ? `${data.summaryDetail.beta}` : '--'}
          />
        
      </div>
    </div>
  );
};

export default FinancialMetrics;
