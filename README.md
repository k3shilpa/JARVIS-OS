# JARVIS — Personal AI Operating System for Developers
### 100% Free Stack — Built for Students

## What is JARVIS?

JARVIS is a full-stack web application that acts as your personal AI-powered developer assistant — like having a senior engineer available 24/7 inside your browser. You type a question, paste code, describe a bug, or ask for architecture advice, and JARVIS streams back intelligent, developer-focused answers in real time. It remembers your past conversations, keeps a searchable history, and is protected by your own login so only you can access it.

Think of it as a private, self-hosted version of ChatGPT — built specifically for developers, with code highlighting, quick command shortcuts, and a slick dark UI that feels like a real operating system. And it costs you absolutely nothing to build or run.

---

## The Problem It Solves

Developers constantly context-switch between their editor, browser, Stack Overflow, and AI tools. JARVIS brings everything into one place:

- Ask coding questions and get precise, runnable answers
- Debug errors by pasting stack traces
- Get code reviewed, refactored, or explained
- Design APIs, databases, and system architecture
- Never lose a useful AI conversation again — everything is saved

---

## Complete Free Tech Stack

| Layer | Technology | Cost |
|-------|------------|------|
| AI Brain | Groq API (Llama 3.3 70B) | Free forever |
| Frontend | React + Vite | Free (open source) |
| Backend | Node.js + Express | Free (open source) |
| Database | SQLite (dev) → Supabase (prod) | Free |
| ORM | Prisma | Free (open source) |
| Auth | JWT + bcrypt | Free (open source) |
| Frontend hosting | Vercel | Free forever |
| Backend hosting | Render.com | Free tier |
| Version control | GitHub | Free |

Total monthly cost: ₹0

---

## Why Groq Instead of Paid APIs?

Groq is a free AI API that runs open-source models like Meta's Llama 3.3 70B — one of the most powerful AI models in the world. It is:

- Completely free with no credit card required
- Extremely fast (often faster than paid APIs)
- Compatible with the same API patterns as OpenAI and Anthropic
- Generous enough rate limits for any personal project

When you get a job or have money later, switching to Claude or GPT-4 takes literally changing 2 lines of code. You lose nothing by starting with Groq.

How to get your free Groq API key:
1. Go to console.groq.com
2. Sign up with Google or GitHub (free, no card)
3. Click "API Keys" then "Create API Key"
4. Copy the key — you are done

---

## Tech Stack — Full Explanation

### Frontend (What the user sees)

React with Vite is the UI framework. Instead of writing plain HTML and manually updating the DOM, React lets you build the interface as reusable components — a ChatBubble component, a Sidebar component, an InputBar component. When data changes (like a new message arrives), React automatically updates only the parts of the UI that need to change. Vite is the build tool that gives you instant hot-reload during development.

Tailwind CSS handles all the styling. The JARVIS interface will have a dark theme with cyan and blue accents, monospace fonts for code blocks, and smooth transitions.

React Router handles navigation between pages — login page, main chat page, history page — without ever reloading the browser.

The Fetch API and EventSource are browser-native tools for making HTTP requests to the backend and receiving streaming responses (where JARVIS types words one by one instead of waiting for the full answer).

---

### Backend (The server that powers everything)

Node.js is the JavaScript runtime that lets you run JS on a server, not just in the browser. Your backend is a Node.js application that listens for requests from the frontend and responds.

Express.js is a minimal framework on top of Node.js. It makes it simple to define routes (what happens when the frontend calls /api/chat or /api/login), add middleware (like authentication checks), and send back responses.

The Groq SDK is the official Node.js library for calling Groq's AI API. Your backend uses this to forward the user's message to Llama 3.3 and stream the response back. You install it with: npm install groq-sdk

JWT (JSON Web Tokens) is the authentication system. When a user logs in, the server creates a signed token and sends it to the browser. Every future request includes this token so the server knows who is asking — without checking the database every single time.

