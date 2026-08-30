import { useEffect, useState } from 'react'
import { getBackdropUrl } from '../api/tmdb'
import type { Movie } from '../types/movie'

interface UpcomingBannerProps {
  movies: Movie[]
  onSelectMovie: (movieId: number) => void
}

const AUTOPLAY_INTERVAL_MS = 5000

export function UpcomingBanner({ movies, onSelectMovie }: UpcomingBannerProps) {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused || movies.length === 0) return

    const timer = setInterval(() => {
      setCurrent((index) => (index + 1) % movies.length)
    }, AUTOPLAY_INTERVAL_MS)

    return () => clearInterval(timer)
  }, [isPaused, movies.length])

  if (movies.length === 0) return null

  const movie = movies[current]
  const backdrop = getBackdropUrl(movie.backdrop_path)

  return (
    <section className="mt-6">
      <h2 className="mb-3 text-lg font-semibold text-white">Lançamentos</h2>
      <button
        type="button"
        onClick={() => onSelectMovie(movie.id)}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative aspect-4/3 w-full cursor-pointer overflow-hidden rounded-xl border-0 bg-transparent p-0 ring-1 ring-white/20 transition hover:ring-2 hover:ring-white sm:aspect-video lg:aspect-21/9"
      >
        {backdrop && (
          <img src={backdrop} alt={movie.title} className="h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
        <span className="absolute bottom-2 left-2 text-sm font-semibold text-white sm:bottom-4 sm:left-4 sm:text-lg">
          {movie.title}
        </span>

        <div className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 gap-1 sm:bottom-3 sm:gap-1.5">
          {movies.map((item, index) => (
            <span
              key={item.id}
              role="button"
              tabIndex={0}
              aria-label={`Ir para o slide ${index + 1}`}
              onClick={(event) => {
                event.stopPropagation()
                setCurrent(index)
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.stopPropagation()
                  setCurrent(index)
                }
              }}
              className={`h-2 w-2 cursor-pointer rounded-full transition ${
                index === current ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </button>
    </section>
  )
}
