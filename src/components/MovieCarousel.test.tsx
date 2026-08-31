import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMovies } from '../test/factories'
import { MovieCarousel } from './MovieCarousel'

const { mockGetScroll, mockSetScroll } = vi.hoisted(() => ({
  mockGetScroll: vi.fn(),
  mockSetScroll: vi.fn(),
}))

vi.mock('../hooks/useScrollMemory', () => ({
  useScrollMemory: () => ({ getScroll: mockGetScroll, setScroll: mockSetScroll }),
}))

function getScrollContainer() {
  return document.querySelector('.overflow-x-auto') as HTMLDivElement
}

function mockDimensions(container: HTMLDivElement, { scrollWidth = 0, clientWidth = 0 } = {}) {
  Object.defineProperty(container, 'scrollWidth', { value: scrollWidth, configurable: true })
  Object.defineProperty(container, 'clientWidth', { value: clientWidth, configurable: true })
}

describe('MovieCarousel', () => {
  beforeEach(() => {
    mockGetScroll.mockReset().mockReturnValue(undefined)
    mockSetScroll.mockReset()
  })

  it('renderiza um card por filme e chama onSelectMovie ao clicar', async () => {
    const user = userEvent.setup()
    const onSelectMovie = vi.fn()
    render(
      <MovieCarousel title="Populares" movies={createMovies(4)} onSelectMovie={onSelectMovie} />,
    )

    expect(screen.getByText('Populares')).toBeInTheDocument()
    expect(screen.getAllByText(/^Filme \d$/)).toHaveLength(4)

    await user.click(screen.getByText('Filme 3'))
    expect(onSelectMovie).toHaveBeenCalledWith(3)
  })

  it('restaura o scrollLeft salvo ao montar', () => {
    mockGetScroll.mockReturnValue(120)

    render(<MovieCarousel title="Populares" movies={createMovies(4)} onSelectMovie={vi.fn()} />)

    expect(mockGetScroll).toHaveBeenCalledWith('carousel:Populares')
    expect(getScrollContainer().scrollLeft).toBe(120)
  })

  it('começa com as duas setas desabilitadas quando não há conteúdo pra rolar', () => {
    render(<MovieCarousel title="Populares" movies={createMovies(4)} onSelectMovie={vi.fn()} />)

    expect(screen.getByLabelText('Rolar para a esquerda')).toBeDisabled()
    expect(screen.getByLabelText('Rolar para a direita')).toBeDisabled()
  })

  it('habilita a seta direita quando há mais conteúdo do que cabe na tela', () => {
    render(<MovieCarousel title="Populares" movies={createMovies(4)} onSelectMovie={vi.fn()} />)

    const container = getScrollContainer()
    mockDimensions(container, { scrollWidth: 1000, clientWidth: 300 })
    fireEvent(window, new Event('resize'))

    expect(screen.getByLabelText('Rolar para a direita')).toBeEnabled()
    expect(screen.getByLabelText('Rolar para a esquerda')).toBeDisabled()
  })

  it('salva a posição do scroll e reavalia as setas a cada evento de scroll', () => {
    render(<MovieCarousel title="Populares" movies={createMovies(4)} onSelectMovie={vi.fn()} />)

    const container = getScrollContainer()
    mockDimensions(container, { scrollWidth: 1000, clientWidth: 300 })
    container.scrollLeft = 400
    fireEvent.scroll(container)

    expect(mockSetScroll).toHaveBeenCalledWith('carousel:Populares', 400)
    expect(screen.getByLabelText('Rolar para a esquerda')).toBeEnabled()
    expect(screen.getByLabelText('Rolar para a direita')).toBeEnabled()
  })

  it('clicar nas setas rola uma "tela" de cards (clientWidth) na direção certa', async () => {
    const user = userEvent.setup()
    render(<MovieCarousel title="Populares" movies={createMovies(4)} onSelectMovie={vi.fn()} />)

    const container = getScrollContainer()
    mockDimensions(container, { scrollWidth: 1000, clientWidth: 300 })
    fireEvent(window, new Event('resize'))
    const scrollBySpy = vi.spyOn(container, 'scrollBy')

    await user.click(screen.getByLabelText('Rolar para a direita'))
    expect(scrollBySpy).toHaveBeenCalledWith({ left: 300, behavior: 'smooth' })
  })
})
