<template>
  <div
    class="min-h-screen flex items-center justify-center bg-cover bg-center px-4 relative"
    style="background-image: url('https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1600&auto=format&fit=crop');"
  >
    <!-- Dark overlay -->
    <div class="absolute inset-0 bg-black/60"></div>

    <!-- Top logo -->
    <div class="absolute top-6 right-6 z-10">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="w-9 h-9"
      >
        <polygon
          points="12,2 22,12 12,22 2,12"
          fill="none"
          stroke="#D4AF37"
          stroke-width="1"
        />
        <polygon
          points="12,7 17,12 12,17 7,12"
          fill="#D4AF37"
        />
      </svg>
    </div>

    <!-- Modal Card -->
    <div
      class="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl px-8 py-10"
    >

      <!-- Close button -->
      <button
        type="button"
        @click="closeModal"
        class="absolute -top-4 -left-4 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          class="w-4 h-4"
        >
          <path
            stroke-linecap="round"
            d="M6 6l12 12M18 6 6 18"
          />
        </svg>
      </button>

      <!-- Heading -->
      <h1 class="text-2xl font-semibold text-slate-800 text-right mb-1">
        مرحبًا بك من جديد !
      </h1>

      <p class="text-slate-500 text-right mb-6 text-sm">
        سجّل الدخول برقم هاتفك عبر رمز التحقق (OTP)
      </p>

      <!-- Verification Success Alert -->
      <div
        v-if="isVerified"
        class="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm text-right flex items-center gap-2"
      >
        <span class="text-emerald-500 font-bold">✓</span>

        <span>
          تم تأكيد حسابك بنجاح! يمكنك الآن تسجيل الدخول برقم هاتفك.
        </span>
      </div>

      <!-- Login Form -->
      <form
        @submit.prevent="handleLogin"
        class="space-y-5 text-right"
      >

        <!-- Phone Number -->
        <div>
          <label
            class="block text-sm font-medium text-slate-700 mb-1.5"
          >
            رقم الهاتف
          </label>

          <input
            v-model="phone"
            type="tel"
            placeholder="أدخل رقم الهاتف"
            @input="clearErrors"
            required
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all text-left"
          />
        </div>

        <!-- Error Message -->
        <p
          v-if="validationError || authStore.error"
          class="text-center text-red-600 bg-red-50 border border-red-100 rounded-lg py-2.5 px-3 text-xs leading-relaxed"
        >
          {{ validationError || authStore.error }}
        </p>

        <!-- Login Button -->
        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 disabled:opacity-60 text-slate-900 font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 mt-2"
        >
          <span
            v-if="authStore.loading"
            class="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"
          ></span>

          {{ authStore.loading
            ? 'جاري إرسال رمز التحقق...'
            : 'تسجيل الدخول'
          }}
        </button>

        <!-- Merchant Login Button -->
        

        <!-- Merchant sign up link -->
        <p class="text-center text-sm">
          <NuxtLink
            :to="localePath('/auth/merchant/signup')"
            class="text-amber-600 font-semibold hover:underline block text-center"
          >
            إنشاء حساب كتاجر
          </NuxtLink>
        </p>

        <!-- Sign up link -->
        <p class="text-center text-slate-500 text-sm pt-2">
          ليس لديك حساب؟

          <NuxtLink
            :to="localePath('/auth/signup')"
            class="text-amber-600 font-semibold hover:underline"
          >
            إنشاء حساب جديد
          </NuxtLink>
        </p>

        <!-- Delete Account Link on Login -->
        <div class="pt-3 border-t border-slate-100 mt-2 text-center">
          <button
            type="button"
            @click="openDeleteModal"
            class="text-xs text-red-500 hover:text-red-700 font-medium transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            هل ترغب في حذف حسابك؟
          </button>
        </div>

      </form>
    </div>

    <!-- Delete Account Modal on Login -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="rtl">
        <div class="bg-white rounded-2xl max-w-md w-full p-6 text-center shadow-2xl relative border border-red-100">
          
          <!-- Close button -->
          <button
            type="button"
            @click="closeDeleteModal"
            class="absolute top-4 left-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            ✕
          </button>

          <div class="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>

          <h3 class="text-lg font-bold text-gray-900 mb-1">طلب حذف الحساب نهائياً</h3>
          <p class="text-gray-500 text-xs mb-5 leading-relaxed">
            لحذف الحساب، يرجى إدخال رقم هاتفك وتأكيد رمز التحقق لحذف الحساب نهائياً.
          </p>

          <!-- Step 1: Enter Phone to receive OTP -->
          <form v-if="deleteStep === 'phone'" @submit.prevent="handleDeleteSendOtp" class="space-y-4 text-right">
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">رقم الهاتف المسجل</label>
              <input
                v-model="deletePhone"
                type="tel"
                placeholder="أدخل رقم الهاتف"
                required
                class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:border-red-500 focus:bg-white outline-none text-left"
              />
            </div>

            <p v-if="deleteError" class="text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200 text-center">
              {{ deleteError }}
            </p>

            <button
              type="submit"
              :disabled="isDeleting"
              class="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all shadow cursor-pointer flex items-center justify-center gap-2"
            >
              <span v-if="isDeleting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ isDeleting ? 'جاري الإرسال...' : 'إرسال رمز التحقق للحذف' }}
            </button>
          </form>

          <!-- Step 2: Enter OTP to confirm deletion -->
          <form v-else-if="deleteStep === 'otp'" @submit.prevent="handleDeleteVerifyOtp" class="space-y-4 text-center">
            <p class="text-xs text-slate-600">
              أدخل رمز التحقق (OTP) المرسل إلى
              <span class="font-bold text-red-600" dir="ltr">{{ deletePhone }}</span>
            </p>

            <input
              v-model="deleteOtp"
              type="text"
              inputmode="numeric"
              maxlength="4"
              placeholder="0000"
              required
              class="w-36 mx-auto px-4 py-2.5 text-center text-xl font-bold tracking-widest bg-slate-50 border-2 border-red-200 rounded-xl text-slate-800 focus:border-red-500 focus:bg-white outline-none"
            />

            <p v-if="deleteError" class="text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
              {{ deleteError }}
            </p>

            <button
              type="submit"
              :disabled="isDeleting || deleteOtp.length < 4"
              class="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all shadow cursor-pointer flex items-center justify-center gap-2"
            >
              <span v-if="isDeleting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ isDeleting ? 'جاري حذف الحساب...' : 'تأكيد وحذف الحساب نهائياً' }}
            </button>

            <button
              type="button"
              @click="deleteStep = 'phone'"
              class="text-xs text-slate-500 hover:underline block mx-auto cursor-pointer"
            >
              تغيير رقم الهاتف
            </button>
          </form>

          <!-- Step 3: Success message -->
          <div v-else-if="deleteStep === 'done'" class="space-y-4 py-2">
            <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <h4 class="font-bold text-gray-800 text-base">تم حذف الحساب بنجاح</h4>
            <p class="text-xs text-gray-500">تم حذف جميع بياناتك وسجلاتك نهائياً من النظام.</p>
            <button
              type="button"
              @click="closeDeleteModal"
              class="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
            >
              إغلاق
            </button>
          </div>

        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/authStore'

