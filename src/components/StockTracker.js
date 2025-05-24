'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import StockChart from './StockChart'

export default function StockTracker() {
  const [symbol, setSymbol] = useState('IBM')
  const [stockData, setStockData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastRefreshed, setLastRefreshed] = useState('')

  const fetchStockData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Clear previous data while loading new data
      setStockData(null)
      
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY}`
      )
      
      // Check for API error messages
      if (response.data['Error Message']) {
        throw new Error(response.data['Error Message'])
      }
      
      if (response.data['Note']) {
        throw new Error('API rate limit exceeded. Please wait a minute and try again.')
      }
      
      // Check if data exists
      const timeSeries = response.data['Time Series (Daily)']
      if (!timeSeries) {
        throw new Error('No time series data found for this symbol')
      }
      
      // Get the latest refresh date
      const metaData = response.data['Meta Data'] || {}
      setLastRefreshed(metaData['3. Last Refreshed'] || 'N/A')
      
      // Prepare chart data
      const chartData = Object.keys(timeSeries).map(date => ({
        date,
        open: parseFloat(timeSeries[date]['1. open']),
        high: parseFloat(timeSeries[date]['2. high']),
        low: parseFloat(timeSeries[date]['3. low']),
        close: parseFloat(timeSeries[date]['4. close']),
        volume: parseFloat(timeSeries[date]['5. volume']),
      })).reverse()
      
      // Get latest quote
      const latestDate = Object.keys(timeSeries)[0]
      const latestQuote = {
        symbol,
        date: latestDate,
        open: timeSeries[latestDate]['1. open'],
        high: timeSeries[latestDate]['2. high'],
        low: timeSeries[latestDate]['3. low'],
        close: timeSeries[latestDate]['4. close'],
        volume: timeSeries[latestDate]['5. volume'],
        change: (
          (parseFloat(timeSeries[latestDate]['4. close']) - 
           parseFloat(timeSeries[latestDate]['1. open'])).toFixed(2)
        ),
        changePercent: (
          ((parseFloat(timeSeries[latestDate]['4. close']) - 
            parseFloat(timeSeries[latestDate]['1. open'])) / 
           parseFloat(timeSeries[latestDate]['1. open']) * 100
        ).toFixed(2))
      }
      
      setStockData({
        meta: metaData,
        latest: latestQuote,
        chart: chartData.slice(0, 30) // Last 30 days
      })
      
    } catch (err) {
      setError(err.message || 'Failed to fetch stock data')
      console.error('Error fetching stock data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial load with default symbol (AAPL)
    fetchStockData()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (symbol.trim()) {
      fetchStockData()
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="border-b border-gray-200 pb-4 mb-4">
      <h2 className="text-xl font-semibold text-gray-800">Stock Tracker</h2>
    </div>
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex">
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="Enter stock symbol (e.g. IBM, MSFT, TSLA)"
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-secondary transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
      
      {loading && (
        <div className="text-center py-4">
          <p>Loading stock data...</p>
          <p className="text-sm text-gray-500">This may take a moment</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700 font-medium">Error:</p>
          <p className="text-red-600">{error}</p>
          <p className="text-sm text-red-500 mt-2">
            Note: Free Alpha Vantage API is limited to 5 requests per minute.
          </p>
        </div>
      )}
      
      {stockData && !loading && (
        <>
          <div className="mb-4 p-4 bg-gray-50 rounded-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{stockData.latest.symbol}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(stockData.latest.date).toLocaleDateString()} | 
                  Last refreshed: {lastRefreshed}
                </p>
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
                <p className="font-semibold">
                  {parseInt(stockData.latest.volume).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <StockChart data={stockData.chart} />
        </>
      )}
      
      {!loading && !error && !stockData && (
        <div className="text-center py-8 text-gray-500">
          <p>No stock data available</p>
        </div>
      )}
    </div>
  )
}