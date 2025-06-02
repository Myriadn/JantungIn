import { readonly } from 'vue'
import apiService from '@/services/ApiService'
import authService from '@/services/AuthService'
import newsService from '@/services/NewsService'
import historyService from '@/services/HistoryService'
import diagnosisService from '@/services/DiagnosisService'

/**
 * Set up dependency injection for services across the application
 * This allows components to access services without direct imports
 */
export function setupServiceProvider(app) {
  // Initialize API service
  apiService.initializeFromStorage()

  // Provide all services
  app.provide('apiService', readonly(apiService))
  app.provide('authService', readonly(authService))
  app.provide('newsService', readonly(newsService))
  app.provide('historyService', readonly(historyService))
  app.provide('diagnosisService', readonly(diagnosisService))

  // You can add more services here as your application grows
}
