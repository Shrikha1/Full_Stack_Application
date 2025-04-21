<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="toast.type"
        >
          <div class="toast-content">
            <span class="toast-message">{{ toast.message }}</span>
            <button class="toast-close" @click="() => removeToast(toast.id)">
              ×
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

const toasts = ref<Toast[]>([])
let toastId = 0

const addToast = (message: string, type: Toast['type'] = 'info') => {
  const id = toastId++
  toasts.value.push({ id, message, type })
  setTimeout(() => removeToast(id), 5000)
}

const removeToast = (id: number) => {
  toasts.value = toasts.value.filter(toast => toast.id !== id)
}

// Expose methods to parent components
defineExpose({
  success: (message: string) => addToast(message, 'success'),
  error: (message: string) => addToast(message, 'error'),
  info: (message: string) => addToast(message, 'info')
})
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
}

.toast {
  margin-bottom: 10px;
  padding: 15px;
  min-width: 250px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.toast.success {
  background-color: #d4edda;
  border-color: #c3e6cb;
  color: #155724;
}

.toast.error {
  background-color: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
}

.toast.info {
  background-color: #cce5ff;
  border-color: #b8daff;
  color: #004085;
}

.toast-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toast-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0 5px;
  opacity: 0.5;
}

.toast-close:hover {
  opacity: 1;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style> 