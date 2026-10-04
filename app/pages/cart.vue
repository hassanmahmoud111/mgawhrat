<template>
  <div class="min-h-screen bg-white font-ibm text-gray-800">
     <div
      v-if="cartLoading"
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

        <button class="w-10 h-10 flex items-center justify-center rounded-full bg-white/70 hover:bg-white transition">
          <UserIcon class="w-4 h-4" />
        </button>
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

    <!-- Hero -->
    <section class="bg-[#F3E9DF] relative overflow-hidden px-6 md:px-12 py-14 flex flex-col items-center justify-center text-center">
      <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900">{{ t('cart_page_title') }}</h1>
      <div class="flex items-center justify-center gap-2 mt-4 text-gray-600">
        <NuxtLink :to="localePath('/')" class="font-bold text-gray-900">{{ t('breadcrumb_home') }}</NuxtLink>
        <ChevronLeftIcon class="w-4 h-4" />
        <span>{{ t('cart_page_title') }}</span>
      </div>

      <svg class="absolute top-0 right-0 w-80 h-full opacity-40 hidden md:block pointer-events-none" viewBox="0 0 300 300" fill="none">
        <g stroke="#D4A017" stroke-width="1">
          <path v-for="i in 12" :key="i" :d="`M ${300 - i * 25} 0 L 0 ${i * 25}`" />
        </g>
      </svg>
    </section>

    <!-- Loading state -->
    <div v-if="cartLoading && !cartData" class="max-w-4xl mx-auto px-6 py-16 text-center text-[#8a7f6f]">
      {{ t('cart_loading') || 'جاري تحميل السلة...' }}
    </div>

    <!-- Cart content -->
    <section v-else>
      <div class="bg-[#faf6ef] font-[Tahoma,'Segoe_UI',Arial,sans-serif] text-[#2b2620]">
        <div class="mx-auto max-w-[1200px] grid grid-cols-1 md:grid-cols-[1fr_340px] gap-5 items-start p-6">

          <!-- Cart items -->
          <div class="bg-[#f3ece1] rounded-[18px] overflow-hidden">
            <div class="grid grid-cols-[1fr_120px_140px] px-6 py-5 font-bold text-[15px]">
              <span>{{ t('cart_col_product') }}</span>
              <span class="text-center">{{ t('cart_col_price') }}</span>
              <span class="text-center">{{ t('cart_col_qty') }}</span>
            </div>

            <div
              v-for="item in items"
              :key="item.id"
              class="grid grid-cols-[1fr_120px_140px] items-center bg-[#faf6ef] mx-3 mb-3 px-4 py-3.5 rounded-2xl last:mb-3"
            >
              <div class="flex items-center gap-3.5">
                <img
                  :src="item.image"
                  :alt="item.title"
                  class="w-[78px] h-[78px] shrink-0 rounded-xl object-cover"
                >
                <div class="text-right">
                  <div class="font-bold text-[14.5px] leading-relaxed">{{ item.title }}</div>
                  <div class="text-[12.5px] text-[#8a7f6f] mt-0.5">{{ item.shop }}</div>
                </div>
              </div>

              <div class="text-center">
                <span class="font-bold text-[15px]">{{ (item.price || 0).toLocaleString() }} {{ t('riyal') }}</span>
                <span
                  v-if="item.oldPrice && !isNaN(item.oldPrice)"
                  class="text-xs text-[#b7ab97] line-through mr-1.5"
                >{{ Number(item.oldPrice).toLocaleString() }} {{ t('riyal') }}</span>
              </div>

              <div class="flex items-center justify-center gap-2">
                <button
                  :aria-label="t('cart_remove_aria') || 'حذف'"
                  class="w-[30px] h-[30px] rounded-full border border-[#f0d4d4] bg-white text-[#b23b3b] flex items-center justify-center text-base hover:bg-rose-50 transition"
                  @click="removeItem(item.id)"
                >
                  🗑
                </button>
                <button
                  :aria-label="t('cart_decrease_aria') || 'تقليل'"
                  class="w-[30px] h-[30px] rounded-full border border-[#e6dcc8] bg-white flex items-center justify-center text-base hover:bg-amber-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  :disabled="item.qty <= 1"
                  @click="decrementItem(item.id)"
                >
                  -
                </button>
                <span class="min-w-[20px] text-center font-bold">{{ item.qty }}</span>
                <button
                  :aria-label="t('cart_increase_aria') || 'زيادة'"
                  class="w-[30px] h-[30px] rounded-full border border-[#e6dcc8] bg-white flex items-center justify-center text-base hover:bg-amber-50 transition"
                  @click="incrementItem(item.id)"
                >
                  +
                </button>
              </div>
            </div>

            <p v-if="items.length === 0" class="px-6 py-10 text-center text-[#8a7f6f]">
              {{ t('cart_empty') }}
            </p>
          </div>

          <!-- Sidebar -->
          <div class="flex flex-col gap-4">

            <!-- Coupon -->
            <div class="bg-[#f3ece1] rounded-[20px] px-6 py-5">
              <div class="font-bold text-right mb-4 text-[15px] text-[#171717]">
                {{ t('coupon_title') }}
              </div>

              <div class="bg-white rounded-[10px] h-[47px] flex items-center overflow-hidden">
                <div class="flex items-center justify-center w-[42px] shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9b9b9b"
                    stroke-width="1.7"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M20 12a2 2 0 0 0 0-4V5a1 1 0 0 0-1-1h-3a2 2 0 0 0-4 0H9a1 1 0 0 0-1 1v3a2 2 0 0 0 0 4v3a1 1 0 0 0 1 1h3a2 2 0 0 0 4 0h3a1 1 0 0 0 1-1z"/>
                  </svg>
                </div>

                <input
                  v-model="couponCode"
                  type="text"
                  :placeholder="t('coupon_placeholder')"
                  class="flex-1 min-w-0 bg-transparent border-none outline-none text-right text-[12px] text-[#8a7f6f] placeholder:text-[#8a7f6f]"
                >

                <div class="h-[28px] w-px bg-[#e5e5e5] shrink-0"></div>

                <button
                  class="w-[65px] h-full shrink-0 font-bold text-[13px] text-[#171717]"
                  @click="applyCoupon"
                >
                  {{ t('coupon_activate') }}
                </button>
              </div>
            </div>

            <!-- Summary -->
            <div class="bg-[#f3ece1] rounded-[20px] p-5">

              <div class="bg-[#f8f5f1] border border-[#e5e0da] rounded-[18px] px-4 py-3">
                <div class="flex justify-between items-center text-[14px] py-2">
                  <span class="text-[#171717]">{{ t('summary_subtotal') }}</span>
                  <span class="font-medium">{{ (subtotal || 0).toLocaleString() }} {{ t('riyal') }}</span>
                </div>

                <div class="flex justify-between items-center text-[14px] py-2">
                  <span class="text-[#171717]">{{ t('summary_fees') }}</span>
                  <span class="font-medium">{{ (taxAmount || 0).toLocaleString() }} {{ t('riyal') }}</span>
                </div>

                <div
                  v-if="discount"
                  class="flex justify-between items-center text-[14px] py-2 text-rose-500"
                >
                  <span>{{ t('summary_discount') }}</span>
                  <span>- {{ (discount || 0).toLocaleString() }} {{ t('riyal') }}</span>
                </div>

                <div class="border-t border-[#d8d3cd] my-1"></div>

                <div class="flex justify-between items-center pt-3 pb-1">
                  <span class="font-bold text-[19px]">{{ t('summary_grand_total') }}</span>
                  <span class="font-bold text-[19px] whitespace-nowrap">{{ (grandTotal || 0).toLocaleString() }} {{ t('riyal') }}</span>
                </div>
              </div>

              <NuxtLink
                :to="localePath('/checkout')"
                class="w-full mt-6 h-[45px] rounded-full font-bold text-[15px] text-[#3a2c05] bg-gradient-to-r from-[#ffd77c] to-[#ffc44d] hover:brightness-95 transition cursor-pointer flex items-center justify-center shadow-xs text-center"
              >
                {{ t('checkout_button') }}
              </NuxtLink>

            </div>
          </div>
        </div>
      </div>
    </section>

          <footer class="relative bg-[#FBF3ED] text-gray-900 pt-24 pb-10" >
  <div class="max-w-7xl mx-auto px-6 md:px-12">

    <!-- Top: 4 columns -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-14 pb-14 border-b border-gray-300">

      <!-- Logo + description + commercial register -->
      <div class=" lg:order-4">
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
      <div class=" lg:order-3">
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
      <div class=" lg:order-2">
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
      <div class=" lg:order-1">
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  UserIcon,
  ShoppingBagIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon
} from '@heroicons/vue/24/outline'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()

