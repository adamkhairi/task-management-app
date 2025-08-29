<template>
  <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
       @click="$router.push(`/projects/${project.id}`)">
    <div class="flex justify-between items-start mb-4">
      <h2 class="text-xl font-bold">{{ project.name }}</h2>
      <span :class="statusClass" class="px-3 py-1 rounded text-sm">
        {{ project.status }}
      </span>
    </div>
    
    <p class="text-gray-600 mb-4">{{ project.description }}</p>
    
    <div class="flex items-center justify-between">
      <span class="text-sm text-gray-500">
        <span class="font-semibold">{{ project.tasks_count || 0 }}</span> tasks
      </span>
      <span class="text-sm text-gray-400">
        Created: {{ formatDate(project.created_at) }}
      </span>
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
    active: 'bg-green-100 text-green-700',
    completed: 'bg-gray-100 text-gray-700',
    on_hold: 'bg-yellow-100 text-yellow-700'
  }
  return classes[props.project.status] || ''
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}
</script>