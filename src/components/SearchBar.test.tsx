import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Link, MemoryRouter, useLocation } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { SearchBar } from './SearchBar'

function LocationDisplay() {
  const location = useLocation()
  return <div data-testid="location">{location.pathname + location.search}</div>
}

describe('SearchBar', () => {
  it('começa vazio na home', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <SearchBar />
      </MemoryRouter>,
    )

    expect(screen.getByPlaceholderText('Buscar filmes...')).toHaveValue('')
  })

  it('mostra o termo da URL quando já está na tela de busca', () => {
    render(
      <MemoryRouter initialEntries={['/busca?q=drama']}>
        <SearchBar />
      </MemoryRouter>,
    )

    expect(screen.getByPlaceholderText('Buscar filmes...')).toHaveValue('drama')
  })

  it('permite digitar o termo inteiro sem apagar a cada tecla (regressão)', async () => {
    // bug histórico: a lógica de sincronização com a URL comparava o valor digitado
    // com a URL a cada render e desfazia a digitação letra por letra
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/']}>
        <SearchBar />
      </MemoryRouter>,
    )

    const input = screen.getByPlaceholderText('Buscar filmes...')
    await user.type(input, 'homem aranha')

    expect(input).toHaveValue('homem aranha')
  })

  it('ao submeter com texto, navega para /busca?q=<termo>', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/']}>
        <SearchBar />
        <LocationDisplay />
      </MemoryRouter>,
    )

    await user.type(screen.getByPlaceholderText('Buscar filmes...'), 'matrix')
    await user.click(screen.getByRole('button', { name: 'Buscar' }))

    expect(screen.getByTestId('location')).toHaveTextContent('/busca?q=matrix')
  })

  it('ao submeter vazio, navega para a home', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/busca?q=drama']}>
        <SearchBar />
        <LocationDisplay />
      </MemoryRouter>,
    )

    await user.clear(screen.getByPlaceholderText('Buscar filmes...'))
    await user.click(screen.getByRole('button', { name: 'Buscar' }))

    expect(screen.getByTestId('location')).toHaveTextContent('/')
  })

  it('mantém o texto ao navegar pra outra tela e só limpa ao voltar pra home', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/busca?q=drama']}>
        <SearchBar />
        <Link to="/filme/1">ver filme</Link>
        <Link to="/">home</Link>
      </MemoryRouter>,
    )

    const input = screen.getByPlaceholderText('Buscar filmes...')
    expect(input).toHaveValue('drama')

    await user.click(screen.getByText('ver filme'))
    expect(input).toHaveValue('drama')

    await user.click(screen.getByText('home'))
    expect(input).toHaveValue('')
  })
})
