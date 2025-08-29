<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-4">
            <router-link to="/" class="btn btn-secondary text-sm inline-flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Dashboard
            </router-link>
            <div class="h-6 w-px bg-gray-300"></div>
            <h1 class="text-xl font-bold text-gray-900">
              {{ isEditing ? 'Edit Project' : 'Create Project' }}
            </h1>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="card p-8">
        <!-- Header -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            {{ isEditing ? 'Edit Project Details' : 'Create New Project' }}
          </h2>
          <p class="text-gray-600">
            {{ isEditing ? 'Update your project information below.' : 'Fill in the details to create your new project.' }}
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="name" class="form-label">
              Project Name *
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="form-input"
              placeholder="Enter a descriptive project name"
              :class="{ 'border-red-300 focus:ring-red-500': error }"
            />
          </div>

          <div>
            <label for="description" class="form-label">
              Description
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="4"
              class="form-input resize-none"
              placeholder="Describe what this project is about, its goals, and any important details..."
              :class="{ 'border-red-300 focus:ring-red-500': error }"
            ></textarea>
          </div>

          <div>
            <label for="status" class="form-label">
              Status
            </label>
            <select
              id="status"
              v-model="form.status"
              class="form-input"
              :class="{ 'border-red-300 focus:ring-red-500': error }"
            >
              <option value="active">Active - Currently working on this project</option>
              <option value="completed">Completed - Project is finished</option>
              <option value="on_hold">On Hold - Project is paused</option>
            </select>
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

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
            <router-link
              to="/"
              class="btn btn-secondary inline-flex items-center justify-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Cancel
            </router-link>
            <button
              type="submit"
              :disabled="loading"
              class="btn btn-primary inline-flex items-center justify-center"
            >
              <div v-if="loading" class="loading-spinner mr-2"></div>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              {{ loading ? 'Saving...' : (isEditing ? 'Update Project' : 'Create Project') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const form = ref({
  name: '',
  description: '',
  status: 'active'
})

const loading = ref(false)
const error = ref('')

const isEditing = computed(() => !!route.params.id)

const fetchProject = async () => {
  if (!isEditing.value) return
  
  try {
    const response = await axios.get(`/api/projects/${route.params.id}`)
    const project = response.data.data
    form.value = {
      name: project.name,
      description: project.description || '',
      status: project.status
    }
  } catch (err) {
    error.value = 'Failed to load project'
  }
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  
  try {
    if (isEditing.value) {
      await axios.put(`/api/projects/${route.params.id}`, form.value)
    } else {
      await axios.post('/api/projects', form.value)
    }
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to save project'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProject()
})
</script>