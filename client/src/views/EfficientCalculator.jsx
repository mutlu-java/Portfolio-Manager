import React, { useState, useMemo, useEffect, use } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateMetrics } from '../services/financial';

const EfficientFrontierCalculator = () => {

     useEffect(() => {
     const symbols = [
       "AAPL", "MSFT", "GOOGL", "AMZN",  "TSLA"
     ];
   
     const fetchAllMetrics = async () => {
        const today = new Date().toISOString().split("T")[0];
       try {
         const promises = symbols.map(symbol => 
           calculateMetrics(symbol, "2024-01-01", today)
         );
         
         const allData = await Promise.all(promises);
         const formattedAssets = allData.map(data => ({
           name: data.symbol,
           returns: data.returns
         }));
         console.log("Formatted Assets:", formattedAssets);

         setAssets(formattedAssets);
        
         console.log("Fetched asset metrics:", );
       } catch (error) {
         console.error("Error fetching metrics:", error);
       }
     };
   
     fetchAllMetrics();
   }, []);



  // Örnek varlık verileri (gerçek uygulamada API'den gelecek)
  const [assets, setAssets] = useState([
   
  ]);

  const [riskFreeRate] = useState(0.2); // %1 risksiz faiz
  const [numPortfolios] = useState(1000); // Oluşturulacak portföy sayısı

  // Varlık istatistiklerini hesapla
  const assetStats = useMemo(() => {
    return assets.map(asset => {
      const returns = asset.returns;
      const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
      const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / (returns.length - 1);
      const stdDev = Math.sqrt(variance);
      
      return {
        name: asset.name,
        expectedReturn: avgReturn,
        standardDeviation: stdDev,
        returns: returns
      };
    });
  }, [assets]);

  // Kovaryans matrisini hesapla
  const covarianceMatrix = useMemo(() => {
    const n = assets.length;
    const matrix = Array(n).fill().map(() => Array(n).fill(0));
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const returnsI = assets[i].returns;
        const returnsJ = assets[j].returns;
        const avgI = assetStats[i].expectedReturn;
        const avgJ = assetStats[j].expectedReturn;
        
        let covariance = 0;
        for (let k = 0; k < returnsI.length; k++) {
          covariance += (returnsI[k] - avgI) * (returnsJ[k] - avgJ);
        }
        matrix[i][j] = covariance / (returnsI.length - 1);
      }
    }
    return matrix;
  }, [assets, assetStats]);

  // Random portföy ağırlıkları oluştur
  const generateRandomWeights = (numAssets) => {
    const weights = Array(numAssets).fill().map(() => Math.random());
    const sum = weights.reduce((a, b) => a + b, 0);
    return weights.map(w => w / sum);
  };

  // Portföy getiri ve riskini hesapla
  const calculatePortfolioMetrics = (weights) => {
    const expectedReturn = weights.reduce((sum, w, i) => sum + w * assetStats[i].expectedReturn, 0);
    
    let portfolioVariance = 0;
    for (let i = 0; i < weights.length; i++) {
      for (let j = 0; j < weights.length; j++) {
        portfolioVariance += weights[i] * weights[j] * covarianceMatrix[i][j];
      }
    }
    
    const portfolioRisk = Math.sqrt(portfolioVariance);
    const sharpeRatio = (expectedReturn - riskFreeRate) / portfolioRisk;
    
    return { expectedReturn, portfolioRisk, sharpeRatio };
  };

  // Monte Carlo simülasyonu ile portföyler oluştur
  const portfolios = useMemo(() => {
    const results = [];
    
    for (let i = 0; i < numPortfolios; i++) {
      const weights = generateRandomWeights(assets.length);
      const metrics = calculatePortfolioMetrics(weights);
      
      results.push({
        risk: metrics.portfolioRisk * 100, // Yüzde olarak
        return: metrics.expectedReturn * 100, // Yüzde olarak
        sharpe: metrics.sharpeRatio,
        weights: weights
      });
    }
    
    return results;
  }, [assetStats, covarianceMatrix, numPortfolios]);

  // En iyi Sharpe oranına sahip portföy (optimal portföy)
  const optimalPortfolio = useMemo(() => {
    return portfolios.reduce((best, current) => 
      current.sharpe > best.sharpe ? current : best
    );
  }, [portfolios]);

  // Minimum varyans portföyü
  const minimumVariancePortfolio = useMemo(() => {
    return portfolios.reduce((best, current) => 
      current.risk < best.risk ? current : best
    );
  }, [portfolios]);

  // Efficient frontier'ı belirle
  const efficientFrontier = useMemo(() => {
    const returnLevels = [];
    const minReturn = Math.min(...portfolios.map(p => p.return));
    const maxReturn = Math.max(...portfolios.map(p => p.return));
    
    // 50 farklı getiri seviyesi için efficient portföyleri bul
    for (let i = 0; i < 50; i++) {
      const targetReturn = minReturn + (maxReturn - minReturn) * i / 49;
      
      // Bu getiri seviyesindeki en düşük riskli portföyü bul
      const candidatePortfolios = portfolios.filter(p => 
        Math.abs(p.return - targetReturn) < 0.5
      );
      
      if (candidatePortfolios.length > 0) {
        const efficientPortfolio = candidatePortfolios.reduce((best, current) => 
          current.risk < best.risk ? current : best
        );
        returnLevels.push(efficientPortfolio);
      }
    }
    
    return returnLevels.sort((a, b) => a.risk - b.risk);
  }, [portfolios]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold">Portföy Bilgileri</p>
          <p className="text-blue-600">Risk: {data.risk?.toFixed(2)}%</p>
          <p className="text-green-600">Getiri: {data.return?.toFixed(2)}%</p>
          <p className="text-purple-600">Sharpe: {data.sharpe?.toFixed(3)}</p>
          {data.weights && (
            <div className="mt-2">
              <p className="text-sm font-medium">Ağırlıklar:</p>
              {data.weights.map((weight, idx) => (
                <p key={idx} className="text-xs">
                  {assetStats[idx]?.name}: {(weight * 100).toFixed(1)}%
                </p>
              ))}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Efficient Frontier Analizi</h1>
        <p className="text-gray-600">Risk-getiri optimizasyonu ve portföy seçimi</p>
      </div>

      {/* Varlık İstatistikleri */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {assetStats.map((asset, idx) => (
          <div key={idx} className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">{asset.name}</h3>
            <p className="text-sm text-gray-600">
              Ortalama Getiri: <span className="text-green-600 font-medium">
                {(asset.expectedReturn * 100).toFixed(2)}%
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Risk (Std Dev): <span className="text-red-600 font-medium">
                {(asset.standardDeviation * 100).toFixed(2)}%
              </span>
            </p>
          </div>
        ))}
      </div>

      {/* Efficient Frontier Grafiği */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Risk-Getiri Diyagramı</h2>
        <ResponsiveContainer width="100%" height={500}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="risk" 
              name="Risk (%)" 
              domain={['dataMin - 1', 'dataMax + 1']}
              label={{ value: 'Risk (%)', position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              type="number" 
              dataKey="return" 
              name="Getiri (%)" 
              domain={['dataMin - 1', 'dataMax + 1']}
              label={{ value: 'Getiri (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Tüm portföyler */}
             <Scatter
              name="Random Portföyler"
              data={portfolios}
              fill="#e0e0e0"
              fillOpacity={0.6}
            /> 
            
            {/* Efficient Frontier */}
            <Scatter
              name="Efficient Frontier"
              data={efficientFrontier}
              fill="#2563eb"
              fillOpacity={0.8}
            />
            
            {/* Optimal Portföy */}
            <Scatter
              name="Optimal Portföy (Max Sharpe)"
              data={[optimalPortfolio]}
              fill="#dc2626"
              fillOpacity={1}
            />
            
            {/* Minimum Varyans Portföyü */}
            <Scatter
              name="Min Varyans Portföyü"
              data={[minimumVariancePortfolio]}
              fill="#16a34a"
              fillOpacity={1}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Önerilen Portföyler */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-3">
            🎯 Optimal Portföy (Maksimum Sharpe)
          </h3>
          <div className="space-y-2">
            <p><span className="font-medium">Risk:</span> {optimalPortfolio.risk.toFixed(2)}%</p>
            <p><span className="font-medium">Getiri:</span> {optimalPortfolio.return.toFixed(2)}%</p>
            <p><span className="font-medium">Sharpe Oranı:</span> {optimalPortfolio.sharpe.toFixed(3)}</p>
            <div className="mt-3">
              <p className="font-medium mb-2">Varlık Dağılımı:</p>
              {optimalPortfolio.weights.map((weight, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{assetStats[idx]?.name}:</span>
                  <span className="font-medium">{(weight * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-3">
            🛡️ Minimum Risk Portföyü
          </h3>
          <div className="space-y-2">
            <p><span className="font-medium">Risk:</span> {minimumVariancePortfolio.risk.toFixed(2)}%</p>
            <p><span className="font-medium">Getiri:</span> {minimumVariancePortfolio.return.toFixed(2)}%</p>
            <p><span className="font-medium">Sharpe Oranı:</span> {minimumVariancePortfolio.sharpe.toFixed(3)}</p>
            <div className="mt-3">
              <p className="font-medium mb-2">Varlık Dağılımı:</p>
              {minimumVariancePortfolio.weights.map((weight, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{assetStats[idx]?.name}:</span>
                  <span className="font-medium">{(weight * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Açıklamalar */}
      <div className="mt-6 bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">📊 Grafik Açıklaması</h3>
        <ul className="space-y-2 text-sm text-blue-700">
          <li><strong>Gri Noktalar:</strong> Monte Carlo simülasyonu ile oluşturulan rastgele portföyler</li>
          <li><strong>Mavi Çizgi:</strong> Efficient Frontier - Her risk seviyesi için maksimum getiriyi veren portföyler</li>
          <li><strong>Kırmızı Nokta:</strong> Maksimum Sharpe oranına sahip optimal portföy</li>
          <li><strong>Yeşil Nokta:</strong> Minimum riski olan portföy</li>
        </ul>
      </div>
    </div>
  );
};

export default EfficientFrontierCalculator;