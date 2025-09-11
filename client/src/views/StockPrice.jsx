import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Chart from '../components/Chart.jsx';
import FinancialMetrics from "../components/FinancialMetrics.jsx";
import StockSearch from "../components/StockSearch.jsx";
import { Volume } from "lucide-react";
import{getStockDetails, getHistoricalData, getStockQuote} from "../services/stockApi.js";
//import VolumeChart from "../VolumeChart";


function StockPrice() {
  const [symbol, setSymbol] = useState("ISCTR.IS"); // Default symbol can be set here
  // state to hold current price and historical data
  const [currentData, setCurrentData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [quoteData,setQuoteData] = useState();
  //
  const [detailedData, setDetailedData] = useState(null);
  const[startDate, setStartDate] = useState('2025-01-01');
  const[endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]); // today's date

 
  

  useEffect(() => {
    // Fetch current price
    fetch(`http://localhost:5000/api/stock/${symbol}`)
      .then(res => res.json())
      .then(setCurrentData);

    

    // Fetch historical data for chart
      getHistoricalData(symbol,startDate,endDate) .then(data => {
        const formattedData = data.map(item => ({
          date: new Date(item.date).toLocaleDateString(),
          price: item.close
          
        }));
        setHistoricalData(formattedData);
      })

     // for financial metrics
      getStockDetails(symbol).then(setDetailedData);
      getStockQuote(symbol).then(setQuoteData)

      
  }, [symbol,startDate,endDate]);

    const handleStockSelection = (stock) => {
    setSymbol(stock.symbol);}

    const handleComparsion1Selection = (stock) => {
    setComparsion1(stock.symbol);}


  return (
    <div>
     <StockSearch onStockSelect={handleStockSelection} />
    
      <div>
        {/* {currentData ? ( <div>
          <p>{symbol}: {currentData.regularMarketPrice} {currentData.currency}</p>
         
        </div>
        ) : (
          <p>Loading current price...</p>
        )} */}
      </div>
      
      <div style={{ marginTop: '20px' }}>
        {historicalData && quoteData ? (
          <Chart data={historicalData} quoteData={quoteData} setStartDate={setStartDate}   />
          
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
