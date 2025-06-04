# JantungIn Authentication System

## Overview

The JantungIn authentication system has been enhanced to provide a more robust, reliable, and user-friendly experience. The system now includes:

1. Enhanced error handling with consistent error messages
2. Multi-language support for error messages
3. Improved network detection and retry mechanisms
4. Better validation for user inputs
5. UI feedback for network operations

## Key Components

### API Service

- **Robust Error Handling**: Detailed error categorization and consistent formatting
- **Retry Mechanism**: Automatic retry for network failures with exponential backoff
- **Network Detection**: Enhanced network connectivity detection
- **UI Feedback**: Visual feedback during retry operations

### Authentication Service

- **Consistent Error Formatting**: Standardized error handling across all authentication operations
- **Input Validation**: Enhanced validation for NIK, email, and other user inputs
- **Secure Token Management**: Improved handling of authentication tokens
- **Offline Support**: Better handling of authentication when offline

### Internationalization (i18n)

- **Multi-language Support**: Error messages available in both Indonesian and English
- **Consistent Messaging**: Standard error message format across the application
- **Validation Messages**: Localized validation messages for form inputs

## How to Use

### API Calls with Retry and Notifications

```javascript
// Example of using ApiService with notifications
const response = await apiService.post(
  '/api/endpoint',
  { data: 'value' },
  {
    showNotifications: true,
    operationName: 'Operation Name',
  },
)
```

### Error Handling

```javascript
import { useErrorHandler } from '@/utils/errorHandler'

export default {
  setup() {
    const { getErrorMessage } = useErrorHandler()

    const handleOperation = async () => {
      try {
        // Perform operation
      } catch (error) {
        // Get localized error message
        const errorMsg = getErrorMessage(error)
        // Display error to user
      }
    }

    return { handleOperation }
  },
}
```

## Implementation Details

### Retry Mechanism

The system implements an exponential backoff strategy for retries:

1. Initial delay is configured (default: 1000ms)
2. Each subsequent retry increases the delay (multiplier: 1.5)
3. Maximum delay is capped (default: 5000ms)
4. Maximum number of retries is configurable (default: 2)

### Error Categorization

Errors are categorized as:

- **Network Errors**: Connectivity issues, timeouts
- **Authentication Errors**: Invalid credentials, token issues
- **Validation Errors**: Input format problems
- **Server Errors**: Backend issues

## Configuration

Environment variables that can be used to configure the system:

- `VITE_API_TIMEOUT`: API request timeout in milliseconds (default: 15000)
- `VITE_API_MAX_RETRIES`: Maximum number of retry attempts (default: 2)
- `VITE_API_RETRY_DELAY`: Initial retry delay in milliseconds (default: 1000)
- `VITE_API_MAX_RETRY_DELAY`: Maximum retry delay in milliseconds (default: 5000)

## Future Improvements

- [ ] Implement token refresh mechanism
- [ ] Add biometric authentication for mobile
- [ ] Add more comprehensive offline mode support
- [ ] Enhance security with PKCE for OAuth flows
- [ ] Add rate limiting protection for login attempts
