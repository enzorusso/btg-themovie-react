import { useParams } from 'react-router-dom'
import { MovieDetails } from '../components/MovieDetails'
import { useScrollRestoration } from '../hooks/useScrollRestoration'

export function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>()

  useScrollRestoration(true)

  if (!id) return null

  return <MovieDetails movieId={Number(id)} />
}
