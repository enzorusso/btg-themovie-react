import { renderHook } from '@testing-library/react'
import { act } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { ScrollMemoryProvider } from '../context/ScrollMemoryProvider'
import { useScrollMemory } from './useScrollMemory'

describe('useScrollMemory', () => {
  it('lança erro quando usado fora do ScrollMemoryProvider', () => {
    // silencia o console.error que o React imprime quando um hook lança durante o render
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useScrollMemory())).toThrow(
      'useScrollMemory deve ser usado dentro de um ScrollMemoryProvider',
    )
    consoleSpy.mockRestore()
  })

  it('getScroll retorna undefined para uma chave nunca salva', () => {
    const { result } = renderHook(() => useScrollMemory(), {
      wrapper: ScrollMemoryProvider,
    })

    expect(result.current.getScroll('carousel:Populares')).toBeUndefined()
  })

  it('setScroll/getScroll fazem round-trip por chave', () => {
    const { result } = renderHook(() => useScrollMemory(), {
      wrapper: ScrollMemoryProvider,
    })

    act(() => {
      result.current.setScroll('carousel:Populares', 240)
      result.current.setScroll('page:abc123', 900)
    })

    expect(result.current.getScroll('carousel:Populares')).toBe(240)
    expect(result.current.getScroll('page:abc123')).toBe(900)
  })

  it('clear() esvazia todas as chaves salvas', () => {
    const { result } = renderHook(() => useScrollMemory(), {
      wrapper: ScrollMemoryProvider,
    })

    act(() => {
      result.current.setScroll('carousel:Populares', 240)
      result.current.setScroll('page:abc123', 900)
      result.current.clear()
    })

    expect(result.current.getScroll('carousel:Populares')).toBeUndefined()
    expect(result.current.getScroll('page:abc123')).toBeUndefined()
  })
})
