# Task Manager Backend

Express.js REST API for the Task Manager application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/taskmanager
```

3. Start MongoDB service

4. Run the server:
```bash
npm start
```

For development:
```bash
npm run dev
```

## API Documentation

Base URL: `http://localhost:3000/api`

### Endpoints

#### Get All Tasks
```
GET /tasks
Query Parameters:
  - status: 'all' | 'active' | 'completed'
  - priority: 'all' | 'low' | 'medium' | 'high'
  - category: 'all' | 'work' | 'personal' | 'shopping' | 'health' | 'general'
  - search: string (searches title and description)
  - sortBy: 'date' | 'priority'
```

#### Get Single Task
```
GET /tasks/:id
```

#### Create Task
```
POST /tasks
Body:
{
  title: string (required),
  description: string,
  priority: 'low' | 'medium' | 'high',
  category: string,
  dueDate: ISO date string
}
```

#### Update Task
```
PUT /tasks/:id
Body: (same as create)
```

#### Toggle Task Completion
```
PATCH /tasks/:id/toggle
```

#### Delete Task
```
DELETE /tasks/:id
```

#### Get Statistics
```
GET /tasks/stats/summary
Response:
{
  total: number,
  completed: number,
  pending: number,
  highPriority: number
}
```

