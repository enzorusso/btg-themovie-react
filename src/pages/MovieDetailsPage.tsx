import { useNavigate, useParams } from 'react-router-dom'
import { MovieDetails } from '../components/MovieDetails'
import { useScrollRestoration } from '../hooks/useScrollRestoration'

export function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  useScrollRestoration(true)

  if (!id) return null

  return <MovieDetails movieId={Number(id)} onBack={() => navigate(-1)} />
}
