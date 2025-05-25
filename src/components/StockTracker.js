'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import StockChart from './StockChart';
import StockAutocomplete from './StockAutocomplete';

export default function StockTracker() {
  const [symbol, setSymbol] = useState('');
  const [stockData, setStockData] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [range, setRange] = useState('30');

  const fetchCompanyInfo = async (tickerSymbol) => {
    try {
      const response = await axios.get(`https://api.polygon.io/v3/reference/tickers/${tickerSymbol}`, {
        params: {
          apiKey: process.env.NEXT_PUBLIC_POLYGON_API_KEY
        }
      });

      const tickerData = response.data.results;
      if (tickerData) {
        setCompanyLogo(tickerData.branding?.logo_url || null);
        setCompanyName(tickerData.name || tickerSymbol);
      }
    } catch (err) {
      console.log('Failed to fetch company info:', err.message);
      // Tidak perlu throw error, karena logo adalah fitur tambahan
      setCompanyLogo(null);
      setCompanyName(tickerSymbol);
    }
  };

  const fetchStockData = async () => {
    if (!symbol) return;
    setLoading(true);
    setError(null);
    setStockData(null);
    setCompanyLogo(null);
    setCompanyName('');

    try {
      // Fetch company info first
      await fetchCompanyInfo(symbol);

      // Use a more reliable date calculation
      const today = new Date();
      const endDate = today.toISOString().split('T')[0];
      
      const startDateObj = new Date(today);
      startDateObj.setDate(startDateObj.getDate() - parseInt(range));
      const startDate = startDateObj.toISOString().split('T')[0];

      const response = await axios.get(`https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${startDate}/${endDate}`, {
        params: {
          adjusted: true,
          sort: 'desc',
          limit: 100,
          apiKey: process.env.NEXT_PUBLIC_POLYGON_API_KEY
        }
      });

      const results = response.data.results;
      if (!results || results.length === 0) throw new Error('No data returned from Polygon API');

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
    <div className="bg-white p-6 rounded-lg shadow-md transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 max-w-2xl mx-auto">
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
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              {companyLogo ? (
                <img 
                  src={`${companyLogo}?apikey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`}
                  alt={`${stockData.symbol} logo`}
                  className="w-12 h-12 rounded-lg object-contain bg-white p-1 shadow-sm"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 font-bold text-sm">{stockData.symbol.charAt(0)}</span>
                </div>
              )}
              <div>
                <h3 className="font-bold text-lg">{stockData.symbol}</h3>
                {companyName && companyName !== stockData.symbol && (
                  <p className="text-sm text-gray-600">{companyName}</p>
                )}
                <p className="text-sm text-gray-500">{stockData.latest.date}</p>
              </div>
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