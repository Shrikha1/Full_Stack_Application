import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/auth/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';
import RegisterView from '../views/auth/RegisterView.vue';
import VerifyEmailView from '../views/auth/VerifyEmailView.vue';
import TestVerificationView from '../views/auth/TestVerificationView.vue';
import { useAuthStore } from '../stores/auth';

import VerifiedSuccessView from '../views/auth/VerifiedSuccessView.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false },
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { requiresAuth: false },
  },
  {
    path: '/verify-email/:token',
    name: 'VerifyEmail',
    component: VerifyEmailView,
    meta: { requiresAuth: false },
  },
  {
    path: '/test-verification',
    name: 'TestVerification',
    component: TestVerificationView,
    meta: { requiresAuth: false },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: '/verified-success',
    name: 'VerifiedSuccess',
    component: VerifiedSuccessView,
    meta: { requiresAuth: false },
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/login',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && auth.isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;