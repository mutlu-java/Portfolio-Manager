const API_BASE_URL = 'http://localhost:5000/api';




export const getStockQuote = async (symbol) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stock/${symbol}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch stock quote');
    }
    
    return {
      symbol: data.symbol,
      price: data.regularMarketPrice,
      change: data.regularMarketChange,
      changePercent: data.regularMarketChangePercent,
      volume: data.regularMarketVolume,
      high: data.regularMarketDayHigh,
      low: data.regularMarketDayLow,
      open: data.regularMarketOpen,
      previousClose: data.regularMarketPreviousClose,
      quoteSourceName: data.quoteSourceName,
      currency: data.currency,
      exchange: data.exchange,
      fullExchangeName: data.fullExchangeName,
      longName: data.longName,
      shortName: data.shortName
    };
  } catch (error) {
    console.error('Error in getStockQuote:', error);
    throw error;
  }
};

export const getHistoricalData = async (symbol, startDate, endDate) => {
  try {
    const params = new URLSearchParams({ startDate, endDate }).toString();
    const response = await fetch(`${API_BASE_URL}/stock/${symbol}/history?${params}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch historical data');
    }
    return data;
   
  } catch (error) {
    console.error('Error in getHistoricalData:', error);
    throw error;
  }
};

export const searchStocks = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to search stocks');
    }
    
    return data.quotes.map(quote => ({
      symbol: quote.symbol,
      name: quote.shortname || quote.longname,
      type: quote.typeDisp,
      exchange: quote.exchange
    }));
  } catch (error) {
    console.error('Error in searchStocks:', error);
    throw error;
  }
};

export const getStockDetails = async (symbol) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stock/${symbol}/details`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch stock details');
    }
    return data;
    
  } catch (error) {
    console.error('Error in getStockDetails:', error);
    throw error;
  }
};

// ---------------- New Portfolio Optimization Functions ----------------

/**
 * Optimize portfolio with given tickers and date range
 * @param {Object} params - Optimization parameters
 * @param {string[]} params.tickers - Array of stock tickers
 * @param {string} params.startDate - Start date in YYYY-MM-DD format
 * @param {string} params.endDate - End date in YYYY-MM-DD format
 * @param {number} [params.numPortfolios=5000] - Number of portfolios to simulate
 * @param {number} [params.riskFreeRate=0.02] - Risk-free rate for Sharpe ratio calculation
 * @returns {Promise<Object>} Portfolio optimization results
 */
export const optimizePortfolio = async ({ 
  tickers, 
  startDate, 
  endDate, 
  numPortfolios = 5000, 
  riskFreeRate = 0.02 
}) => {
  try {
    if (!tickers || !Array.isArray(tickers) || tickers.length < 2) {
      throw new Error('At least 2 tickers are required for portfolio optimization');
    }

    if (!startDate || !endDate) {
      throw new Error('Both startDate and endDate are required');
    }

    const requestBody = {
      tickers,
      startDate,
      endDate,
      numPortfolios,
      riskFreeRate
    };

    console.log('Sending portfolio optimization request:', requestBody);

    const response = await fetch(`${API_BASE_URL}/portfolio/optimize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Portfolio optimization failed');
    }

    console.log('Portfolio optimization successful:', {
      tickers: data.metadata.tickers,
      dataPoints: data.metadata.dataPoints,
      totalPortfolios: data.summary.totalPortfolios,
      bestSharpe: data.summary.bestSharpeRatio?.toFixed(4)
    });

    return data;
    
  } catch (error) {
    console.error('Error in optimizePortfolio:', error);
    throw error;
  }
};

/**
 * Analyze individual stocks for given tickers and date range
 * @param {Object} params - Analysis parameters
 * @param {string[]} params.tickers - Array of stock tickers
 * @param {string} params.startDate - Start date in YYYY-MM-DD format
 * @param {string} params.endDate - End date in YYYY-MM-DD format
 * @returns {Promise<Object>} Stock analysis results
 */
export const analyzeStocks = async ({ tickers, startDate, endDate }) => {
  try {
    if (!tickers || !Array.isArray(tickers) || tickers.length === 0) {
      throw new Error('At least 1 ticker is required for stock analysis');
    }

    if (!startDate || !endDate) {
      throw new Error('Both startDate and endDate are required');
    }

    const requestBody = {
      tickers,
      startDate,
      endDate
    };

    console.log('Sending stock analysis request:', requestBody);

    const response = await fetch(`${API_BASE_URL}/stocks/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Stock analysis failed');
    }

    console.log('Stock analysis successful:', {
      tickers: data.metadata.tickers,
      analyzedStocks: data.stockAnalysis.length
    });

    return data;
    
  } catch (error) {
    console.error('Error in analyzeStocks:', error);
    throw error;
  }
};

