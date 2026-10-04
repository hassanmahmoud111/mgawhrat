<template>

  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-500 transform',
      isHidden
        ? '-translate-y-full opacity-0 pointer-events-none'
        : 'translate-y-0 opacity-100',
      isScrolled
        ? 'w-full bg-white border-b border-[#D4B896]/40 shadow-md'
        : 'mx-4 md:mx-6 lg:mx-8 mt-5 rounded-full bg-[#9A8878]/40 border border-[#C8AD90]/30 backdrop-blur-xl shadow-lg'
    ]"
    data-scroll-container
  >
    <div class="flex flex-row-reverse items-center justify-between px-4 md:px-6 py-2.5">

      <!-- ================= Icons (Left in RTL) ================= -->
      <div class="flex  items-center gap-2 order-3 md:order-1">

        <!-- User -->
        <div class="relative user-menu-wrapper">
          <!-- لو مسجل: زرار بيفتح dropdown -->
          <button
            v-if="authStore.isAuthenticated"
            @click.stop="toggleUserMenu"
            class="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center hover:scale-110 hover:bg-amber-500 transition-all duration-200 shadow-sm"
            title="حسابي"
          >
            <UserIcon class="w-[18px] h-[18px] text-white" />
          </button>

          <!-- لو مش مسجل: لينك للـ login -->
          <NuxtLink
            v-else
            :to="localePath('/auth/login')"
            class="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 hover:bg-white transition-all duration-200 shadow-sm"
            title="تسجيل الدخول"
          >
            <UserIcon class="w-[18px] h-[18px] text-[#4A3728]" />
          </NuxtLink>

          <!-- Dropdown Menu -->
          <Transition name="dropdown">
            <div
              v-if="showUserMenu && authStore.isAuthenticated"
              class="absolute left-0 top-11 w-44 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
            >
              <!-- اسم اليوزر -->
              <div class="px-4 py-3 border-b border-gray-100 bg-amber-50">
                <p class="text-xs text-gray-500">مرحباً</p>
                <p class="text-sm font-semibold text-[#4A3728] truncate">
                  {{ authStore.userData?.name || authStore.userData?.username || 'المستخدم' }}
                </p>
              </div>

              <!-- Profile link -->
              <NuxtLink
                :to="localePath('/profile')"
                @click="showUserMenu = false"
                class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <UserIcon class="w-4 h-4 text-gray-400" />
                الملف الشخصي
              </NuxtLink>

              <!-- Logout -->
              <button
                @click="handleLogout"
                class="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                </svg>
                تسجيل الخروج
              </button>
            </div>
          </Transition>
        </div>

        <!-- Cart -->
        <NuxtLink
          :to="localePath('/cart')"
          class="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 hover:bg-white transition-all duration-200 shadow-sm relative"
        >
          <ShoppingBagIcon class="w-[18px] h-[18px] text-[#4A3728]" />
          <span
            v-if="cartCount > 0"
            class="absolute -top-1 -right-1 bg-[#F3C650] text-[#4A3728] font-black text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center border-2 border-white shadow-xs leading-none"
          >
            {{ cartCount > 99 ? '99+' : cartCount }}
          </span>
        </NuxtLink>

        <!-- Favorite -->
        <NuxtLink
          :to="localePath('/favorites')"
          class="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 hover:bg-white transition-all duration-200 shadow-sm relative"
          :title="locale === 'ar' ? 'المفضلة' : 'Favorites'"
        >
          <HeartIcon class="w-[18px] h-[18px] text-[#4A3728]" />
          <span
            v-if="favoritesCount > 0"
            class="absolute -top-1 -right-1 bg-rose-500 text-white font-black text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center border-2 border-white shadow-xs leading-none"
          >
            {{ favoritesCount > 99 ? '99+' : favoritesCount }}
          </span>
        </NuxtLink>

        <!-- Search -->
        <button
          class="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 hover:bg-white transition-all duration-200 shadow-sm"
        >
          <MagnifyingGlassIcon class="w-[18px] h-[18px] text-[#4A3728]" />
        </button>

        <!-- Language Switcher -->
        <button
          @click="switchLanguage"
          :class="[
            'h-9 px-3.5 rounded-full flex items-center justify-center text-xs font-bold tracking-wide hover:scale-105 transition-all duration-200 shadow-sm border border-black/5',
            isScrolled
              ? 'bg-white/90 text-[#4A3728] hover:bg-white'
              : 'bg-white/90 text-[#4A3728] hover:bg-white'
          ]"
          :title="locale === 'ar' ? 'Switch to English' : 'التحويل للعربية'"
        >
          {{ locale === 'ar' ? 'EN' : 'ar' }}
        </button>

      </div>

      <!-- ================= Navigation ================= -->
      <nav class="hidden md:flex items-center gap-6 lg:gap-8 order-2">

        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="localePath(link.to)"
          :class="[
            'text-sm lg:text-[15px] font-medium transition-all duration-300 relative group',
            isScrolled
              ? 'text-[#4A3728] hover:text-[#2C1F14]'
              : 'text-[#F5EDE2] hover:text-white'
          ]"
        >
          {{ link.label }}
          <!-- Underline effect -->
          <span
            :class="[
              'absolute -bottom-0.5 right-0 h-px w-0 group-hover:w-full transition-all duration-300',
              isScrolled ? 'bg-[#4A3728]' : 'bg-[#F3C650]'
            ]"
          />
        </NuxtLink>

      </nav>

      <!-- ================= Logo (Right in RTL) ================= -->
      <NuxtLink
        :to="localePath('/')"
        class="flex items-center justify-center order-1 md:order-3 hover:scale-105 transition-transform duration-200"
      >
        <div class="w-12 h-12">
          <svg
            viewBox="0 0 100 100"
            class="w-full h-full"
            fill="none"
            stroke="#C9A84C"
          >
            <!-- Outer diamond -->
            <rect
              x="22"
              y="22"
              width="56"
              height="56"
              rx="5"
              transform="rotate(45 50 50)"
              stroke-width="3.5"
              fill="rgba(201,168,76,0.08)"
            />
            <!-- Middle diamond -->
            <rect
              x="32"
              y="32"
              width="36"
              height="36"
              rx="3"
              transform="rotate(45 50 50)"
              stroke-width="2.5"
              fill="none"
            />
            <!-- Inner diamond filled -->
            <rect
              x="42"
              y="42"
              width="16"
              height="16"
              transform="rotate(45 50 50)"
              stroke-width="0"
              fill="#C9A84C"
            />
          </svg>
        </div>
      </NuxtLink>

    </div>
  </header>

