import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useScrollMemory } from './useScrollMemory'

const RESTORE_TIMEOUT_MS = 2000

export function useScrollRestoration(isReady: boolean) {
  const location = useLocation()
  const { getScroll, setScroll } = useScrollMemory()
  const key = `page:${location.key}`

  useEffect(() => {
    if (!isReady) return

    const target = getScroll(key) ?? 0
    const canReachTarget = () =>
      document.documentElement.scrollHeight - window.innerHeight >= target

    if (canReachTarget()) {
      window.scrollTo(0, target)
      return
    }

    const observer = new ResizeObserver(() => {
      if (canReachTarget()) {
        cleanup()
        window.scrollTo(0, target)
      }
    })
    observer.observe(document.body)

    const timeoutId = setTimeout(() => {
      cleanup()
      window.scrollTo(0, target)
    }, RESTORE_TIMEOUT_MS)

    function cleanup() {
      observer.disconnect()
      clearTimeout(timeoutId)
    }

    return cleanup
  }, [isReady, key, getScroll])

  useEffect(() => {
    const handleScroll = () => setScroll(key, window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [key, setScroll])
}
