import axios, { type AxiosInstance } from 'axios'
import { useAuthStore } from '../app/stores/authStore'

const apiClient: AxiosInstance = axios.create({
  baseURL: 'https://backend1.kazamiza.com/mogwharat',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json, multipart/form-data',
  },
})

// Request Interceptor
apiClient.interceptors.request.use((config) => {
  let token: string | null = null
  let lang = 'ar'

  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token')

    // 1. Check path prefix (/en or /en/...)
    const path = window.location.pathname
    if (path === '/en' || path.startsWith('/en/')) {
      lang = 'en'
    } else if (path === '/ar' || path.startsWith('/ar/')) {
      lang = 'ar'
    } else {
      // 2. Check i18n cookie
      const cookieMatch = document.cookie.match(/(?:^|;\s*)i18n_redirected=([^;]+)/)
      if (cookieMatch && cookieMatch[1]) {
        lang = cookieMatch[1].replace(/["']/g, '').trim()
      } else {
        // 3. Fallback to localStorage or html lang
        lang = localStorage.getItem('current-lang') || document.documentElement.lang || 'ar'
      }
    }
  }

  if (!token) {
    try {
      const store = useAuthStore()
      token = store.token
    } catch (e) {
      // Store may not be initialized yet
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  config.headers['Accept-Language'] = lang === 'en' ? 'en' : 'ar'

  return config
})

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      console.warn('API Response status:', error.response.status, error.response.data)
    } else {
      console.warn('API Request Error:', error.message)
    }

    return Promise.reject(error)
  }
)

export default apiClient