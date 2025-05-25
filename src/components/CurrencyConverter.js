'use client'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { currencyMeta } from './CurrencyMeta'

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(1)
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('IDR')
  const [exchangeRate, setExchangeRate] = useState(null)
  const [currencies, setCurrencies] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState('')
  const [isConverting, setIsConverting] = useState(false)

  const [isFromOpen, setIsFromOpen] = useState(false)
  const [isToOpen, setIsToOpen] = useState(false)
  const [fromSearch, setFromSearch] = useState('')
  const [toSearch, setToSearch] = useState('')

  const fromDropdownRef = useRef(null)
  const toDropdownRef = useRef(null)

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fromDropdownRef.current && !fromDropdownRef.current.contains(event.target)) {
        setIsFromOpen(false)
      }
      if (toDropdownRef.current && !toDropdownRef.current.contains(event.target)) {
        setIsToOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
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

  const handleSubmit = (e) => {
    e.preventDefault()
    convertCurrency()
  }

  const renderDropdown = (label, selected, setSelected, isOpen, setIsOpen, search, setSearch, dropdownRef) => {
    const filtered = currencies.filter(code =>
      code.toLowerCase().includes(search.toLowerCase()) ||
      (currencyMeta[code]?.country?.toLowerCase() || '').includes(search.toLowerCase())
    )

    return (
      <div className="relative" ref={dropdownRef}>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-2 border border-gray-300 rounded-md text-left flex items-center justify-between hover:bg-gray-50"
        >
          <div className="flex items-center space-x-2">
            <img
              src={currencyMeta[selected]?.flag}
              alt={selected}
              className="w-5 h-4 object-cover"
            />
            <span>{selected} - {currencyMeta[selected]?.country || 'Unknown'}</span>
          </div>
          <span className="text-gray-500">▼</span>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-md max-h-64 overflow-y-auto">
            <div className="p-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search currency or country"
                className="w-full p-2 border border-gray-200 rounded-md"
              />
            </div>
            {filtered.length > 0 ? (
              filtered.map(code => (
                <div
                  key={code}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                  onClick={() => {
                    setSelected(code)
                    setIsOpen(false)
                    setSearch('')
                  }}
                >
                  <img
                    src={currencyMeta[code]?.flag}
                    alt={code}
                    className="w-5 h-4 mr-2 object-cover"
                  />
                  <span>{code} - {currencyMeta[code]?.country || 'Unknown'}</span>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500">No results</div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 max-w-2xl mx-auto">
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
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {renderDropdown('From', fromCurrency, setFromCurrency, isFromOpen, setIsFromOpen, fromSearch, setFromSearch, fromDropdownRef)}
              {renderDropdown('To', toCurrency, setToCurrency, isToOpen, setIsToOpen, toSearch, setToSearch, toDropdownRef)}
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition-colors disabled:opacity-50 flex justify-center items-center"
              disabled={isConverting}
            >
              {isConverting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Converting...
                </>
              ) : 'Convert'}
            </button>
          </div>
        </form>
      )}

      {exchangeRate && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md flex flex-col items-center justify-center text-center">
          <p className="text-3xl font-bold text-gray-800 mb-2">
            {amount} {fromCurrency} = {(amount * exchangeRate).toFixed(2)} {toCurrency}
          </p>
          <p className="text-sm text-gray-500">
            1 {fromCurrency} = {exchangeRate.toFixed(6)} {toCurrency}
          </p>
          {lastUpdated && (
            <p className="text-xs text-gray-400 mt-1">
              Last updated: {lastUpdated}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
