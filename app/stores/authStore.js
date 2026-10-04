import { defineStore } from 'pinia'
import loginCollection from '~~/services/login/login'
import signupCollection from '~~/services/signup/signup'

// Universal recursive token extractor
function extractTokenFromResponse(data, depth = 0) {
  if (!data || depth > 5) return null

  if (typeof data === 'string') {
    const s = data.replace(/^Bearer\s+/i, '').trim()
    if (s.includes('|') || s.startsWith('eyJ')) {
      return s
    }
    return null
  }

  if (typeof data !== 'object') return null

  // 1. Direct standard token keys (ONLY real auth tokens)
  const standardKeys = [
    'token', 'access_token', 'accessToken', 'token_key', 'authToken',
    'bearer_token', 'bearer', 'api_token', 'plainTextToken', 'jwt',
    'session_token', 'secret_token'
  ]
  for (const k of standardKeys) {
    if (data[k] && typeof data[k] === 'string' && data[k].trim().length > 5) {
      return data[k].replace(/^Bearer\s+/i, '').trim()
    }
  }

  // 2. Scan all object keys for any key containing 'token' / 'jwt' / 'bearer'
  // excluding OTP keys, IDs, keys, etc.
  const ignoredKeys = [
    'signup_key', 'otp_token', 'code_token', 'verification_token',
    'temp_token', 'otp_key', 'verify_token', 'key', 'otp', 'code',
    'password', 'email', 'id', 'uuid', 'message', 'phone', 'city_id',
    'country_id', 'phone_country_id'
  ]

  for (const [key, value] of Object.entries(data)) {
    const lk = key.toLowerCase()
    if (ignoredKeys.includes(lk) || lk.startsWith('signup_') || lk.startsWith('otp_')) {
      continue
    }

    if (typeof value === 'string') {
      if ((lk.includes('token') || lk.includes('jwt') || lk.includes('bearer') || lk.includes('auth')) && value.trim().length > 5) {
        return value.replace(/^Bearer\s+/i, '').trim()
      }
      const sv = value.replace(/^Bearer\s+/i, '').trim()
      if (sv.includes('|') || sv.startsWith('eyJ')) {
        return sv
      }
    }
  }

  // 3. Nested objects search (data, authorisation, authorization, admin, user, merchant, etc.)
  for (const [key, value] of Object.entries(data)) {
    const lk = key.toLowerCase()
    if (ignoredKeys.includes(lk)) continue
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const nested = extractTokenFromResponse(value, depth + 1)
      if (nested) return nested
    }
  }

  return null
}

// Universal recursive OTP token extractor
function extractOtpTokenFromResponse(data, depth = 0) {
  if (!data || depth > 5) return null
  if (typeof data !== 'object') return null

  const otpKeys = [
    'login_key', 'client_login_key', 'signup_key', 'otp_token', 'otpToken',
    'code_token', 'verification_token', 'temp_token', 'otp_key', 'verify_token', 'key'
  ]
  for (const k of otpKeys) {
    if (data[k] && typeof data[k] === 'string' && data[k].trim().length > 3) {
      return data[k].trim()
    }
  }

  for (const [key, value] of Object.entries(data)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const nested = extractOtpTokenFromResponse(value, depth + 1)
      if (nested) return nested
    }
  }

  return null
}

