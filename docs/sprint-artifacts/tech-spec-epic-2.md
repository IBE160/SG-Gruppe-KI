# Epic Technical Specification: {{epic_title}}

Date: {{date}}
Author: {{user_name}}
Epic ID: {{epic_id}}
Status: Draft

---

## Overview

This document provides the technical specification for Epic 2: AI-Powered Training & Logging. This epic is the core of the application's value proposition, focusing on the implementation of the AI-driven daily plan generation, the interactive workout player for real-time logging, and the progress dashboard for tracking performance. It enables the adaptive training loop where user context and performance directly influence the AI's suggestions.

## Objectives and Scope

### In-Scope
- Story 2.1: Developing the backend API endpoint (`/plans/generate`) to generate a structured daily workout plan using the AI model, based on user profile, history, and context.
- Story 2.2: Implementing the frontend "Context Window" for users to input daily qualitative data (mood, energy, soreness).
- Story 2.3: Creating the UI for users to review, approve, or edit the AI-generated daily plan.
- Story 2.4: Building the core Workout Player UI for performing and logging exercises in real-time (reps, weight, RPE).
- Story 2.5: Developing the Progress Dashboard to display key metrics, workout streaks, and a weekly review summary.
- Story 2.6: Implementing subtle in-app reminders and nudges related to the user's training plan.

### Out-of-Scope
- User authentication and onboarding (handled in Epic 1).
- Spotify integration and music features (handled in Epic 3).
- Advanced settings, offline mode, and account management (handled in Epic 4).

## System Architecture Alignment

This epic is a direct implementation of the **"Adaptive Workout Dialogue"** pattern defined in `architecture.md`. The `AI Orchestrator` service in the FastAPI backend will be built to construct prompts for the OpenAI API, fulfilling Story 2.1. The frontend will implement the `Context Window` and `Plan Review UI` components. All workout data will be stored in new Supabase tables (`WorkoutPlans`, `WorkoutLogs`), adhering to the project's data architecture. The implementation will leverage the existing monorepo structure and follow all established conventions for API design, error handling, and state management (Zustand).

## Detailed Design

### Services and Modules

| Service/Module | Location | Responsibilities | Owner |
| :--- | :--- | :--- | :--- |
| **AI Orchestrator** | `apps/api` | Implements the "Adaptive Workout Dialogue" logic. Fuses user context, history, and goals to construct prompts for the AI model. | Backend |
| **Plan Service** | `apps/api` | Manages CRUD operations for `WorkoutPlans`, including storing the generated plan from the AI. | Backend |
| **Log Service** | `apps/api` | Manages CRUD operations for `WorkoutLogs`, receiving real-time data from the workout player. | Backend |
| **Dashboard Service** | `apps/api` | Provides aggregated data and insights for the user's progress dashboard. | Backend |
| **Context Window UI** | `apps/web` | Implements the frontend components for the daily context window (Flow 6). | Frontend |
| **Plan Review UI**| `apps/web` | Displays the AI-generated plan for user review and confirmation (Flow 6). | Frontend |
| **Workout Player UI** | `apps/web` | The main interactive interface for performing and logging a workout (Flow 7, 9). | Frontend |
| **Dashboard UI** | `apps/web` | Renders the widgets and charts for the user's progress dashboard (Flow 14). | Frontend |
| **Workout State (Zustand)** | `apps/web` | A new Zustand store (`/src/store/workout.ts`) to manage the complex state of an active workout session. | Frontend |

### Data Models and Contracts

The following new tables are required for Epic 2.

**Table: `WorkoutPlans`**
*   `id` (uuid, PK): Primary key for the plan.
*   `user_id` (uuid, FK to `Users.id`): Foreign key linking to the user.
*   `plan_date` (date): The date for which the plan is intended.
*   `plan_details` (jsonb): The structured workout plan (exercises, sets, reps, etc.) as a JSON object.
*   `ai_explanation` (text, nullable): The human-readable explanation from the AI for any adaptations made.
*   `is_confirmed` (boolean, default: false): Flag indicating if the user has confirmed the plan.
*   `created_at` (timestamp with time zone).

