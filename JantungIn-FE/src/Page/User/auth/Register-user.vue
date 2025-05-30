<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const nik = ref('');
const username = ref('');
const password = ref('');

const navigateToLogin = () => {
  router.push('/');
};

const handleRegister = () => {
  // TODO: Implement registration functionality
  console.log('Registration attempt with:', { 
    nik: nik.value, 
    username: username.value, 
    password: password.value 
  });
  
  // After successful registration, navigate to login
  router.push('/');
};
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <h1 class="register-title">Create an Account</h1>
      
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="nik">NIK</label>
          <input 
            id="nik"
            v-model="nik"
            type="text" 
            class="form-control" 
            required
          />
        </div>
        
        <div class="form-group">
          <label for="username">Username</label>
          <input 
            id="username"
            v-model="username"
            type="text" 
            class="form-control" 
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            id="password"
            v-model="password"
            type="password" 
            class="form-control" 
            required
          />
        </div>
        
        <button type="submit" class="btn-primary">Register</button>
        
        <div class="links">
          <p class="text-center">
            Already have an account? 
            <a href="#" @click.prevent="navigateToLogin" class="text-link">Log in</a>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(to bottom, #3b82f6, #4f46e5);
  padding: 2rem;
}

.register-card {
  background-color: white;
  border-radius: 0.5rem;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.register-title {
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
  margin-bottom: 0.75rem;
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
