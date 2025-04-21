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
      <div v-if="auth.error" class="error">{{ auth.error }}</div>
      <div class="form-group">
        <router-link to="/register" class="register-link">Don't have an account? Register</router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../../stores/auth';

const email = ref('');
const password = ref('');
const auth = useAuthStore();

async function onSubmit() {
  await auth.login({ email: email.value, password: password.value });
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