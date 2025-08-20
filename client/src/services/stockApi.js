const API_BASE_URL = 'http://localhost:5000/api';

// Get current stock quote
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
      previousClose: data.regularMarketPreviousClose
    };
  } catch (error) {
    console.error('Error in getStockQuote:', error);
    throw error;
  }
};

// Get historical data for a date range
export const getHistoricalData = async (symbol, startDate, endDate) => {
  try {
    const params = new URLSearchParams({ startDate, endDate }).toString();
    const response = await fetch(`${API_BASE_URL}/stock/${symbol}/history?${params}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch historical data');
    }
    return data;
    // example response structure is below i prefer to return the data as is
    // return data.map(item => ({
    //   date: item.date,
    //   price: item.close,
    //   open: item.open,
    //   high: item.high,
    //   low: item.low,
    //   volume: item.volume
    // }));
  } catch (error) {
    console.error('Error in getHistoricalData:', error);
    throw error;
  }
};

// Search for stocks
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

// Get detailed stock information
export const getStockDetails = async (symbol) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stock/${symbol}/details`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch stock details');
    }
    
    return {
      quote: {
        price: data.quote.regularMarketPrice,
        change: data.quote.regularMarketChange,
        changePercent: data.quote.regularMarketChangePercent,
        volume: data.quote.regularMarketVolume
      },
      financialData: {
        marketCap: data.financialData.marketCap,
        eps: data.financialData.eps,
        peRatio: data.financialData.peRatio,
        pbRatio: data.financialData.priceToBook,
        dividendYield: data.summaryDetail.dividendYield,
        high52Week: data.summaryDetail.fiftyTwoWeekHigh,
        low52Week: data.summaryDetail.fiftyTwoWeekLow
      }
    };
  } catch (error) {
    console.error('Error in getStockDetails:', error);
    throw error;
  }
};