bcrypt handles password hashing. Passwords are never stored in plain text. bcrypt converts "mypassword123" into a scrambled, irreversible string that cannot be decoded.

---

### Database (Where data lives permanently)

SQLite is used during development. It is a simple file-based database that requires zero setup and zero cost. The entire database is a single .db file sitting in your project folder.

Supabase is used when you deploy. It is a free hosted PostgreSQL database. When you push your project live, you point the backend at Supabase instead of the local SQLite file. The free tier gives you 500MB — more than enough for a personal project and no card required.

Prisma ORM sits on top of the database. Instead of writing raw SQL like SELECT * FROM messages WHERE user_id = 1, Prisma lets you write JavaScript like db.message.findMany({ where: { userId: 1 } }). It also manages your schema through migration files, so changes to the database structure are controlled and reversible.

What gets stored:
- Users — id, email, hashed password, created date
- Conversations — id, user_id, title, created date
- Messages — id, conversation_id, role (user or assistant), content, timestamp

---

### Deployment (Making it live — all free)

Vercel hosts the React frontend. Connect your GitHub repo and every time you push code, it auto-deploys in seconds. Free forever for personal projects and no credit card ever needed.

Render.com hosts the Node.js backend on a free tier. No card required to sign up.

Supabase hosts the production PostgreSQL database for free.

Environment variables store your Groq API key and JWT secret on these platforms — never written in your code, never pushed to GitHub.

---

## How the Full System Works — Step by Step

### Step 1: User opens the browser

The user visits the deployed URL. Vercel serves the React app as HTML, CSS, and JavaScript files. The browser downloads and runs them, rendering the JARVIS login screen.

### Step 2: Login

The user enters their email and password. React sends a POST /api/auth/login request to Express. Express looks up the user in the database, uses bcrypt to compare the password with the stored hash. If they match, it creates a JWT token and sends it back. React stores this token in localStorage. Every future API call will include it in the Authorization header.

### Step 3: Loading the chat interface

Once logged in, React calls GET /api/conversations to load the user's past conversations. Express validates the JWT, extracts the user ID, queries the database, and returns the list as JSON. React renders them in the sidebar.

### Step 4: Sending a message

The user types "How do I reverse a linked list in Python?" and hits Enter. React appends the message to the UI immediately so it feels instant. It then sends a POST /api/chat request to Express with the message content and conversation ID.

### Step 5: The backend calls Groq

Express receives the request and validates the JWT. It loads the full conversation history from the database so the AI has context. It calls the Groq SDK with the conversation history and a system prompt that defines JARVIS's personality. It requests a streaming response so words come back as they are generated.

### Step 6: Streaming back to the browser

Express uses Server-Sent Events (SSE) — a technique where the HTTP connection stays open and the server keeps pushing data chunks. Each word from Groq is immediately forwarded to the browser. React receives these chunks via EventSource and appends each one to the message bubble in real time, creating the live typing effect.

### Step 7: Saving to the database

Once the stream ends, the backend saves both the user message and the full assistant response to the database. If it is a new conversation, the title is auto-generated from the first message.

### Step 8: The user sees the answer

The full response renders with syntax-highlighted code blocks, bold text, and bullet points parsed from markdown. The conversation is saved and will appear in the sidebar next time.

---

## Project Folder Structure

