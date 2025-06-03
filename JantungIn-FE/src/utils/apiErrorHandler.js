/**
 * Utility functions for handling API errors
 */

/**
 * Get appropriate error message based on error type
 * @param {Error} error - The error object
 * @returns {Object} Error details with title and message
 */
export function getErrorDetails(error) {
  // Network or offline errors
  if (!navigator.onLine || error.isNetworkError) {
    return {
      title: 'Network Error',
      message: 'Please check your internet connection and try again.',
      isNetworkError: true,
    }
  }

  // Timeout errors
  if (error.isTimeoutError) {
    return {
      title: 'Request Timeout',
      message: 'The server took too long to respond. Please try again later.',
      isTimeoutError: true,
    }
  }

  // Authentication errors
  if (error.message.includes('Unauthorized') || error.message.includes('401')) {
    return {
      title: 'Authentication Error',
      message: 'Your session has expired. Please log in again.',
      isAuthError: true,
    }
  }

  // Permission errors
  if (error.message.includes('forbidden') || error.message.includes('403')) {
    return {
      title: 'Access Denied',
      message: 'You do not have permission to access this resource.',
      isPermissionError: true,
    }
  }

  // Not found errors
  if (error.message.includes('not found') || error.message.includes('404')) {
    return {
      title: 'Resource Not Found',
      message: 'The requested information could not be found.',
      isNotFoundError: true,
    }
  }

  // Server errors
  if (error.message.includes('server error') || error.message.includes('500')) {
    return {
      title: 'Server Error',
      message: 'Something went wrong on our servers. Please try again later.',
      isServerError: true,
    }
  }

  // Default error
  return {
    title: 'Error',
    message: error.message || 'An unexpected error occurred. Please try again.',
    isUnknownError: true,
  }
}

/**
 * Handle common API errors
 * @param {Error} error - The error object
 * @param {Function} setError - Function to set error state
 * @param {Function} setLoading - Function to set loading state
 * @param {Function} router - Vue Router instance for redirects
 */
export function handleApiError(error, { setError, setLoading, router = null }) {
  const errorDetails = getErrorDetails(error)

  // Set error state
  if (setError) {
    setError(errorDetails)
  }

  // Turn off loading state
  if (setLoading) {
    setLoading(false)
  }

  // Redirect for auth errors
  if (errorDetails.isAuthError && router) {
    localStorage.removeItem('jantungin_user')
    router.push('/login?expired=true')
  }

  console.error('API Error:', error)
  return errorDetails
}

/**
 * Offline first strategy helper
 * @param {Function} onlineFunc - Function to execute when online
 * @param {Function} offlineFunc - Function to execute when offline
 * @returns {Promise} Result of the appropriate function
 */
export async function offlineFirst(onlineFunc, offlineFunc) {
  try {
    if (navigator.onLine) {
      return await onlineFunc()
    } else {
      return await offlineFunc()
    }
  } catch (error) {
    console.error('Error in offlineFirst strategy:', error)
    // If online function fails, try offline function as fallback
    if (error.isNetworkError && offlineFunc) {
      return await offlineFunc()
    }
    throw error
  }
}
