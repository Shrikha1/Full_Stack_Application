<template>
  <div class="register-container">
    <div class="register-box">
      <h2>Register</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="name">Full Name</label>
          <input
            type="text"
            id="name"
            v-model="name"
            required
            placeholder="Enter your full name"
            :disabled="loading"
          />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            placeholder="Enter your email"
            :disabled="loading"
            @input="validateEmail"
          />
          <div v-if="emailError" class="error-message">
            {{ emailError }}
          </div>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="Enter your password"
            :disabled="loading"
          />
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            required
            placeholder="Confirm your password"
            :disabled="loading"
          />
        </div>
        <!-- Show backend validation errors -->
        <div v-if="Array.isArray(validationErrors) && validationErrors.length" class="error-message">
          <ul>
            <li v-for="(msg, idx) in validationErrors" :key="idx">{{ msg }}</li>
          </ul>
        </div>
        <!-- Show single error -->
        <div v-else-if="error" class="error-message">
          {{ error }}
        </div>
        <button type="submit" class="register-button" :disabled="loading">
          {{ loading ? 'Registering...' : 'Register' }}
        </button>
      </form>
      <p class="login-link">
        Already have an account? <router-link to="/login">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const emailError = ref('')
const validationErrors = ref<string[]>([])

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email.value) {
    emailError.value = 'Email is required'
  } else if (!emailRegex.test(email.value)) {
    emailError.value = 'Please enter a valid email address'
  } else {
    emailError.value = ''
  }
  console.log('email:', email.value, 'emailError:', emailError.value, 'loading:', loading.value);
}

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match!'
    validationErrors.value = []
    return
  }
  if (emailError.value) {
    return
  }
  try {
    loading.value = true
    error.value = ''
    validationErrors.value = []
    // Pass confirmPassword to match RegisterCredentials type
    const success = await authStore.register({ email: email.value, password: password.value, confirmPassword: confirmPassword.value })
    if (success) {
      router.push('/login')
    } else {
      // Try to parse backend error
      let backendError: any = authStore.error
      if (typeof backendError === 'string') {
        error.value = backendError
      } else if (backendError && typeof backendError === 'object' && Array.isArray((backendError as any).data)) {
        validationErrors.value = (backendError as any).data
      } else {
        error.value = 'Registration failed'
      }
    }
  } catch (err) {
    error.value = 'An unexpected error occurred'
    validationErrors.value = []
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

.register-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 0.875rem;
}

.register-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}

.register-button:hover:not(:disabled) {
  background-color: #3aa876;
}

.register-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  margin-top: 1rem;
  color: #666;
}

.login-link a {
  color: #42b983;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>