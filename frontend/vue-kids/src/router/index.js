import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeIndex.vue'),
    },
    {
      path: '/about',
      component: () => import('../views/NavBar.vue'),
    },
    {
      path: '/parkintro/:id',
      component: () => import('../views/DetailView.vue'),
    },
    {
      path: '/login',
      component: () => import('../views/LoginView.vue'),
    },
  ],
  scrollBehavior() {
    // 每次切換頁面都滾到最上面
    return { top: 0 }
  },
})

export default router
