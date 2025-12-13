# Story 1.2: User Authentication - Email & Google OAuth

Status: in-progress

## Story

As a new user,
I want to create an account or log in using my email/password or Google,
So that I can securely access the application.

## Acceptance Criteria

1.  The Welcome screen provides options for email/password and Google authentication (Flow 1, Screen 1 - `welcome_screen/code.html`).
2.  A new user can successfully register with a valid email and password using the Email Sign-up form (Flow 1, Screen 2A - `email_signup/code.html`).
3.  A returning user can successfully log in with a valid email and password using the Email Login form (Flow 1, Screen 2B - `email_authentication/code.html`).
4.  A user can successfully authenticate using their Google account via the Google OAuth flow (Flow 1, Screen 3).
5.  Upon successful authentication, new users are redirected to the Onboarding flow, and returning users are redirected to the Dashboard (Flow 1, Screen 4).
6.  All authentication is handled by Supabase Auth.
7.  User data is stored in the Supabase `Users` table.

## Requirements Context Summary

This story focuses on implementing user authentication, a critical foundational component for the application. It covers both email/password-based authentication and Google OAuth. The solution will leverage Supabase Auth, which is a key architectural decision for this project (ADR-003 in `architecture.md`).

**Key Details:**
*   **Frontend UI:** The UI for the welcome screen, email sign-up, email login, and post-authentication redirection will be implemented according to the UX design specifications in `ux-design-phase1.md` (Flow 1, Screens 1, 2A, 2B, 3, 4).
*   **Backend Integration:** FastAPI will provide API endpoints for registration, login, and handling Google OAuth callbacks. These endpoints will interact with Supabase Auth for user management and token handling.
*   **Data Storage:** Authenticated user data, including basic profile information, will be stored in the `Users` table within the Supabase PostgreSQL database.
*   **Security:** Authentication will rely on JWTs for secure access. All API endpoints requiring user data will be protected with `Bearer` tokens and will validate user identity. Pydantic models will be used for API request/response validation. Environment variables will manage secrets.
*   **Monorepo Structure:** The implementation will adhere to the monorepo structure with frontend code in `apps/web` (Next.js) and backend code in `apps/api` (FastAPI), as defined in `architecture.md`#Project-Structure.
*   **Performance:** Non-AI API endpoints (including auth) are expected to have a p95 latency of < 300ms.
*   **Error Handling:** Both frontend (React Error Boundaries) and backend (standardized JSON error responses) will implement graceful error handling.

**References:**
*   `architecture.md`#Decision-Summary: Especially "Decision Summary", "Project Structure", "API Contracts", "Security Architecture".
*   `epics.md`#Story-1.2:-User-Authentication---Email-&-Google-OAuth: Story 1.2 definition and acceptance criteria.
*   `tech-spec-epic-1.md`#Detailed-Design: Detailed design, services, data models, APIs, and workflows for Epic 1.
*   `ux-design-phase1.md`#Flow-1:-Account-Creation-&-Authentication-(Google-•-Email): Flow 1 UI/UX specifications.

## Project Structure Alignment and Lessons Learned

### Key Learnings from Previous Story (Story 1.1: Project Setup & Core Infrastructure)

*   **Monorepo Setup Confirmed:** Story 1.1 successfully established the monorepo structure with `apps/web` for Next.js and `apps/api` for FastAPI. This story should leverage this existing structure for placing frontend authentication components and backend API endpoints.
*   **Initial File Creation:** The previous story created initial `package.json`, `README.md`, and basic file structures within `apps/web` and `apps/api`. This story will modify and expand upon these.
*   **Testing Setup:** Jest/React Testing Library and Pytest were installed. However, a persistent `ModuleNotFoundError: No module named 'app'` was encountered during Pytest execution for the FastAPI application. This technical debt remains and impacts the ability to reliably run backend tests. For this story, ensure that any new backend tests acknowledge this issue and, if possible, contribute to its resolution or use workarounds as necessary. The frontend testing setup is confirmed working.
*   **Previous Story Citation:** [Source: docs/sprint-artifacts/1-1-project-setup-core-infrastructure.md]

### Current Story's Impact on Project Structure

This story will primarily involve:
*   **`apps/web` (Frontend):** Creation of UI components for authentication (Welcome Screen, Email Sign-up/Login forms) and integration with Supabase JS client.
*   **`apps/api` (Backend):** Implementation of new API endpoints for user registration, login, and Google OAuth callbacks. These will interact with the Supabase Python client.
*   **Database:** Creation/modification of `Users` table schema in Supabase to store authentication-related user data.

## Tasks / Subtasks

