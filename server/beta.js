import yahooFinance from "yahoo-finance2";

// Example list: you can replace this with S&P 500, BIST 100, etc.
const tickers = [
  "AKBNK.IS","AKCNS.IS","AKSA.IS","AKSEN.IS","ALARK.IS","ALKIM.IS","ALNTF.IS","ANACM.IS",
  "ARCLK.IS","ASELS.IS","AYGAZ.IS","BAGFS.IS","BIMAS.IS","BRISA.IS","CIMSA.IS","DOAS.IS",
  "DOHOL.IS","EKGYO.IS","ENKAI.IS","EREGL.IS","FORD.IS","GARAN.IS","GUBRF.IS","HALKB.IS",
  "HEKTS.IS","IPEKE.IS","ISCTR.IS","ISYAT.IS","KARSN.IS","KCHOL.IS","KERVN.IS","KORDS.IS",
  "KOZAA.IS","LOGO.IS","MGROS.IS","NETAS.IS","ODAS.IS","OTKAR.IS","OYKAS.IS","PETKM.IS",
  "PGSUS.IS","SASA.IS","SISE.IS","SOKM.IS","TCELL.IS","TKFEN.IS","TOASO.IS","TUPRS.IS",
  "TTKOM.IS","TSKB.IS","TTRAK.IS","ULKER.IS","VAKBN.IS","VESTL.IS","YKBNK.IS","ZOREN.IS"
];


// Function to filter stocks by beta
async function filterByBeta(maxBeta) {
  const results = [];

  for (const symbol of tickers) {
    try {
      const data = await yahooFinance.quoteSummary(symbol, {
        modules: ["summaryDetail"],
      });

      const beta = data.summaryDetail?.beta;

      if (beta !== undefined && beta < maxBeta) {
        results.push({ symbol, beta });
      }

    } catch (err) {
      console.error(`Error fetching ${symbol}: ${err.message}`);
    }
  }

  return results;
}

// Example usage
(async () => {
  const maxBeta = 1.0; // set your threshold here
  const filtered = await filterByBeta(maxBeta);

  console.log(`Stocks with beta < ${maxBeta}:`);
  console.table(filtered);
})();
