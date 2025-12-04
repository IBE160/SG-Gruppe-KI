# Story 1.2: User Authentication - Email & Google OAuth

Status: ready-for-dev

## Story

As a new user,
I want to create an account or log in using my email/password or Google,
So that I can securely access the application.

## Acceptance Criteria

1. Given I am on the Welcome/Authentication Gateway screen, when I choose "Create Account" or "Log In" using email and password, then I am presented with the appropriate forms (Email Sign-up or Email Login).
2. Given I am on the Email Sign-up form, when I enter valid credentials and register, then I am successfully authenticated and redirected to the Onboarding flow.
3. Given I am on the Email Login form, when I enter valid credentials and log in, then I am successfully authenticated and redirected to the Dashboard.
4. Given I am on the Welcome/Authentication Gateway screen, when I choose "Continue with Google", then I am redirected to the Google OAuth flow and can successfully authenticate.
5. Upon successful Google authentication, as a new user, I am redirected to the Onboarding flow.
6. Upon successful Google authentication, as a returning user, I am redirected to the Dashboard.
7. All authentication is handled via Supabase Auth.
8. User data for new registrations is stored in the Supabase `Users` table.

## Tasks / Subtasks

- [ ] **Frontend - UI Implementation**
  - [ ] Create the Welcome/Authentication Gateway screen (Flow 1, Screen 1).
  - [ ] Create the Email Sign-up form (Flow 1, Screen 2A).
  - [ ] Create the Email Login form with a "Forgot Password" link (Flow 1, Screen 2B).
  - [ ] **Testing:** Implement component tests for all three screens to verify rendering and basic interactions. [Source: docs/architecture.md#Decision Summary - Testing]

- [ ] **Frontend - Supabase Integration**
  - [ ] Integrate Supabase Auth client for email/password sign-up.
  - [ ] Integrate Supabase Auth client for email/password sign-in.
  - [ ] Integrate Supabase Auth client for Google OAuth.
  - [ ] Implement client-side logic to handle redirection after successful authentication (to Onboarding or Dashboard).
  - [ ] Manage JWT tokens securely on the client-side.
  - [ ] **Testing:** Implement integration tests to verify successful authentication and redirection flows for both email/password and Google OAuth.

- [ ] **Backend - Supabase Setup**
  - [ ] Enable Email and Google providers in the Supabase Auth settings.
  - [ ] Configure the `Users` table in the Supabase database.
  - [ ] **Testing:** Verify that new users are correctly added to the `Users` table upon registration.

## Dev Notes

### Authentication Flow

*   **Frontend:** The frontend will use the Supabase.js library to interact with Supabase Auth.
*   **Backend:** The FastAPI backend will validate the JWT tokens sent from the frontend in the `Authorization` header for protected endpoints.
*   **Redirects:** After successful authentication, the frontend will be responsible for redirecting the user to the appropriate page (`/onboarding` for new users, `/dashboard` for existing users).

### Project Structure Notes

*   **Previous Story Learnings:** Previous story `1-1-project-setup-core-infrastructure` is not yet implemented. No learnings available.
*   **Monorepo Structure:** The frontend components for this story will be located in `apps/web/src/app/(auth)/`. This story assumes the monorepo structure from story 1.1 is in place.

### References

*   [Source: docs/architecture.md#Authentication]
*   [Source: docs/architecture.md#Data Architecture]
*   [Source: docs/epics.md#Story 1.2: User Authentication - Email & Google OAuth]
*   [Source: docs/ux-design-direction.md#Flow 1: Account Creation & Authentication (Google • Email)]

### Dev Agent Record

### Context Reference

- [Story Context XML: docs/sprint-artifacts/1-2-user-authentication---email-google-oauth.context.xml]

### Agent Model Used

Gemini CLI Agent vX.X

### Debug Log References

### Completion Notes List

### File List

### Change Log
- **2025-12-04**: Story drafted by Bob (Scrum Master AI Agent). Initial scope derived from `epics.md` and `architecture.md`.
