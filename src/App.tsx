import { Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { ScrollMemoryProvider } from './context/ScrollMemoryProvider'
import { HomePage } from './pages/HomePage'
import { MovieDetailsPage } from './pages/MovieDetailsPage'
import { SearchPage } from './pages/SearchPage'

function App() {
  return (
    <div className="min-h-screen bg-[#2e3349]">
      <main className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
        <ScrollMemoryProvider>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/busca" element={<SearchPage />} />
            <Route path="/filme/:id" element={<MovieDetailsPage />} />
          </Routes>
        </ScrollMemoryProvider>
      </main>
    </div>
  )
}

export default App
