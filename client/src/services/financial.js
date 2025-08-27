// volatility and expected return 
// This script fetches historical stock data, calculates expected returns and volatility
// for a given stock symbol, and logs the results to the console.
import { getHistoricalData } from "./stockApi.js";
// import yahooFinance from "yahoo-finance2";

// async function getHistoricalData(symbol) {
//   try {
//     const history = await yahooFinance.historical(symbol, {
//       period1: "2023-01-01",
//       period2: "2024-01-01",
//       interval: "1d",
//     });
//     return history;
//   } catch (error) {
//     console.error('Error fetching historical data:', error);
//     throw error;
//   }
// }

function calculateReturns(prices) {
  let returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  return returns;
}

function expectedReturn(returns) {
  return returns.reduce((a, b) => a + b, 0) / returns.length;
}

function volatility(returns) {
  const mean = expectedReturn(returns);
  const variance = returns.reduce((a, r) => a + (r - mean) ** 2, 0) / (returns.length - 1);
  return Math.sqrt(variance);
}


    
    // calculates the expected return and volatility for a given stock symbol
 export async function calculateMetrics(symbol,startDate="2020-01-01", endDate="2025-01-01") {
    try {
        const data = await getHistoricalData(symbol, startDate, endDate);
        const prices = data.map(item => item.adjClose);
        
        let returns = calculateReturns(prices);
        console.log("returns:", returns);
        let expRet = expectedReturn(returns);
        let vol = volatility(returns);
        console.log("number of data points:", prices.length);
        console.log(`Expected Daily Return for ${symbol}:`, expRet);
        console.log("Expected Annual Return:", (Math.pow(1 + expRet, 252) - 1));
        console.log("Daily Volatility:", vol);
        console.log("Annual Volatility:", vol * Math.sqrt(252));
        
        return {
            expectedReturn: expRet,
            annualReturn: (Math.pow(1 + expRet, 252) - 1),
            dailyVolatility: vol,
            annualVolatility: vol * Math.sqrt(252)
        };
    } catch (error) {
        console.error(`Error calculating metrics for ${symbol}:`, error);
        throw error;
    }
}
// Example usage 


console.log("Fetching correlation matrix for selected tickers...");

