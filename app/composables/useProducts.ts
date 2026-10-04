// app/composables/useProducts.ts
import { ref, onMounted, watch } from 'vue'
import {
  fetchProducts,
  fetchCategories,
  type Product,
  type Category,
  type ProductFilters,
  type ProductsResponse
} from '~~/services/productService'

export function useProducts(initialFilters?: ProductFilters) {
  const products = ref<Product[]>([])
  const meta = ref<ProductsResponse['meta'] | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)
  const currentFilters = ref<ProductFilters>({ ...(initialFilters || {}) })

  async function load(filters?: ProductFilters) {
    if (filters) {
      currentFilters.value = { ...currentFilters.value, ...filters }
    }
    loading.value = true
    error.value = null

    try {
      const response = await fetchProducts(currentFilters.value)
      products.value = response.data || []
      meta.value = response.meta || null
    } catch (e: any) {
      error.value = e?.response?.data?.message ?? e?.message ?? 'فشل في تحميل المنتجات'
      console.warn('Products fetch warning:', error.value)
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

  return {
    products,
    meta,
    loading,
    error,
    currentFilters,
    fetch: load,
    refetch: () => load()
  }
}
