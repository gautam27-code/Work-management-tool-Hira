# 🚀 Hira - Work Management Tool

A beginner-friendly MERN stack project for managing tasks, inspired by Jira.

![Tech Stack](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Tech Stack](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Tech Stack](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Tech Stack](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

## 📁 Project Structure

```
Hira/
├── backend/                  # Node.js + Express API
│   ├── models/
│   │   └── Task.js           # Mongoose schema
│   ├── routes/
│   │   └── taskRoutes.js     # API endpoints
│   ├── .env                  # Environment variables
│   ├── server.js             # Entry point
│   └── package.json
│
└── frontend/                 # React + Vite app
    └── src/
        ├── components/
        │   ├── Navbar.jsx    # Top navigation bar
        │   ├── Sidebar.jsx   # Sidebar with stats & teams
        │   ├── TaskCard.jsx  # Individual task card
        │   ├── TaskList.jsx  # Dashboard grid of tasks
        │   └── CreateTask.jsx# Modal form to create tasks
        ├── App.jsx           # Root component
        ├── main.jsx          # React entry point
        └── index.css         # Tailwind + custom styles
```

## ⚙️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) running locally **OR** a [MongoDB Atlas](https://www.mongodb.com/atlas) connection string

### 1. Clone / Open the project
```bash
cd Hira
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Edit `.env` to set your MongoDB connection:
```env
MONGO_URI=mongodb://localhost:27017/hira
PORT=5000
```
> 💡 For MongoDB Atlas, replace with your Atlas connection string.

Start the backend server:
```bash
npm run dev
```
The server runs at `http://localhost:5000`

### 3. Setup Frontend
Open a **new terminal**:
```bash
cd frontend
npm install
npm run dev
```
The app opens at `http://localhost:5173`

## 🎯 Features

| Feature | Description |
|---------|-------------|
| ✅ Create Task | Add tasks with title, description, deadline & progress |
| 📋 View Tasks | Dashboard with responsive card grid |
| 🔄 Update Progress | Drag the slider to update % progress |
| ✔️ Mark Complete | Toggle tasks as completed/pending |
| 🎨 Visual States | Green glow for completed, red for overdue |
| 📊 Sidebar Stats | Live count of total, completed & pending tasks |

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/tasks` | Create a new task |
| `GET` | `/api/tasks` | Get all tasks |
| `PUT` | `/api/tasks/:id` | Update a task |

## 🛠️ Tech Stack

- **Frontend:** React 19 (Vite), Tailwind CSS v4
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Styling:** Dark theme, glassmorphism, animations

# Hira Project Setup

Follow these steps to clone, install dependencies, and run the project successfully.

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (installed and running locally or a remote instance)
- Git

## Steps to Clone and Run the Project

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Hira.
```

### 2. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```bash
   echo PORT=5000 > .env
   echo MONGO_URI=mongodb://127.0.0.1:27017/hira >> .env
   ```

### 3. Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Create a `.env` file if needed:
   ```bash
   echo VITE_API_URL=http://localhost:5000 > .env
   ```

### 4. Build Frontend (for Production)
If you need to build the frontend for production:
```bash
npm run build
```

### 5. Run the Application
1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```
2. Start the frontend development server:
   ```bash
   cd ../frontend
   npm run dev
   ```

### 6. Verify MongoDB
Ensure MongoDB is running locally or update the `MONGO_URI` in the `.env` file to point to a remote MongoDB instance.

### 7. Access the Application
- Frontend: Open [http://localhost:5173](http://localhost:5173) in your browser.
- Backend API: Test the API at [http://localhost:5000](http://localhost:5000).
