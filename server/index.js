const yahooFinance = require('yahoo-finance2').default;
const fs = require('fs');

class ImprovedEfficientFrontier {
    constructor(symbols) {
        this.symbols = symbols;
        this.returns = [];
        this.covariance = [];
        this.expectedReturns = [];
        this.invCovariance = [];
    }

    // Same data fetching as before
    async fetchData(period = '2y') {
        console.log('Fetching historical data...');
        const allData = {};
        
        for (const symbol of this.symbols) {
            try {
                console.log(`Fetching data for ${symbol}...`);
                const result = await yahooFinance.historical(symbol, {
                    period1: this.getDateMonthsAgo(24),
                    period2: new Date(),
                    interval: '1d'
                });
                allData[symbol] = result.map(day => day.adjClose);
            } catch (error) {
                console.error(`Error fetching data for ${symbol}:`, error.message);
                throw error;
            }
        }
        
        this.calculateReturns(allData);
        console.log('Data fetching completed.');
        return allData;
    }

    getDateMonthsAgo(months) {
        const date = new Date();
        date.setMonth(date.getMonth() - months);
        return date;
    }

    calculateReturns(data) {
        const minLength = Math.min(...Object.values(data).map(prices => prices.length));
        
        this.returns = [];
        for (let i = 1; i < minLength; i++) {
            const dayReturns = {};
            for (const symbol of this.symbols) {
                const prices = data[symbol];
                dayReturns[symbol] = (prices[i] - prices[i-1]) / prices[i-1];
            }
            this.returns.push(dayReturns);
        }
        
        this.expectedReturns = this.symbols.map(symbol => {
            const avgReturn = this.returns.reduce((sum, day) => sum + day[symbol], 0) / this.returns.length;
            return avgReturn * 252;
        });
        
        this.calculateCovarianceMatrix();
        this.calculateInverseCovariance();
    }

