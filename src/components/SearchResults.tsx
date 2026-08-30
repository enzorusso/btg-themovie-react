import { CircularProgress, Pagination, Typography } from '@mui/material'
import type { Movie } from '../types/movie'
import { BackButton } from './BackButton'
import { MovieCard } from './MovieCard'

interface SearchResultsProps {
  query: string
  movies: Movie[]
  isLoading: boolean
  error: string | null
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  onSelectMovie: (movieId: number) => void
  onBack: () => void
}

// TMDB limita a paginação a 500 páginas, independentemente do total de resultados
const MAX_PAGES = 500

export function SearchResults({
  query,
  movies,
  isLoading,
  error,
  page,
  totalPages,
  onPageChange,
  onSelectMovie,
  onBack,
}: SearchResultsProps) {
  const pageCount = Math.min(totalPages, MAX_PAGES)

  return (
    <section className="mt-6">
      <BackButton onClick={onBack} />
      <h2 className="mb-3 text-lg font-semibold text-white">Resultados para "{query}"</h2>

      {isLoading && (
        <div className="flex justify-center py-10">
          <CircularProgress size={28} />
        </div>
      )}

      {!isLoading && error && <Typography className="text-white/70!">{error}</Typography>}

      {!isLoading && !error && movies.length === 0 && (
        <Typography className="text-white/70!">Nenhum filme encontrado.</Typography>
      )}

      {!isLoading && !error && movies.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onClick={() => onSelectMovie(movie.id)} />
            ))}
          </div>

          {pageCount > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                count={pageCount}
                page={page}
                onChange={(_, value) => onPageChange(value)}
                color="primary"
                sx={{
                  '& .MuiPaginationItem-root': { color: 'white', cursor: 'pointer' },
                }}
              />
            </div>
          )}
        </>
      )}
    </section>
  )
}
