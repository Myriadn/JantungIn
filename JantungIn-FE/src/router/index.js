import { createRouter, createWebHistory } from 'vue-router'

import DoctorLogin from '@/Page/Admin/auth/Login-doctor.vue'
import HomeAdminPage from '@/Page/Admin/HomeAdminPage.vue'
import DiagnoseAdminPage from '@/Page/Admin/DiagnoseAdminPage.vue'
import NewsAdminPage from '@/Page/Admin/NewsAdminPage.vue'
import HistoryAdminPage from '@/Page/Admin/HistoryAdminPage.vue'
import ResultAdminPage from '@/Page/Admin/ResultAdminPage.vue'
import AccountPageAdmin from '@/Page/Admin/AccountAdminPage.vue'

import Login from '@/Page/User/auth/Login-user.vue'
import Register from '@/Page/User/auth/Register-user.vue'
import NewsPage from '@/Page/User/NewsPage.vue'
import HistoryPage from '@/Page/User/HistoryPage.vue'

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
    component: HomeAdminPage,
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
    component: () => import('@/Page/User/AccountPage.vue'),
  },
  {
    path: '/admin',
    name: 'admin',
    component: DoctorLogin,
  },
  {
    path: '/home-admin',
    name: 'homeAdmin',
    component: HomeAdminPage,
  },
  {
    path: '/diagnose-admin',
    name: 'diagnoseAdmin',
    component: DiagnoseAdminPage,
  },
  {
    path: '/news-admin',
    name: 'newsAdmin',
    component: NewsAdminPage,
  },
  {
    path: '/history-admin',
    name: 'historyAdmin',
    component: HistoryAdminPage,
  },
  {
    path: '/result-admin',
    name: 'resultAdmin',
    component: ResultAdminPage,
  },
  {
    path: '/account-admin',
    name: 'accountAdmin',
    component: AccountPageAdmin,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Return to saved position if available (when using browser back/forward buttons)
    if (savedPosition) {
      return savedPosition
    }
    // Scroll to top for all other navigation
    return { top: 0 }
  },
})

export default router