    calculateCovarianceMatrix() {
        const n = this.symbols.length;
        this.covariance = Array(n).fill().map(() => Array(n).fill(0));
        
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                let covar = 0;
                const meanI = this.expectedReturns[i] / 252;
                const meanJ = this.expectedReturns[j] / 252;
                
                for (const dayReturn of this.returns) {
                    covar += (dayReturn[this.symbols[i]] - meanI) * (dayReturn[this.symbols[j]] - meanJ);
                }
                
                this.covariance[i][j] = (covar / (this.returns.length - 1)) * 252;
            }
        }
    }

    // Calculate inverse of covariance matrix using Gauss-Jordan elimination
    calculateInverseCovariance() {
        const n = this.covariance.length;
        
        // Create augmented matrix [A|I]
        const augmented = [];
        for (let i = 0; i < n; i++) {
            augmented[i] = [...this.covariance[i]];
            for (let j = 0; j < n; j++) {
                augmented[i][n + j] = (i === j) ? 1 : 0;
            }
        }

        // Gauss-Jordan elimination
        for (let i = 0; i < n; i++) {
            // Find pivot
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
                    maxRow = k;
                }
            }
            
            // Swap rows
            [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
            
            // Make diagonal element 1
            const pivot = augmented[i][i];
            for (let j = 0; j < 2 * n; j++) {
                augmented[i][j] /= pivot;
            }
            
            // Make other elements in column 0
            for (let k = 0; k < n; k++) {
                if (k !== i) {
                    const factor = augmented[k][i];
                    for (let j = 0; j < 2 * n; j++) {
                        augmented[k][j] -= factor * augmented[i][j];
                    }
                }
            }
        }

        // Extract inverse matrix
        this.invCovariance = [];
        for (let i = 0; i < n; i++) {
            this.invCovariance[i] = augmented[i].slice(n, 2 * n);
        }
    }

    // Calculate minimum variance portfolio using analytical solution
    calculateMinimumVariancePortfolio() {
        const n = this.symbols.length;
        const ones = Array(n).fill(1);
        
        // Calculate: w = (Σ^-1 * 1) / (1^T * Σ^-1 * 1)
        const invCovTimesOnes = this.matrixVectorMultiply(this.invCovariance, ones);
        const denominator = this.vectorDotProduct(ones, invCovTimesOnes);
        
        const weights = invCovTimesOnes.map(w => w / denominator);
        return this.calculatePortfolioMetrics(weights);
    }

    // Calculate optimal portfolio for given target return using analytical solution
    calculateOptimalPortfolioForReturn(targetReturn) {
        const n = this.symbols.length;
        const ones = Array(n).fill(1);
        const mu = this.expectedReturns;
        
        // Calculate A, B, C coefficients
        const invSigmaOnes = this.matrixVectorMultiply(this.invCovariance, ones);
        const invSigmaMu = this.matrixVectorMultiply(this.invCovariance, mu);
        
        const A = this.vectorDotProduct(ones, invSigmaOnes);
        const B = this.vectorDotProduct(ones, invSigmaMu);
        const C = this.vectorDotProduct(mu, invSigmaMu);
        
        const discriminant = C * A - B * B;
        
        if (discriminant <= 0) {
            console.warn('Invalid discriminant in portfolio optimization');
            return null;
        }
        
        // Calculate optimal weights: w = g + h*μ_p
        const g_coef = (C - B * targetReturn) / discriminant;
        const h_coef = (A * targetReturn - B) / discriminant;
        
        const weights = [];
        for (let i = 0; i < n; i++) {
            weights[i] = g_coef * invSigmaOnes[i] + h_coef * invSigmaMu[i];
        }
        
        return this.calculatePortfolioMetrics(weights);
    }

    // Generate mathematically precise efficient frontier
    generateEfficientFrontier(numPoints = 100) {
        console.log(`Generating analytical efficient frontier with ${numPoints} points...`);
        
        // Calculate minimum variance portfolio
        const minVarPortfolio = this.calculateMinimumVariancePortfolio();
        
        // Find maximum return portfolio (100% in highest return stock)
        const maxReturnIndex = this.expectedReturns.indexOf(Math.max(...this.expectedReturns));
        const maxReturnWeights = Array(this.symbols.length).fill(0);
        maxReturnWeights[maxReturnIndex] = 1;
        const maxReturnPortfolio = this.calculatePortfolioMetrics(maxReturnWeights);
        
        // Generate points along the efficient frontier
        const frontier = [];
        const minReturn = minVarPortfolio.expectedReturn;
        const maxReturn = Math.min(maxReturnPortfolio.expectedReturn, minReturn * 2.5); // Cap max return
        
        for (let i = 0; i < numPoints; i++) {
            const targetReturn = minReturn + (maxReturn - minReturn) * (i / (numPoints - 1));
            const portfolio = this.calculateOptimalPortfolioForReturn(targetReturn);
            
            if (portfolio && portfolio.weights.every(w => w >= -0.01)) { // Allow tiny negative weights due to numerical errors
                // Ensure no negative weights
                portfolio.weights = portfolio.weights.map(w => Math.max(0, w));
                const sum = portfolio.weights.reduce((a, b) => a + b, 0);
                portfolio.weights = portfolio.weights.map(w => w / sum);
                
                // Recalculate metrics with corrected weights
                const correctedPortfolio = this.calculatePortfolioMetrics(portfolio.weights);
                frontier.push(correctedPortfolio);
            }
        }
        
        // Find best Sharpe ratio portfolio
        const bestSharpe = frontier.reduce((best, current) => 
            current.sharpeRatio > best.sharpeRatio ? current : best
        );
        
        return {
            efficientFrontier: frontier,
            minVariance: minVarPortfolio,
            bestSharpe: bestSharpe,
            maxReturn: maxReturnPortfolio
        };
    }

    // Utility functions for matrix operations
    matrixVectorMultiply(matrix, vector) {
        return matrix.map(row => 
            row.reduce((sum, val, idx) => sum + val * vector[idx], 0)
        );
    }

    vectorDotProduct(vec1, vec2) {
        return vec1.reduce((sum, val, idx) => sum + val * vec2[idx], 0);
    }

    calculatePortfolioMetrics(weights) {
        const expectedReturn = weights.reduce((sum, weight, i) => 
            sum + weight * this.expectedReturns[i], 0);
        
        let variance = 0;
        for (let i = 0; i < weights.length; i++) {
            for (let j = 0; j < weights.length; j++) {
                variance += weights[i] * weights[j] * this.covariance[i][j];
            }
        }
        
        const volatility = Math.sqrt(variance);
        const sharpeRatio = expectedReturn / volatility;
        
        return {
            expectedReturn,
            volatility,
            sharpeRatio,
            weights: weights.slice()
        };
    }

    exportResults(results, filename = 'improved_efficient_frontier') {
        fs.writeFileSync(`${filename}.json`, JSON.stringify({
            symbols: this.symbols,
            expectedReturns: this.expectedReturns,
            covariance: this.covariance,
            ...results
        }, null, 2));
        
        const csvHeader = 'Volatility,Expected_Return,Sharpe_Ratio,' + 
            this.symbols.map(s => `Weight_${s}`).join(',') + '\n';
        
        const csvData = results.efficientFrontier.map(p => 
            `${p.volatility.toFixed(6)},${p.expectedReturn.toFixed(6)},${p.sharpeRatio.toFixed(6)},` +
            p.weights.map(w => w.toFixed(6)).join(',')
        ).join('\n');
        
        fs.writeFileSync(`${filename}.csv`, csvHeader + csvData);
        console.log(`Results exported to ${filename}.json and ${filename}.csv`);
    }

    printSummary(results) {
        console.log('\n=== IMPROVED EFFICIENT FRONTIER ANALYSIS ===\n');
        
        console.log('Stocks:', this.symbols.join(', '));
        console.log('\nExpected Annual Returns:');
        this.symbols.forEach((symbol, i) => {
            console.log(`${symbol}: ${(this.expectedReturns[i] * 100).toFixed(2)}%`);
        });
        
        console.log('\n=== MINIMUM VARIANCE PORTFOLIO ===');
        const minVar = results.minVariance;
        console.log(`Expected Return: ${(minVar.expectedReturn * 100).toFixed(2)}%`);
        console.log(`Volatility: ${(minVar.volatility * 100).toFixed(2)}%`);
        console.log(`Sharpe Ratio: ${minVar.sharpeRatio.toFixed(4)}`);
        console.log('Weights:');
        this.symbols.forEach((symbol, i) => {
            console.log(`  ${symbol}: ${(minVar.weights[i] * 100).toFixed(2)}%`);
        });
        
        console.log('\n=== OPTIMAL PORTFOLIO (Max Sharpe Ratio) ===');
        const best = results.bestSharpe;
        console.log(`Expected Return: ${(best.expectedReturn * 100).toFixed(2)}%`);
        console.log(`Volatility: ${(best.volatility * 100).toFixed(2)}%`);
        console.log(`Sharpe Ratio: ${best.sharpeRatio.toFixed(4)}`);
        console.log('Weights:');
        this.symbols.forEach((symbol, i) => {
            console.log(`  ${symbol}: ${(best.weights[i] * 100).toFixed(2)}%`);
        });
        
        const frontierStats = results.efficientFrontier;
        console.log(`\nEfficient frontier contains ${frontierStats.length} portfolios`);
        console.log(`Risk range: ${(Math.min(...frontierStats.map(p => p.volatility)) * 100).toFixed(2)}% - ${(Math.max(...frontierStats.map(p => p.volatility)) * 100).toFixed(2)}%`);
        console.log(`Return range: ${(Math.min(...frontierStats.map(p => p.expectedReturn)) * 100).toFixed(2)}% - ${(Math.max(...frontierStats.map(p => p.expectedReturn)) * 100).toFixed(2)}%`);
    }
}

async function main() {
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];
    
    try {
        console.log('Starting Improved Efficient Frontier Analysis...');
        
        const ef = new ImprovedEfficientFrontier(symbols);
        await ef.fetchData();
        
        const results = ef.generateEfficientFrontier(100);
        ef.printSummary(results);
        ef.exportResults(results, 'improved_frontier_analysis');
        
        console.log('\nImproved analysis completed! This should give you a smooth curve.');
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

if (require.main === module) {
    main();
}

module.exports = ImprovedEfficientFrontier;