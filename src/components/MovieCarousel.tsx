import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { IconButton } from '@mui/material'
import { useEffect, useRef } from 'react'
import { useScrollMemory } from '../hooks/useScrollMemory'
import type { Movie } from '../types/movie'
import { MovieCard } from './MovieCard'

interface MovieCarouselProps {
  title: string
  movies: Movie[]
  onSelectMovie: (movieId: number) => void
}

const SCROLL_AMOUNT = 600
const LOOP_EDGE_THRESHOLD = 0.1

export function MovieCarousel({ title, movies, onSelectMovie }: MovieCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { getScroll, setScroll } = useScrollMemory()
  const scrollKey = `carousel:${title}`

  // Cria a lista triplicada que dá a ilusão de carrossel infinito
  const loopedMovies = [0, 1, 2].flatMap((setIndex) =>
    movies.map((movie) => ({ movie, key: `${setIndex}-${movie.id}` })),
  )

  useEffect(() => {
    const container = scrollRef.current
    if (!container || movies.length === 0) return

    let attempts = 0
    let frameId: number

    const centerOnMiddleSet = () => {
      const setWidth = container.scrollWidth / 3
      const target = setWidth + (getScroll(scrollKey) ?? 0)
      container.style.scrollBehavior = 'auto'
      container.scrollLeft = target
      attempts += 1
      if (Math.abs(container.scrollLeft - target) > 1 && attempts < 20) {
        frameId = requestAnimationFrame(centerOnMiddleSet)
      } else {
        container.style.scrollBehavior = ''
      }
    }

    centerOnMiddleSet()
    return () => cancelAnimationFrame(frameId)
  }, [movies, scrollKey, getScroll])

  useEffect(() => {
    const container = scrollRef.current
    if (!container || movies.length === 0) return

    const handleScroll = () => {
      const setWidth = container.scrollWidth / 3
      if (setWidth === 0) return

      if (container.scrollLeft < setWidth * LOOP_EDGE_THRESHOLD) {
        container.style.scrollBehavior = 'auto'
        container.scrollLeft += setWidth
        container.style.scrollBehavior = ''
      } else if (container.scrollLeft > setWidth * (2 - LOOP_EDGE_THRESHOLD)) {
        container.style.scrollBehavior = 'auto'
        container.scrollLeft -= setWidth
        container.style.scrollBehavior = ''
      }

      setScroll(scrollKey, container.scrollLeft - setWidth)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [movies, scrollKey, setScroll])

  const scrollByAmount = (amount: number) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: 'smooth' })
  }

  return (
    <section className="mt-8">
      <h2 className="mb-3 text-lg font-semibold text-white">{title}</h2>
      <div className="relative flex items-center gap-1 sm:gap-3">
        <IconButton
          onClick={() => scrollByAmount(-SCROLL_AMOUNT)}
          className="shrink-0 cursor-pointer! text-white!"
          aria-label="Rolar para a esquerda"
        >
          <ChevronLeftIcon />
        </IconButton>

        <div
          ref={scrollRef}
          className="no-scrollbar flex min-w-0 snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth p-2 scroll-px-2"
        >
          {loopedMovies.map(({ movie, key }) => (
            <div key={key} className="w-36 shrink-0 snap-start sm:w-45">
              <MovieCard movie={movie} onClick={() => onSelectMovie(movie.id)} />
            </div>
          ))}
        </div>

        <IconButton
          onClick={() => scrollByAmount(SCROLL_AMOUNT)}
          className="shrink-0 cursor-pointer! text-white!"
          aria-label="Rolar para a direita"
        >
          <ChevronRightIcon />
        </IconButton>
      </div>
    </section>
  )
}
