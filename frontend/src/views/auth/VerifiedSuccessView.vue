<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-green-50">
    <div class="bg-white p-8 rounded shadow-md text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <h2 class="mt-4 text-2xl font-bold text-green-700">Email Verified Successfully!</h2>
      <p class="mt-2 text-gray-700">You will be redirected to the login page shortly.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

onMounted(() => {
  setTimeout(() => {
    router.push('/login');
  }, 3000);
});
</script>

<style scoped>
.bg-green-50 {
  background-color: #f0fdf4;
}
</style>
