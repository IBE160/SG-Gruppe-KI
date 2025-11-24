# Story 1.4: Conversational Onboarding for Goal Setting

Status: ready-for-dev



## Story



**As a new User,**

**I want to be guided through a conversational onboarding process,**

**So that I can set up my initial fitness goals, preferences, and available equipment.**



## Acceptance Criteria



1.  **Given** a new user logs in for the first time

2.  **When** they are redirected to the onboarding flow

3.  **Then** they are presented with a series of questions about their goals, time availability, equipment, injuries, and preferred units.

4.  **And** their responses are saved to their user profile in the `users` table.



## Tasks / Subtasks



- [ ] **Task 1: Backend API for Onboarding Data** (AC: #4)

    - [ ] Create `POST /api/v1/users/onboarding` endpoint to handle saving initial onboarding data to the `users` table. (Source: `tech-spec-epic-1.md#APIs-and-Interfaces`)

    - [ ] Implement validation for the incoming onboarding data.

- [ ] **Task 2: Frontend Onboarding UI** (AC: #1, #2, #3, #4)

    - [ ] Create a multi-step UI component for the conversational onboarding flow.

    - [ ] Implement logic to redirect new users to this flow after initial login.

    - [ ] Design and implement the UI for questions regarding goals, time availability, equipment, injuries, and preferred units.

    - [ ] Implement client-side logic to send collected data to the backend `/api/v1/users/onboarding` endpoint.

- [ ] **Task 3: Data Model Updates**

    - [ ] Ensure the `users` table schema in Supabase can store `goals` (JSONB), `preferences` (JSONB), `equipment` (TEXT[]), `injuries` (TEXT), and `units` (TEXT). (Source: `tech-spec-epic-1.md#Data-Models-and-Contracts`)

- [ ] **Task 4: Testing**

    - [ ] Add Pytest integration tests for the new backend onboarding endpoint.

    - [ ] Add Playwright E2E tests to cover the full onboarding flow, ensuring data is correctly saved.



## Dev Notes



This story implements the crucial onboarding process, enriching the user profile with initial fitness context.



-   **Architecture:** Leverage FastAPI for the backend API and Next.js for the frontend UI. Data persistence will be in the Supabase `users` table.

-   **Source Components:**

    -   **Backend:** `app/api/v1/users.py` (new endpoint), `app/schemas/user.py` (updated schemas).

    -   **Frontend:** New `Onboarding Module` components and logic.

-   **Testing:** Focus on end-to-end testing to ensure the entire onboarding flow, including data persistence, works correctly.



### Project Structure Notes



-   Continues to follow the monorepo structure. New code will reside within `backend/app/api/v1/users.py` and new frontend onboarding components.

-   No conflicts with previous work are anticipated.



### Learnings from Previous Story



**From Story 1.3: User Authentication with Google OAuth (Status: ready-for-dev)**



-   **Architectural Foundation:** Confirmed use of Supabase Auth for identity management (though less directly used here, its presence is foundational), FastAPI for backend API, and Next.js for frontend.

-   **Auth Component Structure:** Established patterns for API endpoints (`app/api/v1/`) and frontend module organization (`app/app/`, `app/components/`). This story will add to `app/api/v1/users.py`.

-   **Pydantic Schemas:** Understanding of using Pydantic for request/response validation (relevant for onboarding data).

-   **Testing Patterns:** Follow Pytest for backend and Playwright for E2E tests.

-   **Monorepo:** Continued adherence to the established monorepo structure.



### References



-   [Source: `docs/epics.md#Story-1.4:-Conversational-Onboarding-for-Goal-Setting`]

-   [Source: `docs/sprint-artifacts/tech-spec-epic-1.md#Workflows-and-Sequencing`]

-   [Source: `docs/architecture.md#Data-Architecture`]

-   [Source: `docs/sprint-artifacts/1-3-user-authentication-with-google-oauth.md#Dev-Notes`]



## Dev Agent Record



### Context Reference



- `docs/sprint-artifacts/1-4-conversational-onboarding-for-goal-setting.context.xml`



### Agent Model Used



Gemini CLI



### Debug Log References



### Completion Notes List



### File List



## Change Log

- 2025-11-23: Initial draft created by Gemini CLI.

- 2025-11-23: Status changed to ready-for-dev. Context file generated.
