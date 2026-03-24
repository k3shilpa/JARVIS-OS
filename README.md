# 🤖 JARVIS — Personal AI Operating System for Developers

> A full-stack AI-powered developer assistant. Ask questions, debug code, get architecture advice — all in one place. 100% free to build and run.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## 📌 What is JARVIS?

JARVIS is a full-stack web application that acts as your personal AI-powered developer assistant — like having a senior engineer available 24/7 in your browser. Powered by **Groq's free API** (Llama 3.3 70B), it gives you:

- 💬 Real-time streaming AI responses
- 🧠 Full conversation memory and history
- 🔐 Personal login so only you can access it
- ⚡ Quick command shortcuts (Debug, Refactor, Write Tests, Explain)
- 🎨 Syntax-highlighted code blocks with one-click copy

> Built as a learning project — every phase teaches real full-stack skills.

---

## 💸 Total Cost: ₹0

| Layer | Technology | Cost |
|---|---|---|
| AI Brain | Groq API (Llama 3.3 70B) | Free forever |
| Frontend | React + Vite | Free (open source) |
| Backend | Node.js + Express | Free (open source) |
| Database (dev) | SQLite | Free |
| Database (prod) | Supabase (PostgreSQL) | Free tier |
| ORM | Prisma | Free (open source) |
| Auth | JWT + bcrypt | Free (open source) |
| Frontend hosting | Vercel | Free forever |
| Backend hosting | Render.com | Free tier |
| Version control | GitHub | Free |

---

## 🗂️ Project Structure

```
jarvis-os/
├── frontend/                      ← React app (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx     ← Main chat area
│   │   │   ├── MessageBubble.jsx  ← Message with markdown rendering
│   │   │   ├── InputBar.jsx       ← Text input + send button
│   │   │   ├── Sidebar.jsx        ← Conversation history list
│   │   │   └── QuickCommands.jsx  ← Shortcut command buttons
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx      ← Login / signup
│   │   │   └── ChatPage.jsx       ← Main app page
│   │   ├── hooks/
│   │   │   └── useChat.js         ← Custom hook for chat logic
│   │   ├── api/
│   │   │   └── client.js          ← All API calls to backend
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/                       ← Node.js + Express server
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js            ← POST /api/auth/login, /register
│   │   │   ├── chat.js            ← POST /api/chat (Groq streaming)
│   │   │   └── conversations.js   ← GET, DELETE /api/conversations
│   │   ├── middleware/
│   │   │   └── auth.js            ← JWT validation
│   │   ├── db/
│   │   │   └── prisma.js          ← Prisma client
│   │   └── index.js               ← Server entry point
│   ├── prisma/
│   │   └── schema.prisma          ← DB schema
│   ├── .env.example               ← Environment variable template
│   └── package.json
│
└── README.md
```

---

## ⚙️ Tech Stack

### Frontend
- **React 18** — Component-based UI framework
- **Vite** — Fast dev server with hot reload
- **React Router** — Client-side page navigation
- **Tailwind CSS** — Utility-first styling
- **EventSource API** — Receive streaming responses from backend

### Backend
- **Node.js** — JavaScript runtime for the server
- **Express.js** — Minimal HTTP server and routing
- **Groq SDK** — Official client for Groq's free AI API
- **Prisma** — Type-safe ORM for database access
- **JWT** — Stateless authentication tokens
- **bcrypt** — Secure password hashing

### Database
- **SQLite** — Zero-config file database for local development
- **PostgreSQL via Supabase** — Free hosted database for production

### Deployment
- **Vercel** — Frontend hosting (free, auto-deploys from GitHub)
- **Render.com** — Backend hosting (free tier)
- **Supabase** — Managed PostgreSQL (free tier)

---

## 🚀 Getting Started (Local Development)

### Prerequisites

Make sure you have these installed:

```bash
node --version   # v18 or higher
npm --version    # v9 or higher
git --version
```

