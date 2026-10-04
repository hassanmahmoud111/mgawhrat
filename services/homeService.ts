// services/homeService.ts
import apiClient from './index'
import { apiUrls } from '../api_urls'

export interface Banner {
  id: number
  title: string
  description: string
  image_url: string
  redirect_type: 'product' | 'category' | string
  category_id: number | null
  product_id: number | null
  merchant_profile_id: number | null
  ad_placement_code: string
}

export interface HomeData {
  banners: {
    level_1: Banner[]
    level_2: Banner[]
    level_3: Banner[]
    level_4: Banner[]
  }
  sub_categories: any[]
  categorized_products: any[]
  best_selling: any[]
  new_arrivals: any[]
  offers: any[]
  for_you: any[]
}

export async function fetchHome(): Promise<HomeData> {
  const { data } = await apiClient.get(apiUrls.home.getHomeHeader || 'api/v1/home')
  return data.data
}