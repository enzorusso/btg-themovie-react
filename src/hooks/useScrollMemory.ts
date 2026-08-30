import { useContext } from 'react'
import { ScrollMemoryContext } from '../context/scrollMemoryContext'

export function useScrollMemory() {
  const context = useContext(ScrollMemoryContext)
  if (!context) {
    throw new Error('useScrollMemory deve ser usado dentro de um ScrollMemoryProvider')
  }
  return context
}