// ---------------- Utility Functions ----------------

/**
 * Format portfolio data for visualization
 * @param {Object} portfolioData - Raw portfolio data from API
 * @returns {Object} Formatted data ready for charts
 */
export const formatPortfolioDataForChart = (portfolioData) => {
  try {
    const { stockMetrics, portfolios, bestPortfolio, efficientFrontier } = portfolioData;

    // Format individual stock data for scatter plot
    const stockPoints = stockMetrics.map(stock => ({
      x: stock.volatility,
      y: stock.expectedReturn,
      ticker: stock.ticker,
      type: 'individual-stock'
    }));

    // Format portfolio data for scatter plot
    const portfolioPoints = portfolios.map(portfolio => ({
      x: portfolio.volatility,
      y: portfolio.return,
      sharpe: portfolio.sharpe,
      weights: portfolio.weights,
      type: 'portfolio'
    }));

    // Format efficient frontier
    const frontierPoints = efficientFrontier.map(point => ({
      x: point.volatility,
      y: point.return,
      weights: point.weights,
      type: 'efficient-frontier'
    }));

    // Best portfolio point
    const bestPortfolioPoint = bestPortfolio ? {
      x: bestPortfolio.volatility,
      y: bestPortfolio.return,
      sharpe: bestPortfolio.sharpe,
      weights: bestPortfolio.weights,
      type: 'optimal-portfolio'
    } : null;

    return {
      stockPoints,
      portfolioPoints,
      frontierPoints,
      bestPortfolioPoint,
      stockMetrics,
      summary: portfolioData.summary
    };
    
  } catch (error) {
    console.error('Error formatting portfolio data:', error);
    throw error;
  }
};

/**
 * Validate date inputs
 * @param {string} startDate - Start date string
 * @param {string} endDate - End date string
 * @returns {Object} Validation result
 */
