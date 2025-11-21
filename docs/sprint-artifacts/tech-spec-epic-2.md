# Epic Technical Specification: AI-Powered Training & Logging

Date: 2025-11-21
Author: BIP
Epic ID: 2
Status: Draft

---

## Overview

This epic focuses on implementing the core AI daily plan generation, workout player, and progress tracking capabilities of the AI-Powered Personal Training Advisor. Its primary goal is to deliver personalized and adaptive training experiences by leveraging AI to generate plans based on user context and enabling comprehensive logging and progress visualization.

## Objectives and Scope

**In-Scope:**
*   Implementation of the Context Window UI for daily user input (mood, energy, soreness) (FR009).
*   Development of the FastAPI endpoint for AI daily workout plan generation, including prompt construction and interaction with the OpenAI API (FR002).
*   Display of the generated daily workout plan on the frontend (derived from FR002).
*   Creation of the Workout Player UI, guiding users through exercises (FR003).
*   Implementation of workout logging functionality (reps, weight, RPE) and persistence to the database (FR003).
*   Development of a basic Progress Dashboard to visualize workout volume, streaks, and other metrics (FR004).
*   Integration of simulated recovery inputs to validate AI adaptation (FR010).
*   Implementation of an automated Weekly Review Ritual (FR011).

**Out-of-Scope:**
*   Advanced AI model training or fine-tuning beyond prompt engineering.
*   Complex data analytics or predictive modeling in the Progress Dashboard.
*   Real-time biometric data integration for recovery (simulated inputs are in scope).
*   Any features related to user authentication, profile management, or Spotify integration (these are covered in other epics).

## System Architecture Alignment

This epic aligns with several key architectural decisions outlined in `architecture.md`:
*   **Frontend (Next.js):** Utilized for the development of UI components such as the Context Window, Workout Player, and Progress Dashboard (ADR: Frontend Framework).
*   **Backend (FastAPI):** Serves as the primary API layer for handling requests related to AI plan generation, workout logging, and data retrieval for the dashboard (ADR: Backend Framework).
*   **Database (Supabase PostgreSQL):** Used for persistent storage of `daily_contexts`, `workout_plans` (including the AI-generated JSON), and `workout_logs` (ADR: Data Architecture).
*   **AI Model Serving (OpenAI API):** Integrated via the FastAPI backend for generating and adapting workout plans (ADR: AI Model Serving).
*   **Background Job Processing (Celery with Redis):** Leveraged for asynchronous tasks, particularly the automated Weekly Review Ritual (ADR: Background Job Processing).
*   **Offline Data Sync (IndexedDB + Outbox Pattern):** Enables offline workout logging and plan access, crucial for the Workout Player and logging functionality (ADR: Offline Data Sync).
## Detailed Design

### Services and Modules

### Services and Modules

*   **Frontend (Next.js Application):**
    *   **Context Window Module:** UI for user daily input (mood, energy, soreness). Submits data to `Daily Context API`.
    *   **Workout Plan Display Module:** Renders the AI-generated daily workout plan. Fetches data from `Workout Plan API`.
    *   **Workout Player Module:** Interactive UI to guide user through exercises, display current set/reps, rest timers. Interacts with `Workout Log API`. Handles offline logging with IndexedDB.
    *   **Progress Dashboard Module:** Visualizes user progress (volume, streaks, stats). Fetches data from `Workout Log API` (via Backend Progress Service).

*   **Backend (FastAPI Application):**
    *   **Daily Context API (`app/api/v1/daily_context.py`):** Endpoints for creating and retrieving daily context entries. Persists to `daily_contexts` table.
    *   **AI Plan Generation Service (`app/services/ai_plan_service.py`):** Orchestrates data fetching (user profile, daily context, workout history), constructs prompts, calls OpenAI API, validates response, and stores `plan_json` in `workout_plans` table. Utilizes AI Response Cache (Redis).
    *   **Workout Plan API (`app/api/v1/workout_plans.py`):** Endpoints for requesting new plans, retrieving existing daily plans, and potentially updating plan status.
    *   **Workout Log API (`app/api/v1/workout_logs.py`):** Endpoints for receiving and persisting individual set logs (reps, weight, RPE) to `workout_logs` table. Handles offline sync via Outbox Pattern.
    *   **Progress Data Service (`app/services/progress_service.py`):** Aggregates data from `workout_logs` to calculate metrics for the Progress Dashboard.
    *   **Weekly Review Service (`app/services/weekly_review_service.py`):** Background task (Celery) to generate automated weekly summaries.

