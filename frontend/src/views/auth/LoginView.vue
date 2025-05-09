<template>
  <div class="login-container">
    <form class="login-form" @submit.prevent="onSubmit">
      <h2>Login</h2>
      <div class="form-group">
        <label for="email">Email</label>
        <input v-model="email" type="email" id="email" required autocomplete="username" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input v-model="password" type="password" id="password" required autocomplete="current-password" />
      </div>
      <div class="form-group">
        <button type="submit" :disabled="auth.loading">{{ auth.loading ? 'Logging in...' : 'Login' }}</button>
      </div>
      <!-- Success notification for verification email -->  
      <div v-if="auth.error && auth.error.startsWith('SUCCESS:')" class="success">
        {{ auth.error.replace('SUCCESS:', '').trim() }}
      </div>
      
      <!-- Error display with special handling for verification errors -->
      <div v-else-if="auth.error" :class="{'error': true, 'verification-error': isVerificationError}">
        <div class="error-message">{{ auth.error }}</div>
        
        <div v-if="isVerificationError" class="verification-help">
          <p>Didn't receive the verification email?</p>
          <button @click="resendVerification" class="resend-button" :disabled="resending">
            {{ resending ? 'Sending...' : 'Resend Verification Email' }}
          </button>
          
          <!-- Help text for users who need assistance -->
          <div class="verification-tips">
            <p><strong>Tips:</strong></p>
            <ul>
              <li>Check your spam/junk folder</li>
              <li>Make sure you entered the correct email address</li>
              <li>Try using a different email provider if problems persist</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="form-group">
        <router-link to="/register" class="register-link">Don't have an account? Register</router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../../stores/auth';

const email = ref('');
const password = ref('');
const auth = useAuthStore();
const resending = ref(false);

// Computed property to detect verification errors
const isVerificationError = computed(() => {
  if (!auth.error) return false;
  return (
    auth.error.includes('verify your email') || 
    auth.error.includes('verification') || 
    auth.error.includes('ACCOUNT_NOT_VERIFIED')
  );
});

onMounted(() => {
  // Check if we have a pending verification email
  const pendingEmail = localStorage.getItem('pendingVerificationEmail');
  if (pendingEmail) {
    email.value = pendingEmail;
  }
});

async function onSubmit() {
  await auth.login({ email: email.value, password: password.value });
}

async function resendVerification() {
  if (!email.value) {
    auth.error = 'Please enter your email address first';
    return;
  }
  
  resending.value = true;
  try {
    await auth.resendVerification(email.value);
  } finally {
    resending.value = false;
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
.login-form {
  background: #fff;
  padding: 2rem 2.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  min-width: 320px;
}
.form-group {
  margin-bottom: 1.2rem;
}
label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 500;
}
input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}
button {
  width: 100%;
  padding: 0.7rem;
  background: #0062e0;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s;
}
button:disabled {
  background: #b3c6e0;
  cursor: not-allowed;
}
.error {
  color: #d32f2f;
  margin-top: 0.5rem;
  font-size: 0.96rem;
  text-align: center;
  padding: 0.5rem;
  background-color: #ffebee;
  border-radius: 4px;
}

.verification-error {
  border-left: 4px solid #ff9800;
}

.success {
  color: #2e7d32;
  margin-top: 0.5rem;
  font-size: 0.96rem;
  text-align: center;
  padding: 0.8rem;
  background-color: #e8f5e9;
  border-radius: 4px;
  border-left: 4px solid #4caf50;
}
.verification-help {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #ffcdd2;
}
.verification-help p {
  margin-bottom: 0.5rem;
  color: #666;
}

.verification-tips {
  margin-top: 15px;
  font-size: 0.9em;
  color: #555;
}

.verification-tips ul {
  margin-top: 5px;
  padding-left: 20px;
  text-align: left;
}

.verification-tips li {
  margin-bottom: 5px;
  line-height: 1.4;
}
.resend-button {
  background: #f44336;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}
.resend-button:hover:not(:disabled) {
  background: #d32f2f;
}
.resend-button:disabled {
  background: #ffcdd2;
  cursor: not-allowed;
}
.register-link {
  display: block;
  margin-top: 1rem;
  text-align: center;
  color: #3498db;
  text-decoration: none;
  font-size: 0.98rem;
}
.register-link:hover {
  text-decoration: underline;
}
</style>