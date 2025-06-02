import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { registerSW } from './registerSW'
import { setupServiceProvider } from './services/serviceProvider'

// Register service worker for PWA
registerSW()

// Entry point for the application
const app = createApp(App)

// Setup MVVM architecture with services
setupServiceProvider(app)

// Use router
app.use(router)

// Mount app
app.mount('#app')

/*
  Halaman diatur menggunakan vue-router di src/router/index.js
*/
