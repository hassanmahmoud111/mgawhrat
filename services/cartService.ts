import apiClient from './index'
import { apiUrls } from '../api_urls'

export interface CartProduct {
  id: number
  cart_item_id?: number
  product_id: number
  quantity: number
  price?: number
  final_price?: number
  base_price?: number
  image?: string
  name?: string
  product?: {
    id: number
    title?: { ar?: string; en?: string }
    name?: string
    main_image?: { url: string }
    images?: { url: string }[]
  }
}

export interface CartMerchant {
  store_name: string
  items?: CartProduct[]
  products?: CartProduct[]
  cart_items?: CartProduct[]
}

export interface CartResponse {
  merchants: CartMerchant[]
  subtotal: number
  tax_amount: number
  total: number
}

export async function fetchCart(): Promise<CartResponse> {
  const { data } = await apiClient.get(apiUrls.cart.getCart)
  return data?.data || data
}

export async function addToCart(payload: {
  product_id: number | string
  quantity?: number
  variant_id?: number | string
  [key: string]: any
}): Promise<any> {
  const { data } = await apiClient.post(apiUrls.cart.addToCart, payload)
  return data?.data || data
}

export async function incrementCartItem(id: number | string): Promise<CartResponse> {
  const { data } = await apiClient.post(apiUrls.cart.incrementItem(id))
  return data?.data || data
}

export async function decrementCartItem(id: number | string): Promise<CartResponse> {
  const { data } = await apiClient.post(apiUrls.cart.decrementItem(id))
  return data?.data || data
}

export async function removeCartItem(id: number | string): Promise<CartResponse> {
  const { data } = await apiClient.delete(apiUrls.cart.removeItem(id))
  return data?.data || data
}

export async function applyCoupon(code: string): Promise<CartResponse> {
  const { data } = await apiClient.post(apiUrls.cart.applyCoupon, { code })
  return data?.data || data
}