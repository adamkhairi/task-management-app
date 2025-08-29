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
            <h1 class="text-xl font-bold text-gray-900 truncate">{{ project?.name }}</h1>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span class="text-sm font-medium text-gray-600">
                  {{ authStore.user?.name?.charAt(0).toUpperCase() }}
                </span>
              </div>
              <span class="text-gray-700 font-medium hidden sm:block">{{ authStore.user?.name }}</span>
            </div>
            <button
              @click="handleLogout"
              class="btn btn-secondary text-sm"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Project Info -->
      <Transition name="slide-up">
        <div v-if="project" class="card p-8 mb-8">
          <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div class="flex-1 min-w-0">
              <h2 class="text-3xl font-bold text-gray-900 mb-3">{{ project.name }}</h2>
              <p class="text-gray-600 text-lg leading-relaxed">
                {{ project.description || 'No description provided' }}
              </p>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span :class="statusClass" class="status-badge">
                <span class="w-2 h-2 rounded-full mr-2" :class="statusDotClass"></span>
                {{ formatStatus(project.status) }}
              </span>
              <router-link
                :to="`/projects/${project.id}/edit`"
                class="btn btn-primary inline-flex items-center"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Edit Project
              </router-link>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Tasks Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h3 class="text-2xl font-bold text-gray-900">Tasks</h3>
          <p class="text-gray-600 mt-1">Manage and track task progress</p>
        </div>
        <router-link
          :to="`/tasks/create?project=${$route.params.id}`"
          class="btn btn-primary inline-flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          New Task
        </router-link>
      </div>

      <!-- Loading State -->
      <Transition name="fade">
        <div v-if="loading" class="flex items-center justify-center py-16">
          <div class="text-center">
            <div class="loading-spinner w-8 h-8 mx-auto mb-4"></div>
            <p class="text-gray-500">Loading tasks...</p>
          </div>
        </div>
      </Transition>

      <!-- Tasks Grid -->
      <Transition name="slide-up">
        <div v-if="!loading && tasks.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <TaskCard
            v-for="task in tasks"
            :key="task.id"
            :task="task"
            @edit="editTask"
            @delete="deleteTask"
            @toggle-status="toggleTaskStatus"
          />
        </div>
      </Transition>

      <!-- Empty State -->
      <Transition name="fade">
        <div v-if="!loading && tasks.length === 0" class="text-center py-16">
          <div class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No tasks yet</h3>
          <p class="text-gray-600 mb-6 max-w-md mx-auto">
            Start organizing your work by creating your first task for this project.
          </p>
          <router-link
            :to="`/tasks/create?project=${$route.params.id}`"
            class="btn btn-primary inline-flex items-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Create your first task
          </router-link>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import TaskCard from '../components/TaskCard.vue'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const project = ref(null)
const tasks = ref([])
const loading = ref(true)

const statusClass = computed(() => {
  if (!project.value) return ''
  const classes = {
    active: 'bg-green-50 text-green-700 border border-green-200',
    completed: 'bg-gray-50 text-gray-700 border border-gray-200',
    on_hold: 'bg-yellow-50 text-yellow-700 border border-yellow-200'
  }
  return classes[project.value.status] || 'bg-gray-50 text-gray-700 border border-gray-200'
})

const statusDotClass = computed(() => {
  if (!project.value) return ''
  const classes = {
    active: 'bg-green-500',
    completed: 'bg-gray-500',
    on_hold: 'bg-yellow-500'
  }
  return classes[project.value.status] || 'bg-gray-500'
})

const formatStatus = (status) => {
  const statusMap = {
    active: 'Active',
    completed: 'Completed',
    on_hold: 'On Hold'
  }
  return statusMap[status] || status
}

const fetchProject = async () => {
  try {
    const response = await axios.get(`/api/projects/${route.params.id}`)
    project.value = response.data.data
  } catch (error) {
    console.error('Error fetching project:', error)
  }
}

const fetchTasks = async () => {
  try {
    const response = await axios.get(`/api/projects/${route.params.id}/tasks`)
    tasks.value = response.data.data
  } catch (error) {
    console.error('Error fetching tasks:', error)
  } finally {
    loading.value = false
  }
}

const editTask = (task) => {
  router.push(`/tasks/${task.id}/edit`)
}

const deleteTask = async (taskId) => {
  if (confirm('Are you sure you want to delete this task?')) {
    try {
      await axios.delete(`/api/tasks/${taskId}`)
      tasks.value = tasks.value.filter(task => task.id !== taskId)
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }
}

const toggleTaskStatus = async (task) => {
  const statusMap = {
    todo: 'in_progress',
    in_progress: 'done',
    done: 'todo'
  }
  
  try {
    const response = await axios.put(`/api/tasks/${task.id}`, {
      ...task,
      status: statusMap[task.status]
    })
    
    const index = tasks.value.findIndex(t => t.id === task.id)
    if (index !== -1) {
      tasks.value[index] = response.data.data
    }
  } catch (error) {
    console.error('Error updating task status:', error)
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

onMounted(async () => {
  await fetchProject()
  await fetchTasks()
})
</script>