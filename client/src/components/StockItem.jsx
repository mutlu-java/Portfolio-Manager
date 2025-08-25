import React from 'react';
import { Trash2 } from 'lucide-react';
const StockItem = ({ stock, onRemove }) => {
  const profitLoss = stock.price - stock.stockBuyPrice;
  const totalProfitLoss = profitLoss * stock.quantity;
  const profitLossPercentage = ((profitLoss / stock.stockBuyPrice) * 100);
  const totalValue = stock.price * stock.quantity;
  
  const isProfit = profitLoss >= 0;

  return (
    <div className="grid grid-cols-6 gap-4 px-4  py-4 border-b border-gray-100 hover:bg-gray-50">
      {/* Symbol and Name */}
      <div className="flex items-center">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 text-xs font-semibold bg-blue-600 text-white rounded">
              {stock.symbol}
            </span>
          </div>
          <span className="text-sm text-gray-600 mt-1">{stock.name}</span>
        </div>
      </div>

      {/* Current Price */}
      <div className="text-right">
        <div className="text-sm font-medium">₺{stock.price}</div>
        <div className="text-xs text-gray-500">
          Buy: ₺{stock.stockBuyPrice}
        </div>
      </div>

      {/* Quantity */}
      <div className="text-right">
        <div className="text-sm">{stock.quantity}</div>
        <div className="text-xs text-gray-500">shares</div>
      </div>

      {/* Profit/Loss */}
      <div className="text-right">
        <div className={`text-sm ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
          {isProfit ? '↗' : '↘'}
          ₺{Math.abs(totalProfitLoss).toFixed(2)}
        </div>
        <div className={`text-xs ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
          {isProfit ? '↗' : '↘'}
          {profitLossPercentage.toFixed(2)}%
        </div>
      </div>

      {/* Total Value */}
      <div className="text-right">
        <div className="text-sm font-medium">₺{totalValue.toFixed(2)}</div>
        <div className="text-xs text-gray-500">total value</div>
      </div>

      {/* Actions */}
      <div className="text-right flex gap-2 justify-end">
        {onRemove && (
          <button 
            onClick={() => onRemove(stock)}
            className="text-red-400 hover:text-red-600 p-1"
            title="Remove stock"
          >
            <Trash2 width="16" height="16" />
          </button>
        )}
       
      </div>
    </div>
  );
};

export default StockItem;
