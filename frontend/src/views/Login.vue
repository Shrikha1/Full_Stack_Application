<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Email address</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
              :class="{ 'border-red-500': errors.email }"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
              :class="{ 'border-red-500': errors.password }"
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="text-sm">
            <router-link
              to="/register"
              class="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Don't have an account? Register
            </router-link>
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            :disabled="loading"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg
                class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>

        <div v-if="error" class="mt-4 text-center text-sm text-red-600">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  email: '',
  password: '',
});

const errors = reactive({
  email: '',
  password: '',
});

const loading = ref(false);
const error = ref('');

const validateForm = () => {
  let isValid = true;
  errors.email = '';
  errors.password = '';

  if (!form.email) {
    errors.email = 'Email is required';
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Email is invalid';
    isValid = false;
  }

  if (!form.password) {
    errors.password = 'Password is required';
    isValid = false;
  }

  return isValid;
};

const handleLogin = async () => {
  if (!validateForm()) return;

  loading.value = true;
  error.value = '';

  try {
    await authStore.login({
      email: form.email,
      password: form.password
    });
    router.push('/dashboard');
  } catch (err: any) {
    error.value = err.response?.data?.message || 'An error occurred during login';
  } finally {
    loading.value = false;
  }
};
</script> 