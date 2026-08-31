import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getBackdropUrl,
  getMovieCredits,
  getMovieDetails,
  getMoviesByRegion,
  getPopularMovies,
  getPosterUrl,
  getProfileUrl,
  getTopRatedMovies,
  getUpcomingMovies,
  searchMovies,
} from './tmdb'

function mockFetchOnce(body: unknown, ok = true) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 404,
    json: () => Promise.resolve(body),
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

function calledUrl(fetchMock: ReturnType<typeof vi.fn>) {
  return new URL(fetchMock.mock.calls[0][0] as string)
}

describe('tmdb api client', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })

  it('busca filmes populares em pt-BR', async () => {
    const fetchMock = mockFetchOnce({ page: 1, results: [], total_pages: 1, total_results: 0 })

    await getPopularMovies()

    const url = calledUrl(fetchMock)
    expect(url.pathname).toBe('/3/movie/popular')
    expect(url.searchParams.get('language')).toBe('pt-BR')
  })

  it('busca melhores avaliados e lançamentos em pt-BR', async () => {
    const fetchMock = mockFetchOnce({ page: 1, results: [], total_pages: 1, total_results: 0 })
    await getTopRatedMovies()
    expect(calledUrl(fetchMock).pathname).toBe('/3/movie/top_rated')

    mockFetchOnce({ page: 1, results: [], total_pages: 1, total_results: 0 })
    const fetchMock2 = mockFetchOnce({ page: 1, results: [], total_pages: 1, total_results: 0 })
    await getUpcomingMovies()
    expect(calledUrl(fetchMock2).pathname).toBe('/3/movie/upcoming')
  })

  it('busca filmes por região com os parâmetros certos', async () => {
    const fetchMock = mockFetchOnce({ page: 1, results: [], total_pages: 1, total_results: 0 })

    await getMoviesByRegion('BR')

    const url = calledUrl(fetchMock)
    expect(url.pathname).toBe('/3/discover/movie')
    expect(url.searchParams.get('region')).toBe('BR')
    expect(url.searchParams.get('with_origin_country')).toBe('BR')
    expect(url.searchParams.get('sort_by')).toBe('popularity.desc')
  })

  it('busca por texto envia query e page corretos', async () => {
    const fetchMock = mockFetchOnce({ page: 2, results: [], total_pages: 5, total_results: 100 })

    await searchMovies('homem aranha', 2)

    const url = calledUrl(fetchMock)
    expect(url.pathname).toBe('/3/search/movie')
    expect(url.searchParams.get('query')).toBe('homem aranha')
    expect(url.searchParams.get('page')).toBe('2')
  })

  it('busca detalhes do filme em pt-BR', async () => {
    const fetchMock = mockFetchOnce({ id: 1, genres: [] })

    await getMovieDetails(1)

    const url = calledUrl(fetchMock)
    expect(url.pathname).toBe('/3/movie/1')
    expect(url.searchParams.get('language')).toBe('pt-BR')
  })

  it('busca créditos SEM parâmetro de idioma (evita nomes traduzidos/bagunçados)', async () => {
    const fetchMock = mockFetchOnce({ id: 1, cast: [], crew: [] })

    await getMovieCredits(1)

    const url = calledUrl(fetchMock)
    expect(url.pathname).toBe('/3/movie/1/credits')
    expect(url.searchParams.has('language')).toBe(false)
  })

  it('lança erro quando a resposta não é ok', async () => {
    mockFetchOnce({}, false)

    await expect(getPopularMovies()).rejects.toThrow('Erro ao consultar a TMDB: 404')
  })
})

describe('helpers de URL de imagem', () => {
  it('retorna null quando o path é null', () => {
    expect(getPosterUrl(null)).toBeNull()
    expect(getBackdropUrl(null)).toBeNull()
    expect(getProfileUrl(null)).toBeNull()
  })

  it('monta a URL da imagem a partir do path', () => {
    expect(getPosterUrl('/abc.jpg')).toContain('/abc.jpg')
    expect(getPosterUrl('/abc.jpg', 'w500')).toContain('w500/abc.jpg')
    expect(getBackdropUrl('/xyz.jpg')).toContain('/xyz.jpg')
    expect(getProfileUrl('/actor.jpg')).toContain('/actor.jpg')
  })
})
