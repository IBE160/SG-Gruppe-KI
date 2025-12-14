# Story 1.2: User Authentication - Email & Google OAuth

Status: drafted

## Story

As a new user,
I want to create an account or log in using my email/password or Google,
So that I can securely access the application.

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

*   [ ] Task: Design and implement Welcome/Authentication Gateway UI (AC: 1)
    *   [ ] Create `welcome_screen` component in `apps/web/src/app/auth`
    *   [ ] Implement UI based on `Flow 1, Screen 1 - welcome_screen/code.html`
*   [ ] Task: Implement Email/Password Sign-up UI and functionality (AC: 2, 3, 4)
    *   [ ] Create `email_signup` component in `apps/web/src/app/auth`
    *   [ ] Implement UI based on `Flow 1, Screen 2A - email_signup/code.html`
    *   [ ] Integrate Supabase Auth for user registration
    *   [ ] Handle successful registration and redirection
    *   [ ] Test: Unit tests for UI, integration tests for Supabase registration
*   [ ] Task: Implement Email/Password Login UI and functionality (AC: 2, 3, 4)
    *   [ ] Create `email_login` component in `apps/web/src/app/auth`
    *   [ ] Implement UI based on `Flow 1, Screen 2B - email_authentication/code.html`
    *   [ ] Integrate Supabase Auth for user login
    *   [ ] Handle successful login and redirection
    *   [ ] Test: Unit tests for UI, integration tests for Supabase login
*   [ ] Task: Implement Google OAuth integration (AC: 5, 6, 7)
    *   [ ] Configure Supabase for Google OAuth
    *   [ ] Implement Google login button and redirection to OAuth flow
    *   [ ] Handle OAuth callback and successful authentication
    *   [ ] Test: Integration tests for Google OAuth flow
*   [ ] Task: Securely handle JWTs and session management (AC: 8)
    *   [ ] Implement client-side logic for storing and refreshing Supabase JWTs
    *   [ ] Ensure secure access to authenticated routes
    *   [ ] Test: Security tests for JWT handling
*   [ ] Task: Ensure user data persistence in Supabase `Users` table (AC: 9)
    *   [ ] Verify user data is correctly stored and updated by Supabase Auth
    *   [ ] Test: Database checks for `Users` table
*   [ ] Task: Implement E2E tests for authentication flows (AC: 1-9)
    *   [ ] Playwright tests for email sign-up, email login, and Google OAuth flows
    *   [ ] Verify successful redirection to Onboarding/Dashboard

## Dev Notes

- Relevant architecture patterns and constraints:
    - Authentication: Supabase Auth
    - Monorepo structure established in Story 1.1 (`apps/web`, `apps/api`)
    - Existing testing standards: Jest/React Testing Library, Playwright
- Source tree components to touch:
    - `apps/web/src/app/auth/` (new components for UI)
    - `apps/api/` (for Supabase integration if needed for server-side auth or callbacks)
    - `package.json` (root for monorepo config, dependencies)
- Testing standards summary:
    - Unit/Integration tests for UI components and Supabase integration
    - E2E tests using Playwright for full authentication flows

### Project Structure Notes

- Alignment with unified project structure (paths, modules, naming):
    - This story will primarily involve development within `apps/web` for the UI and potentially `apps/api` for API integration with Supabase Auth.
    - The established monorepo structure from Story 1.1 provides the necessary directories.

### References

- [Source: docs/architecture.md#Decision-Summary]
- [Source: docs/architecture.md#Security-Architecture]
- [Source: docs/epics.md#Story-1.2:-User-Authentication---Email-&-Google-OAuth]

### Learnings from Previous Story

**From Story 1.1: Project Setup & Core Infrastructure (Status: ready-for-dev)**

- **Relevant architecture patterns and constraints:** Frontend: Next.js (App Router, TypeScript, Tailwind CSS, ESLint), Backend: FastAPI (Python), Database/Auth: Supabase (PostgreSQL, Auth), Testing: Jest, React Testing Library, Playwright, Monorepo structure (`apps/web`, `apps/api`)
- **Source tree components established:** `apps/web/`, `apps/api/`, Root `package.json`, `.gitignore`, `README.md`
- **Testing standards summary:** Jest/React Testing Library for unit/integration tests in `apps/web`, Playwright for e2e tests in `apps/web` and `apps/api`

[Source: docs/1-1-project-setup-core-infrastructure.md#Dev-Notes]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List