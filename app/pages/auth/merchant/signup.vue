<template>
  <div class="min-h-screen flex bg-white" dir="rtl">

    <!-- يسار: صورة العلامة التجارية بارتفاع الشاشة كاملة -->
    <div
      class="hidden md:block md:w-1/2 lg:w-[45%] bg-cover bg-center"
      style="background-image: url('https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1600&auto=format&fit=crop');"
    ></div>

    <!-- يمين: لوحة الفورم -->
    <div class="w-full md:w-1/2 lg:w-[55%] flex flex-col px-6 sm:px-12 lg:px-20 py-8 overflow-y-auto">

      <!-- الشريط العلوي: تبديل اللغة + اللوجو -->
      <div class="flex items-center justify-between mb-10">
        <button
          type="button"
          @click="toggleLocale"
          class="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 text-sm font-bold px-5 py-2 rounded-full transition-all shadow-sm cursor-pointer"
        >
          {{ locale === 'ar' ? 'English' : 'العربية' }}
        </button>

        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-9 h-9">
          <polygon points="12,2 22,12 12,22 2,12" fill="none" stroke="#D4AF37" stroke-width="1" />
          <polygon points="12,7 17,12 12,17 7,12" fill="#D4AF37" />
        </svg>
      </div>

      <!-- العنوان -->
      <div class="max-w-md">
        <h1 class="text-3xl font-semibold text-slate-800 mb-2">
          مرحباً بك في مجواهرات!
        </h1>
        <p class="text-slate-500 mb-8 text-sm">
          برجاء تسجيل بياناتك بالأسفل لتسجيل دخولك
        </p>

        <!-- رسالة خطأ عامة -->
        <p
          v-if="formError"
          class="mb-5 text-center text-red-600 bg-red-50 border border-red-100 rounded-lg py-2.5 px-3 text-xs leading-relaxed"
        >
          {{ formError }}
        </p>

        <!-- الفورم -->
        <form @submit.prevent="handleSubmit" class="space-y-5">

          <!-- البريد الإلكتروني أو رقم الهاتف -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">البريد الإلكتروني أو رقم الهاتف</label>
            <input
              v-model="form.contact"
              type="text"
              placeholder="ادخل البريد الإلكتروني أو رقم الهاتف"
              required
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all text-left"
            />
          </div>

          <!-- كلمة المرور -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">كلمة المرور</label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••••"
                required
                minlength="8"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all text-left"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- نسيت كلمة المرور -->
          <div class="text-left -mt-2">
            <NuxtLink :to="localePath('/auth/forgot-password')" class="text-sm text-slate-500 hover:text-amber-600 hover:underline">
              نسيت كلمة المرور؟
            </NuxtLink>
          </div>

          <!-- زرار تسجيل الدخول -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 disabled:opacity-60 text-slate-900 font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <span v-if="loading" class="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></span>
            {{ loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول' }}
          </button>

          <!-- زرار طلب الاشتراك كتاجر -->
          <NuxtLink
            :to="localePath('/mogwharat/providers/register')"
            class="w-full block text-center bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            طلب الاشتراك كتاجر
          </NuxtLink>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

definePageMeta({
  hideHeader: true
})

const localePath = useLocalePath()
const { locale, setLocale } = useI18n()

function toggleLocale() {
  setLocale(locale.value === 'ar' ? 'en' : 'ar')
}

const form = reactive({
  contact: '',
  password: ''
})

const showPassword = ref(false)
const loading = ref(false)
const formError = ref('')

async function handleSubmit() {
  formError.value = ''

  if (form.password.length < 8) {
    formError.value = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'
    return
  }

  loading.value = true

  try {
    // TODO: استبدلها بالـ API الحقيقي لتسجيل الدخول
    // await $fetch('/api/merchant/login', { method: 'POST', body: form })
    await navigateTo(localePath('/mogwharat/providers/dashboard'))
  } catch (error: any) {
    formError.value = error?.data?.message || error?.message || 'حدث خطأ أثناء تسجيل الدخول، حاول مرة أخرى'
  } finally {
    loading.value = false
  }
}
</script>