import { useCallback, useMemo, useRef, type ReactNode } from 'react'
import { ScrollMemoryContext } from './scrollMemoryContext'

export function ScrollMemoryProvider({ children }: { children: ReactNode }) {
  const scrollMap = useRef(new Map<string, number>())

  const getScroll = useCallback((key: string) => scrollMap.current.get(key), [])
  const setScroll = useCallback((key: string, value: number) => {
    scrollMap.current.set(key, value)
  }, [])

  const value = useMemo(() => ({ getScroll, setScroll }), [getScroll, setScroll])

  return <ScrollMemoryContext.Provider value={value}>{children}</ScrollMemoryContext.Provider>
}
