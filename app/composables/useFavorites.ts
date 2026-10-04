// app/composables/useFavorites.ts
import { computed } from 'vue'
import { useAuthStore } from '../stores/authStore'
import apiClient from '~~/services/index'

export interface FavoriteProduct {
  id: number | string
  name: string
  price: string | number
  image?: string
  store?: string
}

const FAVORITES_STORAGE_KEY = 'mogwharat_favorites'

export const useFavorites = () => {
  // ✅ useI18n() و useCart() اتنادوا هنا فوق (وقت الـ setup) مش جوه دوال async
  const { locale } = useI18n()
  const { showToast } = useCart()

  const favorites = useState<FavoriteProduct[]>('favoritesList', () => [])
  const favoritesLoading = useState<boolean>('favoritesLoading', () => false)

  const hasToken = (): boolean => {
    if (typeof window === 'undefined') return false
    try {
      const authStore = useAuthStore()
      if (authStore.token || authStore.isLoggedIn) {
        const tok = authStore.token
        if (tok && typeof tok === 'string' && !tok.startsWith('token_')) {
          return true
        }
      }
    } catch (e) {}
    const token = localStorage.getItem('token')
    return !!token && token !== 'null' && token !== 'undefined' && !token.startsWith('token_')
  }

  const loadLocalFavorites = (): FavoriteProduct[] => {
    if (typeof window === 'undefined') return []
    try {
      const raw = localStorage.getItem(FAVORITES_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          return parsed
        }
      }
    } catch (e) {
      console.warn('Error reading local favorites:', e)
    }
    return []
  }

  const saveLocalFavorites = (list: FavoriteProduct[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(list))
      } catch (e) {
        console.warn('Error saving local favorites:', e)
      }
    }
  }

  const isFavorite = (id: number | string): boolean => {
    return favorites.value.some(p => String(p.id) === String(id))
  }

  const fetchFavorites = async () => {
    favoritesLoading.value = true
    try {
      const local = loadLocalFavorites()
      if (local.length && !favorites.value.length) {
        favorites.value = local
      }

      if (hasToken()) {
        try {
          const res = await apiClient.get('api/v1/favorites')
          const list = res.data?.data || res.data || []
          if (Array.isArray(list) && list.length) {
            const apiItems: FavoriteProduct[] = list.map((item: any) => ({
              id: item.id || item.product_id || item.product?.id,
              name: item.name || item.title?.ar || item.title?.en || item.product?.name || 'منتج',
              price: item.price || item.final_price || item.product?.final_price || item.product?.price || '',
              image: item.image || item.main_image?.url || item.product?.main_image?.url || '/diamond-ring.jpg',
              store: item.store?.name || item.shop || ''
            }))
            favorites.value = apiItems
            saveLocalFavorites(apiItems)
            return apiItems
          }
        } catch (apiErr) {
          console.warn('API favorites fetch failed, keeping local:', apiErr)
        }
      }

      favorites.value = local
      return favorites.value
    } finally {
      favoritesLoading.value = false
    }
  }

  const toggleFavorite = async (product: any): Promise<boolean> => {
    if (!product) return false
    const id = product.id || product.productId || product.product_id
    if (!id) return false

    const exists = isFavorite(id)
    const productName = product.name || product.title?.ar || product.title?.en || product.title || 'منتج'

    if (exists) {
      favorites.value = favorites.value.filter(p => String(p.id) !== String(id))
      saveLocalFavorites(favorites.value)

      if (hasToken()) {
        apiClient.delete('api/v1/favorites/' + id).catch(() => {})
      }

      // ✅ template literals سليمة، وبتستخدم locale اللي جبناها فوق
      const msg = locale.value === 'ar'
        ? `تمت إزالة "${productName}" من المفضلة`
        : `Removed "${productName}" from favorites`
      showToast(msg)

      return false
    } else {
      const newItem: FavoriteProduct = {
        id,
        name: productName,
        price: product.price || product.final_price || '',
        image: product.image || product.mainImage || product.main_image?.url || (product.images && product.images[0]?.url) || '/diamond-ring.jpg',
        store: product.store?.name || product.store || product.shop || ''
      }

      favorites.value = [newItem, ...favorites.value.filter(p => String(p.id) !== String(id))]
      saveLocalFavorites(favorites.value)

      if (hasToken()) {
        apiClient.post('api/v1/favorites', { product_id: id }).catch(() => {})
      }

      const msg = locale.value === 'ar'
        ? `تمت إضافة "${productName}" إلى المفضلة ❤️`
        : `Added "${productName}" to favorites ❤️`
      showToast(msg)

      return true
    }
  }

  const removeFavorite = async (id: number | string) => {
    favorites.value = favorites.value.filter(p => String(p.id) !== String(id))
    saveLocalFavorites(favorites.value)

    if (hasToken()) {
      apiClient.delete('api/v1/favorites/' + id).catch(() => {})
    }

    const msg = locale.value === 'ar' ? 'تمت الإزالة من المفضلة' : 'Removed from favorites'
    showToast(msg)
  }

  const favoritesCount = computed(() => favorites.value.length)

  return {
    favorites,
    favoritesLoading,
    favoritesCount,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    fetchFavorites
  }
}