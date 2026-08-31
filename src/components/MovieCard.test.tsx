import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { createMovie } from '../test/factories'
import { MovieCard } from './MovieCard'

describe('MovieCard', () => {
  it('mostra o título e a nota do filme', () => {
    render(<MovieCard movie={createMovie({ title: 'A Odisseia', vote_average: 8.04 })} />)

    expect(screen.getByText('A Odisseia')).toBeInTheDocument()
    expect(screen.getByText('8.0')).toBeInTheDocument()
  })

  it('renderiza o poster quando poster_path existe', () => {
    render(<MovieCard movie={createMovie({ poster_path: '/foo.jpg', title: 'Foo' })} />)

    const img = screen.getByRole('img', { name: 'Foo' })
    expect(img).toHaveAttribute('src', expect.stringContaining('/foo.jpg'))
  })

  it('mostra o título como fallback quando não há poster', () => {
    render(<MovieCard movie={createMovie({ poster_path: null, title: 'Sem Poster' })} />)

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getAllByText('Sem Poster').length).toBeGreaterThan(0)
  })

  it('chama onClick ao clicar no card', () => {
    const onClick = vi.fn()
    render(<MovieCard movie={createMovie()} onClick={onClick} />)

    fireEvent.click(screen.getByRole('button'))

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
