import type { Credits, MovieDetails, TmdbListResponse } from '../types/movie'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL ?? 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL ?? 'https://image.tmdb.org/t/p/'

async function tmdbFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`)
  url.searchParams.set('api_key', API_KEY)
  url.searchParams.set('language', 'pt-BR')
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(`Erro ao consultar a TMDB: ${response.status}`)
  }

  return response.json() as Promise<T>
}

export function getUpcomingMovies() {
  return tmdbFetch<TmdbListResponse>('/movie/upcoming')
}

export function getPopularMovies() {
  return tmdbFetch<TmdbListResponse>('/movie/popular')
}

export function searchMovies(query: string, page = 1) {
  return tmdbFetch<TmdbListResponse>('/search/movie', { query, page: String(page) })
}

export function getMovieDetails(movieId: number) {
  return tmdbFetch<MovieDetails>(`/movie/${movieId}`)
}

export function getMovieCredits(movieId: number) {
  return tmdbFetch<Credits>(`/movie/${movieId}/credits`)
}

export function getPosterUrl(path: string | null, size: 'w200' | 'w342' | 'w500' = 'w342') {
  if (!path) return null
  return `${IMAGE_BASE_URL}${size}${path}`
}

export function getBackdropUrl(path: string | null, size: 'w780' | 'original' = 'original') {
  if (!path) return null
  return `${IMAGE_BASE_URL}${size}${path}`
}

export function getProfileUrl(path: string | null, size: 'w185' = 'w185') {
  if (!path) return null
  return `${IMAGE_BASE_URL}${size}${path}`
}
