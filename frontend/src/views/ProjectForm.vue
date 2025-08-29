<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-4">
            <router-link to="/" class="text-indigo-600 hover:text-indigo-500">
              ← Back to Dashboard
            </router-link>
            <h1 class="text-xl font-semibold">
              {{ isEditing ? 'Edit Project' : 'Create Project' }}
            </h1>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white rounded-lg shadow p-6">
          <form @submit.prevent="handleSubmit">
            <div class="mb-4">
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                Project Name
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter project name"
              />
            </div>

            <div class="mb-4">
              <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                v-model="form.description"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter project description"
              ></textarea>
            </div>

            <div class="mb-6">
              <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                v-model="form.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>

            <div v-if="error" class="mb-4 text-red-600 text-sm">
              {{ error }}
            </div>

            <div class="flex justify-end space-x-3">
              <router-link
                to="/"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </router-link>
              <button
                type="submit"
                :disabled="loading"
                class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium disabled:opacity-50"
              >
                {{ loading ? 'Saving...' : (isEditing ? 'Update Project' : 'Create Project') }}
              </button>
            </div>
          </form>
        </div>
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