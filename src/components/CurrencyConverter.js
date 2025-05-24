'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(1)
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('IDR')
  const [exchangeRate, setExchangeRate] = useState(null)
  const [currencies, setCurrencies] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState('')
  const [isConverting, setIsConverting] = useState(false)

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get(
          `https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_EXCHANGERATE_API_KEY}/latest/USD`
        )
        setCurrencies(Object.keys(response.data.conversion_rates))
        setLastUpdated(response.data.time_last_update_utc)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching currencies:', error)
        setLoading(false)
      }
    }

    fetchCurrencies()
  }, [])

  const convertCurrency = async () => {
    if (!fromCurrency || !toCurrency) return
    
    setIsConverting(true)
    try {
      const response = await axios.get(
        `https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_EXCHANGERATE_API_KEY}/pair/${fromCurrency}/${toCurrency}`
      )
      setExchangeRate(response.data.conversion_rate)
      setLastUpdated(response.data.time_last_update_utc)
    } catch (error) {
      console.error('Error converting currency:', error)
    } finally {
      setIsConverting(false)
    }
  }

  const handleAmountChange = (e) => {
    setAmount(e.target.value)
  }

  const handleFromCurrencyChange = (e) => {
    setFromCurrency(e.target.value)
  }

  const handleToCurrencyChange = (e) => {
    setToCurrency(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    convertCurrency()
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Currency Converter</h2>
      </div>
      {loading ? (
        <p>Loading currencies...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <select
                  value={fromCurrency}
                  onChange={handleFromCurrencyChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <select
                  value={toCurrency}
                  onChange={handleToCurrencyChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition-colors disabled:opacity-50 flex justify-center items-center"
              disabled={isConverting}
            >
              {isConverting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Converting...
                </>
              ) : 'Convert'}
            </button>
          </div>
        </form>
      )}
      
      {exchangeRate && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <p className="text-lg font-medium">
            {amount} {fromCurrency} = {(amount * exchangeRate).toFixed(2)} {toCurrency}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            1 {fromCurrency} = {exchangeRate.toFixed(6)} {toCurrency}
          </p>
          {lastUpdated && (
            <p className="text-xs text-gray-400 mt-2">
              Last updated: {new Date(lastUpdated).toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  )
}