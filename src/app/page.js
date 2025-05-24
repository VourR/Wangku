import CurrencyConverter from '../components/CurrencyConverter'
import StockTracker from '../components/StockTracker'

export default function Home() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <CurrencyConverter />
      </div>
      <div>
        <StockTracker />
      </div>
    </div>
  )
}