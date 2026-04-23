# Task Manager

A full-stack personal task management web app built for the XRISE AI Systems take-home assignment.

**Live Demo:** https://task-manager-theta-virid.vercel.app
**Backend API:** https://task-manager-server-wlf7.onrender.com

---

## Features

- JWT-based sign-up and sign-in
- Create, edit, delete, and mark tasks as done
- Task fields: title, description, due date, priority, status, and tags
- Tag management — create, rename, delete (deleting a tag never deletes tasks)
- Filter tasks by status, priority, and tag
- Search tasks by title
- Data isolation — users only see their own data
- ✨ AI Smart Suggest — given a task title, suggests sub-tasks and relevant tags powered by Groq (Llama 3.3)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB (Atlas) |
| Auth | JWT + bcrypt |
| AI | Groq Cloud (llama-3.3-70b-versatile) |
| Deployment | Vercel (frontend), Render (backend) |

---

## AI Provider

This project uses **Groq Cloud** with the `llama-3.3-70b-versatile` model for the Smart Suggest feature.

Google Gemini API was initially evaluated but hit free tier quota limits. Groq was chosen as the alternative — it is completely free, has no credit card requirement, and offers fast inference.

Get a free Groq API key at: https://console.groq.com

---

## Running Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Groq API key (free at console.groq.com)

### Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Fill in your values in .env
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
cp .env.example .env
# Fill in your values in .env
npm start
```

### Environment Variables

**server/.env**
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
GROQ_API_KEY=your_groq_api_key
```

**client/.env**
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Architecture Decisions

- **MongoDB** was chosen over PostgreSQL because tasks and tags have a flexible, document-friendly structure. Tags stored as ObjectId references on tasks gives a clean many-to-many relationship without a junction table.
- **Express + Node** for the backend — familiar, fast to build with, and pairs well with MongoDB.
- **JWT stored in localStorage** — simple for a single-user app. In production, httpOnly cookies would be more secure.
- **Groq for AI** — free tier, fast, no billing setup required. Model `llama-3.3-70b-versatile` gives high quality suggestions.
- **Vercel + Render** for deployment — both have generous free tiers and deploy directly from GitHub.

---

## Known Bugs

- AI suggested tags are displayed but cannot be auto-created/assigned in one click — user must manually create the tag first then assign it.
- Render free tier backend goes cold after inactivity — first request after idle period may take 30-60 seconds.
- CORS is currently open to all origins — in production this should be restricted to the frontend domain.

---

## Author

**Tanish Raj Sharma**
- GitHub: github.com/TanishSharma151
- LinkedIn: linkedin.com/in/tanish-raj-sharma-02933b27b
- Email: tanishrajsharma151@gmail.com