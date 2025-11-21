# Epic Technical Specification: Core Platform & User Foundation

Date: 2025-11-21
Author: BIP
Epic ID: 1
Status: Draft

---

## Overview

This epic establishes the foundational infrastructure, user authentication, and conversational onboarding for the AI-Powered Personal Training Advisor. It focuses on enabling basic user interaction and personalization as described in the Product Requirements Document (PRD).

## Objectives and Scope

**In-Scope:**
*   User registration and login via email/password and Google OAuth (FR005).
*   User profile creation and management, including viewing and editing profile information, goals, and equipment (FR013).
*   AI-guided conversational onboarding to collect initial fitness goals, preferences, available equipment, injuries, and preferred units (FR001).
*   Initialization of the project with Next.js (frontend), FastAPI (backend), and Supabase (database and authentication), establishing the foundational monorepo structure.

**Out-of-Scope:**
*   Advanced profile features beyond initial setup and basic editing.
*   Integration with other OAuth providers beyond Google.
*   Complex AI interactions beyond initial goal setting.
*   Any features related to daily workout planning, logging, Spotify integration, reminders, or offline capabilities (these are covered in subsequent epics).

## System Architecture Alignment

This epic directly aligns with the foundational architectural decisions outlined in `architecture.md`. It leverages Next.js for the frontend, FastAPI for the backend, and Supabase for PostgreSQL database and authentication. Specifically:
*   **Authentication:** Supabase Auth is utilized for email/password and Google OAuth, providing robust and managed authentication (ADR: Authentication).
*   **Database:** PostgreSQL (via Supabase) is the primary data store for user profiles, goals, preferences, equipment, and onboarding data (ADR: Data Architecture).
*   **Project Structure:** The monorepo structure with separate frontend (Next.js) and backend (FastAPI) applications is established and followed (ADR: Project Structure).

## Detailed Design

### Services and Modules

*   **Frontend (Next.js Application):**
    *   **Auth Module:** Manages user login/signup UI, handles form submissions, and initiates Google OAuth flow. Interacts with the backend authentication API.
    *   **Onboarding Module:** Implements the multi-step conversational UI for collecting user goals, preferences, equipment, injuries, and preferred units. Submits data to the backend user API.
    *   **Profile Module:** Provides UI to display and edit user profile information, interacting with the backend user API.
    *   **Supabase Client (`lib/supabase.ts`):** Client-side library for interacting with Supabase Auth and Database.

*   **Backend (FastAPI Application):**
    *   **Auth API (`app/api/v1/auth.py`):** Contains endpoints for user registration (email/password), login (email/password), and handling the Google OAuth callback. Directly interacts with Supabase Auth.
    *   **User API (`app/api/v1/users.py`):** Provides endpoints for creating and retrieving user profiles, and for updating user data, including information collected during onboarding.
    *   **Supabase Client (`app/db/supabase.py`):** Server-side library for interacting with Supabase Auth and Database.
    *   **User Schemas (`app/schemas/user.py`):** Pydantic models for request validation and response serialization related to user data (e.g., `UserCreate`, `UserProfileUpdate`, `OnboardingData`).

### Data Models and Contracts

*   **`users` table (Supabase PostgreSQL):**
    *   `id` (UUID, Primary Key, from Supabase Auth): Unique identifier for the user.
    *   `email` (TEXT, UNIQUE, from Supabase Auth): User's email address.
    *   `name` (TEXT): User's display name.
    *   `goals` (JSONB): User's fitness goals (e.g., strength, endurance).
    *   `preferences` (JSONB): User's workout preferences (e.g., preferred time, duration).
    *   `equipment` (TEXT[]): List of available workout equipment.
    *   `injuries` (TEXT): Description of any injuries or physical limitations.
    *   `units` (TEXT): Preferred units of measurement (metric or imperial).
    *   `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW()): Timestamp of user creation.
    *   `updated_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW()): Timestamp of last user profile update.

### APIs and Interfaces

*   **Authentication Endpoints (FastAPI `app/api/v1/auth.py`):**
    *   `POST /api/v1/auth/signup`:
        *   **Description:** Registers a new user with email and password.
        *   **Request Body:** `{ "email": "string", "password": "string" }`
        *   **Response (201 Created):** `{ "message": "success", "data": { "user_id": "uuid", "email": "string" } }`
    *   `POST /api/v1/auth/login`:
        *   **Description:** Authenticates an existing user with email and password.
        *   **Request Body:** `{ "email": "string", "password": "string" }`
        *   **Response (200 OK):** `{ "message": "success", "data": { "access_token": "string", "refresh_token": "string" } }`
    *   `GET /api/v1/auth/google`:
        *   **Description:** Initiates the Google OAuth flow. Redirects to Google's authorization page.
        *   **Response (302 Redirect):** Redirect to Google.
    *   `GET /api/v1/auth/google/callback`:
        *   **Description:** Callback endpoint for Google OAuth. Exchanges authorization code for tokens and handles user creation/login.
        *   **Response (302 Redirect):** Redirects back to frontend with session info.

*   **User Profile Endpoints (FastAPI `app/api/v1/users.py`):**
    *   `GET /api/v1/users/me`:
        *   **Description:** Retrieves the authenticated user's profile.
        *   **Response (200 OK):** `{ "message": "success", "data": { "id": "uuid", "email": "string", "name": "string", "goals": {}, "equipment": [], "injuries": "string", "units": "string", ... } }`
    *   `PUT /api/v1/users/me`:
        *   **Description:** Updates the authenticated user's profile information.
        *   **Request Body:** `{ "name": "string", "goals": {}, "equipment": [], "injuries": "string", "units": "string" }` (partial updates supported)
        *   **Response (200 OK):** `{ "message": "success", "data": { "id": "uuid", "email": "string", "name": "string", ... } }` (Updated user profile data)
    *   `POST /api/v1/users/onboarding`:
        *   **Description:** Saves initial onboarding data for a new user.
        *   **Request Body:** `{ "goals": {}, "preferences": {}, "equipment": [], "injuries": "string", "units": "string" }`
        *   **Response (200 OK):** `{ "message": "success", "data": { "user_id": "uuid" } }`

### Workflows and Sequencing

1.  **Story 1.1: As a Developer, I want to initialize the project with core infrastructure, so that I can begin feature development with a functional monorepo.**
    *   **Action:** Execute `npx create-next-app` for the frontend and set up the `backend` directory with `venv` and FastAPI/Uvicorn. Configures `.env` files for Supabase access.
    *   **Outcome:** A functional monorepo structure with connected Next.js and FastAPI components, ready for feature development.
2.  **User Signup/Login (Stories 1.2, 1.3):**
    *   **Sequence:**
        *   User navigates to the login/signup page.
        *   **Email/Password Flow:**
            *   User submits email and password via frontend form.
            *   Frontend calls `POST /api/v1/auth/signup` (for new users) or `POST /api/v1/auth/login` (for existing users) on the FastAPI backend.
            *   FastAPI interacts with Supabase Auth to create or authenticate the user.
            *   Supabase returns session tokens. FastAPI relays these to the frontend.
            *   Frontend securely stores authentication tokens and updates UI to reflect logged-in state.
        *   **Google OAuth Flow:**
            *   User clicks "Continue with Google" on the frontend.
            *   Frontend initiates Google OAuth by redirecting the user to Google's authorization page.
            *   Upon successful authorization, Google redirects back to the FastAPI backend's `GET /api/v1/auth/google/callback` endpoint.
            *   FastAPI exchanges the authorization code for Google tokens and uses Supabase Auth to create or link the user account. It then generates an application session.
            *   FastAPI redirects the frontend with application session information.
    *   **Outcome:** User is authenticated and an active session is established.
3.  **Conversational Onboarding for Goal Setting (Story 1.4):**
    *   **Sequence:**
        *   Upon successful first-time login, the frontend detects that onboarding data is incomplete.
        *   The frontend presents a multi-step conversational UI.
        *   User provides input regarding their fitness goals, time availability, available equipment, any injuries, and preferred units.
        *   As the user progresses or upon completion, the frontend calls the `POST /api/v1/users/onboarding` endpoint on the FastAPI backend.
        *   FastAPI updates the authenticated user's record in the `users` table with the collected onboarding data.
    *   **Outcome:** User's profile is enriched with initial fitness context, enabling personalized AI interactions in future epics.
4.  **User Profile Management (Story 1.5):**
    *   **Sequence:**
        *   An authenticated user navigates to their profile page in the frontend.
        *   The frontend calls `GET /api/v1/users/me` to retrieve the current user profile data.
        *   The frontend renders an editable form pre-filled with the user's current information (name, goals, equipment, etc.).
        *   The user modifies desired fields and submits the form.
        *   The frontend calls `PUT /api/v1/users/me` on the FastAPI backend with the updated profile data.
        *   FastAPI updates the corresponding fields in the `users` table in Supabase, enforcing RLS to ensure data integrity and security.
    *   **Outcome:** User can view and maintain their personal details, goals, and equipment, ensuring their fitness profile remains accurate.

## Non-Functional Requirements

### Performance

*   **API Latency (NFR004):** P95 API response time for all non-AI endpoints within this epic (user authentication, profile management, onboarding data submission) must be < 300ms.
*   **Frontend Responsiveness:** Authentication and user profile screens (Next.js) should load swiftly and provide a fluid user experience, leveraging Next.js optimizations (e.g., code splitting, server-side rendering where appropriate) and React Query for efficient data fetching.
*   **Database Query Speed:** Supabase PostgreSQL queries related to user data and authentication must be optimized with appropriate indexing to ensure rapid retrieval and persistence.

### Security

*   **Authentication (NFR006):** User authentication will be handled securely by Supabase Auth, supporting email/password and Google OAuth, adhering to industry best practices.
*   **Authorization (NFR006):** Row-Level Security (RLS) will be strictly enforced on the `users` table to ensure that users can only read, write, or update their own profile data. API-level authorization in FastAPI will provide an additional layer of security to confirm authenticated access for all user-specific endpoints.
*   **Data Protection:** All sensitive data transmitted between frontend, backend, and Supabase will be encrypted in transit using HTTPS/SSL.
*   **GDPR Compliance (NFR002, NFR003):** The design of user profile management and data handling within this epic will support GDPR principles by providing mechanisms for data accuracy and user control over their personal information.

### Reliability/Availability

*   **Availability (NFR005):** The core platform services, including authentication and user management, should achieve 99% uptime in Phase 1.
*   **Data Persistence:** User profile and onboarding data will be stored in a fully managed Supabase PostgreSQL database, benefiting from its inherent reliability, backups, and replication mechanisms.
*   **Error Handling:** Robust error handling will be implemented across the Next.js frontend and FastAPI backend to gracefully manage failures during authentication or profile operations, preventing application crashes and providing informative user feedback.

### Observability

*   **Structured Logging (NFR008):** All critical operations related to user authentication, registration, and profile management (both frontend and backend) will generate structured logs, including relevant contextual information such as user ID, request ID, and timestamps.
*   **Error Tracking:** Unhandled exceptions and significant errors occurring during user interaction with authentication or profile features will be captured by the observability stack (e.g., Sentry/Datadog) and trigger appropriate alerts.
*   **Metrics:** Key performance indicators such as API latency for authentication/user endpoints, and success/failure rates for user registration and login attempts will be monitored.

## Dependencies and Integrations

This epic primarily relies on the core foundational services and frameworks:

*   **Supabase:**
    *   **Authentication:** Utilized for user signup, login, and session management, supporting both email/password and Google OAuth (ADR: Authentication).
    *   **PostgreSQL Database:** Serves as the primary data store for all user-related information, including profiles, goals, preferences, and onboarding data (ADR: Data Architecture).
    *   **Row-Level Security (RLS):** Crucial for enforcing authorization and ensuring data privacy, allowing users to access only their own data.
*   **Next.js (Frontend Framework):** Provides the client-side rendering and interactive components for the authentication flows, onboarding process, and user profile pages (ADR: Frontend Framework).
*   **FastAPI (Backend Framework):** Powers the backend API endpoints for handling authentication requests and managing user profile data (ADR: Backend Framework).
*   **Google OAuth:** An external third-party integration point for enabling seamless Google-based authentication (ADR: Authentication).

## Acceptance Criteria (Authoritative)

### Story 1.1: Project Initialization and Setup
*   **AC 1.1.1:** Given the project structure is defined in architecture.md, when the initialization commands are run, then a Next.js frontend, a FastAPI backend, and a Supabase project are created and connected.
*   **AC 1.1.2:** And the project is structured as a monorepo.

### Story 1.2: User Authentication with Email/Password
*   **AC 1.2.1:** Given a user is on the login/signup page, when they enter a valid email and password and click "Sign Up", then a new user is created in the Supabase `users` table.
*   **AC 1.2.2:** And they are automatically logged in.
*   **AC 1.2.3:** Given a registered user is on the login page, when they enter their correct email and password and click "Log In", then they are successfully authenticated.

### Story 1.3: User Authentication with Google OAuth
*   **AC 1.3.1:** Given a user is on the login/signup page, when they click "Continue with Google", then they are redirected to Google's OAuth flow.
*   **AC 1.3.2:** And upon successful authentication, they are redirected back to the app and are logged in.

### Story 1.4: Conversational Onboarding for Goal Setting
*   **AC 1.4.1:** Given a new user logs in for the first time, when they are redirected to the onboarding flow, then they are presented with a series of questions about their goals, time availability, equipment, injuries, and preferred units.
*   **AC 1.4.2:** And their responses are saved to their user profile in the `users` table.

### Story 1.5: User Profile Management
*   **AC 1.5.1:** Given an authenticated user, when they navigate to their profile page, then they can see their current profile information, goals, and equipment.
*   **AC 1.5.2:** And they can edit these details and save the changes.

## Traceability Mapping

| AC ID | Description (from Epic/Story) | Spec Section(s) | Component(s)/API(s) | Test Idea |
|---|---|---|---|---|
| 1.1.1 | Next.js, FastAPI, Supabase created and connected | Detailed Design: Services and Modules | `npx create-next-app`, `mkdir backend`, `pip install fastapi` | Run initialization commands, verify folder structure, basic connectivity. |
| 1.1.2 | Project structured as monorepo | Detailed Design: Services and Modules | N/A | Verify directory layout matches `architecture.md` specification. |
| 1.2.1 | New user created in Supabase (email/password) | Detailed Design: APIs and Interfaces (POST /api/v1/auth/signup) | FastAPI Auth API, Supabase Auth | UI test: complete signup flow. Backend integration test: direct API call, verify user record in Supabase. |
| 1.2.2 | User automatically logged in (email/password) | Detailed Design: Workflows and Sequencing (User Signup/Login) | Frontend Auth Module, FastAPI Auth API | UI test: successful signup/login redirects to authenticated dashboard. |
| 1.2.3 | Registered user successfully authenticated (email/password) | Detailed Design: APIs and Interfaces (POST /api/v1/auth/login) | FastAPI Auth API, Supabase Auth | UI test: successful login with valid credentials. Backend integration test: direct API call. |
| 1.3.1 | Redirected to Google's OAuth flow | Detailed Design: APIs and Interfaces (GET /api/v1/auth/google) | Frontend Auth Module | UI test: click "Continue with Google" button, verify redirection to Google. |
| 1.3.2 | Redirected back and logged in (Google OAuth) | Detailed Design: APIs and Interfaces (GET /api/v1/auth/google/callback) | FastAPI Auth API, Supabase Auth | UI test: complete Google OAuth flow, verify successful login and dashboard access. |
| 1.4.1 | Presented with onboarding questions | Detailed Design: Workflows and Sequencing (Conversational Onboarding) | Frontend Onboarding Module | UI test: new user first login, verify sequence of onboarding questions.
| 1.4.2 | Onboarding responses saved to user profile | Detailed Design: APIs and Interfaces (POST /api/v1/users/onboarding), Data Models | FastAPI User API, Supabase `users` table | UI test: complete onboarding, verify data persisted in Supabase. Backend integration test: direct API call, DB check. |
| 1.5.1 | Can see current profile info, goals, equipment | Detailed Design: APIs and Interfaces (GET /api/v1/users/me) | Frontend Profile Module, FastAPI User API | UI test: navigate to profile page, verify user data is displayed correctly. |
| 1.5.2 | Can edit and save profile changes | Detailed Design: APIs and Interfaces (PUT /api/v1/users/me), Data Models | Frontend Profile Module, FastAPI User API, Supabase `users` table | UI test: edit profile fields, save, verify updated data is displayed and reflected in Supabase. Backend integration test: direct API call, DB check. |

## Risks, Assumptions, Open Questions

*   **Risks:**
    *   **Supabase Configuration Complexity:** The initial setup and configuration of Supabase Auth, particularly Row-Level Security (RLS) policies, might present a learning curve or unforeseen complexities, potentially impacting the timelines for Story 1.1 and subsequent authentication stories.
    *   **Google OAuth Integration Issues:** Potential challenges with correctly configuring Google API keys, managing redirect URIs, or handling edge cases within the Google OAuth flow, which could delay Story 1.3.
    *   **Data Consistency in Onboarding:** Ensuring all conversational onboarding data is accurately captured, mapped, and saved to the `users` table without partial updates or validation errors during the multi-step process.

*   **Assumptions:**
    *   The chosen Supabase free tier (or planned subscription) will adequately meet the initial performance and scaling requirements for authentication and user profile storage.
    *   Standard and well-documented Next.js and FastAPI project setup practices will be followed during the project initialization (Story 1.1) to create a maintainable baseline.
    *   User interface components for authentication, conversational onboarding, and user profile management are straightforward and can be effectively implemented using standard React/Next.js UI patterns and existing UI libraries/frameworks.

*   **Open Questions:**
    *   Are there any specific business-driven validation rules or constraints for user input during the conversational onboarding process (e.g., minimum character length for goals, predefined categories for equipment)?
    *   How will session management, including token refresh, explicit logout, and session expiration handling, be implemented and maintained on the frontend after initial user authentication?

## Test Strategy Summary

The testing strategy for Epic 1 will focus on ensuring the robustness of the core platform, user authentication, and profile management features. It will encompass unit, integration, API, and end-to-end testing.

*   **Unit Tests:**
    *   **Frontend:** Utilize Jest and React Testing Library to unit test individual React components (e.g., login forms, onboarding steps, user profile editor) for correct rendering and behavior.
    *   **Backend:** Employ Pytest for unit testing FastAPI endpoints (authentication, user CRUD operations), Pydantic schema validation, and Supabase client interactions.
*   **Integration Tests:**
    *   **Frontend-Backend:** Implement Playwright or Cypress for end-to-end (E2E) testing of critical user journeys, including user signup, login (email/password and Google OAuth), conversational onboarding completion, and user profile updates. These tests will simulate real browser interactions.
    *   **Backend-Database:** Use Pytest with a dedicated test database (e.g., Testcontainers for PostgreSQL) to verify the correct interaction between FastAPI services and the Supabase PostgreSQL database, including the enforcement of Row-Level Security (RLS) policies.
*   **API Tests:** Leverage tools like Postman or similar API testing frameworks for manual and automated testing of all FastAPI endpoints, ensuring adherence to API contracts, correct request/response formats, and appropriate error handling.
*   **Security Testing:** Conduct manual verification of RLS policies, secure token handling, and the integrity of OAuth flows. Basic penetration testing will be performed to identify common web vulnerabilities (e.g., OWASP Top 10).
*   **Performance Testing:** Conduct basic load tests on authentication and user profile APIs to ensure they meet the defined performance NFRs (e.g., p95 API latency < 300ms).
*   **Edge Case Testing:** Specifically design test cases for scenarios such as invalid user credentials, incomplete onboarding submissions, concurrent profile updates, and network interruptions during authentication processes to ensure graceful degradation and error handling.
