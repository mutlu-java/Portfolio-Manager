import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import StockPrice from './views/StockPrice.jsx'
import Portfolio from './views/Portfolio.jsx'
import Navbar from './Navbar.jsx'
import EfficientFrontier from './views/EfficientFrontier.jsx'
import EfficientFrontierCalculator from './views/EfficientCalculator.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PortfolioOptimizer from './views/PortfolioOptimizer.jsx'
function App() {
  const [count, setCount] = useState(0)

  return (
   <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<StockPrice />} />
          <Route path="/dashboard" element={<StockPrice  />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/efficient-frontier" element={<EfficientFrontier />} />
          <Route path ="/test" element = {<PortfolioOptimizer />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
