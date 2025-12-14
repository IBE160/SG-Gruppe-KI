# Story 1.2: User Authentication - Email & Google OAuth

Status: in-progress

## Story

As a new user,
I want to create an account or log in using my email/password or Google,
So that I can securely access the application.

### Requirements Context Summary

**Epic 1: Core Platform & User Foundation**

**Story 1.2: User Authentication - Email & Google OAuth**

**Story Statement:**
As a new user,
I want to create an account or log in using my email/password or Google,
So that I can securely access the application.

**Acceptance Criteria:**
*   Given I am on the Welcome/Authentication Gateway screen (Flow 1, Screen 1 - `welcome_screen/code.html`)
*   When I choose "Create Account" or "Log In" using email and password
*   Then I am presented with the Email Sign-up (Flow 1, Screen 2A - `email_signup/code.html`) or Email Login (Flow 1, Screen 2B - `email_authentication/code.html`) forms
*   And I can successfully register or log in with valid credentials
*   And I am redirected to either Onboarding (new user) or Dashboard (returning user)
*   When I choose "Continue with Google"
*   Then I am redirected to the Google OAuth flow
*   And I can successfully authenticate with my Google account
*   And I am redirected to either Onboarding (new user) or Dashboard (returning user)
*   Then authentication is handled via Supabase Auth
*   And user data is stored in the Supabase `Users` table

**Architectural Constraints & Guidance:**
*   **Authentication Mechanism:** Supabase Auth (Version 2.86.0) is the chosen solution for email/password and Google OAuth.
*   **API Security:** All protected API endpoints will expect a `Bearer` token in the `Authorization` header, provided by Supabase Auth.
*   **Data Model:** User data will be stored in the Supabase `Users` table. Row Level Security (RLS) should be enabled.
*   **Input Validation:** Pydantic models in FastAPI will validate all incoming data to the API.
*   **Error Handling:** Backend will return errors in a consistent JSON format (`{"error": {"message": ..., "code": ...}}`). Frontend will use React Error Boundaries for graceful recovery.
*   **Project Structure:** Frontend (Next.js `web` app) and Backend (FastAPI `api` app) will handle authentication logic in their respective layers, communicating via REST API calls. Test files should be co-located (`*.test.ts` or `*.spec.ts`).
*   **Environment Variables:** API keys and secrets for Supabase will be managed via environment variables.

**UX/UI Context (from ux-design-direction.md):**
*   **Flow 1: Account Creation & Authentication:**
    *   Primary Brand Aesthetic: Dark theme with vibrant green primary accent.
    *   Direct Account Actions: Prioritizes "Create Account" and "Log In" buttons, followed by social login icons.
    *   Dedicated Sign-up & Login Screens: Distinct, optimized forms for email sign-up (with password strength) and email login (with forgot password option).
    *   Prominent Forgot Password: Easy access to account recovery.

### Project Structure Alignment and Lessons Learned

**Based on Architectural Guidance:**

*   **Frontend (Next.js `apps/web`):**
    *   Authentication UI components (Welcome, Login, Sign-up, Google OAuth) will reside within `apps/web/src/app/auth/` or a similar dedicated directory following the App Router conventions.
    *   State management related to authentication (e.g., user session, login status) will use Zustand and be defined in `apps/web/src/store/authStore.ts`.
    *   API calls to the backend for authentication will be encapsulated in a service or utility within `apps/web/src/lib/authApi.ts`.
    *   UI components will adhere to Tailwind CSS for styling and `PascalCase` naming conventions.
    *   Testing for frontend components will use Jest/React Testing Library, with files co-located (e.g., `ComponentName.test.tsx`).

*   **Backend (FastAPI `apps/api`):**
    *   Authentication API routes (register, login, oauth/google) will be defined within a router (e.g., `apps/api/app/api/auth.py`) and included in `main.py` with a `/api/v1` prefix.
    *   Authentication logic (e.g., interacting with Supabase Auth, JWT handling) will be in a service layer (e.g., `apps/api/app/services/auth_service.py`).
    *   Pydantic models for request/response validation will be defined for authentication endpoints.
    *   Interaction with Supabase for user data will be via direct Supabase client calls or a dedicated repository/ORM layer.
    *   Testing for backend endpoints will use Pytest, with files co-located (e.g., `test_auth.py` in `apps/api/tests/api/`).

**Lessons Learned from Previous Stories:**

*   This is the first feature story for implementation. No previous story learnings are directly applicable. We will establish best practices for documentation and code patterns within this story.

## Acceptance Criteria

