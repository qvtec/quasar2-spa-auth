import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', name: 'top', component: () => import('pages/TopPage.vue') }],
  },
  { // Auth Routes
    path: '/auth',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requireAuth: false },
    children: [
      { path: 'login', name: 'login', component: () => import('pages/auth/Login.vue') },
      { path: 'twofactor', name: 'twofactor', component: () => import('pages/auth/TwoFactorChallenge.vue') }
    ]
  },
  { // Password Routes
    path: '/password',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requireAuth: false },
    children: [
      { path: 'remind', name: 'password.remind', component: () => import('pages/auth/PasswordRemind.vue') },
      { path: 'reset', name: 'password.reset', component: () => import('pages/auth/PasswordReset.vue') }
    ]
  },
  { // User Routes
    path: '/user',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requireAuth: true },
    children: [
      { path: 'home', name: 'home', component: () => import('pages/user/Home.vue') },
      { path: 'profile', name: 'profile', component: () => import('pages/user/Profile.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
