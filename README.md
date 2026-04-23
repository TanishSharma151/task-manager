# Task Manager

A full-stack task management web app built as part of the XRISE AI Systems take-home assignment. Users can create and manage tasks, organize them with tags, filter and search through them, and get AI-powered suggestions — all behind JWT auth with strict data isolation between users.

**Live:** https://task-manager-theta-virid.vercel.app  
**API:** https://task-manager-server-wlf7.onrender.com

---

## Features

- JWT-based authentication — sign up, sign in, protected routes
- Full task lifecycle — create, edit, delete, mark done, reopen
- Task fields: title, description, due date, priority (low/medium/high), status (todo/in-progress/done), and tags
- Tag management — create, rename, delete. Deleting a tag never deletes associated tasks
- Filter by status, priority, or tag. Search by title
- Strict data isolation — users only ever see their own tasks and tags
- 🌙 Dark mode with localStorage persistence
- ↩ Reopen tasks that were marked as done
- ✨ AI Smart Suggest — enter a task title and get suggested sub-tasks and tags instantly. Clicking a suggested tag creates and assigns it in one click

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Auth | JWT + bcrypt |
| AI | Groq Cloud (llama-3.3-70b-versatile) |
| Deployment | Vercel (frontend), Render (backend) |

---

## AI Provider

The Smart Suggest feature uses **Groq Cloud** with the `llama-3.3-70b-versatile` model.

Google Gemini was evaluated first but hit free tier quota limits during development. Groq was chosen as the alternative — no credit card required, genuinely free, and faster response times for this use case.

Get a free API key at https://console.groq.com

---

## Running Locally

**Prerequisites:** Node.js v18+, MongoDB Atlas URI, Groq API key

**Backend:**
```bash
cd server
npm install
cp .env.example .env
# Fill in your values
npm run dev
```

**Frontend:**
```bash
cd client
npm install
cp .env.example .env
# Fill in your values
npm start
```

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

**MongoDB over PostgreSQL** — tasks and tags don't need a rigid relational schema. Storing tag ObjectIds as an array on each task is idiomatic in MongoDB and avoids a junction table. Mongoose's `.populate()` handles the joins cleanly on reads.

**JWT in localStorage** — kept simple for this scope. In a production environment, httpOnly cookies would be the more secure choice to mitigate XSS risk.

**Groq over Gemini** — Gemini's free tier quota ran out quickly during testing. Groq offers unlimited free usage with faster inference for this use case, making it the better fit.

**Vercel + Render** — both deploy directly from GitHub and offer free tiers that comfortably handle this project's load.

---

## Known Issues

- Render free tier instances spin down after inactivity. The first request after an idle period can take up to 60 seconds to respond while the server wakes up.
- CORS is currently open to all origins. In a production deployment this would be locked down to the frontend domain only.

---

## Author

**Tanish Raj Sharma**  
tanishrajsharma151@gmail.com  
github.com/TanishSharma151  
linkedin.com/in/tanish-raj-sharma-02933b27b