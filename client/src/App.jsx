import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import StockPrice from './StockPrice.jsx'
import Portfolio from './Portfolio.jsx'
import Navbar from './Navbar.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
        </Routes>
      </div>
    </Router>
  )
}

export default App
