<template>
  <Teleport to="body">
    <div
      ref="cursorEl"
      class="custom-cursor"
      :class="{
        'custom-cursor--visible': isVisible,
        'custom-cursor--hover': isHoveringInteractive,
        'custom-cursor--click': isMouseDown
      }"
    >
      <svg viewBox="0 0 32 32" class="custom-cursor__icon" fill="none">
        <path
          d="M4 2 L28 16 L16 18 L11 29 Z"
          fill="#F5BF45"
          stroke="#8A6605"
          stroke-width="1.2"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const cursorEl = ref<HTMLElement | null>(null)
const isVisible = ref(false)
const isHoveringInteractive = ref(false)
const isMouseDown = ref(false)

let targetX = -100
let targetY = -100
let currentX = -100
let currentY = -100
let rafId: number | null = null

function onMouseMove(e: MouseEvent) {
  targetX = e.clientX
  targetY = e.clientY
  if (!isVisible.value) {
    isVisible.value = true
    currentX = targetX
    currentY = targetY
  }

  const el = e.target as HTMLElement | null
  if (el) {
    isHoveringInteractive.value = !!el.closest(
      'a, button, input, select, textarea, [role="button"], .cursor-pointer, [onclick]'
    )
  }
}

function onMouseDown() {
  isMouseDown.value = true
}
function onMouseUp() {
  isMouseDown.value = false
}
function onMouseEnter() {
  isVisible.value = true
}
function onMouseLeave() {
  isVisible.value = false
}

function render() {
  // Smooth lerp follow
  currentX += (targetX - currentX) * 0.45
  currentY += (targetY - currentY) * 0.45

  if (cursorEl.value) {
    // Aligned to the pointer tip for 20px size
    cursorEl.value.style.transform = `translate3d(${currentX - 2.5}px, ${currentY - 1.2}px, 0)`
  }

  rafId = requestAnimationFrame(render)
}

onMounted(() => {
  // Only disable on pure mobile/touch devices with NO mouse/trackpad
  const isPureTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches
  if (isPureTouch) return

  document.body.classList.add('custom-cursor-active')
  window.addEventListener('mousemove', onMouseMove, { passive: true })
  window.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mouseup', onMouseUp)
  document.addEventListener('mouseenter', onMouseEnter)
  document.addEventListener('mouseleave', onMouseLeave)

  render()
})

onUnmounted(() => {
  document.body.classList.remove('custom-cursor-active')
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mousedown', onMouseDown)
  window.removeEventListener('mouseup', onMouseUp)
  document.removeEventListener('mouseenter', onMouseEnter)
  document.removeEventListener('mouseleave', onMouseLeave)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style>
/* Hide native cursor only when custom cursor is active */
body.custom-cursor-active,
body.custom-cursor-active * {
  cursor: none !important;
}

.custom-cursor {
  position: fixed;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  pointer-events: none;
  z-index: 9999999;
  opacity: 0;
  will-change: transform;
  transition: opacity 0.15s ease;
}

.custom-cursor--visible {
  opacity: 1;
}

.custom-cursor__icon {
  width: 100%;
  height: 100%;
  display: block;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.25));
  transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: 4px 2px;
}

.custom-cursor--hover .custom-cursor__icon {
  transform: scale(1.15);
}

.custom-cursor--click .custom-cursor__icon {
  transform: scale(0.88);
}
</style>