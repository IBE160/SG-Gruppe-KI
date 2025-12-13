---
story_id: "2.4"
epic_id: "2"
status: "drafted"
title: "Workout Player Core UI & Logging"
description: "As a user, I want an intuitive interface to perform and log my workout sets (reps, weight, RPE) in real-time, so that I can accurately track my progress."
author: "BIP"
date: "2025-12-12"
---

### Acceptance Criteria:
- **AC1:** Given I have confirmed my daily workout plan (Story 2.3), when I tap `[ Start Workout ]` from the Dashboard or plan card, the Workout Player loading state (Flow 7, Screen 1) and pre-workout screen (Flow 7, Screen 2) are displayed.
- **AC2:** The Workout Player loads, starting with a distinct Warm-up phase (Flow 7, Screen 3).
- **AC3:** I can log reps, weight, and RPE for each set during the main workout using an intuitive UI (Flow 9).
- **AC4:** The UI provides optimized input for reps/weight/RPE (e.g., large buttons, sliders, smart pre-fills) as specified in the UX design.
- **AC5:** A clear preview of the next exercise or set is displayed during rest periods to ensure a smooth workout flow.
- **AC6:** All logged data (reps, weight, RPE for each set) is incrementally stored in the `WorkoutLogs` table in Supabase via the `/logs` API endpoint.

### Prerequisites:
- Story 2.3: Display & Review Daily Plan

### Technical Notes:
- Frontend: Implement UI for the Workout Player based on `ux_design_content` for Flow 7 and Flow 9.
- Frontend: Use Zustand for managing the active workout state (current exercise, set, reps, etc.).
- Backend: Implement the `/logs` API endpoint in FastAPI to receive and store incremental workout data.
- Database: Ensure the `WorkoutLogs` table schema supports storing set-by-set data, including reps, weight, and RPE.

### Sub-Tasks:

- **Frontend:**
  - `[ ]` Task 2.4.1: Develop the workout loading state screen (Flow 7, Screen 1).
  - `[ ]` Task 2.4.2: Develop the pre-workout/warm-up introduction screen (Flow 7, Screen 2).
  - `[ ]` Task 2.4.3: Develop the active warm-up player screen (Flow 7, Screen 3).
  - `[ ]` Task 2.4.4: Develop the main workout player screen for logging sets (Flow 9).
  - `[ ]` Task 2.4.5: Implement optimized input controls (sliders, steppers) for reps, weight, and RPE.
  - `[ ]` Task 2.4.6: Implement the "next exercise/set" preview UI for rest periods.
  - `[ ]` Task 2.4.7: Create the Zustand store for managing active workout state.
  - `[ ]` Task 2.4.8: Integrate API client to send data to the `/logs` backend endpoint.

- **Backend:**
  - `[ ]` Task 2.4.9: Define the Pydantic model for incoming log data.
  - `[ ]` Task 2.4.10: Create the `/logs` API endpoint in FastAPI.
  - `[ ]` Task 2.4.11: Implement the service logic to process and save log data to the `WorkoutLogs` table in Supabase.

- **Testing:**
  - `[ ]` Task 2.4.12: Write unit tests for the Zustand workout store.
  - `[ ]` Task 2.4.13: Write integration tests for the `/logs` API endpoint.
  - `[ ]` Task 2.4.14: Write E2E tests (Playwright) for the full workout logging flow, from starting a workout to logging three sets.

- **Documentation:**
  - `[ ]` Task 2.4.15: Update API documentation for the `/logs` endpoint.
