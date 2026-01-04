# Task Manager App

A beautiful, modern task management application built with Expo (React Native) frontend and Express.js backend with MongoDB.

## Features

- ✅ Create, Read, Update, Delete tasks
- 🎯 Priority levels (High, Medium, Low)
- 📁 Category organization
- 📅 Due date tracking
- 🔍 Search and filter tasks
- 📊 Task statistics dashboard
- ✨ Beautiful, modern UI with animations
- 📱 Fully responsive design

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Frontend
- React Native
- Expo
- React Navigation
- Context API
- React Native Reanimated
- Expo Linear Gradient

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn
- Expo CLI

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory (or update the existing one):
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/taskmanager
```

4. Make sure MongoDB is running on your system.

5. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend API will be running on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update the API URL in `src/config/api.js` if needed:
   - For Android emulator: Use `http://10.0.2.2:3000/api`
   - For iOS simulator: Use `http://localhost:3000/api`
   - For physical device: Use your computer's IP address (e.g., `http://192.168.1.100:3000/api`)

4. Start the Expo development server:
```bash
npm start
```

5. Scan the QR code with Expo Go app (iOS/Android) or press:
   - `a` for Android emulator
   - `i` for iOS simulator
   - `w` for web browser

## API Endpoints

### Tasks

- `GET /api/tasks` - Get all tasks (supports query params: status, priority, category, search, sortBy)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/toggle` - Toggle task completion
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats/summary` - Get task statistics

### Health Check

- `GET /api/health` - Check API status

## Task Model

```javascript
{
  title: String (required),
  description: String,
  priority: String (enum: 'low', 'medium', 'high'),
  category: String,
  dueDate: Date,
  completed: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

## Project Structure

```
task-manager/
├── backend/
│   ├── models/
│   │   └── Task.js
│   ├── routes/
│   │   └── tasks.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskCard.js
│   │   │   ├── StatsCard.js
│   │   │   └── FilterModal.js
│   │   ├── screens/
│   │   │   ├── HomeScreen.js
│   │   │   ├── TaskDetailScreen.js
│   │   │   ├── AddTaskScreen.js
│   │   │   └── EditTaskScreen.js
│   │   ├── context/
│   │   │   └── TaskContext.js
│   │   └── config/
│   │       └── api.js
│   ├── App.js
│   ├── package.json
│   └── app.json
└── README.md
```

## Usage

1. **Create a Task**: Tap the floating action button (+) on the home screen
2. **View Task Details**: Tap on any task card
3. **Edit Task**: Open task details and tap "Edit Task"
4. **Complete Task**: Tap the checkbox on a task card or in task details
5. **Delete Task**: Open task details and tap "Delete"
6. **Filter Tasks**: Tap the filter icon to filter by status, priority, category, or sort order
7. **Search Tasks**: Use the search bar to search by title or description

## Troubleshooting

### Backend Issues

- **MongoDB Connection Error**: Make sure MongoDB is running and the connection string in `.env` is correct
- **Port Already in Use**: Change the PORT in `.env` file

### Frontend Issues

- **API Connection Error**: 
  - Check if backend is running
  - Update API URL in `src/config/api.js` for your platform
  - For physical devices, ensure both devices are on the same network

- **Module Not Found**: Run `npm install` again in the frontend directory

## License

ISC

