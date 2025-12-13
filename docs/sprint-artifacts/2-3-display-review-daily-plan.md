# Story 2.3: Display & Review Daily Plan

Status: drafted

## Story

As a user,
I want to clearly see the AI-generated workout plan, including any adaptations based on my context, and have options to confirm or edit it,
So that I can maintain control over my training and ensure it aligns with my preferences before starting.

## Acceptance Criteria

1.  **AC2.3.1:** The AI-generated plan is displayed to the user in a clear, readable format, visually aligned with Flow 6, Screen 3 of the UX design, including exercise details and an optional image/thumbnail.
2.  **AC2.3.2:** Any AI adaptations are visually highlighted with the corresponding explanation ("AI Context Card"), aligned with Flow 6, Screen 3 of the UX design.
3.  **AC2.3.3:** The user has prominently displayed options to `[ Confirm Plan ]` or `[ Edit Plan ]`, visually aligned with Flow 6, Screen 3 of the UX design.
4.  **AC2.3.4:** Tapping `[ Confirm Plan ]` triggers a call to `POST /plans/{planId}/confirm` to mark the plan as confirmed in the backend.

## Tasks / Subtasks

-   [ ] **Task 1: Implement Plan Display UI (AC2.3.1, AC2.3.2)**
    -   [ ] Subtask 1.1: Create a React component for displaying the AI-generated workout plan (`apps/web/src/components/PlanReview.tsx`).
    -   [ ] Subtask 1.2: Design and implement the layout for exercise items including name, RPE, sets/reps, and an optional image/thumbnail per Flow 6, Screen 3.
    -   [ ] Subtask 1.3: Implement the "AI Context Card" to display `ai_explanation` received from the backend, highlighting adaptations.
    -   [ ] Subtask 1.4: Integrate the `PlanReview` component into the Dashboard or a dedicated plan review page.
-   [ ] **Task 2: Implement Plan Confirmation (AC2.3.3, AC2.3.4)**
    -   [ ] Subtask 2.1: Implement the `[ Confirm Plan ]` button on the `PlanReview` UI.
    -   [ ] Subtask 2.2: Create a function in `apps/web/src/lib/api.ts` to call the `POST /plans/{planId}/confirm` endpoint.
    -   [ ] Subtask 2.3: Integrate the confirmation API call with the `[ Confirm Plan ]` button.
    -   [ ] Subtask 2.4: Handle loading states and potential API errors for confirmation.
-   [ ] **Task 3: Implement Plan Editing (AC2.3.3)**
    -   [ ] Subtask 3.1: Implement the `[ Edit Plan ]` button on the `PlanReview` UI.
    -   [ ] Subtask 3.2: Define the basic navigation or modal structure for a future plan editing interface (initial implementation can be a placeholder).

## Dev Notes

-   **Relevant architecture patterns and constraints:**
    -   Frontend `Plan Review UI` component as part of the "Adaptive Workout Dialogue" pattern.
    -   Consumption of the `plan_details` and `ai_explanation` from the `WorkoutPlans` table (via backend API, endpoint from Story 2.1).
    -   Integration with the `POST /plans/{planId}/confirm` endpoint.
    -   Frontend state management using Zustand for displaying the plan and managing confirmation flow.
    -   UI should conform to the visual elements described for Flow 6, Screen 3 in `ux-design-direction.md`.
-   **Source tree components to touch:**
    -   `apps/web/src/components/PlanReview.tsx` (new component)
    -   `apps/web/src/app/dashboard/page.tsx` or a new dedicated page (to display the PlanReview)
    -   `apps/web/src/lib/api.ts` (to add the `confirmPlan` API call)
    -   `apps/web/src/store/plan.ts` (new Zustand store for current plan state, or integrate into existing one)
-   **Testing standards summary:**
    -   Unit tests for the `PlanReview` React component (rendering of plan details, AI explanation, buttons).
    -   Integration tests to ensure the `[ Confirm Plan ]` button correctly dispatches the API call.

### Project Structure Notes

-   Alignment with unified project structure (paths, modules, naming):
    -   New UI components in `apps/web/src/components/`.
    -   API client logic in `apps/web/src/lib/`.
    -   Zustand stores in `apps/web/src/store/`.

### References

-   [Source: docs/architecture.md#Novel-Architectural-Patterns]
-   [Source: docs/sprint-artifacts/tech-spec-epic-2.md#Story-2.3:-Display-&amp;-Review-Daily-Plan]
-   [Source: docs/ux-design-direction.md#Flow-6:-Generate-AI-Daily-Plan]

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/2-3-display-review-daily-plan.context.xml`

### Agent Model Used

{{agent_model_name_version}}

### Completion Notes List

### File List