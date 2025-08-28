import React from 'react';
import { Calculator } from 'lucide-react';
// border botttom dashed lighgray
const MetricCard = ({ label, value }) => (
  <div className="flex justify-between border-b border-dashed border-gray-200">
    <span className="text-sm text-gray-600">{label}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);

{/* <div className="flex justify-between">
              <span className="text-sm text-gray-600">Previous Close</span>
              <span className="text-sm font-medium">15.11</span>
            </div> */}

const FinancialMetrics = ({ data }) => {
  return (<>

    <div className="bg-white rounded-lg shadow-sm p-6 max-w-7xl">
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

     
      
    
    </>
  );
};

export default FinancialMetrics;
