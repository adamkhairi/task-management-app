<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4">
    <div class="max-w-md w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
        <p class="text-gray-600">Sign in to your account to continue</p>
      </div>

      <!-- Form Card -->
      <div class="card p-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="form-label">Email address</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="form-input"
              placeholder="Enter your email"
              :class="{ 'border-red-300 focus:ring-red-500': error }"
            />
          </div>

          <div>
            <label for="password" class="form-label">Password</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="form-input"
              placeholder="Enter your password"
              :class="{ 'border-red-300 focus:ring-red-500': error }"
            />
          </div>

          <!-- Error Message -->
          <Transition name="fade">
            <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-red-700 text-sm">{{ error }}</span>
              </div>
            </div>
          </Transition>

          <button
            type="submit"
            :disabled="loading"
            class="btn btn-primary w-full py-3 text-base font-semibold"
          >
            <div v-if="loading" class="loading-spinner mr-2"></div>
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>

        <!-- Divider -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <p class="text-center text-gray-600">
            Don't have an account?
            <router-link to="/register" class="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              Sign up
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    await authStore.login(form.value)
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>