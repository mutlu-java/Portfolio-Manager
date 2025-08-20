import React from 'react';
import StockSearch from '../components/StockSearch.jsx';
import { getStockQuote } from '../services/stockApi';

const PortfolioSummary = ({ totalInvested, currentValue, profitLoss }) => (
  <div className="p-4 bg-white rounded shadow-md w-64 mr-0.5">
    <h3 className="text-lg font-semibold mb-2">Portfolio Summary</h3>
    <p>Total Invested: ₺{totalInvested.toFixed(2)}</p>
    <p>Current Value: ₺{currentValue.toFixed(2)}</p>
    <p className={profitLoss >= 0 ? "text-green-500" : "text-red-500"}>
      Total Profit/Loss: ₺{profitLoss.toFixed(2)}
    </p>
  </div>
);



const Portfolio = () => {
  const [portfolio, setPortfolio] = React.useState([]);

  // user-input states
  const [buyDate, setBuyDate] = React.useState(new Date().toISOString().split("T")[0]);
  const [buyPrice, setBuyPrice] = React.useState('');
  const [stockQuantity, setStockQuantity] = React.useState('');
  const [selectedStock, setSelectedStock] = React.useState(null);

  // prepare stock object
  const createStockItem = (stock) => {
    return {
      ...stock,
      stockBuyDate: buyDate,
      stockBuyPrice: Number(buyPrice),
      quantity: Number(stockQuantity),
    };
  };

  const handleStockSelection = (stock) => {
    setSelectedStock(stock);
  }

  const calculateTotals = () => {
    const totalInvested = portfolio.reduce(
      (sum, stock) => sum + (stock.stockBuyPrice * stock.quantity),
      0
    );

    const currentValue = portfolio.reduce(
      (sum, stock) => sum + (stock.price * stock.quantity),
      0
    );

    const profitLoss = currentValue - totalInvested;

    return { totalInvested, currentValue, profitLoss };
  };

  const { totalInvested, currentValue, profitLoss } = calculateTotals();




  // add stock to portfolio
  const handleAddStock = async (stock) => {
    try {
      const stockData = await getStockQuote(stock.symbol);
      setPortfolio((prev) => [...prev, createStockItem(stockData)]);
      setSelectedStock(null);
      setBuyPrice(0);

    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  return (


    <div className="p-4">



      {!selectedStock ? (<StockSearch onStockSelect={handleStockSelection} />) : (

        <div className="mb-4 p-4 border rounded bg-gray-50 flex gap-4 items-end " >




          <label className="block text-sm text-gray-600 mb-1">
            Buy Price:
            <input
              type="number"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              className="ml-2 p-1 border rounded"
              placeholder="Enter buy price"
            />
          </label>
          <label className="block text-sm text-gray-600 mb-1">
            Buy Date:
            <input
              type="date"
              value={buyDate}
              onChange={(e) => setBuyDate(e.target.value)}
              className="ml-2 p-1 border rounded"
            />
          </label>
          <label className="block text-sm text-gray-600 mb-1">
            Quantity:
            <input
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              className="ml-2 p-1 border rounded"
              placeholder="Enter quantity"
            />
          </label>
          <button
            onClick={() => handleAddStock(selectedStock)}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Stock
          </button>
        </div>


      )}
      {/* Stock search component */}


      {portfolio.length > 0 ? (<div className="grid grid-cols-6 gap-4 px-4 py-3 bg-gray-50 border-b text-xs font-medium text-gray-500 uppercase tracking-wide">
        <div>SYMBOL</div>

        <div className="text-right">Price</div>
        <div className="text-right">Quantity</div>
        <div className="text-right">Profit/Loss</div>
        <div className="text-right"> Share Value</div>
        <div></div>
      </div>) : ("")}
      {/* Portfolio List */}
      {portfolio.map((stock, index) => (
        <div key={index} className="grid grid-cols-6 gap-4 px-4 py-4 border-b border-gray-100 hover:bg-gray-50">
          {/* Symbol and Name */}
          <div className="flex items-center">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 text-xs font-semibold bg-blue-600 text-white rounded">
                  {stock.symbol}
                </span>
              </div>
              <span className="text-sm text-gray-600 mt-1">{stock.name}</span>
            </div>
          </div>


          {/* Price */}
          <div className="text-right">
            <div className="text-sm font-medium">₺{stock.price}</div>
          </div>

          {/* Quantity */}
          <div className="text-right">
            <div className="text-sm">{stock.quantity}</div>
          </div>

          {/* Daily Gain/Loss */}
          <div className="text-right">
            <div className={`text-sm ${(stock.price - stock.stockBuyPrice) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {(stock.price - stock.stockBuyPrice) >= 0 ? '↗' : '↘'}
              ₺{Math.abs((stock.price - stock.stockBuyPrice) * stock.quantity).toFixed(2)}
            </div>
            <div className={`text-xs ${(stock.price - stock.stockBuyPrice) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {(stock.price - stock.stockBuyPrice) >= 0 ? '↗' : '↘'}
              %{(((stock.price - stock.stockBuyPrice) / stock.stockBuyPrice) * 100).toFixed(2)}
            </div>
          </div>

          {/* Total Value */}
          <div className="text-right">
            <div className="text-sm font-medium">₺{(stock.price * stock.quantity).toFixed(2)}</div>
          </div>

          {/* Expand Arrow */}
          <div className="text-right">
            <button className="text-gray-400 hover:text-gray-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </button>
          </div>
        </div>
      ))}


      {
        portfolio.length > 0 &&
        <PortfolioSummary
          totalInvested={totalInvested}
          currentValue={currentValue}
          profitLoss={profitLoss}
        />

      }


    </div>
  );
};

export default Portfolio;
