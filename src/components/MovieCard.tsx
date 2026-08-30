import StarIcon from '@mui/icons-material/Star'
import { Typography } from '@mui/material'
import { getPosterUrl } from '../api/tmdb'
import type { Movie } from '../types/movie'

interface MovieCardProps {
  movie: Movie
  onClick?: () => void
}

export function MovieCard({ movie, onClick }: MovieCardProps) {
  const poster = getPosterUrl(movie.poster_path)

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full cursor-pointer border-0 bg-transparent p-0 text-left"
    >
      <div className="aspect-2/3 w-full overflow-hidden rounded-lg bg-white/5 ring-1 ring-white/10 transition hover:ring-2 hover:ring-white">
        {poster ? (
          <img src={poster} alt={movie.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-2 text-center text-sm text-white/50">
            {movie.title}
          </div>
        )}
      </div>
      <Typography
        variant="body2"
        className="mt-2! font-bold! line-clamp-1 text-white!"
        title={movie.title}
      >
        {movie.title}
      </Typography>
      <div className="flex items-center gap-1 text-white/70">
        <StarIcon sx={{ fontSize: 16, color: '#f5c518' }} />
        <Typography variant="caption" className="text-white/70!">
          {movie.vote_average.toFixed(1)}
        </Typography>
      </div>
    </button>
  )
}