</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from '#imports'

const route = useRoute()

import {
  UserIcon,
  ShoppingBagIcon,
  HeartIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'

const { t, locale } = useI18n()

const switchLocalePath = useSwitchLocalePath()
const localePath = useLocalePath()

// Cart & Favorites
const { cartCount } = useCart()
const { favoritesCount, fetchFavorites } = useFavorites()

// Auth
const authStore = useAuthStore()
const showUserMenu = ref(false)

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const handleLogout = async () => {
  showUserMenu.value = false
  authStore.logout()
  await navigateTo(localePath('/'))
}

// إغلاق الـ dropdown لو ضغط برة
const closeUserMenu = (e) => {
  if (!e.target.closest('.user-menu-wrapper')) {
    showUserMenu.value = false
  }
}

const switchLanguage = async () => {
  const newLocale = locale.value === 'ar' ? 'en' : 'ar'
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('current-lang', newLocale)
      document.cookie = `i18n_redirected=${newLocale}; path=/; max-age=31536000; SameSite=Lax`
    } catch (e) {}
  }

  const scrollY = getScrollY()
  const target = switchLocalePath(newLocale)
  if (target) {
    await navigateTo(target)
    if (typeof window !== 'undefined') {
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY)
      })
    }
  }
}



// =========================
// Scroll
// =========================

const isScrolled = ref(false)
const isHidden = ref(false)
const SCROLL_THRESHOLD = 50

const getScrollY = () => {
  return (
    window.scrollY ||
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  )
}

const handleScroll = () => {
  const y = getScrollY()
  const cleanPath = route.path.replace(/\/$/, '')
  const isHome = cleanPath === '' || cleanPath === '/ar' || cleanPath === '/en' || route.name?.toString().startsWith('index')

  if (isHome) {
    const viewportHeight = window.innerHeight
    const secondSectionThreshold = viewportHeight - 100

    if (y < 50) {
      isScrolled.value = false
      isHidden.value = false
    } else if (y >= 50 && y < secondSectionThreshold) {
      isScrolled.value = false
      isHidden.value = true
    } else {
      isScrolled.value = true
      isHidden.value = false
    }
  } else {
    isHidden.value = false
    isScrolled.value = y > SCROLL_THRESHOLD
  }
}

let scrollParent = null

onMounted(async () => {
  // تحميل بيانات الـ auth من localStorage
  authStore.initAuth()
  fetchFavorites().catch(() => {})

  handleScroll()
  await nextTick()
  handleScroll()

  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('click', closeUserMenu)

  scrollParent = document.querySelector('[data-scroll-container]')
  if (scrollParent) {
    scrollParent.addEventListener('scroll', handleScroll, { passive: true })
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', closeUserMenu)
  if (scrollParent) {
    scrollParent.removeEventListener('scroll', handleScroll)
  }
})


// =========================
// Navigation Links
// =========================

const navLinks = computed(() => [
  { label: t('products'), to: '/products' },
  { label: t('merchants'), to: '/merchants' },
  { label: t('offers'), to: '/offers' },
  { label: t('compare'), to: '/compare' }
])


// Active Link
// =========================

const isActive = (path) => {
  return route.path === localePath(path)
}
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}
</style>