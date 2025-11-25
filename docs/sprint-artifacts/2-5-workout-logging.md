# Story 2.5: Workout Logging

Status: ready-for-dev

## Story

As a User,
I want to log my completed reps, weight, and RPE for each set,
So that my progress can be tracked.

## Acceptance Criteria

1.  **AC 2.5.1:** Given a user is in the workout player, when they complete a set, then they can input the reps, weight, and RPE.
2.  **AC 2.5.2:** And this data is saved to the `workout_logs` table.

## Tasks / Subtasks

- [ ] **Task 1: Workout Logging UI Integration** (AC: 2.5.1)
  - [ ] Implement UI elements in the `Workout Player Module` for users to input reps, weight, and RPE after completing a set. (Source: `tech-spec-epic-2.md#Services-and-Modules`)
  - [ ] Ensure user input is validated client-side (e.g., numeric values, range checks).
- [ ] **Task 2: Backend API for Workout Logging** (AC: 2.5.2)
  - [ ] Create a `POST /api/v1/workout_logs` endpoint in FastAPI to receive and persist individual set logs. (Source: `tech-spec-epic-2.md#APIs-and-Interfaces`)
  - [ ] Implement the logic to save received data to the `workout_logs` table.
  - [ ] Handle offline logging with IndexedDB in the frontend and ensure synchronization with the backend upon reconnection. (Source: `tech-spec-epic-2.md#Services-and-Modules`)
- [ ] **Task 3: Data Model Verification** (AC: 2.5.2)
  - [ ] Verify the `workout_logs` table schema in Supabase (`id`, `user_id`, `workout_plan_id`, `exercise_name`, `set_number`, `reps_completed`, `weight_used`, `rpe_logged`, `log_time`). (Source: `tech-spec-epic-2.md#Data-Models-and-Contracts`)
- [ ] **Task 4: Testing** (AC: 2.5.1, 2.5.2)
  - [ ] Add Pytest integration tests for the `POST /api/v1/workout_logs` endpoint.
  - [ ] Test client-side input validation.
  - [ ] Test offline logging and synchronization upon reconnection.

## Dev Notes

### Relevant Architecture Patterns and Constraints

- **Backend (FastAPI):** `Workout Log API` (`app/api/v1/workout_logs.py`) for receiving and persisting logs. (Source: `tech-spec-epic-2.md#Services-and-Modules`)
- **Database (Supabase PostgreSQL):** `workout_logs` table for persistent storage of individual set logs. (Source: `architecture.md#Data-Architecture`)
- **Offline Data Sync:** Utilizes IndexedDB on the client-side and an Outbox Pattern for reliable synchronization of offline logged data. (Source: `architecture.md#Novel-Pattern-Designs`, `tech-spec-epic-2.md#System-Architecture-Alignment`)
- **Performance:** Offline Data Sync must ensure data logged offline syncs efficiently and reliably upon network reconnection. (Source: `tech-spec-epic-2.md#Performance`)

### Source Tree Components to Touch

- `app/components/workouts/WorkoutPlayer.tsx` (or similar): Update UI for logging.
- `backend/app/api/v1/workout_logs.py`: Create `POST` endpoint for logging.
- `backend/app/db/models.py` (or similar): Ensure `workout_logs` table model is correct.
- `backend/tests/`: Add new tests for workout logging.

### Testing Standards Summary

- Backend unit tests with Pytest.
- Integration tests for `POST /api/v1/workout_logs` endpoint, including offline sync.
- UI tests for input elements in the workout player. (Source: `tech-spec-epic-2.md#Test-Strategy-Summary`)

### Project Structure Notes

- New API endpoints and UI components will align with the existing monorepo structure. (Source: `architecture.md#Project-Structure`)

### References

- [Source: docs/epics.md#Story-2.5:-Workout-Logging]
- [Source: docs/sprint-artifacts/tech-spec-epic-2.md#Story-2.5:-Workout-Logging]
- [Source: docs/architecture.md#Data-Architecture]
- [Source: docs/architecture.md#Novel-Pattern-Designs]

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/2-5-workout-logging.context.xml`

### Agent Model Used

Gemini CLI

### Debug Log References

### Completion Notes List

### File List

## Change Log

- 2025-11-25: Story content updated with detailed requirements and tasks.
- 2025-11-24: Initial draft created by Gemini CLI.
