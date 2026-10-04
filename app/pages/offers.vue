<template>
  <div class="min-h-screen bg-[#F3E9DF] font-ibm text-gray-800">
    
     <div
      v-if="loading"
      class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F9F6F0]"
    >
      <div class="w-12 h-12 border-4 border-[#F3C650] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="text-gray-700 font-bold text-lg">جاري التحميل...</p>
    </div>
    <header class="sticky top-0 z-50 bg-[#F4EFEA]/90 backdrop-blur-md flex flex-row-reverse items-center justify-between md:px-12 py-5 border-b border-stone-200/60 shadow-xs transition-all duration-300">

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
        <NuxtLink
          :to="localePath('/favorites')"
          class="w-10 h-10 flex items-center justify-center rounded-full bg-white/70 hover:bg-white transition relative"
          :title="t('page_favorites_title') || 'Favorites'"
        >
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
      <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900">{{ t('page_best_offers_title') }}</h1>
      <div class="flex items-center justify-center gap-2 mt-4 text-gray-600">
        <NuxtLink :to="localePath('/')" class="font-bold text-gray-900">{{ t('breadcrumb_home') }}</NuxtLink>
        <ChevronLeftIcon class="w-4 h-4" />
        <span>{{ t('page_best_offers_title') }}</span>
      </div>

      <svg class="absolute top-0 left-0 w-80 h-full opacity-40 hidden md:block pointer-events-none" viewBox="0 0 300 300" fill="none">
        <g stroke="#D4A017" stroke-width="1">
          <path v-for="i in 12" :key="i" :d="`M ${i * 25} 0 L 300 ${i * 25}`" />
        </g>
      </svg>
    </section>

    <!-- Body: sidebar filters + content -->
    <section class="px-6 md:px-12 pb-16 max-w-7xl mx-auto w-full pt-6" >
      <div class="flex flex-col lg:flex-row gap-6">

        <!-- Sidebar filters -->
        <aside class="w-full lg:w-72 shrink-0">
          <div class="bg-white rounded-3xl p-5 space-y-6">

            <!-- Categories -->
            <div>
              <button
                @click="openSections.categories = !openSections.categories"
                class="w-full flex items-center justify-between font-bold text-gray-900 pb-3 border-b border-gray-100"
              >
                {{ t('filter_categories') }}
                <ChevronDownIcon
                  class="w-4 h-4 transition-transform"
                  :class="openSections.categories ? 'rotate-180' : ''"
                />
              </button>

              <div v-show="openSections.categories" class="pt-4 space-y-3">
                <div v-for="cat in categories" :key="cat.id">
                  <label class="flex items-center justify-between cursor-pointer text-gray-700">
                    <span class="flex items-center gap-2">
                      <input
                        type="checkbox"
                        v-model="selectedCategories"
                        :value="cat.id"
                        class="w-4 h-4 rounded border-gray-300 accent-[#F3C650]"
                      />
                      {{ cat.label }}
                    </span>
                    <button
                      v-if="cat.children?.length"
                      @click.prevent="cat.open = !cat.open"
                      class="text-gray-400 w-5 h-5 flex items-center justify-center"
                    >
                      {{ cat.open ? '−' : '+' }}
                    </button>
                  </label>

                  <div v-if="cat.children?.length && cat.open" class="ps-6 mt-2 space-y-2">
                    <label
                      v-for="child in cat.children"
                      :key="child.id"
                      class="flex items-center gap-2 cursor-pointer text-sm text-gray-600"
                    >
                      <input
                        type="checkbox"
                        v-model="selectedCategories"
                        :value="child.id"
                        class="w-3.5 h-3.5 rounded border-gray-300 accent-[#F3C650]"
                      />
                      {{ child.label }}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Merchant -->
            <div>
              <button
                @click="openSections.merchant = !openSections.merchant"
                class="w-full flex items-center justify-between font-bold text-gray-900 pb-3 border-b border-gray-100"
              >
                {{ t('filter_merchant') }}
                <ChevronUpIcon
                  class="w-4 h-4 transition-transform"
                  :class="!openSections.merchant ? 'rotate-180' : ''"
                />
              </button>

              <div v-show="openSections.merchant" class="pt-4 space-y-3">
                <label
                  v-for="merchant in merchants"
                  :key="merchant.id"
                  class="flex items-center gap-2 cursor-pointer text-gray-700"
                >
                  <input
                    type="checkbox"
                    v-model="selectedMerchants"
                    :value="merchant.id"
                    class="w-4 h-4 rounded border-gray-300 accent-[#F3C650]"
                  />
                  {{ merchant.label }}
                </label>
              </div>
            </div>

            <!-- Type -->
            <div>
              <button
                @click="openSections.type = !openSections.type"
                class="w-full flex items-center justify-between font-bold text-gray-900 pb-3 border-b border-gray-100"
              >
                {{ t('filter_type') }}
                <ChevronUpIcon
                  class="w-4 h-4 transition-transform"
                  :class="!openSections.type ? 'rotate-180' : ''"
                />
              </button>

              <div v-show="openSections.type" class="pt-4 space-y-3">
                <label
                  v-for="type in types"
                  :key="type.id"
                  class="flex items-center gap-2 cursor-pointer text-gray-700"
                >
                  <input
                    type="checkbox"
                    v-model="selectedTypes"
                    :value="type.id"
                    class="w-4 h-4 rounded border-gray-300 accent-[#F3C650]"
                  />
                  {{ type.label }}
                </label>
              </div>
            </div>

          </div>
        </aside>

        <!-- Main content -->
        <div class="flex-1 min-w-0">

          <!-- Sort + view toggle bar -->
          <div class="bg-white rounded-3xl px-5 py-3 flex items-center justify-between mb-6">
            <div class="relative">
              <button
                @click="sortOpen = !sortOpen"
                class="flex items-center gap-2 text-gray-600 font-medium"
              >
                {{ t('sort_by') }}: <span class="text-gray-900">{{ currentSortLabel }}</span>
                <ChevronDownIcon class="w-4 h-4" />
              </button>

              <div
                v-if="sortOpen"
                class="absolute top-full mt-2 start-0 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 min-w-[180px] z-20"
              >
                <button
                  v-for="option in sortOptions"
                  :key="option.value"
                  @click="selectSort(option)"
                  class="w-full text-start px-4 py-2 text-sm hover:bg-gray-50"
                  :class="sortBy === option.value ? 'font-bold text-gray-900' : 'text-gray-600'"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>

            <div class="flex items-center gap-2 bg-[#F3E9DF]/60 rounded-full p-1">
              <button
                @click="viewMode = 'grid'"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition"
                :class="viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'"
              >
                <Squares2X2Icon class="w-4 h-4" />
                {{ t('view_grid') }}
              </button>
              <button
                @click="viewMode = 'list'"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition"
                :class="viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'"
              >
                <ListBulletIcon class="w-4 h-4" />
                {{ t('view_list') }}
              </button>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="n in 6" :key="`sk-${n}`" class="bg-white rounded-[28px] overflow-hidden border border-gray-200">
              <div class="h-56 bg-stone-100 animate-pulse"></div>
              <div class="p-4 space-y-3">
                <div class="h-4 bg-stone-100 rounded animate-pulse w-1/3"></div>
                <div class="h-5 bg-stone-100 rounded animate-pulse w-3/4"></div>
              </div>
            </div>
          </div>

          <!-- Empty state: no offers -->
          <div
            v-else-if="!filteredOffers.length"
            class="bg-transparent flex flex-col items-center justify-center text-center py-24"
          >
            <div class="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6">
              <MagnifyingGlassIcon class="w-8 h-8 text-gray-400" />
            </div>
            <h3 class="text-2xl font-extrabold text-gray-900 mb-2">
              {{ t('no_offers_found_title') }}
            </h3>
            <p class="text-gray-500 max-w-sm">
              {{ t('no_offers_found_subtitle') }}
            </p>
          </div>

          <!-- Products grid -->
          <div v-else class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <NuxtLink
              v-for="product in filteredOffers"
              :key="product.id"
              :to="localePath(`/products/${product.id}`)"
              class="group block bg-white rounded-[28px] overflow-hidden border border-gray-200 shadow-sm"
            >
              <!-- Image Section -->
              <div class="relative bg-[#F3E9DF] h-56 flex items-center justify-center w-auto">
                <span class="absolute top-4 left-4 z-10 flex items-center gap-1 bg-white px-2.5 py-1 rounded-full text-sm font-semibold text-gray-800 shadow-sm">
                  <StarIcon class="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {{ product.rating.toFixed(1) }}
                </span>

                <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
              </div>

              <!-- Info Section -->
              <div class="p-4">
                <div class="flex items-center justify-between mb-3">
                  <div class="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center overflow-hidden shrink-0">
                    <img v-if="product.storeLogo" :src="product.storeLogo" :alt="product.storeName" class="w-full h-full object-cover" />
                  </div>
                  <span class="text-sm text-gray-500">{{ product.storeName }}</span>
                </div>

                <h3 class="text-base font-bold text-gray-900 leading-snug mb-3 text-right line-clamp-2">
                  {{ product.name }}
                </h3>

                <div class="flex items-center justify-between mb-4">
                  <span v-if="product.discount" class="text-xs font-bold text-rose-500">
                    {{ product.discount }}%-
                  </span>
                  <span v-else></span>
                  <div class="flex items-center gap-1.5">
                    <span v-if="product.oldPrice" class="text-sm text-gray-400 line-through">
                      {{ product.oldPrice.toLocaleString() }}{{ t('currency') }}
                    </span>
                    <span class="text-xl font-black text-gray-900">
                      {{ product.price.toLocaleString() }}<span class="text-sm font-bold mr-0.5">{{ t('currency') }}</span>
                    </span>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <button
                    @click.prevent="addToCart(product)"
                    class="flex-1 h-11 rounded-full bg-[#F3C650] hover:bg-[#e0b53f] text-gray-900 font-bold text-sm transition"
                  >
                    {{ t('add_to_cart') }}
                  </button>
                  <button
                    @click.prevent="toggleFavorite(product)"
                    class="w-11 h-11 shrink-0 rounded-full border border-gray-200 flex items-center justify-center hover:border-rose-300 transition"
                  >
                    <HeartIcon
                      class="w-5 h-5 transition"
                      :class="isFavorite(product.id) ? 'text-rose-500 fill-rose-500' : 'text-gray-500'"
                    />
                  </button>
                </div>
              </div>
            </NuxtLink>
          </div>

        </div>
      </div>
    </section>

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
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  UserIcon,
  ShoppingBagIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Squares2X2Icon,
  ListBulletIcon,
  StarIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  hideHeader: true
})

