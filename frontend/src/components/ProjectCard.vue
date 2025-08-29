<template>
  <div class="card p-6 cursor-pointer group hover:scale-[1.02] transition-all duration-200"
       @click="$router.push(`/projects/${project.id}`)">
    <!-- Header -->
    <div class="flex justify-between items-start mb-4">
      <div class="flex-1 min-w-0">
        <h3 class="text-xl font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
          {{ project.name }}
        </h3>
      </div>
      <span :class="statusClass" class="status-badge ml-3 flex-shrink-0">
        <span class="w-2 h-2 rounded-full mr-2" :class="statusDotClass"></span>
        {{ formatStatus(project.status) }}
      </span>
    </div>
    
    <!-- Description -->
    <p class="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
      {{ project.description || 'No description provided' }}
    </p>
    
    <!-- Stats -->
    <div class="flex items-center justify-between pt-4 border-t border-gray-100">
      <div class="flex items-center space-x-4">
        <div class="flex items-center text-sm text-gray-500">
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <span class="font-medium">{{ project.tasks_count || 0 }}</span>
          <span class="ml-1">{{ (project.tasks_count || 0) === 1 ? 'task' : 'tasks' }}</span>
        </div>
      </div>
      
      <div class="flex items-center text-xs text-gray-400">
        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        {{ formatDate(project.created_at) }}
      </div>
    </div>

    <!-- Hover indicator -->
    <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
})

const statusClass = computed(() => {
  const classes = {
    active: 'bg-green-50 text-green-700 border border-green-200',
    completed: 'bg-gray-50 text-gray-700 border border-gray-200',
    on_hold: 'bg-yellow-50 text-yellow-700 border border-yellow-200'
  }
  return classes[props.project.status] || 'bg-gray-50 text-gray-700 border border-gray-200'
})

const statusDotClass = computed(() => {
  const classes = {
    active: 'bg-green-500',
    completed: 'bg-gray-500',
    on_hold: 'bg-yellow-500'
  }
  return classes[props.project.status] || 'bg-gray-500'
})

const formatStatus = (status) => {
  const statusMap = {
    active: 'Active',
    completed: 'Completed',
    on_hold: 'On Hold'
  }
  return statusMap[status] || status
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>