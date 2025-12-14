# Story 2.2: Daily Plan Context Window

## 1. Story Summary
As a user, I want to input my daily mood, energy, and soreness levels via a Context Window, so that the AI can adapt my daily workout plan accordingly.

## 2. Acceptance Criteria
- Given I am on the Dashboard (or accessing the context window via other triggers)
- When I interact with the Context Window UI (Flow 6, Screen 1)
- Then I can select mood (emoticons) and energy level (segmented buttons)
- And I can optionally add free-text input for specific details
- And submitting this context triggers the AI Daily Plan generation (calling the API from Story 2.1)
- And the UI provides a loading state while the plan is being generated.

## 3. Story Context
*   **Frontend:** This is a frontend-heavy story. It involves creating a new, reusable React component for the Context Window, managing its state, and handling the API call to the backend.
*   **Backend:** This story consumes the `/plans/generate` endpoint created in Story 2.1. It does not require any new backend development.
*   **Data:** The component will gather user input and send it to the backend. It does not directly interact with the database.
*   **UX:** The component must be intuitive and provide clear feedback, especially a loading indicator to manage user expectations during the AI's processing time. The "smart suggestions" feature mentioned in the UX spec is a key part of the experience.

## 4. Dependencies
*   **Story 2.1 (AI Daily Plan Generation API):** The `/plans/generate` backend endpoint must be available and its contract stable.

## 5. Risks & Assumptions
*   **Risk:** The backend API from Story 2.1 might not be ready, blocking frontend development. Mitigation: Use a mock API server (e.g., using MSW - Mock Service Worker) to simulate the backend response and allow for parallel development.
*   **Risk:** The 10-second latency from the AI can make the app feel unresponsive. Mitigation: A clear, non-blocking loading state in the UI is critical to manage user expectations.
*   **Assumption:** The UI/UX designs for the Context Window (Flow 6, Screen 1) are finalized and available.
*   **Assumption:** A mechanism exists to get the current `userId` on the frontend to send with the API request.

## 6. Definition of Ready
- [x] Story is defined with summary and acceptance criteria.
- [x] Dependency (Story 2.1) is either complete or has a stable, mocked contract.
- [ ] Story has been estimated by the development team.
- [x] UX designs are available and understood.

## 7. Definition of Done
- [ ] All acceptance criteria are met.
- [ ] The `ContextWindow` component is created and functional.
- [ ] Frontend unit and integration tests are written and passing for the component, with the backend call mocked.
- [ ] The component has been tested for responsiveness and usability.
- [ ] Code has been peer-reviewed and approved.
- [ ] Code is merged into the main development branch.
- [ ] The `sprint-status.yaml` is updated to reflect the story's new status.
