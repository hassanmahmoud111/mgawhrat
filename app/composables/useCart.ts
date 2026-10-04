// composables/useCart.ts
import { computed } from 'vue'
import { useAuthStore } from '../stores/authStore'
import {
  fetchCart as apiFetchCart,
  addToCart as apiAddToCart,
  incrementCartItem as apiIncrementCartItem,
  decrementCartItem as apiDecrementCartItem,
  removeCartItem as apiRemoveCartItem,
  applyCoupon as apiApplyCoupon,
  type CartResponse,
  type CartProduct,
  type CartMerchant
} from '~~/services/cartService'

const STORAGE_KEY = 'mogwharat_guest_cart'

const cleanPrice = (val: any): number => {
  if (val === null || val === undefined) return 0
  if (typeof val === 'number') return isNaN(val) ? 0 : val
  if (typeof val === 'string') {
    const cleaned = val.replace(/,/g, '').replace(/[^\d.-]/g, '')
    const num = parseFloat(cleaned)
    return isNaN(num) ? 0 : num
  }
  return 0
}

export const useCart = () => {
  // ✅ ننادي useI18n() هنا فوق (وقت الـ setup)، مش جوه دوال بتتنفذ بعدين
  const { locale } = useI18n()

  const cartData = useState<CartResponse | null>('cartData', () => null)
  const cartLoading = useState<boolean>('cartLoading', () => false)

  // ✅ بقينا بنستخدم نظام التوست العام (الأخضر) بدل نظام خاص بالكارت
  const { showToast } = useToast()

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

  const loadLocalCart = (): CartResponse => {
    if (typeof window === 'undefined') {
      return { merchants: [], subtotal: 0, tax_amount: 0, total: 0 }
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && Array.isArray(parsed.merchants)) {
          return parsed
        }
      }
    } catch (e) {
      console.warn('Error reading local cart:', e)
    }
    return { merchants: [], subtotal: 0, tax_amount: 0, total: 0 }
  }

  const saveLocalCart = (cart: CartResponse) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
      } catch (e) {
        console.warn('Error saving local cart:', e)
      }
    }
  }

  const recalculateCart = (cart: CartResponse): CartResponse => {
    let subtotal = 0
    for (const m of cart.merchants || []) {
      const items = m.items || m.products || m.cart_items || []
      for (const item of items) {
        const price = cleanPrice(item.final_price ?? item.price ?? 0)
        const qty = Math.max(1, Number(item.quantity ?? item.qty ?? 1) || 1)
        subtotal += price * qty
      }
    }
    subtotal = Math.round(subtotal * 100) / 100
    const tax_amount = Math.round(subtotal * 0.15 * 100) / 100
    const total = Math.round((subtotal + tax_amount) * 100) / 100
    return {
      merchants: cart.merchants || [],
      subtotal,
      tax_amount,
      total
    }
  }

  const fetchCart = async () => {
    cartLoading.value = true
    try {
      if (hasToken()) {
        const data = await apiFetchCart()
        const normalized = (data as any)?.data || data
        if (normalized && (normalized.merchants || normalized.total !== undefined)) {
          cartData.value = normalized
          return cartData.value
        }
      }
      cartData.value = loadLocalCart()
      return cartData.value
    } catch (err: any) {
      console.warn('fetchCart warning, using local cart:', err?.message || err)
      cartData.value = loadLocalCart()
      return cartData.value
    } finally {
      cartLoading.value = false
    }
  }

  const addToCart = async (product: any, quantity: number = 1, options: any = {}) => {
    if (!product) return { success: false }
    const qty = Math.max(1, Number(quantity) || 1)
    const productId = Number(product.id || product.productId || product.product_id) || Date.now()
    const productName = product.name || product.title?.ar || product.title?.en || product.title || 'منتج'
    const productPrice = cleanPrice(product.final_price ?? product.price ?? 0)
    const basePrice = product.base_price ? cleanPrice(product.base_price) : undefined
    const productImage = product.mainImage || product.main_image?.url || (product.images && product.images[0]?.url) || product.image || '/diamond-ring.jpg'
    const storeName = product.store?.name || (typeof product.store === 'string' ? product.store : '') || product.shop || 'مجوهرات'

    let apiSuccess = false

    if (hasToken()) {
      try {
        await apiAddToCart({
          product_id: productId,
          quantity: qty,
          ...(options.variant_id ? { variant_id: options.variant_id } : {})
        })
        apiSuccess = true
        await fetchCart()
      } catch (err) {
        console.warn('apiAddToCart failed, falling back to local cart:', err)
      }
    }

    if (!apiSuccess) {
      const current = cartData.value || loadLocalCart()
      const merchants = [...(current.merchants || [])]

      let merchant = merchants.find(m => m.store_name === storeName)
      if (!merchant) {
        merchant = { store_name: storeName, items: [] }
        merchants.push(merchant)
      }

      if (!merchant.items) {
        merchant.items = []
      }

      const existingItem = merchant.items.find(
        (it: any) => (
          String(it.product_id) === String(productId) ||
          String(it.product?.id) === String(productId) ||
          String(it.id) === String(productId)
        )
      )

      if (existingItem) {
        existingItem.quantity = (Number(existingItem.quantity) || 0) + qty
        if (productPrice > 0) {
          existingItem.price = productPrice
          existingItem.final_price = productPrice
        }
      } else {
        const newItem: CartProduct = {
          id: Date.now() + Math.floor(Math.random() * 1000),
          cart_item_id: Date.now() + Math.floor(Math.random() * 1000),
          product_id: productId,
          quantity: qty,
          price: productPrice,
          final_price: productPrice,
          base_price: basePrice,
          image: productImage,
          name: productName,
          product: {
            id: productId,
            name: productName,
            title: { ar: productName, en: productName },
            main_image: { url: productImage },
            images: [{ url: productImage }]
          }
        }
        merchant.items.push(newItem)
      }

      const updatedCart = recalculateCart({ merchants, subtotal: 0, tax_amount: 0, total: 0 })
      cartData.value = updatedCart
      saveLocalCart(updatedCart)
    }

    // ✅ توست عام (نفس الشكل الأخضر في كل الموقع)
    const msg = locale.value === 'ar'
      ? 'تمت إضافة المنتج إلى السلة بنجاح'
      : 'Product added to cart successfully'
    showToast(msg, 'success')

    return { success: true }
  }

  const incrementItem = async (id: number | string) => {
    let apiSuccess = false
    if (hasToken()) {
      try {
        await apiIncrementCartItem(id)
        apiSuccess = true
        await fetchCart()
      } catch (err) {
        console.warn('apiIncrementCartItem failed, falling back to local update:', err)
      }
    }

    if (!apiSuccess) {
      const current = cartData.value || loadLocalCart()
      for (const m of current.merchants || []) {
        const items = m.items || m.products || m.cart_items || []
        const item = items.find((it: any) => String(it.id) === String(id) || String(it.cart_item_id) === String(id) || String(it.product_id) === String(id))
        if (item) {
          item.quantity = (Number(item.quantity) || 1) + 1
          break
        }
      }
      const updated = recalculateCart(current)
      cartData.value = updated
      saveLocalCart(updated)
    }
  }

  const decrementItem = async (id: number | string) => {
    let apiSuccess = false
    if (hasToken()) {
      try {
        await apiDecrementCartItem(id)
        apiSuccess = true
        await fetchCart()
      } catch (err) {
        console.warn('apiDecrementCartItem failed, falling back to local update:', err)
      }
    }

    if (!apiSuccess) {
      const current = cartData.value || loadLocalCart()
      for (const m of current.merchants || []) {
        const items = m.items || m.products || m.cart_items || []
        const item = items.find((it: any) => String(it.id) === String(id) || String(it.cart_item_id) === String(id) || String(it.product_id) === String(id))
        if (item) {
          if (item.quantity > 1) {
            item.quantity -= 1
          } else {
            m.items = items.filter((it: any) => it !== item)
          }
          break
        }
      }
      current.merchants = (current.merchants || []).filter(m => {
        const items = m.items || m.products || m.cart_items || []
        return items.length > 0
      })
      const updated = recalculateCart(current)
      cartData.value = updated
      saveLocalCart(updated)
    }
  }

  const removeItem = async (id: number | string) => {
    let apiSuccess = false
    if (hasToken()) {
      try {
        await apiRemoveCartItem(id)
        apiSuccess = true
        await fetchCart()
      } catch (err) {
        console.warn('apiRemoveCartItem failed, falling back to local remove:', err)
      }
    }

    if (!apiSuccess) {
      const current = cartData.value || loadLocalCart()
      for (const m of current.merchants || []) {
        if (m.items) {
          m.items = m.items.filter((it: any) => String(it.id) !== String(id) && String(it.cart_item_id) !== String(id) && String(it.product_id) !== String(id))
        }
        if (m.products) {
          m.products = m.products.filter((it: any) => String(it.id) !== String(id) && String(it.cart_item_id) !== String(id) && String(it.product_id) !== String(id))
        }
        if (m.cart_items) {
          m.cart_items = m.cart_items.filter((it: any) => String(it.id) !== String(id) && String(it.cart_item_id) !== String(id) && String(it.product_id) !== String(id))
        }
      }
      current.merchants = (current.merchants || []).filter(m => {
        const items = m.items || m.products || m.cart_items || []
        return items.length > 0
      })
      const updated = recalculateCart(current)
      cartData.value = updated
      saveLocalCart(updated)
    }
  }

  const cartCount = computed(() => {
    const merchants = cartData.value?.merchants || []
    let totalQty = 0
    for (const m of merchants) {
      const items = m.items || m.products || m.cart_items || []
      for (const item of items) {
        totalQty += Number(item.quantity ?? item.qty ?? 1)
      }
    }
    return totalQty
  })

  const applyCoupon = async (code: string): Promise<{ success: boolean; message?: string }> => {
    if (!code || !code.trim()) {
      const msg = locale.value === 'ar' ? 'من فضلك أدخل كود الخصم' : 'Please enter a coupon code'
      showToast(msg, 'error')
      return { success: false, message: msg }
    }

    if (hasToken()) {
      try {
        const data = await apiApplyCoupon(code.trim())
        const normalized = (data as any)?.data || data
        if (normalized) {
          cartData.value = normalized
          const msg = locale.value === 'ar' ? 'تم تفعيل الكوبون بنجاح 🎉' : 'Coupon applied successfully 🎉'
          showToast(msg, 'success')
          return { success: true }
        }
      } catch (err: any) {
        const msg = err?.response?.data?.message
          || (locale.value === 'ar' ? 'كود الخصم غير صالح' : 'Invalid coupon code')
        showToast(msg, 'error')
        return { success: false, message: msg }
      }
    }

    // مفيش تسجيل دخول = مقدرش يتحقق من كوبون حقيقي من السيرفر
    const msg = locale.value === 'ar'
      ? 'يجب تسجيل الدخول لاستخدام كود الخصم'
      : 'Please login to use a coupon code'
    showToast(msg, 'error')
    return { success: false, message: msg }
  }

  return {
    cartData,
    cartLoading,
    cartCount,
    fetchCart,
    addToCart,
    incrementItem,
    decrementItem,
    removeItem,
    applyCoupon
  }
}