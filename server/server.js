// server.js
import express from "express";
import cors from "cors";
import yahooFinance from "yahoo-finance2";

const app = express();
const PORT = 5000;

app.use(cors()); // Allow all origins
app.use(express.json());

// Example endpoint: Get stock price
app.get("/api/stock/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    const quote = await yahooFinance.quote(symbol);
    res.json(quote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching stock data" });
  }
});

// Example endpoint: Historical data takes data from period1 to today
app.get("/api/history/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    const history = await yahooFinance.historical(symbol, {
      period1: "2020-01-01",
      interval: "1d",
    });
    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching historical data" });
  }
});
// endpoint to search for stocks
app.get('/api/search', async (req, res) => {
  try {
    const { query } = req.query;
    const results = await yahooFinance.search(query);
    res.json(results);
  } catch (error) {
    console.error('Error searching stocks:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get detailed quote (including additional info)
app.get('api/stock/:symbol/details', async (req, res) => {
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

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
