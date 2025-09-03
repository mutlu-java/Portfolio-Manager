// portfolioIntegration.js
// Example of how to integrate the real API calls into your React component

// importing scatter plot from recharts
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { 
  optimizePortfolio, 
  analyzeStocks, 
  getCompletePortfolioAnalysis,
  validateTickers,
  validateDateInputs,
  formatPortfolioDataForChart,
  POPULAR_TICKERS,
  getDefaultDateRange
} from '../services/stockApi.js';

import React, { useState } from 'react';

// Example React hook for portfolio optimization
export const usePortfolioOptimization = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const runOptimization = async (tickers, startDate, endDate, options = {}) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      // Validate inputs
      const tickerValidation = validateTickers(tickers);
      const dateValidation = validateDateInputs(startDate, endDate);

      if (!tickerValidation.isValid) {
        throw new Error(`Invalid tickers: ${tickerValidation.errors.join(', ')}`);
      }

      if (!dateValidation.isValid) {
        throw new Error(`Invalid dates: ${dateValidation.errors.join(', ')}`);
      }

      // Run optimization
      const optimizationResults = await optimizePortfolio({
        tickers,
        startDate,
        endDate,
        numPortfolios: options.numPortfolios || 5000,
        riskFreeRate: options.riskFreeRate || 0.02
      });

      // Format for visualization
      const chartData = formatPortfolioDataForChart(optimizationResults);

      setResults({
        raw: optimizationResults,
        chartData
      });

    } catch (err) {
      console.error('Portfolio optimization failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResults(null);
    setError(null);
    setLoading(false);
  };

  return {
    loading,
    results,
    error,
    runOptimization,
    reset
  };
};

// Example component using the real API
const RealPortfolioOptimizer = () => {
  // State management
  const [tickers, setTickers] = useState(['AAPL', 'MSFT', 'GOOGL']);
  const [dateRange, setDateRange] = useState(getDefaultDateRange(365));
  const [options, setOptions] = useState({
    numPortfolios: 5000,
    riskFreeRate: 0.02
  });

  // Use the optimization hook
  const { loading, results, error, runOptimization } = usePortfolioOptimization();

  // Handler for running optimization
  const handleOptimize = () => {
    runOptimization(
      tickers,
      dateRange.startDate,
      dateRange.endDate,
      options
    );
  };

  // Example usage with complete analysis
  const runCompleteAnalysis = async () => {
    try {
      const analysis = await getCompletePortfolioAnalysis(
        tickers,
        dateRange.startDate,
        dateRange.endDate
      );

      if (analysis.success) {
        console.log('✅ Complete analysis successful:');
        console.log('📊 Stock Analysis:', analysis.stockAnalysis);
        console.log('🎯 Best Sharpe Ratio:', analysis.summary.bestSharpeRatio);
        console.log('📈 Chart Data:', analysis.chartData);
        
        // You can set this to your state for rendering
        setResults({
          raw: analysis.portfolioOptimization,
          chartData: analysis.chartData,
          stockAnalysis: analysis.stockAnalysis,
          summary: analysis.summary
        });
      } else {
        console.error('❌ Analysis failed:', analysis.error);
        setError(analysis.error);
      }
    } catch (err) {
      console.error('❌ Complete analysis error:', err);
      setError(err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Portfolio Optimizer (Real API)</h1>
      
      {/* Your UI components here */}
      <button 
        onClick={handleOptimize}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? 'Optimizing...' : 'Run Optimization'}
      </button>

      <button 
        onClick={runCompleteAnalysis}
        className="bg-green-600 text-white px-4 py-2 rounded ml-2"
      >
        Complete Analysis
      </button>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mt-4">
          Error: {error}
        </div>
      )}

      {results && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          {/* Render your charts and tables here using results.chartData */}
            <ResponsiveContainer width="100%" height={400}>
                <ScatterChart
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                    <CartesianGrid />
                    <XAxis type="number" dataKey="x" name="Volatility (%)" unit="%" />
                    <YAxis type="number" dataKey="y" name="Return (%)" unit="%" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Legend />
                    <Scatter name="Portfolios" data={results.chartData.scatterData.portfolios} fill="#8884d8" />
                    <Scatter name="Stocks" data={results.chartData.scatterData.stocks} fill="#82ca9d" />
                    <Scatter name="Efficient Frontier" data={results.chartData.scatterData.frontier} fill="#ff7300" />
                    <Scatter name="Optimal Portfolio" data={results.chartData.scatterData.optimal} fill="#ff0000" shape="star" />
                </ScatterChart>
            </ResponsiveContainer>
            {/* You can also render allocation pie chart and metrics table similarly */}

        </div>
      )}
    </div>
  );
};

// Example API call functions to replace the mock ones in your React component
export const makeRealApiCalls = {
  // Replace your mockOptimizePortfolio with this
  optimizePortfolio: async (params) => {
    try {
      return await optimizePortfolio(params);
    } catch (error) {
      throw new Error(`Portfolio optimization failed: ${error.message}`);
    }
  },

  // Additional helper for stock analysis only
  analyzeStocks: async (params) => {
    try {
      return await analyzeStocks(params);
    } catch (error) {
      throw new Error(`Stock analysis failed: ${error.message}`);
    }
  }
};

