# 📚 Guide Complet - Application de Gestion de Projets Laravel/Vue.js

## 🚀 Phase 1 : Configuration initiale

### Étape 1.1 : Initialisation du projet Laravel
```bash
# Créer le projet Laravel
composer create-project laravel/laravel task-management-app
cd task-management-app

# Initialiser Git
git init
git add .
git commit -m "Initial Laravel setup"
```

### Étape 1.2 : Configuration de la base de données
```bash
# Dans le fichier .env, configurer la DB
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=task_management
DB_USERNAME=root
DB_PASSWORD=

# Créer la base de données
mysql -u root -p
CREATE DATABASE task_management;
```

### Étape 1.3 : Installation de Laravel Sanctum
```bash
# Installer Sanctum
composer require laravel/sanctum

# Publier les fichiers de configuration
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Exécuter les migrations
php artisan migrate

git add .
git commit -m "Add Laravel Sanctum for API authentication"
```

---

## 📊 Phase 2 : Backend - Modèles et Base de données

### Étape 2.1 : Créer les modèles et migrations

```bash
# Créer le modèle Project avec migration
php artisan make:model Project -m

# Créer le modèle Task avec migration
php artisan make:model Task -m
```

### Étape 2.2 : Définir les migrations

**Migration pour Projects** (`database/migrations/xxxx_create_projects_table.php`):
```php
public function up()
{
    Schema::create('projects', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->text('description')->nullable();
        $table->enum('status', ['active', 'completed', 'on_hold'])->default('active');
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->timestamps();
    });
}
```

**Migration pour Tasks** (`database/migrations/xxxx_create_tasks_table.php`):
```php
public function up()
{
    Schema::create('tasks', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->text('description')->nullable();
        $table->enum('status', ['todo', 'in_progress', 'done'])->default('todo');
        $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
        $table->foreignId('project_id')->constrained()->onDelete('cascade');
        $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');
        $table->date('due_date')->nullable();
        $table->timestamps();
    });
}
```

### Étape 2.3 : Configurer les modèles avec relations

**Model User** (`app/Models/User.php`):
```php
public function projects()
{
    return $this->hasMany(Project::class);
}

public function assignedTasks()
{
    return $this->hasMany(Task::class, 'assigned_to');
}
```

**Model Project** (`app/Models/Project.php`):
```php
protected $fillable = ['name', 'description', 'status', 'user_id'];

public function user()
{
    return $this->belongsTo(User::class);
}

public function tasks()
{
    return $this->hasMany(Task::class);
}
```

**Model Task** (`app/Models/Task.php`):
```php
protected $fillable = [
    'title', 'description', 'status', 'priority', 
    'project_id', 'assigned_to', 'due_date'
];

public function project()
{
    return $this->belongsTo(Project::class);
}

public function assignedUser()
{
    return $this->belongsTo(User::class, 'assigned_to');
}
```

```bash
# Exécuter les migrations
php artisan migrate

git add .
git commit -m "Add models and migrations for Project and Task"
```

---

## 🔐 Phase 3 : Authentification API

### Étape 3.1 : Créer le contrôleur d'authentification

```bash
php artisan make:controller Api/AuthController
```

**AuthController** (`app/Http/Controllers/Api/AuthController.php`):
```php
<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        
        return response()->json(['message' => 'Logged out successfully']);
    }
}
```

---

## 🎯 Phase 4 : API REST - Contrôleurs et Resources

### Étape 4.1 : Créer les Form Requests

```bash
php artisan make:request StoreProjectRequest
php artisan make:request UpdateProjectRequest
php artisan make:request StoreTaskRequest
php artisan make:request UpdateTaskRequest
```

**StoreProjectRequest** (`app/Http/Requests/StoreProjectRequest.php`):
```php
public function authorize()
{
    return true;
}

public function rules()
{
    return [
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
        'status' => 'in:active,completed,on_hold',
    ];
}
```

### Étape 4.2 : Créer les Resources

```bash
php artisan make:resource ProjectResource
php artisan make:resource TaskResource
php artisan make:resource UserResource
```

**ProjectResource** (`app/Http/Resources/ProjectResource.php`):
```php
public function toArray($request)
{
    return [
        'id' => $this->id,
        'name' => $this->name,
        'description' => $this->description,
        'status' => $this->status,
        'user' => new UserResource($this->whenLoaded('user')),
        'tasks_count' => $this->whenCounted('tasks'),
        'tasks' => TaskResource::collection($this->whenLoaded('tasks')),
        'created_at' => $this->created_at,
        'updated_at' => $this->updated_at,
    ];
}
```

### Étape 4.3 : Créer les contrôleurs

```bash
php artisan make:controller Api/ProjectController --resource
php artisan make:controller Api/TaskController --resource
```

