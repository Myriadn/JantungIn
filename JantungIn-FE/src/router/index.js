import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/Page/auth/Login-user.vue'
import Register from '@/Page/auth/Register-user.vue'
import LandingPage from '@/Page/LandingPage.vue'
import NewsPage from '@/Page/NewsPage.vue'
import HistoryPage from '@/Page/HistoryPage.vue'

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
  {
    path: '/history',
    name: 'history',
    component: HistoryPage,
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('@/Page/AccountPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
