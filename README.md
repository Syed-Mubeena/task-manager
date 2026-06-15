# TaskFlow — Task Management App

A full-stack task management web application built with the MERN stack.

## 🚀 Live Demo
- Frontend: https://mubeena-task-manager.netlify.app
- Backend: https://task-manager-28sx.onrender.com

## ✨ Features
- User authentication (Register/Login) with JWT
- Create, update, and delete tasks
- Kanban board with To Do, In Progress, and Done columns
- Real-time task stats
- Responsive design for web and mobile

## 🛠️ Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React.js |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas |
| Auth | JWT + bcrypt |
| Deployment | Netlify + Render |

## 📦 Installation

### Backend
```bash
cd backend
npm install
node index.js
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 🔐 Environment Variables
Create a `.env` file in the backend folder:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```