**Table: `WorkoutLogs`**
*   `id` (uuid, PK): Primary key for the log entry.
*   `user_id` (uuid, FK to `Users.id`): Foreign key linking to the user.
*   `plan_id` (uuid, FK to `WorkoutPlans.id`): Foreign key linking to the parent workout plan.
*   `exercise_name` (varchar): The name of the exercise performed.
*   `set_number` (integer): The number of the set within the exercise.
*   `target_reps` (integer, nullable): The suggested number of reps.
*   `actual_reps` (integer): The actual number of reps performed.
*   `target_weight` (decimal, nullable): The suggested weight.
*   `actual_weight` (decimal): The actual weight used.
*   `rpe` (decimal): The Rate of Perceived Exertion for the set.
*   `completed_at` (timestamp with time zone): Timestamp for when the set was logged.

### APIs and Interfaces

*   **`POST /plans/generate`**
    *   **Headers:** `Authorization: Bearer <access_token>`
    *   **Request:** `{ "context": { "mood": "...", "energy": "...", "soreness": "..." } }`
    *   **Response (Success):** `{ "data": { ...workout_plan } }`
*   **`POST /plans/{planId}/confirm`**
    *   **Headers:** `Authorization: Bearer <access_token>`
    *   **Response (Success):** `{ "data": { "message": "Plan confirmed" } }`
*   **`POST /logs`**
    *   **Headers:** `Authorization: Bearer <access_token>`
    *   **Request:** A single log entry object or an array of log entries.
    *   **Response (Success):** `{ "data": { "message": "Log(s) saved" } }`
*   **`GET /dashboard`**
    *   **Headers:** `Authorization: Bearer <access_token>`
    *   **Response (Success):** `{ "data": { "total_volume": "...", "workout_streaks": "...", "prs": [...] } }`

### Workflows and Sequencing

1.  **AI Daily Plan Generation:**
    1.  User interacts with the **Context Window UI** on the dashboard.
    2.  Frontend sends the context data to `POST /plans/generate`.
    3.  Backend's **AI Orchestrator** service constructs a prompt using the context and user history, then calls the OpenAI API.
    4.  The generated plan is stored in the `WorkoutPlans` table.
    5.  The plan is returned to the frontend and displayed in the **Plan Review UI**.
    6.  User confirms the plan, triggering a call to `POST /plans/{planId}/confirm`.
2.  **Workout Logging:**
    1.  User starts the confirmed workout. The **Workout Player UI** loads.
    2.  For each completed set, the user inputs reps, weight, and RPE.
    3.  The frontend sends the log data to the `POST /logs` endpoint in near real-time.
    4.  The backend's **Log Service** saves the data to the `WorkoutLogs` table.
3.  **Dashboard View:**
    1.  User navigates to the Dashboard.
    2.  The frontend calls `GET /dashboard`.
    3.  The backend's **Dashboard Service** aggregates data from `WorkoutLogs` and returns key metrics.
    4.  The **Dashboard UI** renders the metrics and visualizations.

## Non-Functional Requirements

### Performance

-   **AI Latency:** The `p95` latency for the `/plans/generate` endpoint, including the call to the external AI model, MUST be ≤ 10 seconds.
-   **API Response Time:** All other non-AI API endpoints for this epic MUST have a `p95` latency of < 300ms.
-   **Frontend Interaction:** UI interactions within the workout player (e.g., logging a set) must feel instantaneous, with feedback appearing in < 200ms.

### Security

-   **Data Segregation:** All database queries for plans and logs MUST be strictly segregated by `user_id` using Row Level Security (RLS) policies in Supabase.
-   **AI Prompt Injection:** The `AI Orchestrator` service must sanitize any free-text user inputs incorporated into prompts sent to the AI model to mitigate the risk of prompt injection attacks.

### Reliability/Availability

-   **AI Service Failure:** If the external AI model API is unavailable or fails, the `/plans/generate` endpoint should gracefully return an error or offer a default, non-AI-generated workout plan as a fallback.
-   **Workout State:** The frontend must persist the active workout state in local storage to prevent data loss if the user accidentally closes the tab or the browser crashes.

### Observability

-   **AI Interaction Logging:** The `AI Orchestrator` will log the prompt sent to the AI model and the raw response received for debugging and analysis. Sensitive user data will be redacted from these logs.

## Dependencies and Integrations

### Core Dependencies
(No change from Epic 1)

### Integrations

