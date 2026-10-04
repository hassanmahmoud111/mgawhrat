<template>
  <div class="min-h-screen bg-white font-ibm text-gray-800">
    <div
      v-if="loading"
      class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F9F6F0]"
    >
      <div class="w-12 h-12 border-4 border-[#F3C650] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="text-gray-700 font-bold text-lg">جاري التحميل...</p>
    </div>
    <header class="sticky top-0 z-50 bg-[#F4EFEA]/90 backdrop-blur-md flex flex-row-reverse items-center justify-between px-6 md:px-12 py-5 border-b border-stone-200/60 shadow-xs transition-all duration-300">
      
      <!-- Icons -->
      <div class="flex flex-row-reverse items-center gap-3">
        <!-- Language Switcher -->
        <button
          @click="switchLanguage"
          class="h-9 px-3 rounded-full flex items-center justify-center text-sm font-medium hover:scale-110 transition-all duration-200 shadow-sm bg-white/70 text-gray-800 hover:bg-white"
        >
          {{ locale === 'ar' ? 'En' : 'ar' }}
        </button>
        <NuxtLink :to="localePath('/auth/login')" class="w-10 h-10 flex items-center justify-center rounded-full bg-white/70 hover:bg-white transition">
          <UserIcon class="w-4 h-4" />
        </NuxtLink>
        <NuxtLink :to="localePath('/cart')" class="w-10 h-10 flex items-center justify-center rounded-full bg-white/70 hover:bg-white transition relative">
          <ShoppingBagIcon class="w-4 h-4" />
          <span
            v-if="cartCount > 0"
            class="absolute -top-1 -right-1 bg-[#F3C650] text-[#4A3728] font-black text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center border-2 border-white shadow-xs leading-none"
          >
            {{ cartCount > 99 ? '99+' : cartCount }}
          </span>
        </NuxtLink>
        <NuxtLink :to="localePath('/favorites')" class="w-10 h-10 flex items-center justify-center rounded-full bg-white/70 hover:bg-white transition relative" :title="t('page_favorites_title') || 'Favorites'">
          <HeartIcon class="w-4 h-4 text-rose-500" />
          <span
            v-if="favoritesCount > 0"
            class="absolute -top-1 -right-1 bg-rose-500 text-white font-black text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center border-2 border-white shadow-xs leading-none"
          >
            {{ favoritesCount > 99 ? '99+' : favoritesCount }}
          </span>
        </NuxtLink>
        <button class="w-10 h-10 flex items-center justify-center rounded-full bg-white/70 hover:bg-white transition">
          <MagnifyingGlassIcon class="w-4 h-4" />
        </button>
      </div>

      <!-- Nav -->
      <nav class="hidden md:flex items-center gap-2 text-gray-700 font-medium">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="localePath(link.to)"
          class="px-5 py-2 rounded-full transition"
          :class="isActive(link.to)
            ? 'bg-white/80 text-gray-900 font-bold'
            : 'hover:bg-white/40'"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <!-- Logo -->
      <NuxtLink :to="localePath('/')">
        <div
          :class="[
            'flex items-center justify-center transition-all duration-500',
            isScrolled ? 'w-10 h-10' : 'w-12 h-12'
          ]"
        >
          <svg viewBox="0 0 100 100" class="w-full h-full text-[#F3C650]" fill="none" stroke="currentColor">
            <rect x="25" y="25" width="50" height="50" rx="4" transform="rotate(45 50 50)" stroke-width="4" fill="rgba(243,198,80,.15)" />
            <rect x="33" y="33" width="34" height="34" rx="2" transform="rotate(45 50 50)" stroke-width="3" />
            <rect x="41" y="41" width="18" height="18" transform="rotate(45 50 50)" stroke-width="2.5" fill="#F3C650" />
          </svg>
        </div>
      </NuxtLink>
    </header>

    <!-- Page Header -->
    <section class="bg-[#F3E9DF] relative overflow-hidden px-6 md:px-12 py-14 flex flex-col items-center justify-center text-center">
      <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900">{{ t('page_products_title') }}</h1>
      <div class="flex items-center justify-center gap-2 mt-4 text-gray-600">
        <NuxtLink :to="localePath('/')" class="font-bold text-gray-900">{{ t('breadcrumb_home') }}</NuxtLink>
        <ChevronLeftIcon class="w-4 h-4" />
        <span>{{ t('page_products_title') }}</span>
      </div>

      <svg class="absolute top-0 left-0 w-80 h-full opacity-40 hidden md:block pointer-events-none" viewBox="0 0 300 300" fill="none">
        <g stroke="#D4A017" stroke-width="1">
          <path v-for="i in 12" :key="i" :d="`M ${i * 25} 0 L 300 ${i * 25}`" />
        </g>
      </svg>
    </section>

    <div class="px-6 md:px-12 max-w-7xl mx-auto py-10">

      <!-- Filters & Search Bar -->
      <div class="bg-white rounded-3xl p-6 shadow-md border border-stone-200 mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="cat in categories"
            :key="cat.key"
            @click="selectedCategory = cat.key"
            :class="[
              'px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300',
              selectedCategory === cat.key
                ? 'bg-gray-900 text-white font-bold shadow-md scale-105'
                : 'bg-stone-100 hover:bg-amber-100 text-gray-700'
            ]"
          >
            {{ cat.label }}
          </button>
        </div>

        <div class="relative w-full md:w-72">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('search_placeholder')"
            class="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-full text-sm outline-none focus:border-[#F3C650] transition shadow-inner"
          />
          <MagnifyingGlassIcon class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <!-- Notification Toast -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform translate-y-4 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform translate-y-4 opacity-0"
      >
        <div
          v-if="toastMessage"
          class="fixed bottom-6 left-6 z-50 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-amber-400/30"
        >
          <span class="text-amber-400 text-lg">✓</span>
          <span class="text-sm font-bold">{{ toastMessage }}</span>
        </div>
      </Transition>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="n in 8" :key="`skeleton-${n}`" class="bg-white rounded-3xl overflow-hidden border border-stone-200/80">
          <div class="h-64 bg-stone-100 animate-pulse"></div>
          <div class="p-5 space-y-3">
            <div class="h-4 bg-stone-100 rounded animate-pulse w-1/2"></div>
            <div class="h-5 bg-stone-100 rounded animate-pulse w-3/4"></div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredProducts.length === 0" class="text-center py-20 bg-white rounded-3xl border border-stone-200 shadow-sm">
        <div class="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#D4A017]">
          <MagnifyingGlassIcon class="w-8 h-8" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">{{ t('no_results_title') }}</h3>
        <p class="text-gray-500 text-sm">{{ t('no_results_subtitle') }}</p>
        <button
          @click="resetFilters"
          class="mt-4 px-6 py-2.5 bg-[#F3C650] hover:bg-amber-400 text-gray-950 font-bold rounded-full text-sm transition"
        >
          {{ t('reset_filters') }}
        </button>
      </div>

      <!-- Products Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="bg-[#F4EFEA] rounded-3xl overflow-visible group"
        >
          <!-- Image -->
          <div class="relative bg-[#F4EFEA] h-56 rounded-3xl overflow-hidden">
            <span class="absolute top-3 right-3 bg-white text-gray-900 font-bold text-xs px-2.5 py-1 rounded-full z-10 shadow-sm flex items-center gap-1">
              {{ product.rating.toFixed(1) }}
              <span class="text-amber-400">★</span>
            </span>
            <img
              :src="product.image"
              :alt="product.name"
              class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <!-- Store info card (overlapping the image bottom edge) -->
          <div class="relative -mt-8 bg-white rounded-2xl shadow-md px-3 pt-2.5 pb-3 z-10">
            <!-- Store -->
            <div class="flex items-center justify-end gap-1.5 mb-1.5">
              <span class="text-xs text-gray-500">{{ product.store }}</span>
              <img
                v-if="product.storeImage"
                :src="product.storeImage"
                :alt="product.store"
                class="w-5 h-5 rounded-full object-cover flex-shrink-0"
              />
            </div>

            <!-- Name -->
            <h3 class="text-sm font-bold text-gray-900 leading-snug mb-1.5 text-right line-clamp-2">
              {{ product.name }}
            </h3>

            <!-- Price -->
            <div class="flex items-baseline gap-1 justify-end mb-2.5">
              <span class="text-base font-black text-gray-900">{{ product.price.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US') }}</span>
              <span class="text-xs font-bold text-[#D4A017]">{{ product.currency || t('currency') }}</span>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-1.5">
              <button
                @click="addToCart(product)"
                class="flex-1 flex items-center justify-center px-3 py-2 bg-[#F3C650] hover:bg-amber-400 text-gray-950 font-bold rounded-full text-xs transition active:scale-95"
              >
                {{ t('add_to_cart') }}
              </button>
              <button
                @click="toggleCompare(product.id)"
                class="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center transition hover:bg-stone-50 flex-shrink-0"
                :class="compareList.has(product.id) ? 'text-[#D4A017] border-amber-200' : 'text-gray-500'"
                :aria-label="t('add_to_compare')"
              >
                <ArrowPathIcon class="w-3.5 h-3.5" />
              </button>
              <button
                @click="toggleFavorite(product)"
                class="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center transition hover:bg-stone-50 flex-shrink-0"
                :class="isFavorite(product.id) ? 'text-red-500 border-red-200' : 'text-gray-500'"
                :aria-label="isFavorite(product.id) ? t('remove_from_favorites') : t('add_to_favorites')"
              >
                <HeartIcon class="w-3.5 h-3.5" :class="{ 'fill-current': isFavorite(product.id) }" />
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
         <footer class="relative bg-[#FBF3ED] text-gray-900 pt-24 pb-10" >
  <div class="max-w-7xl mx-auto px-6 md:px-12">

    <!-- Top: 4 columns -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-14 pb-14 border-b border-gray-300">

      <!-- Logo + description + commercial register -->
      <div class="text-right lg:order-4">
        <div class="flex items-center justify-end gap-2 mb-7">
          <svg viewBox="0 0 100 100" class="w-10 h-10 text-[#F3C650]" fill="none" stroke="currentColor">
            <rect x="25" y="25" width="50" height="50" rx="4" transform="rotate(45 50 50)" stroke-width="4" fill="rgba(243, 198, 80, 0.15)"/>
            <rect x="41" y="41" width="18" height="18" transform="rotate(45 50 50)" stroke-width="2.5" fill="#F3C650"/>
          </svg>
        </div>
        <p class="text-gray-800 leading-loose text-[15px] mb-7">
          {{ t('footer_description') }}
        </p>
        <div class="bg-white rounded-xl px-5 py-4 flex items-center justify-end gap-3 text-[13px] font-bold text-gray-800">
          <span>{{ t('footer_commercial_register') }}: 87542100</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-[#8a7f6f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      </div>

      <!-- معلومات وعناوين -->
      <div class="text-right lg:order-3">
        <h4 class="font-bold text-[16px] mb-7">{{ t('footer_info_title') }}</h4>
        <ul class="space-y-4 text-[14.5px] text-gray-700">
          <li>
            <NuxtLink :to="localePath('/products')" class="hover:text-gray-900 transition">
              {{ t('footer_products') }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :to="localePath('/merchants')" class="hover:text-gray-900 transition">
              {{ t('footer_merchants') }}
            </NuxtLink>
          </li>
          <li>    
            <NuxtLink :to="localePath('/offers')" class="hover:text-gray-900 transition">
              {{ t('footer_offers') }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :to="localePath('/compare')" class="hover:text-gray-900 transition">
              {{ t('footer_compare') }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :to="localePath('/about-platform')" class="hover:text-gray-900 transition">
              {{ t('footer_about_platform') }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :to="localePath('/contact-us')" class="hover:text-gray-900 transition">
              {{ t('footer_contact_us') }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- السياسات والأحكام -->
      <div class="text-right lg:order-2">
        <h4 class="font-bold text-[16px] mb-7">{{ t('footer_policies_title') }}</h4>
        <ul class="space-y-4 text-[14.5px] text-gray-700">
  <li>
    <NuxtLink :to="localePath('/about-platform')" class="hover:text-gray-900 transition">
      {{ t('footer_about_us') }}
    </NuxtLink>
  </li>
  <li>
    <NuxtLink :to="localePath('/terms-conditions')" class="hover:text-gray-900 transition">
      {{ t('footer_terms_conditions') }}
    </NuxtLink>
  </li>
  <li>
    <NuxtLink :to="localePath('/privacy-policy')" class="hover:text-gray-900 transition">
      {{ t('footer_privacy_policy') }}
    </NuxtLink>
  </li>
  <li>
    <NuxtLink :to="localePath('/payment-policy')" class="hover:text-gray-900 transition">
      {{ t('footer_payment_policy') }}
    </NuxtLink>
  </li>
  <li>
    <NuxtLink :to="localePath('/shipping-policy')" class="hover:text-gray-900 transition">
      {{ t('footer_shipping_policy') }}
    </NuxtLink>
  </li>
</ul>
      </div>

      <!-- تواصل معنا -->
      <div class="text-right lg:order-1">
        <h4 class="font-bold text-[16px] mb-7">{{ t('footer_contact_title') }}</h4>
        <ul class="space-y-5 text-[14.5px] text-gray-700">
          <li class="flex items-center justify-end gap-3">
            <span class="font-bold">0096656876293</span>
            <span class="w-8 h-8 rounded-full bg-[#F3E9DF] flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-[#8a7f6f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </span>
          </li>
          <li class="flex items-center justify-end gap-3">
            <span class="font-bold">info@mogwharat.com</span>
            <span class="w-8 h-8 rounded-full bg-[#F3E9DF] flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-[#8a7f6f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
          </li>
          <li class="flex items-center justify-end gap-3">
            <span>{{ t('footer_address') }}</span>
            <span class="w-8 h-8 rounded-full bg-[#F3E9DF] flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-[#8a7f6f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
          </li>
          <li class="flex items-start justify-end gap-3">
            <span class="leading-relaxed">{{ t('footer_work_days') }}: {{ t('footer_work_days_value') }}</span>
            <span class="w-8 h-8 rounded-full bg-[#F3E9DF] flex items-center justify-center shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-[#8a7f6f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke-linecap="round" stroke-linejoin="round" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </span>
          </li>
          <li class="flex items-center justify-end gap-3">
            <span>{{ t('footer_work_hours') }}: {{ t('footer_work_hours_value') }}</span>
            <span class="w-8 h-8 rounded-full bg-[#F3E9DF] flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-[#8a7f6f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="9" stroke-linecap="round" stroke-linejoin="round" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l3 3" />
              </svg>
            </span>
          </li>
        </ul>

        <button class="mt-7 w-full sm:w-auto px-7 h-[44px] rounded-full font-bold text-[14px] text-[#3a2c05] bg-gradient-to-r from-[#ffd77c] to-[#ffc44d] hover:brightness-95 transition flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {{ t('footer_track_order') }}
        </button>
      </div>
    </div>

    <!-- Bottom Bar: Social + Copyright -->
    <div class="flex flex-col-reverse sm:flex-row items-center justify-between gap-6 pt-8">

      <p class="text-gray-900 text-[15px]">
        {{ t('footer_copyright') }}
      </p>

      <div class="flex items-center gap-4">
        <span class="text-[14px] text-gray-700 ml-2">{{ t('footer_follow_us') }}</span>
        <a href="#" class="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-900 hover:shadow-sm transition">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
        </a>
        <a href="#" class="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-900 hover:shadow-sm transition">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
        </a>
        <a href="#" class="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-900 hover:shadow-sm transition">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0112 6.8c.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85V21c0 .27.18.58.69.48A10 10 0 0022 12c0-5.52-4.48-10-10-10z"/></svg>
        </a>
        <a href="#" class="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-900 hover:shadow-sm transition">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99H7.9v-2.89h2.54V9.8c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.89h-2.34v6.99C18.34 21.13 22 16.99 22 12c0-5.52-4.48-10-10-10z"/></svg>
        </a>
        <a href="#" class="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-900 hover:shadow-sm transition">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.07-.02-2.45-1.49-2.45-1.49 0-1.72 1.16-1.72 2.37v4.58h-3v-9h2.88v1.23h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v4.74z"/></svg>
        </a>
      </div>
    </div>
  </div>
  
</footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { HeartIcon, ShoppingBagIcon, UserIcon, MagnifyingGlassIcon, ArrowPathIcon, ChevronLeftIcon } from "@heroicons/vue/24/outline";

const { t, locale } = useI18n();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();
const route = useRoute();

useHead({
  title: 'المنتجات - جولد استور',
});

const { data: homeData, loading } = useHomeData();

const searchQuery = ref("");
const selectedCategory = ref("all");
const { isFavorite, toggleFavorite: toggleFav, favoritesCount } = useFavorites();
const compareList = ref(new Set());
const toastMessage = ref("");
let toastTimeout = null;

// --- Header state & helpers ---
const isScrolled = ref(false);
function handleScroll() {
  isScrolled.value = window.scrollY > 20;
}
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const navLinks = computed(() => [
  { to: '/products', label: t('nav_products') },
  { to: '/merchants', label: t('nav_merchants') },
  { to: '/offers', label: t('nav_offers') },
  { to: '/compare', label: t('nav_compare') },
]);

function isActive(path) {
  return route.path === localePath(path);
}

function switchLanguage() {
  const newLocale = locale.value === 'ar' ? 'en' : 'ar';
  return navigateTo(switchLocalePath(newLocale));
}

// الفئات الرئيسية جايه من categorized_products (خواتم، قلادات، أساور، أقراط، أطقم)
const categories = computed(() => {
  const mainCats = homeData.value?.categorized_products?.map(c => c.category) ?? [];
  return [
    { key: "all", label: t('cat_all') },
    ...mainCats.map(c => ({ key: String(c.id), label: c.name })),
  ];
});

// دمج كل المنتجات من المصادر المختلفة وإزالة التكرار حسب الـ id
const allProducts = computed(() => {
  const sources = [
    ...(homeData.value?.best_selling ?? []),
    ...(homeData.value?.new_arrivals ?? []),
    ...(homeData.value?.for_you ?? []),
  ];
  const seen = new Map();
  for (const p of sources) {
    if (!seen.has(p.id)) seen.set(p.id, p);
  }
  return Array.from(seen.values());
});

// تحويل شكل بيانات الـ API لشكل الكارت
const localizedProductsAll = computed(() =>
  allProducts.value.map((p) => {
    let tag = null;
    if (p.discount_percentage > 0) {
      tag = locale.value === 'ar' ? `خصم ${p.discount_percentage}%` : `${p.discount_percentage}% OFF`;
    } else if (p.brand) {
      tag = locale.value === 'ar' ? p.brand.name_ar : p.brand.name_en;
    }

    return {
      id: p.id,
      name: locale.value === 'ar' ? p.title?.ar ?? p.name : p.title?.en ?? p.name,
      tag,
      price: p.final_price,
      currency: p.currency?.currency_code,
      rating: p.average_rating || 0,
      image: p.main_image?.url,
      category: p.main_category,
      category_id: findMainCategoryId(p.main_category),
      store: p.store?.name,
      storeImage: p.store?.image,
    };
  })
);

function findMainCategoryId(mainCategoryName) {
  const match = homeData.value?.categorized_products?.find(
    c => c.category.name === mainCategoryName
  );
  return match ? String(match.category.id) : null;
}
definePageMeta({
  hideHeader: true,
})

const filteredProducts = computed(() => {
  return localizedProductsAll.value.filter((p) => {
    const matchesCategory = selectedCategory.value === "all" || p.category_id === selectedCategory.value;
    const matchesQuery = !searchQuery.value || p.name?.includes(searchQuery.value) || p.category?.includes(searchQuery.value);
    return matchesCategory && matchesQuery;
  });
});

function toggleFavorite(product) {
  toggleFav(product);
}

function toggleCompare(id) {
  if (compareList.value.has(id)) {
    compareList.value.delete(id);
  } else {
    compareList.value.add(id);
  }
  compareList.value = new Set(compareList.value);
}

const { addToCart: addItemToCart, cartCount } = useCart();

function addToCart(product) {
  addItemToCart(product, 1);
}

function showToast(msg) {
  toastMessage.value = msg;
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastMessage.value = "";
  }, 3000);
}

function resetFilters() {
  searchQuery.value = "";
  selectedCategory.value = "all";
}
</script>
<style>
  .fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>