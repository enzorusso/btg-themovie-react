import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createMovies } from '../test/factories'
import { UpcomingBanner } from './UpcomingBanner'

describe('UpcomingBanner', () => {
  it('não renderiza nada quando não há filmes', () => {
    const { container } = render(<UpcomingBanner movies={[]} onSelectMovie={vi.fn()} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('mostra o primeiro filme inicialmente', () => {
    render(<UpcomingBanner movies={createMovies(3)} onSelectMovie={vi.fn()} />)
    expect(screen.getByText('Filme 1')).toBeInTheDocument()
  })

  it('chama onSelectMovie com o id do filme em exibição ao clicar no banner', async () => {
    const user = userEvent.setup()
    const onSelectMovie = vi.fn()
    render(<UpcomingBanner movies={createMovies(3)} onSelectMovie={onSelectMovie} />)

    await user.click(screen.getByText('Filme 1'))

    expect(onSelectMovie).toHaveBeenCalledWith(1)
  })

  it('clicar num dot troca o slide sem disparar onSelectMovie', async () => {
    const user = userEvent.setup()
    const onSelectMovie = vi.fn()
    render(<UpcomingBanner movies={createMovies(3)} onSelectMovie={onSelectMovie} />)

    await user.click(screen.getByLabelText('Ir para o slide 3'))

    expect(screen.getByText('Filme 3')).toBeInTheDocument()
    expect(onSelectMovie).not.toHaveBeenCalled()
  })

  describe('autoplay', () => {
    afterEach(() => {
      vi.useRealTimers()
    })

    it('avança de slide automaticamente', () => {
      vi.useFakeTimers()
      render(<UpcomingBanner movies={createMovies(3)} onSelectMovie={vi.fn()} />)

      expect(screen.getByText('Filme 1')).toBeInTheDocument()

      act(() => {
        vi.advanceTimersByTime(5000)
      })

      expect(screen.getByText('Filme 2')).toBeInTheDocument()
    })

    it('pausa enquanto o mouse está sobre o banner', () => {
      vi.useFakeTimers()
      render(<UpcomingBanner movies={createMovies(3)} onSelectMovie={vi.fn()} />)

      const banner = screen.getByText('Filme 1').closest('button')!
      fireEvent.mouseEnter(banner)

      act(() => {
        vi.advanceTimersByTime(10000)
      })

      expect(screen.getByText('Filme 1')).toBeInTheDocument()
    })
  })
})
