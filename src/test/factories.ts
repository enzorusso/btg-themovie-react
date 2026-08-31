import type { Movie } from '../types/movie'

export function createMovie(overrides: Partial<Movie> = {}): Movie {
  return {
    id: 1,
    title: 'Filme de Teste',
    poster_path: '/poster.jpg',
    backdrop_path: '/backdrop.jpg',
    overview: 'Uma sinopse qualquer.',
    release_date: '2026-01-01',
    vote_average: 7.5,
    ...overrides,
  }
}

export function createMovies(count: number, overrides: Partial<Movie> = {}): Movie[] {
  return Array.from({ length: count }, (_, index) =>
    createMovie({
      id: index + 1,
      title: `Filme ${index + 1}`,
      ...overrides,
    }),
  )
}