-   **Supabase:** Continues to be the primary service for authentication and database storage.
-   **OpenAI API:** A new, critical integration. Used by the `AI Orchestrator` service to generate personalized workout plans.

## Acceptance Criteria (Authoritative)

**Story 2.1: AI Daily Plan Generation API**
1.  **AC2.1.1:** A `POST /plans/generate` endpoint is created in the FastAPI backend.
2.  **AC2.1.2:** The endpoint constructs a prompt and successfully calls the OpenAI API to generate a workout plan in a structured JSON format.
3.  **AC2.1.3:** The generated plan is stored in the `WorkoutPlans` table.
4.  **AC2.1.4:** The endpoint includes an `ai_explanation` in the response if the plan was adapted based on user context.

**Story 2.2: Daily Plan Context Window**
5.  **AC2.2.1:** A "Context Window" UI is available on the dashboard for the user to input mood, energy, and soreness.
6.  **AC2.2.2:** Submitting the context triggers a call to the `/plans/generate` endpoint.

**Story 2.3: Display & Review Daily Plan**
7.  **AC2.3.1:** The AI-generated plan is displayed to the user in a clear, readable format.
8.  **AC2.3.2:** Any AI adaptations are visually highlighted with the corresponding explanation.
9.  **AC2.3.3:** The user has options to `[ Confirm Plan ]` or `[ Edit Plan ]`.

**Story 2.4: Workout Player Core UI & Logging**
10. **AC2.4.1:** A "Start Workout" button initiates the Workout Player UI.
11. **AC2.4.2:** The UI allows users to log reps, weight, and RPE for each set.
12. **AC2.4.3:** Logged data is sent to the `POST /logs` endpoint and stored in the `WorkoutLogs` table.

**Story 2.5: Progress Dashboard Display**
13. **AC2.5.1:** The dashboard displays key metrics like total volume and workout streaks based on data from `WorkoutLogs`.
14. **AC2.5.2:** A "Weekly Review" section shows trends and AI-generated insights.

## Traceability Mapping

| AC ID | Spec Section(s) | Component(s) / API(s) | Test Idea |
| :--- | :--- | :--- | :--- |
| AC2.1.2 | APIs, Services | `AI Orchestrator`, OpenAI API | Integration test: Mock the OpenAI API response and verify that the orchestrator correctly parses it and stores it. |
| AC2.2.2 | Workflows, APIs | `Context Window UI`, `POST /plans/generate` | E2E test: Input data into the context window, click submit, and verify the network request is sent. |
| AC2.4.2 | Data Models, APIs | `Workout Player UI`, `POST /logs` | E2E test: In the workout player, log a set and verify the `POST /logs` request contains the correct data. |
| AC2.5.1 | Services, APIs | `Dashboard UI`, `GET /dashboard` | Integration test: Seed the test DB with logs, call `GET /dashboard`, and verify the aggregated data is correct. |

## Risks, Assumptions, Open Questions

-   **Risk:** The OpenAI API may have high latency or become unavailable, impacting the core user experience.
    -   **Mitigation:** Implement a strict timeout (e.g., 10 seconds) on the API call. If it fails or times out, the API will respond with an error and the frontend will offer a pre-defined default workout plan.
-   **Risk:** The AI model may return an improperly formatted JSON object or nonsensical workout advice.
    -   **Mitigation:** The backend will perform strict validation on the AI's response using Pydantic models. If validation fails, the API will return an error. The frontend will include a "Report an issue with this plan" button for users.
-   **Assumption:** The initial prompt engineering for the AI model will be sufficient to produce coherent and safe workout plans. The prompt will need to be refined based on user feedback.

## Test Strategy Summary

The test strategy extends the existing three-tiered approach.

-   **Unit Tests:** Will cover new UI components in the `Workout Player` and `Dashboard`, and business logic within the backend services (e.g., prompt construction in the `AI Orchestrator`).
-   **Integration Tests:**
    -   Crucially, tests for the `AI Orchestrator` will mock the OpenAI API call to ensure the service behaves correctly with various expected AI responses (and failures).
    -   Tests for the `Log Service` and `Dashboard Service` will validate database interactions and data aggregation logic.
-   **End-to-End Tests:** A new Playwright test will cover the entire flow: submitting the context window -> reviewing the (mocked) AI plan -> starting the workout -> logging several sets -> finishing the workout -> verifying the dashboard reflects the new data.
