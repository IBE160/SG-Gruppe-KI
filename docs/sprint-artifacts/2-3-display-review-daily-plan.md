# Story 2.3: Display & Review Daily Plan

## 1. Story Summary
As a user, I want to review the AI-generated daily workout plan, including any adaptations, and have the option to confirm or edit it, so that I maintain control over my training.

## 2. Acceptance Criteria
- Given the AI has generated a daily workout plan (following the submission in Story 2.2)
- When I am presented with the "Review Proposed Plan" screen (Flow 6, Screen 3)
- Then I can see the full workout plan, broken down by exercises and sets
- And any AI adaptations are visually highlighted and explained (e.g., "Heard you were feeling a bit low on energy...")
- And I have options to `[ Confirm Plan ]` or `[ Edit Plan ]`
- And confirming the plan leads to the "Plan Confirmed!" screen (Flow 6, Screen 4) before redirecting to the Dashboard.

## 3. Story Context
*   **Frontend:** This story involves creating the UI to display the workout plan received from the backend. It requires rendering a structured set of data and providing clear calls to action for the user.
*   **Backend:** No new backend work is required. This story consumes the data provided by the `/plans/generate` endpoint.
*   **Data:** The component will receive the structured JSON workout plan from the backend and manage it in its state (likely via a Zustand store).
*   **UX:** A key UX requirement is to transparently explain *why* the AI made changes. The UI must clearly separate the plan itself from the AI's reasoning.

## 4. Dependencies
*   **Story 2.1 (AI Daily Plan Generation API):** The API must return a predictable and structured JSON object containing the plan and the explanation for any adaptations.
*   **Story 2.2 (Context Window):** The workflow of this story immediately follows the completion of the Context Window flow.

## 5. Risks & Assumptions
*   **Risk:** The data structure from the AI might be complex or inconsistent, making it difficult to render reliably. Mitigation: Work closely with the backend developer to ensure a stable and well-documented API contract.
*   **Assumption:** The plan data from the API contains all necessary fields for display (exercise name, sets, reps, weight, RPE, AI explanation, etc.).
*   **Assumption:** The `[ Edit Plan ]` functionality might be complex. For this story, it could simply navigate to an editing interface, with the actual editing logic handled in a subsequent story.

## 6. Definition of Ready
- [x] Story is defined with summary and acceptance criteria.
- [x] Dependencies (Stories 2.1, 2.2) are complete or have stable contracts.
- [ ] Story has been estimated by the development team.
- [x] UX designs for the "Review Proposed Plan" and "Plan Confirmed!" screens are available.

## 7. Definition of Done
- [ ] All acceptance criteria are met.
- [ ] The plan review UI components are created and functional.
- [ ] Frontend unit and integration tests are written and passing.
- [ ] The UI correctly displays all elements of the workout plan and the AI's explanations.
- [ ] Code has been peer-reviewed and approved.
- [ ] Code is merged into the main development branch.
- [ ] The `sprint-status.yaml` is updated to reflect the story's new status.