const switchLanguage = () => {
  const newLocale = locale.value === 'ar' ? 'en' : 'ar'
  navigateTo(switchLocalePath(newLocale))
}

definePageMeta({
  hideHeader: true
})

useHead({
  title: 'سلة التسوق - جولد استور'
})

const route = useRoute()

// ---- header ----
const navLinks = computed(() => [
  { to: '/join', label: t('affiliate') },
  { to: '/compare', label: t('compare') },
  { to: '/offers', label: t('offers') },
  { to: '/about', label: t('merchants') },
  { to: '/products', label: t('jewelry') }
])

function isActive(path: string) {
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

// ---- cart & favorites ----
const { cartData, cartLoading, cartCount, fetchCart, incrementItem: incrementCartItem, decrementItem: decrementCartItem, removeItem: removeCartItem } = useCart()
const { favoritesCount } = useFavorites()

onMounted(async () => {
  try {
    await fetchCart()
    // اتأكد من شكل البيانات الحقيقي في الكونسول لحد ما نلاقي اسم الحقل الصح
    console.log('CART DATA:', JSON.stringify(cartData.value, null, 2))
  } catch (e) {
    console.warn('fetchCart error:', e)
  }
})

interface CartItem {
  id: number | string
  productId: number | string
  title: string
  shop: string
  image: string
  price: number
  oldPrice?: number
  qty: number
}

// دالة مساعدة لتنظيف السعر
const cleanNum = (val: any): number => {
  if (val === null || val === undefined) return 0
  if (typeof val === 'number') return isNaN(val) ? 0 : val
  if (typeof val === 'string') {
    const cleaned = val.replace(/,/g, '').replace(/[^\d.-]/g, '')
    const num = parseFloat(cleaned)
    return isNaN(num) ? 0 : num
  }
  return 0
}

// بيدور على أول قيمة رقمية أكبر من صفر من مجموعة أسماء حقول محتملة
function extractPrice(p: any): number {
  const candidates = [
    p.final_price,
    p.price,
    p.unit_price,
    p.sale_price,
    p.selling_price,
    p.total_price,
    p.item_price,
    p.amount,
    p.product?.final_price,
    p.product?.price,
    p.product?.unit_price,
    p.product?.sale_price,
    p.product?.selling_price
  ]

  for (const c of candidates) {
    const n = cleanNum(c)
    if (n > 0) return n
  }
  return 0
}

function extractBasePrice(p: any): number {
  const candidates = [
    p.base_price,
    p.original_price,
    p.old_price,
    p.compare_at_price,
    p.product?.base_price,
    p.product?.original_price,
    p.product?.old_price
  ]

  for (const c of candidates) {
    const n = cleanNum(c)
    if (n > 0) return n
  }
  return 0
}

// بنلف على كل merchant ونطلع منتجاته في array واحدة مسطحة
const items = computed<CartItem[]>(() => {
  const merchants = cartData.value?.merchants || []
  const flat: CartItem[] = []

  for (const merchant of merchants) {
    const products = merchant.items || merchant.products || merchant.cart_items || []
    for (const p of products) {
      const cleanP = extractPrice(p)
      const baseP = extractBasePrice(p)
      const oldP = baseP > cleanP ? baseP : undefined

      flat.push({
        id: p.id ?? p.cart_item_id ?? p.product_id ?? p.product?.id ?? Math.floor(Math.random() * 100000),
        productId: p.product_id ?? p.product?.id ?? p.id ?? 0,
        title: locale.value === 'ar'
          ? (p.product?.title?.ar || p.product?.name || p.name || 'منتج')
          : (p.product?.title?.en || p.product?.name || p.name || 'Product'),
        shop: merchant.store_name || (locale.value === 'ar' ? 'متجر مجوهرات' : 'Jewelry Store'),
        image: p.product?.main_image?.url || p.image || (p.product?.images && p.product.images[0]?.url) || '/diamond-ring.jpg',
        price: cleanP,
        oldPrice: oldP,
        qty: Math.max(1, Number(p.quantity ?? p.qty ?? 1) || 1)
      })
    }
  }

  return flat
})

// الإجمالي دايمًا بيتحسب من الـ items نفسها عشان يتحدث فورًا مع أي تغيير في الكمية
const subtotal = computed(() =>
  items.value.reduce((acc, it) => acc + it.price * it.qty, 0)
)

// ضريبة القيمة المضافة اتشالت - 0%
const taxAmount = computed(() => 0)

const grandTotal = computed(() =>
  Math.round((subtotal.value + taxAmount.value) * 100) / 100
)

const couponCode = ref('')
const discount = ref(0)

function applyCoupon() {
  console.log('applying coupon', couponCode.value)
}

// دالة مساعدة لإيجاد المنتج داخل cartData (مستخدمة لمعرفة الكمية الحالية قبل الحذف/التقليل)
function findCartItem(id: number | string) {
  const merchants = cartData.value?.merchants || []
  for (const merchant of merchants) {
    const products = merchant.items || merchant.products || merchant.cart_items || []
    const found = products.find((p: any) =>
      (p.id ?? p.cart_item_id ?? p.product_id ?? p.product?.id) === id
    )
    if (found) return found
  }
  return null
}

// دالة واحدة فقط للزيادة (كانت مكررة قبل كده وده سبب الإيرور)
async function incrementItem(id: number) {
  try {
    await incrementCartItem(id)
  } catch (e) {
    console.warn('increment failed:', e)
  }
}

async function decrementItem(id: number) {
  const found = findCartItem(id)
  const currentQty = Number(found?.quantity ?? found?.qty ?? 1)

  if (currentQty <= 1) {
    return removeItem(id)
  }

  try {
    await decrementCartItem(id)
  } catch (e) {
    console.warn('decrement failed:', e)
  }
}

async function removeItem(id: number) {
  await removeCartItem(id)
}

function goToCheckout() {
  navigateTo(localePath('/checkout'))
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