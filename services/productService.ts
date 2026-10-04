// services/productService.ts
import apiClient from './index'
import { apiUrls } from '../api_urls'

export interface ProductTitle {
  ar?: string
  en?: string
}

export interface ProductImage {
  id: number
  type?: string
  mime_type?: string
  url: string
}

export interface ProductStore {
  id: number
  name: string
  slug?: string
  image?: string
  rating?: number
  reviews_count?: number
}

export interface ProductCurrency {
  currency_code: string
}

export interface ProductVariant {
  id: number
  product_id: number
  model_number?: string
  barcode?: string
  carat?: string
  karat?: string
  color?: string
  size?: string
  weight?: number
  price: number
  base_price?: number
  final_price?: number
}

export interface Product {
  id: number
  name: string
  title?: ProductTitle
  description?: string
  summary?: string
  main_category?: string
  sub_category?: string
  additional_category?: string | null
  type?: string
  model_number?: string
  barcode?: string
  carat?: string
  karat?: string
  color?: string
  brand_id?: number | null
  brand?: any
  gender?: string
  is_returnable?: boolean
  size?: string
  weight?: number
  quantity?: number
  stock?: number
  in_stock?: boolean
  price: number
  base_price?: number
  final_price?: number
  discount_amount?: number
  discount_percentage?: number
  currency?: ProductCurrency
  images?: ProductImage[]
  main_image?: ProductImage
  store?: ProductStore
  average_rating?: number
  reviews_count?: number
  is_fav?: boolean
  variants?: ProductVariant[]
}

export interface Category {
  id: number
  parent_id?: number | null
  type?: string
  sort_order?: number
  products_count?: number
  name: string
  image_url?: string
}

export interface ProductsResponse {
  data: Product[]
  meta?: {
    current_page: number
    from?: number
    last_page: number
    per_page: number
    to?: number
    total: number
  }
  links?: any
  user_city?: string | null
}

export interface ProductFilters {
  category_id?: number | string
  merchant_id?: number | string
  store_id?: number | string
  color?: string
  min_price?: number | null
  max_price?: number | null
  search?: string
  sort_by?: string
  page?: number
  per_page?: number
}

export async function fetchProducts(filters?: ProductFilters): Promise<ProductsResponse> {
  const params: Record<string, any> = {}
  if (filters) {
    if (filters.category_id !== undefined && filters.category_id !== null && filters.category_id !== '') {
      params.category_id = filters.category_id
    }
    if (filters.merchant_id !== undefined && filters.merchant_id !== null && filters.merchant_id !== '') {
      params.merchant_id = filters.merchant_id
    }
    if (filters.color) {
      params.color = filters.color
    }
    if (filters.min_price != null && filters.min_price !== '') {
      params.min_price = filters.min_price
    }
    if (filters.max_price != null && filters.max_price !== '') {
      params.max_price = filters.max_price
    }
    if (filters.search) {
      params.search = filters.search
    }
    if (filters.sort_by) {
      params.sort_by = filters.sort_by
    }
    if (filters.page) {
      params.page = filters.page
    }
    if (filters.per_page) {
      params.per_page = filters.per_page
    }
  }

  const endpoint = apiUrls.products?.getProducts || 'api/v1/products'
  const response = await apiClient.get<ProductsResponse>(endpoint, { params })
  return response.data
}

export async function fetchProductById(id: string | number): Promise<Product> {
  const endpoint = typeof apiUrls.products?.getProductDetails === 'function'
    ? apiUrls.products.getProductDetails(id)
    : `api/v1/products/${id}`

  const response = await apiClient.get<{ data: Product }>(endpoint)
  return response.data.data
}

export async function fetchCategories(): Promise<Category[]> {
  const endpoint = apiUrls.categories?.getCategories || 'api/v1/shared/categories'
  const response = await apiClient.get<{ data: Category[] }>(endpoint)
  return response.data.data
}
