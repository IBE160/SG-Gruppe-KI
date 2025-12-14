# Story 2.4: Workout Player Core UI & Logging

## 1. Story Summary
As a user, I want an intuitive interface to perform and log my workout sets (reps, weight, RPE) in real-time, so that I can accurately track my progress.

## 2. Acceptance Criteria
- Given I have confirmed my daily workout plan (from Story 2.3)
- When I tap `[ Start Workout ]`
- Then the Workout Player loads, starting with a distinct Warm-up phase (Flow 7, Screen 3)
- And I can log reps, weight, and RPE for each set during the main workout (Flow 9)
- And the UI provides optimized input for reps/weight/RPE (large buttons, sliders, smart pre-fills)
- And a clear preview of the next exercise/set is displayed during rest periods
- And all logged data is incrementally stored in `WorkoutLogs` (Supabase) via a `/logs` API endpoint.

## 3. Story Context
*   **Frontend:** This is a very UI/UX-heavy story, creating the core interactive component of the application. It will involve complex state management to track the user's progress through the workout.
*   **Backend:** A new backend endpoint (`POST /logs`) is required to receive and store the workout data as the user logs it. This endpoint should be designed to handle incremental updates efficiently.
*   **Data:** The frontend will send individual set results to the backend. The backend will write this data to the `WorkoutLogs` table.
*   **UX:** The UI must be highly optimized for in-workout use: large touch targets, minimal typing, and clear visual hierarchy. It needs to be usable while the user is physically active and potentially fatigued.

## 4. Dependencies
*   **Story 2.3 (Display & Review Daily Plan):** This story's workflow begins after a plan is confirmed in Story 2.3. The confirmed plan data is the primary input.
*   **Backend:** A new `/logs` endpoint needs to be created.

## 5. Risks & Assumptions
*   **Risk:** Real-time data synchronization could fail, leading to lost workout data. Mitigation: Implement a robust client-side caching or "offline mode" strategy (though full offline mode is in a later story, a simple queue for pending logs is a good start).
*   **Risk:** The complexity of the workout player state (current exercise, set, rest timers, etc.) could lead to bugs. Mitigation: Use a state machine or a well-structured state management pattern (like Zustand) and write comprehensive tests.
*   **Assumption:** The UI/UX designs for the workout player (Flows 7 and 9) are detailed and cover all interaction states (active set, rest, exercise complete, workout finished).

## 6. Definition of Ready
- [x] Story is defined with summary and acceptance criteria.
- [x] Dependency (Story 2.3) is complete.
- [ ] Backend contract for the `/logs` endpoint is defined.
- [ ] Story has been estimated by the development team.
- [x] UX designs are available.

## 7. Definition of Done
- [ ] All acceptance criteria are met.
- [ ] The Workout Player UI is fully functional.
- [ ] The backend `/logs` endpoint is created and functional.
- [ ] Logged data is correctly persisted in the database.
- [ ] The frontend and backend code is fully tested.
- [ ] Code has been peer-reviewed and approved.
- [ ] Code is merged into the main development branch.
- [ ] The `sprint-status.yaml` is updated to reflect the story's new status.
