import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    // If navigating on the same path (e.g. query changes), do not scroll
    if (to.path === from.path) {
      return false
    }

    if (savedPosition) {
      return savedPosition
    }

    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }

    // When navigating back to home, restore saved scroll position if available
    if (import.meta.client && (to.path === '/' || to.path === '/ar' || to.path === '/en')) {
      try {
        const saved = sessionStorage.getItem('home_scroll_position')
        if (saved) {
          const y = parseInt(saved, 10)
          if (!isNaN(y) && y > 0) {
            return { top: y, behavior: 'instant' }
          }
        }
      } catch (e) {}
    }

    return { top: 0, left: 0 }
  }
}