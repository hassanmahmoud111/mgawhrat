<template>
  <button class="flex items-center gap-2 border border-gray-300 rounded-full px-5 py-2.5 text-gray-700 hover:border-gray-400 transition">
    <ChevronDownIcon class="w-4 h-4" />
    <span>{{ label }}</span>
  </button>
</template>

<script setup>
import { ChevronDownIcon } from "@heroicons/vue/24/outline";

defineProps({
  label: { type: String, required: true }
})
</script>