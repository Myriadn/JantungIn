# JantungIn Frontend - MVVM Architecture

This project follows the MVVM (Model-View-ViewModel) architectural pattern to create a maintainable and testable codebase.

## Architecture Overview

### Model Layer

- Located in `/src/models`
- Represents data structures and business logic
- Pure JavaScript classes with minimal dependencies
- Examples: `UserModel`, `NewsModel`, `DiagnosisModel`

### View Layer

- Located in `/src/Page` and `/src/components`
- Vue components focused on presentation
- Minimal logic, mostly template and styling
- Consumes ViewModels for data and actions

### ViewModel Layer

- Located in `/src/viewmodels`
- Connects Models and Views
- Handles UI state, data transformation, and business logic
- Uses Vue's Composition API with reactive state

### Service Layer

- Located in `/src/services`
- Handles API communication and external interactions
- Singleton pattern for global access
- Examples: `ApiService`, `AuthService`, `NewsService`

## Key MVVM Concepts in this Project

### 1. Separation of Concerns

- **Model**: Data structure and validation
- **View**: UI presentation and user interaction
- **ViewModel**: State management and business logic

### 2. Data Binding

- Vue's reactivity system connects ViewModels to Views
- Composition API provides clean, organized state management

### 3. Dependency Injection

- Services are provided globally using Vue's provide/inject
- Makes components testable and decoupled

### 4. Offline Support

- Services handle online/offline state
- Data caching for offline use

## Directory Structure

```
src/
├── models/           # Data models
│   ├── UserModel.js
│   ├── NewsModel.js
│   └── DiagnosisModel.js
├── viewmodels/       # ViewModels (using Composition API)
│   ├── LoginViewModel.js
│   ├── NewsViewModel.js
│   └── DiagnosisViewModel.js
├── services/         # Services for external communication
│   ├── ApiService.js
│   ├── AuthService.js
│   ├── NewsService.js
│   └── serviceProvider.js
├── Page/             # View components (pages)
│   ├── User/
│   └── Admin/
└── components/       # View components (reusable)
```

## Usage Example

```javascript
// Example of a Vue component using MVVM
<script setup>
// Import ViewModel
import { useNewsViewModel } from '@/viewmodels/NewsViewModel';

// Use ViewModel to get data and methods
const {
  newsItems,
  isLoading,
  error,
  refreshNews,
  loadMoreNews
} = useNewsViewModel();
</script>

<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <article v-for="news in newsItems" :key="news.id">
        <h2>{{ news.title }}</h2>
        <p>{{ news.getContentPreview() }}</p>
      </article>
      <button @click="loadMoreNews">Load More</button>
      <button @click="refreshNews">Refresh</button>
    </div>
  </div>
</template>
```

## Benefits of MVVM in this Project

1. **Testability**: ViewModels can be tested independently of the UI
2. **Maintainability**: Clear separation of concerns makes code easier to maintain
3. **Reusability**: ViewModels can be reused across different views
4. **Scalability**: Architecture supports growing the application with minimal refactoring
