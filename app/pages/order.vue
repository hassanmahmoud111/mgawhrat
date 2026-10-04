<template>
  <div class="min-h-screen bg-[#F6EFE8] font-ibm text-gray-800">
    <header class="sticky top-0 z-50 bg-[#F4EFEA]/90 backdrop-blur-md flex flex-row-reverse items-center justify-between px-6 md:px-12 py-5 border-b border-stone-200/60 shadow-xs transition-all duration-300">

      <!-- Icons -->
      <div class="flex flex-row-reverse items-center gap-3">
        <button
          @click="switchLanguage"
          class="h-9 px-3 rounded-full flex items-center justify-center text-sm font-medium hover:scale-110 transition-all duration-200 shadow-sm bg-white/70 text-gray-800 hover:bg-white"
        >
          {{ locale === 'ar' ? 'En' : 'ar' }}
        </button>
        <NuxtLink :to="localePath('/auth/login')" class="w-10 h-10 flex items-center justify-center rounded-full bg-white/70 hover:bg-white transition">
          <UserIcon class="w-4 h-4" />
        </NuxtLink>
        <NuxtLink :to="localePath('/cart')" class="w-10 h-10 flex items-center justify-center rounded-full bg-white/70 hover:bg-white transition">
          <ShoppingBagIcon class="w-4 h-4" />
        </NuxtLink>
        <NuxtLink :to="localePath('/favorites')" class="w-10 h-10 flex items-center justify-center rounded-full bg-white/70 hover:bg-white transition relative" :title="t('favorites') || 'Favorites'">
          <HeartIcon class="w-4 h-4 text-rose-500" />
          <span
            v-if="favoritesCount > 0"
            class="absolute -top-1 -right-1 bg-rose-500 text-white font-black text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center border-2 border-white shadow-xs leading-none"
          >
            {{ favoritesCount > 99 ? '99+' : favoritesCount }}
          </span>
        </NuxtLink>
        <NuxtLink :to="localePath('/search')" class="w-10 h-10 flex items-center justify-center rounded-full bg-white/70 hover:bg-white transition">
          <MagnifyingGlassIcon class="w-4 h-4" />
        </NuxtLink>
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

    <!-- Hero -->
    <section class="bg-[#F3E9DF] relative overflow-hidden px-6 md:px-12 py-14 flex flex-col items-center justify-center text-center">
      <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900">{{ t('page_orders_title') || 'طلباتي' }}</h1>
      <div class="flex items-center justify-center gap-2 mt-4 text-gray-600">
        <NuxtLink :to="localePath('/')" class="font-bold text-gray-900">{{ t('breadcrumb_home') }}</NuxtLink>
        <ChevronLeftIcon class="w-4 h-4" />
        <span>{{ t('page_orders_title') || 'طلباتي' }}</span>
      </div>

      <svg class="absolute top-0 left-0 w-80 h-full opacity-40 hidden md:block pointer-events-none" viewBox="0 0 300 300" fill="none">
        <g stroke="#D4A017" stroke-width="1">
          <path v-for="i in 12" :key="i" :d="`M ${i * 25} 0 L 300 ${i * 25}`" />
        </g>
      </svg>
    </section>

    <!-- Floating side icons -->
    <div class="fixed left-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-3.5 z-40">
      <NuxtLink :to="localePath('/profile')" class="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 border border-stone-100">
        <UserIcon class="w-5 h-5 text-gray-900" />
      </NuxtLink>
      <NuxtLink :to="localePath('/cart')" class="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 border border-stone-100">
        <ShoppingBagIcon class="w-5 h-5 text-gray-900" />
      </NuxtLink>
      <NuxtLink :to="localePath('/favorites')" class="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 border border-stone-100" :title="t('favorites') || 'Favorites'">
        <HeartIcon class="w-5 h-5 text-rose-500 fill-rose-500" />
      </NuxtLink>
    </div>

    <!-- Toast -->
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
        class="fixed bottom-6 start-6 z-50 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-amber-400/30"
      >
        <span class="text-amber-400 text-lg">✓</span>
        <span class="text-sm font-bold">{{ toastMessage }}</span>
      </div>
    </Transition>

    <!-- Main Container -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-10 lg:py-16" >
      <div class="flex flex-col lg:flex-row items-start gap-8">

        <!-- Orders Card -->
        <div class="flex-1 w-full bg-white rounded-[36px] p-6 sm:p-8 md:p-10 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-stone-100/80">

          <!-- Card Header -->
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-extrabold text-gray-900">{{ t('profile_orders') || 'طلباتي' }}</h2>
            <span class="px-4 py-1.5 rounded-full bg-[#F9E9C6] text-[#B4880B] text-sm font-bold">
              {{ filteredOrders.length }} {{ locale === 'ar' ? 'طلب' : 'Orders' }}
            </span>
          </div>

          <div class="border-t border-stone-100 -mx-6 sm:-mx-8 md:-mx-10 mb-6"></div>

          <!-- Tabs -->
          <div class="flex items-center gap-3 flex-wrap mb-8">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              type="button"
              @click="activeTab = tab.key"
              class="px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200"
              :class="activeTab === tab.key
                ? 'bg-[#F5BF45] text-gray-950 shadow-sm'
                : 'bg-[#F1EAE1] text-gray-600 hover:bg-[#E9E0D3]'"
            >
              {{ tab.label }}
            </button>
          </div>

          <!-- Orders List -->
          <div v-if="filteredOrders.length" class="space-y-4">
            <div
              v-for="order in filteredOrders"
              :key="order.id"
              class="flex items-center justify-between border border-stone-100 rounded-2xl p-5 hover:shadow-sm transition"
            >
              <div class="flex items-center gap-4">
                <img
                  v-if="order.image"
                  :src="order.image"
                  class="w-16 h-16 rounded-xl object-cover bg-stone-100"
                  alt=""
                />
                <div>
                  <p class="font-bold text-gray-900">#{{ order.number }}</p>
                  <p class="text-sm text-gray-500">{{ order.date }}</p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <span
                  class="px-4 py-1.5 rounded-full text-xs font-bold"
                  :class="statusStyles[order.status]"
                >
                  {{ statusLabels[order.status] }}
                </span>
                <span class="font-extrabold text-gray-900">{{ order.total }}</span>
                <ChevronLeftIcon class="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="flex flex-col items-center justify-center py-16 text-center">
            <div class="w-20 h-20 rounded-full bg-[#F6EFE8] flex items-center justify-center mb-4">
              <ShoppingBagIcon class="w-9 h-9 text-[#C9A227]" />
            </div>
            <p class="text-gray-900 font-bold mb-1">
              {{ locale === 'ar' ? 'لا توجد طلبات حتى الآن' : 'No orders yet' }}
            </p>
            <p class="text-gray-500 text-sm mb-6">
              {{ locale === 'ar' ? 'يمكنك تصفح المنتجات والبدء بالتسوق' : 'Browse our products and start shopping' }}
            </p>
            <NuxtLink
              :to="localePath('/products')"
              class="h-12 px-8 bg-[#F5BF45] hover:bg-[#E5B53D] text-gray-950 font-bold text-sm rounded-full shadow-xs hover:shadow transition-all duration-200 flex items-center justify-center"
            >
              {{ locale === 'ar' ? 'تصفح المنتجات' : 'Browse Products' }}
            </NuxtLink>
          </div>

        </div>

        <!-- Sidebar Navigation -->
        <aside class="w-full lg:w-[270px] shrink-0">
          <div class="space-y-1 font-ibm">
            <button
              v-for="item in menuItems"
              :key="item.key"
              type="button"
              @click="handleMenuClick(item.key)"
              class="w-full flex items-center justify-between px-5 py-3.5 transition-all duration-200 cursor-pointer text-start"
              :class="item.key === activeKey
                ? 'bg-[#E5DCD0] text-gray-950 font-extrabold rounded-2xl shadow-xs'
                : 'text-gray-700 font-semibold hover:bg-[#E5DCD0]/40 rounded-2xl border-b border-[#E8DFD1]/60'"
            >
              <div class="flex items-center gap-3">
                <component :is="item.icon" class="w-5 h-5 text-gray-900 shrink-0" />
                <span class="text-sm sm:text-base">{{ item.label }}</span>
              </div>
              <ChevronLeftIcon class="w-4 h-4 text-[#A89D8E]" />
            </button>
          </div>
        </aside>

      </div>
    </main>

    <!-- Footer -->
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

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, h } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/authStore'
import apiClient from '~~/services/index'
import {
  UserIcon,
  ShoppingBagIcon,
  HeartIcon,
  ChevronLeftIcon,
  PhoneIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/vue/24/outline"

const { t, locale } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const route = useRoute()
const authStore = useAuthStore()
const { favoritesCount } = useFavorites()

definePageMeta({
  hideHeader: true,
})

useHead({ title: 'طلباتي - جولد استور' })

// ---- header navigation & scroll ----
const navLinks = computed(() => [
  { to: '/affiliate', label: t('affiliate') },
  { to: '/compare', label: t('compare') },
  { to: '/offers', label: t('offers') },
  { to: '/merchants', label: t('merchants') },
  { to: '/products', label: t('jewelry') }
])

function isActive(path: string) {
  return route.path === path
}

const isScrolled = ref(false)
function handleScroll() {
  if (typeof window !== 'undefined') {
    isScrolled.value = (window.scrollY || document.documentElement.scrollTop || 0) > 30
  }
}

function switchLanguage() {
  const newLocale = locale.value === 'ar' ? 'en' : 'ar'
  navigateTo(switchLocalePath(newLocale))
}

// ---- footer contact info ----
const contactInfo = reactive({
  phone: '0096656876293',
  email: 'info@mogwharat.com',
})

// ---- Sidebar Icons ----
const IconUser = { render: () => h('svg', { class: 'w-5 h-5 fill-current', viewBox: '0 0 24 24' }, [h('path', { d: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' })]) }
const IconOrders = { render: () => h('svg', { class: 'w-5 h-5 fill-current', viewBox: '0 0 24 24' }, [h('path', { d: 'M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z' })]) }
const IconAddresses = { render: () => h('svg', { class: 'w-5 h-5 fill-current', viewBox: '0 0 24 24' }, [h('path', { d: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z' })]) }
const IconWallet = { render: () => h('svg', { class: 'w-5 h-5 fill-current', viewBox: '0 0 24 24' }, [h('path', { d: 'M21 7.28V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-2.28c.59-.35 1-.98 1-1.72V9c0-.74-.41-1.37-1-1.72zM20 9v6h-7V9h7zM5 19V5h14v2h-6c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h6v2H5z' })]) }
const IconCoins = { render: () => h('svg', { class: 'w-5 h-5 fill-current', viewBox: '0 0 24 24' }, [h('path', { d: 'M12 2C6.48 2 2 3.79 2 6v12c0 2.21 4.48 4 10 4s10-1.79 10-4V6c0-2.21-4.48-4-10-4zm0 2c4.42 0 8 1.34 8 2s-3.58 2-8 2-8-1.34-8-2 3.58-2 8-2zm0 16c-4.42 0-8-1.34-8-2v-2.17c1.79 1.09 4.7 1.67 8 1.67s6.21-.58 8-1.67V18c0 .66-3.58 2-8 2zm0-5c-4.42 0-8-1.34-8-2v-2.17c1.79 1.09 4.7 1.67 8 1.67s6.21-.58 8-1.67V13c0 .66-3.58 2-8 2zm0-5c-4.42 0-8-1.34-8-2V7.83c1.79 1.09 4.7 1.67 8 1.67s6.21-.58 8-1.67V8c0 .66-3.58 2-8 2z' })]) }
const IconSupport = { render: () => h('svg', { class: 'w-5 h-5 fill-current', viewBox: '0 0 24 24' }, [h('path', { d: 'M12 1a9 9 0 0 0-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2a7 7 0 0 1 14 0v2h-4v8h3c1.66 0 3-1.34 3-3v-7a9 9 0 0 0-9-9z' })]) }
const IconGift = { render: () => h('svg', { class: 'w-5 h-5 fill-current', viewBox: '0 0 24 24' }, [h('path', { d: 'M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1h-2.22l.53-.71C13.62 4.84 14.26 4 15 4zM9 4c.74 0 1.38.84 1.69 1.29l.53.71H9c-.55 0-1-.45-1-1s.45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76V14h2V8.76L15.38 12 17 10.83 14.92 8H20v6z' })]) }
const IconHeart = { render: () => h('svg', { class: 'w-5 h-5 fill-current', viewBox: '0 0 24 24' }, [h('path', { d: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' })]) }

// ---- Sidebar Menu (orders active) ----
const activeKey = ref('orders')

const menuItems = computed(() => [
  { key: 'personal', label: locale.value === 'ar' ? 'البيانات الشخصية' : (t('profile_personal_data') || 'Personal Data'), icon: IconUser },
  { key: 'orders', label: locale.value === 'ar' ? 'طلباتي' : (t('profile_orders') || 'My Orders'), icon: IconOrders },
  { key: 'addresses', label: locale.value === 'ar' ? 'عناويني' : (t('profile_addresses') || 'My Addresses'), icon: IconAddresses , to: '/addresses' },
  { key: 'balance', label: locale.value === 'ar' ? 'رصيدي' : (t('profile_balance') || 'My Wallet'), icon: IconWallet },
  { key: 'coins', label: locale.value === 'ar' ? 'الكوينز' : (t('profile_coins') || 'Coins'), icon: IconCoins },
  { key: 'support', label: locale.value === 'ar' ? 'الدعم الفني' : (t('profile_support') || 'Support'), icon: IconSupport },
  { key: 'invite', label: locale.value === 'ar' ? 'دعوة الأصدقاء' : (t('profile_invite_friends') || 'Invite Friends'), icon: IconGift },
  { key: 'favorites', label: locale.value === 'ar' ? 'مفضلي' : (t('profile_favorites') || 'Favorites'), icon: IconHeart },
])

function handleMenuClick(key: string) {
  activeKey.value = key
  const routes: Record<string, string> = {
    personal: '/profile',
    orders: '/profile/orders',
    addresses: '/profile/addresses',
    balance: '/profile/wallet',
    coins: '/profile/coins',
    support: '/profile/support',
    invite: '/profile/invite',
    favorites: '/khawatem',
  }
  if (routes[key] && key !== 'orders') {
    navigateTo(localePath(routes[key]))
  }
}

// ---- Tabs & Orders ----
const activeTab = ref('all')

const tabs = computed(() => [
  { key: 'all', label: locale.value === 'ar' ? 'الكل' : 'All' },
  { key: 'pending', label: locale.value === 'ar' ? 'قيد الانتظار' : 'Pending' },
  { key: 'shipping', label: locale.value === 'ar' ? 'الشحن' : 'Shipping' },
  { key: 'delivered', label: locale.value === 'ar' ? 'تم التوصيل' : 'Delivered' },
])

interface Order {
  id: number
  number: string
  date: string
  total: string
  status: 'pending' | 'shipping' | 'delivered'
  image?: string
}

const orders = ref<Order[]>([])

const statusLabels: Record<string, string> = {
  pending: locale.value === 'ar' ? 'قيد الانتظار' : 'Pending',
  shipping: locale.value === 'ar' ? 'الشحن' : 'Shipping',
  delivered: locale.value === 'ar' ? 'تم التوصيل' : 'Delivered',
}

const statusStyles: Record<string, string> = {
  pending: 'bg-[#FCEFD6] text-[#B4880B]',
  shipping: 'bg-[#DDEBFB] text-[#2563EB]',
  delivered: 'bg-[#DFF3E3] text-[#16A34A]',
}

const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return orders.value
  return orders.value.filter(o => o.status === activeTab.value)
})

// ---- Toast ----
const toastMessage = ref('')
let toastTimeout: any = null
function showToast(msg: string) {
  toastMessage.value = msg
  if (toastTimeout) clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => { toastMessage.value = '' }, 3500)
}

async function loadOrders() {
  try {
    const res = await apiClient.get('api/v1/orders')
    const list = res.data?.data || res.data || []
    if (Array.isArray(list)) {
      orders.value = list
    }
  } catch (e) {
    console.warn('Orders fetch failed:', e)
    orders.value = []
  }
}

onMounted(async () => {
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
  }
  if (!authStore.isAuthenticated) {
    authStore.initAuth()
  }
  await loadOrders()
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>