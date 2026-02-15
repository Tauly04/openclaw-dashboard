import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/features',
    name: 'FeatureShowcase',
    component: () => import('../views/FeatureShowcase.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings/features',
    name: 'FeatureTreeManager',
    component: () => import('../views/FeatureTreeManager.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  // Dynamically import auth store to avoid initialization order issue
  import('../stores/auth').then(({ useAuthStore }) => {
    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next('/login')
    } else if (to.path === '/login' && authStore.isAuthenticated) {
      next('/')
    } else {
      next()
    }
  })
})

export default router
