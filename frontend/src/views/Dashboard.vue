<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-4">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h1 class="text-xl font-bold text-gray-900">TaskFlow</h1>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span class="text-sm font-medium text-gray-600">
                  {{ authStore.user?.name?.charAt(0).toUpperCase() }}
                </span>
              </div>
              <span class="text-gray-700 font-medium">{{ authStore.user?.name }}</span>
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
      <!-- Header Section -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 class="text-3xl font-bold text-gray-900">My Projects</h2>
            <p class="text-gray-600 mt-1">Manage and track your project progress</p>
          </div>
          <router-link
            to="/projects/create"
            class="btn btn-primary inline-flex items-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            New Project
          </router-link>
        </div>
      </div>

      <!-- Loading State -->
      <Transition name="fade">
        <div v-if="loading" class="flex items-center justify-center py-16">
          <div class="text-center">
            <div class="loading-spinner w-8 h-8 mx-auto mb-4"></div>
            <p class="text-gray-500">Loading your projects...</p>
          </div>
        </div>
      </Transition>

      <!-- Projects Grid -->
      <Transition name="slide-up">
        <div v-if="!loading && projects.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <ProjectCard
            v-for="project in projects"
            :key="project.id"
            :project="project"
          />
        </div>
      </Transition>

      <!-- Empty State -->
      <Transition name="fade">
        <div v-if="!loading && projects.length === 0" class="text-center py-16">
          <div class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>
          <p class="text-gray-600 mb-6 max-w-md mx-auto">
            Get started by creating your first project. Organize your tasks and track progress efficiently.
          </p>
          <router-link
            to="/projects/create"
            class="btn btn-primary inline-flex items-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Create your first project
          </router-link>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import ProjectCard from '../components/ProjectCard.vue'
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()

const projects = ref([])
const loading = ref(true)

const fetchProjects = async () => {
  try {
    const response = await axios.get('/api/projects')
    projects.value = response.data.data
  } catch (error) {
    console.error('Error fetching projects:', error)
  } finally {
    loading.value = false
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

onMounted(() => {
  fetchProjects()
})
</script>