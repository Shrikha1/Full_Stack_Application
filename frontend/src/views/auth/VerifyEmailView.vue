<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img class="mx-auto h-12 w-auto" src="@/assets/logo.png" alt="Your Company Logo" />
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Email Verification</h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div v-if="loading" class="text-center">
          <p class="text-gray-600">Verifying your email...</p>
          <div class="mt-4 flex justify-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>

        <div v-else-if="error" class="text-center">
          <div class="text-red-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-lg font-medium mt-2">Verification Failed</h3>
          </div>
          <p class="text-gray-600">{{ errorMessage }}</p>
          <div class="mt-4">
            <button @click="resendVerification" class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Resend Verification Email
            </button>
          </div>
        </div>

        <div v-else class="text-center">
          <div class="text-green-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <h3 class="text-lg font-medium mt-2">Email Verified!</h3>
          </div>
          <p class="text-gray-600">Your email has been successfully verified. You can now log in to your account.</p>
          <div class="mt-4">
            <router-link to="/login" class="w-full inline-block py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Go to Login
            </router-link>
          </div>
        </div>

        <div v-if="resendSuccess" class="mt-4 p-2 bg-green-50 rounded-md border border-green-200">
          <p class="text-sm text-green-700">Verification email has been sent. Please check your inbox.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/services/axios';

const route = useRoute();
const loading = ref(true);
const error = ref(false);
const errorMessage = ref('');
const resendSuccess = ref(false);

// Get token from route params
const token = route.params.token as string;
const email = route.query.email as string;

// Verify the email when component is mounted
import { useRouter } from 'vue-router';
const router = useRouter();

onMounted(async () => {
  if (!token) {
    loading.value = false;
    error.value = true;
    errorMessage.value = 'Invalid verification link. Please request a new verification email.';
    return;
  }

  try {
    await api.get(`/api/auth/verify-email/${token}`);
    loading.value = false;
    // Route to dedicated success page
    router.push({ name: 'VerifiedSuccess' });
  } catch (err: any) {
    loading.value = false;
    error.value = true;
    errorMessage.value = err.response?.data?.message || 'Error verifying your email. The link may have expired.';
  }
});

// Function to resend verification email
async function resendVerification() {
  if (!email) {
    errorMessage.value = 'Email address is missing. Please try registering again.';
    return;
  }

  try {
    await api.post('/api/auth/resend-verification', { email });
    resendSuccess.value = true;
    // Reset after 5 seconds
    setTimeout(() => {
      resendSuccess.value = false;
    }, 5000);
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'Failed to resend verification email.';
  }
}
</script>