const { t, locale } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()

const switchLanguage = () => {
  const newLocale = locale.value === 'ar' ? 'en' : 'ar'
  navigateTo(switchLocalePath(newLocale))
}

const route = useRoute()

// ---- header ----
const navLinks = computed(() => [
  { to: '/join', label: t('affiliate') },
  { to: '/compare', label: t('compare') },
  { to: '/offers', label: t('offers') },
  { to: '/about', label: t('merchants') },
  { to: '/products', label: t('jewelry') }
])

function isActive(path) {
  return route.path === path
}

const isScrolled = ref(false)

function handleScroll() {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// ---- data ----
const { data: homeData, loading } = useHomeData()

const favorites = ref(new Set())
const { isFavorite, toggleFavorite: toggleFav, favoritesCount } = useFavorites()

const { addToCart: addItemToCart, cartCount } = useCart()

function addToCart(product) {
  addItemToCart(product, 1)
}

function toggleFavorite(product) {
  toggleFav(product)
}

// نجيب المنتجات اللي عليها خصم فعلي من مصفوفة offers الجاهزة من الـ API
const offersRaw = computed(() => homeData.value?.offers ?? [])

const localizedOffers = computed(() =>
  offersRaw.value.map((p) => ({
    id: p.id,
    name: locale.value === 'ar' ? (p.title?.ar ?? p.name) : (p.title?.en ?? p.name),
    image: p.main_image?.url,
    rating: p.average_rating || 0,
    storeName: p.store?.name,
    storeLogo: p.store?.image,
    price: p.final_price,
    oldPrice: p.discount_percentage > 0 ? p.base_price : null,
    discount: p.discount_percentage > 0 ? p.discount_percentage : null,
    categoryId: p.category?.id,
    merchantId: p.store?.id,
    typeId: p.type?.id,
  }))
)

// ---- filters state ----
const openSections = reactive({
  categories: true,
  merchant: true,
  type: true,
})

const categories = ref([
  { id: 'rings', label: t('cat_rings'), open: true, children: [
    { id: 'solitaire-rings', label: t('cat_solitaire_rings') },
    { id: 'wedding-rings', label: t('cat_wedding_rings') },
  ]},
  { id: 'necklaces', label: t('cat_necklaces'), open: false, children: [] },
  { id: 'bracelets', label: t('cat_bracelets'), open: false, children: [] },
  { id: 'earrings', label: t('cat_earrings'), open: false, children: [] },
  { id: 'sets', label: t('cat_sets'), open: false, children: [] },
])

const merchants = ref([])
const types = ref([])

const selectedCategories = ref([])
const selectedMerchants = ref([])
const selectedTypes = ref([])

// ---- sort ----
const sortOpen = ref(false)
const sortBy = ref('default')

const sortOptions = computed(() => [
  { value: 'default', label: t('sort_default') },
  { value: 'price_asc', label: t('sort_price_asc') },
  { value: 'price_desc', label: t('sort_price_desc') },
  { value: 'rating', label: t('sort_rating') },
  { value: 'discount', label: t('sort_discount') },
])

const currentSortLabel = computed(
  () => sortOptions.value.find((o) => o.value === sortBy.value)?.label ?? ''
)

function selectSort(option) {
  sortBy.value = option.value
  sortOpen.value = false
}

// ---- view mode ----
const viewMode = ref('grid')

// ---- filtered + sorted offers ----
const filteredOffers = computed(() => {
  let list = [...localizedOffers.value]

  if (selectedCategories.value.length) {
    list = list.filter((p) => selectedCategories.value.includes(p.categoryId))
  }
  if (selectedMerchants.value.length) {
    list = list.filter((p) => selectedMerchants.value.includes(p.merchantId))
  }
  if (selectedTypes.value.length) {
    list = list.filter((p) => selectedTypes.value.includes(p.typeId))
  }

  switch (sortBy.value) {
    case 'price_asc':
      list.sort((a, b) => a.price - b.price)
      break
    case 'price_desc':
      list.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      list.sort((a, b) => b.rating - a.rating)
      break
    case 'discount':
      list.sort((a, b) => (b.discount || 0) - (a.discount || 0))
      break
  }

  return list
})
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