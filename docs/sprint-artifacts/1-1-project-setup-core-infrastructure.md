# Story 1.1: Project Setup & Core Infrastructure

Status: ready-for-dev

## Story

As a developer,
I want to initialize the project with the specified tech stack,
So that I can begin developing features on a solid foundation.

## Acceptance Criteria

1. Given the project is new and empty
2. When I execute the `npx create-next-app@latest my-ai-trainer --typescript --tailwind --eslint --app --src-dir` command
3. Then a Next.js project structure is created in `apps/web`
4. And `apps/api` (FastAPI) directory is created as a peer to `apps/web`
5. And basic `.gitignore` and `README.md` files are present
6. And `package.json` reflects a monorepo setup
7. And `Next.js` and `FastAPI` are installed as part of the monorepo

## Tasks / Subtasks

- [ ] **Initialize Next.js Project (`apps/web`)**
  - [ ] Execute `npx create-next-app@latest my-ai-trainer --typescript --tailwind --eslint --app --src-dir` in the project root.
  - [ ] Verify `apps/web` directory is created with Next.js project structure.
  - [ ] **Testing:** Verify `apps/web/tests` directory exists and basic testing setup (Jest, React Testing Library, Playwright) is configured. [Source: docs/architecture.md#Decision Summary - Testing]

- [ ] **Create FastAPI Project (`apps/api`)**
  - [ ] Create `apps/api` directory as a peer to `apps/web`.
  - [ ] Initialize a Python virtual environment within `apps/api`.
  - [ ] Install FastAPI and Uvicorn.
  - [ ] Create a basic `main.py` (e.g., with a simple "Hello World" endpoint).
  - [ ] **Testing:** Verify `apps/api/tests` directory exists and basic testing setup (e.g., pytest) is configured. [Source: docs/architecture.md#Decision Summary - Testing]

- [ ] **Configure Monorepo `package.json`**
  - [ ] Update root `package.json` to reflect monorepo structure (e.g., using `workspaces` for npm/yarn or `pnpm-workspace.yaml` for pnpm).
  - [ ] Configure scripts to run commands in both `apps/web` and `apps/api` (e.g., `npm run dev:web`, `npm run dev:api`).

- [ ] **Initial `.gitignore` and `README.md`**
  - [ ] Create/update root `.gitignore` to ignore common development artifacts (`node_modules`, `.next`, `__pycache__`, `.venv`).
  - [ ] Create/update root `README.md` with basic project information and setup instructions.

- [ ] **Initial Project Build and Run Verification**
  - [ ] Successfully run `npm install` in the root.
  - [ ] Successfully start the Next.js development server.
  - [ ] Successfully start the FastAPI development server.
  - [ ] **Testing:** Run initial provided tests for both frontend and backend to confirm basic setup. [Source: docs/architecture.md#Development Environment - Setup Commands]


## Dev Notes

### Project Setup and Infrastructure

*   **Next.js Frontend:** Initialize using `npx create-next-app@latest` command as specified in `docs/architecture.md`. Use `--typescript`, `--tailwind`, `--eslint`, `--app`, and `--src-dir` flags.
*   **FastAPI Backend:** Manually create `apps/api` directory. Install FastAPI and Uvicorn.
*   **Monorepo:** Configure `package.json` to manage `apps/web` and `apps/api`.
*   **Testing Frameworks:** Set up Jest, React Testing Library, and Playwright for the frontend, and pytest for the backend, as per `docs/architecture.md`.

### Project Structure Notes

*   **Monorepo Structure:** The project will adhere to the monorepo structure outlined in `docs/architecture.md`, with `apps/web` and `apps/api` as main packages.
*   **No Conflicts Detected:** This is the initial project setup, so no conflicts with existing structure are anticipated.

### References

*   [Source: docs/architecture.md#Project Initialization]
*   [Source: docs/architecture.md#Decision Summary]
*   [Source: docs/architecture.md#Project Structure]
*   [Source: docs/architecture.md#Implementation Patterns]
*   [Source: docs/epics.md#Story 1.1: Project Setup & Core Infrastructure]

### Dev Agent Record

### Context Reference

- [Story Context XML: docs/sprint-artifacts/1-1-project-setup-core-infrastructure.context.xml]

### Agent Model Used

Gemini CLI Agent vX.X

### Debug Log References

### Completion Notes List

### File List

### Change Log
- **2025-12-04**: Story drafted by Bob (Scrum Master AI Agent). Initial scope derived from `epics.md` and `architecture.md`.


### Requirements Context Summary for Story 1.1: Project Setup & Core Infrastructure

**Epic:** Epic 1: Core Platform & User Foundation
_Establishes the foundational infrastructure, user authentication, and conversational onboarding to enable basic user interaction and personalization._

**User Story:**
As a developer,
I want to initialize the project with the specified tech stack,
So that I can begin developing features on a solid foundation.

**Acceptance Criteria:**
*   Given the project is new and empty
*   When I execute the `npx create-next-app@latest my-ai-trainer --typescript --tailwind --eslint --app --src-dir` command
*   Then a Next.js project structure is created in `apps/web`
*   And `apps/api` (FastAPI) directory is created as a peer to `apps/web`
*   And basic `.gitignore` and `README.md` files are present
*   And `package.json` reflects a monorepo setup
*   And `Next.js` and `FastAPI` are installed as part of the monorepo

**Key Architectural Information:**
*   **Frontend Framework:** Next.js (with App Router)
*   **Backend Framework:** FastAPI (version 0.123.7)
*   **Language:** TypeScript (for frontend)
*   **Styling:** Tailwind CSS
*   **Linting:** ESLint
*   **Project Structure:** Monorepo (`my-ai-trainer/apps/web` for Next.js, `my-ai-trainer/apps/api` for FastAPI).

---

### Project Structure Alignment & Lessons Learned

**Previous Story Learnings:** First story in epic - no predecessor context.

**Unified Project Structure Alignment:** No `unified-project-structure.md` available to cross-reference.

**Initial Project Structure Notes:**
*   The project will be a monorepo with `apps/web` for the Next.js frontend and `apps/api` for the FastAPI backend.
*   The `npx create-next-app` command will establish the `apps/web` structure.
*   The `apps/api` directory needs to be created manually as a peer to `apps/web`, and FastAPI installed within it.

---
