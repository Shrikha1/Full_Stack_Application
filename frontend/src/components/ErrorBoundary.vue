<template>
  <div>
    <slot v-if="!error" />
    <div v-else class="error-boundary">
      <h2>Something went wrong</h2>
      <p>{{ error.message }}</p>
      <button @click="resetError" class="retry-button">
        Try Again
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const error = ref<Error | null>(null)

onErrorCaptured((err: Error) => {
  error.value = err
  return false // Prevent error from propagating
})

const resetError = () => {
  error.value = null
}
</script>

<style scoped>
.error-boundary {
  padding: 2rem;
  text-align: center;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.retry-button:hover {
  background-color: #0056b3;
}
</style> 