# Story 2.1: AI Daily Plan Generation API

Status: ready-for-dev

## Story

As a user,
I want the system to generate a personalized daily workout plan based on my current context and history,
So that I can receive an adaptive training recommendation from the AI.

## Acceptance Criteria

1.  **AC2.1.1:** A `POST /plans/generate` endpoint is created in the FastAPI backend.
2.  **AC2.1.2:** The endpoint constructs a prompt and successfully calls the OpenAI API to generate a workout plan in a structured JSON format.
3.  **AC2.1.3:** The generated plan is stored in the `WorkoutPlans` table.
4.  **AC2.1.4:** The endpoint includes an `ai_explanation` in the response if the plan was adapted based on user context.

## Tasks / Subtasks

-   [ ] **Task 1: Implement FastAPI Endpoint (AC2.1.1)**
    -   [ ] Subtask 1.1: Create a new endpoint `POST /plans/generate` in `apps/api`.
    -   [ ] Subtask 1.2: Define request (e.g., `context`) and response models for the endpoint using Pydantic.
-   [ ] **Task 2: Integrate with OpenAI API (AC2.1.2)**
    -   [ ] Subtask 2.1: Develop `AI Orchestrator` service to construct a detailed prompt using user profile, goals, history, and current context.
    -   [ ] Subtask 2.2: Implement logic to call the OpenAI API with the constructed prompt.
    -   [ ] Subtask 2.3: Handle potential OpenAI API errors (e.g., timeout, invalid response).
    -   [ ] Subtask 2.4: Validate the AI's JSON response against a predefined schema.
-   [ ] **Task 3: Store Generated Plan (AC2.1.3)**
    -   [ ] Subtask 3.1: Implement logic in `Plan Service` to store the generated workout plan (structured JSON) in the `WorkoutPlans` table.
    -   [ ] Subtask 3.2: Ensure the plan is linked to the `user_id` and `plan_date`.
-   [ ] **Task 4: Include AI Explanation (AC2.1.4)**
    -   [ ] Subtask 4.1: Extract the `ai_explanation` from the AI's response.
    -   [ ] Subtask 4.2: Include the `ai_explanation` in the `POST /plans/generate` endpoint's response.

## Dev Notes

-   **Relevant architecture patterns and constraints:**
    -   "Adaptive Workout Dialogue" pattern (AI Orchestrator, AI Model).
    -   FastAPI backend, OpenAI API integration.
    -   Data stored in `WorkoutPlans` table in Supabase.
    -   Security: `POST /plans/generate` must be protected by JWT and validate user's `access_token`.
-   **Source tree components to touch:**
    -   `apps/api/app/api/plans.py` (new file for endpoint)
    -   `apps/api/app/services/ai_orchestrator.py` (new file/module)
    -   `apps/api/app/services/plan_service.py` (new file/module)
    -   `apps/api/app/models/workout_plan.py` (new file/module for Pydantic models)
    -   `apps/api/main.py` (to register new routes)
-   **Testing standards summary:**
    -   Integration tests for `AI Orchestrator` mocking OpenAI API calls.
    -   Integration tests for `Plan Service` to validate database interactions.
    -   Unit tests for Pydantic models.

### Project Structure Notes

- Alignment with unified project structure (paths, modules, naming):
    - New API endpoints in `apps/api/app/api/`.
    - New services in `apps/api/app/services/`.
    - New models in `apps/api/app/models/`.

### References

-   [Source: docs/architecture.md#Novel-Architectural-Patterns]
-   [Source: docs/sprint-artifacts/tech-spec-epic-2.md#Story-2.1:-AI-Daily-Plan-Generation-API]
-   [Source: docs/sprint-artifacts/tech-spec-epic-2.md#Data-Models-and-Contracts]
-   [Source: docs/sprint-artifacts/tech-spec-epic-2.md#APIs-and-Interfaces]
-   [Source: docs/sprint-artifacts/tech-spec-epic-2.md#Workflows-and-Sequencing]
-   [Source: docs/sprint-artifacts/tech-spec-epic-2.md#Test-Strategy-Summary]
-   [Source: docs/sprint-artifacts/tech-spec-epic-2.md#Non-Functional-Requirements]

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/2-1-ai-daily-plan-generation-api.context.xml`

### Agent Model Used

{{agent_model_name_version}}

### Completion Notes List

### File List