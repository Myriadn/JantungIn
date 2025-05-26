import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/components/auth/Login.vue'
import Register from '@/components/auth/Register.vue'
import LandingPage from '@/Page/LandingPage.vue'
import NewsPage from '@/Page/NewsPage.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/home',
    name: 'home',
    component: LandingPage
  },
  {
    path: '/news',
    name: 'news',
    component: NewsPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
