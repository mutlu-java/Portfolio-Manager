import React, { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import { Trash2, TrendingUp, TrendingDown, Target, BarChart3, Activity } from 'lucide-react';
import StockSearch from '../components/StockSearch';

const PortfolioOptimizer = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const [startDate, setStartDate] = useState("2023-01-01");
  const [endDate, setEndDate] = useState("2025-01-01");
  const [tickers, setTickers] = useState(["ISCTR.IS", "THYAO.IS", "RALYH.IS", "SISE.IS", "FROTO.IS"]);
  const [numPortfolios, setNumPortfolios] = useState(20000);
  const [riskFreeRate, setRiskFreeRate] = useState(0.29);

  const optimizePortfolio = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const requestBody = {
      startDate,
      endDate,
      tickers,
      numPortfolios,
      riskFreeRate
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

  // pie chart colors
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  const pieData = result && result.bestPortfolio ? result.bestPortfolio.weights.map((weight, index) => ({
    name: weight.ticker,
    value: parseFloat((weight.allocation * 100).toFixed(2))
  })) : [];

  const handleStockSelect = (stock) => {
    if (!tickers.includes(stock.symbol)) {
      setTickers([...tickers, stock.symbol]);
    }
  };

  const handleRemoveTicker = (ticker) => {
    setTickers(tickers.filter(t => t !== ticker));
  };

  const MetricCard = ({ title, value, subtitle, icon: Icon, color = "blue" }) => {
    const colorClasses = {
      blue: "bg-blue-50 border-blue-200 text-blue-800",
      green: "bg-green-50 border-green-200 text-green-800",
      orange: "bg-orange-50 border-orange-200 text-orange-800",
      purple: "bg-purple-50 border-purple-200 text-purple-800"
    };

    return (
      <div className={`p-4 rounded-lg border-2 ${colorClasses[color]}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-75">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && <p className="text-xs opacity-60 mt-1">{subtitle}</p>}
          </div>
          {Icon && <Icon className="w-8 h-8 opacity-60" />}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Portfolio Optimizer</h1>
          <p className="text-gray-600">Optimize your investment portfolio using Modern Portfolio Theory</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Side - Controls and Results */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stock Search */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <StockSearch onStockSelect={handleStockSelect} />
            </div>

            {/* Input Parameters */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Optimization Parameters</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Portfolios</label>
                  <input
                    type="number"
                    value={numPortfolios}
                    onChange={(e) => setNumPortfolios(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Risk-Free Rate</label>
                  <input
                    type="number"
                    step="0.01"
                    value={riskFreeRate}
                    onChange={(e) => setRiskFreeRate(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button 
                onClick={optimizePortfolio} 
                disabled={loading}
                className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <BarChart3 className="w-5 h-5" />
                {loading ? 'Optimizing...' : 'Optimize Portfolio'}
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg">
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Results */}
            {result && result.bestPortfolio && (
              <div className="space-y-6">
                {/* Performance Metrics */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
                    <Target className="w-6 h-6 text-blue-600" />
                    Best Portfolio (Max Sharpe Ratio)
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <MetricCard
                      title="Annual Return"
                      value={`${(result.bestPortfolio.return * 100).toFixed(2)}%`}
                      subtitle="Expected yearly return"
                      icon={TrendingUp}
                      color="green"
                    />
                    <MetricCard
                      title="Volatility"
                      value={`${(result.bestPortfolio.volatility * 100).toFixed(2)}%`}
                      subtitle="Risk measurement"
                      icon={TrendingDown}
                      color="orange"
                    />
                    <MetricCard
                      title="Sharpe Ratio"
                      value={result.bestPortfolio.sharpe.toFixed(4)}
                      subtitle="Risk-adjusted return"
                      icon={Target}
                      color="purple"
                    />
                  </div>

                  {/* Portfolio Allocation - Side by Side */}
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
                      <Activity className="w-6 h-6 text-blue-600" />
                      Portfolio Allocation
                    </h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Pie Chart */}
                      <div className="flex justify-center">
                        <PieChart width={420} height={350}>
                          <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            label={({value}) => `${value}%`}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value}%`} />
                        </PieChart>
                      </div>

                      {/* Allocation Percentages */}
                      <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-gray-700 mb-4">Asset Allocation</h4>
                        {result.bestPortfolio.weights.map((weight, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              />
                              <span className="font-medium text-gray-800">{weight.ticker}</span>
                            </div>
                            <span className="font-bold text-lg text-gray-900">
                              {(weight.allocation * 100).toFixed(2)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Individual Stock Metrics */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">Individual Stock Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {result.stockMetrics.map((stock, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gray-800 mb-3 text-lg">{stock.ticker}</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Return:</span>
                            <span className="font-semibold text-green-600">{(stock.expectedReturn * 100).toFixed(2)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Volatility:</span>
                            <span className="font-semibold text-orange-600">{(stock.volatility * 100).toFixed(2)}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{result.summary.totalPortfolios.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Total Portfolios Tested</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{result.metadata.dataPoints}</div>
                      <div className="text-sm text-gray-600">Data Points Used</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{(result.metadata.riskFreeRate * 100).toFixed(1)}%</div>
                      <div className="text-sm text-gray-600">Risk-Free Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {result && !result.bestPortfolio && (
              <div className="bg-orange-50 border border-orange-200 text-orange-800 px-6 py-4 rounded-lg">
                Optimization completed but no valid portfolio found.
              </div>
            )}

            {/* Efficient Frontier Chart */}
            {result && result.efficientFrontier && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Risk-Return Scatter Plot</h2>

                {/* Debug info */}
                <div className="text-sm text-gray-600 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div>Efficient Frontier Points: {result.efficientFrontier.length}</div>
                  <div>Stock Metrics: {result.stockMetrics.length}</div>
                  {result.bestPortfolio && (
                    <div>Best Portfolio: Risk {(result.bestPortfolio.volatility * 100).toFixed(2)}%, Return {(result.bestPortfolio.return * 100).toFixed(2)}%</div>
                  )}
                </div>

                <ResponsiveContainer width="100%" height={500}>
                  <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      type="number"
                      dataKey="x"
                      domain={['dataMin', 'dataMax']}
                      label={{ value: 'Risk (Volatility %)', position: 'insideBottom', offset: -40 }}
                      tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
                    />
                    <YAxis
                      type="number"
                      dataKey="y"
                      domain={['dataMin', 'dataMax']}
                      label={{ value: 'Return %', angle: -90, position: 'insideLeft' }}
                      tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
                    />
                    <Tooltip
                      formatter={(value, name) => [
                        `${(value * 100).toFixed(2)}%`,
                        name
                      ]}
                    />

                    {/* Efficient Frontier */}
                    <Scatter
                      name="Efficient Frontier"
                      data={result.efficientFrontier.map(point => ({
                        x: point.volatility,
                        y: point.return
                      }))}
                      fill="#3B82F6"
                    />

                    {/* Individual Stocks */}
                    <Scatter
                      name="Individual Stocks"
                      data={result.stockMetrics.map(stock => ({
                        x: stock.volatility,
                        y: stock.expectedReturn
                      }))}
                      fill="#10B981"
                    />

                    {/* Optimal Portfolio */}
                    {result.bestPortfolio && (
                      <Scatter
                        name="Optimal Portfolio"
                        data={[{
                          x: result.bestPortfolio.volatility,
                          y: result.bestPortfolio.return
                        }]}
                        fill="#EF4444"
                      />
                    )}
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Right Side - Ticker List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Selected Tickers</h2>
              
              <div className="space-y-3">
                {tickers.length === 0 ? (
                  <div className="text-gray-500 text-center py-8">
                    No tickers selected
                  </div>
                ) : (
                  tickers.map((ticker, index) => (
                    <div
                      key={ticker}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium text-gray-800">{ticker}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveTicker(ticker)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors duration-150"
                        title="Remove ticker"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
              
              {tickers.length < 2 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                  Add at least 2 tickers to optimize portfolio
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioOptimizer;