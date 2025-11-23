# Story 1.2: User Authentication with Email/Password

Status: drafted

## Story

As a User,
I want to be able to sign up and log in with my email and password,
so that I can have a secure personal account.

### Requirements Context Summary

**Story 1.2: User Authentication with Email/Password**

**User Story:**
As a User,
I want to be able to sign up and log in with my email and password,
So that I can have a secure personal account.

**Acceptance Criteria:**
- Given a user is on the login/signup page
- When they enter a valid email and password and click "Sign Up"
- Then a new user is created in the Supabase users table.
- And they are automatically logged in.
- Given a registered user is on the login page
- When they enter their correct email and password and click "Log In"
- Then they are successfully authenticated.

**Architectural Context:**
The `architecture.md` document specifies that user authentication will be handled by Supabase Auth, supporting email/password and OAuth providers (Google). The FastAPI backend will implement additional authorization checks for API endpoints.

### Project Structure Alignment and Lessons Learned

**Project Structure Alignment:**
This story builds upon the foundational project structure established in Story 1.1. No changes to the overall project structure are expected. The implementation will focus on adding authentication-related components within the existing Next.js frontend and FastAPI backend.

**Lessons Learned from Previous Story:**
The previous story (1.1: Project Initialization and Setup) is not yet implemented. Therefore, there are no learnings to incorporate from its implementation.

## Acceptance Criteria

1.  **Given** a user is on the login/signup page
    **When** they enter a valid email and password and click "Sign Up"
    **Then** a new user is created in the Supabase users table.
    **And** they are automatically logged in.
    - *Test:* Verify that a new user record is created in the Supabase `auth.users` table and a corresponding entry in the public `users` table.
    - *Test:* Verify that the user is redirected to the authenticated part of the application.
2.  **Given** a registered user is on the login page
    **When** they enter their correct email and password and click "Log In"
    **Then** they are successfully authenticated.
    - *Test:* Verify successful login and redirection to the authenticated part of the application.
    - *Test:* Verify error handling for invalid credentials (e.g., incorrect password, unregistered email).

## Tasks / Subtasks

- [ ] **Frontend: Create Signup and Login UI** (AC: 1, 2)
    - [ ] Create a signup form component with email and password fields.
    - [ ] Create a login form component with email and password fields.
    - [ ] Implement UI for error handling and user feedback.
- [ ] **Frontend: Integrate Supabase Auth Client** (AC: 1, 2)
    - [ ] Implement the Supabase `signUp` function to handle user registration. [Source: Supabase Docs]
    - [ ] Implement the Supabase `signInWithPassword` function to handle user login. [Source: Supabase Docs]
    - [ ] Implement client-side routing to redirect users upon successful login/signup.
- [ ] **Backend: Secure API Endpoints** (AC: 1, 2)
    - [ ] Implement a dependency in FastAPI to verify the Supabase JWT token for authenticated routes. [Source: Supabase Docs]
    - [ ] Secure a test endpoint and verify that it requires a valid JWT.
- [ ] **Testing** (AC: 1, 2)
    - [ ] Write E2E tests for the signup and login flows using Playwright.
    - [ ] Write API tests for the secured endpoint, checking both authorized and unauthorized access.

## Dev Notes

-   **Relevant Architecture Patterns and Constraints:**
    -   **Authentication:** Supabase Auth for email/password authentication.
    -   **Frontend:** Next.js for UI components and client-side interactions.
    -   **Backend:** FastAPI for securing API endpoints with Supabase JWTs.
    -   **Security:** Strong password hashing and secure token handling leveraged from Supabase Auth.
    -   **Data Storage:** Supabase PostgreSQL `auth.users` table for authentication, and public `users` table for user profile data.

-   **Source Tree Components to Touch:**
    -   Frontend: New UI components for login and signup forms (e.g., `my-fullstack-app/components/auth/LoginForm.tsx`, `my-fullstack-app/components/auth/SignupForm.tsx`).
    -   Frontend: Supabase client initialization and usage (e.g., `my-fullstack-app/lib/supabase.ts`).
    -   Backend: FastAPI dependencies for JWT verification (e.g., `backend/app/dependencies.py`).
    -   Backend: Routes requiring authentication (e.g., a test protected route).

-   **Testing Standards Summary:**
    -   **E2E Tests:** `register_new_user_with_valid_credentials`, `login_with_valid_credentials`.
    -   **API Tests:** `attempt_registration_with_existing_email`, `attempt_login_with_invalid_credentials`, and tests for secured endpoints.
    -   **Unit Tests:** `password_hashing_and_storage_security` (leveraging Supabase's built-in security).

### Project Structure Notes

-   Authentication-related components will be added within the existing `my-fullstack-app` and `backend` directories, adhering to the established monorepo structure and code organization principles.

### References

-   [Source: architecture.md#Authentication]
-   [Source: architecture.md#Security-Architecture]
-   [Source: architecture.md#API-Contracts]
-   [Source: docs/test-design-epic-1.md#User-Authentication-Email/Password]
-   [Source: Supabase Docs - Authentication]

## Change Log

- **2025-11-23**: Initial story creation by Scrum Master.


