# Epic Technical Specification: {{epic_title}}

Date: {{date}}
Author: {{user_name}}
Epic ID: {{epic_id}}
Status: Draft

---

## Overview

This document provides the technical specification for Epic 1: Core Platform & User Foundation. The primary goal of this epic is to establish the foundational infrastructure for the AI-Powered Personal Training Advisor. This includes setting up the project using a Next.js frontend and a FastAPI backend, implementing robust user authentication via Supabase (including email/password and Google OAuth), and creating a conversational onboarding experience to gather initial user data for personalization.

## Objectives and Scope

### In-Scope
- Initializing the monorepo project structure for the Next.js frontend and FastAPI backend.
- Story 1.2: Implementing user creation and login with email/password and Google OAuth using Supabase Auth.
- Story 1.3: Creating a multi-step conversational onboarding flow (Flow 2) to capture user fitness goals, preferences, available equipment, and physical limitations.
- Story 1.4: Developing a user profile management page allowing users to view and edit their information.
- Storing all user, goal, and preference data in the Supabase PostgreSQL database.

### Out-of-Scope
- AI-driven daily plan generation (handled in Epic 2).
- Real-time workout tracking and logging (handled in Epic 2).
- Spotify integration for music (handled in Epic 3).
- Advanced settings like offline mode (handled in Epic 4).

## System Architecture Alignment

This epic directly implements the foundational project structure defined in `architecture.md`. It establishes the `apps/web` (Next.js) and `apps/api` (FastAPI) packages within the monorepo. The authentication features (Story 1.2) will utilize the **Supabase Auth** provider as specified in **ADR-003**. All user and goal data will be stored in the Supabase PostgreSQL database and accessed via the FastAPI backend, adhering to the prescribed data architecture. Frontend components for onboarding and profile management will be built within the Next.js application, utilizing **Zustand** for state management as per **ADR-004**. The implementation will follow the specified naming conventions and error handling patterns.

## Detailed Design

### Services and Modules

| Service/Module | Location | Responsibilities | Owner |
| :--- | :--- | :--- | :--- |
| **Auth Service** | `apps/api` | Handles user registration, login (email/Google), JWT validation, and secure interaction with Supabase Auth. | Backend |
| **User & Goals Service** | `apps/api` | Manages CRUD operations for user profiles, goals, and preferences. | Backend |
| **Onboarding Service** | `apps/api` | Processes and stores the data collected during the conversational onboarding flow. | Backend |
| **Auth UI Module** | `apps/web` | Provides all frontend components for authentication screens (Welcome, Login, Sign-up) as defined in Flow 1. | Frontend |
| **Onboarding UI Module**| `apps/web` | Implements the multi-step conversational UI for the goal and preference setup (Flow 2). | Frontend |
| **Profile UI Module** | `apps/web` | Contains components for viewing and editing user profile information (Story 1.4). | Frontend |
| **API Client Service** | `apps/web` | A centralized client-side service (`/src/lib/api.ts`) for making structured requests to the FastAPI backend. | Frontend |
| **Auth State (Zustand)** | `apps/web` | A Zustand store (`/src/store/auth.ts`) to manage global authentication state (user object, JWT, loading status). | Frontend |

### Data Models and Contracts

Data will be stored in Supabase (PostgreSQL). The following tables are required for Epic 1. Column names adhere to the `snake_case` convention.

