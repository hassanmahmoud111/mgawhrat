<template>
  <div class="min-h-screen bg-[#F8F3EE] font-ibm text-gray-800 selection:bg-[#F3C650] selection:text-gray-900" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
    <div
      v-if="loading"
      class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F9F6F0]"
    >
      <div class="w-12 h-12 border-4 border-[#F3C650] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="text-gray-700 font-bold text-lg">جاري التحميل...</p>
    </div>
    <!-- Top Header -->
<header class="sticky top-0 z-50 bg-[#F4EFEA]/90 backdrop-blur-md flex flex-row-reverse items-center justify-between px-6 md:px-12 py-5 border-b border-stone-200/60 shadow-xs transition-all duration-300">
      <div class="flex flex-row-reverse items-center gap-3">
        <!-- Language Switcher -->
        <button
          @click="switchLanguage"
          class="h-9 px-3.5 rounded-full flex items-center justify-center text-xs font-bold hover:scale-105 transition-all duration-200 shadow-xs bg-white text-gray-800 hover:bg-amber-50 border border-stone-200"
        >
          {{ locale === 'ar' ? 'En' : 'ar' }}
        </button>

        <NuxtLink :to="localePath('/profile')" aria-label="الحساب" class="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition shadow-xs border border-stone-200">
          <UserIcon class="w-5 h-5 text-gray-800" />
        </NuxtLink>
        <NuxtLink :to="localePath('/cart')" aria-label="سلة التسوق" class="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition shadow-xs border border-stone-200 relative">
          <ShoppingBagIcon class="w-5 h-5 text-gray-800" />
          <span
            v-if="cartCount > 0"
            class="absolute -top-1 -right-1 bg-[#F3C650] text-[#4A3728] font-black text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center border-2 border-white shadow-xs leading-none"
          >
            {{ cartCount > 99 ? '99+' : cartCount }}
          </span>
        </NuxtLink>
        <NuxtLink :to="localePath('/favorites')" aria-label="المفضلة" class="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition shadow-xs border border-stone-200">
          <HeartIcon class="w-5 h-5 text-gray-800" />
        </NuxtLink>
        <NuxtLink :to="localePath('/search')" aria-label="البحث" class="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition shadow-xs border border-stone-200">
          <MagnifyingGlassIcon class="w-5 h-5 text-gray-800" />
        </NuxtLink>
      </div>

      <!-- Navigation Links -->
      <nav class="hidden md:flex items-center gap-8 xl:gap-10 font-medium text-base text-gray-700">
        <NuxtLink :to="localePath('/compare')" class="hover:text-gray-950 transition">{{ locale === 'ar' ? 'مقارنة' : 'Compare' }}</NuxtLink>
        <NuxtLink :to="localePath('/offers')" class="hover:text-gray-950 transition">{{ locale === 'ar' ? 'العروض' : 'Offers' }}</NuxtLink>
        <NuxtLink :to="localePath('/merchants')" class="hover:text-gray-950 transition">{{ locale === 'ar' ? 'تجارنا' : 'Merchants' }}</NuxtLink>
        <NuxtLink :to="localePath('/products')" class="text-gray-950 font-bold hover:text-amber-600 transition">{{ locale === 'ar' ? 'منتجات' : 'Products' }}</NuxtLink>
      </nav>

      <!-- Logo -->
      <NuxtLink :to="localePath('/')" class="flex items-center gap-2 shrink-0">
        <div class="w-11 h-11 flex items-center justify-center">
          <svg viewBox="0 0 100 100" class="w-full h-full text-[#D4A017]" fill="none" stroke="currentColor">
            <rect x="25" y="25" width="50" height="50" rx="4" transform="rotate(45 50 50)" stroke-width="4" fill="rgba(243,198,80,.15)" />
            <rect x="33" y="33" width="34" height="34" rx="2" transform="rotate(45 50 50)" stroke-width="3" />
            <rect x="41" y="41" width="18" height="18" transform="rotate(45 50 50)" stroke-width="2.5" fill="#F3C650" />
          </svg>
        </div>
      </NuxtLink>
    </header>

    <!-- Breadcrumb Header -->
    <section class="bg-[#F3E9DF] relative overflow-hidden px-6 md:px-12 py-10 md:py-14 flex flex-col items-center justify-center text-center">
      <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900">
        {{ locale === 'ar' ? 'تفاصيل المنتج' : 'Product Details' }}
      </h1>
      <div class="flex items-center justify-center gap-2 mt-4 text-gray-600 text-sm md:text-base font-medium">
        <NuxtLink :to="localePath('/')" class="font-bold text-gray-900 hover:underline">
          {{ locale === 'ar' ? 'الرئيسية' : 'Home' }}
        </NuxtLink>
        <ChevronLeftIcon class="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
        <NuxtLink :to="localePath('/products')" class="hover:underline">
          {{ locale === 'ar' ? 'المنتجات' : 'Products' }}
        </NuxtLink>
        <ChevronLeftIcon class="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
        <span class="text-gray-500 truncate max-w-xs">{{ product.name }}</span>
      </div>

      <!-- Decorative SVG lines -->
      <svg class="absolute top-0 left-0 w-80 h-full opacity-35 hidden md:block pointer-events-none" viewBox="0 0 300 300" fill="none">
        <g stroke="#D4A017" stroke-width="1">
          <path v-for="i in 12" :key="i" :d="`M ${i * 25} 0 L 300 ${i * 25}`" />
        </g>
      </svg>
    </section>

    <!-- Main Showcase Section -->
    <main class="relative px-4 sm:px-6 md:px-12 py-8 md:py-14 max-w-7xl mx-auto">

      <!-- Floating Action Bar (Right side on large screens) -->
      <div class="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-3">
        <NuxtLink
          :to="localePath('/profile')"
          class="w-11 h-11 rounded-full bg-white shadow-lg border border-stone-200/80 flex items-center justify-center text-gray-800 hover:bg-[#F7C74C] hover:text-black transition-all hover:scale-110"
        >
          <UserIcon class="w-5 h-5" />
        </NuxtLink>
        <NuxtLink
          :to="localePath('/cart')"
          class="w-11 h-11 rounded-full bg-white shadow-lg border border-stone-200/80 flex items-center justify-center text-gray-800 hover:bg-[#F7C74C] hover:text-black transition-all hover:scale-110 relative"
        >
          <ShoppingBagIcon class="w-5 h-5" />
          <span
            v-if="cartCount > 0"
            class="absolute -top-1 -right-1 bg-[#F3C650] text-[#4A3728] font-black text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center border-2 border-white shadow-xs leading-none"
          >
            {{ cartCount > 99 ? '99+' : cartCount }}
          </span>
        </NuxtLink>
        <button
          @click="toggleFavorite"
          class="w-11 h-11 rounded-full bg-white shadow-lg border border-stone-200/80 flex items-center justify-center text-gray-800 hover:bg-rose-50 hover:text-rose-500 transition-all hover:scale-110"
        >
          <HeartIcon :class="isFavorite ? 'w-5 h-5 text-rose-500 fill-rose-500' : 'w-5 h-5 text-gray-800'" />
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative z-10">

        <!-- Image Gallery Side (Left on LTR, Right on RTL) -->
        <div class="lg:col-span-6 flex flex-col gap-4">
          <!-- Big Main Image Showcase Card -->
          <div class="relative bg-white rounded-[32px] md:rounded-[40px] p-6 sm:p-10 shadow-sm border border-stone-200/60 flex items-center justify-center min-h-[380px] sm:min-h-[460px] md:min-h-[500px] overflow-hidden group">
            <img
              :src="activeImage"
              :alt="product.name"
              class="w-full h-auto max-h-[440px] object-contain transition-transform duration-500 group-hover:scale-105"
            />

            <!-- Wishlist Floating Icon on Image -->
            <button
              @click="toggleFavorite"
              class="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition"
            >
              <span :class="isFavorite ? 'text-rose-500 text-2xl' : 'text-gray-400 text-2xl'">
                {{ isFavorite ? '♥' : '♡' }}
              </span>
            </button>
          </div>

          <!-- Thumbnails Row -->
          <div v-if="product.gallery && product.gallery.length > 1" class="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              v-for="(img, i) in product.gallery"
              :key="i"
              @click="activeImage = img"
              class="w-20 h-20 rounded-2xl overflow-hidden bg-white border-2 p-1 flex items-center justify-center cursor-pointer transition shrink-0"
              :class="activeImage === img ? 'border-[#F7C74C] shadow-sm scale-105' : 'border-stone-200 hover:border-amber-300'"
            >
              <img :src="img" :alt="`${product.name} ${i + 1}`" class="w-full h-full object-cover rounded-xl" />
            </button>
          </div>
        </div>

        <!-- Product Information & Details Side -->
        <div class="lg:col-span-6 flex flex-col">

          <!-- 1. Merchant / Store Header Pill -->
          <div class="bg-white/95 rounded-full px-5 py-3 shadow-xs border border-stone-200/80 flex items-center justify-between mb-6">
            <!-- Merchant Avatar & Info -->
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-full bg-gray-900 flex items-center justify-center text-white overflow-hidden shrink-0 border border-stone-200">
                <img v-if="product.store?.image" :src="product.store.image" :alt="product.store.name" class="w-full h-full object-cover" />
                <span v-else class="text-sm font-bold text-[#F7C74C]">
                  {{ product.store?.name?.charAt(0) || '★' }}
                </span>
              </div>

              <div>
                <h4 class="text-sm md:text-base font-bold text-gray-950 leading-tight">
                  {{ product.store?.name || (locale === 'ar' ? 'مجوهرات داماس' : 'Damas Jewelry') }}
                </h4>
                <p class="text-xs text-gray-400 font-medium mt-0.5">
                  {{ product.store?.reviews_count || 0 }} {{ locale === 'ar' ? 'تقييم' : 'reviews' }}
                </p>
              </div>
            </div>

            <!-- Rating & Follow Button -->
            <div class="flex items-center gap-3">
              <span class="flex items-center gap-1 bg-stone-50 border border-stone-200 px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-2xs">
                <span class="text-amber-500">★</span>
                <span>{{ Number(product.store?.rating || 0).toFixed(1) }}</span>
              </span>

              <button
                @click="toggleFollow"
                class="flex items-center gap-1.5 bg-[#F7C74C] hover:bg-[#E5B53D] text-gray-950 font-bold text-xs md:text-sm px-4 py-2 rounded-full shadow-xs transition transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{{ isFollowing ? '✓' : '+' }}</span>
                <span>{{ isFollowing ? (locale === 'ar' ? 'تمت المتابعة' : 'Following') : (locale === 'ar' ? 'متابعة' : 'Follow') }}</span>
              </button>
            </div>
          </div>

          <!-- 2. Product Title -->
          <h1 class="text-2xl sm:text-3xl md:text-[32px] font-black text-gray-950 leading-tight mb-2 tracking-tight">
            {{ product.name }}
          </h1>

          <!-- 3. Star Rating & Score -->
          <div class="flex items-center gap-2 mb-4">
            <span class="text-sm font-bold text-gray-600">({{ Number(product.rating || 0).toFixed(1) }})</span>
            <div class="flex text-amber-400 gap-0.5">
              <template v-for="i in 5" :key="i">
                <StarSolidIcon v-if="i <= Math.round(product.rating || 0)" class="w-4 h-4 fill-amber-400 text-amber-400" />
                <StarSolidIcon v-else class="w-4 h-4 text-stone-300" />
              </template>
            </div>
          </div>

          <!-- 4. Price Row -->
          <div class="flex items-baseline gap-2 mb-5">
            <span class="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
              {{ Number(currentPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
            </span>
            <span class="text-sm sm:text-base font-extrabold text-gray-700">
              {{ product.currency || 'SAR' }}
            </span>
          </div>

          <!-- 5. Model No & Barcode Badges -->
          <div class="flex flex-wrap gap-2.5 mb-6">
            <span
              v-if="currentModelNo"
              class="bg-white/90 border border-stone-200/90 text-gray-800 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full shadow-2xs"
            >
              Model No: {{ currentModelNo }}
            </span>
            <span
              v-if="currentBarcode"
              class="bg-white/90 border border-stone-200/90 text-gray-800 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full shadow-2xs"
            >
              Barcode: {{ currentBarcode }}
            </span>
          </div>

          <!-- 6. Available Product Variants Card -->
          <div class="mb-6">
            <h3 class="text-sm font-bold text-gray-900 mb-3">
              {{ locale === 'ar' ? 'الخيارات المتاحة للمنتج' : 'Available Product Variants' }}
            </h3>

            <!-- Card Container matching Figma -->
            <div class="border-2 border-amber-300/80 bg-white/70 rounded-2xl p-5 shadow-xs transition-all">
              
              <!-- Badges row: Default & In Stock -->
              <div class="flex items-center gap-2 mb-3">
                <span class="bg-[#F7C74C] text-gray-950 text-xs font-black px-3 py-1 rounded-full shadow-2xs">
                  {{ locale === 'ar' ? 'الافتراضي' : 'Default' }}
                </span>
                <span
                  class="text-xs font-bold px-3 py-1 rounded-full shadow-2xs"
                  :class="product.inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'"
                >
                  {{ product.inStock ? (locale === 'ar' ? 'متوفر بالمخزون' : 'In Stock') : (locale === 'ar' ? 'نفذت الكمية' : 'Out of Stock') }}
                </span>
              </div>

              <!-- Variant attributes chips (18K, Yellow Gold, Size, Weight) -->
              <div class="flex flex-wrap gap-2 mb-4">
                <span v-if="currentKarat" class="bg-stone-100/90 text-gray-900 text-xs font-bold px-3.5 py-1.5 rounded-lg border border-stone-200/70">
                  {{ currentKarat }}
                </span>
                <span v-if="currentColor" class="bg-stone-100/90 text-gray-900 text-xs font-bold px-3.5 py-1.5 rounded-lg border border-stone-200/70">
                  {{ currentColor }}
                </span>
                <span v-if="currentSize" class="bg-stone-100/90 text-gray-900 text-xs font-bold px-3.5 py-1.5 rounded-lg border border-stone-200/70">
                  {{ currentSize }}
                </span>
                <span v-if="currentWeight" class="bg-stone-100/90 text-gray-900 text-xs font-bold px-3.5 py-1.5 rounded-lg border border-stone-200/70">
                  {{ currentWeight }}
                </span>
              </div>

              <!-- Inside Variant Price Row -->
              <div class="flex items-center justify-between border-t border-stone-200/60 pt-3 text-sm">
                <span class="text-gray-500 font-semibold">{{ locale === 'ar' ? 'السعر' : 'Price' }}</span>
                <span class="text-gray-950 font-black text-base">
                  {{ Number(currentPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} {{ product.currency || 'SAR' }}
                </span>
              </div>
            </div>
          </div>

          <!-- 7. Quantity & Add to Cart Action -->
          <div class="flex items-center gap-4 mb-6">
            <!-- Quantity Counter Pill -->
            <div class="flex items-center justify-between gap-4 bg-white border border-stone-200 rounded-full px-4 py-2.5 shadow-xs">
              <button
                @click="quantity > 1 && quantity--"
                class="w-7 h-7 rounded-full flex items-center justify-center text-gray-700 hover:bg-stone-100 font-extrabold text-base transition"
              >
                -
              </button>
              <span class="font-black text-gray-950 text-base min-w-[20px] text-center">{{ quantity }}</span>
              <button
                @click="quantity++"
                class="w-7 h-7 rounded-full flex items-center justify-center text-gray-700 hover:bg-stone-100 font-extrabold text-base transition"
              >
                +
              </button>
            </div>

            <!-- Add to Cart Button -->
            <button
              @click="addToCart"
              :disabled="!product.inStock"
              class="flex-1 bg-[#F7C74C] hover:bg-[#E5B53D] disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-950 font-extrabold text-base sm:text-lg py-3 px-8 rounded-full shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0 text-center"
            >
              {{ product.inStock ? (locale === 'ar' ? 'أضف للسلة' : 'Add to Cart') : (locale === 'ar' ? 'غير متوفر حاليًا' : 'Out of Stock') }}
            </button>
          </div>

          <!-- Summary description snippet -->
          <p v-if="product.summary" class="text-gray-600 text-sm leading-relaxed mb-6">
            {{ product.summary }}
          </p>

        </div>

      </div>
    </main>

    <!-- Product Tabs Component (Description, Specs, Reviews) -->
    <ProductTabs />

    <!-- Similar Products Carousel (وصل حديثاً) -->
    <section class="py-12 md:py-16 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto" dir="ltr">
      <div class="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-10 gap-6">
        <div class="order-1 lg:order-2 text-right w-full lg:w-auto">
          <span class="inline-block bg-[#F7C74C] text-gray-950 text-xs font-bold px-4 py-1.5 rounded-full mb-3">
            {{ t('new_arrivals_badge', 'وصل حديثًا') }}
          </span>
          <h2 class="text-3xl md:text-4xl font-black text-gray-900 mb-3">
            {{ t('new_arrivals_title', 'وصل حديثًا') }}
          </h2>
          <p class="text-gray-600 text-sm md:text-base leading-relaxed max-w-lg">
            {{ t('new_arrivals_subtitle', 'اكتشفي أحدث تصاميم المجوهرات الفاخرة المختارة بعناية لتواكب ذوقك الراقي وأحدث صيحات الأناقة.') }}
          </p>
        </div>

        <NuxtLink :to="localePath('/products')" class="order-2 lg:order-1 text-gray-900 font-semibold underline underline-offset-4 hover:text-[#F7C74C] transition-colors">
          {{ t('view_all', 'عرض الكل') }}
        </NuxtLink>
      </div>

      <!-- Carousel Container -->
      <div class="relative">
        <div
          ref="scrollContainer"
          class="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
          @scroll="onScroll"
        >
          <NuxtLink
            v-for="item in localizedNewArrivals"
            :key="item.id"
            :to="localePath(`/produ?id=${item.id}`)"
            class="snap-start flex-shrink-0 w-[calc(50%-8px)] lg:w-[calc(25%-18px)] bg-[#FBF3ED] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 block"
          >
            <!-- Image -->
            <div class="relative p-4 pb-1">
              <span class="absolute top-4 right-4 bg-white rounded-full px-2.5 py-1 text-xs font-bold shadow-sm flex items-center gap-1 z-10">
                <span class="text-[#F7C74C]">★</span>
                <span>{{ item.rating }}</span>
              </span>
              <img
                :src="item.image"
                :alt="item.name"
                class="w-full aspect-square object-contain"
              />
            </div>

            <!-- Details -->
            <div class="px-4 pb-4 pt-1">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                    <img v-if="item.storeLogo" :src="item.storeLogo" alt="" class="w-full h-full object-cover" />
                  </div>
                  <span class="text-xs text-gray-500 truncate max-w-[100px]">{{ item.storeName }}</span>
                </div>
                <div class="w-6 h-6 rounded-full bg-[#F7C74C]/20 flex items-center justify-center">
                  <span class="text-xs">🔗</span>
                </div>
              </div>

              <h3 class="text-sm font-bold text-gray-900 mb-2 leading-snug text-right line-clamp-2">
                {{ item.name }}
              </h3>

              <p class="text-lg font-black text-gray-900 mb-3 text-right">
                <span class="text-sm">﷼</span>{{ item.price }}
              </p>

              <div class="flex items-center gap-2">
                <button @click.prevent="toggleFavorite" class="w-9 h-9 flex-shrink-0 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <span class="text-gray-400">♡</span>
                </button>
                <button @click.prevent="addToCart(item)" class="flex-1 bg-[#F7C74C] hover:bg-[#E5B53D] text-gray-950 text-sm font-bold py-2.5 rounded-full transition-colors">
                  {{ locale === 'ar' ? 'أضف للسلة' : 'Add to Cart' }}
                </button>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Pagination Controls -->
      <div class="flex items-center justify-center gap-4 mt-10">
        <button
          @click="prevSlide"
          class="w-11 h-11 flex-shrink-0 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <span class="text-gray-600 text-lg">←</span>
        </button>

        <div class="flex items-center gap-2">
          <button
            v-for="(dot, index) in totalSlides"
            :key="index"
            @click="goToSlide(index)"
            class="h-2.5 rounded-full transition-all duration-300"
            :class="currentSlide === index
              ? 'w-8 bg-[#F7C74C]'
              : 'w-2.5 bg-gray-300 hover:bg-gray-400'"
          ></button>
        </div>

        <button
          @click="nextSlide"
          class="w-11 h-11 flex-shrink-0 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <span class="text-gray-600 text-lg">→</span>
        </button>
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
import { ref, computed, watch, onMounted } from 'vue';
import {
  UserIcon,
  ShoppingBagIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  ShareIcon,
  ChevronLeftIcon
} from "@heroicons/vue/24/outline";
import { StarIcon as StarSolidIcon } from '@heroicons/vue/24/solid';
import ProductTabs from '~/components/ProductTabs.vue';
import { fetchProductById } from '~~/services/productService';

definePageMeta({
  hideHeader: true
});

const route = useRoute();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();
const { t, locale } = useI18n();

function switchLanguage() {
  const newLocale = locale.value === 'ar' ? 'en' : 'ar';
  return navigateTo(switchLocalePath(newLocale));
}

// Current Product ID (default to 5 from the user's screenshot)
const productId = computed(() => {
  return route.query.id || route.params.id || 5;
});

// Fallback Product matching user's screenshot
const fallbackProduct = {
  id: 5,
  name: '18k Gold Dangling Earrings with Natural Pearl',
  title: {
    ar: 'حلق ذهب عيار 18 متدلي مع لؤلؤ طبيعي',
    en: '18k Gold Dangling Earrings with Natural Pearl'
  },
  price: 1964.59,
  final_price: 1964.59,
  currency: 'SAR',
  rating: 0.0,
  average_rating: 0.0,
  reviews_count: 0,
  model_number: 'MOD-XVEZIC-19',
  barcode: 'GOLD-MJQE03GV-19',
  karat: '18 K',
  color: 'Yellow Gold',
  size: 'Size: 10',
  weight: '3.9 G',
  in_stock: true,
  summary: 'Soft and elegant 18k gold earrings ending with a natural white pearl for a sophisticated classic look at special parties.',
  store: {
    id: 5,
    name: 'مجوهرات داماس',
    image: 'https://backend1.kazamiza.com/mogwharat/storage/merchants/5/showroom_sign/sfzisjw9eYSONvhKebzC.jpg',
    rating: 0.0,
    reviews_count: 0
  },
  main_image: {
    url: '/earring.png'
  },
  images: [
    { url: '/earring.png' },
    { url: '/diamond-ring.jpg' },
    { url: '/necklace.png' }
  ],
  variants: [
    {
      id: 1,
      model_number: 'MOD-XVEZIC-19',
      barcode: 'GOLD-MJQE03GV-19',
      karat: '18 K',
      color: 'Yellow Gold',
      size: 'Size: 10',
      weight: '3.9 G',
      final_price: 1964.59
    }
  ]
};

const apiProduct = ref(null);
const loading = ref(true);

async function loadProductData() {
  loading.value = true;
  try {
    const data = await fetchProductById(productId.value);
    if (data) {
      apiProduct.value = data;
    }
  } catch (err) {
    console.warn('Using fallback data for product details:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }
  loadProductData();
});

watch(productId, () => {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }
  loadProductData();
});

const product = computed(() => {
  const p = apiProduct.value || fallbackProduct;
  const isAr = locale.value === 'ar';

  const titleStr = isAr
    ? (p.title?.ar || p.name || fallbackProduct.title.ar)
    : (p.title?.en || p.name || fallbackProduct.title.en);

  const mainImg = p.main_image?.url || (p.images && p.images[0]?.url) || p.image || '/earring.png';
  const galleryImgs = p.images?.length
    ? p.images.map(img => img.url || img)
    : [mainImg, '/diamond-ring.jpg', '/necklace.png'];

  return {
    id: p.id,
    name: titleStr,
    store: {
      id: p.store?.id || 5,
      name: p.store?.name || p.name || 'مجوهرات داماس',
      image: p.store?.image || 'https://backend1.kazamiza.com/mogwharat/storage/merchants/5/showroom_sign/sfzisjw9eYSONvhKebzC.jpg',
      rating: p.store?.rating ?? p.rating ?? 0.0,
      reviews_count: p.store?.reviews_count ?? p.reviews_count ?? 0,
    },
    rating: p.average_rating ?? p.rating ?? 0.0,
    reviewsCount: p.reviews_count ?? 0,
    price: Number(p.final_price ?? p.price ?? 1964.59),
    currency: p.currency?.currency_code || (typeof p.currency === 'string' ? p.currency : 'SAR'),
    model_number: p.model_number || p.model_no || 'MOD-XVEZIC-19',
    barcode: p.barcode || 'GOLD-MJQE03GV-19',
    karat: p.karat || p.carat || '18 K',
    color: p.color || (isAr ? 'ذهب أصفر' : 'Yellow Gold'),
    size: p.size ? (p.size.toString().includes('Size') ? p.size : `Size: ${p.size}`) : 'Size: 10',
    weight: p.weight ? (p.weight.toString().includes('G') ? p.weight : `${p.weight} G`) : '3.9 G',
    inStock: p.in_stock !== false,
    summary: isAr ? (p.summary?.ar || p.summary || p.description) : (p.summary?.en || p.summary || p.description),
    mainImage: mainImg,
    gallery: galleryImgs,
    variants: p.variants || fallbackProduct.variants
  };
});

useHead({
  title: computed(() => `${product.value.name} - جولد استور`),
});

const selectedVariant = ref(null);
const activeImage = ref('/earring.png');

watch(product, (newP) => {
  if (newP && newP.variants && newP.variants.length) {
    selectedVariant.value = newP.variants[0];
  } else {
    selectedVariant.value = null;
  }
  if (newP && newP.mainImage) {
    activeImage.value = newP.mainImage;
  }
}, { immediate: true });

const currentPrice = computed(() => {
  return selectedVariant.value?.final_price || selectedVariant.value?.price || product.value.price;
});

const currentModelNo = computed(() => {
  return selectedVariant.value?.model_number || product.value.model_number;
});

const currentBarcode = computed(() => {
  return selectedVariant.value?.barcode || product.value.barcode;
});

const currentKarat = computed(() => {
  return selectedVariant.value?.karat || selectedVariant.value?.carat || product.value.karat;
});

const currentColor = computed(() => {
  return selectedVariant.value?.color || product.value.color;
});

const currentSize = computed(() => {
  return selectedVariant.value?.size || product.value.size;
});

const currentWeight = computed(() => {
  return selectedVariant.value?.weight || product.value.weight;
});

const quantity = ref(1);
const isFavorite = ref(false);
const isFollowing = ref(false);

function toggleFavorite() {
  isFavorite.value = !isFavorite.value;
}

function toggleFollow() {
  isFollowing.value = !isFollowing.value;
}

const { addToCart: addItemToCart, cartCount } = useCart();

function addToCart(targetProduct = null) {
  if (targetProduct && targetProduct.id) {
    addItemToCart(targetProduct, 1);
  } else {
    addItemToCart(product.value, quantity.value, {
      variant_id: selectedVariant.value?.id
    });
  }
}

// --- New Arrivals Section ---
const { data: homeData } = useHomeData();

const apiNewArrivals = computed(() => {
  return homeData.value?.new_arrivals || homeData.value?.for_you || [];
});

const localizedNewArrivals = computed(() => {
  return apiNewArrivals.value.map(p => ({
    id: p.id,
    name: locale.value === 'ar' ? (p.title?.ar || p.name) : (p.title?.en || p.name),
    storeName: p.store?.name || '',
    storeLogo: p.store?.image || '',
    price: Number(p.final_price ?? p.price ?? 0).toLocaleString(),
    rating: p.average_rating ? Number(p.average_rating).toFixed(1) : '4.2',
    image: p.main_image?.url || (p.images && p.images[0]?.url) || '/earring.png',
  }));
});

const scrollContainer = ref(null);
const currentSlide = ref(0);

const visibleCount = computed(() => {
  if (import.meta.client && typeof window !== 'undefined') {
    return window.innerWidth >= 1024 ? 4 : 2;
  }
  return 4;
});

const totalSlides = computed(() =>
  Math.max(1, localizedNewArrivals.value.length - visibleCount.value + 1)
);

function scrollToIndex(index) {
  if (!scrollContainer.value) return;
  const card = scrollContainer.value.children[0];
  if (!card) return;
  const cardWidth = card.offsetWidth + 16;
  scrollContainer.value.scrollTo({
    left: cardWidth * index,
    behavior: 'smooth',
  });
}

function goToSlide(index) {
  currentSlide.value = index;
  scrollToIndex(index);
}

function nextSlide() {
  if (currentSlide.value < totalSlides.value - 1) {
    currentSlide.value++;
  } else {
    currentSlide.value = 0;
  }
  scrollToIndex(currentSlide.value);
}

function prevSlide() {
  if (currentSlide.value > 0) {
    currentSlide.value--;
  } else {
    currentSlide.value = totalSlides.value - 1;
  }
  scrollToIndex(currentSlide.value);
}

function onScroll() {
  if (!scrollContainer.value) return;
  const card = scrollContainer.value.children[0];
  if (!card) return;
  const cardWidth = card.offsetWidth + 16;
  currentSlide.value = Math.round(scrollContainer.value.scrollLeft / cardWidth);
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