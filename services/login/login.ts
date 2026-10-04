import { apiUrls } from '../../api_urls'
import apiClient from '../index'

class loginCollection {
  static async login(identifier: string, password?: string, extraData?: any) {
    const isEmail = identifier.includes('@')
    const cleanPhone = identifier.replace(/\s|-/g, '')

    // 1. If it's a phone number, prioritize client and merchant login
    if (!isEmail) {
      const countryId = extraData?.country_id || extraData?.phone_country_id || 1

      // Format phone number: if 9 digits starting with 5, format as 05XXXXXXXX
      let formattedPhone = cleanPhone
      if (formattedPhone.length === 9 && formattedPhone.startsWith('5')) {
        formattedPhone = '0' + formattedPhone
      }

      // Try Client Login (OTP based or password based)
      try {
        const formData = new FormData()
        formData.append('phone', formattedPhone)
        if (countryId) formData.append('phone_country_id', String(countryId))
        if (password) formData.append('password', password)

        const clientResponse = await apiClient.post(apiUrls.auth.clientLogin, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        return { ...clientResponse.data, userType: 'client' }
      } catch (clientError: any) {
        // Fallback 1: Try JSON with formatted phone
        try {
          const clientResponse2 = await apiClient.post(apiUrls.auth.clientLogin, {
            phone: formattedPhone,
            phone_country_id: countryId,
            ...(password ? { password } : {})
          })
          return { ...clientResponse2.data, userType: 'client' }
        } catch (clientError2: any) {
          // Fallback 2: Try with original raw cleanPhone
          try {
            const clientResponse3 = await apiClient.post(apiUrls.auth.clientLogin, {
              phone: cleanPhone,
              phone_country_id: countryId,
              ...(password ? { password } : {})
            })
            return { ...clientResponse3.data, userType: 'client' }
          } catch (clientError3: any) {
            // Fallback 3: Try Merchant Login
            try {
              const merchantResponse = await apiClient.post(apiUrls.auth.merchantLogin, {
                identifier: cleanPhone,
                ...(password ? { password } : {})
              })
              return { ...merchantResponse.data, userType: 'merchant' }
            } catch (merchantError: any) {
              throw clientError?.response?.data ? clientError : (clientError2?.response?.data ? clientError2 : (clientError3?.response?.data ? clientError3 : merchantError))
            }
          }
        }
      }
    }

    // 2. If it's an email, try Admin Login first, then Client Login, then Merchant Login
    try {
      const response = await apiClient.post(apiUrls.auth.adminLogin, {
        email: identifier,
        password,
      })
      return { ...response.data, userType: 'admin' }
    } catch (adminError: any) {
      const status = adminError?.response?.status
      if (status === 401 || status === 404 || status === 422) {
        try {
          const clientResponse = await apiClient.post(apiUrls.auth.clientLogin, {
            email: identifier,
            password,
          })
          return { ...clientResponse.data, userType: 'client' }
        } catch (clientError: any) {
          try {
            const merchantResponse = await apiClient.post(apiUrls.auth.merchantLogin, {
              identifier,
              password,
            })
            return { ...merchantResponse.data, userType: 'merchant' }
          } catch (merchantError: any) {
            throw clientError?.response?.data ? clientError : (merchantError?.response?.data ? merchantError : adminError)
          }
        }
      }
      throw adminError
    }
  }

  static async register(data: any) {
    const response = await apiClient.post(apiUrls.auth.register, data)
    return response.data
  }

  static async getProfile(userType?: string) {
    const url =
      userType === 'merchant'
        ? apiUrls.profile.merchantProfile
        : userType === 'client' || userType === 'user'
          ? apiUrls.profile.clientProfile
          : apiUrls.profile.adminProfile

    const response = await apiClient.get(url)
    return response.data
  }

  static async sendOtp(data: { otp_token?: string; key?: string; signup_key?: string; login_key?: string; type?: string; userType?: string }) {
    const keyVal = data.login_key || data.signup_key || data.key || data.otp_token
    const typeVal = data.type || 'login'

    const formData = new FormData()
    formData.append('type', typeVal)
    formData.append('key', String(keyVal || ''))

    try {
      const response = await apiClient.post(apiUrls.auth.clientResendOtp, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data
    } catch (e: any) {
      try {
        const response = await apiClient.post(apiUrls.auth.clientResendOtp, {
          type: typeVal,
          key: keyVal,
          signup_key: keyVal,
          login_key: keyVal,
        })
        return response.data
      } catch (err2) {
        throw e
      }
    }
  }

  static async verifyOtp(data: { otp_token?: string; key?: string; signup_key?: string; login_key?: string; type?: string; code?: string; otp?: string; userType?: string }) {
    const otpValue = data.otp || data.code
    const keyVal = data.login_key || data.signup_key || data.key || data.otp_token
    const typeVal = data.type || 'login'

    const formData = new FormData()
    formData.append('type', typeVal)
    formData.append('key', String(keyVal || ''))
    formData.append('otp', String(otpValue || ''))

    // 1. Try client verify-otp with form-data (Matching Postman: type, key, otp)
    try {
      const response = await apiClient.post(apiUrls.auth.clientVerifyOtp, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data
    } catch (clientErr: any) {
      // 2. Try JSON payload as fallback
      try {
        const response = await apiClient.post(apiUrls.auth.clientVerifyOtp, {
          type: typeVal,
          key: keyVal,
          otp: otpValue,
          code: otpValue,
          signup_key: keyVal,
          login_key: keyVal,
        })
        return response.data
      } catch (jsonErr) {
        // 3. Try merchant verify-otp fallback
        try {
          const merchantRes = await apiClient.post(apiUrls.auth.merchantVerifyOtp, {
            signup_key: keyVal,
            login_key: keyVal,
            key: keyVal,
            otp: otpValue,
            type: typeVal
          })
          return merchantRes.data
        } catch (merchantErr) {
          throw clientErr
        }
      }
    }
  }

  static async logout() {
    try {
      const response = await apiClient.post(apiUrls.auth.logout)
      return response.data
    } catch (e) {
      return null
    }
  }

  static async deleteAccount() {
    const response = await apiClient.delete(apiUrls.profile.deleteAccount)
    return response.data
  }

  static async updateProfile(data: any, userType: string = 'client') {
    let url = apiUrls.profile.clientProfile
    if (userType === 'merchant') {
      url = apiUrls.profile.merchantProfile
    } else if (userType === 'admin') {
      url = apiUrls.profile.adminProfile
    }

    try {
      const response = await apiClient.put(url, data)
      return response.data
    } catch (putErr: any) {
      try {
        const formData = new FormData()
        formData.append('_method', 'PUT')
        Object.entries(data).forEach(([key, val]) => {
          if (val !== undefined && val !== null) {
            formData.append(key, String(val))
          }
        })
        const postRes = await apiClient.post(url, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        return postRes.data
      } catch (postErr) {
        try {
          const postJsonRes = await apiClient.post(url, { ...data, _method: 'PUT' })
          return postJsonRes.data
        } catch (jsonErr) {
          throw putErr?.response?.data ? putErr : (postErr || jsonErr)
        }
      }
    }
  }
}

export default loginCollection