**Table: `Users`** (Extends Supabase's `auth.users`)
*   `id` (uuid, PK, FK to `auth.users.id`): Primary key, linked to the authentication user.
*   `email` (varchar): User's email address.
*   `unit_preference` (varchar, default: 'kg'): User's preferred unit for weight (e.g., 'kg', 'lbs').
*   `updated_at` (timestamp with time zone): Timestamp of the last profile update.

**Table: `Goals`**
*   `id` (uuid, PK): Primary key for the goal entry.
*   `user_id` (uuid, FK to `Users.id`): Foreign key linking to the user.
*   `primary_goal` (text): The user's main fitness objective (e.g., "Build Muscle", "Lose Weight").
*   `training_frequency` (integer): Desired number of workouts per week.
*   `training_duration` (integer): Preferred duration of each workout in minutes.
*   `injuries_limitations` (text, nullable): Any physical limitations mentioned by the user.
*   `created_at` (timestamp with time zone): Timestamp of when the goal was set.

**Table: `Equipment`**
*   `id` (uuid, PK): Primary key.
*   `user_id` (uuid, FK to `Users.id`): Foreign key linking to the user.
*   `name` (varchar): The name of the piece of equipment (e.g., "Dumbbells", "Treadmill").

### APIs and Interfaces

All endpoints are prefixed with `/api/v1`. The backend will use Pydantic models for request/response validation.

*   **`POST /auth/register`**
    *   **Request:** `{ "email": "...", "password": "..." }`
    *   **Response (Success):** `{ "data": { "user": { ... }, "access_token": "..." } }`
    *   **Response (Error):** `{ "error": { "message": "...", "code": "..." } }`
*   **`POST /auth/login`**
    *   **Request:** `{ "email": "...", "password": "..." }`
    *   **Response (Success):** `{ "data": { "access_token": "..." } }`
*   **`GET /auth/google`**
    *   Initiates the Google OAuth flow. Redirects to Google's consent screen.
*   **`GET /auth/callback`**
    *   Handles the callback from Google. On success, returns an access token.
*   **`POST /onboarding`**
    *   **Request:** A JSON object containing all data from the conversational onboarding flow (goals, equipment, etc.).
    *   **Response (Success):** `{ "data": { "message": "Onboarding complete" } }`
*   **`GET /users/me`**
    *   **Headers:** `Authorization: Bearer <access_token>`
    *   **Response (Success):** `{ "data": { "id": "...", "email": "...", "unit_preference": "kg", "goals": [...] } }`
*   **`PUT /users/me`**
    *   **Headers:** `Authorization: Bearer <access_token>`
    *   **Request:** A JSON object with the fields to update (e.g., `unit_preference`).
    *   **Response (Success):** `{ "data": { ...updated_user_profile } }`

### Workflows and Sequencing

1.  **New User Registration (Email):**
    1.  User clicks "Create Account" on the Welcome Screen (Flow 1).
    2.  Frontend displays the Email Sign-up form.
    3.  User submits credentials.
    4.  Frontend calls `POST /auth/register`.
    5.  Backend validates and creates the user in Supabase Auth.
    6.  Backend returns a JWT.
    7.  Frontend stores the JWT and navigates the user to the Onboarding Flow (Flow 2).
2.  **Conversational Onboarding:**
    1.  User is presented with a series of questions (Flow 2).
    2.  User provides answers for goals, preferences, equipment, etc.
    3.  At the end of the flow, the frontend sends all collected data to `POST /onboarding`.
    4.  Backend saves the data to the `Goals` and `Equipment` tables.
    5.  User is redirected to the main Dashboard.
3.  **User Login (Email):**
    1.  User clicks "Log In" on the Welcome Screen.
    2.  Frontend displays the Email Login form.
    3.  User submits credentials.
    4.  Frontend calls `POST /auth/login`.
    5.  Backend validates credentials with Supabase Auth and returns a JWT.
    6.  Frontend stores the JWT and navigates the user to the main Dashboard.

## Non-Functional Requirements

### Performance

-   **API Response Time:** All non-AI API endpoints for this epic (e.g., auth, user profile) MUST have a p95 latency of < 300ms.
-   **Frontend Load Time:** The initial load time for the web application (FCP - First Contentful Paint) should be under 2 seconds on a standard broadband connection.
-   **Implementation:** The backend will leverage FastAPI's asynchronous capabilities. The frontend will use Next.js's automatic code-splitting and lazy loading for components not needed in the initial render.

### Security

-   **Authentication:** All user authentication will be handled by **Supabase Auth**, as specified in the architecture. This includes secure password hashing and management of OAuth flows.
-   **Authorization:** All API endpoints retrieving or modifying user-specific data (e.g., `/users/me`) MUST be protected and require a valid JWT `Bearer` token. Backend logic will validate that the user ID in the token matches the requested resource.
-   **Data Validation:** All incoming data to the API will be strictly validated using **Pydantic** models to prevent injection attacks and ensure data integrity.
-   **Secrets:** All secrets (API keys, database connection strings) will be managed via environment variables and MUST NOT be hardcoded in the source code.

### Reliability/Availability

-   **Error Handling:** The frontend will use **React Error Boundaries** to prevent application crashes from isolated component errors, displaying a user-friendly fallback UI instead.
-   **API Errors:** The FastAPI backend will return errors in a standardized JSON format (`{"error": {"message": "...", "code": "..."}}`), allowing the frontend to handle them gracefully.
-   **Database:** System reliability is dependent on Supabase's managed service uptime.

### Observability

-   **Structured Logging:** All services (frontend and backend) will use **structured JSON logging** to the console, as defined in the architecture.
-   **Log Content:** Logs should include a timestamp, log level (`INFO`, `WARN`, `ERROR`), a clear message, and relevant contextual information such as `userId` or `traceId` where applicable.
-   **Monitoring:** Basic monitoring will be provided by the deployment platforms (Vercel for frontend, Fly.io/Render for backend).

## Dependencies and Integrations

### Core Dependencies

| Dependency | Version | Location | Purpose |
| :--- | :--- | :--- | :--- |
| Next.js | `^14.x` | `apps/web` | Frontend framework |
| React | `^18.x` | `apps/web` | UI library |
| Tailwind CSS | `^3.x` | `apps/web` | CSS styling |
| Zustand | `^4.x` | `apps/web` | Frontend state management |
| FastAPI | `^0.104.x`| `apps/api` | Backend API framework |
| Pydantic | `^2.x` | `apps/api` | Data validation |
| supabase-py | `^2.x` | `apps/api` | Python client for Supabase |
| supabase-js | `^2.x` | `apps/web` | JS client for Supabase |

### Integrations

-   **Supabase:** Used as the primary external service for:
    -   **Authentication:** Manages all user identities, including email/password and Google OAuth.
    -   **Database:** Provides the managed PostgreSQL database for storing all user data, goals, and equipment.
-   **Google Cloud / Google Identity:** Used as an external identity provider for the OAuth 2.0 authentication flow.

## Acceptance Criteria (Authoritative)

The acceptance criteria are derived directly from the stories defined in `epics.md`.

**Story 1.1: Project Setup & Core Infrastructure**
1.  **AC1.1.1:** A Next.js project structure is created in `apps/web` using the `create-next-app` command.
2.  **AC1.1.2:** A FastAPI directory is created at `apps/api`.
3.  **AC1.1.3:** The `package.json` file is configured for a monorepo setup.

**Story 1.2: User Authentication - Email & Google OAuth**
4.  **AC1.2.1:** The Welcome screen provides options for email/password and Google authentication.
5.  **AC1.2.2:** A new user can successfully register with a valid email and password.
6.  **AC1.2.3:** A returning user can successfully log in with a valid email and password.
7.  **AC1.2.4:** A user can successfully authenticate using their Google account via the OAuth flow.
8.  **AC1.2.5:** Upon successful authentication, new users are redirected to the Onboarding flow, and returning users are redirected to the Dashboard.
9.  **AC1.2.6:** All authentication is handled by Supabase Auth, and user data is stored in the Supabase `Users` table.

**Story 1.3: Conversational Onboarding - Goals & Preferences**
10. **AC1.3.1:** New users are guided through a multi-step conversational UI after their first authentication.
11. **AC1.3.2:** The UI allows users to select their primary fitness goal, training frequency, duration, and available equipment.
12. **AC1.3.3:** The UI provides a visual progress indicator during the onboarding process.
13. **AC1.3.4:** All collected onboarding data is correctly stored in the `Goals` and `Equipment` tables in Supabase, linked to the user.

**Story 1.4: User Profile Management**
14. **AC1.4.1:** A logged-in user can navigate to a profile management page.
15. **AC1.4.2:** The page displays the user's current goals, equipment, and personal information.
16. **AC1.4.3:** The user can successfully modify their details, and the changes are persisted in the database.

## Traceability Mapping

| AC ID | Spec Section(s) | Component(s) / API(s) | Test Idea |
| :--- | :--- | :--- | :--- |
| AC1.2.1 | APIs, Workflows | `Auth UI Module` | E2E test (Playwright): Verify buttons are visible on the welcome screen. |
| AC1.2.2 | APIs, Data Models | `POST /auth/register`, `Auth Service` | Integration test: Call register endpoint with valid data, check for user creation in test DB. |
| AC1.2.3 | APIs, Data Models | `POST /auth/login`, `Auth Service` | Integration test: Call login endpoint with credentials of a seeded user, check for JWT. |
| AC1.2.4 | APIs, Integrations | `GET /auth/google`, Supabase Integration | E2E test (mocked OAuth): Mock the Google OAuth callback and verify the user is logged in. |
| AC1.3.1 | Workflows | `Onboarding UI Module` | E2E test: After login as a new user, verify redirection to the onboarding flow. |
| AC1.3.2 | APIs, Data Models | `Onboarding UI Module` | Component test (RTL): Verify that selecting options in the UI updates the component's state. |
| AC1.3.4 | APIs, Data Models | `POST /onboarding`, `User & Goals Service` | Integration test: Call onboarding endpoint with sample data, check for data persistence in test DB. |
| AC1.4.2 | APIs | `GET /users/me`, `Profile UI Module` | Integration test: Call `GET /users/me` for a seeded user and verify the response matches the seed data. |
| AC1.4.3 | APIs | `PUT /users/me`, `User & Goals Service` | Integration test: Call `PUT /users/me` to update a field, then call `GET /users/me` to verify the change. |

## Risks, Assumptions, Open Questions

-   **Risk:** A service outage at Supabase could block all authentication and data access, making the application unusable.
    -   **Mitigation:** The application should handle API failures gracefully. A global error handler will display a user-friendly "Our services are temporarily unavailable" message. We will monitor the Supabase status page during any incidents.
-   **Assumption:** Users will have modern, JavaScript-enabled browsers. The application is not required to support legacy browsers like Internet Explorer.
-   **Assumption:** The initial project setup via `create-next-app` will be sufficient and not require significant ejection or custom configuration for Epic 1.
-   **Question:** What is the desired behavior if a user abandons the onboarding flow midway through?
    -   **Decision for now:** Progress is not saved. If the user returns, they will restart the onboarding flow. This can be revisited in a future epic if user feedback indicates a need for saved progress.

## Test Strategy Summary

The testing strategy will follow the three-tiered approach defined in the architecture document to ensure comprehensive coverage.

-   **Unit Tests (Jest & React Testing Library):**
    -   Individual React components within the `Auth UI`, `Onboarding UI`, and `Profile UI` modules will be tested to verify they render correctly and handle user input.
    -   Utility functions and state management logic in Zustand stores will be tested in isolation.
-   **Integration Tests (Pytest):**
    -   Each FastAPI endpoint (`/auth`, `/onboarding`, `/users`) will be tested.
    -   Tests will validate business logic, Pydantic data validation, and interactions with a dedicated test database to ensure data is stored and retrieved correctly.
-   **End-to-End Tests (Playwright):**
    -   A full user journey will be tested: registration -> completing the onboarding flow -> logging out -> logging back in -> viewing the profile page.
    -   The Google OAuth flow will be tested using Playwright's ability to mock external requests.
