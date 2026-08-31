import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { IconButton } from '@mui/material'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
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

  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollButtons = useCallback(() => {
    const container = scrollRef.current
    if (!container) return
    setCanScrollLeft(container.scrollLeft > 0)
    setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth)
  }, [])

  // restaura a posição de scroll salva ao montar (ex.: voltando de um filme) — sem
  // scroll-behavior: smooth aqui pra não animar esse salto inicial
  useLayoutEffect(() => {
    const container = scrollRef.current
    if (!container) return
    container.style.scrollBehavior = 'auto'
    container.scrollLeft = getScroll(scrollKey) ?? 0
    container.style.scrollBehavior = ''
    updateScrollButtons()
  }, [scrollKey, getScroll, updateScrollButtons])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const handleScroll = () => {
      setScroll(scrollKey, container.scrollLeft)
      updateScrollButtons()
    }

    container.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', updateScrollButtons)
    return () => {
      container.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateScrollButtons)
    }
  }, [scrollKey, setScroll, updateScrollButtons])

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
          disabled={!canScrollLeft}
          className="shrink-0 cursor-pointer! text-white! disabled:cursor-default! disabled:opacity-30!"
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
          disabled={!canScrollRight}
          className="shrink-0 cursor-pointer! text-white! disabled:cursor-default! disabled:opacity-30!"
          aria-label="Rolar para a direita"
        >
          <ChevronRightIcon />
        </IconButton>
      </div>
    </section>
  )
}
