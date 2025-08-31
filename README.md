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

## 🚀 Fonctionnalités

### Backend
- ✅ API REST complète pour projets et tâches
- ✅ Authentification JWT avec Laravel Sanctum
- ✅ Validation des données avec Form Requests
- ✅ Autorisations avec Policies
- ✅ Relations Eloquent entre modèles
- ✅ Resources pour formatage JSON
- ✅ Tests automatisés

### Frontend
- ✅ Interface utilisateur moderne avec Vue.js 3
- ✅ Gestion d'état avec Pinia
- ✅ Routing avec Vue Router
- ✅ Design responsive avec Tailwind CSS
- ✅ Composants réutilisables
- ✅ Gestion des erreurs et états de chargement

## 📁 Structure du projet

```
task-management-app/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/
│   │   ├── Requests/
│   │   └── Resources/
│   ├── Models/
│   └── Policies/
├── database/
│   └── migrations/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── stores/
│   │   └── router/
│   └── package.json
├── routes/
│   └── api.php
└── tests/
    └── Feature/
```
