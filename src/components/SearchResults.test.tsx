import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createMovies } from '../test/factories'
import { SearchResults } from './SearchResults'

const defaultProps = {
  query: 'drama',
  movies: [],
  isLoading: false,
  error: null,
  page: 1,
  totalPages: 1,
  onPageChange: vi.fn(),
  onSelectMovie: vi.fn(),
}

describe('SearchResults', () => {
  it('mostra o spinner de loading', () => {
    render(<SearchResults {...defaultProps} isLoading />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('mostra a mensagem de erro', () => {
    render(<SearchResults {...defaultProps} error="Não foi possível buscar os filmes." />)
    expect(screen.getByText('Não foi possível buscar os filmes.')).toBeInTheDocument()
  })

  it('mostra "Nenhum filme encontrado." quando a lista está vazia', () => {
    render(<SearchResults {...defaultProps} movies={[]} />)
    expect(screen.getByText('Nenhum filme encontrado.')).toBeInTheDocument()
  })

  it('renderiza um card por filme e chama onSelectMovie ao clicar', async () => {
    const user = userEvent.setup()
    const onSelectMovie = vi.fn()
    const movies = createMovies(3)

    render(<SearchResults {...defaultProps} movies={movies} onSelectMovie={onSelectMovie} />)

    expect(screen.getAllByRole('button')).toHaveLength(3)

    await user.click(screen.getByText('Filme 2'))
    expect(onSelectMovie).toHaveBeenCalledWith(2)
  })

  it('não mostra paginação quando só há 1 página', () => {
    render(<SearchResults {...defaultProps} movies={createMovies(2)} totalPages={1} />)
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('mostra paginação e chama onPageChange com a página clicada', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()

    render(
      <SearchResults
        {...defaultProps}
        movies={createMovies(2)}
        page={1}
        totalPages={5}
        onPageChange={onPageChange}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Go to page 2' }))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('limita a paginação a 500 páginas mesmo se a TMDB reportar mais', () => {
    render(<SearchResults {...defaultProps} movies={createMovies(1)} totalPages={1000} />)
    // MUI Pagination sempre renderiza a última página como botão — checa que é a 500, não 1000
    expect(screen.getByRole('button', { name: 'Go to page 500' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Go to page 1000' })).not.toBeInTheDocument()
  })
})