Don't have Node.js? Download it free from [nodejs.org](https://nodejs.org)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/jarvis-os.git
cd jarvis-os
```

### 2. Get your free Groq API key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up with Google or GitHub — no card needed
3. Click **API Keys** → **Create API Key**
4. Copy the key

### 3. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file:

```bash
cp .env.example .env
```

Fill in your `.env`:

```env
GROQ_API_KEY=gsk_your_key_here
JWT_SECRET=make_up_any_long_random_string
DATABASE_URL=file:./dev.db
PORT=5000
```

Set up the database:

```bash
npx prisma migrate dev --name init
```

Start the backend server:

```bash
npm run dev
```

Backend runs at `http://localhost:5000`

### 4. Set up the frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

Open your browser and go to `http://localhost:5173` — JARVIS is running! 🎉

---

## 🔐 Environment Variables

### Backend — `backend/.env`

| Variable | Description | Example |
|---|---|---|
| `GROQ_API_KEY` | Your free Groq API key | `gsk_abc123...` |
| `JWT_SECRET` | Any long random string for signing tokens | `my_super_secret_key_123` |
| `DATABASE_URL` | Path to SQLite file (dev) or Supabase URL (prod) | `file:./dev.db` |
| `PORT` | Port the backend server runs on | `5000` |

> ⚠️ Never commit your `.env` file. It is already in `.gitignore`.

---

## 🗃️ Database Schema

```prisma
model User {
  id            String         @id @default(uuid())
  email         String         @unique
  password      String
  createdAt     DateTime       @default(now())
  conversations Conversation[]
}

model Conversation {
  id        String    @id @default(uuid())
  title     String
  userId    String
  user      User      @relation(fields: [userId], references: [id])
  messages  Message[]
  createdAt DateTime  @default(now())
}

model Message {
  id             String       @id @default(uuid())
  role           String       // "user" or "assistant"
  content        String
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id])
  createdAt      DateTime     @default(now())
}
```

---

## 🌊 How Streaming Works

```
User types message
       ↓
React sends POST /api/chat
       ↓
Express loads conversation history from DB
       ↓
Groq SDK streams tokens from Llama 3.3
       ↓
Express forwards each chunk via SSE
       ↓
React appends each chunk to the UI in real time
       ↓
Stream ends → backend saves full message to DB
```

---

## 🛠️ API Endpoints

| Method | Route | Description | Auth required |
|---|---|---|---|
| POST | `/api/auth/register` | Create new account | No |
| POST | `/api/auth/login` | Login, returns JWT | No |
| GET | `/api/conversations` | Get all conversations | Yes |
| DELETE | `/api/conversations/:id` | Delete a conversation | Yes |
| POST | `/api/chat` | Send message, stream AI response | Yes |

---

## 📦 Build for Production

### Frontend

```bash
cd frontend
npm run build
```

Deploy the `dist/` folder to Vercel.

### Backend

Push to GitHub and connect to Render.com. Add your environment variables in the Render dashboard.

### Database

Create a free project at [supabase.com](https://supabase.com), copy the connection string, and set it as `DATABASE_URL` in your production environment variables.

---

## 🔭 Roadmap

- [x] Project setup and architecture
- [ ] Phase 1 — React UI scaffold + dark layout
- [ ] Phase 2 — Chat interface with state management
- [ ] Phase 3 — Express backend with REST API
- [ ] Phase 4 — Groq AI integration with streaming
- [ ] Phase 5 — SQLite database and conversation history
- [ ] Phase 6 — JWT authentication and login
- [ ] Phase 7 — Deploy frontend + backend + database

---

## 🔄 Switching to a Paid AI Provider (Optional)

When you want to upgrade, only 2 lines change in your backend:

```js
// Current — Groq (free)
import Groq from "groq-sdk";
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
const model = "llama-3.3-70b-versatile";

// Upgrade — Anthropic Claude (when ready)
import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const model = "claude-sonnet-4-5";
```

All routes, database logic, auth, and frontend stay exactly the same.

---

## 🤝 Contributing

This is a personal learning project. Feel free to fork it and build your own version!

1. Fork the repo
2. Create a feature branch — `git checkout -b feature/my-feature`
3. Commit your changes — `git commit -m "Add my feature"`
4. Push to the branch — `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 👨‍💻 Author

Built from scratch as a full-stack learning project.

> *"The best way to learn is to build something real."*
