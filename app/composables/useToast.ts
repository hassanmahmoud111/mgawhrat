import { ref } from 'vue'

interface ToastItem {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

const toasts = ref<ToastItem[]>([])
let counter = 0

export function useToast() {
  function showToast(message: string, type: ToastItem['type'] = 'success', duration = 3000) {
    const id = ++counter
    toasts.value.push({ id, message, type })

    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  function removeToast(id: number) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return { toasts, showToast, removeToast }
}