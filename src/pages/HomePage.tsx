import { CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPopularMovies, getTopRatedMovies, getUpcomingMovies } from '../api/tmdb'
import { MovieCarousel } from '../components/MovieCarousel'
import { UpcomingBanner } from '../components/UpcomingBanner'
import { useScrollRestoration } from '../hooks/useScrollRestoration'
import type { Movie } from '../types/movie'

export function HomePage() {
  const navigate = useNavigate()
  const [upcoming, setUpcoming] = useState<Movie[]>([])
  const [popular, setPopular] = useState<Movie[]>([])
  const [topRated, setTopRated] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useScrollRestoration(!isLoading)

  useEffect(() => {
    async function loadHomeData() {
      setIsLoading(true)
      setError(null)
      try {
        const [upcomingResponse, popularResponse, topRatedResponse] = await Promise.all([
          getUpcomingMovies(),
          getPopularMovies(),
          getTopRatedMovies(),
        ])

        setUpcoming(upcomingResponse.results)
        setPopular(popularResponse.results)
        setTopRated(topRatedResponse.results)
      } catch {
        setError('Não foi possível carregar os filmes.')
      } finally {
        setIsLoading(false)
      }
    }

    loadHomeData()
  }, [])

  const handleSelectMovie = (movieId: number) => {
    navigate(`/filme/${movieId}`)
  }

  const carouselSections = [
    { title: 'Populares', movies: popular },
    { title: 'Melhores Avaliados', movies: topRated },
  ]

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
      {carouselSections.map((section) => (
        <MovieCarousel
          key={section.title}
          title={section.title}
          movies={section.movies}
          onSelectMovie={handleSelectMovie}
        />
      ))}
    </>
  )
}
