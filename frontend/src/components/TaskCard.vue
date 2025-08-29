<template>
  <div class="card p-5 group hover:scale-[1.01] transition-all duration-200">
    <!-- Header -->
    <div class="flex justify-between items-start mb-3">
      <div class="flex-1 min-w-0">
        <h4 class="text-lg font-semibold text-gray-900 truncate">{{ task.title }}</h4>
      </div>
      <span :class="priorityClass" class="priority-badge ml-3 flex-shrink-0">
        {{ formatPriority(task.priority) }}
      </span>
    </div>
    
    <!-- Description -->
    <p class="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
      {{ task.description || 'No description provided' }}
    </p>
    
    <!-- Status and Due Date -->
    <div class="flex items-center justify-between mb-4">
      <span :class="statusClass" class="status-badge">
        <span class="w-2 h-2 rounded-full mr-2" :class="statusDotClass"></span>
        {{ formatStatus(task.status) }}
      </span>
      <div v-if="task.due_date" class="flex items-center text-sm text-gray-500">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        {{ formatDate(task.due_date) }}
      </div>
    </div>
    
    <!-- Assignee -->
    <div v-if="task.assignedUser" class="flex items-center mb-4 text-sm text-gray-600">
      <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
        <span class="text-xs font-medium text-blue-600">
          {{ task.assignedUser.name.charAt(0).toUpperCase() }}
        </span>
      </div>
      <span>{{ task.assignedUser.name }}</span>
    </div>
    
    <!-- Actions -->
    <div class="flex items-center justify-between pt-4 border-t border-gray-100">
      <div class="flex space-x-2">
        <button 
          @click="$emit('edit', task)" 
          class="btn btn-secondary text-xs px-3 py-1.5"
          title="Edit task"
        >
          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          Edit
        </button>
        <button 
          @click="$emit('toggle-status', task)" 
          class="btn btn-success text-xs px-3 py-1.5"
          :title="getStatusActionTitle(task.status)"
        >
          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {{ getStatusActionText(task.status) }}
        </button>
      </div>
      
      <button 
        @click="$emit('delete', task.id)" 
        class="text-gray-400 hover:text-red-500 transition-colors p-1"
        title="Delete task"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete', 'toggle-status'])

const priorityClass = computed(() => {
  const classes = {
    low: 'bg-gray-50 text-gray-600 border border-gray-200',
    medium: 'bg-yellow-50 text-yellow-600 border border-yellow-200',
    high: 'bg-red-50 text-red-600 border border-red-200'
  }
  return classes[props.task.priority] || 'bg-gray-50 text-gray-600 border border-gray-200'
})

const statusClass = computed(() => {
  const classes = {
    todo: 'bg-gray-50 text-gray-700 border border-gray-200',
    in_progress: 'bg-blue-50 text-blue-700 border border-blue-200',
    done: 'bg-green-50 text-green-700 border border-green-200'
  }
  return classes[props.task.status] || 'bg-gray-50 text-gray-700 border border-gray-200'
})

const statusDotClass = computed(() => {
  const classes = {
    todo: 'bg-gray-500',
    in_progress: 'bg-blue-500',
    done: 'bg-green-500'
  }
  return classes[props.task.status] || 'bg-gray-500'
})

const formatPriority = (priority) => {
  const priorityMap = {
    low: 'Low',
    medium: 'Medium',
    high: 'High'
  }
  return priorityMap[priority] || priority
}

const formatStatus = (status) => {
  const statusMap = {
    todo: 'To Do',
    in_progress: 'In Progress',
    done: 'Done'
  }
  return statusMap[status] || status
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

const getStatusActionText = (status) => {
  const actionMap = {
    todo: 'Start',
    in_progress: 'Complete',
    done: 'Reopen'
  }
  return actionMap[status] || 'Update'
}

const getStatusActionTitle = (status) => {
  const titleMap = {
    todo: 'Mark as in progress',
    in_progress: 'Mark as done',
    done: 'Mark as to do'
  }
  return titleMap[status] || 'Change status'
}
</script>