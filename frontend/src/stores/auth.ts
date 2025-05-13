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
    accessToken: localStorage.getItem('accessToken'),
    loading: false,
    error: null as null | string,
    isAuthenticated: !!localStorage.getItem('accessToken'),
  }),
  getters: {},
  actions: {
    async login(credentials: LoginCredentials) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.post('/api/auth/login', credentials);
        
        // Check verification status from response
        if (!res.data.verified) {
          this.error = 'Please verify your email before logging in. Check your inbox for the verification link.';
          localStorage.setItem('pendingVerificationEmail', credentials.email);
          return false;
        }

        this.user = { id: res.data.id, email: res.data.email };
        this.accessToken = res.data.token;
        localStorage.setItem('accessToken', res.data.token);
        this.isAuthenticated = true;
        router.push('/dashboard');
        return true;
      } catch (err: any) {
        // Extract error message - checking for verification error patterns
        const errorMessage = err.response?.data?.message || '';
        
        if (
          errorMessage.includes('verify your email') || 
          errorMessage.includes('ACCOUNT_NOT_VERIFIED') ||
          err.response?.data?.code === 'ACCOUNT_NOT_VERIFIED'
        ) {
          // This is a verification error
          this.error = 'Please verify your email before logging in. Check your inbox for the verification link or request a new one below.';
          // Store email for potential resend
          localStorage.setItem('pendingVerificationEmail', credentials.email);
        } else if (err.response?.status === 500) {
          this.error = 'Server error. Please try again later or contact support if the problem persists.';
        } else {
          this.error = errorMessage || 'Login failed. Please check your credentials and try again.';
        }
        this.user = null;
        this.accessToken = null;
        localStorage.removeItem('accessToken');
        this.isAuthenticated = false;
        return false;
      } finally {
        this.loading = false;
      }
    },
    // Call this on app start to restore session from localStorage
    initializeAuth() {
      const token = localStorage.getItem('accessToken');
      if (token) {
        this.accessToken = token;
        this.isAuthenticated = true;
      }
    },

    async register(credentials: RegisterCredentials) {
      this.loading = true;
      this.error = null;
      try {
        await api.post(
          '/api/auth/register',
          {
            email: credentials.email,
            password: credentials.password
          },
          { withCredentials: true }
        );
        return true;
      } catch (err: any) {
        if (err.response?.data) {
          this.error = err.response.data;
        } else {
          this.error = 'Registration failed';
        }
        return false;
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      // Remove token from localStorage
      localStorage.removeItem('accessToken');
      // Already logged out, avoid multiple calls
      if (!this.isAuthenticated && !this.accessToken && !this.user) {
        router.push('/login');
        return;
      }

      // Clean up local state first
      this.user = null;
      this.accessToken = null;
      this.isAuthenticated = false;
      
      try {
        // Now try to notify the server (but continue even if it fails)
        await api.post('/api/auth/logout', {}, { withCredentials: true });
      } catch (error) {
        // Ignore errors during logout
        console.warn('Logout API call failed, but user was logged out locally');
      }
      
      // Always redirect to login after clearing local state
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
    async resendVerification(email: string) {
      this.loading = true;
      // Don't clear error here to maintain context about verification needs
      try {
        await api.post('/api/auth/resend-verification', { email });
        this.error = 'SUCCESS: Verification email has been sent. Please check your inbox.';
        return true;
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to send verification email. Please try again or contact support.';
        return false;
      } finally {
        this.loading = false;
      }
    }
  },
});