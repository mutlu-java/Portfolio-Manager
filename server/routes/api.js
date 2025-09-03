import express from "express";
const router = express.Router();
import yahooFinance from "yahoo-finance2";
import { optimizePortfolio, calculateMetrics } from "../utils/calc.js";




router.get("/stock/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    const quote = await yahooFinance.quote(symbol);
    res.json(quote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching stock data" });
  }
});

router.get("/stock/:symbol/history", async (req, res) => {
  try {
    const { symbol } = req.params;
    const { startDate, endDate } = req.query; // get query parameters

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "startDate and endDate are required" });
    }

    // Convert dates to UNIX timestamp (in seconds) since yahoo-finance2 expects timestamps
    const period1 = Math.floor(new Date(startDate).getTime() / 1000);
    const period2 = Math.floor(new Date(endDate).getTime() / 1000);

    const history = await yahooFinance.historical(symbol, {
      period1,
      period2,
      interval: "1d",
    });

    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching historical data" });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const results = await yahooFinance.search(query);
    res.json(results);
  } catch (error) {
    console.error('Error searching stocks:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/stock/:symbol/details', async (req, res) => {
  try {
    const { symbol } = req.params;
    const [quote, module] = await Promise.all([
      yahooFinance.quote(symbol),
      yahooFinance.quoteSummary(symbol, {
        modules: ['financialData', 'summaryDetail', 'defaultKeyStatistics']
      })
    ]);

    res.json({
      quote,
      financialData: module.financialData,
      summaryDetail: module.summaryDetail,
      keyStatistics: module.defaultKeyStatistics
    });
  } catch (error) {
    console.error('Error fetching stock details:', error);
    res.status(500).json({ error: error.message });
  }
});


/**
 * Portfolio optimization endpoint
 */
router.post("/portfolio/optimize", async (req, res) => {
  try {
    const { tickers, startDate, endDate, numPortfolios = 5000, riskFreeRate = 0.02 } = req.body;

    // Validation
    if (!tickers || !Array.isArray(tickers) || tickers.length < 2) {
      return res.status(400).json({ 
        error: "At least 2 tickers are required for portfolio optimization" 
      });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({ 
        error: "startDate and endDate are required" 
      });
    }

    // Fetch historical data for all tickers
    const period1 = Math.floor(new Date(startDate).getTime() / 1000);
    const period2 = Math.floor(new Date(endDate).getTime() / 1000);

    console.log(`Fetching data for ${tickers.length} stocks from ${startDate} to ${endDate}`);

    const stocksDataPromises = tickers.map(async ticker => {
      try {
        const history = await yahooFinance.historical(ticker, {
          period1,
          period2,
          interval: "1d",
        });
        
        if (!history || history.length < 30) {
          throw new Error(`Insufficient data for ${ticker}`);
        }

        return {
          ticker,
          prices: history.map(day => day.close),
          dates: history.map(day => day.date)
        };
      } catch (error) {
        console.error(`Error fetching data for ${ticker}:`, error.message);
        throw new Error(`Failed to fetch data for ${ticker}: ${error.message}`);
      }
    });

    const stocksData = await Promise.all(stocksDataPromises);

    // Validate all stocks have same length (align dates)
    const minLength = Math.min(...stocksData.map(s => s.prices.length));
    const alignedStocksData = stocksData.map(stock => ({
      ...stock,
      prices: stock.prices.slice(-minLength)
    }));

    console.log(`Running optimization with ${alignedStocksData.length} stocks, ${minLength} data points each`);

    // Run portfolio optimization
    const optimization = optimizePortfolio(alignedStocksData, numPortfolios, riskFreeRate);

    // Format response
    const response = {
      metadata: {
        tickers,
        startDate,
        endDate,
        dataPoints: minLength,
        numPortfolios,
        riskFreeRate
      },
      stockMetrics: optimization.stockMetrics,
      portfolios: optimization.portfolios,
      bestPortfolio: optimization.bestPortfolio,
      efficientFrontier: optimization.efficientFrontier,
      summary: {
        totalPortfolios: optimization.portfolios.length,
        bestSharpeRatio: optimization.bestPortfolio?.sharpe || 0,
        bestReturn: optimization.bestPortfolio?.return || 0,
        bestVolatility: optimization.bestPortfolio?.volatility || 0
      }
    };

    res.json(response);

  } catch (error) {
    console.error('Portfolio optimization error:', error);
    res.status(500).json({ 
      error: "Portfolio optimization failed",
      details: error.message 
    });
  }
});

/**
 * Get individual stock analysis
 */
router.post("/stocks/analyze", async (req, res) => {
  try {
    const { tickers, startDate, endDate } = req.body;

    if (!tickers || !Array.isArray(tickers)) {
      return res.status(400).json({ error: "Tickers array is required" });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "startDate and endDate are required" });
    }

    const period1 = Math.floor(new Date(startDate).getTime() / 1000);
    const period2 = Math.floor(new Date(endDate).getTime() / 1000);

    const analysisPromises = tickers.map(async ticker => {
      try {
        const history = await yahooFinance.historical(ticker, {
          period1,
          period2,
          interval: "1d",
        });

        if (!history || history.length === 0) {
          throw new Error(`No data found for ${ticker}`);
        }

        const prices = history.map(day => day.close);
        const metrics = calculateMetrics(prices);

        return {
          ticker,
          ...metrics,
          dataPoints: history.length,
          startPrice: prices[0],
          endPrice: prices[prices.length - 1],
          totalReturn: ((prices[prices.length - 1] - prices[0]) / prices[0])
        };
      } catch (error) {
        return {
          ticker,
          error: error.message
        };
      }
    });

    const analysis = await Promise.all(analysisPromises);

    res.json({
      metadata: { tickers, startDate, endDate },
      stockAnalysis: analysis
    });

  } catch (error) {
    console.error('Stock analysis error:', error);
    res.status(500).json({ 
      error: "Stock analysis failed", 
      details: error.message 
    });
  }
});


export default router;