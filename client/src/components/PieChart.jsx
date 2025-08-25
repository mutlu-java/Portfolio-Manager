import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const PieChartComponent = ({ 
  data = [
    
  ],
  title = "Share Distribution",
  showDataTable = true,
  showInstructions = true
}) => {
  const [showLabels, setShowLabels] = useState(true);
  const [showLegend, setShowLegend] = useState(true);

  // Custom label function
  const renderLabel = (entry) => {
    return `${entry.name}: ${entry.value}%`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-blue-600">
            Value: <span className="font-bold">{data.value}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-4xl mx-auto  p-6 rounded-lg">
     

      {/* Pie Chart */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={showLabels ? renderLabel : false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            {showLegend && (
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry) => (
                  <span style={{ color: entry.color }}>{value}</span>
                )}
              />
            )}
          </PieChart>
        </ResponsiveContainer>
      </div>

   

   
   
    </div>
  );
};

export default PieChartComponent;