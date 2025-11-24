# Story 2.7: Simulated Recovery Inputs

Status: ready-for-dev

## Story

As a Developer,
I want to be able to input simulated recovery data (HRV, sleep),
so that I can validate the AI's ability to adapt plans based on recovery metrics.

## Acceptance Criteria

1.  **Given** the AI plan generation endpoint, **when** simulated recovery data is included in the prompt, **then** the generated workout plan is adjusted accordingly (e.g., lower volume for poor recovery).

## Tasks / Subtasks

- [ ] **Task 1: Backend API Update** (AC: #1)
  - [ ] Update the `POST /api/v1/workout_plans/generate` endpoint to accept optional `simulated_recovery_data` in the request body. (Source: `tech-spec-epic-2.md#APIs-and-Interfaces`)
  - [ ] Modify the `AI Plan Generation Service` to include this simulated data in the prompt sent to the OpenAI API.
- [ ] **Task 2: Testing** (AC: #1)
  - [ ] Add Pytest integration tests for the `POST /api/v1/workout_plans/generate` endpoint with simulated recovery data.
  - [ ] Create test cases with different recovery data (e.g., good, average, poor) and assert that the generated plan is adjusted appropriately (e.g., by checking for keywords like "lower intensity" or by comparing generated volume).

## Dev Notes

This is a developer-facing story to enable testing and validation of the AI's adaptive capabilities. It does not involve any frontend UI changes.

-   **Architecture**: This story modifies the backend `AI Plan Generation Service` to incorporate simulated recovery data into the AI prompt.
-   **Source Components**:
    -   **Backend**: `app/services/ai_plan_service.py`, `app/api/v1/workout_plans.py`.
-   **Testing**: The focus of this story is testing. It's crucial to have a suite of tests that can validate the AI's response to different recovery scenarios.

### Project Structure Notes

-   The `ai_plan_service.py` and `workout_plans.py` files in the backend will be modified.

### Learnings from Previous Story

**From Story 2.6: Basic Progress Dashboard (Status: ready-for-dev)**

-   **Architectural Foundation:** This story reinforces the backend's role in data processing and preparation for AI interaction.
-   **Data Aggregation:** While the previous story focused on aggregating past data for display, this story focuses on providing additional input data for AI generation.

### References

-   [Source: `docs/epics.md#Story-2.7:-Simulated-Recovery-Inputs`]
-   [Source: `docs/sprint-artifacts/tech-spec-epic-2.md#APIs-and-Interfaces`]
-   [Source: `docs/architecture.md#AI-Integration-and-Prompting`]

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/2-7-simulated-recovery-inputs.context.xml`

### Agent Model Used

Gemini CLI

### Debug Log References

### Completion Notes List

### File List

## Change Log

- 2025-11-24: Initial draft created by Gemini CLI.