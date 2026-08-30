import { createContext } from 'react'

export interface ScrollMemoryContextValue {
  getScroll: (key: string) => number | undefined
  setScroll: (key: string, value: number) => void
  clear: () => void
}

export const ScrollMemoryContext = createContext<ScrollMemoryContextValue | null>(null)
