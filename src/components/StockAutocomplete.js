'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function StockAutocomplete({ onSelect }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([])
        return
      }

      try {
        const response = await axios.get('https://api.polygon.io/v3/reference/tickers', {
          params: {
            search: query,
            limit: 10,
            apiKey: process.env.NEXT_PUBLIC_POLYGON_API_KEY,
          },
        })

        setSuggestions(response.data.results || [])
      } catch (error) {
        console.error('Error fetching suggestions:', error)
        setSuggestions([])
      }
    }

    const debounce = setTimeout(() => {
      fetchSuggestions()
    }, 300)

    return () => clearTimeout(debounce)
  }, [query])

  const handleSelect = (symbol) => {
    setQuery(symbol)
    setSuggestions([])
    onSelect(symbol)
  }

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value.toUpperCase())}
        onBlur={() => setTimeout(() => setSuggestions([]), 150)}
        onFocus={() => {
          if (query.length >= 2 && suggestions.length === 0) {
            axios.get('https://api.polygon.io/v3/reference/tickers', {
              params: {
                search: query,
                limit: 10,
                apiKey: process.env.NEXT_PUBLIC_POLYGON_API_KEY,
              },
            }).then(res => setSuggestions(res.data.results || []))
              .catch(() => setSuggestions([]))
          }
        }}
        placeholder="Enter stock symbol"
        className="w-full p-2 border rounded-md"
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border w-full z-10 max-h-48 overflow-y-auto rounded-md shadow-md">
          {suggestions.map((s) => (
            <li
              key={s.ticker}
              onMouseDown={() => handleSelect(s.ticker)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {s.ticker} - {s.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
