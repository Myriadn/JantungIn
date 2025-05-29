<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const nik = ref('')
const password = ref('')

const navigateToRegister = () => {
  router.push('/register')
}

const handleLogin = () => {
  // TODO: Implement login functionality
  console.log('Login attempt with:', { nik: nik.value, password: password.value })
  // Navigate to home after login
  router.push('/news')
}

const handleResetPassword = () => {
  // TODO: Implement password reset functionality
  console.log('Password reset requested')
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">Login as Patient</h1>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="nik">NIK</label>
          <input id="nik" v-model="nik" type="text" class="form-control" required />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" v-model="password" type="password" class="form-control" required />
        </div>

        <button type="submit" class="btn-primary">Login</button>

        <div class="links">
          <p class="text-center">
            Don't have an account?
            <a href="#" @click.prevent="navigateToRegister" class="text-link">Register</a>
          </p>
          <p class="text-center">
            Can't remember your password?
            <a href="#" @click.prevent="handleResetPassword" class="text-link">Reset Password</a>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(to bottom, #3b82f6, #4f46e5);
  padding: 2rem;
}

.login-card {
  background-color: white;
  border-radius: 0.5rem;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.login-title {
  font-size: 1.5rem;
  color: #3b82f6;
  text-align: center;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  margin-bottom: 0.375rem;
}

.form-control {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  font-size: 1rem;
}

.form-control:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.btn-primary {
  width: 100%;
  padding: 0.625rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
  font-weight: 500;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.links {
  font-size: 0.875rem;
  margin-top: 1rem;
  color: #6b7280;
}

.text-link {
  color: #3b82f6;
  text-decoration: none;
}

.text-link:hover {
  text-decoration: underline;
}

.text-center {
  text-align: center;
  margin-bottom: 0.5rem;
}
</style>
