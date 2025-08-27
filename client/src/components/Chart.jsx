import react from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
function Chart({ data, regressionLine }) {
  return (<>
 
  
   <LineChart
      width={800}
      height={400}
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="price"
        stroke="#8884d8"
        name="Stock Price"
        dot={false}
        activeDot={{ r: 6, fill: '#3b82f6', stroke: '#ffffff', strokeWidth: 2 }}
      />
      {regressionLine && (
        <Line
          type="monotone"
          dataKey="regression"
          stroke="#82ca9d"
          name="Regression Line"
          dot={false}
          activeDot={{ r: 6, fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }}
        />
      )}
      
    </LineChart>
  </>
   
  );
}
export default Chart;