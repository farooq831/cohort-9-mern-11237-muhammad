# Notes App

A full-stack notes application built with the MERN-adjacent stack (MongoDB, Express, React, Node.js). Users can sign up, log in, and create, edit, organize, and delete personal notes — with rich text formatting, categories, pinning, and export/import support.

Built as part of the 10Pearls internship program.

---

## Features

- **Authentication** — signup, login, logout with JWT-based sessions and bcrypt password hashing
- **Notes CRUD** — create, read, update, and delete notes, each scoped to the logged-in user only
- **Rich text editing** — bold, italic, headings, bullet/numbered lists, and blockquotes via a Tiptap-based editor
- **Categories & pinning** — organize notes into General, Ideas, or Tasks, and pin important ones to the top
- **Search, filter, and sort** — find notes by keyword, filter by category or pinned status, sort by newest/oldest/title
- **Export & Import** — download all notes as a JSON file, or re-import them later
- **Light/dark theme** — toggle and persisted across sessions
- **Structured logging** — every request and key event logged via Pino
- **Centralized error handling** — consistent error responses across the API
- **Automated tests** — Mocha/Chai/Supertest backend test suite
- **Code quality & security scanning** — SonarCloud integration, CodeRabbit automated PR reviews

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Axios, Tiptap, lucide-react |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | JSON Web Tokens (JWT), bcrypt |
| Logging | Pino, pino-http |
| Testing | Mocha, Chai, Supertest |
| Code Quality | SonarCloud, CodeRabbit |

---

## Project Structure

```
cohort-9-mern-11237-muhammad/
├── backend/
│   ├── src/
│   │   ├── config/          # database connection
│   │   ├── controllers/     # request handling
│   │   ├── services/        # business logic
│   │   ├── models/          # Mongoose schemas (User, Note)
│   │   ├── routes/          # API route definitions
│   │   ├── middleware/      # auth, logging, error handling, sanitization
│   │   ├── utils/           # logger, JWT helpers, validators, AppError
│   │   └── app.js           # app entry point
│   ├── tests/                # automated test suite
│   └── sonar-project.properties
├── frontend/
│   ├── src/
│   │   ├── components/      # reusable UI (Layout, NoteCard, NoteEditor, modals)
│   │   ├── pages/            # Login, Signup, Dashboard
│   │   ├── context/          # Auth state, Theme state
│   │   └── services/         # API call wrappers
│   └── vite.config.js
├── SonarQubeReport/           # code quality & security analysis report
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- MongoDB running locally, or a MongoDB Atlas connection string
- npm

### 1. Clone the repository

```bash
git clone https://github.com/10pshine-cohort-9/cohort-9-mern-11237-muhammad.git
cd cohort-9-mern-11237-muhammad
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env` with your actual values:

```
PORT=5000
NODE_ENV=development
LOG_LEVEL=info

MONGO_URI=mongodb://localhost:27017/notes_app
MONGO_TEST_URI=mongodb://localhost:27017/notes_app_test

JWT_SECRET=your_own_long_random_string
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:3000
```

Run the backend:

```bash
npm start        # production mode
npm run dev      # development mode with auto-restart (nodemon)
```

Run the test suite:

```bash
npm test
```

### 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

Fill in `.env`:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

Run the frontend:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`. Make sure the backend is running at the same time.

---

## API Overview

All endpoints are prefixed with `/api`.

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/signup` | Create a new account |
| POST | `/auth/login` | Log in and receive a JWT |
| POST | `/auth/logout` | Log out (client discards token) |

### Notes *(all require `Authorization: Bearer <token>`)*

| Method | Endpoint | Description |
|---|---|---|
| GET | `/notes` | List the logged-in user's notes |
| GET | `/notes/:id` | Get a single note |
| POST | `/notes` | Create a note |
| PUT | `/notes/:id` | Update a note |
| DELETE | `/notes/:id` | Delete (soft-delete) a note |
| GET | `/notes/export` | Export all notes as JSON |
| POST | `/notes/import` | Import notes from a JSON payload |

### Health

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Server health check |

---

## Security

- Passwords hashed with bcrypt, never stored in plain text
- JWT-based authentication, tokens verified on every protected route
- All request bodies sanitized to strip MongoDB operator injection attempts (NoSQL injection protection)
- Rich text content sanitized server-side (allowlist of safe HTML tags only) before storage, to prevent stored XSS
- CORS restricted to a configured frontend origin
- `X-Powered-By` header disabled to avoid framework fingerprinting
- Sensitive fields (password hash) excluded from default database queries

See `SonarQubeReport/` for the full code quality and security analysis.

---

## Git Workflow

This project follows a fork-based Git workflow:

1. Fork the org repository
2. Sync `develop` from upstream before starting new work
3. Branch off `develop` for each feature (`feature/backend/...`, `feature/frontend/...`)
4. Open a Pull Request from the fork into the org repo's `develop` branch
5. CodeRabbit automatically reviews every PR
6. A mentor reviews and merges after CI/review checks pass

---

## License

This project was built for educational purposes as part of the 10Pearls internship program.