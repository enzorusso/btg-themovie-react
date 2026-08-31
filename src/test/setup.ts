import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// sem `test.globals: true`, o cleanup automático do RTL entre testes não se
// registra sozinho — precisa ser feito explicitamente aqui
afterEach(() => {
  cleanup()
})

// jsdom não implementa ResizeObserver nem scrollTo/scrollBy — vários componentes
// (useScrollRestoration, MovieCarousel) dependem deles, então mockamos globalmente
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal('ResizeObserver', ResizeObserverStub)

if (!window.HTMLElement.prototype.scrollTo) {
  window.HTMLElement.prototype.scrollTo = vi.fn()
}
if (!window.HTMLElement.prototype.scrollBy) {
  window.HTMLElement.prototype.scrollBy = vi.fn()
}
window.scrollTo = vi.fn()
