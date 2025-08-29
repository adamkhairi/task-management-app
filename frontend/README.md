# Frontend - Task Management Vue.js App

Interface utilisateur moderne pour l'application de gestion de projets et tâches.

## 🛠️ Technologies

- **Vue.js 3** avec Composition API
- **Vue Router 4** pour la navigation
- **Pinia** pour la gestion d'état
- **Axios** pour les appels API
- **Tailwind CSS** pour le styling
- **Vite** comme bundler

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Build pour production
npm run build

# Preview du build de production
npm run preview
```

## 📁 Structure

```
src/
├── components/          # Composants réutilisables
│   ├── ProjectCard.vue
│   └── TaskCard.vue
├── views/              # Pages de l'application
│   ├── Login.vue
│   ├── Register.vue
│   ├── Dashboard.vue
│   ├── ProjectDetail.vue
│   ├── ProjectForm.vue
│   └── TaskForm.vue
├── stores/             # Stores Pinia
│   └── auth.js
├── router/             # Configuration des routes
│   └── index.js
└── main.js            # Point d'entrée
```

## 🎨 Composants

### ProjectCard
Affiche les informations d'un projet avec :
- Nom et description
- Statut (active, completed, on_hold)
- Nombre de tâches
- Date de création

### TaskCard
Affiche les informations d'une tâche avec :
- Titre et description
- Statut (todo, in_progress, done)
- Priorité (low, medium, high)
- Utilisateur assigné
- Actions (éditer, supprimer, changer statut)

## 🔄 Gestion d'état

Le store d'authentification (`stores/auth.js`) gère :
- État de connexion de l'utilisateur
- Token d'authentification
- Actions de login/logout/register
- Configuration automatique des headers Axios

## 🛣️ Routes

- `/login` - Page de connexion
- `/register` - Page d'inscription
- `/` - Dashboard (liste des projets)
- `/projects/:id` - Détails d'un projet
- `/projects/create` - Créer un projet
- `/projects/:id/edit` - Modifier un projet
- `/tasks/create` - Créer une tâche
- `/tasks/:id/edit` - Modifier une tâche

## 🔒 Protection des routes

Les routes nécessitant une authentification sont protégées par un guard de navigation qui vérifie la présence du token dans le localStorage.

## 🎯 Fonctionnalités

- ✅ Authentification complète (login/register/logout)
- ✅ CRUD complet pour les projets
- ✅ CRUD complet pour les tâches
- ✅ Interface responsive
- ✅ Gestion des erreurs
- ✅ États de chargement
- ✅ Navigation intuitive