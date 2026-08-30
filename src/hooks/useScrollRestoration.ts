import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useScrollMemory } from './useScrollMemory'

const MAX_RESTORE_ATTEMPTS = 20

export function useScrollRestoration(isReady: boolean) {
  const location = useLocation()
  const { getScroll, setScroll } = useScrollMemory()
  const key = `page:${location.key}`

  useEffect(() => {
    if (!isReady) return

    const target = getScroll(key) ?? 0
    let attempts = 0
    let frameId: number

    const tryRestore = () => {
      attempts += 1
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      if (maxScroll >= target || attempts >= MAX_RESTORE_ATTEMPTS) {
        window.scrollTo(0, target)
      } else {
        frameId = requestAnimationFrame(tryRestore)
      }
    }

    tryRestore()
    return () => cancelAnimationFrame(frameId)
  }, [isReady, key, getScroll])

  useEffect(() => {
    const handleScroll = () => setScroll(key, window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [key, setScroll])
}
