# Story 2.3: Display Daily Workout Plan

Status: drafted

## Story

As a User,
I want to see my generated daily workout plan on the dashboard,
so that I can review it and start my workout.

## Acceptance Criteria

1.  **Given** a workout plan has been generated for the day, **when** the user views their dashboard, **then** the workout plan is displayed in a clear and easy-to-understand format.

## Tasks / Subtasks

- [ ] **Task 1: Frontend UI for Workout Plan Display** (AC: #1)
  - [ ] Create a UI component to render the daily workout plan effectively on the dashboard.
  - [ ] Implement client-side logic to fetch the workout plan using `GET /api/v1/workout_plans/{date}`.
  - [ ] Ensure the display format is clear, readable, and includes all necessary plan details (exercises, sets, reps, weight, RPE, rest).
- [ ] **Task 2: Backend API for Workout Plan Retrieval** (AC: #1)
  - [ ] Ensure the `GET /api/v1/workout_plans/{date}` endpoint in FastAPI correctly retrieves the AI-generated workout plan from the `workout_plans` table. (Source: `tech-spec-epic-2.md#APIs-and-Interfaces`)
- [ ] **Task 3: Testing** (AC: #1)
  - [ ] Add React Testing Library tests for the Workout Plan Display component.
  - [ ] Add Pytest integration tests for the `GET /api/v1/workout_plans/{date}` endpoint.
  - [ ] Add a Playwright E2E test for navigating to the dashboard and verifying the workout plan is displayed correctly after generation.

## Dev Notes

This story focuses on presenting the AI-generated workout plan to the user in an understandable and actionable format.

-   **Architecture**: Leverages the existing Next.js frontend and FastAPI backend. It consumes the `plan_json` from the `workout_plans` table. Client-side state management with React Query or similar will be beneficial for fetching.
-   **Source Components**:
    -   **Backend**: `app/api/v1/workout_plans.py` (existing endpoint, ensure retrieval functionality).
    -   **Frontend**: New `Workout Plan Display Module` components and logic.
-   **Testing**: UI testing for readability and correctness of the displayed plan, and integration testing for data retrieval.

### Project Structure Notes

-   New components for the Workout Plan Display will be created in the frontend.
-   `backend/app/api/v1/workout_plans.py` will be updated/verified for retrieval.

### Learnings from Previous Story

**From Story 2.2: AI Daily Plan Generation (Status: ready-for-dev)**

-   **Architectural Foundation:** Confirmed use of FastAPI for backend API, Next.js for frontend, and Supabase for data persistence. This story consumes the `workout_plans` table data generated in the previous story.
-   **Component Structure:** Established patterns for API endpoints (`app/api/v1/`) and frontend module organization.
-   **Pydantic Schemas:** Experience with Pydantic for data validation and serialization is directly applicable for consuming the `plan_json`.
-   **Testing Patterns:** Continue to follow Pytest for backend and Playwright/React Testing Library for frontend.

### References

-   [Source: `docs/epics.md#Story-2.3:-Display-Daily-Workout-Plan`]
-   [Source: `docs/sprint-artifacts/tech-spec-epic-2.md#Services-and-Modules`]
-   [Source: `docs/sprint-artifacts/tech-spec-epic-2.md#APIs-and-Interfaces`]
-   [Source: `docs/architecture.md#Data-Architecture`]
-   [Source: `docs/architecture.md#Client-side-State-Management`]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

Gemini CLI

### Debug Log References

### Completion Notes List

### File List

## Change Log

- 2025-11-24: Initial draft created by Gemini CLI.
