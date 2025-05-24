'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import StockChart from './StockChart';
import StockAutocomplete from './StockAutocomplete';

export default function StockTracker() {
  const [symbol, setSymbol] = useState('');
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [range, setRange] = useState('30'); // in days

  const fetchStockData = async () => {
    if (!symbol) return;
    setLoading(true);
    setError(null);
    setStockData(null);

    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - parseInt(range) * 24 * 60 * 60 * 1000)
        .toISOString().split('T')[0];

      const response = await axios.get(`https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${startDate}/${endDate}`, {
        params: {
          adjusted: true,
          sort: 'desc',
          limit: 100,
          apiKey: process.env.NEXT_PUBLIC_POLYGON_API_KEY
        }
      });

      const results = response.data.results;
      if (!results || results.length === 0) {
        throw new Error('No data returned from Polygon API');
      }

      const chartData = results.reverse().map(item => ({
        date: new Date(item.t).toISOString().split('T')[0],
        open: item.o,
        high: item.h,
        low: item.l,
        close: item.c,
        volume: item.v
      }));

      const latest = chartData[chartData.length - 1];
      const first = chartData[0];
      const change = (latest.close - first.open).toFixed(2);
      const changePercent = ((change / first.open) * 100).toFixed(2);

      setStockData({
        symbol,
        latest: {
          ...latest,
          change,
          changePercent
        },
        chart: chartData
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch stock data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (symbol) fetchStockData();
  }, [symbol, range]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Stock Tracker</h2>
      </div>

      <div className="flex gap-2 mb-2">
        <div className="flex-grow relative">
          <StockAutocomplete onSelect={(s) => setSymbol(s)} />
        </div>

        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="7">7 days</option>
          <option value="30">30 days</option>
          <option value="90">3 months</option>
          <option value="180">6 months</option>
          <option value="365">1 year</option>
        </select>
      </div>

      {loading && (
        <div className="text-center py-4 text-gray-500">Fetching stock data...</div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          Error: {error}
        </div>
      )}

      {stockData && !loading && (
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">{stockData.symbol}</h3>
              <p className="text-sm text-gray-500">{stockData.latest.date}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">${stockData.latest.close}</p>
              <p className={`text-sm ${stockData.latest.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stockData.latest.change >= 0 ? '+' : ''}{stockData.latest.change} (
                {stockData.latest.changePercent >= 0 ? '+' : ''}{stockData.latest.changePercent}%)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-white p-3 rounded border">
              <p className="text-sm font-medium text-gray-500">Open</p>
              <p className="font-semibold">${stockData.latest.open}</p>
            </div>
            <div className="bg-white p-3 rounded border">
              <p className="text-sm font-medium text-gray-500">High</p>
              <p className="font-semibold">${stockData.latest.high}</p>
            </div>
            <div className="bg-white p-3 rounded border">
              <p className="text-sm font-medium text-gray-500">Low</p>
              <p className="font-semibold">${stockData.latest.low}</p>
            </div>
            <div className="bg-white p-3 rounded border">
              <p className="text-sm font-medium text-gray-500">Volume</p>
              <p className="font-semibold">{parseInt(stockData.latest.volume).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {stockData && <StockChart data={stockData.chart} />}
    </div>
  );
}
