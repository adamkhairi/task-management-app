# API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication
L'API utilise Laravel Sanctum pour l'authentification. Après connexion, incluez le token dans l'header :
```
Authorization: Bearer {token}
```

## Endpoints

### Authentication

#### Register
```http
POST /register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Response (201):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "1|abc123...",
  "token_type": "Bearer"
}
```

#### Login
```http
POST /login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "1|abc123...",
  "token_type": "Bearer"
}
```

#### Logout
```http
POST /logout
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

### Projects

#### Get All Projects
```http
GET /projects
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Mon Projet",
      "description": "Description du projet",
      "status": "active",
      "tasks_count": 5,
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    }
  ],
  "links": {...},
  "meta": {...}
}
```

#### Create Project
```http
POST /projects
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Nouveau Projet",
  "description": "Description du nouveau projet",
  "status": "active"
}
```

#### Get Project
```http
GET /projects/{id}
Authorization: Bearer {token}
```

#### Update Project
```http
PUT /projects/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Projet Modifié",
  "description": "Nouvelle description",
  "status": "completed"
}
```

#### Delete Project
```http
DELETE /projects/{id}
Authorization: Bearer {token}
```

### Tasks

#### Get Project Tasks
```http
GET /projects/{project_id}/tasks
Authorization: Bearer {token}
```

#### Create Task
```http
POST /projects/{project_id}/tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Nouvelle Tâche",
  "description": "Description de la tâche",
  "status": "todo",
  "priority": "medium",
  "assigned_to": 1,
  "due_date": "2024-12-31"
}
```

#### Get Task
```http
GET /tasks/{id}
Authorization: Bearer {token}
```

#### Update Task
```http
PUT /tasks/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Tâche Modifiée",
  "status": "in_progress",
  "priority": "high"
}
```

#### Delete Task
```http
DELETE /tasks/{id}
Authorization: Bearer {token}
```

## Status Codes

- `200` - OK
- `201` - Created
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

## Error Response Format

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "field_name": [
      "Error message"
    ]
  }
}
```

## Enums

### Project Status
- `active`
- `completed`
- `on_hold`

### Task Status
- `todo`
- `in_progress`
- `done`

### Task Priority
- `low`
- `medium`
- `high`