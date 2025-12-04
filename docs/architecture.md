# Architecture

## Executive Summary

This document outlines the architecture for the AI-Powered Personal Training Advisor. It defines a modern, scalable, and robust technology stack designed to support the project's unique requirements, including a conversational AI engine, real-time feedback, and integrated music features. The architecture is centered around a decoupled frontend (Next.js) and backend (FastAPI), with Supabase providing the data and authentication layers. This approach ensures a clear separation of concerns, enabling efficient development and future scalability. Key decisions and implementation patterns are explicitly documented to ensure consistency across all development efforts, particularly when executed by multiple AI agents.

## Project Initialization

The first implementation story should be to initialize the project by executing the following command in the terminal. This will create the foundational structure of the web application.

```bash
npx create-next-app@latest my-ai-trainer --typescript --tailwind --eslint --app --src-dir
```

Using this starter template automatically makes several key architectural decisions, establishing a consistent and modern technology base:

-   **Framework**: Next.js (with App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Linting**: ESLint
-   **Build Tool**: Next.js CLI (Turbopack/Webpack)
-   **Project Structure**: Standard Next.js App Router with a `/src` directory.


This is a great starting point that follows industry best practices and will significantly speed up development.

Great! I've analyzed your requirements and found that we have a few more technical choices to make.

Don't worry - I'll guide you through each one and explain why it matters. The starter template we chose handles the frontend foundation, but we still need to decide on the backend and how different parts of the system will talk to each other.

We will work through the following decisions together:

1.  **Backend Framework:** The engine that will power your AI features.
2.  **Database:** Where all user and workout data will be stored.
3.  **Authentication:** How users will securely log in.
4.  **State Management:** How the application keeps track of information as users interact with it.
5.  **Testing:** How we ensure everything works correctly.

## Decision Summary

| Category | Decision | Version | Affects Epics | Rationale |
| -------- | -------- | ------- | ------------- | --------- |
| API Pattern | FastAPI | 0.123.7 | AI Planning, Workout Logging, All Backend Services | Recommended in proposal; Excellent for AI/ML integration and high performance. |
| Data Persistence | Supabase (PostgreSQL) | 2.86.0 | All data-related features | Provides a managed PostgreSQL database, simplifying setup and scaling. Also includes Auth and Storage. |
| Authentication | Supabase Auth | 2.86.0 | User Onboarding, Security | Tightly integrated with our chosen database provider (Supabase), offering a seamless solution for handling logins with Google and Email/Password. |
| State Management | Zustand | 5.0.9 | All interactive frontend features | A lightweight, simple, and powerful state management solution that is easy to learn and integrates well with React/Next.js. |
| Testing | Jest, React Testing Library, Playwright | 30.2.0, 16.3.0, 1.57.0 | All Features | Provides a comprehensive, industry-standard testing stack for a Next.js application, covering everything from individual units to full end-to-end user flows. |

## Project Structure

The project will be a monorepo containing two main packages: one for the Next.js frontend and one for the FastAPI backend. The `create-next-app` command with the `--src-dir` flag will establish the initial frontend structure.

```
my-ai-trainer/
├── apps/
│   ├── web/                     # Next.js Frontend
│   │   ├── src/
│   │   │   ├── app/             # App Router: pages, layouts, components
│   │   │   ├── components/      # Shared UI components
│   │   │   ├── lib/             # Helper functions, utilities
│   │   │   ├── store/           # Zustand state management stores
│   │   │   └── styles/          # Global styles
│   │   ├── public/              # Static assets (images, fonts)
│   │   ├── tests/               # Jest/Playwright tests
│   │   ├── next.config.js
│   │   └── ...
│   └── api/                     # FastAPI Backend
│       ├── app/
│       │   ├── api/             # API endpoints/routers
│       │   ├── core/            # Config, security
│       │   ├── services/        # Business logic
│       │   └── models.py        # Pydantic models
│       ├── tests/
│       └── main.py
├── packages/
│   └── ui/                      # (Optional) Shared UI component library
└── package.json
```

## FR Category to Architecture Mapping

-   **Frontend (Next.js `web` app):** Responsible for all user-facing features.
    -   Handles: Onboarding, Workout Player UI, Dashboard, Settings, User Profile UI, Context Window.
    -   Manages all UI state with Zustand.
    -   Communicates with the backend via REST API calls.

-   **Backend (FastAPI `api` app):** Responsible for all business logic, data processing, and AI integration.
    -   Handles: AI Daily-Plan Generation, Workout Log storage/retrieval, User Authentication logic, Spotify API communication.
    -   Interacts directly with the Supabase (PostgreSQL) database.
    -   Provides the REST API for the frontend.

## Implementation Patterns

These patterns ensure consistent implementation across all AI agents:

### Error Handling & Logging

-   **Graceful Recovery:** If an error occurs, the app should handle it gracefully without crashing. In the frontend, we will use **React Error Boundaries** to display a user-friendly message instead of a broken screen.
-   **Standard API Errors:** The FastAPI backend will return errors in a consistent JSON format, allowing the frontend to understand what went wrong.
-   **Structured Logging:** We will use **structured JSON logging** sent to the console. This provides a clean and machine-readable log of events and errors, which is invaluable for debugging.

### API Response Format

To ensure the frontend and backend communicate predictably, all API responses will follow a standard format:

-   **Success:** `{"data": { ... }}`
-   **Error:** `{"error": {"message": "A description of the error.", "code": "ERROR_CODE"}}`

### Date & Time Handling

To avoid timezone issues, we will follow a strict rule:

-   **Backend/Database:** All dates and times will be stored in **UTC**.
-   **Frontend:** The user's browser will be responsible for converting UTC times to their local timezone for display. We will use the `date-fns` library to handle these conversions reliably.

## Novel Architectural Patterns

Your project includes a unique feature that requires a custom architectural pattern. This isn't just picking a technology, but defining how a core piece of your app's "magic" will work.

### Pattern: Adaptive Workout Dialogue

This pattern formalizes the conversational loop between the user and the AI, ensuring the AI's adaptations are transparent, effective, and continuously learning.

**Purpose:** To move beyond static plan generation and create a dynamic, two-way conversation where the user's daily context directly and transparently shapes their workout.

**Components:**
1.  **Context Window (Frontend):** The UI where the user inputs their daily qualitative feedback (mood, energy, soreness, etc.).
2.  **AI Orchestrator (Backend):** A service in the FastAPI backend that receives the user's context, fuses it with their profile and history, and constructs the prompt for the AI model.
3.  **AI Model (OpenAI API):** The external Large Language Model that generates the workout plan and adaptation suggestions.
4.  **Plan Review UI (Frontend):** The screen where the user sees the proposed (and potentially modified) plan and the AI's reasoning.
5.  **Feedback Loop (Backend):** A mechanism to store the user's acceptance or rejection of suggestions, feeding that data back into future prompts.

**Data Flow:**
1.  User submits context (e.g., "Feeling low energy") via the **Context Window**.
2.  The **AI Orchestrator** combines this with recent workout data and goals, then sends a detailed prompt to the **AI Model**.
3.  The **AI Model** returns a structured JSON plan *and* a human-readable explanation for any changes (e.g., "Because you're low on energy, I've reduced volume by 10%...").
4.  The **Plan Review UI** displays both the adjusted plan and the AI's explanation.
5.  If the user accepts, the plan is confirmed. If they edit or reject a change, this feedback is captured by the **Feedback Loop** to refine future suggestions.

This pattern is critical for making the AI feel like a true, listening companion.

### Pattern: AI-Driven Music Matching ("Smart Radio")

This pattern defines a system that learns from user behavior to create personalized, phase-aware workout playlists, moving beyond simple BPM matching.

**Purpose:** To create a "Smart Radio" experience that feels like a DJ is personally curating a soundtrack for the user's workout, enhancing motivation and flow state.

**Components:**
1.  **Music Source (Spotify API):** Provides access to the user's listening history, playlists, and a vast library of tracks.
2.  **Master Lists (Database):** Large, persistent playlists of candidate tracks for each workout phase (Warm-up, Main, Cooldown), stored in the database.
3.  **AI Music Scorer (Backend):** A service that ranks tracks in the Master Lists based on BPM, audio features (energy, danceability), and user feedback signals.
4.  **Session Playlist Generator (Backend):** A service that queries the ranked Master Lists to build a "Session Playlist" for the upcoming workout.
5.  **Pre-Workout Review UI (Frontend):** A screen where the user can see, approve, and make minor edits to the generated Session Playlist.
6.  **Playback Feedback Loop (Frontend/Backend):** A system that captures in-workout user actions (e.g., skipping a track) and translates them into negative signals for the AI Music Scorer.

**Data Flow:**
1.  The **AI Music Scorer** asynchronously seeds the **Master Lists** using the user's Spotify history and preferences.
2.  Before a workout, the **Session Playlist Generator** selects the highest-scoring tracks from the Master Lists that match the workout's phases.
3.  The proposed playlist is displayed on the **Pre-Workout Review UI**.
4.  During the workout, if the user skips a track within the first 30 seconds, the **Playback Feedback Loop** sends a "soft delete" signal. The track is removed from the current session and its score is lowered in the Master List.
5.  If a user manually removes a track from the review screen, it's a "hard delete," and the track is permanently removed from the Master List.
6.  The **AI Music Scorer** continuously re-ranks tracks based on this feedback, ensuring playlists get smarter over time.

This pattern allows the music to adapt not just to the workout's intensity, but to the user's unique and evolving taste.


## Consistency Rules

### Naming Conventions

To ensure consistency and prevent conflicts, all agents MUST adhere to the following naming conventions:

-   **API Routes:** `kebab-case`, plural (e.g., `/workout-plans`). Route parameters use curly braces (e.g., `/users/{userId}`).
-   **Database Tables:** `PascalCase`, plural (e.g., `WorkoutPlans`).
-   **Database Columns:** `snake_case` (e.g., `user_id`, `created_at`).
-   **React Components:** `PascalCase` for files and components (e.g., `WorkoutPlayer.tsx`).
-   **CSS/Styled Components:** `camelCase` for variables and `kebab-case` for classes where applicable.
-   **Event Names:** `domain:event` (e.g., `workout:completed`).

### Code Organization

-   **Testing:** Test files will be co-located with the source files they are testing, using a `*.test.ts` or `*.spec.ts` suffix. End-to-end tests will live in a separate `tests` directory at the root of the `web` and `api` packages.
-   **Shared Code:** Cross-cutting utilities or types will be placed in a `lib` or `utils` directory at the appropriate level (e.g., `apps/web/src/lib`).

### Error Handling

-   **Frontend:** Use **React Error Boundaries** to wrap major UI sections.
-   **Backend:** Global error handling middleware in FastAPI will catch exceptions and format them into the standard `{"error": ...}` response.

### Logging Strategy

-   **Level:** Default log level will be `INFO`.
-   **Format:** Structured JSON to the console.
-   **Content:** Logs should include a timestamp, level, message, and any relevant context (e.g., `userId`, `traceId`).

## Data Architecture

-   **Data Models:** Based on the ERD in the project proposal. Key models include `Users`, `Goals`, `WorkoutPlans`, `WorkoutLogs`, and `Integrations`.
-   **Relationships:** Foreign keys will be used to establish clear relationships (e.g., `WorkoutLogs` will have a `user_id` and `plan_id`).
-   **ORM:** We will use **Prisma** as the Object-Relational Mapper to provide a type-safe interface between our FastAPI backend and the PostgreSQL database. This was implicitly decided by the choice of a modern, full-stack architecture.

## API Contracts

-   **Specification:** We will use the **OpenAPI** standard to define our REST API. FastAPI will automatically generate the OpenAPI specification from the Python code.
-   **Versioning:** The API will be versioned in the URL (e.g., `/api/v1/...`).
-   **Authentication:** All protected endpoints will expect a `Bearer` token in the `Authorization` header, provided by Supabase Auth.

## Security Architecture

-   **Authentication:** Handled by **Supabase Auth**.
-   **Authorization:** Row Level Security (RLS) will be enabled in PostgreSQL to ensure users can only access their own data.
-   **Secrets Management:** API keys and other secrets will be managed via environment variables and will not be checked into source control.
-   **Input Validation:** All incoming data to the API will be validated using **Pydantic** models in FastAPI.

## Performance Considerations

-   **Frontend:**
    -   **Code Splitting:** Next.js will automatically handle code splitting on a per-page basis.
    -   **Lazy Loading:** Components or libraries not needed for the initial render will be lazy-loaded.
    -   **Image Optimization:** Next.js Image component will be used to optimize images.
-   **Backend:**
    -   **Asynchronous Operations:** FastAPI is asynchronous by default, which is highly performant for I/O-bound tasks.
    -   **Database Indexing:** Proper indexes will be added to the PostgreSQL database for frequently queried columns.

## Deployment Architecture

-   **Frontend (Next.js):** Deployed to **Vercel**. Vercel is the creator of Next.js and provides a seamless, Git-based deployment workflow with automatic CI/CD.
-   **Backend (FastAPI):** Deployed as a containerized application to **Fly.io** or **Render**. This provides a cost-effective, scalable, and easy-to-manage environment for the API.
-   **Database (Supabase):** This is a managed service, so no deployment is necessary.

## Coherence Validation

The architectural decisions outlined in this document have been reviewed for compatibility, completeness, and coverage of all project requirements.

-   **Technology Stack:** The chosen technologies (Next.js, FastAPI, Supabase, etc.) are compatible and represent a modern, robust stack.
-   **Requirement Coverage:** All Functional and Non-Functional Requirements from the PRD are supported by this architecture.
-   **Pattern Integrity:** The defined implementation and novel patterns provide a solid and consistent foundation for development.

No major conflicts or gaps have been identified. The architecture is coherent and ready for implementation.

## Development Environment

### Prerequisites

-   Node.js (v20.x or later)
-   Python (v3.11 or later)
-   Docker (for local PostgreSQL instance if not using Supabase cloud)
-   Vercel CLI
-   Fly.io or Render CLI

### Setup Commands

```bash
# Clone the repository
git clone <repository_url>
cd <repository_name>

# Install frontend dependencies
cd apps/web
npm install

# Install backend dependencies
cd ../api
pip install -r requirements.txt
```

## Architecture Decision Records (ADRs)

This section captures the most critical architectural decisions made for this project.

-   **ADR-001: Web Framework Selection**
    -   **Decision:** Use Next.js with the App Router.
    -   **Rationale:** Provides a best-in-class React framework with SSR, SSG, and a strong ecosystem. The App Router enables modern, server-centric patterns.
-   **ADR-002: Backend Framework Selection**
    -   **Decision:** Use FastAPI (Python).
    -   **Rationale:** Excellent performance and native support for Python's extensive AI/ML ecosystem, which is critical for the core features of this project.
-   **ADR-003: Database and Auth Provider**
    -   **Decision:** Use Supabase as the provider for both the PostgreSQL database and authentication.
    -   **Rationale:** Simplifies the architecture by bundling a managed database, authentication, and file storage into a single, cohesive service. Provides a strong foundation for rapid development.
-   **ADR-004: State Management**
    -   **Decision:** Use Zustand for frontend state management.
    -   **Rationale:** A lightweight and simple solution that avoids the boilerplate of more complex state managers while being powerful enough for the application's needs.
-   **ADR-005: Testing Strategy**
    -   **Decision:** Adopt a three-tiered approach with Jest/React Testing Library for unit/integration tests and Playwright for end-to-end tests.
    -   **Rationale:** Provides comprehensive test coverage across the entire application stack, ensuring reliability and maintainability.

---

_Generated by BMAD Decision Architecture Workflow v1.0_
_Date: 2025-12-04_
_For: BIP_
