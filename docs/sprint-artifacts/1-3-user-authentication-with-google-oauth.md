# Story 1.3: User Authentication with Google OAuth

Status: ready-for-dev



## Story



**As a User,**

**I want to be able to sign up and log in with my Google account,**

**So that I can have a quick and easy authentication experience.**



## Acceptance Criteria



1.  **Given** a user is on the login/signup page

2.  **When** they click "Continue with Google"

3.  **Then** they are redirected to Google's OAuth flow.

4.  **And** upon successful authentication, they are redirected back to the app and are logged in.



## Tasks / Subtasks



- [ ] **Task 1: Backend API for Google OAuth Callback** (AC: #3, #4)

    - [ ] Create `GET /api/v1/auth/google` endpoint to initiate Google OAuth flow (redirect to Google). (Source: `tech-spec-epic-1.md#APIs-and-Interfaces`)

    - [ ] Create `GET /api/v1/auth/google/callback` endpoint to handle the redirect from Google, exchange authorization code for tokens, and manage user creation/login via Supabase Auth. (Source: `tech-spec-epic-1.md#APIs-and-Interfaces`)

- [ ] **Task 2: Frontend UI for Google OAuth** (AC: #1, #2, #4)

    - [ ] Add a "Continue with Google" button to the authentication page.

    - [ ] Implement client-side logic to redirect to the backend `/api/v1/auth/google` endpoint when the button is clicked.

    - [ ] Handle successful redirection back to the app, storing session information securely and updating the UI.

- [ ] **Task 3: Supabase Configuration**

    - [ ] Configure Google as an OAuth provider in Supabase. (Source: `tech-spec-epic-1.md#Workflows-and-Sequencing`)

- [ ] **Task 4: Testing**

    - [ ] Add Pytest integration tests for the new backend OAuth endpoints.

    - [ ] Add a Playwright E2E test to simulate the Google OAuth flow from clicking the button to successful login.



## Dev Notes



This story builds upon the existing authentication system to add Google OAuth.



-   **Architecture:** Leverage Supabase Auth for Google OAuth. The FastAPI backend will orchestrate the OAuth flow, and the Next.js frontend will initiate and receive the redirects.

-   **Source Components:**

    -   **Backend:** `app/api/v1/auth.py`

    -   **Frontend:** Existing authentication page and new logic within the Auth Module.

-   **Testing:** Ensure comprehensive testing of the OAuth flow, including redirects and token handling.



### Project Structure Notes



-   Continues to follow the monorepo structure. New code will reside within existing `backend/app/api/v1/auth.py` and frontend Auth Module.

-   No conflicts with previous work are anticipated.



### Learnings from Previous Story



**From Story 1.2: User Authentication with Email/Password (Status: ready-for-dev)**



-   **Architectural Foundation:** Confirmed use of Supabase Auth for identity management, FastAPI for backend API, and Next.js for frontend.

-   **Auth Component Structure:** Established pattern for authentication endpoints in `backend/app/api/v1/auth.py` and frontend authentication UI/logic.

-   **Pydantic Schemas:** Understanding of using Pydantic for request/response validation in `app/schemas/user.py` will apply here if new schemas are needed.

-   **Testing Patterns:** Follow Pytest for backend and Playwright for E2E authentication tests.



### References



-   [Source: `docs/epics.md#Story-1.3:-User-Authentication-with-Google-OAuth`]

-   [Source: `docs/sprint-artifacts/tech-spec-epic-1.md#Workflows-and-Sequencing`]

-   [Source: `docs/architecture.md#Authentication`]

-   [Source: `docs/sprint-artifacts/1-2-user-authentication-with-email-password.md#Dev-Notes`]



## Dev Agent Record



### Context Reference



- `docs/sprint-artifacts/1-3-user-authentication-with-google-oauth.context.xml`



### Agent Model Used



Gemini CLI



### Debug Log References



### Completion Notes List



### File List



## Change Log

- 2025-11-23: Initial draft created by Gemini CLI.

- 2025-11-23: Status changed to ready-for-dev. Context file generated.
