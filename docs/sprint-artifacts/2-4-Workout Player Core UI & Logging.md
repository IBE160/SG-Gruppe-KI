# Story 2.4: Workout Player Core UI & Logging

Status: ready-for-dev

## Story

As a user,
I want an intuitive interface to perform and log my workout sets (reps, weight, RPE) in real-time,
So that I can accurately track my progress.

### Requirements Context Summary

**Epic 2: AI-Powered Training & Logging**

**Story 2.4: Workout Player Core UI & Logging**

**Story Statement:**
As a user,
I want an intuitive interface to perform and log my workout sets (reps, weight, RPE) in real-time,
So that I can accurately track my progress.

**Acceptance Criteria (from tech-spec-epic-2.md):**
*   **AC2.4.1:** A "Start Workout" button initiates the Workout Player UI.
*   **AC2.4.2:** The UI allows users to log reps, weight, and RPE for each set.
*   **AC2.4.3:** Logged data is sent to the `POST /logs` endpoint and stored in the `WorkoutLogs` table.

**Architectural Constraints & Guidance (from architecture.md & tech-spec-epic-2.md):**
*   **Frontend (Next.js `apps/web`):**
    *   Responsible for implementing the "Workout Player UI".
    *   Utilizes Zustand (ADR-004) for managing the complex state of an active workout session.
    *   UI components for the Workout Player will reside within `apps/web/src/app/workout/` or a dedicated workout player directory.
    *   Communicates with the backend by sending logged data incrementally to the `POST /logs` endpoint.
*   **Backend (FastAPI `apps/api`):**
    *   Needs a `POST /logs` endpoint to receive and store workout log entries.
    *   The `Log Service` will manage CRUD operations for `WorkoutLogs`.
*   **Data Persistence (Supabase PostgreSQL):**
    *   Logged workout data will be stored in the `WorkoutLogs` table.
    *   RLS policies in Supabase will strictly segregate `WorkoutLogs` by `user_id`.
*   **Novel Architectural Pattern:** This story directly implements the interactive component of the "Adaptive Workout Dialogue" pattern, enabling real-time data capture.
*   **API Contracts:** Frontend will interact with the new `POST /logs` backend endpoint.
*   **Performance:** UI interactions within the workout player (e.g., logging a set) must feel instantaneous, with feedback appearing in < 200ms.
*   **Reliability:** The frontend must persist the active workout state in local storage to prevent data loss if the user accidentally closes the tab or the browser crashes.
*   **Testing:** Jest/React Testing Library for frontend UI, Pytest for backend API and service logic, Playwright for E2E tests covering real-time logging.

**UX/UI Context (from ux-design-direction.md & proposal.md):**
*   **Flow 7: Start Workout:**
    *   **Core User Journey:** User taps "Start Workout," sees a loading state, then proceeds to a pre-workout preparation screen that explicitly introduces the warm-up.
    *   **Key UX Direction:** Visual Loading Confirmation, Explicit Warm-up Phase.
*   **Flow 9: Perform & Log Workout:**
    *   **Core User Journey:** User performs a set, quickly logs reps/weight/RPE via optimized inputs, and enters a rest period where the next exercise is previewed. Allows on-the-fly modifications.
    *   **Key UX Direction:** Optimized Input for Reps/Weight/RPE (large buttons, sliders, smart pre-fills), Clear Next Exercise Preview, Visual Progress Cues, Integrated Mid-Workout Modification, Audio Cues/Guidance.

### Project Structure Alignment and Lessons Learned

**Based on Architectural Guidance:**

*   **Frontend (Next.js `apps/web`):**
    *   New UI components for the Workout Player will be created (e.g., `apps/web/src/app/workout/player.tsx`, `apps/web/src/components/WorkoutPlayer/SetLogger.tsx`).
    *   A new Zustand store (e.g., `apps/web/src/store/workoutStore.ts`) will manage the active workout session state, including current exercise, sets, reps, weight, RPE inputs, and timers.
    *   API utilities or hooks will be implemented to send logged data to the backend (e.g., `POST /api/v1/logs`).
*   **Backend (FastAPI `apps/api`):**
    *   A new API endpoint `POST /logs` will be created within `apps/api/app/api/logs.py` and included in `apps/api/main.py`.
    *   A `Log Service` (`apps/api/app/services/log_service.py`) will handle receiving and storing workout log entries in the Supabase `WorkoutLogs` table.

**Learnings from Previous Stories (2.3: Display & Review Daily Plan):**

**From Story 2.3: Display & Review Daily Plan (Status: drafted)**

