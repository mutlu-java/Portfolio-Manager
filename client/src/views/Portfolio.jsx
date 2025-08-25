import React from 'react';
import StockSearch from '../components/StockSearch.jsx';
import PortfolioSummary from '../components/PortfolioSummary'; // Your existing component
import StockForm from '../components/StockForm';
import PortfolioList from '../components/PortfolioList';
import PieChart from '../components/PieChart';
import { getStockQuote } from '../services/stockApi';

// Please notice stock doesnt implies the stock.symbol only, it is the whole object returned from yahoo finance api
//check the returned json with postman or browser

const Portfolio = () => {
  const [portfolio, setPortfolio] = React.useState([]);
  const [selectedStock, setSelectedStock] = React.useState(null);

  // Form states
  const [buyDate, setBuyDate] = React.useState(new Date().toISOString().split("T")[0]);
  const [buyPrice, setBuyPrice] = React.useState('');
  const [stockQuantity, setStockQuantity] = React.useState('');

  const[pieChartData, setPieChartData] = React.useState([]);

  // Calculate portfolio totals
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




  // Create stock item with user input
  const createStockItem = (stock) => ({
    ...stock,
    stockBuyDate: buyDate,
    stockBuyPrice: Number(buyPrice),
    quantity: Number(stockQuantity),
  });

  // Handle stock selection from search
  const handleStockSelection = (stock) => {
    setSelectedStock(stock);
  };

  // Add stock to portfolio
  const handleAddStock = async (stock) => {
    try {
      const stockData = await getStockQuote(stock.symbol);
      const newStock = createStockItem(stockData);
      setPortfolio((prev) => [...prev, newStock]);

      
      // Reset form
      setSelectedStock(null);
      setBuyPrice('');
      setStockQuantity('');

      
    } catch (error) {
      console.error("Error fetching stock data:", error);
      // You might want to show an error message to the user here
    }
  };

  // Remove stock from portfolio
  const handleRemoveStock = (stockToRemove) => {
    setPortfolio((prev) =>
      prev.filter((stock, index) =>
        !(stock.symbol === stockToRemove.symbol &&
          stock.stockBuyDate === stockToRemove.stockBuyDate &&
          index === prev.indexOf(stockToRemove)
        )
      )
    );
  };

  React.useEffect(() => {
  if (portfolio.length > 0 && currentValue > 0) {
    const newPieChartData = portfolio.map(stock => {
      const stockValue = stock.price * stock.quantity;
      return {
        name: stock.symbol,
        value: parseFloat(((stockValue / currentValue) * 100).toFixed(2)), 
        color: '#' + Math.floor(Math.random() * 16777215).toString(16)
      };
    });
    setPieChartData(newPieChartData);
  } else {
    setPieChartData([]);
  }
}, [portfolio, currentValue]);

  return (
    <div className="p-4 space-y-6">


      {/* Stock Search or Form */}
      {!selectedStock ? (
        <StockSearch onStockSelect={handleStockSelection} />
      ) : (
        <StockForm
          selectedStock={selectedStock}
          buyPrice={buyPrice}
          setBuyPrice={setBuyPrice}
          buyDate={buyDate}
          setBuyDate={setBuyDate}
          stockQuantity={stockQuantity}
          setStockQuantity={setStockQuantity}
          onAddStock={handleAddStock}
        />
      )}

      {/* Portfolio List */}
      <PortfolioList
        portfolio={portfolio}
        onRemoveStock={handleRemoveStock}
      />

      {/* Portfolio Summary - Using your existing component */}
      {portfolio.length > 0 && (
        <PortfolioSummary
          totalInvested={totalInvested}
          currentValue={currentValue}
          profitLoss={profitLoss}
          pieChartData={pieChartData}
        />
      )}


    </div>
  );
};

export default Portfolio;