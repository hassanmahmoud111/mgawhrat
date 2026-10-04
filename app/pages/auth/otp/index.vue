<template>
  <div
    class="min-h-screen flex items-center justify-center bg-cover bg-center px-4 relative"
    style="background-image: url('https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1600&auto=format&fit=crop');"
  >
    <!-- Dark overlay -->
    <div class="absolute inset-0 bg-black/60"></div>

    <!-- Modal Card -->
    <div class="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl px-8 py-10 text-center">

      <h1 class="text-2xl font-bold text-slate-800 mb-2">
        تأكيد رمز التحقق
      </h1>
      <p class="text-slate-500 text-sm mb-6 leading-relaxed">
        {{ isLoginOtp ? 'تم إرسال رمز التحقق إلى رقم هاتفك' : 'تم إرسال رمز التحقق إلى بريدك الإلكتروني' }}
        <span v-if="targetRecipient" class="block font-bold text-amber-600 mt-1.5 text-base" dir="ltr">
          {{ targetRecipient }}
        </span>
      </p>

      <form @submit.prevent="handleVerify" class="space-y-6">

        <!-- OTP 4 Boxes -->
        <div class="flex justify-center gap-3" dir="ltr">
          <input
            v-for="(digit, index) in otpDigits"
            :key="index"
            :ref="el => setInputRef(el, index)"
            v-model="otpDigits[index]"
            type="text"
            inputmode="numeric"
            maxlength="1"
            class="w-14 h-14 text-center text-2xl font-bold border-2 border-slate-300 rounded-xl focus:border-amber-500 outline-none text-slate-800 transition-colors"
            @input="handleInput(index, $event)"
            @keydown="handleKeydown(index, $event)"
            @paste="handlePaste"
          />
        </div>

        <p v-if="authStore.error" class="text-center text-red-600 bg-red-50 border border-red-100 rounded-lg py-2.5 px-3 text-xs leading-relaxed">
          {{ authStore.error }}
        </p>

        <button
          type="submit"
          :disabled="authStore.loading || otpCode.length < 4"
          class="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 disabled:opacity-60 text-slate-900 font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
        >
          <span v-if="authStore.loading" class="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></span>
          {{ authStore.loading ? 'جاري التحقق...' : 'تأكيد الرمز' }}
        </button>

        <div class="flex justify-between items-center text-sm pt-2">
          <button
            type="button"
            @click="handleResend"
            :disabled="authStore.loading || resendTimer > 0"
            class="text-amber-600 font-medium hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer"
          >
            {{ resendTimer > 0 ? `إعادة الإرسال بعد (${resendTimer} ثانية)` : 'إعادة إرسال الرمز' }}
          </button>

          <NuxtLink :to="localePath('/auth/login')" class="text-slate-500 hover:text-slate-800 transition-colors">
            العودة لتسجيل الدخول
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '~/stores/authStore'

definePageMeta({
  hideHeader: true
})

const authStore = useAuthStore()
const localePath = useLocalePath()
const route = useRoute()
const resendTimer = ref(60)
let timerInterval = null

// ====== OTP 4 Boxes Logic ======
const otpDigits = ref(['', '', '', ''])
const inputRefs = ref([])

const setInputRef = (el, index) => {
  if (el) inputRefs.value[index] = el
}

const otpCode = computed(() => otpDigits.value.join(''))

const handleInput = (index, event) => {
  const value = event.target.value.replace(/[^0-9]/g, '')
  otpDigits.value[index] = value.slice(-1)

  if (value && index < otpDigits.value.length - 1) {
    inputRefs.value[index + 1]?.focus()
  }
}

const handleKeydown = (index, event) => {
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    inputRefs.value[index - 1]?.focus()
  }
}

const handlePaste = (event) => {
  event.preventDefault()
  const pasted = event.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 4)
  pasted.split('').forEach((char, i) => {
    otpDigits.value[i] = char
  })
  const nextIndex = Math.min(pasted.length, otpDigits.value.length - 1)
  inputRefs.value[nextIndex]?.focus()
}
// ================================

const currentOtpType = computed(() => {
  if (route.query.type) return String(route.query.type)
  if (authStore.otpType) return authStore.otpType
  if (typeof window !== 'undefined') {
    return localStorage.getItem('otpType') || 'login'
  }
  return 'login'
})

const isLoginOtp = computed(() => currentOtpType.value === 'login')

const targetRecipient = computed(() => {
  if (isLoginOtp.value) {
    return (
      route.query.phone ||
      authStore.tempPhone ||
      (typeof window !== 'undefined' ? localStorage.getItem('tempPhone') : '') ||
      ''
    )
  }
  return (
    route.query.email ||
    authStore.tempEmail ||
    (typeof window !== 'undefined' ? localStorage.getItem('tempEmail') : '') ||
    route.query.phone ||
    authStore.tempPhone ||
    ''
  )
})

const startResendTimer = () => {
  resendTimer.value = 60
  if (timerInterval) clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    if (resendTimer.value > 0) {
      resendTimer.value--
    } else {
      clearInterval(timerInterval)
    }
  }, 1000)
}

onMounted(() => {
  startResendTimer()
  inputRefs.value[0]?.focus()
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})

const handleVerify = async () => {
  if (otpCode.value.length < 4) return

  try {
    const type = currentOtpType.value
    await authStore.verifyOtp({ code: otpCode.value, type })

    if (type === 'login') {
      // Logged in successfully!
      await navigateTo(localePath('/profile'), { replace: true })
    } else {
      // Signup OTP verified -> redirect to login with query param
      const phoneToPass =
        route.query.phone ||
        authStore.tempPhone ||
        (typeof window !== 'undefined' ? localStorage.getItem('tempPhone') : '') ||
        ''

      await navigateTo(
        localePath({
          path: '/auth/login',
          query: { phone: phoneToPass, verified: 'true' }
        }),
        { replace: true }
      )
    }
  } catch (error) {
    console.error('OTP Verification failed:', error)
  }
}

const handleResend = async () => {
  if (resendTimer.value > 0) return
  try {
    await authStore.sendOtp()
    startResendTimer()
  } catch (error) {
    console.error('Resend OTP failed:', error)
  }
}
</script>