const fs = require('fs');
const plotly = require('plotly')('your-username', 'your-api-key'); // Replace with your Plotly credentials

// Alternative: Generate HTML plot without Plotly account
function generateHTMLPlot(data, filename = 'efficient_frontier_plot.html') {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Efficient Frontier Plot</title>
    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            background-color: #f5f5f5;
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white; 
            padding: 20px; 
            border-radius: 8px; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 { 
            color: #333; 
            text-align: center; 
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        .stat-card {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #007bff;
        }
        .stat-title {
            font-weight: bold;
            color: #007bff;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Portfolio Efficient Frontier Analysis</h1>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-title">Analyzed Stocks</div>
                <div>${data.symbols.join(', ')}</div>
            </div>
            <div class="stat-card">
                <div class="stat-title">Optimal Portfolio Return</div>
                <div>${(data.bestSharpe.expectedReturn * 100).toFixed(2)}% annually</div>
            </div>
            <div class="stat-card">
                <div class="stat-title">Optimal Portfolio Risk</div>
                <div>${(data.bestSharpe.volatility * 100).toFixed(2)}% volatility</div>
            </div>
            <div class="stat-card">
                <div class="stat-title">Sharpe Ratio</div>
                <div>${data.bestSharpe.sharpeRatio.toFixed(4)}</div>
            </div>
        </div>
        
        <div id="frontier-plot" style="width:100%;height:600px;"></div>
        <div id="weights-plot" style="width:100%;height:400px;margin-top:20px;"></div>
        
        <script>
            // Efficient Frontier Data
            const frontierData = ${JSON.stringify(data.efficientFrontier)};
            const bestPortfolio = ${JSON.stringify(data.bestSharpe)};
            const symbols = ${JSON.stringify(data.symbols)};
            
            // Create efficient frontier plot
            const frontierTrace = {
                x: frontierData.map(p => p.volatility * 100),
                y: frontierData.map(p => p.expectedReturn * 100),
                mode: 'lines+markers',
                type: 'scatter',
                name: 'Efficient Frontier',
                line: { color: '#007bff', width: 3 },
                marker: { size: 4 }
            };
            
            const optimalTrace = {
                x: [bestPortfolio.volatility * 100],
                y: [bestPortfolio.expectedReturn * 100],
                mode: 'markers',
                type: 'scatter',
                name: 'Optimal Portfolio',
                marker: {
                    size: 15,
                    color: '#dc3545',
                    symbol: 'star'
                }
            };
            
            const frontierLayout = {
                title: 'Efficient Frontier - Risk vs Return',
                xaxis: {
                    title: 'Risk (Volatility %)',
                    showgrid: true,
                    gridcolor: '#e0e0e0'
                },
                yaxis: {
                    title: 'Expected Return (%)',
                    showgrid: true,
                    gridcolor: '#e0e0e0'
                },
                plot_bgcolor: '#ffffff',
                paper_bgcolor: '#ffffff',
                font: { family: 'Arial, sans-serif' },
                legend: { x: 0, y: 1 }
            };
            
            Plotly.newPlot('frontier-plot', [frontierTrace, optimalTrace], frontierLayout, {responsive: true});
            
            // Create optimal portfolio weights pie chart
            const weightsTrace = {
                values: bestPortfolio.weights.map(w => w * 100),
                labels: symbols,
                type: 'pie',
                textinfo: 'label+percent',
                textposition: 'outside',
                marker: {
                    colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8']
                }
            };
            
            const weightsLayout = {
                title: 'Optimal Portfolio Allocation',
                font: { family: 'Arial, sans-serif' },
                showlegend: true,
                paper_bgcolor: '#ffffff'
            };
            
            Plotly.newPlot('weights-plot', [weightsTrace], weightsLayout, {responsive: true});
        </script>
    </div>
</body>
</html>`;
    
    fs.writeFileSync(filename, html);
    console.log(`Interactive plot saved as ${filename}`);
    console.log('Open this file in your web browser to view the visualization.');
}

// Read the analysis results
function plotResults() {
    try {
        const data = JSON.parse(fs.readFileSync('improved_frontier_analysis.json', 'utf8'));
        
        console.log('Generating visualization...');
        generateHTMLPlot(data);
        
        // Also generate a simple console visualization
        console.log('\n=== EFFICIENT FRONTIER SUMMARY ===');
        console.log('Risk Range:', 
            `${(Math.min(...data.efficientFrontier.map(p => p.volatility)) * 100).toFixed(2)}% - ` +
            `${(Math.max(...data.efficientFrontier.map(p => p.volatility)) * 100).toFixed(2)}%`
        );
        console.log('Return Range:', 
            `${(Math.min(...data.efficientFrontier.map(p => p.expectedReturn)) * 100).toFixed(2)}% - ` +
            `${(Math.max(...data.efficientFrontier.map(p => p.expectedReturn)) * 100).toFixed(2)}%`
        );
        
        console.log('\n=== TOP 5 EFFICIENT PORTFOLIOS ===');
        const topPortfolios = data.efficientFrontier
            .sort((a, b) => b.sharpeRatio - a.sharpeRatio)
            .slice(0, 5);
            
        topPortfolios.forEach((portfolio, i) => {
            console.log(`${i + 1}. Return: ${(portfolio.expectedReturn * 100).toFixed(2)}%, ` +
                       `Risk: ${(portfolio.volatility * 100).toFixed(2)}%, ` +
                       `Sharpe: ${portfolio.sharpeRatio.toFixed(4)}`);
        });
        
    } catch (error) {
        console.error('Error reading analysis results:', error.message);
        console.log('Please run the main analysis first: npm run analyze');
    }
}

if (require.main === module) {
    plotResults();
}

module.exports = { generateHTMLPlot, plotResults };