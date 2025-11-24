# Story 2.1: Context Window for Daily Input

Status: ready-for-dev

## Story

As a User,
I want to provide daily context on my mood, energy, and soreness,
so that the AI can adapt my workout plan for the day.

## Acceptance Criteria

1.  **Given** an authenticated user on the dashboard, **when** they open the "Context Window", **then** they can input their mood, energy level, and any muscle soreness.
2.  **And** this data is saved to the `daily_contexts` table for the current date.

## Tasks / Subtasks

- [ ] **Task 1: Frontend UI for Context Window** (AC: #1)
  - [ ] Create a UI for the Context Window (e.g., a modal or a dedicated section on the dashboard).
  - [ ] Implement input fields for mood, energy, and soreness.
  - [ ] Implement client-side logic to submit the context data to the backend via `POST /api/v1/daily_context`.
- [ ] **Task 2: Backend API for Daily Context** (AC: #2)
  - [ ] Create a `POST /api/v1/daily_context` endpoint in FastAPI to create or update a daily context entry. (Source: `tech-spec-epic-2.md#APIs-and-Interfaces`)
  - [ ] Create a `GET /api/v1/daily_context/{date}` endpoint to retrieve daily context. (Source: `tech-spec-epic-2.md#APIs-and-Interfaces`)
  - [ ] Implement logic to persist the data to the `daily_contexts` table in Supabase.
  - [ ] Implement Pydantic schemas for request validation.
- [ ] **Task 3: Data Model & Schema Verification** (AC: #2)
  - [ ] Verify the `daily_contexts` table schema in Supabase (`id`, `user_id`, `context_date`, `mood`, `energy`, `soreness`, `notes`). (Source: `tech-spec-epic-2.md#Data-Models-and-Contracts`)
- [ ] **Task 4: Testing** (AC: #1, #2)
  - [ ] Add Pytest integration tests for the `POST` and `GET` daily context endpoints.
  - [ ] Add React Testing Library tests for the Context Window component.
  - [ ] Add a Playwright E2E test for opening the Context Window, submitting data, and verifying it's saved.

## Dev Notes

This story introduces the mechanism for users to provide daily feedback, which is crucial for the AI to generate adaptive workout plans.

-   **Architecture**: This feature will be built on the existing Next.js frontend and FastAPI backend. It introduces a new `daily_contexts` table in the Supabase database.
-   **Source Components**:
    -   **Backend**: `app/api/v1/daily_context.py` (new module), `app/schemas/daily_context.py` (new schemas).
    -   **Frontend**: New `Context Window Module` components and logic.
-   **Testing**: E2E testing is important to ensure the data flows correctly from the UI to the database.

### Project Structure Notes

-   A new file `daily_context.py` will be created in `backend/app/api/v1`.
-   A new file `daily_context.py` will be created in `backend/app/schemas`.
-   New components for the Context Window will be created in the frontend.

### Learnings from Previous Story

**From Story 1.5: User Profile Management (Status: ready-for-dev)**

-   **Architectural Foundation:** Confirmed use of Supabase Auth for identity management, FastAPI for backend API, and Next.js for frontend. Data persistence in Supabase `users` table. This story will add a new table `daily_contexts`.
-   **Component Structure:** Established patterns for API endpoints (`app/api/v1/`) and frontend module organization. This story will create a new API module.
-   **Pydantic Schemas:** Understanding of using Pydantic for request/response validation is applicable.
-   **Testing Patterns:** Continue to follow Pytest for backend and Playwright for E2E tests.

### References

-   [Source: `docs/epics.md#Story-2.1:-Context-Window-for-Daily-Input`]
-   [Source: `docs/sprint-artifacts/tech-spec-epic-2.md#APIs-and-Interfaces`]
-   [Source: `docs/sprint-artifacts/tech-spec-epic-2.md#Data-Models-and-Contracts`]
-   [Source: `docs/architecture.md#Data-Architecture`]

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/2-1-context-window-for-daily-input.context.xml`

### Agent Model Used

Gemini CLI

### Debug Log References

### Completion Notes List

### File List

## Change Log

- 2025-11-24: Initial draft created by Gemini CLI.
