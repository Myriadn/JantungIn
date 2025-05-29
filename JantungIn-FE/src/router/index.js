import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/Page/auth/Login-user.vue'
import Register from '@/Page/auth/Register-user.vue'
import LandingPage from '@/Page/LandingPage.vue'
import NewsPage from '@/Page/NewsPage.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },
  {
    path: '/home',
    name: 'home',
    component: LandingPage,
  },
  {
    path: '/news',
    name: 'news',
    component: NewsPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