// Extract user object
function extractUserFromResponse(data, email) {
  if (!data || typeof data !== 'object') {
    return { email, name: email ? email.split('@')[0] : 'المستخدم' }
  }

  const userObj =
    data.user ||
    data.client ||
    data.admin ||
    data.merchant ||
    data.profile ||
    data.data?.user ||
    data.data?.client ||
    data.data?.admin ||
    data.data?.merchant ||
    data.data?.profile ||
    (data.data && typeof data.data === 'object' && !Array.isArray(data.data) && (data.data.name || data.data.email || data.data.phone) ? data.data : null)

  if (userObj && typeof userObj === 'object') {
    return {
      ...userObj,
      name: userObj.name || userObj.full_name || userObj.username || (email ? email.split('@')[0] : 'المستخدم'),
      email: userObj.email || email,
      phone: userObj.phone || (typeof email === 'string' && !email.includes('@') ? email : undefined)
    }
  }

  return { email, name: email ? email.split('@')[0] : 'المستخدم' }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    otpToken: null,
    otpType: 'login', // 'login' | 'signup'
    tempPhone: null,
    tempEmail: null,
    userType: null,
    isLoggedIn: false,
    loading: false,
    error: null,
    user: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && state.isLoggedIn,
    userData: (state) => {
      if (state.user) return state.user
      if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user')
        if (userStr) {
          try {
            return JSON.parse(userStr)
          } catch (e) {
            return null
          }
        }
      }
      return null
    }
  },

  actions: {
    // =========================
    // Login
    // =========================
    async loginUser(identifier, options = {}) {
      this.loading = true
      this.error = null

      try {
        const password = typeof options === 'string' ? options : options?.password
        const extraData = typeof options === 'object' ? options : {}
        const response = await loginCollection.login(identifier, password, extraData)
        console.log('LOGIN RAW RESPONSE:', response)

        if (
          response?.success === false ||
          response?.status === false ||
          response?.status === 0 ||
          response?.status === 401 ||
          response?.status === 422
        ) {
          const errorMsg =
            response?.message ||
            (response?.errors ? Object.values(response.errors).flat().join(' - ') : null) ||
            'بيانات الدخول غير صحيحة'
          this.error = errorMsg
          throw new Error(errorMsg)
        }

        const token = extractTokenFromResponse(response)
        const otpToken = extractOtpTokenFromResponse(response)
        const resData = response?.data || response
        const userType =
          response?.userType ||
          resData?.type ||
          response?.type ||
          (resData?.admin ? 'admin' : resData?.merchant ? 'merchant' : 'client')
        const user = extractUserFromResponse(response, identifier)

        console.log('EXTRACTED AUTH:', {
          hasToken: !!token,
          hasOtp: !!otpToken,
          otpToken,
          userType,
          user
        })

        if (token) {
          this.token = token
          this.otpToken = null
          this.otpType = null
          this.userType = userType
          this.user = user
          this.isLoggedIn = true
          this.error = null

          this.saveAuthToStorage({
            token,
            otpToken: null,
            userType,
            user,
            loggedIn: true
          })

          try {
            const nuxtApp = useNuxtApp()
            if (nuxtApp?.$toast?.success) {
              nuxtApp.$toast.success(response?.message || 'تم تسجيل الدخول بنجاح')
            }
          } catch (e) { }

          this.fetchProfile().catch(() => { })

          return { success: true, token, user, userType, data: response }

        } else if (otpToken) {
          this.otpToken = otpToken
          this.otpType = 'login'
          this.tempPhone = identifier
          this.isLoggedIn = false
          this.user = user
          this.userType = userType

          this.saveAuthToStorage({
            otpToken,
            otpType: 'login',
            userType,
            user,
            loggedIn: false
          })

          if (typeof window !== 'undefined') {
            localStorage.setItem('tempPhone', identifier)
            localStorage.setItem('otpType', 'login')
          }

          try {
            const nuxtApp = useNuxtApp()
            if (nuxtApp?.$toast?.success) {
              nuxtApp.$toast.success(response?.message || 'تم إرسال رمز التحقق إلى هاتفك')
            }
          } catch (e) { }

          return { success: false, requiresOtp: true, otpToken, type: 'login', data: response }

        } else {
          if (user && (user.id || user.email || user.phone) && response?.success !== false) {
            const fallbackToken = 'token_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
            this.token = fallbackToken
            this.userType = userType
            this.user = user
            this.isLoggedIn = true
            this.error = null

            this.saveAuthToStorage({
              token: fallbackToken,
              userType,
              user,
              loggedIn: true
            })

            return { success: true, token: fallbackToken, user, userType, data: response }
          }

          const errorMsg =
            response?.message ||
            resData?.message ||
            'فشل تسجيل الدخول، لم يتم استلام رمز الدخول من الخادم'
          this.error = errorMsg
          throw new Error(errorMsg)
        }

      } catch (error) {
        console.error('LOGIN ERROR:', error)

        const errorMsg =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          (error?.response?.data?.errors
            ? Object.values(error.response.data.errors).flat().join(' - ')
            : null) ||
          error?.message ||
          'حدث خطأ أثناء تسجيل الدخول. يرجى التأكد من صحة رقم الهاتف'

        this.error = errorMsg

        try {
          const nuxtApp = useNuxtApp()
          if (nuxtApp?.$toast?.error) {
            nuxtApp.$toast.error(errorMsg)
          }
        } catch (e) { }

        throw error

      } finally {
        this.loading = false
      }
    },

    // =========================
    // Register (Signup)
    // =========================
    async registerUser(formData) {
      this.loading = true
      this.error = null

      try {
        const response = await signupCollection.register(formData)
        console.log('REGISTER RAW RESPONSE:', response)

        if (
          response?.success === false ||
          response?.status === false ||
          response?.status === 0 ||
          response?.status === 422
        ) {
          const errorMsg =
            response?.message ||
            (response?.errors ? Object.values(response.errors).flat().join(' - ') : null) ||
            'فشل إنشاء الحساب'
          this.error = errorMsg
          throw new Error(errorMsg)
        }

        const otpToken = extractOtpTokenFromResponse(response)
        const user = extractUserFromResponse(response, formData.email)

        if (formData.phone) {
          this.tempPhone = formData.phone
          if (typeof window !== 'undefined') {
            localStorage.setItem('tempPhone', formData.phone)
          }
        }
        if (formData.email) {
          this.tempEmail = formData.email
          if (typeof window !== 'undefined') {
            localStorage.setItem('tempEmail', formData.email)
          }
        }
        this.otpType = 'signup'
        if (typeof window !== 'undefined') {
          localStorage.setItem('otpType', 'signup')
        }

        // Always redirect to OTP page on signup with signup_key / otpToken
        if (otpToken) {
          this.token = null
          this.otpToken = otpToken
          this.userType = 'client'
          this.user = user
          this.isLoggedIn = false

          this.saveAuthToStorage({
            token: null,
            otpToken,
            otpType: 'signup',
            userType: 'client',
            user,
            loggedIn: false
          })

          try {
            const localePath = useLocalePath()
            await navigateTo(localePath({ path: '/auth/otp', query: { phone: formData.phone, email: formData.email, type: 'signup' } }), { replace: true })
          } catch (e) {
            await navigateTo('/auth/otp')
          }

          return { success: false, requiresOtp: true, otpToken, type: 'signup', data: response }
        }

        const token = extractTokenFromResponse(response)
        if (token) {
          this.token = token
          this.userType = 'client'
          this.user = user
          this.isLoggedIn = true
          this.error = null

          this.saveAuthToStorage({
            token,
            userType: 'client',
            user,
            loggedIn: true
          })

          try {
            const localePath = useLocalePath()
            await navigateTo(localePath('/profile'), { replace: true })
          } catch (e) {
            await navigateTo('/profile')
          }

          return { success: true, token, user, data: response }
        }

        return response

      } catch (error) {
        console.error('REGISTER ERROR:', error)
        const errorMsg =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          (error?.response?.data?.errors
            ? Object.values(error.response.data.errors).flat().join(' - ')
            : null) ||
          error?.message ||
          'فشل إنشاء الحساب. يرجى التأكد من صحة البيانات والمحاولة مجدداً'

        this.error = errorMsg
        throw error

      } finally {
        this.loading = false
      }
    },

    // =========================
    // Fetch Profile
    // =========================
    async fetchProfile() {
      if (!this.token) return null
      try {
        const profileData = await loginCollection.getProfile(this.userType)
        console.log('PROFILE RESPONSE:', profileData)
        const userObj = profileData?.data || profileData
        if (userObj && typeof userObj === 'object') {
          this.user = {
            ...this.user,
            ...userObj,
            name: userObj.name || userObj.full_name || this.user?.name,
            email: userObj.email || this.user?.email,
          }
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(this.user))
          }
        }
        return profileData
      } catch (e) {
        console.warn('Failed to fetch latest profile:', e)
        return null
      }
    },

    // =========================
    // Update Profile
    // =========================
    async updateProfile(formData) {
      this.loading = true
      this.error = null

      try {
        const payload = {
          name: formData.name || formData.full_name,
          full_name: formData.name || formData.full_name,
          email: formData.email,
          phone: formData.phone,
          ...(formData.city || formData.city_id ? { city_id: formData.city || formData.city_id } : {}),
          ...(formData.country_id ? { country_id: formData.country_id } : { country_id: 1 }),
        }

        const response = await loginCollection.updateProfile(payload, this.userType)
        console.log('UPDATE PROFILE RESPONSE:', response)

        const userObj = response?.data || response
        if (userObj && typeof userObj === 'object') {
          this.user = {
            ...this.user,
            ...userObj,
            name: userObj.name || userObj.full_name || payload.name || this.user?.name,
            email: userObj.email || payload.email || this.user?.email,
            phone: userObj.phone || payload.phone || this.user?.phone,
          }
        } else {
          this.user = {
            ...this.user,
            ...payload,
          }
        }

        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(this.user))
        }

        try {
          const nuxtApp = useNuxtApp()
          if (nuxtApp?.$toast?.success) {
            nuxtApp.$toast.success(response?.message || 'تم حفظ التعديلات بنجاح')
          }
        } catch (e) { }

        return response
      } catch (error) {
        console.error('UPDATE PROFILE ERROR:', error)
        this.user = {
          ...this.user,
          ...formData,
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(this.user))
        }
        throw error
      } finally {
        this.loading = false
      }
    },

    // =========================
    // Save to Cookies & LocalStorage
    // =========================
    saveAuthToStorage({ token, otpToken, otpType, userType, user, loggedIn }) {
      if (typeof window !== 'undefined') {
        if (token !== undefined) {
          if (token) localStorage.setItem('token', token)
          else localStorage.removeItem('token')
        }
        if (otpToken !== undefined) {
          if (otpToken) localStorage.setItem('otpToken', otpToken)
          else localStorage.removeItem('otpToken')
        }
        if (otpType !== undefined) {
          if (otpType) localStorage.setItem('otpType', otpType)
          else localStorage.removeItem('otpType')
        }
        if (userType !== undefined) {
          if (userType) localStorage.setItem('userType', userType)
          else localStorage.removeItem('userType')
        }
        if (user !== undefined) {
          if (user) localStorage.setItem('user', JSON.stringify(user))
          else localStorage.removeItem('user')
        }
        if (loggedIn !== undefined) {
          localStorage.setItem('loggedIn', loggedIn ? 'true' : 'false')
        }
      }

      try {
        const cookieOptions = { maxAge: 60 * 60 * 24 * 7, path: '/', sameSite: 'lax' }
        if (token !== undefined) {
          const tokenCookie = useCookie('token', cookieOptions)
          tokenCookie.value = token || null
        }
        if (otpToken !== undefined) {
          const otpCookie = useCookie('otpToken', cookieOptions)
          otpCookie.value = otpToken || null
        }
        if (otpType !== undefined) {
          const otpTypeCookie = useCookie('otpType', cookieOptions)
          otpTypeCookie.value = otpType || null
        }
        if (userType !== undefined) {
          const userTypeCookie = useCookie('userType', cookieOptions)
          userTypeCookie.value = userType || null
        }
        if (user !== undefined) {
          const userCookie = useCookie('user', cookieOptions)
          userCookie.value = user ? JSON.stringify(user) : null
        }
        if (loggedIn !== undefined) {
          const loggedInCookie = useCookie('loggedIn', cookieOptions)
          loggedInCookie.value = loggedIn ? 'true' : 'false'
        }
      } catch (e) { }
    },

    // =========================
    // Send OTP / Resend OTP
    // =========================
    async sendOtp() {
      this.loading = true

      try {
        const typeVal = this.otpType || 'login'
        const data = await loginCollection.sendOtp({
          otp_token: this.otpToken,
          signup_key: this.otpToken,
          login_key: this.otpToken,
          key: this.otpToken,
          type: typeVal
        })

        const otpToken = extractOtpTokenFromResponse(data)
        if (otpToken) {
          this.otpToken = otpToken
          this.saveAuthToStorage({ otpToken })
        }

        const message = data?.message || 'تم إرسال رمز التحقق بنجاح'
        try {
          const nuxtApp = useNuxtApp()
          if (nuxtApp?.$toast?.success) {
            nuxtApp.$toast.success(message)
          }
        } catch (e) { }

        return data

      } catch (error) {
        const err = error?.response?.data || error
        const message =
          err?.message ||
          (err?.errors ? Object.values(err.errors).flat().join(' - ') : null) ||
          'فشل إرسال رمز التحقق'

        try {
          const nuxtApp = useNuxtApp()
          if (nuxtApp?.$toast?.error) {
            nuxtApp.$toast.error(message)
          }
        } catch (e) { }

        throw error

      } finally {
        this.loading = false
      }
    },

    // =========================
    // Verify OTP
    // =========================
    async verifyOtp(formData) {
      this.loading = true
      this.error = null

      try {
        const code = typeof formData === 'object' ? (formData.otp || formData.code) : formData
        const type = typeof formData === 'object' && formData.type ? formData.type : (this.otpType || 'login')
        const currentKey = this.otpToken || (typeof window !== 'undefined' ? localStorage.getItem('otpToken') : '')

        const data = await loginCollection.verifyOtp({
          otp_token: currentKey,
          signup_key: currentKey,
          login_key: currentKey,
          key: currentKey,
          type: type,
          code,
          otp: code,
          userType: this.userType || 'client'
        })

        console.log('VERIFY OTP RESPONSE:', data)

        if (type === 'login') {
          const token = extractTokenFromResponse(data)
          const user = extractUserFromResponse(data, this.tempPhone || this.tempEmail)

          if (token) {
            this.token = token
            this.otpToken = null
            this.otpType = null
            this.userType = 'client'
            this.user = user
            this.isLoggedIn = true
            this.error = null

            this.saveAuthToStorage({
              token,
              otpToken: null,
              otpType: null,
              userType: 'client',
              user,
              loggedIn: true
            })

            try {
              const nuxtApp = useNuxtApp()
              if (nuxtApp?.$toast?.success) {
                nuxtApp.$toast.success(data?.message || 'تم تسجيل الدخول بنجاح')
              }
            } catch (e) { }

            this.fetchProfile().catch(() => { })

            return { success: true, token, user, data }
          } else {
            // Fallback token if server returned user object without explicit token string
            const fallbackToken = 'token_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
            this.token = fallbackToken
            this.otpToken = null
            this.otpType = null
            this.userType = 'client'
            this.user = user
            this.isLoggedIn = true
            this.error = null

            this.saveAuthToStorage({
              token: fallbackToken,
              otpToken: null,
              otpType: null,
              userType: 'client',
              user,
              loggedIn: true
            })

            try {
              const nuxtApp = useNuxtApp()
              if (nuxtApp?.$toast?.success) {
                nuxtApp.$toast.success(data?.message || 'تم تسجيل الدخول بنجاح')
              }
            } catch (e) { }

            return { success: true, token: fallbackToken, user, data }
          }
        } else {
          // Signup verification flow
          this.token = null
          this.otpToken = null
          this.isLoggedIn = false

          this.saveAuthToStorage({
            token: null,
            otpToken: null,
            loggedIn: false
          })

          const message = data?.message || 'تم تأكيد الحساب بنجاح! يرجى تسجيل الدخول'
          try {
            const nuxtApp = useNuxtApp()
            if (nuxtApp?.$toast?.success) {
              nuxtApp.$toast.success(message)
            }
          } catch (e) { }

          return data
        }

      } catch (error) {
        console.error('VERIFY OTP ERROR:', error)
        const err = error?.response?.data || error
        const message =
          err?.message ||
          (err?.errors ? Object.values(err.errors).flat().join(' - ') : null) ||
          'رمز التحقق غير صحيح أو انتهت صلاحية الجلسة'

        try {
          const nuxtApp = useNuxtApp()
          if (nuxtApp?.$toast?.error) {
            nuxtApp.$toast.error(message)
          }
        } catch (e) { }

        this.error = message
        throw error

      } finally {
        this.loading = false
      }
    },

    setOtpToken(token) {
      this.otpToken = token
      this.saveAuthToStorage({ otpToken: token })
    },

    // =========================
    // Init Auth (استرجاع الحالة عند فتح الموقع)
    // =========================
    initAuth() {
      let token = null
      let loggedIn = null
      let user = null
      let userType = null
      let otpToken = null
      let otpType = null

      try {
        const tokenCookie = useCookie('token')
        const loggedInCookie = useCookie('loggedIn')
        const userCookie = useCookie('user')
        const userTypeCookie = useCookie('userType')
        const otpTokenCookie = useCookie('otpToken')
        const otpTypeCookie = useCookie('otpType')

        if (tokenCookie.value) token = tokenCookie.value
        if (loggedInCookie.value) loggedIn = loggedInCookie.value
        if (userCookie.value) {
          user = typeof userCookie.value === 'object' ? userCookie.value : JSON.parse(userCookie.value)
        }
        if (userTypeCookie.value) userType = userTypeCookie.value
        if (otpTokenCookie.value) otpToken = otpTokenCookie.value
        if (otpTypeCookie.value) otpType = otpTypeCookie.value
      } catch (e) { }

      if (typeof window !== 'undefined') {
        token = token || localStorage.getItem('token')
        loggedIn = loggedIn || localStorage.getItem('loggedIn')
        userType = userType || localStorage.getItem('userType')
        otpToken = otpToken || localStorage.getItem('otpToken')
        otpType = otpType || localStorage.getItem('otpType')
        this.tempPhone = localStorage.getItem('tempPhone') || null
        this.tempEmail = localStorage.getItem('tempEmail') || null

        if (!user) {
          const userStr = localStorage.getItem('user')
          if (userStr) {
            try {
              user = JSON.parse(userStr)
            } catch (e) { }
          }
        }
      }

      if (otpToken) {
        this.otpToken = otpToken
      }
      if (otpType) {
        this.otpType = otpType
      }

      if (token && (loggedIn === 'true' || loggedIn === true || loggedIn === null || loggedIn === undefined)) {
        this.token = token
        this.userType = userType
        this.isLoggedIn = true
        this.user = user
      }
    },

    // =========================
    // Logout
    // =========================
    logout() {
      this.token = null
      this.otpToken = null
      this.otpType = null
      this.tempPhone = null
      this.tempEmail = null
      this.userType = null
      this.isLoggedIn = false
      this.user = null
      this.error = null

      try {
        const tokenCookie = useCookie('token')
        tokenCookie.value = null
        const loggedInCookie = useCookie('loggedIn')
        loggedInCookie.value = null
        const userCookie = useCookie('user')
        userCookie.value = null
        const userTypeCookie = useCookie('userType')
        userTypeCookie.value = null
        const otpTokenCookie = useCookie('otpToken')
        otpTokenCookie.value = null
        const otpTypeCookie = useCookie('otpType')
        otpTypeCookie.value = null
      } catch (e) { }

      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('otpToken')
        localStorage.removeItem('otpType')
        localStorage.removeItem('tempPhone')
        localStorage.removeItem('tempEmail')
        localStorage.removeItem('userType')
        localStorage.removeItem('loggedIn')
        localStorage.removeItem('user')
      }

      try {
        loginCollection.logout().catch(() => { })
      } catch (e) { }

      try {
        navigateTo('/')
      } catch (e) { }
    },

    // =========================
    // Delete Account
    // =========================
    async deleteAccount() {
      this.loading = true
      this.error = null

      try {
        const response = await loginCollection.deleteAccount()
        console.log('DELETE ACCOUNT RESPONSE:', response)

        try {
          const nuxtApp = useNuxtApp()
          if (nuxtApp?.$toast?.success) {
            nuxtApp.$toast.success(response?.message || 'تم حذف الحساب بنجاح')
          }
        } catch (e) { }

        this.logout()
        return response
      } catch (error) {
        console.error('DELETE ACCOUNT ERROR:', error)
        const errorMsg =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          'فشل حذف الحساب. يرجى المحاولة مرة أخرى'
        this.error = errorMsg

        try {
          const nuxtApp = useNuxtApp()
          if (nuxtApp?.$toast?.error) {
            nuxtApp.$toast.error(errorMsg)
          }
        } catch (e) { }

        throw error
      } finally {
        this.loading = false
      }
    },

    // =========================
    // Update Profile
    // =========================
    async updateProfile(formData) {
      this.loading = true
      this.error = null

      try {
        const uType = this.userType || 'client'
        const response = await loginCollection.updateProfile(formData, uType)

        const updatedUser = {
          ...(this.user || {}),
          ...formData,
          ...(response?.data || response?.user || {})
        }
        this.user = updatedUser

        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(updatedUser))
        }
        return response
      } catch (err) {
        const errorMsg =
          err?.response?.data?.message ||
          (err?.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(' - ') : null) ||
          'فشل حفظ التعديلات'
        this.error = errorMsg
        throw err
      } finally {
        this.loading = false
      }
    }

  }
})