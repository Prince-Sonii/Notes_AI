# 📝 Notes AI — Intelligent Note-Taking Platform

> A full-stack web application that combines traditional note management with AI-powered semantic search, enabling users to find notes by meaning rather than exact keywords.

---

## 🧠 What Makes This Different?

Most note-taking apps rely on simple keyword matching. **Notes AI** uses sentence-level embeddings from Hugging Face's transformer models to understand the *context* behind your notes. For example, if you write a note about "eggs, milk, bread," you can later search for "breakfast items" and the system will surface that note — even though the word "breakfast" never appeared.

## ✨ Key Capabilities

| Feature | Description |
|---|---|
| **Semantic Search** | Leverages `sentence-transformers/all-MiniLM-L6-v2` via Hugging Face Inference API to match notes by meaning |
| **User Authentication** | Secure signup/login with Spring Security so each user's notes remain private |
| **Full CRUD** | Create, view, update, and delete notes through a clean dashboard interface |
| **Responsive Design** | Glass-morphism UI with CSS animations that works across devices |
| **Containerized Deployment** | Single-command setup using Docker Compose (PostgreSQL + Backend + Frontend) |

---

## 🏗️ Architecture Overview

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│   React UI   │──────▶│  Spring Boot API │──────▶│  PostgreSQL  │
│  (Vite Dev)  │ Axios │  (Port 8080)     │  JPA  │  (Port 5432) │
└──────────────┘       │                  │       └──────────────┘
                       │  ┌────────────┐  │
                       │  │  AI Layer  │  │
                       │  │ (WebFlux)  │──────────▶ Hugging Face API
                       │  └────────────┘  │
                       └──────────────────┘
```

### Frontend Stack
- **React 19** bootstrapped with Vite 7
- **React Router DOM** for client-side routing (Landing → Login → Register → Dashboard)
- **Axios** for HTTP communication with the backend
- **SweetAlert2** for confirmation dialogs and **React Hot Toast** for notifications
- **React Icons** for iconography
- Custom CSS with variables, keyframe animations, and glass-morphism effects

### Backend Stack
- **Java 21** with **Spring Boot 3.4.0**
- **Spring Data JPA** for ORM and database operations
- **Spring Security** for authentication and route protection
- **Spring WebFlux** (`WebClient`) for non-blocking calls to the Hugging Face embedding API
- **spring-dotenv** for loading environment variables from `.env` files

### Data & AI Layer
- **PostgreSQL 15** as the primary relational database
- **Hugging Face Inference API** with the `all-MiniLM-L6-v2` sentence-transformer model
- In-memory vector store (Java `HashMap`) for fast cosine similarity lookups during search

---

## 📂 Repository Layout

```
notes-app/
│
├── backend/                          # Spring Boot REST API
│   ├── src/main/java/com/notes/web/app/
│   │   ├── config/                   # SecurityConfig, DataInitializer
│   │   ├── controller/               # AuthController, NoteController
│   │   ├── dto/                      # ErrorResponse and data transfer objects
│   │   ├── entity/                   # User, Note JPA entities
│   │   ├── exception/                # GlobalExceptionHandler
│   │   ├── repository/               # UserRepository, NoteRepository
│   │   └── service/                  # NoteService, AIService, CustomUserDetailsService
│   ├── src/main/resources/
│   │   └── application.properties    # DB config, server settings
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/                         # React SPA
│   ├── src/
│   │   ├── api/axiosConfig.js        # Axios base URL and interceptors
│   │   ├── components/AuthModal.jsx  # Reusable auth modal component
│   │   ├── pages/                    # Landing, Login, Register, Dashboard
│   │   ├── App.jsx                   # Route definitions
│   │   ├── App.css                   # Global styles and animations
│   │   └── main.jsx                  # React entry point
│   ├── Dockerfile
│   ├── vite.config.js
│   └── package.json
│
├── docker-compose.yml                # Orchestrates all three services
└── README.md
```

---

## 🚀 Local Development Setup

### What You'll Need

- **JDK 21** — [Download from Adoptium](https://adoptium.net/)
- **Node.js ≥ 16** — [Download from nodejs.org](https://nodejs.org/)
- **PostgreSQL** — running locally or via Docker
- **Hugging Face API Token** — [Generate one here (free)](https://huggingface.co/settings/tokens)

### Step 1 — Prepare the Database

Launch `psql` or pgAdmin and create a fresh database:

```sql
CREATE DATABASE notes_db;
```

> Spring Boot's `ddl-auto=update` setting will auto-generate all tables on first run — no migration scripts needed.

### Step 2 — Start the Backend

```bash
cd backend
```

Create a `.env` file alongside `pom.xml`:

```
HUGGINGFACE_API_KEY=hf_your_token_here
```

If your PostgreSQL credentials differ from the defaults (`postgres` / `password`), update them in `src/main/resources/application.properties`.

Then start the server:

```bash
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`. On first launch, the `DataInitializer` component processes any existing notes and generates their embeddings — this may take a few seconds.

### Step 3 — Start the Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed in your terminal (typically `http://localhost:5173`).