*   **New Components/Services Created**: Frontend `PlanReview` component (`apps/web/src/components/PlanReview/PlanReview.tsx`) and `planReviewStore` (`apps/web/src/store/planReviewStore.ts`). Backend API endpoints `GET /plans/{planId}` and `POST /plans/{planId}/confirm`, and extensions to `Plan Service`.
*   **Architectural Guidance**: Patterns for frontend component creation, Zustand store usage, and API utility implementation for fetching/sending data were reinforced.
*   **Technical Debt**: The persistent backend testing issue (`ModuleNotFoundError` in Pytest setup) continues to impact reliable backend integration tests.
*   **Interfaces/Services to REUSE**:
    *   Authentication mechanism (Supabase Auth).
    *   FastAPI router registration pattern (`apps/api/main.py`).
    *   Pydantic model definition pattern (`apps/api/app/models/`).
    *   Backend service layer pattern (`apps/api/app/services/`).
    *   Frontend component creation patterns and Zustand store patterns.
    *   The confirmed workout plan from Story 2.3 will be consumed by this story to drive the Workout Player UI.

**Actionable Intelligence for Story 2.4:**

*   **REUSE EXISTING PATTERNS:** Leverage established frontend patterns for creating React components, using Zustand for state management, and making API calls. For the backend, create new endpoints (`logs.py` router) and services (`log_service.py`).
*   **UX/UI ADHERENCE:** Strictly follow the UX design specifications for Flow 7 (Start Workout) and Flow 9 (Perform & Log Workout), especially for optimized input and real-time feedback.
*   **OFFLINE CAPABILITY:** Implement local storage persistence for the active workout state to ensure reliability during network interruptions.
*   **ADDRESS TECHNICAL DEBT:** The backend testing issue still persists. Prioritize robust frontend unit tests and E2E tests for workout player functionality and data logging.

## Acceptance Criteria

1.  A "Start Workout" button is available (e.g., on the Dashboard or Plan Review screen) which initiates the Workout Player UI.
2.  The Workout Player UI is displayed in a full-screen, focused mode suitable for in-workout use.
3.  The UI clearly presents the current exercise, set number, and target reps/weight/RPE based on the confirmed workout plan.
4.  The UI provides intuitive controls for users to log their actual reps, weight, and RPE for each completed set in real-time.
5.  A rest timer is displayed between sets, showing a countdown and providing clear visual cues.
6.  Logged data for each set is incrementally sent to the `POST /logs` API endpoint.
7.  The logged data is successfully stored in the `WorkoutLogs` table in Supabase.
8.  The active workout state (e.g., current exercise, logged sets) is persisted in local storage to prevent data loss.
9.  The UI provides clear visual feedback (e.g., progress bars, checkmarks) on workout progress and completion.

## Tasks / Subtasks

- [ ] **Task 1: Implement Workout Player UI Shell & Start Logic (AC: 1, 2, 3, 9)**
  - [ ] Subtask 1.1: Create `apps/web/src/app/workout/player/page.tsx` for the main Workout Player UI.
  - [ ] Subtask 1.2: Implement navigation from a "Start Workout" button to this page.
  - [ ] Subtask 1.3: Display current exercise, set, and target values from the confirmed plan.
  - [ ] Subtask 1.4: Implement visual progress indicators for the workout.
  - [ ] Subtask 1.5: Write unit tests (Jest/RTL) for the workout player shell and navigation.
- [ ] **Task 2: Implement Set Logging UI & State (AC: 4)**
  - [ ] Subtask 2.1: Create `apps/web/src/components/WorkoutPlayer/SetLogger.tsx` for logging reps, weight, and RPE.
  - [ ] Subtask 2.2: Implement optimized input controls (e.g., large buttons, sliders) for real-time logging.
  - [ ] Subtask 2.3: Integrate with a new Zustand store (`apps/web/src/store/workoutStore.ts`) to manage the active workout state and logged data.
  - [ ] Subtask 2.4: Write unit tests (Jest/RTL) for the `SetLogger` component and `workoutStore`.
- [ ] **Task 3: Implement Rest Timer & Navigation (AC: 5)**
  - [ ] Subtask 3.1: Implement a rest timer component with countdown.
  - [ ] Subtask 3.2: Integrate the timer with `workoutStore` and control progression to the next set/exercise.
  - [ ] Subtask 3.3: Provide clear visual cues during rest periods (e.g., next exercise preview).
  - [ ] Subtask 3.4: Write unit tests for the rest timer.
- [ ] **Task 4: Implement Backend `POST /logs` Endpoint (AC: 6, 7)**
  - [ ] Subtask 4.1: Create Pydantic models for the workout log entry (exercise_name, set_number, actual_reps, actual_weight, rpe, etc.).
  - [ ] Subtask 4.2: Create `apps/api/app/api/logs.py` and define a FastAPI router.
  - [ ] Subtask 4.3: Implement the `POST /logs` endpoint, protecting it with authentication and accepting incremental log entries.
  - [ ] Subtask 4.4: Create `apps/api/app/services/log_service.py` to handle storing log entries in the Supabase `WorkoutLogs` table.
  - [ ] Subtask 4.5: Update `apps/api/main.py` to include the new `logs` router.
  - [ ] Subtask 4.6: Write integration tests (Pytest) for the `POST /logs` endpoint, mocking Supabase interactions. (Prioritize resolving `ModuleNotFoundError` tech debt).
