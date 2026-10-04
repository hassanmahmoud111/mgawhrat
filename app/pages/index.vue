<template>
  <div class="min-h-screen bg-[#F9F6F0] text-gray-800 selection:bg-[#F3C650] selection:text-gray-900" :dir="locale === 'ar' ? 'rtl' : 'ltr'" :class="locale === 'ar' ? 'font-ibm' : 'font-sans'">
    
     <div
      v-if="loading"
      class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F9F6F0]"
    >
      <div class="w-12 h-12 border-4 border-[#F3C650] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="text-gray-700 font-bold text-lg">{{ t('loading') || (locale === 'ar' ? 'جاري التحميل...' : 'Loading...') }}</p>
    </div>
    <!-- 1. HERO BANNER SECTION (Matching Figma Prototype) -->
    
  <section class="min-h-screen relative overflow-hidden bg-[#F8F2EC] flex items-center pb-16">
    <div class="absolute inset-0 overflow-hidden">
      <img
        :src="heroBannerImageUrl"
        :alt="heroBanner?.title || 'Hero Banner'"
        class="w-full h-full object-cover object-center opacity-90 transition-opacity duration-700"
        @error="(e) => { if (e.target) e.target.src = '/hero-bg.jpg' }"
      />
      <div class="absolute inset-0 bg-black/25"></div>

      <!-- Cloud / Fog Fade Effect at the bottom (transitioning seamlessly into #F8F2EC) -->
      <div class="absolute bottom-0 inset-x-0 h-48 sm:h-64 md:h-80 lg:h-96 pointer-events-none z-[2]">
        <!-- Progressive soft blur to give the diffuse cloud / mist feel -->
        <div
          class="absolute inset-0 backdrop-blur-[3px]"
          style="mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 35%, transparent 100%); -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 35%, transparent 100%);"
        ></div>
        <!-- Multi-stop smooth cloud gradient -->
        <div
          class="absolute inset-0"
          style="background: linear-gradient(to top, #F8F2EC 0%, #F8F2EC 18%, rgba(248, 242, 236, 0.94) 34%, rgba(248, 242, 236, 0.78) 52%, rgba(248, 242, 236, 0.45) 72%, rgba(248, 242, 236, 0.15) 88%, transparent 100%);"
        ></div>
      </div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      <div class="lg:col-span-7 pt-6 lg:pt-0" :class="locale === 'ar' ? 'text-right' : 'text-left'">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 text-white text-sm md:text-base font-medium mb-6 shadow-sm">
          <span>{{ t('hero_greeting') }}</span>
          <span class="text-lg">👋</span>
        </div>

        <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-extrabold text-white leading-[1.2] tracking-normal mb-6">
          <template v-if="heroBanner">{{ heroBanner.title }}</template>
          <template v-else>
            {{ t('hero_title_start') }} <span class="text-[#F3C650] inline-block font-black">{{ t('hero_title_highlight') }}</span>
            <br class="hidden sm:block" />
            {{ t('hero_title_end') }}
          </template>
        </h1>

        <p class="text-white/80 text-lg md:text-xl font-normal leading-relaxed max-w-xl mb-8">
          {{ heroBanner ? heroBanner.description : t('hero_subtitle') }}
        </p>

        <div>
          <a
            :href="ctaLink"
            class="inline-flex items-center gap-3 px-9 py-4 bg-[#F5C445] hover:bg-[#E2B234] text-gray-950 font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
          >
            <span>{{ t('shop_now') }}</span>
            <span class="text-xl inline-block">{{ locale === 'ar' ? '←' : '→' }}</span>
          </a>
        </div>
      </div>
    </div>
  </section>


      
 <section class="py-20 bg-[#F8F2EC]">
    <div class="max-w-7xl mx-auto px-6">

      <!-- Heading -->
      <div class="mb-14">
        <span class="inline-block bg-[#F3C650] text-white text-sm px-4 py-1 rounded-full mb-4">
          {{ t('categories_badge') }}
        </span>

        <h2 class="text-4xl md:text-5xl font-extrabold text-gray-900">
          {{ t('categories_title') }}
        </h2>

        <p class="mt-4 text-gray-600 text-lg">
          {{ t('categories_subtitle') }}
        </p>
      </div>

      <!-- Categories -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        <NuxtLink
          v-for="cat in categories"
          :key="cat.id"
          :to="categoryLink(cat)"
          class="group cursor-pointer text-center block"
        >
          <div class="bg-white rounded-[32px] overflow-hidden border border-gray-200 transition-all">
            <img
              :src="cat.image || cat.image_url || fallbackImage"
              :alt="cat.name"
              class="w-full h-60 object-cover duration-300"
            >
          </div>
          <h3 class="mt-5 text-2xl font-bold text-gray-800">{{ cat.name }}</h3>
        </NuxtLink>
      </div>

    </div>
  </section>

    <section class="py-12 md:py-16 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto" v-if="!loading">
  <div class="relative rounded-[36px] md:rounded-[44px] overflow-hidden shadow-2xl border border-white/10 min-h-[320px] md:min-h-[360px]">

    <!-- Background Image (full width) -->
    <div class="absolute inset-0 w-full h-full">
      <img
        :src="offer?.image || '/pass.png'"
        :alt="t('offer_image_alt')"
        class="w-full h-full object-cover opacity-90"
      />
      <!-- Dark overlay على الصورة كلها -->
      <div class="absolute inset-0 bg-[#0A1124]/70"></div>
      <!-- Gradient إضافي جهة النص عشان يبقى واضح أكتر -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-[#0A1124]/90 via-[#0A1124]/40 to-transparent"
        :class="locale === 'ar' ? 'rotate-180' : ''"
      ></div>
    </div>

    <!-- Decorative SVG -->
    <div class="absolute top-0 right-0 w-72 md:w-96 h-72 md:h-96 pointer-events-none opacity-40">
      <svg viewBox="0 0 300 300" fill="none" class="w-full h-full text-[#F3C650]">
        <path d="M40 0 C110 80, 210 120, 300 300" stroke="currentColor" stroke-width="1.2" fill="none"/>
        <path d="M70 0 C130 80, 220 130, 300 270" stroke="currentColor" stroke-width="1.2" fill="none"/>
        <path d="M100 0 C150 80, 230 140, 300 240" stroke="currentColor" stroke-width="1.2" fill="none"/>
        <path d="M130 0 C170 80, 240 150, 300 210" stroke="currentColor" stroke-width="1.2" fill="none"/>
        <path d="M160 0 C190 80, 250 160, 300 180" stroke="currentColor" stroke-width="1.2" fill="none"/>
        <path d="M190 0 C210 80, 260 170, 300 150" stroke="currentColor" stroke-width="1.2" fill="none"/>
        <path d="M220 0 C230 80, 270 180, 300 120" stroke="currentColor" stroke-width="1.2" fill="none"/>
      </svg>
    </div>

    <!-- Content -->
    <div
      class="relative z-10 w-full px-6 md:px-14 py-10 md:py-14 flex flex-col justify-center items-center text-center min-h-[320px] md:min-h-[360px]"
    >
      <h2 class="text-3xl sm:text-4xl md:text-[42px] font-black text-white leading-tight md:leading-[1.25] mb-4 tracking-tight">
        {{ offer?.title }}
      </h2>

      <p class="text-white/80 text-base md:text-lg font-normal leading-relaxed max-w-xl mb-8">
        {{ offer?.subtitle }}
      </p>

      <div>
        <a href="#products"
          class="inline-flex items-center gap-3 px-8 py-3.5 bg-[#F7C74C] hover:bg-[#E5B53D] text-gray-950 font-bold text-base md:text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>{{ t('discover_offers') }}</span>
          <span class="text-lg">{{ locale === 'ar' ? '←' : '→' }}</span>
        </a>
      </div>
    </div>

  </div>
</section>


    <!-- Best Sellers Section -->
    <section class="py-20 bg-[#f8f3ee]">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex items-center justify-between mb-10">
          <div>
            <span class="inline-block bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-bold">
              {{ t('best_sellers_badge') }}
            </span>
            <h2 class="text-4xl font-bold mt-4">{{ t('best_sellers_title') }}</h2>
            <p class="text-gray-500 mt-2">{{ t('best_sellers_subtitle') }}</p>
          </div>
          <NuxtLink :to="localePath('/products')" class="font-bold text-gray-700 hover:text-yellow-600 transition inline-flex items-center gap-1.5">
            <span>{{ t('view_all') }}</span>
            <span>{{ locale === 'ar' ? '←' : '→' }}</span>
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          <div
            v-for="item in localizedProducts"
            :key="item.id"
            class="bg-[#FBF3ED] rounded-[30px] shadow-sm hover:shadow-md duration-300 overflow-hidden"
          >
            <NuxtLink :to="localePath(`/produ?id=${item.id}`)">
              <!-- Image Area -->
              <div class="relative">
                <span class="absolute top-4 right-4 bg-white rounded-full px-2.5 py-1 text-xs font-bold shadow-sm flex items-center gap-1">
                  <span class="text-[#F7C74C]">★</span>
                  <span>{{ item.rate }}</span>
                </span>

                <img :src="item.image" :alt="item.name" class="h-56 w-full object-cover block" />
              </div>

              <!-- Details -->
              <div class="px-5 pb-5 pt-2">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                      <img v-if="item.storeLogo" :src="item.storeLogo" :alt="item.store" class="w-full h-full object-cover" />
                      <span v-else class="text-[10px] text-white font-bold">{{ item.store?.charAt(0) || '★' }}</span>
                    </div>
                    <span class="text-xs text-gray-500">{{ item.store }}</span>
                  </div>
                  <div class="w-7 h-7 rounded-full bg-[#F7C74C]/20 flex items-center justify-center">
                    <span class="text-xs">🔗</span>
                  </div>
                </div>

                <h3
                  class="text-base font-bold text-gray-900 mb-2 leading-snug line-clamp-2"
                  :class="locale === 'ar' ? 'text-right' : 'text-left'"
                >
                  {{ item.name }}
                </h3>

                <p
                  class="text-xl font-black text-gray-900 mb-4"
                  :class="locale === 'ar' ? 'text-right' : 'text-left'"
                >
                  <span class="text-sm me-1 font-bold text-gray-600">{{ t('currency') }}</span>{{ item.price }}
                </p>

                <div class="flex items-center gap-2">
                  <button
                    @click.prevent="addToCart(item)"
                    class="flex-1 bg-[#F7C74C] hover:bg-[#E5B53D] text-gray-950 text-sm font-bold py-3 rounded-full transition-colors active:scale-95"
                  >
                    {{ t('add_to_cart') }}
                  </button>
                  <button
                    @click.prevent="toggleFavorite(item)"
                    class="w-11 h-11 flex-shrink-0 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <span :class="isFavorite(item.id) ? 'text-rose-500 text-2xl' : 'text-gray-400 text-2xl'">
                      {{ isFavorite(item.id) ? '♥' : '♡' }}
                    </span>
                  </button>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

<section class="py-12 md:py-16 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

    <!-- العمود اليمين: كارتين فوق بعض -->
    <div class="flex flex-col gap-6">

      <!-- كارت يمين 1 -->
      <NuxtLink :to="localePath('/offers')" class="block">
        <div class="relative rounded-[32px] overflow-hidden min-h-[280px] flex flex-col justify-end px-8 md:px-10 py-8 bg-[#0A1124] group cursor-pointer">
          <img
            src="/diamond-ring.jpg"
            :alt="t('promo_alt_earrings')"
            class="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-[#0A1124] via-[#0A1124]/60 to-transparent"></div>
          <div class="relative z-10" :class="locale === 'ar' ? 'text-right' : 'text-left'">
            <h3 class="text-white text-2xl font-bold mb-3">{{ t('promo_card1_title') }}</h3>
            <p class="text-white/80 text-sm mb-4 max-w-md" :class="locale === 'ar' ? 'ms-auto' : 'me-auto'">
              {{ t('promo_card1_desc') }}
            </p>
            <span class="inline-flex items-center gap-2 text-amber-300 font-semibold group-hover:text-[#F3C650] transition">
              <span>{{ t('discover_offers') }}</span>
              <span>{{ locale === 'ar' ? '←' : '→' }}</span>
            </span>
          </div>
        </div>
      </NuxtLink>

      <!-- كارت يمين 2 -->
      <NuxtLink :to="localePath('/offers')" class="block">
        <div class="relative rounded-[32px] overflow-hidden min-h-[280px] flex flex-col justify-end px-8 md:px-10 py-8 bg-[#0A1124] group cursor-pointer">
          <img
            src="/diamond-ring.jpg"
            :alt="t('promo_alt_ring')"
            class="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-[#0A1124] via-[#0A1124]/60 to-transparent"></div>
          <div class="relative z-10" :class="locale === 'ar' ? 'text-right' : 'text-left'">
            <h3 class="text-white text-2xl font-bold mb-3">{{ t('promo_card2_title') }}</h3>
            <p class="text-white/80 text-sm mb-4 max-w-md" :class="locale === 'ar' ? 'ms-auto' : 'me-auto'">
              {{ t('promo_card2_desc') }}
            </p>
            <span class="inline-flex items-center gap-2 text-amber-300 font-semibold group-hover:text-[#F3C650] transition">
              <span>{{ t('discover_offers') }}</span>
              <span>{{ locale === 'ar' ? '←' : '→' }}</span>
            </span>
          </div>
        </div>
      </NuxtLink>

    </div>

    <!-- العمود الشمال: كارت واحد بنفس ارتفاع الاتنين مجمعين -->
    <NuxtLink :to="localePath('/offers')" class="block h-full">
      <div class="relative rounded-[32px] overflow-hidden min-h-[280px] h-full group cursor-pointer">
        <img
          src="/diamond-ring.jpg"
          :alt="t('promo_alt_jewelry_ring')"
          class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent"></div>

        <div class="relative z-10 px-6 md:px-8 py-6 md:py-8" :class="locale === 'ar' ? 'text-right' : 'text-left'">
          <h3 class="text-white text-xl md:text-2xl font-bold mb-3">{{ t('promo_card1_title') }}</h3>
          <p class="text-white/90 text-sm mb-4 max-w-md" :class="locale === 'ar' ? 'ms-auto' : 'me-auto'">
            {{ t('promo_card1_desc') }}
          </p>
          <span class="inline-flex items-center gap-2 text-amber-300 font-semibold group-hover:text-[#F3C650] transition">
            <span>{{ t('discover_offers') }}</span>
            <span>{{ locale === 'ar' ? '←' : '→' }}</span>
          </span>
        </div>
      </div>
    </NuxtLink>

  </div>
</section>

  <section class="py-12 md:py-16 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">

  <!-- Header -->
  <div class="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-10 gap-6">

    <div class="w-full lg:w-auto" :class="locale === 'ar' ? 'text-right' : 'text-left'">
      <span class="inline-block bg-[#F7C74C] text-gray-950 text-xs font-bold px-4 py-1.5 rounded-full mb-3">
        {{ t('new_arrivals_badge') }}
      </span>
      <h2 class="text-3xl md:text-4xl font-black text-gray-900 mb-3">{{ t('new_arrivals_title') }}</h2>
      <p class="text-gray-600 text-sm md:text-base leading-relaxed max-w-lg">
        {{ t('new_arrivals_subtitle') }}
      </p>
    </div>

    <NuxtLink :to="localePath('/products')" class="text-gray-900 font-semibold underline underline-offset-4 hover:text-[#F7C74C] transition-colors">
      {{ t('view_all') }}
    </NuxtLink>
  </div>

  <!-- Carousel -->
  <div class="relative">
    <div
      ref="scrollContainer"
      class="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
      @scroll="onScroll"
    >
      <NuxtLink
        v-for="product in localizedNewArrivals"
        :key="product.id"
        :to="localePath(`/produ?id=${product.id}`)"
        class="snap-start flex-shrink-0 w-[calc(50%-8px)] lg:w-[calc(25%-18px)] bg-[#FBF3ED] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 block"
      >
        <!-- Image -->
        <div class="relative">
          <span class="absolute top-4 right-4 bg-white rounded-full px-2.5 py-1 text-xs font-bold shadow-sm flex items-center gap-1 z-10">
            <span class="text-[#F7C74C]">★</span>
            <span>{{ product.rating }}</span>
          </span>
          <img
            :src="product.image"
            :alt="product.name"
            class="w-full aspect-square object-contain"
          />
        </div>

        <!-- Details -->
        <div class="px-4 pb-4 pt-1">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center overflow-hidden"></div>
              <span class="text-xs text-gray-500">{{ product.storeName }}</span>
            </div>
            <div class="w-6 h-6 rounded-full bg-[#F7C74C]/20 flex items-center justify-center">
              <span class="text-xs">🔗</span>
            </div>
          </div>

          <h3
            class="text-sm font-bold text-gray-900 mb-2 leading-snug"
            :class="locale === 'ar' ? 'text-right' : 'text-left'"
          >
            {{ product.name }}
          </h3>

          <p
            class="text-lg font-black text-gray-900 mb-3"
            :class="locale === 'ar' ? 'text-right' : 'text-left'"
          >
            <span class="text-sm me-1 font-bold text-gray-600">{{ t('currency') }}</span>{{ product.price }}
          </p>

          <div class="flex items-center gap-2">
            <button
              @click.prevent.stop="toggleFavorite(product)"
              class="w-9 h-9 flex-shrink-0 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <span :class="isFavorite(product.id) ? 'text-rose-500 text-xl' : 'text-gray-400 text-xl'">
                {{ isFavorite(product.id) ? '♥' : '♡' }}
              </span>
            </button>
            <button
              @click.prevent.stop="addToCart(product)"
              class="flex-1 bg-[#F7C74C] hover:bg-[#E5B53D] text-gray-950 text-sm font-bold py-2.5 rounded-full transition-colors active:scale-95"
            >
              {{ t('add_to_cart') }}
            </button>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>

  <!-- Pagination Controls -->
  <div class="flex items-center justify-center gap-4 mt-10" dir="ltr">
    <button
      @click="locale === 'ar' ? nextSlide() : prevSlide()"
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
      @click="locale === 'ar' ? prevSlide() : nextSlide()"
      class="w-11 h-11 flex-shrink-0 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
    >
      <span class="text-gray-600 text-lg">→</span>
    </button>
  </div>

</section>

<section class="py-12 md:py-16 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto" v-if="!loading">
  <div class="relative rounded-[36px] md:rounded-[44px] bg-[#0A1124] overflow-hidden shadow-2xl border border-white/10 flex flex-col lg:flex-row items-center justify-end min-h-[360px] md:min-h-[400px]">

    <!-- Left Side: Jewelry Image -->
    <div class="w-full lg:w-1/2 h-72 lg:h-full absolute left-0 top-0 bottom-0 pointer-events-none overflow-hidden">
      <img
        :src="discountBanner?.image || '/passs.jpeg'"
        :alt="t('discount_banner_alt')"
        class="w-full h-full object-cover object-left opacity-90 scale-105"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-[#0A1124]/75 to-[#0A1124]"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A1124]/50 to-[#0A1124] lg:hidden"></div>
    </div>

    <!-- Decorative SVG -->
    <div class="absolute top-0 right-0 w-72 md:w-96 h-72 md:h-96 pointer-events-none opacity-30">
      <svg viewBox="0 0 300 300" fill="none" class="w-full h-full text-[#F3C650]">
        <path d="M40 0 C110 80, 210 120, 300 300" stroke="currentColor" stroke-width="1.2" fill="none"/>
        <path d="M70 0 C130 80, 220 130, 300 270" stroke="currentColor" stroke-width="1.2" fill="none"/>
        <path d="M100 0 C150 80, 230 140, 300 240" stroke="currentColor" stroke-width="1.2" fill="none"/>
        <path d="M130 0 C170 80, 240 150, 300 210" stroke="currentColor" stroke-width="1.2" fill="none"/>
        <path d="M160 0 C190 80, 250 160, 300 180" stroke="currentColor" stroke-width="1.2" fill="none"/>
        <path d="M190 0 C210 80, 260 170, 300 150" stroke="currentColor" stroke-width="1.2" fill="none"/>
        <path d="M220 0 C230 80, 270 180, 300 120" stroke="currentColor" stroke-width="1.2" fill="none"/>
      </svg>
    </div>

    <!-- Content -->
    <div
      class="relative z-10 w-full px-6 md:px-14 py-10 md:py-14 flex flex-col justify-center items-center text-center"
    >
      <h2 class="text-3xl sm:text-4xl md:text-[46px] font-black text-white leading-tight md:leading-[1.25] mb-4 tracking-tight">
        {{ discountBanner?.title }}
      </h2>

      <p class="text-white/80 text-base md:text-lg font-normal leading-relaxed max-w-xl mb-8">
        {{ discountBanner?.subtitle }}
      </p>

      <div>
        <a
          href="#products"
          class="inline-flex items-center gap-3 px-8 py-3.5 bg-[#F7C74C] hover:bg-[#E5B53D] text-gray-950 font-bold text-base md:text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>{{ t('discover_offers') }}</span>
          <span class="text-lg">{{ locale === 'ar' ? '←' : '→' }}</span>
        </a>
      </div>
    </div>

  </div>
</section>



    <!-- 4. FOOTER SECTION -->
   
  </div>
  <footer class="relative bg-[#FBF3ED] text-gray-900 pt-24 pb-10" >
  <div class="max-w-7xl mx-auto px-6 md:px-12">

    <!-- Top: 4 columns -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-14 pb-14 border-b border-gray-300">

      <!-- Logo + description + commercial register -->
      <div :class="locale === 'ar' ? 'text-right lg:order-4' : 'text-left lg:order-1'">
        <div class="flex items-center gap-2 mb-7" :class="locale === 'ar' ? 'justify-end' : 'justify-start'">
          <svg viewBox="0 0 100 100" class="w-10 h-10 text-[#F3C650]" fill="none" stroke="currentColor">
            <rect x="25" y="25" width="50" height="50" rx="4" transform="rotate(45 50 50)" stroke-width="4" fill="rgba(243, 198, 80, 0.15)"/>
            <rect x="41" y="41" width="18" height="18" transform="rotate(45 50 50)" stroke-width="2.5" fill="#F3C650"/>
          </svg>
        </div>
        <p class="text-gray-800 leading-loose text-[15px] mb-7">
          {{ t('footer_description') }}
        </p>
        <div class="bg-white rounded-xl px-5 py-4 flex items-center gap-3 text-[13px] font-bold text-gray-800" :class="locale === 'ar' ? 'justify-end' : 'justify-start'">
          <span>{{ t('footer_commercial_register') }}: 87542100</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-[#8a7f6f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      </div>

      <!-- معلومات وعناوين -->
      <div :class="locale === 'ar' ? 'text-right lg:order-3' : 'text-left lg:order-2'">
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
      <div :class="locale === 'ar' ? 'text-right lg:order-2' : 'text-left lg:order-3'">
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
      <div :class="locale === 'ar' ? 'text-right lg:order-1' : 'text-left lg:order-4'">
        <h4 class="font-bold text-[16px] mb-7">{{ t('footer_contact_title') }}</h4>
        <ul class="space-y-5 text-[14.5px] text-gray-700">
          <li class="flex items-center gap-3" :class="locale === 'ar' ? 'justify-end' : 'justify-start'">
            <span class="font-bold" dir="ltr">0096656876293</span>
            <span class="w-8 h-8 rounded-full bg-[#F3E9DF] flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-[#8a7f6f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </span>
          </li>
          <li class="flex items-center gap-3" :class="locale === 'ar' ? 'justify-end' : 'justify-start'">
            <span class="font-bold" dir="ltr">info@mogwharat.com</span>
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

  <!-- Floating action icons (profile / cart / favorites) -->
  <div class="fixed left-5 bottom-24 z-40 flex flex-col items-center gap-4">
    <NuxtLink :to="localePath('/profile')" class="w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center text-gray-800 hover:shadow-lg transition">
      <UserIcon class="w-5 h-5" />
    </NuxtLink>
    <NuxtLink :to="localePath('/cart')" class="relative w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center text-gray-800 hover:shadow-lg transition">
      <ShoppingBagIcon class="w-5 h-5" />
      <span
        v-if="cartCount > 0"
        class="absolute -top-1 -right-1 bg-[#F3C650] text-[#4A3728] font-black text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center border-2 border-white leading-none"
      >
        {{ cartCount > 99 ? '99+' : cartCount }}
      </span>
    </NuxtLink>
    <NuxtLink :to="localePath('/favorites')" class="relative w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center hover:shadow-lg transition">
      <HeartIcon class="w-5 h-5 text-rose-500" />
      <span
        v-if="favoritesCount > 0"
        class="absolute -top-1 -right-1 bg-rose-500 text-white font-black text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center border-2 border-white leading-none"
      >
        {{ favoritesCount > 99 ? '99+' : favoritesCount }}
      </span>
    </NuxtLink>
  </div>
</footer>
</template>

<script setup>
import { HeartIcon, ShoppingBagIcon } from "@heroicons/vue/24/outline";

const { t, locale } = useI18n()
const localePath = useLocalePath()
// خريطة تربط الكاتيجوري (بالـ id أو بالاسم) بمسار الصفحة الحقيقي
const categoryRouteMap = {
  1: '/khawatem',        // خواتم / Rings
  'Rings': '/khawatem',
  'خواتم': '/khawatem',
  // ضيف باقي الكاتيجوريز هنا لما تعرف الـ id أو الاسم بتاعها
  // 2: '/salasel',
  // 'Necklaces': '/salasel',
}

const offer = computed(() => {
  const b = data.value?.offer || data.value?.banners?.level_2?.[0] || null
  if (!b) return null
  return {
    title: locale.value === 'ar' ? (b.title?.ar || b.title) : (b.title?.en || b.title),
    subtitle: locale.value === 'ar' ? (b.description?.ar || b.description || b.subtitle) : (b.description?.en || b.description || b.subtitle),
    image: cleanImageUrl(b.image_url || b.image, '/pass.png')
  }
})
const discountBanner = computed(() => {
  const b = data.value?.banners?.level_3?.[0] || data.value?.discount_banner || null
  if (!b) return null
  return {
    title: locale.value === 'ar' ? (b.title?.ar || b.title) : (b.title?.en || b.title),
    subtitle: locale.value === 'ar' ? (b.description?.ar || b.description || b.subtitle) : (b.description?.en || b.description || b.subtitle),
    image: cleanImageUrl(b.image_url || b.image, '/passs.jpeg')
  }
})

function categoryLink(cat) {
  if (!cat) return localePath('/products')
  const matched = (cat.id && categoryRouteMap[cat.id]) || (cat.name && categoryRouteMap[cat.name])
  if (matched) return localePath(matched)

  // fallback لو مفيش تطابق لسه
  if (cat.slug) return localePath(`/${cat.slug}`)
  if (cat.id) return localePath(`/category/${cat.id}`)
  return localePath('/products')
}
useHead({
  title: 'جولد استور - مجوهرات فاخرة',
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap'
    }
  ]
})

const { data, loading } = useHomeData()

function cleanImageUrl(url, fallback = '/hero-bg.jpg') {
  if (!url) return fallback
  let clean = String(url).trim().replace(/\\/g, '')
  if (clean.startsWith('//')) {
    clean = 'https:' + clean
  } else if (!clean.startsWith('http://') && !clean.startsWith('https://') && !clean.startsWith('/')) {
    clean = 'https://' + clean
  }
  return clean
}

const heroBanner = computed(() => data.value?.banners?.level_1?.[0] ?? null)

const heroBannerImageUrl = computed(() => {
  const raw = heroBanner.value?.image_url || heroBanner.value?.image
  return cleanImageUrl(raw, '/hero-bg.jpg')
})

const ctaLink = computed(() => {
  const b = heroBanner.value
  if (!b) return '#products'
  if (b.redirect_type === 'product' && b.product_id) return `/products/${b.product_id}`
  if (b.redirect_type === 'category' && b.category_id) return `/categories/${b.category_id}`
  return '#products'
})

// ---- favorites & cart ----
// ✅ addToCart و toggleFavorite جايين مباشرة من الـ composables
// لأن الاتنين بينادوا نظام التوست الأخضر الموحد بنفسهم من جواهم
const { isFavorite, toggleFavorite } = useFavorites()
const { addToCart, cartCount } = useCart()

const localizedProducts = computed(() => {
  const apiBestSelling = data.value?.best_selling || []
  return apiBestSelling.slice(0, 8).map(p => ({
    id: p.id,
    name: locale.value === 'ar' ? (p.title?.ar || p.name) : (p.title?.en || p.name),
    store: p.store?.name || (locale.value === 'ar' ? 'متجر مجوهرات' : 'Jewelry Store'),
    storeLogo: p.store?.image || '',
    price: Number(p.final_price || p.price).toLocaleString(),
    rate: p.average_rating ? Number(p.average_rating).toFixed(1) : '4.2',
    image: p.main_image?.url || (p.images && p.images[0]?.url) || '/diamond-ring.jpg',
    isFavorite: isFavorite(p.id)
  }))
})

// بنجيب المنتجات من الـ API - جرب new_arrivals الأول، ولو مش موجود نجرب for_you
const apiNewArrivals = computed(() => {
  return data.value?.new_arrivals || data.value?.for_you || []
})

const localizedNewArrivals = computed(() => {
  return apiNewArrivals.value.map(p => ({
    id: p.id,
    name: locale.value === 'ar' ? (p.title?.ar || p.name) : (p.title?.en || p.name),
    storeName: p.store?.name || (locale.value === 'ar' ? 'متجر مجوهرات' : 'Jewelry Store'),
    storeLogo: p.store?.image || '',
    price: Number(p.final_price || p.price).toLocaleString(),
    rating: p.average_rating ? Number(p.average_rating).toFixed(1) : '4.2',
    image: p.main_image?.url || (p.images && p.images[0]?.url) || '/diamond-ring.jpg',
  }))
})

const visibleCount = computed(() => {
  if (import.meta.client && typeof window !== 'undefined') {
    return window.innerWidth >= 1024 ? 4 : 2;
  }
  return 4;
});

const totalSlides = computed(() =>
  Math.max(1, localizedNewArrivals.value.length - visibleCount.value + 1)
)

const scrollContainer = ref(null);
const currentSlide = ref(0);

// Smooth container-only scrolling that works equally in RTL and LTR
function scrollToIndex(index) {
  if (!scrollContainer.value) return;
  const children = scrollContainer.value.children;
  if (!children || !children[index]) return;
  const containerRect = scrollContainer.value.getBoundingClientRect();
  const cardRect = children[index].getBoundingClientRect();
  const offset = cardRect.left - containerRect.left;
  scrollContainer.value.scrollBy({
    left: offset,
    behavior: 'smooth'
  });
}

function goToSlide(index) {
  currentSlide.value = Math.max(0, Math.min(index, totalSlides.value - 1));
  scrollToIndex(currentSlide.value);
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
  const children = scrollContainer.value.children;
  if (!children || !children[0]) return;
  const cardWidth = children[0].offsetWidth + (typeof window !== 'undefined' && window.innerWidth >= 768 ? 24 : 16);
  if (cardWidth <= 0) return;
  const currentScroll = Math.abs(scrollContainer.value.scrollLeft);
  const index = Math.round(currentScroll / cardWidth);
  currentSlide.value = Math.min(Math.max(0, index), totalSlides.value - 1);
}

// =========================================================================
// Home Scroll Preservation (الرجوع لنفس المكان في الصفحة الرئيسية عند العودة)
// =========================================================================
function saveHomeScroll() {
  if (typeof window !== 'undefined' && window.scrollY > 0) {
    sessionStorage.setItem('home_scroll_position', window.scrollY.toString());
  }
}

function restoreHomeScroll() {
  if (typeof window === 'undefined') return;
  const saved = sessionStorage.getItem('home_scroll_position');
  if (!saved) return;
  const y = parseInt(saved, 10);
  if (isNaN(y) || y <= 0) return;

  const applyScroll = () => {
    window.scrollTo({ top: y, behavior: 'instant' });
  };

  applyScroll();
  requestAnimationFrame(applyScroll);
  setTimeout(applyScroll, 60);
  setTimeout(applyScroll, 200);
  setTimeout(applyScroll, 500);
}

onMounted(() => {
  window.addEventListener('scroll', saveHomeScroll, { passive: true });
  restoreHomeScroll();
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', saveHomeScroll);
  }
});

onBeforeRouteLeave(() => {
  saveHomeScroll();
});

watch(loading, (isLoading) => {
  if (!isLoading) {
    nextTick(() => {
      restoreHomeScroll();
    });
  }
});

watch(data, () => {
  nextTick(() => {
    restoreHomeScroll();
  });
});

// بناخد أول 5 كاتيجوريز بس من categorized_products
const categories = computed(() => {
  return (data.value?.categorized_products || [])
    .slice(0, 5)
    .map(item => item.category)
})

// fallback صورة لو الكاتيجوري مفيهاش صورة
const fallbackImage = '/diamond-ring.jpg'

// دالة بترجع رابط الكاتيجوري
function getCategoryLink(category) {
  return categoryLink(category)
}
</script>


<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(2deg); }
}
@keyframes floatDelayed {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-16px) rotate(-2deg); }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.animate-float {
  animation: float 4s ease-in-out infinite;
}
.animate-float-delayed {
  animation: floatDelayed 5s ease-in-out infinite 1s;
}
.font-cairo {
  font-family: 'Cairo', sans-serif;
}
</style>