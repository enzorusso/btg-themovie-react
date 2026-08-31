import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useScrollRestoration } from './useScrollRestoration'

const { mockGetScroll, mockSetScroll } = vi.hoisted(() => ({
  mockGetScroll: vi.fn(),
  mockSetScroll: vi.fn(),
}))

vi.mock('./useScrollMemory', () => ({
  useScrollMemory: () => ({ getScroll: mockGetScroll, setScroll: mockSetScroll }),
}))

function mockDocumentHeight(scrollHeight: number) {
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    value: scrollHeight,
    configurable: true,
  })
}

function TestComponent({ isReady }: { isReady: boolean }) {
  useScrollRestoration(isReady)
  return null
}

describe('useScrollRestoration', () => {
  beforeEach(() => {
    mockGetScroll.mockReset().mockReturnValue(undefined)
    mockSetScroll.mockReset()
    vi.mocked(window.scrollTo).mockClear()
    mockDocumentHeight(0)
  })

  it('não restaura nada enquanto isReady é false', () => {
    mockGetScroll.mockReturnValue(500)

    render(
      <MemoryRouter initialEntries={['/']}>
        <TestComponent isReady={false} />
      </MemoryRouter>,
    )

    expect(window.scrollTo).not.toHaveBeenCalled()
  })

  it('rola pro topo quando não há posição salva pra essa entrada de histórico', () => {
    mockGetScroll.mockReturnValue(undefined)
    mockDocumentHeight(2000)

    render(
      <MemoryRouter initialEntries={['/']}>
        <TestComponent isReady />
      </MemoryRouter>,
    )

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('restaura a posição salva quando a página já está alta o suficiente', () => {
    mockGetScroll.mockReturnValue(800)
    mockDocumentHeight(2000)

    render(
      <MemoryRouter initialEntries={['/']}>
        <TestComponent isReady />
      </MemoryRouter>,
    )

    expect(window.scrollTo).toHaveBeenCalledWith(0, 800)
  })

  it('salva a posição de scroll a cada evento de scroll da janela', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <TestComponent isReady />
      </MemoryRouter>,
    )

    Object.defineProperty(window, 'scrollY', { value: 350, configurable: true })
    window.dispatchEvent(new Event('scroll'))

    expect(mockSetScroll).toHaveBeenCalledWith(expect.stringMatching(/^page:/), 350)
  })
})