**ProjectController** (`app/Http/Controllers/Api/ProjectController.php`):
```php
<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = auth()->user()->projects()
            ->withCount('tasks')
            ->latest()
            ->paginate(10);
            
        return ProjectResource::collection($projects);
    }

    public function store(StoreProjectRequest $request)
    {
        $project = auth()->user()->projects()->create($request->validated());
        
        return new ProjectResource($project);
    }

    public function show(Project $project)
    {
        $this->authorize('view', $project);
        
        return new ProjectResource($project->load(['user', 'tasks.assignedUser']));
    }

    public function update(UpdateProjectRequest $request, Project $project)
    {
        $this->authorize('update', $project);
        
        $project->update($request->validated());
        
        return new ProjectResource($project);
    }

    public function destroy(Project $project)
    {
        $this->authorize('delete', $project);
        
        $project->delete();
        
        return response()->json(['message' => 'Project deleted successfully']);
    }
}
```

---

## 🛡️ Phase 5 : Autorisations et Middleware

### Étape 5.1 : Créer les Policies

```bash
php artisan make:policy ProjectPolicy --model=Project
php artisan make:policy TaskPolicy --model=Task
```

**ProjectPolicy** (`app/Policies/ProjectPolicy.php`):
```php
public function view(User $user, Project $project)
{
    return $user->id === $project->user_id;
}

public function update(User $user, Project $project)
{
    return $user->id === $project->user_id;
}

public function delete(User $user, Project $project)
{
    return $user->id === $project->user_id;
}
```

### Étape 5.2 : Créer le middleware de permissions

```bash
php artisan make:middleware CheckProjectPermission
```

---

## 📧 Phase 6 : Notifications et Queues

### Étape 6.1 : Créer la notification pour l'assignation de tâche

```bash
php artisan make:notification TaskAssigned
php artisan make:mail TaskAssignedMail --markdown=emails.task-assigned
```

**TaskAssigned Notification** (`app/Notifications/TaskAssigned.php`):
```php
<?php
namespace App\Notifications;

use App\Models\Task;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TaskAssigned extends Notification implements ShouldQueue
{
    use Queueable;

    protected $task;

    public function __construct(Task $task)
    {
        $this->task = $task;
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('New Task Assigned: ' . $this->task->title)
            ->line('You have been assigned a new task.')
            ->line('Task: ' . $this->task->title)
            ->line('Project: ' . $this->task->project->name)
            ->line('Priority: ' . $this->task->priority)
            ->line('Due Date: ' . $this->task->due_date)
            ->action('View Task', url('/tasks/' . $this->task->id))
            ->line('Thank you for your attention!');
    }
}
```

### Étape 6.2 : Configurer les queues

```bash
# Configurer la queue dans .env
QUEUE_CONNECTION=database

# Créer la table jobs
php artisan queue:table
php artisan migrate

git add .
git commit -m "Add policies, middleware and email notifications"
```

---

## 🧪 Phase 7 : Tests

### Étape 7.1 : Créer les tests

```bash
php artisan make:test AuthenticationTest
php artisan make:test ProjectTest
php artisan make:test TaskTest
```

**AuthenticationTest** (`tests/Feature/AuthenticationTest.php`):
```php
<?php
namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register()
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['user', 'token']);
    }

    public function test_user_can_login()
    {
        $user = User::factory()->create();

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['user', 'token']);
    }
}
```

---

## 🎨 Phase 8 : Frontend Vue.js

### Étape 8.1 : Initialiser Vue.js

```bash
# Dans le dossier racine du projet Laravel
npm create vite@latest frontend -- --template vue
cd frontend

# Installer les dépendances
npm install
npm install vue-router@4 pinia axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

git add .
git commit -m "Initialize Vue.js frontend with Vite"
```

### Étape 8.2 : Configurer Vue Router

**router/index.js**:
```javascript
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
```

### Étape 8.3 : Configurer Pinia Store

**stores/auth.js**:
```javascript
import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(credentials) {
      try {
        const response = await axios.post('/api/login', credentials)
        this.token = response.data.token
        this.user = response.data.user
        localStorage.setItem('token', this.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        return response
      } catch (error) {
        throw error
      }
    },

    async register(userData) {
      try {
        const response = await axios.post('/api/register', userData)
        this.token = response.data.token
        this.user = response.data.user
        localStorage.setItem('token', this.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        return response
      } catch (error) {
        throw error
      }
    },

    async logout() {
      try {
        await axios.post('/api/logout')
      } finally {
        this.token = null
        this.user = null
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
      }
    },
  },
})
```

### Étape 8.4 : Créer les composants

**components/TaskCard.vue**:
```vue
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
```

