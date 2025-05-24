'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import StockChart from './StockChart'
import StockAutocomplete from './StockAutocomplete'

export default function StockTracker() {
  const [symbol, setSymbol] = useState('AAPL')
  const [stockData, setStockData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchStockData = async (symbolToFetch = symbol) => {
    setLoading(true)
    setError(null)
    setStockData(null)

    try {
      const response = await axios.get(`https://api.polygon.io/v2/aggs/ticker/${symbolToFetch}/range/1/day/2024-01-01/2024-12-31`, {
        params: {
          adjusted: true,
          sort: 'desc',
          limit: 30,
          apiKey: process.env.NEXT_PUBLIC_POLYGON_API_KEY
        }
      })

      const results = response.data.results || []
      if (results.length === 0) {
        throw new Error('No stock data found for this symbol.')
      }

      const chartData = results.map(item => ({
        date: new Date(item.t).toISOString().split('T')[0],
        open: item.o,
        high: item.h,
        low: item.l,
        close: item.c,
        volume: item.v
      })).reverse()

      const latest = chartData[chartData.length - 1]
      const change = (latest.close - latest.open).toFixed(2)
      const changePercent = ((change / latest.open) * 100).toFixed(2)

      setStockData({
        latest: {
          ...latest,
          symbol: symbolToFetch,
          change,
          changePercent
        },
        chart: chartData
      })

    } catch (err) {
      console.error(err)
      setError(err.message || 'Error fetching data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStockData(symbol)
  }, [])

  const handleSelectSymbol = (selectedSymbol) => {
    setSymbol(selectedSymbol)
    fetchStockData(selectedSymbol)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Stock Tracker</h2>
      </div>

      <StockAutocomplete onSelect={handleSelectSymbol} />

      {loading && (
        <div className="text-center py-4">
          <p>Loading stock data...</p>
          <p className="text-sm text-gray-500">Please wait a moment</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
          <p className="text-red-700 font-medium">Error:</p>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {stockData && !loading && (
        <>
          <div className="mb-4 p-4 bg-gray-50 rounded-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{stockData.latest.symbol}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(stockData.latest.date).toLocaleDateString()}
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
    </div>
  )
}