export const validateDateInputs = (startDate, endDate) => {
  const errors = [];
  
  if (!startDate) errors.push('Start date is required');
  if (!endDate) errors.push('End date is required');
  
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    
    if (start >= end) {
      errors.push('Start date must be before end date');
    }
    
    if (end > now) {
      errors.push('End date cannot be in the future');
    }
    
    if (start < new Date('2000-01-01')) {
      errors.push('Start date should not be before 2000');
    }
    
    const daysDifference = (end - start) / (1000 * 60 * 60 * 24);
    if (daysDifference < 30) {
      errors.push('Date range should be at least 30 days for meaningful analysis');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate ticker inputs
 * @param {string[]} tickers - Array of tickers
 * @returns {Object} Validation result
 */
export const validateTickers = (tickers) => {
  const errors = [];
  
  if (!Array.isArray(tickers)) {
    errors.push('Tickers must be an array');
  } else {
    if (tickers.length === 0) {
      errors.push('At least one ticker is required');
    }
    
    if (tickers.length > 20) {
      errors.push('Maximum 20 tickers allowed for performance reasons');
    }
    
    const invalidTickers = tickers.filter(ticker => 
      !ticker || typeof ticker !== 'string' || ticker.trim().length === 0
    );
    
    if (invalidTickers.length > 0) {
      errors.push('All tickers must be non-empty strings');
    }
    
    const duplicates = tickers.filter((ticker, index) => 
      tickers.indexOf(ticker) !== index
    );
    
    if (duplicates.length > 0) {
      errors.push('Duplicate tickers found: ' + duplicates.join(', '));
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// ---------------- Example Usage Functions ----------------

/**
 * Example: Get complete portfolio analysis
 * @param {string[]} tickers - Stock tickers
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 */
export const getCompletePortfolioAnalysis = async (tickers, startDate, endDate) => {
  try {
    console.log('Starting complete portfolio analysis...');
    
    // Validate inputs
    const tickerValidation = validateTickers(tickers);
    const dateValidation = validateDateInputs(startDate, endDate);
    
    if (!tickerValidation.isValid) {
      throw new Error('Ticker validation failed: ' + tickerValidation.errors.join(', '));
    }
    
    if (!dateValidation.isValid) {
      throw new Error('Date validation failed: ' + dateValidation.errors.join(', '));
    }
    
    // Get individual stock analysis
    console.log('Fetching individual stock analysis...');
    const stockAnalysis = await analyzeStocks({ tickers, startDate, endDate });
    
    // Only proceed with optimization if we have enough data
    const validStocks = stockAnalysis.stockAnalysis.filter(stock => !stock.error);
    if (validStocks.length < 2) {
      throw new Error('Need at least 2 valid stocks for portfolio optimization');
    }
    
    // Get portfolio optimization if we have at least 2 stocks
    console.log('Running portfolio optimization...');
    const portfolioOptimization = await optimizePortfolio({
      tickers: validStocks.map(s => s.ticker),
      startDate,
      endDate
    });
    
    // Format data for visualization
    const chartData = formatPortfolioDataForChart(portfolioOptimization);
    
    return {
      success: true,
      stockAnalysis,
      portfolioOptimization,
      chartData,
      summary: {
        totalStocks: tickers.length,
        validStocks: validStocks.length,
        invalidStocks: stockAnalysis.stockAnalysis.filter(s => s.error).map(s => ({
          ticker: s.ticker,
          error: s.error
        })),
        bestSharpeRatio: portfolioOptimization.summary.bestSharpeRatio,
        analysisDate: new Date().toISOString()
      }
    };
    
  } catch (error) {
    console.error('Complete portfolio analysis failed:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

// ---------------- Export Helper Objects ----------------

export const API_ENDPOINTS = {
  DAILY_GAINERS: '/dailyGainers',
  STOCK_QUOTE: '/stock/:symbol',
  STOCK_HISTORY: '/stock/:symbol/history',
  STOCK_DETAILS: '/stock/:symbol/details',
  SEARCH: '/search',
  PORTFOLIO_OPTIMIZE: '/portfolio/optimize',
  STOCKS_ANALYZE: '/stocks/analyze'
};

export const DEFAULT_CONFIG = {
  NUM_PORTFOLIOS: 5000,
  RISK_FREE_RATE: 0.02,
  MIN_DATA_POINTS: 30,
  MAX_TICKERS: 20,
  DEFAULT_DATE_RANGE_DAYS: 365
};

// Utility to generate default date range
export const getDefaultDateRange = (days = DEFAULT_CONFIG.DEFAULT_DATE_RANGE_DAYS) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0]
  };
};

// Popular ticker lists for quick selection
export const POPULAR_TICKERS = {
  US_TECH: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA'],
  US_INDICES: ['SPY', 'QQQ', 'IWM', 'DIA'],
  BIST_100: [
    'ISCTR.IS', 'GARAN.IS', 'AKBNK.IS', 'YKBNK.IS', 'HALKB.IS',
    'KCHOL.IS', 'SAHOL.IS', 'SISE.IS', 'ASELS.IS', 'THYAO.IS'
  ],
  CRYPTO: ['BTC-USD', 'ETH-USD', 'BNB-USD', 'ADA-USD'],
  COMMODITIES: ['GC=F', 'SI=F', 'CL=F', '^TNX']
};