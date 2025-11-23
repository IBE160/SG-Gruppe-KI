# Story 1.2: User Authentication with Email/Password

Status: ready-for-dev

## Story

As a User,
I want to be able to sign up and log in with my email and password,
So that I can have a secure personal account.

## Acceptance Criteria

1.  **Given** a user is on the login/signup page, **when** they enter a valid email and password and click "Sign Up", **then** a new user is created in the Supabase `users` table.
2.  **And** they are automatically logged in.
3.  **Given** a registered user is on the login page, **when** they enter their correct email and password and click "Log In", **then** they are successfully authenticated.

## Tasks / Subtasks

- [ ] **Task 1: Backend API for Email/Password Auth** (AC: #1, #3)
    - [ ] Create `POST /api/v1/auth/signup` endpoint in FastAPI. (Source: `tech-spec-epic-1.md#APIs-and-Interfaces`)
    - [ ] Implement logic to call Supabase Auth to create a new user.
    - [ ] Create `POST /api/v1/auth/login` endpoint in FastAPI. (Source: `tech-spec-epic-1.md#APIs-and-Interfaces`)
    - [ ] Implement logic to call Supabase Auth to sign in a user and return tokens.
    - [ ] Add Pydantic schemas for request/response validation. (Source: `tech-spec-epic-1.md#Services-and-Modules`)
- [ ] **Task 2: Frontend UI for Signup and Login** (AC: #1, #2, #3)
    - [ ] Create a new page/route for authentication in the Next.js app.
    - [ ] Build the UI form with fields for email and password.
    - [ ] Implement client-side logic to call the backend `/signup` endpoint.
    - [ ] Implement client-side logic to call the backend `/login` endpoint.
    - [ ] On successful login/signup, store session tokens securely and redirect to an authenticated page. (AC: #2)
- [ ] **Task 3: Testing**
    - [ ] Add Pytest unit tests for the new backend endpoints.
    - [ ] Add React Testing Library tests for the frontend components.
    - [ ] Add a Playwright E2E test for the full email/password signup and login flow.

## Dev Notes

This story implements the foundational email/password authentication system.

-   **Architecture:** Leverage Supabase Auth for the core authentication logic. The FastAPI backend will act as a proxy to Supabase, and the Next.js frontend will communicate with the backend.
-   **Source Components:**
    -   **Backend:** `app/api/v1/auth.py`, `app/schemas/user.py`
    -   **Frontend:** A new route under `app/app/`, potentially `app/app/(auth)/login/page.tsx`. New components in `app/components/auth/`.
-   **Testing:** Ensure comprehensive testing, including edge cases like invalid emails, weak passwords, and incorrect login credentials.

### Project Structure Notes

-   This is the second story in the epic. The project structure was established in Story 1.1. No new top-level directories are expected. Adhere to the `architecture.md` for naming conventions.
-   No conflicts with previous work are anticipated.

### Learnings from Previous Story

The preceding story (1.1) was for project initialization. As such, there are no specific code patterns, services, or architectural deviations to carry forward into this story. All structures should align with the foundational `architecture.md`.

### References

-   [Source: `docs/epics.md#Story-1.2:-User-Authentication-with-Email/Password`]
-   [Source: `docs/sprint-artifacts/tech-spec-epic-1.md#Workflows-and-Sequencing`]
-   [Source: `docs/architecture.md#Authentication`]

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/1-2-user-authentication-with-email-password.context.xml`

### Agent Model Used

Gemini CLI

### Debug Log References

### Completion Notes List

### File List

## Change Log
- 2025-11-23: Initial draft created by Gemini CLI.
- 2025-11-23: Status changed to ready-for-dev. Context file generated.