- [ ] **Task 5: Implement Offline Persistence for Workout State (AC: 8)**
  - [ ] Subtask 5.1: Implement logic to save the active workout state from `workoutStore` to local storage on every significant change (e.g., logging a set).
  - [ ] Subtask 5.2: Implement logic to reload the workout state from local storage on app restart or page refresh.
  - [ ] Subtask 5.3: Implement a mechanism to clear local storage after a workout is completed and successfully synced.
  - [ ] Subtask 5.4: Write unit tests for local storage persistence logic.
- [ ] **Task 6: E2E Testing**
  - [ ] Subtask 6.1: Write an E2E test (Playwright) that simulates starting a workout from a confirmed plan, logging multiple sets, progressing through exercises, and verifying that logs are sent to the backend and persisted.
  - [ ] Subtask 6.2: E2E test the offline persistence by simulating a browser refresh mid-workout and verifying state recovery.

## Dev Notes

*   **Real-time Logging:** The frontend must provide a highly responsive and intuitive experience for logging data during a workout. Minimize friction.
*   **Frontend-Backend Contract:** Ensure the `POST /logs` endpoint's payload precisely matches the `WorkoutLogs` table schema and backend's expected Pydantic model.
*   **State Management Complexity:** The `workoutStore` will manage a significant amount of dynamic state (current exercise, set, timer, logged data). Design it for clarity and testability.
*   **Error Handling:** Implement robust error handling for API calls, especially for `POST /logs`. If the backend is unreachable, logs should be queued locally and retried.
*   **Testing:** Given the backend testing tech debt, prioritize comprehensive frontend unit tests and E2E tests for this story to ensure functionality.

### Learnings from Previous Story (2.3: Display & Review Daily Plan)

**From Story 2.3: Display & Review Daily Plan (Status: drafted)**

*   **New Components/Services Created**: Frontend `PlanReview` component (`apps/web/src/components/PlanReview/PlanReview.tsx`) and `planReviewStore` (`apps/web/src/store/planReviewStore.ts`). Backend API endpoints `GET /plans/{planId}` and `POST /plans/{planId}/confirm`, and extensions to `Plan Service`.
*   **Architectural Guidance**: Patterns for frontend component creation, Zustand store usage, and API utility implementation for fetching/sending data were reinforced.
*   **Technical Debt**: The persistent backend testing issue (`ModuleNotFoundError` in Pytest setup) continues to impact reliable backend integration tests.
*   **Interfaces/Services to REUSE**:
    *   Authentication mechanism (Supabase Auth).
    *   FastAPI router registration pattern (`apps/api/main.py`).
    *   Pydantic model definition pattern (`apps/api/app/models/`).
    *   Backend service layer pattern (`apps/api/app/services/`).
    *   Frontend component creation patterns and Zustand store patterns.
    *   Confirmed workout plan data from Story 2.3 will drive the Workout Player UI.

**Actionable Intelligence for Story 2.4:**

*   **REUSE EXISTING PATTERNS:** Leverage established frontend patterns for creating React components, using Zustand for state management, and making API calls. For the backend, extend the existing `plans.py` router and `Plan Service`.
*   **UX/UI ADHERENCE:** Strictly follow the UX design specifications for Flow 7 (Start Workout) and Flow 9 (Perform & Log Workout), especially for optimized input and real-time feedback.
*   **OFFLINE CAPABILITY:** Implement local storage persistence for the active workout state to ensure reliability during network interruptions.
*   **ADDRESS TECHNICAL DEBT:** The backend testing issue still persists. Prioritize robust frontend unit tests and E2E tests for workout player functionality and data logging.

## Dev Agent Record

### Context Reference
- `docs/architecture.md`
- `docs/epics.md`
- `docs/ux-design-direction.md`
- `docs/sprint-artifacts/2-1-ai-daily-plan-generation-api.md`
- `docs/sprint-artifacts/2-2-daily-plan-context-window.md`
- `docs/sprint-artifacts/2-3-display-review-daily-plan.md`
- docs/sprint-artifacts/2-4-Workout Player Core UI & Logging.context.xml

### Agent Model Used
Gemini

### Debug Log References
- No debug logs for this story yet.

### Completion Notes List
- Not started.

### File List
- Not started.

## Change Log

- **2025-12-14**: Story drafted by SM agent.
