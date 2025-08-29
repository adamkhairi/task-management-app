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
            <h1 class="text-xl font-semibold">{{ project?.name }}</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-gray-700">{{ authStore.user?.name }}</span>
            <button
              @click="handleLogout"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Project Info -->
        <div v-if="project" class="bg-white rounded-lg shadow p-6 mb-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">{{ project.name }}</h2>
              <p class="text-gray-600 mt-2">{{ project.description }}</p>
            </div>
            <div class="flex items-center space-x-2">
              <span :class="statusClass" class="px-3 py-1 rounded text-sm">
                {{ project.status }}
              </span>
              <router-link
                :to="`/projects/${project.id}/edit`"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Edit Project
              </router-link>
            </div>
          </div>
        </div>

        <!-- Tasks Section -->
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-gray-900">Tasks</h3>
          <router-link
            :to="`/tasks/create?project=${$route.params.id}`"
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            New Task
          </router-link>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <div class="text-gray-500">Loading tasks...</div>
        </div>

        <!-- Tasks Grid -->
        <div v-else-if="tasks.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TaskCard
            v-for="task in tasks"
            :key="task.id"
            :task="task"
            @edit="editTask"
            @delete="deleteTask"
            @toggle-status="toggleTaskStatus"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <div class="text-gray-500 mb-4">No tasks yet</div>
          <router-link
            :to="`/tasks/create?project=${$route.params.id}`"
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Create your first task
          </router-link>
        </div>
      </div>
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
    active: 'bg-green-100 text-green-700',
    completed: 'bg-gray-100 text-gray-700',
    on_hold: 'bg-yellow-100 text-yellow-700'
  }
  return classes[project.value.status] || ''
})

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