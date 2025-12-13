# Story 2.2: Daily Plan Context Window

Status: drafted

## Story

As a user,
I want a clear and intuitive "Context Window" UI on my dashboard to input my daily mood, energy, and soreness,
So that the AI can generate an adaptive and personalized daily workout plan based on my current physical and mental state.

## Acceptance Criteria

1.  **AC2.2.1:** A "Context Window" UI is available on the dashboard for the user to input mood, energy, and soreness, visually aligned with Flow 6, Screen 1 of the UX design.
2.  **AC2.2.2:** Submitting the context via the `[ Generate Today's Plan ]` button triggers a call to the `POST /plans/generate` endpoint with the collected mood, energy, and soreness data.

## Tasks / Subtasks

-   [ ] **Task 1: Implement Context Window UI (AC2.2.1)**
    -   [ ] Subtask 1.1: Create a React component for the "Context Window" modal/overlay (`apps/web/src/components/ContextWindow.tsx`).
    -   [ ] Subtask 1.2: Implement segmented button groups for "Mood" (e.g., Stressed, Neutral, Motivated) as per Flow 6, Screen 1 of UX design.
    -   [ ] Subtask 1.3: Implement segmented button groups for "Energy Level" (e.g., Low, Medium, High) as per Flow 6, Screen 1 of UX design.
    -   [ ] Subtask 1.4: Implement an input mechanism for "Soreness" or other qualitative feedback, if not covered by mood/energy.
    -   [ ] Subtask 1.5: Integrate the "Context Window" component into the Dashboard UI (`apps/web/src/app/dashboard/page.tsx`), making it accessible (e.g., via a button click).
-   [ ] **Task 2: Handle Context Submission (AC2.2.2)**
    -   [ ] Subtask 2.1: Implement state management (Zustand) within the Context Window to capture user selections for mood, energy, and soreness.
    -   [ ] Subtask 2.2: Create a function in `apps/web/src/lib/api.ts` to construct the request payload and call the `POST /plans/generate` endpoint.
    -   [ ] Subtask 2.3: Implement the `[ Generate Today's Plan ]` button to collect user input and call the API function.
    -   [ ] Subtask 2.4: Handle loading states and potential API errors during submission.

## Dev Notes

-   **Relevant architecture patterns and constraints:**
    -   Frontend `Context Window (Frontend)` component as part of the "Adaptive Workout Dialogue" pattern.
    -   Integration with the `POST /plans/generate` endpoint (Story 2.1).
    -   Frontend state management using Zustand.
    -   UI should conform to the visual elements described for Flow 6, Screen 1 in `ux-design-direction.md`.
-   **Source tree components to touch:**
    -   `apps/web/src/components/ContextWindow.tsx` (new component)
    -   `apps/web/src/app/dashboard/page.tsx` (to integrate the Context Window)
    -   `apps/web/src/lib/api.ts` (to add the `generatePlan` API call)
    -   `apps/web/src/store/context.ts` (new Zustand store for context, or integrate into existing one)
-   **Testing standards summary:**
    -   Unit tests for the `ContextWindow` React component (rendering, state changes, button clicks).
    -   Integration tests to ensure the `[ Generate Today's Plan ]` button correctly dispatches the API call with the collected context.

### Project Structure Notes

-   Alignment with unified project structure (paths, modules, naming):
    -   New UI components in `apps/web/src/components/`.
    -   API client logic in `apps/web/src/lib/`.
    -   Zustand stores in `apps/web/src/store/`.

### References

-   [Source: docs/architecture.md#Novel-Architectural-Patterns]
-   [Source: docs/sprint-artifacts/tech-spec-epic-2.md#Story-2.2:-Daily-Plan-Context-Window]
-   [Source: docs/ux-design-direction.md#Flow-6:-Generate-AI-Daily-Plan]

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/2-2-daily-plan-context-window.context.xml`

### Agent Model Used

{{agent_model_name_version}}

### Completion Notes List

### File List