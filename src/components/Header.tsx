import { Link } from 'react-router-dom'
import { useScrollMemory } from '../hooks/useScrollMemory'
import { SearchBar } from './SearchBar'

export function Header() {
  const { clear } = useScrollMemory()

  return (
    <header className="flex flex-col gap-3 border-b border-white/10 px-4 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-6">
      <Link
        to="/"
        onClick={clear}
        className="flex shrink-0 items-center gap-2 text-lg font-semibold text-white no-underline"
      >
        🎬 Catálogo
      </Link>
      <SearchBar />
    </header>
  )
}
