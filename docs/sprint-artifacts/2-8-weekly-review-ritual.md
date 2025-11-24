# Story 2.8: Weekly Review Ritual

Status: ready-for-dev

## Story

As a User,
I want to receive an automated weekly summary of my progress,
so that I can stay motivated and see my achievements.

## Acceptance Criteria

1.  **Given** a user has completed workouts during the week, **when** the week ends, **then** an automated summary is generated showing their progress, PRs, and other highlights.

## Tasks / Subtasks

- [ ] **Task 1: Backend Service for Weekly Review** (AC: #1)
  - [ ] Create a `Weekly Review Service` that aggregates a user's workout data for the week from the `workout_logs` table. (Source: `tech-spec-epic-2.md#Services-and-Modules`)
  - [ ] Implement logic to identify progress, Personal Records (PRs), and other highlights.
  - [ ] Implement a mechanism to store or deliver the generated summary (e.g., as a new table `weekly_summaries`, or as a notification).
- [ ] **Task 2: Background Job for Weekly Review** (AC: #1)
  - [ ] Create a scheduled background job using Celery that triggers the `Weekly Review Service` at the end of each week. (Source: `architecture.md#Background-Job-Processing`)
  - [ ] Configure Celery with Redis as the broker.
- [ ] **Task 3: Testing** (AC: #1)
  - [ ] Add Pytest unit tests for the `Weekly Review Service` logic.
  - [ ] Add Pytest integration tests for the Celery task, ensuring it runs as scheduled and generates the correct summary.

## Dev Notes

This story introduces the first automated, recurring user engagement feature. It relies on background job processing to run independently of user sessions.

-   **Architecture**: This is a backend-focused story. It introduces Celery and Redis for background job processing.
-   **Source Components**:
    -   **Backend**: `app/services/weekly_review_service.py` (new module), `app/tasks/weekly_review.py` (new Celery task).
-   **Testing**: Testing the scheduled task and the aggregation logic is crucial.

### Project Structure Notes

-   A new file `weekly_review_service.py` will be created in `backend/app/services`.
-   A new directory `tasks` will be created in `backend/app` for Celery tasks.

### Learnings from Previous Story

**From Story 2.7: Simulated Recovery Inputs (Status: ready-for-dev)**

-   **Architectural Foundation:** This story continues to build out the backend services, but introduces a new architectural component (Celery/Redis) for asynchronous processing.
-   **Backend Focus:** The previous story was also backend-focused, so the development and testing patterns are applicable.

### References

-   [Source: `docs/epics.md#Story-2.8:-Weekly-Review-Ritual`]
-   [Source: `docs/sprint-artifacts/tech-spec-epic-2.md#Services-and-Modules`]
-   [Source: `docs/architecture.md#Background-Job-Processing`]

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/2-8-weekly-review-ritual.context.xml`

### Agent Model Used

Gemini CLI

### Debug Log References

### Completion Notes List

### File List

## Change Log

- 2025-11-24: Initial draft created by Gemini CLI.
