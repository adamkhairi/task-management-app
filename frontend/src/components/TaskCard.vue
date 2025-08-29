<template>
  <div class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
    <div class="flex justify-between items-start mb-2">
      <h3 class="text-lg font-semibold">{{ task.title }}</h3>
      <span :class="priorityClass" class="px-2 py-1 rounded text-xs">
        {{ task.priority }}
      </span>
    </div>
    
    <p class="text-gray-600 mb-3">{{ task.description }}</p>
    
    <div class="flex items-center justify-between mb-3">
      <span :class="statusClass" class="px-2 py-1 rounded text-sm">
        {{ task.status }}
      </span>
      <span v-if="task.assignedUser" class="text-sm text-gray-500">
        Assigned to: {{ task.assignedUser.name }}
      </span>
    </div>
    
    <div class="flex gap-2">
      <button @click="$emit('edit', task)" 
              class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
        Edit
      </button>
      <button @click="$emit('delete', task.id)" 
              class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
        Delete
      </button>
      <button @click="$emit('toggle-status', task)" 
              class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
        Change Status
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
    low: 'bg-gray-200 text-gray-700',
    medium: 'bg-yellow-200 text-yellow-700',
    high: 'bg-red-200 text-red-700'
  }
  return classes[props.task.priority] || ''
})

const statusClass = computed(() => {
  const classes = {
    todo: 'bg-gray-100 text-gray-700',
    in_progress: 'bg-blue-100 text-blue-700',
    done: 'bg-green-100 text-green-700'
  }
  return classes[props.task.status] || ''
})
</script>