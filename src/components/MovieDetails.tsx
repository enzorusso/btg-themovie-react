import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import MovieIcon from '@mui/icons-material/Movie'
import PersonIcon from '@mui/icons-material/Person'
import StarIcon from '@mui/icons-material/Star'
import { CircularProgress, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { getMovieCredits, getMovieDetails, getPosterUrl, getProfileUrl } from '../api/tmdb'
import type { CastMember, MovieDetails as MovieDetailsType } from '../types/movie'

interface MovieDetailsProps {
  movieId: number
  onBack: () => void
}

const MAX_CAST_MEMBERS = 10

function formatDate(isoDate: string) {
  if (!isoDate) return '—'
  const [year, month, day] = isoDate.split('-')
  return `${day}/${month}/${year}`
}

export function MovieDetails({ movieId, onBack }: MovieDetailsProps) {
  const [details, setDetails] = useState<MovieDetailsType | null>(null)
  const [director, setDirector] = useState<string | null>(null)
  const [cast, setCast] = useState<CastMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    async function loadMovie() {
      setIsLoading(true)
      setError(null)
      try {
        const [detailsResponse, creditsResponse] = await Promise.all([
          getMovieDetails(movieId),
          getMovieCredits(movieId),
        ])
        if (isCancelled) return
        setDetails(detailsResponse)
        setCast(creditsResponse.cast.slice(0, MAX_CAST_MEMBERS))
        setDirector(creditsResponse.crew.find((member) => member.job === 'Director')?.name ?? null)
      } catch {
        if (!isCancelled) setError('Não foi possível carregar os detalhes do filme.')
      } finally {
        if (!isCancelled) setIsLoading(false)
      }
    }

    loadMovie()
    return () => {
      isCancelled = true
    }
  }, [movieId])

  const poster = details ? getPosterUrl(details.poster_path, 'w500') : null

  return (
    <section className="mt-6">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 text-blue-400 hover:underline"
      >
        <ArrowBackIcon fontSize="small" />
        Voltar
      </button>

      {isLoading && (
        <div className="flex justify-center py-16">
          <CircularProgress />
        </div>
      )}

      {!isLoading && error && <Typography className="text-white/70!">{error}</Typography>}

      {!isLoading && !error && details && (
        <>
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="aspect-2/3 flex w-full max-w-70 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/5">
              {poster ? (
                <img src={poster} alt={details.title} className="h-full w-full object-cover" />
              ) : (
                <MovieIcon sx={{ fontSize: 64 }} className="text-white/20!" />
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{details.title}</h1>
              <p className="mt-3 text-white/80">{details.overview}</p>

              <div className="mt-4 flex items-center gap-1 text-white">
                <StarIcon sx={{ fontSize: 20, color: '#f5c518' }} />
                <span>{details.vote_average.toFixed(1)}</span>
              </div>

              {director && (
                <p className="mt-4 text-white">
                  <strong>Diretor:</strong> {director}
                </p>
              )}
              {details.genres.length > 0 && (
                <p className="mt-1 text-white">
                  <strong>Gêneros:</strong> {details.genres.map((genre) => genre.name).join(', ')}
                </p>
              )}
              {details.release_date && (
                <p className="mt-1 text-white">
                  <strong>Lançamento:</strong> {formatDate(details.release_date)}
                </p>
              )}
            </div>
          </div>

          {cast.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-4 text-lg font-semibold text-white">Elenco</h2>
              <div className="grid grid-cols-3 gap-6 sm:grid-cols-5">
                {cast.map((member) => {
                  const profile = getProfileUrl(member.profile_path)
                  return (
                    <div key={member.id} className="flex flex-col items-center text-center">
                      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-white/10">
                        {profile ? (
                          <img
                            src={profile}
                            alt={member.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <PersonIcon className="text-white/40!" />
                        )}
                      </div>
                      <span className="mt-2 line-clamp-2 text-sm text-white">{member.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}
