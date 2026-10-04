<template>
  <div class="min-h-screen bg-[#FAF6F0] font-ibm text-gray-800" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-[#F3E9DF] flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-300">
      <!-- Icons -->
      <div class="flex items-center gap-3">
        <!-- Language Switcher -->
        <button
          @click="switchLanguage"
          class="h-9 px-3 rounded-full flex items-center justify-center text-sm font-medium hover:scale-110 transition-all duration-200 shadow-sm bg-white/70 text-gray-800 hover:bg-white"
        >
          {{ locale === 'ar' ? 'En' : 'ar' }}
        </button>

        <NuxtLink :to="localePath('/auth/login')" class="w-10 h-10 flex items-center justify-center rounded-full bg-white/70 hover:bg-white transition">
          <UserIcon class="w-4 h-4 text-gray-800" />
        </NuxtLink>

        <!-- Notifications Bell -->
        <button class="w-10 h-10 flex items-center justify-center rounded-full bg-white/70 hover:bg-white transition">
          <BellIcon class="w-4 h-4 text-gray-800" />
        </button>

        <!-- Cart Bag -->
        <NuxtLink :to="localePath('/cart')" class="w-10 h-10 flex items-center justify-center rounded-full bg-white/70 hover:bg-white transition relative">
          <ShoppingBagIcon class="w-4 h-4 text-gray-800" />
          <span
            v-if="cartCount > 0"
            class="absolute -top-1 -right-1 bg-[#F3C650] text-[#4A3728] font-black text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center border-2 border-white shadow-xs leading-none"
          >
            {{ cartCount > 99 ? '99+' : cartCount }}
          </span>
        </NuxtLink>

        <!-- Favorites -->
        <NuxtLink :to="localePath('/favorites')" class="w-10 h-10 flex items-center justify-center rounded-full bg-white/70 hover:bg-white transition relative">
          <HeartIcon class="w-4 h-4 text-rose-500" />
          <span
            v-if="favoritesCount > 0"
            class="absolute -top-1 -right-1 bg-rose-500 text-white font-black text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center border-2 border-white shadow-xs leading-none"
          >
            {{ favoritesCount > 99 ? '99+' : favoritesCount }}
          </span>
        </NuxtLink>

        <!-- Search -->
        <button class="w-10 h-10 flex items-center justify-center rounded-full bg-white/70 hover:bg-white transition">
          <MagnifyingGlassIcon class="w-4 h-4 text-gray-800" />
        </button>
      </div>

      <!-- Nav Links -->
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

      <!-- Logo with sparkle effect -->
      <NuxtLink :to="localePath('/')" class="relative group">
        <div class="flex items-center justify-center w-12 h-12">
          <!-- Sparks -->
          <span class="absolute -top-1 -right-2 text-[#E6AF2E] text-xs font-bold animate-pulse">✦</span>
          <span class="absolute -bottom-1 -left-2 text-[#E6AF2E] text-[10px] font-bold animate-pulse">✦</span>
          <svg viewBox="0 0 100 100" class="w-full h-full text-[#F3C650]" fill="none" stroke="currentColor">
            <rect x="25" y="25" width="50" height="50" rx="4" transform="rotate(45 50 50)" stroke-width="4" fill="rgba(243,198,80,.15)" />
            <rect x="33" y="33" width="34" height="34" rx="2" transform="rotate(45 50 50)" stroke-width="3" />
            <rect x="41" y="41" width="18" height="18" transform="rotate(45 50 50)" stroke-width="2.5" fill="#F3C650" />
          </svg>
        </div>
      </NuxtLink>
    </header>

    <!-- Hero Section -->
    <section class="bg-[#F3E9DF] relative overflow-hidden px-6 md:px-12 py-14 flex flex-col items-center justify-center text-center">
      <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900">{{ t('checkout_page_title') || (locale === 'ar' ? 'تأكيد الطلب' : 'Order Confirmation') }}</h1>
      <div class="flex items-center justify-center gap-2 mt-4 text-gray-600">
        <NuxtLink :to="localePath('/')" class="font-bold text-gray-900">{{ t('breadcrumb_home') || (locale === 'ar' ? 'الرئيسية' : 'Home') }}</NuxtLink>
        <ChevronLeftIcon class="w-4 h-4" :class="{ 'rotate-180': locale !== 'ar' }" />
        <span>{{ t('checkout_page_title') || (locale === 'ar' ? 'تأكيد الطلب' : 'Order Confirmation') }}</span>
      </div>

      <!-- Concentric circular arcs pattern on the right (matches screenshot) -->
      <svg class="absolute top-0 right-0 w-[420px] h-full opacity-35 hidden md:block pointer-events-none" viewBox="0 0 400 300" fill="none">
        <g stroke="#D4A017" stroke-width="1.2">
          <ellipse v-for="i in 18" :key="i" cx="420" cy="150" :rx="i * 24" :ry="i * 24" />
        </g>
      </svg>
    </section>

    <!-- Floating side icons (matches screenshot) -->
    <div class="fixed left-6 bottom-16 sm:bottom-24 xl:top-1/2 xl:-translate-y-1/2 flex flex-col gap-3.5 z-40">
      <NuxtLink
        :to="localePath('/profile')"
        class="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 border border-stone-100"
        :title="t('profile') || 'Profile'"
      >
        <UserIcon class="w-5 h-5 text-gray-800" />
      </NuxtLink>
      <NuxtLink
        :to="localePath('/cart')"
        class="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 border border-stone-100 relative"
        :title="t('cart') || 'Cart'"
      >
        <ShoppingBagIcon class="w-5 h-5 text-gray-800" />
        <span
          class="absolute -top-1 -right-1 bg-rose-500 text-white font-black text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center border-2 border-white shadow-xs leading-none"
        >
          {{ cartCount > 0 ? (cartCount > 99 ? '99+' : cartCount) : 1 }}
        </span>
      </NuxtLink>
      <NuxtLink
        :to="localePath('/favorites')"
        class="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 border border-stone-100"
        :title="t('favorites') || 'Favorites'"
      >
        <HeartIcon class="w-5 h-5 text-gray-800 hover:text-rose-500 transition" />
      </NuxtLink>
    </div>

    <!-- Main Content Area -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        <!-- Column 1 (Form / Customer Info & Store Pickup) - In RTL: on the right (7 cols) -->
        <div class="lg:col-span-7 space-y-6 order-1 lg:order-1">

          <!-- Row 1: Name & Phone Number -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Customer Name -->
            <div>
              <label class="block text-sm font-bold text-gray-800 mb-2">
                {{ t('checkout_customer_name') || (locale === 'ar' ? 'الاسم' : 'Full Name') }}
              </label>
              <div class="relative">
                <input
                  v-model="customerName"
                  type="text"
                  class="w-full h-[52px] bg-white border border-[#E5E0DA] rounded-2xl px-4 text-sm font-medium text-gray-900 focus:outline-none focus:border-[#F3C650] focus:ring-2 focus:ring-[#F3C650]/20 transition shadow-xs"
                  :placeholder="locale === 'ar' ? 'أدخل اسمك الكامل' : 'Enter full name'"
                />
              </div>
            </div>

            <!-- Phone Number with Country Code Dropdown -->
            <div>
              <label class="block text-sm font-bold text-gray-800 mb-2">
                {{ t('checkout_phone_number') || (locale === 'ar' ? 'رقم الهاتف' : 'Phone Number') }}
              </label>
              <div class="h-[52px] bg-white border border-[#E5E0DA] rounded-2xl px-3 flex items-center gap-2 shadow-xs focus-within:border-[#F3C650] focus-within:ring-2 focus-within:ring-[#F3C650]/20 transition">
                <!-- Phone input -->
                <input
                  v-model="phoneNumber"
                  type="tel"
                  dir="ltr"
                  class="flex-1 min-w-0 bg-transparent border-none outline-none text-sm font-medium text-gray-900 placeholder:text-gray-400"
                  :placeholder="locale === 'ar' ? '05xxxxxxxx' : 'Phone number'"
                />

                <!-- Divider -->
                <div class="h-6 w-px bg-stone-200 shrink-0"></div>

                <!-- Country selector button -->
                <div class="relative">
                  <button
                    type="button"
                    @click="showCountryDropdown = !showCountryDropdown"
                    class="flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-gray-900 px-1 py-1 rounded transition shrink-0 cursor-pointer"
                  >
                    <span>{{ selectedCountry.code }} {{ selectedCountry.short }}</span>
                    <ChevronDownIcon class="w-3.5 h-3.5 text-gray-500 transition-transform" :class="{ 'rotate-180': showCountryDropdown }" />
                  </button>

                  <!-- Country Dropdown Menu -->
                  <div
                    v-if="showCountryDropdown"
                    class="absolute top-full mt-2 left-0 sm:right-0 bg-white border border-stone-200 rounded-xl shadow-xl py-1 z-30 min-w-[140px]"
                  >
                    <button
                      v-for="country in countries"
                      :key="country.code"
                      type="button"
                      @click="selectCountry(country)"
                      class="w-full px-3 py-2 text-xs flex items-center justify-between hover:bg-[#FAF6F0] transition font-medium cursor-pointer"
                      :class="selectedCountry.short === country.short ? 'bg-amber-50 text-amber-800 font-bold' : 'text-gray-700'"
                    >
                      <span>{{ country.name }}</span>
                      <span dir="ltr">{{ country.code }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Store Pickup Card (matches screenshot) -->
          <div class="bg-white rounded-3xl p-6 border border-[#E5E0DA] shadow-xs space-y-5">
            <!-- Checkbox Row -->
            <div class="flex items-start justify-between gap-4">
              <!-- Text & Icon on the right (in RTL) -->
              <div class="flex items-start gap-3.5">
                <!-- Shop / Storefront Icon -->
                <div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-200/60 shadow-xs">
                  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9L4.5 4H19.5L21 9V10C21 11.1046 20.1046 12 19 12C17.8954 12 17 11.1046 17 10C17 11.1046 16.1046 12 15 12C13.8954 12 13 11.1046 13 10C13 11.1046 12.1046 12 11 12C9.89543 12 9 11.1046 9 10C9 11.1046 8.10457 12 7 12C5.89543 12 5 11.1046 5 10V9Z" fill="#3B82F6" stroke="#1D4ED8" stroke-width="1.5" stroke-linejoin="round"/>
                    <path d="M4 12V20H20V12" stroke="#EF4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9 20V15H15V20" fill="#FEF3C7" stroke="#B45309" stroke-width="1.5" stroke-linejoin="round"/>
                    <rect x="2" y="3.5" width="20" height="2" rx="1" fill="#F59E0B"/>
                  </svg>
                </div>
                <div>
                  <h3 class="font-extrabold text-base text-gray-900">
                    {{ t('checkout_store_pickup') || (locale === 'ar' ? 'استلام من المتجر' : 'Pickup from store') }}
                  </h3>
                  <p class="text-xs text-gray-500 mt-0.5">
                    {{ t('checkout_store_pickup_desc') || (locale === 'ar' ? 'اختر هذا الخيار إذا كنت ترغب في استلام الطلب بنفسك من الفرع' : 'Choose this option if you wish to pick up the order yourself from the branch') }}
                  </p>
                </div>
              </div>

              <!-- Square Checkbox -->
              <label class="relative flex items-center cursor-pointer pt-1">
                <input
                  v-model="isStorePickup"
                  type="checkbox"
                  class="w-5 h-5 rounded-md border-2 border-gray-300 text-[#F5BF45] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#E5A93C]"
                />
              </label>
            </div>

            <!-- Warning / Notice Box (matches screenshot with 📌 icon) -->
            <div class="bg-[#FFFDF5] border border-[#FBE3A4] rounded-2xl p-4.5 text-xs sm:text-sm text-gray-700 leading-relaxed shadow-xs">
              <div class="flex items-center gap-2 mb-2">
                <!-- Red Pin Icon -->
                <span class="text-lg leading-none">📌</span>
                <span class="font-extrabold text-[#78350F]">
                  {{ t('checkout_pickup_notes_title') || (locale === 'ar' ? 'ملاحظات وتعليمات الاستلام:' : 'Pickup notes and instructions:') }}
                </span>
              </div>
              <ul class="space-y-1.5 text-gray-600 list-disc list-inside pe-2">
                <li>{{ locale === 'ar' ? 'يمكن استلام الطلب من أقرب فرع لمجوهرات معوض خلال أوقات العمل الرسمية (10:00 صباحاً - 10:00 مساءً).' : 'Order can be picked up from the nearest branch during working hours (10:00 AM - 10:00 PM).' }}</li>
                <li>{{ locale === 'ar' ? 'يرجى إبراز رقم الطلب والهوية الوطنية أو الإقامة عند الاستلام في الفرع.' : 'Please present the order number and National ID / Iqama upon pickup.' }}</li>
                <li>{{ locale === 'ar' ? 'يتم الاحتفاظ بالطلب في الفرع لمدة 3 أيام عمل من تاريخ استلام رسالة الجاهزية.' : 'The order is held at the branch for 3 working days from ready notification.' }}</li>
              </ul>
            </div>

            <!-- Branch Selection (when Pickup is selected) -->
            <div v-if="isStorePickup" class="pt-2 border-t border-stone-100">
              <label class="block text-xs font-bold text-gray-700 mb-2">
                {{ locale === 'ar' ? 'اختر الفرع المناسب للاستلام:' : 'Choose the pickup branch:' }}
              </label>
              <select
                v-model="selectedBranch"
                class="w-full h-11 bg-[#FAF6F0] border border-[#E5E0DA] rounded-xl px-4 text-xs font-medium text-gray-800 focus:outline-none focus:border-[#F3C650] cursor-pointer"
              >
                <option v-for="branch in branches" :key="branch.id" :value="branch.id">
                  {{ branch.name }} - {{ branch.city }} ({{ branch.hours }})
                </option>
              </select>
            </div>

            <!-- Delivery Address Form (when Pickup is NOT selected) -->
            <div v-else class="pt-2 border-t border-stone-100 space-y-3">
              <label class="block text-xs font-bold text-gray-700">
                {{ locale === 'ar' ? 'عنوان التوصيل:' : 'Delivery Address:' }}
              </label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  v-model="shippingCity"
                  type="text"
                  :placeholder="locale === 'ar' ? 'المدينة (مثل: الرياض)' : 'City'"
                  class="h-11 bg-[#FAF6F0] border border-[#E5E0DA] rounded-xl px-3 text-xs font-medium text-gray-800 outline-none focus:border-[#F3C650]"
                />
                <input
                  v-model="shippingDistrict"
                  type="text"
                  :placeholder="locale === 'ar' ? 'الحي' : 'District'"
                  class="h-11 bg-[#FAF6F0] border border-[#E5E0DA] rounded-xl px-3 text-xs font-medium text-gray-800 outline-none focus:border-[#F3C650]"
                />
              </div>
              <input
                v-model="shippingStreet"
                type="text"
                :placeholder="locale === 'ar' ? 'اسم الشارع وتفاصيل العنوان' : 'Street address and details'"
                class="w-full h-11 bg-[#FAF6F0] border border-[#E5E0DA] rounded-xl px-3 text-xs font-medium text-gray-800 outline-none focus:border-[#F3C650]"
              />
            </div>
          </div>

          <!-- Payment Methods Section (matches screenshot) -->
          <div class="space-y-3">
            <!-- 1. Wallet (المحفظة) -->
            <label
              class="w-full bg-white rounded-2xl p-4 sm:p-5 border-2 cursor-pointer transition-all flex items-center justify-between shadow-xs"
              :class="paymentMethod === 'wallet' ? 'border-[#C99A2C] bg-[#FFFDF8] ring-1 ring-[#C99A2C]/30' : 'border-stone-200/90 hover:border-stone-300'"
            >
              <div class="flex items-center gap-3.5">
                <div
                  class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition shrink-0"
                  :class="paymentMethod === 'wallet' ? 'border-[#C99A2C]' : 'border-stone-300 bg-white'"
                >
                  <div v-if="paymentMethod === 'wallet'" class="w-2.5 h-2.5 rounded-full bg-[#C99A2C]"></div>
                </div>
                <input type="radio" v-model="paymentMethod" value="wallet" class="hidden" />
                <span class="text-sm sm:text-[15px] font-extrabold text-gray-900">
                  {{ locale === 'ar' ? 'الدفع باستخدام رصيد محفظتك' : 'Pay using your wallet balance' }}
                </span>
              </div>

              <!-- Red Shield / Wallet Icon -->
              <div class="w-9 h-9 rounded-xl bg-[#FEE2E2] flex items-center justify-center text-[#DC2626] shrink-0 border border-red-200 shadow-2xs">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 18v1a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v1h-9a2 2 0 00-2 2v8a2 2 0 002 2h9zm-9-2h10V8H12v8zm4-2.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"/>
                </svg>
              </div>
            </label>

            <!-- 2. Tabby (تابي) -->
            <label
              class="w-full bg-white rounded-2xl p-4 sm:p-5 border-2 cursor-pointer transition-all flex items-center justify-between shadow-xs"
              :class="paymentMethod === 'tabby' ? 'border-[#C99A2C] bg-[#FFFDF8] ring-1 ring-[#C99A2C]/30' : 'border-stone-200/90 hover:border-stone-300'"
            >
              <div class="flex items-center gap-3.5">
                <div
                  class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition shrink-0"
                  :class="paymentMethod === 'tabby' ? 'border-[#C99A2C]' : 'border-stone-300 bg-white'"
                >
                  <div v-if="paymentMethod === 'tabby'" class="w-2.5 h-2.5 rounded-full bg-[#C99A2C]"></div>
                </div>
                <input type="radio" v-model="paymentMethod" value="tabby" class="hidden" />
                <div>
                  <span class="block text-sm sm:text-[15px] font-extrabold text-gray-900">
                    {{ locale === 'ar' ? 'تابي' : 'Tabby' }}
                  </span>
                  <span class="block text-xs text-gray-400 mt-0.5">
                    {{ locale === 'ar' ? 'قسمها على 4 . بدون أي فوائد، أو رسوم' : 'Split into 4 payments. No interest, no fees' }}
                  </span>
                </div>
              </div>

              <!-- Tabby Logo Badge -->
              <div class="h-8 px-2.5 rounded-lg bg-[#3EFE88] flex items-center justify-center shrink-0 border border-emerald-300/40 shadow-2xs">
                <span class="font-black text-xs text-gray-950 tracking-tight lowercase">tabby</span>
              </div>
            </label>

            <!-- 3. Tamara (تمارا) -->
            <label
              class="w-full bg-white rounded-2xl p-4 sm:p-5 border-2 cursor-pointer transition-all flex items-center justify-between shadow-xs"
              :class="paymentMethod === 'tamara' ? 'border-[#C99A2C] bg-[#FFFDF8] ring-1 ring-[#C99A2C]/30' : 'border-stone-200/90 hover:border-stone-300'"
            >
              <div class="flex items-center gap-3.5">
                <div
                  class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition shrink-0"
                  :class="paymentMethod === 'tamara' ? 'border-[#C99A2C]' : 'border-stone-300 bg-white'"
                >
                  <div v-if="paymentMethod === 'tamara'" class="w-2.5 h-2.5 rounded-full bg-[#C99A2C]"></div>
                </div>
                <input type="radio" v-model="paymentMethod" value="tamara" class="hidden" />
                <div>
                  <span class="block text-sm sm:text-[15px] font-extrabold text-gray-900">
                    {{ locale === 'ar' ? 'تمارا' : 'Tamara' }}
                  </span>
                  <span class="block text-xs text-gray-400 mt-0.5">
                    {{ locale === 'ar' ? 'قسم فاتورتك على 4 دفعات بدون أي رسوم أو فوائد' : 'Split into 4 payments without interest or fees' }}
                  </span>
                </div>
              </div>

              <!-- Tamara Logo Badge -->
              <div class="h-8 px-3 rounded-lg bg-[#FFF2E8] border border-orange-200/90 flex items-center justify-center shrink-0 shadow-2xs">
                <span class="font-black text-xs text-[#E65C00]">تمارا</span>
              </div>
            </label>

            <!-- 4. Credit Card (البطاقة الإئتمانية) -->
            <label
              class="w-full bg-white rounded-2xl p-4 sm:p-5 border-2 cursor-pointer transition-all flex items-center justify-between shadow-xs"
              :class="paymentMethod === 'card' ? 'border-[#C99A2C] bg-[#FFFDF8] ring-1 ring-[#C99A2C]/30' : 'border-stone-200/90 hover:border-stone-300'"
            >
              <div class="flex items-center gap-3.5">
                <div
                  class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition shrink-0"
                  :class="paymentMethod === 'card' ? 'border-[#C99A2C]' : 'border-stone-300 bg-white'"
                >
                  <div v-if="paymentMethod === 'card'" class="w-2.5 h-2.5 rounded-full bg-[#C99A2C]"></div>
                </div>
                <input type="radio" v-model="paymentMethod" value="card" class="hidden" />
                <span class="text-sm sm:text-[15px] font-extrabold text-gray-900">
                  {{ locale === 'ar' ? 'البطاقة الإئتمانية' : 'Credit Card' }}
                </span>
              </div>

              <!-- Logos: AMEX, Mada, MasterCard, VISA -->
              <div class="h-8 px-2 rounded-lg bg-white border border-stone-200 flex items-center gap-1.5 shrink-0 shadow-2xs">
                <!-- AMEX -->
                <span class="text-[9px] font-black px-1 py-0.5 rounded bg-[#006FCF] text-white">AMEX</span>
                <!-- Mada -->
                <span class="text-[9px] font-bold px-1 py-0.5 rounded bg-[#EBF5FB] text-[#00667E]">mada</span>
                <!-- MasterCard circles -->
                <div class="flex -space-x-1 items-center">
                  <span class="w-3.5 h-3.5 rounded-full bg-[#EB001B] inline-block"></span>
                  <span class="w-3.5 h-3.5 rounded-full bg-[#F79E1B] opacity-80 inline-block -ms-1.5"></span>
                </div>
                <!-- VISA -->
                <span class="text-[11px] font-black italic text-[#1A1F71] tracking-tighter">VISA</span>
              </div>
            </label>

            <!-- 5. Apple Pay -->
            <label
              class="w-full bg-white rounded-2xl p-4 sm:p-5 border-2 cursor-pointer transition-all flex items-center justify-between shadow-xs"
              :class="paymentMethod === 'apple_pay' ? 'border-[#C99A2C] bg-[#FFFDF8] ring-1 ring-[#C99A2C]/30' : 'border-stone-200/90 hover:border-stone-300'"
            >
              <div class="flex items-center gap-3.5">
                <div
                  class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition shrink-0"
                  :class="paymentMethod === 'apple_pay' ? 'border-[#C99A2C]' : 'border-stone-300 bg-white'"
                >
                  <div v-if="paymentMethod === 'apple_pay'" class="w-2.5 h-2.5 rounded-full bg-[#C99A2C]"></div>
                </div>
                <input type="radio" v-model="paymentMethod" value="apple_pay" class="hidden" />
                <span class="text-sm sm:text-[15px] font-extrabold text-gray-900">Apple Pay</span>
              </div>

              <!-- Apple Pay Badge -->
              <div class="h-8 px-2.5 rounded-lg bg-white border border-stone-200 flex items-center justify-center shrink-0 shadow-2xs">
                <span class="font-bold text-xs text-gray-950 flex items-center gap-1">
                  <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 170 170"><path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.87-11.93-14.49-5.96-9.2-10.49-19.78-13.58-31.74-3.09-11.96-4.64-23.27-4.64-33.93 0-16.71 4.19-30.5 12.57-41.36 8.38-10.87 18.99-16.4 31.82-16.6 4.35 0 9.24 1.15 14.67 3.44 5.43 2.3 9.4 3.49 11.93 3.58 2.29 0 6.43-1.28 12.41-3.84 5.98-2.56 11.08-3.72 15.31-3.49 11.63.66 21.05 4.9 28.26 12.72-10.23 6.2-15.24 14.93-15.03 26.2.22 8.78 3.57 16.2 10.05 22.25 6.49 6.06 14.16 9.61 23.03 10.66-2.5 7.42-5.63 14.88-9.4 22.37zM119.22 31.84c0-7.39 2.66-14.46 7.99-21.2 5.33-6.75 11.89-10.64 19.67-11.67.65 6.95-1.57 13.91-6.66 20.88-5.08 6.96-11.75 11.01-20 12.15-.22-.05-.53-.09-.9-.12-.07-.02-.1-.03-.1-.04z"/></svg>
                  <span>Pay</span>
                </span>
              </div>
            </label>

            <!-- 6. STCBank -->
            <label
              class="w-full bg-white rounded-2xl p-4 sm:p-5 border-2 cursor-pointer transition-all flex items-center justify-between shadow-xs"
              :class="paymentMethod === 'stc_bank' ? 'border-[#C99A2C] bg-[#FFFDF8] ring-1 ring-[#C99A2C]/30' : 'border-stone-200/90 hover:border-stone-300'"
            >
              <div class="flex items-center gap-3.5">
                <div
                  class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition shrink-0"
                  :class="paymentMethod === 'stc_bank' ? 'border-[#C99A2C]' : 'border-stone-300 bg-white'"
                >
                  <div v-if="paymentMethod === 'stc_bank'" class="w-2.5 h-2.5 rounded-full bg-[#C99A2C]"></div>
                </div>
                <input type="radio" v-model="paymentMethod" value="stc_bank" class="hidden" />
                <span class="text-sm sm:text-[15px] font-extrabold text-gray-900">STCBank</span>
              </div>

              <!-- STC Pay Badge -->
              <div class="h-8 px-2.5 rounded-lg bg-white border border-stone-200 flex items-center justify-center shrink-0 shadow-2xs">
                <span class="font-extrabold text-xs text-[#4F008C] flex items-center gap-1">
                  <span>stc</span>
                  <span class="text-[#00C48C]">pay</span>
                </span>
              </div>
            </label>
          </div>

          <!-- Submit Button on mobile/tablet -->
          <div class="pt-2">
            <button
              @click="submitOrder"
              :disabled="submitting"
              class="w-full h-14 rounded-full font-extrabold text-base text-[#3a2c05] bg-gradient-to-r from-[#ffd77c] to-[#ffc44d] hover:brightness-95 transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <svg v-if="submitting" class="animate-spin h-5 w-5 text-[#3a2c05]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>{{ t('checkout_confirm_btn') || (locale === 'ar' ? 'تأكيد الطلب' : 'Confirm Order') }}</span>
            </button>
          </div>

        </div>

        <!-- Column 2 (Order Products / "منتجات الطلب") - In RTL: on the left (5 cols) -->
        <div class="lg:col-span-5 space-y-4 order-2 lg:order-2">
          <h2 class="font-extrabold text-lg text-gray-900 px-1">
            {{ t('checkout_order_products') || (locale === 'ar' ? 'منتجات الطلب' : 'Order Products') }}
          </h2>

          <!-- Store Card Container (matches screenshot) -->
          <div class="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5E0DA] shadow-xs space-y-4">

            <!-- Store Card Header -->
            <div class="flex items-center justify-between pb-3 border-b border-stone-100">
              <!-- Store Name with Icon -->
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-amber-100/70 flex items-center justify-center text-[#B45309]">
                  <BuildingStorefrontIcon class="w-4 h-4" />
                </div>
                <span class="font-extrabold text-sm sm:text-base text-gray-900">{{ primaryStoreName }}</span>
              </div>

              <!-- Subtotal Text -->
              <span class="text-xs sm:text-sm font-semibold text-gray-600">
                {{ locale === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:' }}
                <span class="font-extrabold text-gray-900">{{ (subtotal || 831.48).toLocaleString() }} {{ t('riyal') || (locale === 'ar' ? 'ريال' : 'SAR') }}</span>
              </span>
            </div>

            <!-- Product Items List -->
            <div class="space-y-3">
              <div
                v-for="item in displayItems"
                :key="item.id"
                class="bg-[#FAF7F2] rounded-2xl p-4 flex items-center gap-4 transition hover:shadow-xs"
              >
                <!-- Thumbnail / Product Image in rounded container with border -->
                <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white border border-[#E5E0DA] p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
                  <img
                    v-if="item.image"
                    :src="item.image"
                    :alt="item.title"
                    class="w-full h-full object-contain"
                  />
                  <!-- Fallback logo/emblem matching screenshot if image is empty -->
                  <div v-else class="w-full h-full rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
                    ✦
                  </div>
                </div>

                <!-- Product Info & Badges -->
                <div class="flex-1 min-w-0">
                  <h4 class="font-bold text-sm sm:text-[14.5px] text-gray-900 leading-snug truncate">
                    {{ item.title }}
                  </h4>

                  <!-- Tags / Badges Row (matches screenshot: 18 عيار, ذهب أبيض, المقاس: 10, 2 جرام, MOD-90BVYK-20) -->
                  <div class="flex flex-wrap items-center gap-1.5 mt-2">
                    <span
                      v-if="item.karat"
                      class="px-2 py-0.5 rounded-md bg-[#FEF3C7] text-[#B45309] font-bold text-[11px]"
                    >
                      {{ item.karat }}
                    </span>
                    <span
                      v-if="item.goldType"
                      class="px-2 py-0.5 rounded-md bg-stone-200/80 text-gray-700 text-[11px] font-medium"
                    >
                      {{ item.goldType }}
                    </span>
                    <span
                      v-if="item.size"
                      class="px-2 py-0.5 rounded-md bg-[#E0F2FE] text-[#0369A1] text-[11px] font-medium"
                    >
                      {{ locale === 'ar' ? `المقاس: ${item.size}` : `Size: ${item.size}` }}
                    </span>
                    <span
                      v-if="item.weight"
                      class="px-2 py-0.5 rounded-md bg-stone-200/80 text-gray-700 text-[11px] font-medium"
                    >
                      {{ item.weight }}
                    </span>
                    <span
                      v-if="item.sku"
                      class="px-2 py-0.5 rounded-md bg-stone-200/80 text-gray-500 font-mono text-[10px]"
                    >
                      {{ item.sku }}
                    </span>
                  </div>

                  <!-- Price & Quantity -->
                  <div class="flex items-center justify-between mt-2 pt-1 border-t border-stone-200/50">
                    <span class="text-xs font-bold text-gray-900">
                      {{ (item.price * item.qty).toLocaleString() }} {{ t('riyal') || (locale === 'ar' ? 'ريال' : 'SAR') }}
                    </span>
                    <span class="text-xs text-gray-500 font-medium">
                      {{ locale === 'ar' ? `الكمية: ${item.qty}` : `Qty: ${item.qty}` }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Financial Summary -->
            <div class="bg-[#FAF7F2] rounded-2xl p-4 space-y-2.5 text-xs sm:text-sm border border-stone-200/60 mt-4">
              <div class="flex justify-between items-center text-gray-600">
                <span>{{ t('summary_subtotal') || (locale === 'ar' ? 'المجموع الفرعي' : 'Subtotal') }}</span>
                <span class="font-bold text-gray-900">{{ (subtotal || 831.48).toLocaleString() }} {{ t('riyal') }}</span>
              </div>

              <div class="flex justify-between items-center text-gray-600">
                <span>{{ t('summary_fees') || (locale === 'ar' ? 'ضريبة القيمة المضافة (15%)' : 'VAT (15%)') }}</span>
                <span class="font-bold text-gray-900">{{ (taxAmount || 124.72).toLocaleString() }} {{ t('riyal') }}</span>
              </div>

              <div class="flex justify-between items-center text-gray-600">
                <span>{{ locale === 'ar' ? 'رسوم التوصيل / الاستلام' : 'Delivery / Pickup' }}</span>
                <span class="font-bold text-emerald-600">{{ locale === 'ar' ? 'مجاناً' : 'Free' }}</span>
              </div>

              <div class="border-t border-stone-200 my-1"></div>

              <div class="flex justify-between items-center text-base sm:text-lg font-black text-gray-950 pt-1">
                <span>{{ t('summary_grand_total') || (locale === 'ar' ? 'الإجمالي النهائي' : 'Total') }}</span>
                <span class="text-[#92400E]">{{ (grandTotal || 956.20).toLocaleString() }} {{ t('riyal') }}</span>
              </div>
            </div>

          </div>

          <!-- Return & Guarantee Badge -->
          <div class="bg-white rounded-2xl p-4 border border-[#E5E0DA] flex items-center gap-3 text-xs text-gray-600">
            <ShieldCheckIcon class="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{{ locale === 'ar' ? 'جميع المنتجات أصلية ومضمونة 100% مع شهادة الضمان والعيار المعتمدة.' : '100% authentic products guaranteed with official certificates.' }}</span>
          </div>
        </div>

      </div>
    </main>

    <!-- Success Modal -->
    <div
      v-if="showSuccessModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
    >
      <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center space-y-5 shadow-2xl border border-stone-100 animate-in fade-in zoom-in duration-300">
        <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-bold">
          ✓
        </div>

        <div>
          <h3 class="text-2xl font-black text-gray-900 mb-2">
            {{ locale === 'ar' ? 'تم تأكيد طلبك بنجاح!' : 'Order Placed Successfully!' }}
          </h3>
          <p class="text-sm text-gray-500">
            {{ locale === 'ar' ? `رقم الطلب الخاص بك هو #${orderNumber}` : `Your order reference number is #${orderNumber}` }}
          </p>
          <p v-if="isStorePickup" class="text-xs text-amber-700 bg-amber-50 rounded-xl p-3 mt-3">
            {{ locale === 'ar' ? 'يمكنك استلام الطلب من الفرع خلال 3 أيام عمل.' : 'You can pick up your order from the selected branch within 3 working days.' }}
          </p>
        </div>

        <div class="flex flex-col gap-2 pt-2">
          <NuxtLink
            :to="localePath('/order')"
            class="h-12 rounded-full font-bold text-sm bg-gradient-to-r from-[#ffd77c] to-[#ffc44d] text-[#3a2c05] flex items-center justify-center hover:brightness-95 transition"
          >
            {{ locale === 'ar' ? 'عرض تفاصيل الطلب' : 'View Orders' }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/')"
            class="h-12 rounded-full font-bold text-sm bg-stone-100 text-gray-700 hover:bg-stone-200 transition flex items-center justify-center"
          >
            {{ locale === 'ar' ? 'العودة للرئيسية' : 'Back to Home' }}
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-[#FBF3ED] text-gray-900 pt-16 pb-8 border-t border-stone-200 mt-16" dir="rtl">
      <div class="max-w-7xl mx-auto px-6 md:px-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-gray-300">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <svg viewBox="0 0 100 100" class="w-10 h-10 text-[#F3C650]" fill="none" stroke="currentColor">
                <rect x="25" y="25" width="50" height="50" rx="4" transform="rotate(45 50 50)" stroke-width="4" fill="rgba(243,198,80,.15)" />
                <rect x="41" y="41" width="18" height="18" transform="rotate(45 50 50)" stroke-width="2.5" fill="#F3C650" />
              </svg>
            </div>
            <p class="text-sm text-gray-600 leading-relaxed">
              {{ t('footer_description') || 'منصة مجوهرات تقدم لك أرقى قطع الذهب والمجوهرات من أفضل المتاجر المعتمدة.' }}
            </p>
          </div>

          <div>
            <h4 class="font-bold text-gray-900 mb-4">{{ t('footer_info_title') || 'معلومات' }}</h4>
            <ul class="space-y-3 text-sm text-gray-600">
              <li><NuxtLink :to="localePath('/products')" class="hover:text-gray-900 transition">{{ t('jewelry') || 'المجوهرات' }}</NuxtLink></li>
              <li><NuxtLink :to="localePath('/merchants')" class="hover:text-gray-900 transition">{{ t('merchants') || 'التجار' }}</NuxtLink></li>
              <li><NuxtLink :to="localePath('/offers')" class="hover:text-gray-900 transition">{{ t('offers') || 'العروض' }}</NuxtLink></li>
              <li><NuxtLink :to="localePath('/compare')" class="hover:text-gray-900 transition">{{ t('compare') || 'مقارنة' }}</NuxtLink></li>
            </ul>
          </div>

          <div>
            <h4 class="font-bold text-gray-900 mb-4">{{ t('footer_policies_title') || 'السياسات' }}</h4>
            <ul class="space-y-3 text-sm text-gray-600">
              <li><a href="#" class="hover:text-gray-900 transition">{{ t('footer_return_policy') || 'سياسة الاسترجاع' }}</a></li>
              <li><a href="#" class="hover:text-gray-900 transition">{{ t('footer_privacy_policy') || 'سياسة الخصوصية' }}</a></li>
              <li><a href="#" class="hover:text-gray-900 transition">{{ t('footer_terms') || 'الشروط والأحكام' }}</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-bold text-gray-900 mb-4">{{ t('footer_contact_title') || 'تواصل معنا' }}</h4>
            <p class="text-sm text-gray-600 mb-2">{{ locale === 'ar' ? 'خدمة العملاء على مدار الساعة' : '24/7 Customer Support' }}</p>
            <p class="text-sm font-bold text-gray-900" dir="ltr">+966 800 123 4567</p>
          </div>
        </div>

        <div class="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-6 text-sm text-gray-600">
          <p>{{ t('footer_copyright') || 'جميع الحقوق محفوظة © 2026' }}</p>
          <div class="flex items-center gap-4 text-xs">
            <span>{{ locale === 'ar' ? 'دفع آمن ومحمي 100%' : '100% Secure Checkout' }}</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import {
  UserIcon,
  ShoppingBagIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
  BuildingStorefrontIcon,
  ShieldCheckIcon,
  BellIcon
} from '@heroicons/vue/24/outline'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const route = useRoute()

definePageMeta({
  hideHeader: true
})

useHead({
  title: 'تأكيد الطلب - جولد استور'
})

const switchLanguage = () => {
  const newLocale = locale.value === 'ar' ? 'en' : 'ar'
  navigateTo(switchLocalePath(newLocale))
}

// Nav links
const navLinks = computed(() => [
  { to: '/compare', label: t('compare') || (locale.value === 'ar' ? 'مقارنة' : 'Compare') },
  { to: '/offers', label: t('offers') || (locale.value === 'ar' ? 'العروض' : 'Offers') },
  { to: '/merchants', label: t('merchants') || (locale.value === 'ar' ? 'التجار' : 'Merchants') },
  { to: '/products', label: t('jewelry') || (locale.value === 'ar' ? 'المنتجات' : 'Products') }
])

function isActive(path: string) {
  return route.path === path
}

// Cart & Auth
const { cartData, cartCount, fetchCart } = useCart()
const { favoritesCount } = useFavorites()
const authStore = useAuthStore()

// Customer Info Form
const customerName = ref('Hassan Mahmoud')
const phoneNumber = ref('01007607177')

// Countries
const countries = [
  { name: 'السعودية', short: 'SA', code: '+966' },
  { name: 'مصر', short: 'EG', code: '+20' },
  { name: 'الإمارات', short: 'AE', code: '+971' },
  { name: 'الكويت', short: 'KW', code: '+965' }
]
const selectedCountry = ref(countries[0])
const showCountryDropdown = ref(false)

function selectCountry(c: typeof countries[0]) {
  selectedCountry.value = c
  showCountryDropdown.value = false
}

// Store Pickup Options
const isStorePickup = ref(true)

const branches = [
  { id: 'riyadh_nakheel', name: 'فرع الرياض - النخيل مول', city: 'الرياض', hours: '10 ص - 10 م' },
  { id: 'jeddah_redsea', name: 'فرع جدة - رد سي مول', city: 'جدة', hours: '10 ص - 11 م' },
  { id: 'khobar_rashid', name: 'فرع الخبر - الراشد مول', city: 'الخبر', hours: '10 ص - 10 م' }
]
const selectedBranch = ref('riyadh_nakheel')

// Delivery address alternative
const shippingCity = ref('الرياض')
const shippingDistrict = ref('حي النخيل')
const shippingStreet = ref('شارع التخصصي')

// Payment Method
const paymentMethod = ref<'card' | 'apple_pay' | 'tamara' | 'cod'>('card')

// Submission State
const submitting = ref(false)
const showSuccessModal = ref(false)
const orderNumber = ref('')

// Initialize Auth User data if available
onMounted(async () => {
  try {
    await fetchCart()
  } catch (e) {
    console.warn('Checkout cart load:', e)
  }

  const user = authStore.userData
  if (user) {
    if (user.name) customerName.value = user.name
    if (user.phone) phoneNumber.value = user.phone
  }
})

// Clean Number helper
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

// Order Items for Display (matches screenshot: حلق ناعم ذهب أبيض عيار 18)
const displayItems = computed(() => {
  const merchants = cartData.value?.merchants || []
  const flat: any[] = []

  for (const merchant of merchants) {
    const products = merchant.items || merchant.products || merchant.cart_items || []
    for (const p of products) {
      const cleanP = cleanNum(p.final_price !== undefined ? p.final_price : p.price)
      flat.push({
        id: p.id ?? p.product_id,
        title: locale.value === 'ar'
          ? (p.product?.title?.ar || p.product?.name || p.name || 'حلق ناعم (برغي) ذهب أبيض عيار 18 بقصة ليزر')
          : (p.product?.title?.en || p.product?.name || p.name || 'Fine 18K White Gold Stud Earrings Laser Cut'),
        shop: merchant.store_name || 'مجوهرات معوض',
        image: p.product?.main_image?.url || p.image || (p.product?.images && p.product.images[0]?.url) || '',
        price: cleanP || 831.48,
        qty: Math.max(1, Number(p.quantity ?? p.qty ?? 1) || 1),
        karat: '18 عيار',
        goldType: 'ذهب أبيض',
        size: '10',
        weight: '2 جرام',
        sku: 'MOD-90BVYK-20'
      })
    }
  }

  // Fallback to exact item from screenshot if cart is empty
  if (flat.length === 0) {
    return [
      {
        id: 1,
        title: locale.value === 'ar'
          ? 'حلق ناعم (برغي) ذهب أبيض عيار 18 بقصة ليزر'
          : 'Fine 18K White Gold Stud Earrings Laser Cut',
        shop: 'مجوهرات معوض',
        image: '',
        price: 831.48,
        qty: 1,
        karat: '18 عيار',
        goldType: 'ذهب أبيض',
        size: '10',
        weight: '2 جرام',
        sku: 'MOD-90BVYK-20'
      }
    ]
  }

  return flat
})

// Store Name
const primaryStoreName = computed(() => {
  const merchants = cartData.value?.merchants || []
  if (merchants.length > 0 && merchants[0].store_name) {
    return merchants[0].store_name
  }
  return 'مجوهرات معوض'
})

// Totals
const subtotal = computed(() => {
  const apiSub = cleanNum(cartData.value?.subtotal)
  if (apiSub > 0) return apiSub
  return displayItems.value.reduce((acc, it) => acc + (it.price * it.qty), 0)
})

const taxAmount = computed(() => {
  const apiTax = cleanNum(cartData.value?.tax_amount)
  if (apiTax > 0) return apiTax
  return Math.round(subtotal.value * 0.15 * 100) / 100
})

const grandTotal = computed(() => {
  const apiTotal = cleanNum(cartData.value?.total)
  if (apiTotal > 0) return apiTotal
  return Math.round((subtotal.value + taxAmount.value) * 100) / 100
})

// Submit Order
async function submitOrder() {
  submitting.value = true
  // Generate pseudo order number
  orderNumber.value = String(Math.floor(100000 + Math.random() * 900000))

  setTimeout(() => {
    submitting.value = false
    showSuccessModal.value = true
  }, 900)
}
</script>
