import { CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPopularMovies, getUpcomingMovies } from '../api/tmdb'
import { MovieCarousel } from '../components/MovieCarousel'
import { UpcomingBanner } from '../components/UpcomingBanner'
import { useScrollRestoration } from '../hooks/useScrollRestoration'
import type { Movie } from '../types/movie'

export function HomePage() {
  const navigate = useNavigate()
  const [upcoming, setUpcoming] = useState<Movie[]>([])
  const [popular, setPopular] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useScrollRestoration(!isLoading)

  useEffect(() => {
    let isCancelled = false

    async function loadHomeData() {
      setIsLoading(true)
      setError(null)
      try {
        const [upcomingResponse, popularResponse] = await Promise.all([
          getUpcomingMovies(),
          getPopularMovies(),
        ])
        if (isCancelled) return
        setUpcoming(upcomingResponse.results)
        setPopular(popularResponse.results)
      } catch {
        if (!isCancelled) setError('Não foi possível carregar os filmes.')
      } finally {
        if (!isCancelled) setIsLoading(false)
      }
    }

    loadHomeData()
    return () => {
      isCancelled = true
    }
  }, [])

  const handleSelectMovie = (movieId: number) => {
    navigate(`/filme/${movieId}`)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <CircularProgress />
      </div>
    )
  }

  if (error) {
    return <p className="text-white/70">{error}</p>
  }

  return (
    <>
      <UpcomingBanner movies={upcoming} onSelectMovie={handleSelectMovie} />
      <MovieCarousel title="Populares" movies={popular} onSelectMovie={handleSelectMovie} />
    </>
  )
}