// Example of how to modify your existing React component
export const modifyExistingComponent = () => {
  /*
  In your existing PortfolioOptimizer component:
  
  1. Import the real API functions:
     import { optimizePortfolio } from './stockApi.js';
  
  2. Replace the mockOptimizePortfolio function call:
     
     // OLD:
     const optimizationResults = await mockOptimizePortfolio({...});
     
     // NEW:
     const optimizationResults = await optimizePortfolio({...});
  
  3. The response structure is the same, so your existing UI code should work!
  
  4. Add error handling for network issues:
  */
};

// Helper function to format API response for your existing chart components
export const formatApiResponseForCharts = (apiResponse) => {
  const { stockMetrics, portfolios, bestPortfolio, efficientFrontier } = apiResponse;

  return {
    // For scatter plot
    scatterData: {
      portfolios: portfolios.map(p => ({
        x: parseFloat((p.volatility * 100).toFixed(2)),
        y: parseFloat((p.return * 100).toFixed(2)),
        sharpe: parseFloat(p.sharpe.toFixed(3)),
        type: 'portfolio'
      })),
      stocks: stockMetrics.map(s => ({
        x: parseFloat((s.volatility * 100).toFixed(2)),
        y: parseFloat((s.expectedReturn * 100).toFixed(2)),
        ticker: s.ticker,
        type: 'stock'
      })),
      frontier: efficientFrontier.map(f => ({
        x: parseFloat((f.volatility * 100).toFixed(2)),
        y: parseFloat((f.return * 100).toFixed(2)),
        type: 'frontier'
      })),
      optimal: bestPortfolio ? [{
        x: parseFloat((bestPortfolio.volatility * 100).toFixed(2)),
        y: parseFloat((bestPortfolio.return * 100).toFixed(2)),
        sharpe: parseFloat(bestPortfolio.sharpe.toFixed(3)),
        type: 'optimal'
      }] : []
    },

    // For allocation pie chart or table
    allocation: bestPortfolio ? bestPortfolio.weights.map(w => ({
      ticker: w.ticker,
      weight: parseFloat((w.allocation * 100).toFixed(2))
    })).sort((a, b) => b.weight - a.weight) : [],

    // For metrics table
    stockMetrics: stockMetrics.map(s => ({
      ticker: s.ticker,
      expectedReturn: parseFloat((s.expectedReturn * 100).toFixed(2)),
      volatility: parseFloat((s.volatility * 100).toFixed(2)),
      dailyReturn: parseFloat((s.dailyReturn * 100).toFixed(4)),
      dailyVolatility: parseFloat((s.dailyVolatility * 100).toFixed(4))
    })),

    // Summary stats
    summary: {
      bestSharpe: bestPortfolio?.sharpe.toFixed(4) || '0',
      bestReturn: bestPortfolio ? (bestPortfolio.return * 100).toFixed(2) : '0',
      bestVolatility: bestPortfolio ? (bestPortfolio.volatility * 100).toFixed(2) : '0',
      totalPortfolios: portfolios.length
    }
  };
};

// Example of how to handle loading states and errors
export const ApiStateManager = () => {
  const [apiState, setApiState] = useState({
    loading: false,
    data: null,
    error: null,
    lastUpdated: null
  });

  const callOptimizationApi = async (params) => {
    setApiState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await optimizePortfolio(params);
      const formattedData = formatApiResponseForCharts(response);
      
      setApiState({
        loading: false,
        data: formattedData,
        error: null,
        lastUpdated: new Date().toISOString()
      });

      return formattedData;
    } catch (error) {
      setApiState(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
      throw error;
    }
  };

  return { apiState, callOptimizationApi };
};

// Test function to verify your API endpoints are working
export const testApiEndpoints = async () => {
  console.log('🧪 Testing API endpoints...');

  try {
    // Test 1: Simple portfolio optimization
    console.log('1️⃣ Testing portfolio optimization...');
    const testTickers = ['AAPL', 'MSFT'];
    const testDates = getDefaultDateRange(90); // 90 days
    
    const result = await optimizePortfolio({
      tickers: testTickers,
      startDate: testDates.startDate,
      endDate: testDates.endDate,
      numPortfolios: 1000 // Small number for testing
    });

    console.log('✅ Portfolio optimization test passed');
    console.log('📊 Result summary:', {
      stocks: result.stockMetrics.length,
      portfolios: result.portfolios.length,
      bestSharpe: result.bestPortfolio?.sharpe.toFixed(4)
    });

    // Test 2: Stock analysis
    console.log('2️⃣ Testing stock analysis...');
    const analysisResult = await analyzeStocks({
      tickers: testTickers,
      startDate: testDates.startDate,
      endDate: testDates.endDate
    });

    console.log('✅ Stock analysis test passed');
    console.log('📈 Analysis summary:', {
      analyzedStocks: analysisResult.stockAnalysis.length,
      validStocks: analysisResult.stockAnalysis.filter(s => !s.error).length
    });

    return true;
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    return false;
  }
};

export default RealPortfolioOptimizer;