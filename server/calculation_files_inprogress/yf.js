import yahooFinance from 'yahoo-finance2';

// require syntax (if your code base does not support imports)


const results = await yahooFinance.search('AAPL');
//const recommendations = await yahooFinance.recommendationsBySymbol("ISCTR.IS");

const moreTrending = await yahooFinance.trendingSymbols('US', {
  count: 10
});
console.log(moreTrending);
