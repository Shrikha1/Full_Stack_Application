<template>
  <div class="loading-wrapper" :class="{ overlay: isOverlay }">
    <div class="loading-spinner">
      <div class="spinner"></div>
      <p v-if="message" class="loading-message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string
  isOverlay?: boolean
}>()
</script>

<style scoped>
.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.loading-wrapper.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1000;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-message {
  margin-top: 1rem;
  color: #666;
  font-size: 0.9rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 