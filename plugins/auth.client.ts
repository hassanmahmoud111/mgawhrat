export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  authStore.initAuth()

  const route = useRoute()
  const localePath = useLocalePath()

  if (authStore.isLoggedIn && (route.path.includes('/auth/login') || route.path.endsWith('/login'))) {
    navigateTo(localePath('/profile'))
  }
})