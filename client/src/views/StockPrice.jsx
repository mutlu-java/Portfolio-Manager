import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Chart from '../components/Chart.jsx';
import FinancialMetrics from "../components/FinancialMetrics.jsx";
import StockSearch from "../components/StockSearch.jsx";
import { Volume } from "lucide-react";
import{getStockDetails, getHistoricalData} from "../services/stockApi.js";
//import VolumeChart from "../VolumeChart";

function StockPrice() {
  const [symbol, setSymbol] = useState("AAPL"); // Default symbol can be set here
  // state to hold current price and historical data
  const [currentData, setCurrentData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  //
  const [detailedData, setDetailedData] = useState(null);
  const[startDate, setStartDate] = useState('2025-01-01');
  const[endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]); // today's date



  useEffect(() => {
    // Fetch current price
    fetch(`http://localhost:5000/api/stock/${symbol}`)
      .then(res => res.json())
      .then(setCurrentData);

    // Fetch historical data

      getHistoricalData(symbol,startDate,endDate) .then(data => {
        const formattedData = data.map(item => ({
          date: new Date(item.date).toLocaleDateString(),
          price: item.close
        }));
        setHistoricalData(formattedData);
      })

      getStockDetails(symbol).then(setDetailedData);

      
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


       {detailedData ? (
          <FinancialMetrics data={detailedData} />
        ) : (
          <p>Loading Financial Metrics</p>
        )}


    </div>
  );
}

export default StockPrice;
