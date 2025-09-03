import React, { useState } from 'react';

const PortfolioOptimizer = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const optimizePortfolio = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const requestBody = {
      tickers: ["ISCTR.IS", "THYAO.IS", "RALYH.IS", "SISE.IS"],
      startDate: "2023-01-01",
      endDate: "2024-01-01",
      numPortfolios: 3000,
      riskFreeRate: 0.29
    };

    try {
      const response = await fetch('http://localhost:5000/api/portfolio/optimize', {
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

      setResult(data);
      console.log('Portfolio optimization successful:', data);
      
    } catch (err) {
      console.error('Error in portfolio optimization:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Portfolio Optimizer</h1>
      
      <button onClick={optimizePortfolio} disabled={loading}>
        {loading ? 'Optimizing...' : 'Optimize Portfolio'}
      </button>

      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && result.bestPortfolio && (
        <div style={{ marginTop: '20px' }}>
          <h2>Best Portfolio (Max Sharpe Ratio)</h2>
          
          <div>
            <strong>Performance Metrics:</strong>
            <ul>
              <li>Annual Return: {(result.bestPortfolio.return * 100).toFixed(2)}%</li>
              <li>Volatility: {(result.bestPortfolio.volatility * 100).toFixed(2)}%</li>
              <li>Sharpe Ratio: {result.bestPortfolio.sharpe.toFixed(4)}</li>
            </ul>
          </div>

          <div>
            <strong>Allocation:</strong>
            <ul>
              {result.bestPortfolio.weights.map((weight, index) => (
                <li key={index}>
                  {weight.ticker}: {(weight.allocation * 100).toFixed(2)}%
                </li>
              ))}
            </ul>
          </div>

          <div>
            <strong>Individual Stock Metrics:</strong>
            <ul>
              {result.stockMetrics.map((stock, index) => (
                <li key={index}>
                  {stock.ticker}: Return {(stock.expectedReturn * 100).toFixed(2)}%, 
                  Volatility {(stock.volatility * 100).toFixed(2)}%
                </li>
              ))}
            </ul>
          </div>

          <div>
            <strong>Summary:</strong>
            <ul>
              <li>Total Portfolios Tested: {result.summary.totalPortfolios}</li>
              <li>Data Points Used: {result.metadata.dataPoints}</li>
              <li>Risk-Free Rate: {(result.metadata.riskFreeRate * 100).toFixed(1)}%</li>
            </ul>
          </div>
        </div>
      )}

      {result && !result.bestPortfolio && (
        <div style={{ color: 'orange', marginTop: '10px' }}>
          Optimization completed but no valid portfolio found.
        </div>
      )}
    </div>
  );
};

export default PortfolioOptimizer;