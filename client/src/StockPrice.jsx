import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Chart from './Chart';
import FinancialMetrics from "./FinancialMetrics";
import SearchBar from './SearchBar';

function StockPrice() {
  const [symbol, setSymbol] = useState("AAPL"); // Default symbol can be set here
  const [currentData, setCurrentData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);

  useEffect(() => {
    // Fetch current price
    fetch(`http://localhost:5000/stock/${symbol}`)
      .then(res => res.json())
      .then(setCurrentData);

    // Fetch historical data
    fetch(`http://localhost:5000/history/${symbol}`)
      .then(res => res.json())
      .then(data => {
        const formattedData = data.map(item => ({
          date: new Date(item.date).toLocaleDateString(),
          price: item.close
        }));
        setHistoricalData(formattedData);
      });
  }, [symbol]);

  return (
    <div>
     <SearchBar onSearch={setSymbol} />
      <div>
        {currentData ? (
          <p>{symbol}: {currentData.regularMarketPrice} {currentData.currency}</p>
        ) : (
          <p>Loading current price...</p>
        )}
      </div>
      
      <div style={{ marginTop: '20px' }}>
        {historicalData ? (
          <Chart data={historicalData} />
        ) : (
          <p>Loading historical data...</p>
        )}
      </div>

       {currentData ? (
          <FinancialMetrics data={currentData} />
        ) : (
          <p>Loading Financial Metrics</p>
        )}
      

    </div>
  );
}

export default StockPrice;
