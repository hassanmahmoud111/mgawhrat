// app/composables/useHomeData.ts
import { ref, onMounted, watch } from 'vue'
import { fetchHome, type HomeData } from '~~/services/homeService'

export function useHomeData() {
  const data = ref<HomeData | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)


  async function load() {
    loading.value = true
    error.value = null
    try {
      data.value = await fetchHome()
    } catch (e: any) {
      error.value = e?.response?.data?.message ?? e?.message ?? 'Failed to load data'
      console.warn('Home data fetch warning:', error.value)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    load()
  })

  try {
    const { locale } = useI18n()
    watch(locale, () => {
      load()
    })
  } catch (e) {}

  return { data, loading, error, refetch: load }
}