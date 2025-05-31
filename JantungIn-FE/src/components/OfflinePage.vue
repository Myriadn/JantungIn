<template>
  <div class="offline-container">
    <div class="offline-card">
      <h1 class="offline-title">You are offline</h1>
      <p class="offline-message">
        It seems you're not connected to the internet. Some features may be unavailable.
      </p>
      <div class="offline-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-16 h-16">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636a9 9 0 010 12.728m-3.536-3.536a5 5 0 010-7.072M13 10.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        </svg>
      </div>
      <p class="offline-subtext">
        JantungIn will automatically reconnect when your connection is restored.
      </p>
    </div>
  </div>
</template>

<style scoped>
.offline-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(to bottom, #3b82f6, #4f46e5);
  padding: 2rem;
}

.offline-card {
  background-color: white;
  border-radius: 0.5rem;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.offline-title {
  font-size: 1.5rem;
  color: #3b82f6;
  margin-bottom: 1rem;
}

.offline-message {
  margin-bottom: 1.5rem;
  color: #4b5563;
}

.offline-icon {
  color: #3b82f6;
  margin: 1.5rem 0;
  display: flex;
  justify-content: center;
}

.offline-subtext {
  font-size: 0.875rem;
  color: #6b7280;
}
</style>
