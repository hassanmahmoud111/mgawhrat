// app/composables/useAppLocale.ts
import { computed } from 'vue'

export function useAppLocale() {
  const { t, locale, setLocale } = useI18n()
  const localePath = useLocalePath()
  const switchLocalePath = useSwitchLocalePath()
  const route = useRoute()

  const isAr = computed(() => locale.value === 'ar')
  const isEn = computed(() => locale.value === 'en')
  const dir = computed(() => (isAr.value ? 'rtl' : 'ltr'))
  const toggleLabel = computed(() => (isAr.value ? 'EN' : 'العربية'))

  const switchLanguage = async () => {
    const newLocale = isAr.value ? 'en' : 'ar'

    // Update localStorage and cookie immediately for API client and persistence
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('current-lang', newLocale)
        document.cookie = `i18n_redirected=${newLocale}; path=/; max-age=31536000; SameSite=Lax`
      } catch (e) {}
    }

    const scrollY =
      typeof window !== 'undefined'
        ? window.scrollY || document.documentElement.scrollTop || 0
        : 0

    const targetPath = switchLocalePath(newLocale)
    if (targetPath) {
      await navigateTo(targetPath)
    } else if (setLocale) {
      await setLocale(newLocale)
    }

    if (typeof window !== 'undefined') {
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY)
      })
    }
  }

  const isCurrentPath = (path: string) => {
    return route.path === localePath(path)
  }

  return {
    t,
    locale,
    isAr,
    isEn,
    dir,
    toggleLabel,
    switchLanguage,
    localePath,
    isCurrentPath,
  }
}
