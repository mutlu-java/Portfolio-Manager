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

  const meanReturn = dailyReturns.reduce((sum, r) => sum + r, 0) / dailyReturns.length;
  const variance = dailyReturns.reduce((sum, r) => sum + Math.pow(r - meanReturn, 2), 0) / dailyReturns.length;
  const stdDev = Math.sqrt(variance);

  // Convert to annual (252 trading days assumption)
  const annualReturn = meanReturn * 252;
  const annualVolatility = stdDev * Math.sqrt(252);

  return { 
    expectedReturn: annualReturn, 
    volatility: annualVolatility, 
    dailyReturns,
    dailyReturn: meanReturn,
    dailyVolatility: stdDev
  };
}

/**
 * Calculate covariance between two return arrays
 */
function covariance(returns1, returns2) {
  const mean1 = returns1.reduce((sum, r) => sum + r, 0) / returns1.length;
  const mean2 = returns2.reduce((sum, r) => sum + r, 0) / returns2.length;
  
  const cov = returns1.reduce((sum, r1, i) => {
    return sum + (r1 - mean1) * (returns2[i] - mean2);
  }, 0) / returns1.length;
  
  return cov * 252; // Annualized
}

/**
 * Create covariance matrix
 */
function createCovarianceMatrix(returnsArray) {
  const n = returnsArray.length;
  const covMatrix = [];
  
  for (let i = 0; i < n; i++) {
    const row = [];
    for (let j = 0; j < n; j++) {
      row.push(covariance(returnsArray[i], returnsArray[j]));
    }
    covMatrix.push(row);
  }
  
  return covMatrix;
}

/**
 * Matrix multiplication helper
 */
function matrixMultiply(a, b) {
  if (Array.isArray(a[0])) {
    // a is 2D matrix, b is 1D vector
    return a.map(row => row.reduce((sum, val, i) => sum + val * b[i], 0));
  } else {
    // a is 1D vector, b is 2D matrix
    return b[0].map((_, colIndex) => 
      a.reduce((sum, val, i) => sum + val * b[i][colIndex], 0)
    );
  }
}

/**
 * Calculate portfolio performance
 */
function portfolioPerformance(weights, expectedReturns, covMatrix) {
  // Portfolio return
  const portReturn = weights.reduce((sum, w, i) => sum + w * expectedReturns[i], 0);

  // Portfolio variance
  let portVariance = 0;
  for (let i = 0; i < weights.length; i++) {
    for (let j = 0; j < weights.length; j++) {
      portVariance += weights[i] * weights[j] * covMatrix[i][j];
    }
  }
  
  const portVolatility = Math.sqrt(portVariance);

  return { return: portReturn, volatility: portVolatility };
}

/**
 * Generate efficient frontier points
 */
function generateEfficientFrontier(expectedReturns, covMatrix, numPoints = 100) {
  const minReturn = Math.min(...expectedReturns);
  const maxReturn = Math.max(...expectedReturns);
  const returnRange = maxReturn - minReturn;
  
  const frontierPoints = [];
  
  for (let i = 0; i <= numPoints; i++) {
    const targetReturn = minReturn + (returnRange * i / numPoints);
    
    // Simple optimization for demonstration (in practice, use proper quadratic programming)
    let bestVolatility = Infinity;
    let bestWeights = null;
    
    // Monte Carlo approach for finding minimum variance portfolio for target return
    for (let j = 0; j < 1000; j++) {
      let weights = Array.from({ length: expectedReturns.length }, () => Math.random());
      const weightSum = weights.reduce((sum, w) => sum + w, 0);
      weights = weights.map(w => w / weightSum);
      
      const { return: portReturn, volatility } = portfolioPerformance(weights, expectedReturns, covMatrix);
      
      if (Math.abs(portReturn - targetReturn) < 0.01 && volatility < bestVolatility) {
        bestVolatility = volatility;
        bestWeights = [...weights];
      }
    }
    
    if (bestWeights) {
      frontierPoints.push({
        return: targetReturn,
        volatility: bestVolatility,
        weights: bestWeights
      });
    }
  }
  
  return frontierPoints;
}

/**
 * Portfolio optimization main function
 */
function optimizePortfolio(stocksData, numPortfolios = 10000, riskFreeRate = 0.02) {
  const n = stocksData.length;

  // Calculate individual stock metrics
  const stockMetrics = stocksData.map(stock => ({
    ticker: stock.ticker,
    ...calculateMetrics(stock.prices)
  }));
  
  const expectedReturns = stockMetrics.map(m => m.expectedReturn);
  const returnsArray = stockMetrics.map(m => m.dailyReturns);

  // Create covariance matrix
  const covMatrix = createCovarianceMatrix(returnsArray);

  // Monte Carlo simulation for portfolios
  let bestSharpe = -Infinity;
  let bestPortfolio = null;
  const portfolios = [];

  for (let i = 0; i < numPortfolios; i++) {
    // Generate random weights
    let weights = Array.from({ length: n }, () => Math.random());
    const weightSum = weights.reduce((sum, w) => sum + w, 0);
    weights = weights.map(w => w / weightSum);

    // Calculate portfolio performance
    const { return: portReturn, volatility: portVolatility } =
      portfolioPerformance(weights, expectedReturns, covMatrix);

    const sharpe = (portReturn - riskFreeRate) / portVolatility;

    const portfolio = {
      weights: weights.map((w, idx) => ({
        ticker: stocksData[idx].ticker,
        allocation: w
      })),
      return: portReturn,
      volatility: portVolatility,
      sharpe: isFinite(sharpe) ? sharpe : -Infinity
    };

    portfolios.push(portfolio);

    if (sharpe > bestSharpe && isFinite(sharpe)) {
      bestSharpe = sharpe;
      bestPortfolio = portfolio;
    }
  }

  // Generate efficient frontier
  const efficientFrontier = generateEfficientFrontier(expectedReturns, covMatrix);

  return {
    stockMetrics,
    portfolios: portfolios.filter(p => isFinite(p.sharpe)),
    bestPortfolio,
    efficientFrontier,
    covarianceMatrix: covMatrix
  };
}

export { optimizePortfolio, calculateMetrics, getDailyReturns , createCovarianceMatrix, portfolioPerformance, generateEfficientFrontier};