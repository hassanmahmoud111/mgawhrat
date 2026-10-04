<template>
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
        <NuxtLink :to="localePath('/products')" class="font-bold text-gray-700 hover:text-yellow-600 transition">
          {{ t('view_all') }} ←
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        <div
          v-for="item in localizedProducts"
          :key="item.id"
          class="bg-[#FBF3ED] rounded-[30px] shadow-sm hover:shadow-md duration-300 overflow-hidden"
        >
          <NuxtLink :to="localePath(`/products/${item.id}`)">
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

              <h3 class="text-base font-bold text-gray-900 mb-2 leading-snug text-right line-clamp-2">
                {{ item.name }}
              </h3>

              <p class="text-xl font-black text-gray-900 mb-4 text-right">
                <span class="text-sm">﷼</span>{{ item.price }}
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
                  <span :class="item.isFavorite ? 'text-rose-500 text-2xl' : 'text-gray-400 text-2xl'">
                    {{ item.isFavorite ? '♥' : '♡' }}
                  </span>
                </button>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'

const { t, locale } = useI18n()
const localePath = useLocalePath()

const props = defineProps({
  items: {
    type: Array,
    default: null
  }
})

const { data } = useHomeData()

const favorites = ref(new Set())

const localizedProducts = computed(() => {
  // لو الكومبوننت مستلم items من برّه (كـ prop)، استخدمها هي
  if (props.items && props.items.length) {
    return props.items.map(p => ({
      ...p,
      isFavorite: favorites.value.has(p.id)
    }))
  }

  // غير كده، هات المنتجات من الـ API مباشرة
  const apiBestSelling = data.value?.best_selling || []
  return apiBestSelling.slice(0, 8).map(p => ({
    id: p.id,
    name: locale.value === 'ar' ? (p.title?.ar || p.name) : (p.title?.en || p.name),
    store: p.store?.name || (locale.value === 'ar' ? 'متجر مجوهرات' : 'Jewelry Store'),
    storeLogo: p.store?.image || '',
    price: Number(p.final_price || p.price).toLocaleString(),
    rate: p.average_rating ? Number(p.average_rating).toFixed(1) : '4.2',
    image: p.main_image?.url || (p.images && p.images[0]?.url) || '/diamond-ring.jpg',
    isFavorite: favorites.value.has(p.id)
  }))
})

const { addToCart: addItemToCart } = useCart()

function addToCart(item) {
  addItemToCart(item, 1)
}

function toggleFavorite(item) {
  if (favorites.value.has(item.id)) {
    favorites.value.delete(item.id)
  } else {
    favorites.value.add(item.id)
  }
  favorites.value = new Set(favorites.value)
}
</script>