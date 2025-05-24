export default function About() {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4 text-primary">Tentang Wangku</h1>
          <p className="mb-4">
            Wangku adalah aplikasi Real-Time Currency and Stock Tracker berbasis web yang memungkinkan pengguna untuk melacak nilai tukar mata uang serta harga saham secara real-time dalam satu platform.
          </p>
          <p className="mb-4">
            Aplikasi ini dirancang untuk memberikan informasi yang akurat dan terkini bagi individu yang membutuhkan data pasar saham dan nilai tukar uang secara cepat dan mudah.
          </p>
          <h2 className="text-xl font-semibold mb-2 mt-4 text-secondary">Fitur Utama:</h2>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Konversi nilai tukar mata uang secara real-time</li>
            <li>Pelacakan harga saham secara real-time</li>
            <li>Tampilan informatif berbasis grafik dan data</li>
            <li>Pencarian cepat untuk menemukan saham atau mata uang tertentu</li>
          </ul>
          <p className="text-sm text-gray-500">
            Aplikasi ini menggunakan API dari ExchangeRate API untuk data nilai tukar mata uang dan Polygon API untuk data saham.
          </p>
        </div>
      </div>
    )
  }