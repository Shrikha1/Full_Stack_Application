import { defineStore } from 'pinia';
import api from '../services/axios';
import router from '../router';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
}

interface AuthUser {
  id: string;
  email: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | AuthUser,
    accessToken: null as null | string,
    loading: false,
    error: null as null | string,
    isAuthenticated: false,
  }),
  getters: {},
  actions: {
    async login(credentials: LoginCredentials) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.post(
          '/api/auth/login',
          credentials,
          { withCredentials: true }
        );
        this.user = res.data.user;
        this.accessToken = res.data.accessToken;
        this.isAuthenticated = true;
        router.push('/dashboard');
        return true;
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Login failed';
        this.user = null;
        this.accessToken = null;
        this.isAuthenticated = false;
        return false;
      } finally {
        this.loading = false;
      }
    },
    async register(credentials: RegisterCredentials) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.post(
          '/api/auth/register',
          {
            email: credentials.email,
            password: credentials.password,
          },
          { withCredentials: true }
        );
        this.user = res.data.user;
        this.accessToken = res.data.accessToken;
        this.isAuthenticated = true;
        return true;
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Registration failed';
        this.user = null;
        this.accessToken = null;
        this.isAuthenticated = false;
        return false;
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      try {
        await api.post('/api/auth/logout', {}, { withCredentials: true });
      } catch {}
      this.user = null;
      this.accessToken = null;
      this.isAuthenticated = false;
      router.push('/login');
    },
    async checkSession() {
      try {
        const res = await api.get('/api/auth/session', { withCredentials: true });
        this.user = res.data.user;
        this.isAuthenticated = true;
      } catch {
        this.user = null;
        this.isAuthenticated = false;
      }
    },
    async refreshToken() {
      try {
        const res = await api.post('/api/auth/refresh-token', {}, { withCredentials: true });
        this.accessToken = res.data.accessToken;
      } catch (err: any) {
        this.accessToken = null;
        this.user = null;
        this.isAuthenticated = false;
        throw err;
      }
    },
    async initializeAuth() {
      if (!this.accessToken) return;
      try {
        // Optionally call /me or similar endpoint to get user info
        // For now, just set isAuthenticated
        this.isAuthenticated = true;
      } catch {
        this.accessToken = null;
        this.user = null;
        this.isAuthenticated = false;
      }
    },
    setUser(user: AuthUser | null) {
      this.user = user;
    },
    setAccessToken(token: string | null) {
      this.accessToken = token;
      if (token) {
        localStorage.setItem('accessToken', token);
        this.isAuthenticated = true;
      } else {
        localStorage.removeItem('accessToken');
        this.isAuthenticated = false;
      }
    },
  },
});