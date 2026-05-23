# FounderOS — Idea → Execution

A centralized idea management and execution system for solo builders. Not just a note-taking app — a **decision-making + execution engine**.

## 🚀 Features

- **Idea CRUD** — Create, view, update, delete ideas with full metadata
- **AI Enhancement** — Expand ideas with OpenAI (problem, audience, features, MVP scope, monetization)
- **Priority Scoring** — Auto-calculated score: `((impact + demand + money) / (effort + 1)) * (skill / 10)`
- **Kanban Board** — Drag & drop across Backlog → Queue → Building → Completed
- **Smart Queue** — Auto-sorted by priority score, max 2 ideas in Building, auto-promotion on completion

## ⚙️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React + Vite + Tailwind CSS v4 |
| State | Zustand |
| Drag & Drop | @hello-pangea/dnd |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| AI | OpenAI API (gpt-4.1-mini) |

## 📦 Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- OpenAI API Key

### Backend
```bash
cd backend
npm install
# Edit .env with your MongoDB URI and OpenAI API key
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables (`backend/.env`)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/founderos
OPENAI_API_KEY=sk-your-key-here
```

## 🗂️ Folder Structure

```
├── backend/
│   ├── server.js              # Express entry point
│   ├── models/Idea.js         # Mongoose schema
│   ├── controllers/ideaController.js  # CRUD + queue logic
│   ├── services/aiService.js  # OpenAI integration
│   ├── routes/ideaRoutes.js   # REST API routes
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── api/ideaApi.js     # Axios API layer
│   │   ├── store/useIdeaStore.js  # Zustand state
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── StatsBar.jsx
│   │   │   ├── KanbanBoard.jsx
│   │   │   ├── IdeaCard.jsx
│   │   │   ├── IdeaModal.jsx
│   │   │   ├── IdeaDetail.jsx
│   │   │   └── ErrorToast.jsx
│   │   ├── App.jsx
│   │   └── index.css
│   └── vite.config.js
└── README.md
```

## 🔁 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ideas` | Create new idea |
| GET | `/ideas` | Get all ideas |
| GET | `/ideas/:id` | Get single idea |
| PUT | `/ideas/:id` | Update idea |
| DELETE | `/ideas/:id` | Delete idea |
| POST | `/ideas/expand` | AI enhancement |
| PATCH | `/ideas/status` | Update status (drag & drop) |