### Data Models and Contracts

### Data Models and Contracts

*   **`workout_plans` table:**
    *   `id` (UUID, Primary Key): Unique identifier for the workout plan.
    *   `user_id` (UUID, Foreign Key to `users.id`): Links the plan to a user.
    *   `plan_date` (DATE, UNIQUE for user_id and date): The date for which this plan is scheduled.
    *   `plan_json` (JSONB): Stores the complete, versioned AI-generated workout plan structure. (See `Architecture.md` for schema).
    *   `status` (TEXT): The current status of the plan (e.g., 'generated', 'completed', 'skipped').
    *   `created_at`, `updated_at` (TIMESTAMP WITH TIME ZONE): Timestamps.

*   **`workout_logs` table:**
    *   `id` (UUID, Primary Key): Unique identifier for the log entry.
    *   `user_id` (UUID, Foreign Key to `users.id`): Links the log to a user.
    *   `workout_plan_id` (UUID, Foreign Key to `workout_plans.id`, NULLABLE): Links the log to a specific plan.
    *   `exercise_name` (TEXT): Name of the exercise performed.
    *   `set_number` (INTEGER): The set number for this exercise.
    *   `reps_completed` (INTEGER): Number of repetitions completed.
    *   `weight_used` (NUMERIC): Weight used for the set.
    *   `rpe_logged` (INTEGER): User's logged Rate of Perceived Exertion.
    *   `log_time` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW()): Timestamp of when the set was logged.
    *   `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW()): Timestamp of log creation.

*   **`daily_contexts` table:**
    *   `id` (UUID, Primary Key): Unique identifier for the daily context entry.
    *   `user_id` (UUID, Foreign Key to `users.id`): Links the context to a user.
    *   `context_date` (DATE, UNIQUE for user_id and date): The date this context applies to.
    *   `mood` (TEXT): User's self-reported mood.
    *   `energy` (TEXT): User's self-reported energy level.
    *   `soreness` (TEXT): User's self-reported muscle soreness.
    *   `notes` (TEXT): Any additional notes from the user for the day.
    *   `created_at`, `updated_at` (TIMESTAMP WITH TIME ZONE): Timestamps.

*   **AI Workout Plan JSON Structure (Contract):**
    *   Defined in `Architecture.md`, specifying the structure generated by the AI and stored in `workout_plans.plan_json`. This is the contract for frontend rendering.

### APIs and Interfaces

### APIs and Interfaces

*   **Daily Context Endpoints (FastAPI `app/api/v1/daily_context.py`):**
    *   `POST /api/v1/daily_context`:
        *   **Description:** Creates or updates a daily context entry for the authenticated user.
        *   **Request Body:** `{ "mood": "string", "energy": "string", "soreness": "string", "notes": "string" }`
        *   **Response (201 Created):** `{ "message": "success", "data": { "id": "uuid", "context_date": "date", ... } }`
    *   `GET /api/v1/daily_context/{date}`:
        *   **Description:** Retrieves the daily context for a specific date.
        *   **Response (200 OK):** `{ "message": "success", "data": { "id": "uuid", "context_date": "date", ... } }`

*   **Workout Plan Endpoints (FastAPI `app/api/v1/workout_plans.py`):**
    *   `POST /api/v1/workout_plans/generate`:
        *   **Description:** Triggers AI to generate a new workout plan for the current day.
        *   **Request Body:** (Optional) `{ "force_regenerate": "boolean", "simulated_recovery_data": { "hrv": "float", "sleep": "int" } }`
        *   **Response (201 Created):** `{ "message": "success", "data": { "id": "uuid", "plan_date": "date", "plan_json": { ... } } }`
    *   `GET /api/v1/workout_plans/{date}`:
        *   **Description:** Retrieves the AI-generated workout plan for a specific date.
        *   **Response (200 OK):** `{ "message": "success", "data": { "id": "uuid", "plan_date": "date", "plan_json": { ... } } }`

*   **Workout Log Endpoints (FastAPI `app/api/v1/workout_logs.py`):**
    *   `POST /api/v1/workout_logs`:
        *   **Description:** Logs a single set of an exercise.
        *   **Request Body:** `{ "workout_plan_id": "uuid", "exercise_name": "string", "set_number": "int", "reps_completed": "int", "weight_used": "float", "rpe_logged": "int" }`
        *   **Response (201 Created):** `{ "message": "success", "data": { "id": "uuid", ... } }`
    *   `GET /api/v1/workout_logs/summary`:
        *   **Description:** Retrieves aggregated workout log data for the progress dashboard.
        *   **Query Params:** `start_date`, `end_date`
        *   **Response (200 OK):** `{ "message": "success", "data": { "total_volume": "float", "workout_streaks": "int", "pr_history": [{...}] } }`

*   **OpenAI API:**
    *   **Interface:** `openai.ChatCompletion.create` (Python client library)
    *   **Inputs:** System Prompt, User Prompt (including user profile, daily context, workout history, and optional simulated recovery data).
    *   **Output:** JSON object adhering to the `workout_plans.plan_json` schema.

### Workflows and Sequencing

### Workflows and Sequencing

1.  **Daily Context Input (Story 2.1):**
    *   **Sequence:** User accesses Context Window (Frontend). Frontend displays input fields for mood, energy, soreness. User submits data. Frontend sends `POST /api/v1/daily_context` request. Backend saves to `daily_contexts` table.
    *   **Outcome:** User's daily state is recorded, providing input for AI plan adaptation.

2.  **AI Daily Plan Generation (Story 2.2, 2.7):**
    *   **Sequence:** User requests new plan (Frontend). Frontend sends `POST /api/v1/workout_plans/generate`.
    *   **Backend (`AI Plan Generation Service`):**
        *   Fetches user profile from `users` table.
        *   Fetches latest daily context from `daily_contexts` table.
        *   Retrieves recent workout history from `workout_logs` table.
        *   Constructs a comprehensive prompt for OpenAI (including simulated recovery data if provided by developer).
        *   Checks AI Response Cache (Redis) for a valid, existing plan. If found and valid, returns cached plan.
        *   If not cached or invalid, calls OpenAI API.
        *   Validates OpenAI's JSON response against schema.
        *   Saves valid `plan_json` to `workout_plans` table.
        *   Caches the response in Redis.
        *   Returns generated plan to frontend.
    *   **Outcome:** A personalized, adaptive daily workout plan is generated and persisted.

3.  **Display Daily Workout Plan (Story 2.3):**
    *   **Sequence:** After plan generation (or on dashboard load), frontend sends `GET /api/v1/workout_plans/{current_date}`. Backend retrieves plan from `workout_plans` table. Frontend renders the `plan_json` using the `Workout Plan Display Module`.
    *   **Outcome:** User can review their daily workout plan.

4.  **Workout Player Experience (Story 2.4, 2.5):**
    *   **Sequence:** User starts workout (Frontend `Workout Player Module`). UI guides through exercises, displaying current set, target reps/weight, and rest timers. For each completed set, user inputs actual reps, weight, RPE.
    *   **Frontend (`Workout Player Module`):**
        *   If offline, stores log entries in IndexedDB.
        *   If online, or upon reconnection, sends `POST /api/v1/workout_logs` requests for each set.
    *   **Backend (`Workout Log API`):** Receives log entries and saves to `workout_logs` table.
    *   **Outcome:** User completes workout, and all set-level data is accurately logged.

5.  **Basic Progress Dashboard (Story 2.6):**
    *   **Sequence:** User navigates to Progress Dashboard (Frontend). Frontend sends `GET /api/v1/workout_logs/summary?start_date=...&end_date=...`. Backend (`Progress Data Service`) queries `workout_logs`, aggregates data, and returns summary metrics. Frontend `Progress Dashboard Module` visualizes volume, streaks, and other stats.
    *   **Outcome:** User can track their performance over time.

6.  **Weekly Review Ritual (Story 2.8):**
    *   **Sequence:** (Background Job - Celery/Redis) A scheduled task runs at the end of each week. `Weekly Review Service` aggregates user's workout data for the week, identifies achievements, PRs, and trends. Generates a summary. Stores the summary (e.g., in a new `weekly_summaries` table or as a document).
    *   **Outcome:** User receives an automated, personalized weekly progress summary.

## Non-Functional Requirements

### Performance

### Performance

*   **AI Plan Generation Latency (NFR004):** P95 AI plan generation time must be ≤ 10s. This will be achieved through AI Response Caching (Redis) for frequently requested or similar plans.
*   **API Latency (NFR004):** P95 API response time for non-AI endpoints (daily context, workout logging, progress data retrieval) must be < 300ms.
*   **Offline Data Sync (NFR007):** Data logged offline must sync efficiently and reliably upon network reconnection, without noticeable delays for the user.
*   **Progress Dashboard Responsiveness:** The Progress Dashboard should load and render visualizations quickly, leveraging efficient database queries and potentially client-side caching (React Query).

### Security

### Security

*   **Authorization (NFR006):** Row-Level Security (RLS) will be strictly enforced on `workout_plans`, `workout_logs`, and `daily_contexts` tables to ensure users can only access and modify their own data.
*   **Data Integrity:** Mechanisms will be in place to ensure the integrity of AI-generated plans and logged workout data, preventing unauthorized modification.
*   **AI Prompt Security:** Prompts sent to the OpenAI API will be sanitized to prevent prompt injection vulnerabilities, although sensitive user data will not be directly passed in raw form.
*   **Rate Limiting (NFR009):** The AI plan generation endpoint will implement per-user and global rate limits to prevent abuse and ensure fair usage of the OpenAI API.

### Reliability/Availability

### Reliability/Availability

*   **AI Fallback (NFR008):** If AI plan generation fails or times out, a fallback mechanism will ensure a cached or rule-based plan is provided to the user to maintain continuity.
*   **Data Consistency (Offline):** The Outbox Pattern, combined with IndexedDB, will ensure data consistency for offline workout logging, guaranteeing that data is eventually synced to the backend upon reconnection.
*   **Background Jobs:** Celery with Redis will ensure reliable execution of background tasks like the Weekly Review Ritual, with retry mechanisms and error handling.
*   **Availability (NFR005):** The core APIs for daily context, workout plans, and logging should meet the 99% uptime target for Phase 1.

### Observability

### Observability

*   **Structured Logging (NFR008):** Comprehensive structured logging will be implemented for all AI interactions (prompts, responses, errors), workout logging, and daily context updates.
*   **Metrics (NFR008):** Key metrics will be collected and monitored:
    *   AI plan generation success rate and latency.
    *   Workout logging success rate.
    *   Offline sync success/failure rates.
    *   Redis cache hit/miss rates for AI responses.
*   **Alerting:** Alerts will be configured for critical failures in AI plan generation, persistent offline data sync issues, and anomalies in workout logging.

## Dependencies and Integrations

## Dependencies and Integrations

This epic heavily integrates with both internal and external services:

*   **Internal Dependencies:**
    *   **Supabase PostgreSQL Database:** Core dependency for all data persistence:
        *   `users` table (from Epic 1): For user profiles, goals, and equipment.
        *   `daily_contexts` table: Stores daily user input (mood, energy, soreness).
        *   `workout_plans` table: Stores AI-generated workout plans (JSONB structure).
        *   `workout_logs` table: Stores individual set logs (reps, weight, RPE).
    *   **Redis:** Utilized for:
        *   **AI Response Cache:** Caches OpenAI API responses to improve performance and reduce costs (ADR: AI Response Caching).
        *   **Celery Broker:** Acts as a message broker for Celery background tasks (ADR: Background Job Processing).
    *   **Celery (Background Job Processor):** Executes asynchronous tasks such as the Weekly Review Ritual (ADR: Background Job Processing).
    *   **Next.js Frontend:** Provides the UI for the Context Window, Workout Player, and Progress Dashboard.
    *   **FastAPI Backend:** Provides the API endpoints orchestrating AI interactions, data storage, and retrieval.

*   **External Dependencies:**
    *   **OpenAI API:** Provides the generative AI model for workout plan creation and adaptation (ADR: AI Model Serving).
*   **Novel Pattern Implementations:**
    *   **Offline Data Synchronization (IndexedDB + Outbox Pattern):** Enables robust offline logging within the Workout Player (ADR: Offline Data Sync).

## Acceptance Criteria (Authoritative)

## Acceptance Criteria (Authoritative)

### Story 2.1: Context Window for Daily Input
*   **AC 2.1.1:** Given an authenticated user on the dashboard, when they open the "Context Window", then they can input their mood, energy level, and any muscle soreness.
*   **AC 2.1.2:** And this data is saved to the `daily_contexts` table for the current date.

### Story 2.2: AI Daily Plan Generation
*   **AC 2.2.1:** Given a user has provided their daily context, when they request a new plan for the day, then the FastAPI backend constructs a prompt with the user's profile, daily context, and recent workout history.
*   **AC 2.2.2:** And the AI returns a valid JSON workout plan which is then saved to the `workout_plans` table.

### Story 2.3: Display Daily Workout Plan
*   **AC 2.3.1:** Given a workout plan has been generated for the day, when the user views their dashboard, then the workout plan is displayed in a clear and easy-to-understand format.

### Story 2.4: Workout Player UI
*   **AC 2.4.1:** Given a user starts a workout, when the workout player is launched, then it displays the current exercise, set number, target reps/weight, and a timer for rest periods.

### Story 2.5: Workout Logging
*   **AC 2.5.1:** Given a user is in the workout player, when they complete a set, then they can input the reps, weight, and RPE.
*   **AC 2.5.2:** And this data is saved to the `workout_logs` table.

### Story 2.6: Basic Progress Dashboard
*   **AC 2.6.1:** Given a user has completed one or more workouts, when they view their progress dashboard, then they can see visualizations of their total workout volume, workout streak, and other basic metrics.

### Story 2.7: Simulated Recovery Inputs
*   **AC 2.7.1:** Given the AI plan generation endpoint, when simulated recovery data is included in the prompt, then the generated workout plan is adjusted accordingly (e.g., lower volume for poor recovery).

### Story 2.8: Weekly Review Ritual
*   **AC 2.8.1:** Given a user has completed workouts during the week, when the week ends, then an automated summary is generated showing their progress, PRs, and other highlights.

## Traceability Mapping

## Traceability Mapping

| AC ID | Description (from Epic/Story) | Spec Section(s) | Component(s)/API(s) | Test Idea |
|---|---|---|---|---|
| 2.1.1 | User can input mood, energy, soreness in Context Window | Detailed Design: Services & Modules (Context Window Module) | Frontend Context Window, `POST /api/v1/daily_context` | UI test: open, input, verify display. |
| 2.1.2 | Data saved to `daily_contexts` table | Detailed Design: Data Models (`daily_contexts` table) | FastAPI Daily Context API, Supabase `daily_contexts` | Integration test: submit data via API, verify DB entry. |
| 2.2.1 | FastAPI constructs prompt with user profile, daily context, history | Detailed Design: Services & Modules (AI Plan Generation Service) | FastAPI AI Plan Generation Service, Supabase `users`, `daily_contexts`, `workout_logs` | Unit test: mock OpenAI call, verify prompt content. |
| 2.2.2 | AI returns valid JSON workout plan saved to `workout_plans` table | Detailed Design: Data Models (`workout_plans` table) | FastAPI AI Plan Generation Service, OpenAI API, Supabase `workout_plans` | Integration test: trigger plan generation, verify DB entry and JSON schema. |
| 2.3.1 | Workout plan displayed in clear format | Detailed Design: Services & Modules (Workout Plan Display Module) | Frontend Workout Plan Display, `GET /api/v1/workout_plans/{date}` | UI test: navigate to dashboard, verify plan rendering. |
| 2.4.1 | Workout player displays exercise, set, reps/weight, rest timer | Detailed Design: Services & Modules (Workout Player Module) | Frontend Workout Player | UI test: start workout, verify UI elements. |
| 2.5.1 | User can input reps, weight, RPE | Detailed Design: Services & Modules (Workout Player Module) | Frontend Workout Player | UI test: complete set, verify input fields. |
| 2.5.2 | Data saved to `workout_logs` table | Detailed Design: Data Models (`workout_logs` table) | FastAPI Workout Log API, Supabase `workout_logs` | Integration test: log set via API, verify DB entry. Offline test: log offline, reconnect, verify sync. |
| 2.6.1 | Progress dashboard shows volume, streaks, basic stats | Detailed Design: Services & Modules (Progress Dashboard Module) | Frontend Progress Dashboard, `GET /api/v1/workout_logs/summary` | UI test: view dashboard, verify visualizations. Integration test: populate logs, verify API summary. |
| 2.7.1 | Generated plan adjusted with simulated recovery data | Detailed Design: APIs and Interfaces (`POST /api/v1/workout_plans/generate` `simulated_recovery_data`) | FastAPI AI Plan Generation Service, OpenAI API | Unit/Integration test: call API with simulated data, verify plan changes. |
| 2.8.1 | Automated weekly summary generated | Detailed Design: Services & Modules (Weekly Review Service) | Celery, Redis | Integration test: simulate week end, verify summary generation. |

## Risks, Assumptions, Open Questions

## Risks, Assumptions, Open Questions

*   **Risks:**
    *   **OpenAI API Reliability/Latency:** Heavy reliance on external OpenAI API for plan generation introduces a single point of failure and potential latency issues, impacting NFR004. Fallback mechanisms and robust error handling are critical.
    *   **AI Output Quality & Consistency:** Ensuring the AI consistently generates safe, effective, and correctly formatted workout plans that adhere to user preferences and context (FR002) is a continuous challenge. Requires extensive testing and validation.
    *   **Offline Sync Complexities:** Implementing the IndexedDB and Outbox Pattern for reliable offline data synchronization for workout logs (FR007) can be complex, especially handling conflicts and ensuring data integrity.
    *   **Celery/Redis Operational Overhead:** Managing and monitoring Celery workers and Redis for background tasks (FR011) adds operational complexity.

*   **Assumptions:**
    *   OpenAI API will remain stable, responsive, and its pricing model suitable for the application's scale.
    *   The defined JSON schema for workout plans is sufficient to cover various exercise types and plan structures.
    *   Users will consistently provide accurate daily context information, and this input will be sufficient for meaningful AI adaptation.
    *   The "simulated recovery inputs" (FR010) are primarily for developer validation and not a user-facing feature requiring a complex UI.

*   **Open Questions:**
    *   What specific metrics or criteria will define a "good" AI-generated workout plan, and how will its quality be continuously evaluated?
    *   What is the strategy for handling schema evolution of the `plan_json` if future AI models or features require changes to the workout plan structure?
    *   Are there any specific user requirements for real-time feedback or adaptive changes within the Workout Player beyond just logging sets (e.g., dynamically changing reps mid-set)?
    *   What kind of user interface or notification will be used for the Weekly Review Ritual summary (e.g., in-app notification, email)?

## Test Strategy Summary

## Test Strategy Summary

The testing strategy for Epic 2 will focus heavily on validating AI model integration, data accuracy, and the robustness of the workout experience.

*   **Unit Tests:**
    *   **Frontend:** Test UI components for Context Window, Workout Plan Display, Workout Player controls, and Progress Dashboard visualizations using Jest/React Testing Library.
    *   **Backend:** Use Pytest for unit testing FastAPI endpoints (daily context, workout plans, workout logs), Pydantic schema validation, Supabase client interactions, and the `AI Plan Generation Service` logic (mocking OpenAI API calls).
*   **Integration Tests:**
    *   **AI Integration:** Test the `AI Plan Generation Service` with various user profiles, daily contexts, and simulated recovery inputs to ensure the OpenAI API calls are correctly formed and the responses adhere to the `plan_json` schema. Verify caching behavior with Redis.
    *   **Data Flow:** Test the complete data flow from frontend input (Context Window) to backend persistence (`daily_contexts` table), and from workout logging (Workout Player) to `workout_logs` table.
    *   **Offline Sync:** Dedicated integration tests for the IndexedDB and Outbox Pattern to verify reliable offline logging and subsequent synchronization with the backend.
    *   **Background Jobs:** Test Celery tasks (e.g., Weekly Review Ritual) to ensure they execute correctly and produce the expected outputs.
*   **API Tests:** Thorough API testing of all FastAPI endpoints related to Epic 2 using tools like Postman, ensuring correct request/response schemas, authentication, and authorization (RLS).
*   **End-to-End (E2E) Tests:** Use Playwright or Cypress for E2E scenarios covering:
    *   Submitting daily context, generating a plan, and starting/logging a workout.
    *   Viewing the Progress Dashboard after completing multiple workouts.
    *   Simulating offline scenarios for workout logging.
*   **AI Output Validation (Manual/Automated):**
    *   Manually review a sample of AI-generated workout plans to ensure safety, effectiveness, and adherence to user preferences.
    *   Develop automated checks to validate the structure and basic content of the `plan_json` against predefined rules.
*   **Performance Testing:** Conduct load tests on the `AI Plan Generation` endpoint and `Workout Log` endpoints to ensure they meet NFRs under expected load, specifically focusing on the AI p95 latency.
*   **Edge Case Testing:** Test scenarios like invalid input for daily context, incomplete workout logs, network disconnections during critical operations, and attempts to generate plans without sufficient user data.
