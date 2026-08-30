import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { searchMovies } from '../api/tmdb'
import { SearchResults } from '../components/SearchResults'
import { useScrollRestoration } from '../hooks/useScrollRestoration'
import type { Movie } from '../types/movie'

export function SearchPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const page = Number(searchParams.get('page') ?? '1')

  const [movies, setMovies] = useState<Movie[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [syncedQuery, setSyncedQuery] = useState(query)

  useScrollRestoration(!isLoading)

  if (syncedQuery !== query) {
    setSyncedQuery(query)
    setMovies([])
  }

  useEffect(() => {
    if (!query) return

    let isCancelled = false

    async function runSearch() {
      setIsLoading(true)
      setError(null)
      try {
        const response = await searchMovies(query, page)
        if (isCancelled) return
        setMovies(response.results)
        setTotalPages(response.total_pages)
      } catch {
        if (!isCancelled) setError('Não foi possível buscar os filmes.')
      } finally {
        if (!isCancelled) setIsLoading(false)
      }
    }

    runSearch()
    return () => {
      isCancelled = true
    }
  }, [query, page])

  const handlePageChange = (newPage: number) => {
    setSearchParams({ q: query, page: String(newPage) })
  }

  return (
    <SearchResults
      query={query}
      movies={movies}
      isLoading={isLoading}
      error={error}
      page={page}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      onSelectMovie={(movieId) => navigate(`/filme/${movieId}`)}
    />
  )
}
