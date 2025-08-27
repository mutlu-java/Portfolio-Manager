// Navbar.js
import { Link, useNavigate,useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  const handlePortfolioClick = () => {
    // Programmatic navigation
    navigate('/dashboard');
  };

  return (
   <div className="bg-white shadow-sm mb-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex space-x-4 py-3">
          <a
            href="/dashboard"
            className={`px-4 py-2 rounded-lg ${
              currentPath === '/dashboard'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
           Dashboard
          </a>
          <a
            href="/portfolio"
            className={`px-4 py-2 rounded-lg ${
              currentPath === '/portfolio'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Portfolios
          </a>
          
          <a
            href="/efficient-frontier"
            className={`px-4 py-2 rounded-lg ${
              currentPath === '/efficient-frontier'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Efficient Frontier
          </a>

        </div>
      </div>
    </div>
  );
}

export default Navbar;