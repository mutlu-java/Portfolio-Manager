import react from 'react';
import { useState } from 'react';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

import { TrendingUp, Plus, Star, BarChart3, Settings } from 'lucide-react';
// data is th historical data for the main stock
  function Chart({ data, quoteData, dataSymbol,setStartDate,endDate,compareData1,compareData1Symbol,  }) {


 const [activeTimeframe, setActiveTimeframe] = useState('1D');
  const [keyEvents, setKeyEvents] = useState(true);
  const [chartType, setChartType] = useState('Mountain');

  const timeframes = ['1D', '5D', '1M', '6M', 'YTD', '1Y', '5Y', 'All'];

  return (<>
   <div className="bg-white min-w-3xl max-w-4xl ">
        <div className="border-b border-gray-200 px-6 py-4">
        <div className="text-sm text-left text-gray-600 mb-2" >
          {quoteData.exchange} - {quoteData.quoteSourceName} • {quoteData.currency}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {quoteData.shortName} ({quoteData.symbol})
            </h1>
            <button className="flex items-center space-x-2 px-3 py-1 border border-gray-300 rounded-full text-sm hover:bg-gray-50">
              <Star className="w-4 h-4" />
              <span>Follow</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200">
              <Plus className="w-4 h-4" />
              <span>Add holdings</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2 text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Get top stock picks</span>
          </div>
        </div>

        {/* Price Display */}
        <div className="mt-4">
          <div className="flex items-baseline space-x-3">
            <span className="text-4xl font-light text-gray-900">{quoteData.price}</span>
            <span className="text-lg text-green-600">{quoteData.change}</span> <span>{quoteData.currency}</span>
            <span className="text-lg text-green-600">({quoteData.changePercent +" %"} )</span>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            At close: 6:10:00 PM GMT+3
          </div>
        </div>
      </div>

      {/* Chart Controls */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
       <div className="flex gap-2">
  <button
    onClick={() => {
      setActiveTimeframe("1D")
      const today = new Date();
      const start = new Date(today);
      start.setDate(today.getDate() - 1);
      setStartDate(start);
    }}
    className={`px-3 py-1 text-sm rounded ${
      activeTimeframe === "1D"
        ? "bg-blue-100 text-blue-600 font-medium"
        : "text-gray-600 hover:bg-gray-100"
    }`}
  >
    1D
  </button>

  <button
    onClick={() => {
      setActiveTimeframe("5D")
      const today = new Date();
      const start = new Date(today);
      start.setDate(today.getDate() - 5);
      setStartDate(start);
    }}
    className={`px-3 py-1 text-sm rounded ${
      activeTimeframe === "5D"
        ? "bg-blue-100 text-blue-600 font-medium"
        : "text-gray-600 hover:bg-gray-100"
    }`}
  >
    5D
  </button>

  <button
    onClick={() => {
      setActiveTimeframe("1M")
      const today = new Date();
      const start = new Date(today);
      start.setMonth(today.getMonth() - 1);
      setStartDate(start);
    }}
    className={`px-3 py-1 text-sm rounded ${
      activeTimeframe === "1M"
        ? "bg-blue-100 text-blue-600 font-medium"
        : "text-gray-600 hover:bg-gray-100"
    }`}
  >
    1M
  </button>

  <button
    onClick={() => {
      setActiveTimeframe("6M")
      const today = new Date();
      const start = new Date(today);
      start.setMonth(today.getMonth() - 6);
      setStartDate(start);
    }}
    className={`px-3 py-1 text-sm rounded ${
      activeTimeframe === "6M"
        ? "bg-blue-100 text-blue-600 font-medium"
        : "text-gray-600 hover:bg-gray-100"
    }`}
  >
    6M
  </button>

  <button
    onClick={() => {
      setActiveTimeframe("YTD")
      const today = new Date();
      const start = new Date(today.getFullYear(), 0, 1);
      setStartDate(start);
    }}
    className={`px-3 py-1 text-sm rounded ${
      activeTimeframe === "YTD"
        ? "bg-blue-100 text-blue-600 font-medium"
        : "text-gray-600 hover:bg-gray-100"
    }`}
  >
    YTD
  </button>

  <button
    onClick={() => {
      setActiveTimeframe("1Y")
      const today = new Date();
      const start = new Date(today);
      start.setFullYear(today.getFullYear() - 1);
      setStartDate(start);
    }}
    className={`px-3 py-1 text-sm rounded ${
      activeTimeframe === "1Y"
        ? "bg-blue-100 text-blue-600 font-medium"
        : "text-gray-600 hover:bg-gray-100"
    }`}
  >
    1Y
  </button>

  <button
    onClick={() => {
      setActiveTimeframe("5Y")
      const today = new Date();
      const start = new Date(today);
      start.setFullYear(today.getFullYear() - 5);
      setStartDate(start);
      setActiveTimeframe==="5"
    }}
    className={`px-3 py-1 text-sm rounded ${
      activeTimeframe === "5Y"
        ? "bg-blue-100 text-blue-600 font-medium"
        : "text-gray-600 hover:bg-gray-100"
    }`}
  >
    5Y
  </button>
</div>

      
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={keyEvents}
                  onChange={(e) => setKeyEvents(e.target.checked)}
                  className="sr-only"
                />
                <button
                  onClick={() => setKeyEvents(!keyEvents)}
                  className={`w-10 h-6 rounded-full transition-colors ${
                    keyEvents ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      keyEvents ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <span className="text-sm text-gray-700">Key Events</span>
            </div>

            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-gray-600" />
              <button className="flex items-center space-x-1 text-sm text-gray-700">
                <span>{chartType}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <button className="text-sm text-blue-600 hover:underline">
              Advanced Chart
            </button>

            <button className="p-1 hover:bg-gray-100 rounded">
              <Settings className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

  
 
  
   <LineChart
      width={800}
      height={400}
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      className='mx-auto my-8'
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date"  allowDuplicatedCategory={false}/>
      <YAxis domain={[0, 'auto']}
       
      />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="price"
        stroke="#8884d8"
        name={dataSymbol}
        dot={false}
        activeDot={{ r: 6, fill: '#3b82f6', stroke: '#ffffff', strokeWidth: 2 }}
      />
      {compareData1 && (
        <Line
          type="monotone"
          dataKey="price"
          data={compareData1}
          stroke="#82ca9d"
          name={compareData1Symbol}
          dot={false}
          activeDot={{ r: 6, fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }}
        />
      )}
     
    
      
    </LineChart>
    </div>
  </>
   
  );
}
export default Chart;