definePageMeta({
  hideHeader: true
})

const authStore = useAuthStore()
const localePath = useLocalePath()
const route = useRoute()

// Phone
const phone = ref('')

// Verification state
const isVerified = ref(false)

// Validation error
const validationError = ref('')

// Clear errors
const clearErrors = () => {
  validationError.value = ''

  if (authStore.error) {
    authStore.error = null
  }
}

// Check phone
const validatePhone = () => {
  clearErrors()

  if (!phone.value || !phone.value.trim()) {
    validationError.value = 'يرجى إدخال رقم الهاتف'
    return false
  }

  return true
}

// Login
async function handleLogin() {
  if (!validatePhone()) return

  try {
    // Remove spaces and dashes only
    const cleanPhone = phone.value.replace(/\s|-/g, '')

    // Login API
    const result = await authStore.loginUser(cleanPhone)

    // If API requires OTP
    if (result?.requiresOtp) {
      await navigateTo(
        localePath({
          path: '/auth/otp',
          query: {
            phone: cleanPhone,
            type: 'login'
          }
        }),
        {
          replace: true
        }
      )
    }

    // If already logged in
    else if (authStore.isLoggedIn) {
      await navigateTo(
        localePath('/profile'),
        {
          replace: true
        }
      )
    }

  } catch (error) {
    console.error('Login failed:', error)
  }
}

// Go to merchant login
function goToMerchantLogin() {
  navigateTo(localePath('/auth/merchant/login'))
}

// Mounted
onMounted(() => {

  // Coming from verification
  if (route.query.verified === 'true') {
    isVerified.value = true
  }

  // Get phone from URL
  if (route.query.phone) {
    phone.value = String(route.query.phone)
  }

  // Otherwise get temporary phone
  else if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('tempPhone')

    if (saved) {
      phone.value = saved
    }
  }
})

// Close modal
function closeModal() {
  navigateTo(localePath('/'))
}

// ====== Delete Account Handlers ======
const showDeleteModal = ref(false)
const deleteStep = ref<'phone' | 'otp' | 'done'>('phone')
const deletePhone = ref('')
const deleteOtp = ref('')
const deleteKey = ref('')
const isDeleting = ref(false)
const deleteError = ref('')

const openDeleteModal = () => {
  deletePhone.value = phone.value || ''
  deleteOtp.value = ''
  deleteError.value = ''
  deleteStep.value = 'phone'
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  deleteStep.value = 'phone'
  deleteOtp.value = ''
  deleteError.value = ''
}

const handleDeleteSendOtp = async () => {
  if (!deletePhone.value || !deletePhone.value.trim()) {
    deleteError.value = 'يرجى إدخال رقم الهاتف'
    return
  }
  isDeleting.value = true
  deleteError.value = ''
  try {
    const clean = deletePhone.value.replace(/\s|-/g, '')
    const res = await authStore.loginUser(clean)
    deleteKey.value = authStore.otpToken || res?.otpToken || ''
    deleteStep.value = 'otp'
  } catch (err: any) {
    deleteError.value = err?.response?.data?.message || err?.message || 'فشل إرسال رمز التحقق'
  } finally {
    isDeleting.value = false
  }
}

const handleDeleteVerifyOtp = async () => {
  if (deleteOtp.value.length < 4) return
  isDeleting.value = true
  deleteError.value = ''
  try {
    // 1. Verify OTP to log in and get auth token
    await authStore.verifyOtp({
      code: deleteOtp.value,
      type: 'login'
    })

    // 2. Call delete account API with the token
    await authStore.deleteAccount()

    deleteStep.value = 'done'
  } catch (err: any) {
    deleteError.value = err?.response?.data?.message || err?.message || 'رمز التحقق غير صحيح أو فشل حذف الحساب'
  } finally {
    isDeleting.value = false
  }
}
</script>