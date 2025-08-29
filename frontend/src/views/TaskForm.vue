<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-4">
            <button @click="goBack" class="text-indigo-600 hover:text-indigo-500">
              ← Back
            </button>
            <h1 class="text-xl font-semibold">
              {{ isEditing ? 'Edit Task' : 'Create Task' }}
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
              <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                Task Title
              </label>
              <input
                id="title"
                v-model="form.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter task title"
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
                placeholder="Enter task description"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  v-model="form.status"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div>
                <label for="priority" class="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  id="priority"
                  v-model="form.priority"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div class="mb-6">
              <label for="due_date" class="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                id="due_date"
                v-model="form.due_date"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div v-if="error" class="mb-4 text-red-600 text-sm">
              {{ error }}
            </div>

            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="goBack"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium disabled:opacity-50"
              >
                {{ loading ? 'Saving...' : (isEditing ? 'Update Task' : 'Create Task') }}
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
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  due_date: ''
})

const loading = ref(false)
const error = ref('')

const isEditing = computed(() => !!route.params.id)
const projectId = computed(() => route.query.project || (task.value?.project_id))

const task = ref(null)

const fetchTask = async () => {
  if (!isEditing.value) return
  
  try {
    const response = await axios.get(`/api/tasks/${route.params.id}`)
    task.value = response.data.data
    form.value = {
      title: task.value.title,
      description: task.value.description || '',
      status: task.value.status,
      priority: task.value.priority,
      due_date: task.value.due_date || ''
    }
  } catch (err) {
    error.value = 'Failed to load task'
  }
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  
  try {
    if (isEditing.value) {
      await axios.put(`/api/tasks/${route.params.id}`, form.value)
      goBack()
    } else {
      await axios.post(`/api/projects/${projectId.value}/tasks`, form.value)
      router.push(`/projects/${projectId.value}`)
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to save task'
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  if (isEditing.value && task.value) {
    router.push(`/projects/${task.value.project.id}`)
  } else if (projectId.value) {
    router.push(`/projects/${projectId.value}`)
  } else {
    router.push('/')
  }
}

onMounted(() => {
  fetchTask()
})
</script>