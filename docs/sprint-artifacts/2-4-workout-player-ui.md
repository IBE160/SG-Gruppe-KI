# Story 2.4: Workout Player UI

Status: ready-for-dev

## Story

As a User,
I want a workout player interface that guides me through my workout,
so that I can focus on my exercises.

## Acceptance Criteria

1.  **Given** a user starts a workout, **when** the workout player is launched, **then** it displays the current exercise, set number, target reps/weight, and a timer for rest periods.

## Tasks / Subtasks

- [ ] **Task 1: Frontend UI for Workout Player** (AC: #1)
  - [ ] Create a new page/route for the workout player.
  - [ ] Build the UI to display the current exercise, set details (target reps, weight, RPE), and a rest timer.
  - [ ] Implement state management to track the user's progress through the workout (current exercise, current set).
  - [ ] Implement logic to handle user interactions (e.g., starting/stopping rest timer, advancing to the next set/exercise).
- [ ] **Task 2: Offline Data Handling** (AC: #1)
  - [ ] Integrate IndexedDB to handle offline logging of workout data. (Source: `architecture.md#Offline-Data-Synchronization-with-Outbox-Pattern`)
  - [ ] Implement the Outbox Pattern to queue up offline data for syncing with the backend when connectivity is restored.
- [ ] **Task 3: Testing** (AC: #1)
  - [ ] Add React Testing Library tests for the Workout Player components, including state changes and user interactions.
  - [ ] Add Playwright E2E tests for the full workout flow, including offline scenarios.

## Dev Notes

This story focuses on creating the interactive UI for executing a workout. It's a critical component for the user's daily engagement with the app.

-   **Architecture**: This is a frontend-heavy story, primarily within the Next.js application. It will heavily utilize client-side state management and introduce offline capabilities with IndexedDB.
-   **Source Components**:
    -   **Frontend**: New `Workout Player Module` components and logic.
-   **Testing**: E2E testing, including offline scenarios, is crucial to ensure a seamless and reliable workout experience.

### Project Structure Notes

-   New components for the Workout Player will be created in the frontend.

### Learnings from Previous Story

**From Story 2.3: Display Daily Workout Plan (Status: ready-for-dev)**

-   **Architectural Foundation:** This story builds on the previous by consuming the `plan_json` data and presenting it in an interactive format.
-   **Component Structure:** Established patterns for frontend module organization will be followed.
-   **Client-side State Management:** Experience with React Query or similar for data fetching will be beneficial. This story will require more complex client-side state management for the workout flow.
-   **Testing Patterns:** Continue to follow Playwright/React Testing Library for frontend testing.

### References

-   [Source: `docs/epics.md#Story-2.4:-Workout-Player-UI`]
-   [Source: `docs/sprint-artifacts/tech-spec-epic-2.md#Services-and-Modules`]
-   [Source: `docs/architecture.md#Offline-Data-Synchronization-with-Outbox-Pattern`]

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/2-4-workout-player-ui.context.xml`

### Agent Model Used

Gemini CLI

### Debug Log References

### Completion Notes List

### File List

## Change Log

- 2025-11-24: Initial draft created by Gemini CLI.