```
jarvis-os/
├── frontend/                      ← React app (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx     ← Main chat area
│   │   │   ├── MessageBubble.jsx  ← Individual message with markdown rendering
│   │   │   ├── InputBar.jsx       ← Text input and send button
│   │   │   ├── Sidebar.jsx        ← Conversation history list
│   │   │   └── QuickCommands.jsx  ← Shortcut buttons (Debug, Refactor, etc.)
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx      ← Login and signup form
│   │   │   └── ChatPage.jsx       ← Main app page
│   │   ├── hooks/
│   │   │   └── useChat.js         ← Custom hook managing chat state and logic
│   │   ├── api/
│   │   │   └── client.js          ← All fetch calls to the backend
│   │   ├── App.jsx                ← Root component and routing
│   │   └── main.jsx               ← Entry point
│   ├── index.html
│   └── package.json
│
├── backend/                       ← Node.js + Express server
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js            ← POST /api/auth/login and /register
│   │   │   ├── chat.js            ← POST /api/chat (streaming via Groq)
│   │   │   └── conversations.js   ← GET and DELETE /api/conversations
│   │   ├── middleware/
│   │   │   └── auth.js            ← JWT validation middleware
│   │   ├── db/
│   │   │   └── prisma.js          ← Prisma client instance
│   │   └── index.js               ← Express app entry point
│   ├── prisma/
│   │   └── schema.prisma          ← Database schema (User, Conversation, Message)
│   ├── .env                       ← Your secrets — never commit this file
│   ├── .env.example               ← Template showing what variables are needed
│   └── package.json
│
└── README.md
```

---

## The .env File (Backend Secrets)

```
# backend/.env
# Never push this file to GitHub

GROQ_API_KEY=gsk_your_key_here
JWT_SECRET=any_long_random_string_you_make_up_yourself
DATABASE_URL=file:./dev.db
PORT=5000
```

These values are never written in code. They are loaded at runtime using the dotenv package.

---

## Key Concepts You Will Learn

React fundamentals — components, JSX, props, state with useState, side effects with useEffect, custom hooks, and how React's rendering model works.

REST API design — clean URL routes, HTTP verbs (GET, POST, DELETE), status codes, JSON structure, and error handling.

Authentication and security — how password hashing works, what JWT tokens are and why they are used, how middleware intercepts requests to check permissions, and why secrets never go in code.

Databases and SQL — what relational databases are, how tables and foreign keys work, basic SQL queries, and how Prisma ORM abstracts this into clean JavaScript.

Streaming and real-time data — how Server-Sent Events work, why streaming feels better than waiting, and how to handle chunked data on both server and browser.

Deployment and DevOps basics — environment variables, the difference between development and production, deploying to Vercel and Render, and connecting a hosted database.

---

## Development Phases

| Phase | What you build | Key concepts |
|-------|----------------|--------------|
| 1 | React scaffold + dark JARVIS layout | Components, JSX, Vite |
| 2 | Chat UI with fake responses | useState, useEffect, props |
| 3 | Node.js + Express backend | Routing, middleware, REST API |
| 4 | Real AI via Groq with streaming | Groq SDK, SSE, async/await |
| 5 | SQLite database for chat history | Prisma, SQL, migrations |
| 6 | Login and auth with JWT | bcrypt, JWT, protected routes |
| 7 | Deploy everything live for free | Vercel, Render, Supabase |

---

## What the Finished Product Looks Like

- A dark, terminal-inspired UI with a sidebar listing all past conversations
- Messages stream in word-by-word, just like ChatGPT
- Code blocks with syntax highlighting and a one-click copy button
- Quick command buttons (Debug, Refactor, Write Tests, Explain) that pre-fill the input
- A login screen protecting your personal JARVIS
- Full conversation history saved to a database and loaded on every visit
- Deployed on a real public URL accessible from any device, anywhere in the world

---

## Switching to a Paid API Later (Optional)

When you are ready to upgrade someday, this is all that changes in your backend:

```js
// Current — Groq (free)
import Groq from "groq-sdk";
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
const model = "llama-3.3-70b-versatile";

// Future — Anthropic Claude (paid, more powerful)
import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const model = "claude-sonnet-4-5";
```

Two lines change. Everything else — all your routes, database, auth, and frontend — stays exactly the same. The skills you build are fully transferable.

---

*This is your complete project reference. Every phase is built step by step — you write the code, ask questions freely, and by the end you will have a production-grade full-stack AI application built entirely from scratch, deployed live on the internet, for zero rupees.*