1.  Given I am on the Welcome/Authentication Gateway screen (Flow 1, Screen 1 - `welcome_screen/code.html`)
2.  When I choose "Create Account" or "Log In" using email and password
3.  Then I am presented with the Email Sign-up (Flow 1, Screen 2A - `email_signup/code.html`) or Email Login (Flow 1, Screen 2B - `email_authentication/code.html`) forms
4.  And I can successfully register or log in with valid credentials
5.  And I am redirected to either Onboarding (new user) or Dashboard (returning user)
6.  When I choose "Continue with Google"
7.  Then I am redirected to the Google OAuth flow
8.  And I can successfully authenticate with my Google account
9.  And I am redirected to either Onboarding (new user) or Dashboard (returning user)
10. Then authentication is handled via Supabase Auth
11. And user data is stored in the Supabase `Users` table

## Tasks / Subtasks

**Frontend (Next.js - `apps/web`):**

- [ ] **Implement Welcome/Authentication Gateway Screen (AC: 1, UX: Direct Account Actions)**
  - [ ] Create `apps/web/src/app/auth/welcome/page.tsx`
  - [ ] Implement UI with "Create Account", "Log In" buttons, and "Continue with Google" option.
  - [ ] Apply dark theme and green accent branding.
  - [ ] Ensure navigation to appropriate email forms or Google OAuth flow.
- [ ] **Implement Email Sign-up Form (AC: 2, UX: Dedicated Sign-up Screens)**
  - [ ] Create `apps/web/src/app/auth/signup/page.tsx`
  - [ ] Implement form fields for email and password (with strength indicator).
  - [ ] Integrate with Supabase client for user registration (`authApi.ts`).
  - [ ] Handle successful registration (redirection to Onboarding/Dashboard).
  - [ ] Implement error handling and display user-friendly messages.
- [ ] **Implement Email Login Form (AC: 3, UX: Dedicated Login Screens)**
  - [ ] Create `apps/web/src/app/auth/login/page.tsx`
  - [ ] Implement form fields for email and password.
  - [ ] Include "Forgot Password" link.
  - [ ] Integrate with Supabase client for user login (`authApi.ts`).
  - [ ] Handle successful login (redirection to Onboarding/Dashboard).
  - [ ] Implement error handling and display user-friendly messages.
- [ ] **Implement Google OAuth Client-side Flow (AC: 4)**
  - [ ] Integrate Supabase client for Google OAuth redirection.
  - [ ] Handle callback from Google OAuth and process session.
- [ ] **Manage Frontend Authentication State (AC: 5)**
  - [ ] Create `apps/web/src/store/authStore.ts` using Zustand to manage user session.
  - [ ] Implement logic to store and retrieve JWTs securely.
  - [ ] Implement protected routes/components based on authentication status.

**Backend (FastAPI - `apps/api`):**

- [ ] **Setup Supabase Client & Configuration**
  - [ ] Ensure Supabase URL and anonymous key are configured as environment variables.
  - [ ] Initialize Supabase client in the backend.
- [ ] **Implement Register Endpoint (`/api/v1/auth/register`) (AC: 2)**
  - [ ] Create Pydantic models for request body (email, password).
  - [ ] Integrate with Supabase Auth for user creation.
  - [ ] Handle successful user creation (return relevant user data/status).
  - [ ] Implement error handling for registration failures.
- [ ] **Implement Login Endpoint (`/api/v1/auth/login`) (AC: 3)**
  - [ ] Create Pydantic models for request body (email, password).
  - [ ] Integrate with Supabase Auth for user sign-in.
  - [ ] Handle successful login (return relevant user data/JWT).
  - [ ] Implement error handling for login failures.
- [ ] **Implement Google OAuth Callback Endpoint (`/api/v1/auth/oauth/google`) (AC: 4)**
  - [ ] Handle the callback from Google OAuth.
  - [ ] Integrate with Supabase Auth to exchange code for session.
  - [ ] Ensure user data is stored/updated in Supabase `Users` table.
- [ ] **Ensure Data Storage in Supabase `Users` Table (AC: 5)**
  - [ ] Verify user data is correctly persisted in the `Users` table upon registration/login.
  - [ ] (Future) Implement Row Level Security (RLS) for user data (Architectural Mandate).

**Testing:**

- [ ] **Frontend Unit/Integration Tests**
  - [ ] Write tests for authentication UI components (Jest/React Testing Library).
  - [ ] Write tests for Zustand auth store.
  - [ ] Write tests for Supabase client integration (mocking API calls).
- [ ] **Backend Unit/Integration Tests**
  - [ ] Write tests for `/api/v1/auth/register` endpoint (Pytest).
  - [ ] Write tests for `/api/v1/auth/login` endpoint (Pytest).
  - [ ] Write tests for `/api/v1/auth/oauth/google` endpoint (Pytest).
  - [ ] Mock Supabase interactions in tests.
- [ ] **End-to-End Tests (Playwright)**
  - [ ] Write Playwright tests for successful user registration via email.
  - [ ] Write Playwright tests for successful user login via email.
  - [ ] Write Playwright tests for successful user login via Google OAuth (if feasible in E2E).
  - [ ] Verify redirection to Onboarding/Dashboard after successful authentication.

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
- **2025-12-14**: Story drafted/updated by SM agent.

