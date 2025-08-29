import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import ProjectDetail from '../views/ProjectDetail.vue'
import ProjectForm from '../views/ProjectForm.vue'
import TaskForm from '../views/TaskForm.vue'

const routes = [
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/', name: 'dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/projects/:id', name: 'project-detail', component: ProjectDetail, meta: { requiresAuth: true } },
  { path: '/projects/create', name: 'project-create', component: ProjectForm, meta: { requiresAuth: true } },
  { path: '/projects/:id/edit', name: 'project-edit', component: ProjectForm, meta: { requiresAuth: true } },
  { path: '/tasks/create', name: 'task-create', component: TaskForm, meta: { requiresAuth: true } },
  { path: '/tasks/:id/edit', name: 'task-edit', component: TaskForm, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router