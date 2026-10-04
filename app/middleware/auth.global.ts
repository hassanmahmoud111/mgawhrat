import { useAuthStore } from '~/stores/authStore'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  // Ensure state is restored from storage if empty
  if (!authStore.isLoggedIn) {
    authStore.initAuth()
  }

  const tokenCookie = useCookie('token')
  const loggedInCookie = useCookie('loggedIn')

  let token = authStore.token || tokenCookie.value
  let loggedIn = authStore.isLoggedIn || loggedInCookie.value

  if (import.meta.client && (!token || !loggedIn)) {
    token = token || localStorage.getItem('token')
    loggedIn = loggedIn || (localStorage.getItem('loggedIn') === 'true')
  }

  const isLoggedIn =
    Boolean(authStore.isLoggedIn) ||
    Boolean(authStore.isAuthenticated) ||
    (Boolean(token) && loggedIn !== 'false' && loggedIn !== false)

  const localePath = useLocalePath()

  const isAuthPage =
    to.path.includes('/auth/login') ||
    to.path.includes('/auth/otp') ||
    to.path.includes('/auth/register') ||
    to.path.includes('/auth/signup') ||
    to.path.endsWith('/login') ||
    to.path.endsWith('/register') ||
    to.path.endsWith('/signup')

  const isProtectedPage =
    to.path.includes('/profile') ||
    // to.meta.middleware === 'auth' ||
    (Array.isArray(to.meta.middleware) && to.meta.middleware.includes('auth'))

  // لو مش مسجل دخول وبيحاول يدخل صفحة محمية (زي البروفايل)
  if (!isLoggedIn && isProtectedPage) {
    return navigateTo(localePath('/auth/login'))
  }

  // لو مسجل دخول وحاول يدخل أو يرجع لصفحة تسجيل الدخول، يتم توجيهه مباشرة للبروفايل ولا تظهر صفحة الدخول إلا بعد الـ logout
  if (isLoggedIn && isAuthPage) {
    return navigateTo(localePath('/profile'), { replace: true })
  }
})