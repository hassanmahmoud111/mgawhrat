<template>
  <div :dir="locale === 'ar' ? 'rtl' : 'ltr'" :class="locale === 'ar' ? 'font-ibm' : 'font-sans'" class="min-h-screen text-gray-800">
    <AppHeader v-if="showHeader" />
    <CustomCursor />
    <NuxtPage />
    <ToastNotification />
    <!-- Global Cart / Notification Toast -->
    <Transition name="toast-fade">
      <div
        v-if="toastMessage"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900/95 text-white px-6 py-3.5 rounded-full shadow-2xl z-[9999] flex items-center gap-3 text-sm font-bold border border-amber-400/40 backdrop-blur-md transition-all pointer-events-auto"
        :dir="locale === 'ar' ? 'rtl' : 'ltr'"
      >
        <span class="w-2.5 h-2.5 rounded-full bg-[#F3C650] animate-ping"></span>
        <span>{{ toastMessage }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import AppHeader from './components/AppHeader.vue';
import CustomCursor from './components/Customcursor.vue';
import ToastNotification from './components/ToastNotification.vue';

const route = useRoute();
const showHeader = computed(() => {
  const pathSegments = route.path.split('/').filter(Boolean);
  const hiddenPages = ['login', 'cart', 'offers', 'khawatem'];
  return !pathSegments.some(segment => hiddenPages.includes(segment)) && !route.meta?.hideHeader;
});

// Cart initialization and global toast
const { fetchCart, toastMessage } = useCart();
onMounted(() => {
  fetchCart().catch(() => {});
});

// =========================
// Direction (RTL/LTR)
// =========================
const { locale, localeProperties } = useI18n()

useHead({
  htmlAttrs: {
    lang: () => locale.value,
    dir: () => (locale.value === 'ar' ? 'rtl' : 'ltr')
  }
})
</script>

<style>
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}
</style>