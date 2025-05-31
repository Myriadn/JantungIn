import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { registerSW } from './registerSW'

// Register service worker for PWA
registerSW()

// Entry point for the application
const app = createApp(App)
app.use(router)
app.mount('#app')

/*
  Halaman diatur menggunakan vue-router di src/router/index.js
*/
