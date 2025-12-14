    # Story 2.1: AI Daily Plan Generation API

    ## 1. Story Summary
    As a backend service, I want to expose an API endpoint that generates a structured daily workout plan based on user profile, historical data, and contextual inputs, including simulated recovery, so that the frontend can display a personalized plan.

    ## 2. Acceptance Criteria
    - Given the FastAPI backend is running
    - When a POST request is made to `/plans/generate` with `userId`, `goals`, `equipment`, `historicalData`, and `context` (including `recovery_bias` and simulated HRV/sleep)
    - Then the AI Orchestrator service constructs a prompt for the AI model
    - And the AI model (OpenAI API) generates a structured JSON workout plan
    - And the response includes an explanation for plan adaptations based on context
    - And `p95` API latency for non-AI components is < 300ms, and for AI is ≤ 10s
    - And the plan is stored in the `WorkoutPlans` database table

    ## 3. Story Context
    *   **Frontend:** This story has no direct frontend deliverable, but the JSON contract of the API response is critical for the frontend stories that will consume it (2.2, 2.3).
    *   **Backend:** This is a backend-heavy story. It involves creating a new FastAPI endpoint, a service for orchestrating AI interaction (`AI Orchestrator`), and integrating with an external AI provider's API. Pydantic models will be used for strict data validation.
    *   **Data:** The process will read user data (profile, goals, history) and write to the `WorkoutPlans` table in the Supabase PostgreSQL database.
    *   **UX:** The quality and structure of the AI-generated explanation for plan adaptations are key to fulfilling the "transparent AI" UX principle.

    ## 4. Dependencies
    *   **Story 1.1 (Project Setup):** The FastAPI `apps/api` project structure must exist.
    *   **Story 1.3 (Onboarding):** Requires user profile, goal, and equipment data to be available in the database to feed the AI prompt.
    *   **External:** Requires access and API keys for an external AI provider (e.g., OpenAI).

    ## 5. Risks & Assumptions
    *   **Risk:** The external AI API may be slow or unavailable, violating the latency requirements. Mitigation: Implement proper timeouts and error handling.
    *   **Risk:** The AI model may return an unexpectedly formatted JSON response, causing errors. Mitigation: Implement strict Pydantic validation on the response and robust error handling.
    *   **Risk:** The existing backend testing environment is broken (`ModuleNotFoundError`), which will make validating this complex endpoint difficult. Mitigation: Prioritize fixing the test environment as the first task of this story.
    *   **Assumption:** The data required for the prompt (user goals, history, etc.) is available and in a queryable format from the database.
    *   **Assumption:** We have a clear understanding of how to structure the prompt to get a consistent, high-quality response from the AI model.

    ## 6. Definition of Ready
    - [x] Story is defined with summary and acceptance criteria.
    - [x] Dependencies (Stories 1.1, 1.3) are marked as complete.
    - [ ] Story has been estimated by the development team.
    - [x] External AI provider API key is available to the developer.

    ## 7. Definition of Done
    - [ ] All acceptance criteria are met.
    - [ ] Backend integration tests are written and passing, with the external AI call mocked.
    - [ ] The new endpoint is documented in the OpenAPI specification.
    - [ ] Code has been peer-reviewed and approved.
    - [ ] Code is merged into the main development branch.
    - [ ] The `sprint-status.yaml` is updated to reflect the story's new status (e.g., `review` or `done`).
