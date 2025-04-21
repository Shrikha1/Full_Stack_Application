import axios from 'axios';
import router from '../router';
import { useAuthStore } from '../stores/auth';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// Response interceptor: handle 401 errors globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      const auth = useAuthStore();
      auth.logout();
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default api;
