import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { IconButton } from '@mui/material'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { useScrollMemory } from '../hooks/useScrollMemory'
import type { Movie } from '../types/movie'
import { MovieCard } from './MovieCard'

interface MovieCarouselProps {
  title: string
  movies: Movie[]
  onSelectMovie: (movieId: number) => void
}

export function MovieCarousel({ title, movies, onSelectMovie }: MovieCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { getScroll, setScroll } = useScrollMemory()
  const scrollKey = `carousel:${title}`

  useLayoutEffect(() => {
    const container = scrollRef.current
    if (!container) return
    container.style.scrollBehavior = 'auto'
    container.scrollLeft = getScroll(scrollKey) ?? 0
    container.style.scrollBehavior = ''
  }, [scrollKey, getScroll])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const handleScroll = () => setScroll(scrollKey, container.scrollLeft)

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [scrollKey, setScroll])

  const scrollByViewport = (direction: 1 | -1) => {
    const container = scrollRef.current
    if (!container) return
    container.scrollBy({ left: direction * container.clientWidth, behavior: 'smooth' })
  }

  return (
    <section className="mt-8">
      <h2 className="mb-3 text-lg font-semibold text-white">{title}</h2>
      <div className="relative flex items-center gap-1 sm:gap-3">
        <IconButton
          onClick={() => scrollByViewport(-1)}
          className="shrink-0 cursor-pointer! text-white!"
          aria-label="Rolar para a esquerda"
        >
          <ChevronLeftIcon />
        </IconButton>

        <div
          ref={scrollRef}
          className="no-scrollbar flex min-w-0 snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth p-2 scroll-px-2"
        >
          {movies.map((movie) => (
            <div key={movie.id} className="w-36 shrink-0 snap-start sm:w-45">
              <MovieCard movie={movie} onClick={() => onSelectMovie(movie.id)} />
            </div>
          ))}
        </div>

        <IconButton
          onClick={() => scrollByViewport(1)}
          className="shrink-0 cursor-pointer! text-white!"
          aria-label="Rolar para a direita"
        >
          <ChevronRightIcon />
        </IconButton>
      </div>
    </section>
  )
}