---

## 🐳 Docker Compose (One-Command Deploy)

If you prefer containerized deployment, the included `docker-compose.yml` handles everything.

**1.** Create a `.env` file in the project root:

```
HUGGINGFACE_API_KEY=hf_your_token_here
```

**2.** Build and start all services:

```bash
docker-compose up --build
```

This spins up three containers:
- **PostgreSQL 15** (Alpine) with persistent volume storage
- **Spring Boot backend** connected to the DB container
- **React frontend** served via Nginx

**3.** Access the application:

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |

**4.** Tear down:

```bash
docker-compose down
```

---

## 🔍 Using Semantic Search

1. **Add some notes** — try topics like "Meeting notes: discuss Q3 budget and hiring plan" and "Shopping: rice, lentils, vegetables"
2. **Open the search bar** on the Dashboard
3. **Type a conceptual query** — for instance:
   - Searching **"groceries"** should surface the shopping note
   - Searching **"work planning"** should match the meeting note
   - This works because the AI model understands meaning, not just exact word overlap

---

## 🔧 Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| Search returns nothing or "not ready" | AI embeddings haven't finished loading | Wait for the backend log `AI Initialization Complete` |
| 401 / 403 on search | Invalid or missing Hugging Face token | Verify `.env` has a valid `hf_` prefixed key with no extra spaces |
| Database connection refused | PostgreSQL service isn't running | Start PostgreSQL and confirm credentials in `application.properties` |
| Frontend can't reach backend | CORS or wrong base URL | Check `axiosConfig.js` base URL matches the running backend port |

---

## 📌 Design Decisions & Trade-offs

1. **In-Memory Vector Storage** — Embeddings are held in a Java `HashMap` rather than a dedicated vector database. This simplified the initial implementation but means that all vectors are regenerated on every server restart via `DataInitializer`. Acceptable for a personal-scale app with hundreds of notes, but not suitable for large-scale production.

2. **External API Dependency** — Semantic search relies on the Hugging Face Inference API, so an active internet connection is required. If the API is unreachable, the system degrades to basic keyword matching.

3. **Single-Instance Assumption** — Because the vector store lives in process memory, running multiple backend replicas would lead to inconsistent search results. Horizontal scaling would require migrating to a shared vector store.

4. **English-Optimized** — The `all-MiniLM-L6-v2` model performs best with English text. Other languages may produce less accurate semantic matches.

---

## 🛣️ Potential Enhancements

- **pgvector Integration** — Store embeddings directly in PostgreSQL using the `pgvector` extension, eliminating the in-memory limitation and enabling persistence across restarts.
- **Local Model Inference** — Run the transformer model locally via ONNX Runtime to remove the external API dependency and reduce latency.
- **Rich Text Editing** — Integrate a library like Quill or TipTap to support formatted notes with headings, lists, and code blocks.
- **JWT + OAuth2** — Replace session-based auth with stateless JWT tokens and add social login (Google, GitHub) for streamlined onboarding.
- **Resilience Patterns** — Add a circuit breaker (e.g., Resilience4j) around the Hugging Face API calls to gracefully handle rate limits and outages.

---

