const math = require("mathjs");

// ---------------- Utility Functions ----------------

/**
 * Compute daily returns from price series
 */
function getDailyReturns(prices) {
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  return returns;
}

/**
 * Calculate stock metrics (annualized expected return & volatility)
 */
function calculateMetrics(prices) {
  const dailyReturns = getDailyReturns(prices);

  const meanReturn = math.mean(dailyReturns);
  const stdDev = math.std(dailyReturns);

  // Convert to annual (252 trading days assumption)
  const annualReturn = meanReturn * 252;
  const annualVolatility = stdDev * Math.sqrt(252);

  return { expectedReturn: annualReturn, volatility: annualVolatility, dailyReturns };
}

/**
 * Covariance matrix of daily returns (annualized)
 */
function covarianceMatrix(returnsArray) {
  return math.matrix(
    returnsArray.map(r1 =>
      returnsArray.map(r2 => math.covariance(r1, r2) * 252)
    )
  );
}

/**
 * Portfolio performance (expected return & volatility)
 */
function portfolioPerformance(weights, expectedReturns, covMatrix) {
  const portReturn = math.dot(weights, expectedReturns);

  const w = math.matrix(weights);
  const variance = math.multiply(math.multiply(w, covMatrix), math.transpose(w)).valueOf();
  const portVolatility = Math.sqrt(variance);

  return { return: portReturn, volatility: portVolatility };
}

// ---------------- Portfolio Simulation ----------------

/**
 * Simulate portfolios & find optimal allocation
 */
function simulatePortfolios(stocksData, numPortfolios = 5000, riskFreeRate = 0.02) {
  const n = stocksData.length;

  // Step 1: individual metrics
  const stockMetrics = stocksData.map(s => calculateMetrics(s.prices));
  const expectedReturns = stockMetrics.map(m => m.expectedReturn);
  const returnsArray = stockMetrics.map(m => m.dailyReturns);

  // Step 2: covariance matrix
  const covMatrix = covarianceMatrix(returnsArray);

  // Step 3: simulate portfolios
  let bestSharpe = -Infinity;
  let bestPortfolio = null;
  const portfolios = [];

  for (let i = 0; i < numPortfolios; i++) {
    // random weights
    let weights = Array.from({ length: n }, () => Math.random());
    const weightSum = math.sum(weights);
    weights = weights.map(w => w / weightSum);

    // portfolio stats
    const { return: portReturn, volatility: portVolatility } =
      portfolioPerformance(weights, expectedReturns, covMatrix);

    const sharpe = (portReturn - riskFreeRate) / portVolatility;

    const portfolio = {
      weights,
      return: portReturn,
      volatility: portVolatility,
      sharpe
    };

    portfolios.push(portfolio);

    if (sharpe > bestSharpe) {
      bestSharpe = sharpe;
      bestPortfolio = portfolio;
    }
  }

  return {
    stockMetrics,   // each stock's return & volatility
    portfolios,     // ALL simulated portfolios
    bestPortfolio   // max Sharpe ratio portfolio
  };
}

// ---------------- Example Usage ----------------

// Example stock data (replace with your historical price fetcher)
const stock1 = { ticker: "AAPL", prices: [100, 102, 105, 103, 108, 110, 112] };
const stock2 = { ticker: "MSFT", prices: [200, 198, 202, 205, 207, 210, 208] };
const stock3 = { ticker: "GOOG", prices: [1500, 1520, 1510, 1530, 1540, 1555, 1560] };

// Run simulation
const { stockMetrics, portfolios, bestPortfolio } = simulatePortfolios(
  [stock1, stock2, stock3],
  5000
);

// Print results
console.log("📊 Individual Stock Metrics:");
stockMetrics.forEach((m, i) => {
  console.log(
    `- ${[stock1, stock2, stock3][i].ticker}: Return=${m.expectedReturn.toFixed(4)}, Volatility=${m.volatility.toFixed(4)}`
  );
});

console.log("\n🏆 Optimal Portfolio (Max Sharpe Ratio):");
console.log("Weights:", bestPortfolio.weights.map(w => w.toFixed(2)));
console.log("Expected Return:", bestPortfolio.return.toFixed(4));
console.log("Volatility:", bestPortfolio.volatility.toFixed(4));
console.log("Sharpe Ratio:", bestPortfolio.sharpe.toFixed(4));

// If you want, you can send `portfolios` to your frontend for visualization
// Example: portfo