<template>
  <div class="fixed top-24 left-4 z-[100] flex flex-col gap-3 w-[320px] max-w-[90vw]">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="flex items-center justify-between gap-3 rounded-xl px-4 py-3 shadow-lg text-white"
        :class="{
          'bg-[#22c55e]': toast.type === 'success',
          'bg-[#ef4444]': toast.type === 'error',
          'bg-[#3b82f6]': toast.type === 'info'
        }"
        dir="rtl"
      >
        <div class="flex items-center gap-2.5">
          <span class="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <span class="text-[14px] font-bold leading-snug">{{ toast.message }}</span>
        </div>

        <button
          class="w-5 h-5 flex items-center justify-center shrink-0 opacity-90 hover:opacity-100 transition"
          @click="removeToast(toast.id)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
const { toasts, removeToast } = useToast()
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>