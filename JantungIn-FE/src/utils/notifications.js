/**
 * Utility functions for handling API retry notifications and UI feedback
 */
import { useI18n } from 'vue-i18n'

// Store the current active notifications
const activeNotifications = new Map()

/**
 * Create a notification manager for API retries and feedback
 */
export function useApiNotifications() {
  const { t } = useI18n()

  /**
   * Show a notification for API retry attempts
   * @param {string} operationId - Unique ID for the operation
   * @param {Object} options - Notification options
   * @param {string} options.message - Message to display
   * @param {number} options.attempt - Current attempt number
   * @param {number} options.maxAttempts - Maximum number of attempts
   * @param {string} options.type - Notification type (info, warning, error)
   * @param {Function} options.onCancel - Callback when user cancels the operation
   */
  const showRetryNotification = (operationId, options) => {
    const { message, attempt, maxAttempts, type = 'info', onCancel } = options

    // Check if we already have an active notification for this operation
    if (activeNotifications.has(operationId)) {
      // Update existing notification instead of creating a new one
      const existingNotification = activeNotifications.get(operationId)
      existingNotification.update({
        message: `${message} (${t('common.attempt')} ${attempt}/${maxAttempts})`,
        progress: (attempt / maxAttempts) * 100,
      })
      return existingNotification
    }

    // Create a new notification
    // This is a placeholder implementation - replace with your actual notification library
    // For example: Toastify, vue-toasted, or a custom notification component
    console.log(`[${type}] ${message} (${t('common.attempt')} ${attempt}/${maxAttempts})`)

    // Simulate a notification object with methods for a real implementation
    const notification = {
      id: operationId,
      update(data) {
        console.log(`Updated notification: ${data.message}`)
        // In a real implementation, update the notification content
      },
      close() {
        console.log(`Closed notification: ${operationId}`)
        activeNotifications.delete(operationId)
        // In a real implementation, remove the notification from UI
      },
    }

    // Store the notification reference
    activeNotifications.set(operationId, notification)

    return notification
  }

  /**
   * Update existing notification or create a new one
   * @param {string} operationId - Operation identifier
   * @param {Object} options - Notification options
   */
  const updateNotification = (operationId, options) => {
    if (activeNotifications.has(operationId)) {
      const notification = activeNotifications.get(operationId)
      notification.update(options)
      return notification
    }

    // If no notification exists, create a new one
    return showRetryNotification(operationId, {
      attempt: 1,
      maxAttempts: 1,
      type: 'info',
      ...options,
    })
  }

  /**
   * Close a notification
   * @param {string} operationId - Operation identifier
   */
  const closeNotification = (operationId) => {
    if (activeNotifications.has(operationId)) {
      const notification = activeNotifications.get(operationId)
      notification.close()
      activeNotifications.delete(operationId)
    }
  }

  /**
   * Show success notification
   * @param {string} operationId - Operation identifier
   * @param {string} message - Success message
   */
  const showSuccess = (operationId, message) => {
    updateNotification(operationId, {
      message,
      type: 'success',
    })

    // Auto-close success messages after 3 seconds
    setTimeout(() => closeNotification(operationId), 3000)
  }

  /**
   * Show error notification
   * @param {string} operationId - Operation identifier
   * @param {string} message - Error message
   * @param {boolean} autoClose - Whether to auto-close the notification
   */
  const showError = (operationId, message, autoClose = true) => {
    updateNotification(operationId, {
      message,
      type: 'error',
    })

    // Auto-close error messages after 5 seconds if requested
    if (autoClose) {
      setTimeout(() => closeNotification(operationId), 5000)
    }
  }

  return {
    showRetryNotification,
    updateNotification,
    closeNotification,
    showSuccess,
    showError,
  }
}

/**
 * Generate a unique operation ID
 * @param {string} prefix - Prefix for the operation ID
 * @returns {string} Unique operation ID
 */
export function generateOperationId(prefix = 'op') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
