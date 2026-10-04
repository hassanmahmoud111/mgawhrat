import { apiUrls } from '../../api_urls'
import apiClient from '../index'

class signupCollection {
  static async getCountries() {
    const response = await apiClient.get(apiUrls.shared.getCountries)
    return response.data
  }

  static async register(payload: {
    full_name: string
    phone: string
    email: string
    country_id: string | number
    phone_country_id: string | number
    city_id: string | number
  }) {
    const formData = new FormData()
    formData.append('full_name', payload.full_name)
    formData.append('phone', payload.phone)
    formData.append('email', payload.email)
    formData.append('country_id', String(payload.country_id))
    formData.append('phone_country_id', String(payload.phone_country_id))
    formData.append('city_id', String(payload.city_id))
    formData.append('type', 'email')
    formData.append('otp_type', 'email')

    const response = await apiClient.post(apiUrls.auth.register, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }
}

export default signupCollection