**components/ProjectCard.vue**:
```vue
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
```

---

## 🔧 Phase 9 : Configuration des routes API

### Étape 9.1 : Définir les routes dans Laravel

**routes/api.php**:
```php
<?php
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;
use Illuminate\Support\Facades\Route;

// Routes publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Projects
    Route::apiResource('projects', ProjectController::class);
    
    // Tasks
    Route::get('/projects/{project}/tasks', [TaskController::class, 'index']);
    Route::post('/projects/{project}/tasks', [TaskController::class, 'store']);
    Route::apiResource('tasks', TaskController::class)->except(['index', 'store']);
});
```

---

## 📝 Phase 10 : Documentation et finalisation

### Étape 10.1 : Créer le README principal

**README.md**:
```markdown
# Task Management Application

Application de gestion de projets et tâches développée avec Laravel et Vue.js.

## 🛠️ Technologies utilisées

- **Backend**: Laravel 10+, Laravel Sanctum
- **Frontend**: Vue.js 3, Composition API, Pinia, Vue Router
- **Styling**: Tailwind CSS
- **Database**: MySQL
- **Queue**: Laravel Queues avec driver database

## 📦 Installation

### Prérequis
- PHP 8.1+
- Composer
- Node.js 16+
- MySQL

### Backend Setup

1. Cloner le repository
```bash
git clone [repository-url]
cd task-management-app
```

2. Installer les dépendances PHP
```bash
composer install
```

3. Configurer l'environnement
```bash
cp .env.example .env
php artisan key:generate
```

4. Configurer la base de données dans `.env`

5. Exécuter les migrations
```bash
php artisan migrate
```

6. Lancer le serveur
```bash
php artisan serve
```

7. Lancer le worker pour les queues
```bash
php artisan queue:work
```

### Frontend Setup

1. Naviguer vers le dossier frontend
```bash
cd frontend
```

2. Installer les dépendances
```bash
npm install
```

3. Lancer le serveur de développement
```bash
npm run dev
```

## 📚 Documentation API

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/register | Créer un compte |
| POST | /api/login | Se connecter |
| POST | /api/logout | Se déconnecter |

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/projects | Liste des projets |
| POST | /api/projects | Créer un projet |
| GET | /api/projects/{id} | Détails d'un projet |
| PUT | /api/projects/{id} | Modifier un projet |
| DELETE | /api/projects/{id} | Supprimer un projet |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/projects/{id}/tasks | Liste des tâches d'un projet |
| POST | /api/projects/{id}/tasks | Créer une tâche |
| GET | /api/tasks/{id} | Détails d'une tâche |
| PUT | /api/tasks/{id} | Modifier une tâche |
| DELETE | /api/tasks/{id} | Supprimer une tâche |

## 🧪 Tests

Exécuter les tests :
```bash
php artisan test
```

## 👤 Auteur

[Votre nom]
```

### Étape 10.2 : Commits finaux

```bash
# Backend final
git add .
git commit -m "Complete backend implementation with all features"

# Frontend final
cd frontend
git add .
git commit -m "Complete Vue.js frontend with all components"

# Documentation
git add README.md
git commit -m "Add complete project documentation"
```

---

## ✅ Checklist de validation

### Backend Laravel ✅
- [x] Modèles User, Project, Task avec relations
- [x] Migrations complètes
- [x] API REST avec tous les endpoints
- [x] Authentification avec Sanctum
- [x] Form Requests pour validation
- [x] Resources pour les réponses JSON
- [x] Policies pour les autorisations
- [x] Middleware de permissions
- [x] Email avec Queue pour assignation
- [x] Tests unitaires et fonctionnels

### Frontend Vue.js ✅
- [x] Vue 3 avec Composition API
- [x] Vue Router configuré
- [x] Pinia pour state management
- [x] Pages : Login, Register, Dashboard, Détails
- [x] Composants : TaskCard, ProjectCard, TaskForm
- [x] Responsive design avec Tailwind
- [x] États de chargement et erreurs
- [x] Validation des formulaires

### Documentation ✅
- [x] README avec instructions d'installation
- [x] Documentation des routes API
- [x] Commentaires dans le code
- [x] Messages de commit clairs

---

## 🎯 Temps estimé par phase

1. **Configuration initiale** : 30 minutes
2. **Backend - Modèles et DB** : 45 minutes
3. **Authentification API** : 30 minutes
4. **API REST** : 1 heure
5. **Autorisations** : 30 minutes
6. **Notifications et Queues** : 30 minutes
7. **Tests** : 45 minutes
8. **Frontend Vue.js** : 1h30
9. **Intégration** : 30 minutes
10. **Documentation** : 15 minutes

**Total estimé** : 5-6 heures