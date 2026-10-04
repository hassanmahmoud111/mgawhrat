<template>
  <div></div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
await navigateTo(localePath('/auth/signup'), { replace: true })
</script>
