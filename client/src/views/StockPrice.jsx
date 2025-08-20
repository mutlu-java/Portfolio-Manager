import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Chart from '../components/Chart.jsx';
import FinancialMetrics from "../components/FinancialMetrics.jsx";
import StockSearch from "../components/StockSearch.jsx";
import { Volume } from "lucide-react";
//import VolumeChart from "../VolumeChart";

function StockPrice() {
  const [symbol, setSymbol] = useState("AAPL"); // Default symbol can be set here
  const [currentData, setCurrentData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);



  useEffect(() => {
    // Fetch current price
    fetch(`http://localhost:5000/api/stock/${symbol}`)
      .then(res => res.json())
      .then(setCurrentData);

    // Fetch historical data
    fetch(`http://localhost:5000/api/history/${symbol}`)
      .then(res => res.json())
      .then(data => {
        const formattedData = data.map(item => ({
          date: new Date(item.date).toLocaleDateString(),
          price: item.close
        }));
        setHistoricalData(formattedData);
      });
  }, [symbol]);

    const handleStockSelection = (stock) => {
    setSymbol(stock.symbol);}

  return (
    <div>
     <StockSearch onStockSelect={handleStockSelection} />
    
      <div>
        {currentData ? ( <div>
          <p>{symbol}: {currentData.regularMarketPrice} {currentData.currency}</p>
         
        </div>
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
