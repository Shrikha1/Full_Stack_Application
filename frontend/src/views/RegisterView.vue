<template>
  <div class="register-container">
    <div class="register-card">
      <h1>Register</h1>
      
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="Enter your email"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="Enter your password"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
            placeholder="Confirm your password"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" :disabled="loading" class="submit-button">
          {{ loading ? 'Registering...' : 'Register' }}
        </button>
      </form>

      <p class="login-link">
        Already have an account?
        <router-link to="/login">Login here</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const authStore = useAuthStore()

const loading = ref(false)
const error = ref<string | null>(null)

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  try {
    loading.value = true
    error.value = null
    await authStore.register({ email: email.value, password: password.value, confirmPassword: confirmPassword.value })
  } catch (err) {
    error.value = authStore.error
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.register-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 500;
  color: #666;
}

input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #007bff;
}

.error-message {
  color: #dc3545;
  text-align: center;
  margin: 0.5rem 0;
}

.submit-button {
  background-color: #007bff;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background-color: #0056b3;
}

.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  margin-top: 1rem;
  color: #666;
}

.login-link a {
  color: #007bff;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style> 