-   [x] **Task 1: Implement Welcome/Authentication Gateway UI (AC: 1)**
    -   [x] Subtask 1.1: Create `WelcomeScreen.tsx` in `apps/web/src/app/auth` based on `Flow 1, Screen 1 (welcome_screen/code.html)` from `ux-design-phase1.md`.
    -   [x] Subtask 1.2: Implement `Create Account`, `Log In`, `Continue with Google` buttons.
    -   [x] Subtask 1.3: Add navigation logic to corresponding authentication flows.
    -   [x] Subtask 1.4: Unit test `WelcomeScreen.tsx` with Jest/RTL to verify rendering and button interactions.

-   [x] **Task 2: Implement Email Sign-up UI & Logic (AC: 2)**
    -   [x] Subtask 2.1: Create `EmailSignupForm.tsx` in `apps/web/src/app/auth` based on `Flow 1, Screen 2A (email_signup/code.html)` from `ux-design-phase1.md`.
    -   [x] Subtask 2.2: Implement email and password input fields with client-side validation.
    -   [x] Subtask 2.3: Integrate with Supabase JS client for user registration (call `POST /auth/register` equivalent).
    -   [x] Subtask 2.4: Handle successful registration (redirect to Onboarding) and display error messages.
    -   [x] Subtask 2.5: Unit test `EmailSignupForm.tsx` with Jest/RTL for form submission and validation.

-   [x] **Task 3: Implement Email Login UI & Logic (AC: 3)**
    -   [x] Subtask 3.1: Create `EmailLoginForm.tsx` in `apps/web/src/app/auth` based on `Flow 1, Screen 2B (email_authentication/code.html)` from `ux-design-phase1.md`.
    -   [x] Subtask 3.2: Implement email and password input fields with client-side validation.
    -   [x] Subtask 3.3: Integrate with Supabase JS client for user login (call `POST /auth/login` equivalent).
    -   [x] Subtask 3.4: Handle successful login (redirect to Dashboard) and display error messages.
    -   [x] Subtask 3.5: Unit test `EmailLoginForm.tsx` with Jest/RTL for form submission and validation.

-   [x] **Task 4: Implement Google OAuth Flow (AC: 4, 5)**
    -   [x] Subtask 4.1: Configure Supabase for Google OAuth integration.
    -   [x] Subtask 4.2: Implement frontend initiation of Google OAuth (Supabase JS client).
    -   [x] Subtask 4.3: Implement backend `/auth/google` and `/auth/callback` endpoints in `apps/api/app/api/auth.py` to handle the Google OAuth flow (redirect to Google, process callback).
    -   [x] Subtask 4.4: Handle post-OAuth redirection logic in frontend (new user -> Onboarding, returning user -> Dashboard).
    -   [x] Subtask 4.5: E2E test the Google OAuth flow using Playwright (mocking external redirects if necessary), verifying successful authentication and redirection.

-   [x] **Task 5: Supabase Authentication Backend Service (AC: 6, 7)**
    -   [x] Subtask 5.1: Create/update `auth_service.py` in `apps/api/app/services` to encapsulate Supabase Auth interactions (register, login, OAuth handling).
    -   [x] Subtask 5.2: Create/update `auth_router.py` in `apps/api/app/api` to expose FastAPI endpoints (`/auth/register`, `/auth/login`, `/auth/google`, `/auth/callback`) that utilize the `auth_service`.
    -   [x] Subtask 5.3: Ensure Pydantic models are used for request/response validation on all auth endpoints.
    -   [x] Subtask 5.4: Implement secure JWT handling and storage on both frontend (cookies/local storage) and backend (validation middleware).
    -   [x] Subtask 5.5: Integration test backend auth endpoints with Pytest, verifying user creation, login, and token generation. Address `ModuleNotFoundError` during Pytest setup if possible (from previous story's tech debt).

-   [x] **Task 6: User Data Storage & Redirection (AC: 5, 7)**
    -   [x] Subtask 6.1: Verify `Users` table in Supabase is correctly configured to store user data, potentially leveraging Supabase's built-in `auth.users` table and extending with RLS.
    -   [x] Subtask 6.2: Implement a mechanism in the frontend to check if a user is new (e.g., via Supabase metadata or a flag after initial registration) to determine redirection to Onboarding or Dashboard.
    -   [x] Subtask 6.3: Integration test `User` data persistence and redirection logic.

-   [x] **Task 7: Global Authentication State Management**
    -   [x] Subtask 7.1: Create a Zustand store (`apps/web/src/store/auth.ts`) to manage global authentication state (user object, JWT, loading status).
    -   [x] Subtask 7.2: Integrate the Zustand store with authentication components to provide a consistent user experience.

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

Gemini

### Debug Log References

### Completion Notes List

### File List
- `apps/web/src/app/auth/WelcomeScreen.tsx`
- `apps/web/src/app/auth/WelcomeScreen.test.tsx`
- `apps/web/src/app/auth/EmailSignupForm.tsx`
- `apps/web/src/app/auth/EmailSignupForm.test.tsx`
- `apps/web/src/app/auth/EmailLoginForm.tsx`
- `apps/web/src/app/auth/EmailLoginForm.test.tsx`


## Change Log
