# Story 2.1: AI Daily Plan Generation API

Status: drafted

## Story

As a backend service,
I want to expose an API endpoint that generates a structured daily workout plan based on user profile, historical data, and contextual inputs, including simulated recovery,
So that the frontend can display a personalized plan.

### Requirements Context Summary

**Epic 2: AI-Powered Training & Logging**

**Story 2.1: AI Daily Plan Generation API**

**Story Statement:**
As a backend service,
I want to expose an API endpoint that generates a structured daily workout plan based on user profile, historical data, and contextual inputs, including simulated recovery,
So that the frontend can display a personalized plan.

**Acceptance Criteria (from tech-spec-epic-2.md):**
*   **AC2.1.1:** A `POST /plans/generate` endpoint is created in the FastAPI backend.
*   **AC2.1.2:** The endpoint constructs a prompt and successfully calls the OpenAI API to generate a workout plan in a structured JSON format.
*   **AC2.1.3:** The generated plan is stored in the `WorkoutPlans` table.
*   **AC2.1.4:** The endpoint includes an `ai_explanation` in the response if the plan was adapted based on user context.

**Architectural Constraints & Guidance (from architecture.md & tech-spec-epic-2.md):**
*   **API Pattern:** FastAPI (0.123.7) is the chosen backend framework.
*   **AI Engine:** OpenAI API (GPT) will be used by the `AI Orchestrator` service to generate personalized workout plans.
*   **Data Persistence:** PostgreSQL (Supabase) will store the generated workout plans in the `WorkoutPlans` table.
*   **Backend (FastAPI `apps/api`):**
    *   Responsible for AI orchestration, prompt construction, and interaction with the OpenAI API.
    *   The `AI Orchestrator` service will fuse user inputs (profile, history, context, simulated recovery) into a detailed prompt.
    *   A `Plan Service` will manage CRUD operations for `WorkoutPlans`.
*   **API Contracts:** The API will adhere to the OpenAPI standard, be versioned (`/api/v1/`), and protected endpoints will expect a `Bearer` token.
*   **Performance:** The `p95` latency for the `/plans/generate` endpoint, including the external AI call, MUST be ≤ 10 seconds.
*   **Security:**
    *   OpenAI API key must be managed securely via environment variables.
    *   The `AI Orchestrator` service must sanitize free-text user inputs to prevent prompt injection attacks.
    *   RLS policies in Supabase will strictly segregate `WorkoutPlans` by `user_id`.
    *   Input validation will use Pydantic models.
*   **Novel Architectural Pattern:** This story directly implements the core of the "Adaptive Workout Dialogue" pattern, enabling the transparent, effective, and continuous learning conversational loop between the user and AI.
*   **Reliability:** Implement graceful error handling or a default fallback if the external AI service is unavailable.
*   **Observability:** Log prompts sent to the AI model and raw responses received (with sensitive data redacted).

**UX/UI Context (from ux-design-direction.md & proposal.md):**
*   **Flow 6: Generate AI Daily Plan:** The backend API supports the frontend's Context Window (for user input like mood, energy) and Plan Review UI (for displaying the adaptive plan with explanations).
*   **Key UX Direction:** The backend's ability to provide transparent plan changes (via `ai_explanation`) and adaptiveness based on user context is crucial for the UX.

### Project Structure Alignment and Lessons Learned

**Based on Architectural Guidance:**

*   **Backend (FastAPI `apps/api`):**
    *   A new API endpoint `POST /plans/generate` will be created within `apps/api/app/api/plans.py` and included in `apps/api/main.py`.
    *   An `AI Orchestrator` service (e.g., `apps/api/app/services/ai_orchestrator_service.py`) will be responsible for:
        *   Fusing inputs (`userId`, `goals`, `equipment`, `historicalData`, `context`).
        *   Constructing the prompt for the OpenAI API.
        *   Interacting with the OpenAI API to generate the workout plan.
        *   Parsing the OpenAI API response into a structured JSON workout plan.
        *   Generating explanations for plan adaptations.
    *   Pydantic models will be defined for the request body (inputs to the endpoint) and the response body (structured JSON workout plan).
    *   The generated plan will be stored in the Supabase `WorkoutPlans` table (e.g., via a `plans_service.py`).
*   **Data Persistence (Supabase PostgreSQL):** The `WorkoutPlans` table will store the AI-generated plans. This will be interacted with via backend services.

**Learnings from Previous Stories (1.4: User Profile Management):**

**From Story 1.4: User Profile Management (Status: ready-for-dev)**

*   **New Components/Services Created**: Frontend components for user profile management. Backend FastAPI router (`user.py`) and service (`user_service.py`) for `GET /users/me` and `PUT /users/me`.
*   **Files Modified**: `apps/api/main.py` (to include new user router).
*   **Architectural Guidance**: Patterns for Zustand store usage, Supabase client integration (`apps/api/app/core/supabase.py`), FastAPI router registration (`apps/api/main.py`), and Pydantic model definition were reinforced. Authorization logic for user-specific data was implemented.
*   **Technical Debt**: The existing backend testing issue (`ModuleNotFoundError` in Pytest setup) continues to be a critical technical debt. It impacts reliable backend integration testing.
*   **Interfaces/Services to REUSE**:
    *   Authentication mechanism (Supabase Auth).
    *   Supabase client integration (`apps/api/app/core/supabase.py`) for database interactions.
    *   FastAPI router registration pattern (`apps/api/main.py`).
    *   Pydantic model definition pattern (`apps/api/app/models/`).
    *   Backend service layer pattern (`apps/api/app/services/`).

**Actionable Intelligence for Story 2.1:**

*   **REUSE EXISTING PATTERNS:** Leverage established patterns for FastAPI router registration, service layer implementation, and Pydantic model definition.
*   **ADDRESS TECHNICAL DEBT:** The `ModuleNotFoundError` in Pytest setup is highly relevant here as the core of this story is backend. Prioritize resolving this to ensure proper testing of the AI orchestration logic. If unresolved, strong emphasis on E2E testing for the API endpoint.
*   **OPENAI API INTEGRATION:** Carefully manage the OpenAI API key using environment variables. Implement robust error handling and retry mechanisms for API calls.
*   **PROMPT ENGINEERING:** The "AI Orchestrator" will be responsible for constructing effective prompts to guide the OpenAI model to produce structured, adaptive workout plans. This will require iteration and refinement.
*   **PERFORMANCE:** Focus on optimizing the AI call latency to meet the `p95` API latency for AI of ≤ 10s.

## Acceptance Criteria

1.  The FastAPI backend exposes a `POST /plans/generate` API endpoint.
2.  A `POST` request to `/plans/generate` with valid `userId`, `goals`, `equipment`, `historicalData`, and `context` (including `recovery_bias` and simulated HRV/sleep) is successfully processed.
3.  The AI Orchestrator service correctly constructs a prompt for the AI model based on the provided inputs.
4.  The AI model (OpenAI API) generates a structured JSON workout plan.
5.  The API response includes the structured JSON workout plan and an explanation for plan adaptations based on the context.
6.  The `p95` API latency for AI-related processing of this endpoint is ≤ 10s.
7.  The generated plan is successfully stored in the `WorkoutPlans` database table in Supabase.

## Tasks / Subtasks

- [ ] **Task 1: Setup OpenAI API Integration**
  - [ ] Subtask 1.1: Securely configure OpenAI API key as an environment variable in the backend (`apps/api`).
  - [ ] Subtask 1.2: Implement a basic OpenAI client in `apps/api/app/core/openai_client.py` for making API calls.
  - [ ] Subtask 1.3: Write unit tests for the OpenAI client to ensure correct setup and basic interaction.
- [ ] **Task 2: Implement AI Orchestrator Service**
  - [ ] Subtask 2.1: Create `apps/api/app/services/ai_orchestrator_service.py`.
  - [ ] Subtask 2.2: Implement logic to fuse inputs (`userId`, `goals`, `equipment`, `historicalData`, `context`, `recovery_bias`, simulated HRV/sleep).
  - [ ] Subtask 2.3: Implement logic to construct a detailed prompt for the OpenAI model, including user profile, constraints, and contextual inputs.
  - [ ] Subtask 2.4: Integrate with the OpenAI client to send the prompt and receive the AI-generated response.
  - [ ] Subtask 2.5: Implement logic to parse and validate the AI model's response, ensuring it's a structured JSON workout plan.
  - [ ] Subtask 2.6: Implement logic to extract or generate an explanation for plan adaptations based on the AI's response.
  - [ ] Subtask 2.7: Write unit tests for the `ai_orchestrator_service` covering input fusion, prompt construction, and response parsing.
- [ ] **Task 3: Implement `POST /plans/generate` API Endpoint**
  - [ ] Subtask 3.1: Create Pydantic models for the request body (inputs to the endpoint) and response body (structured workout plan + explanation).
  - [ ] Subtask 3.2: Create `apps/api/app/api/plans.py` and define a FastAPI router.
  - [ ] Subtask 3.3: Implement the `POST /plans/generate` endpoint, protecting it with authentication.
  - [ ] Subtask 3.4: Integrate the `ai_orchestrator_service` to generate the plan.
  - [ ] Subtask 3.5: Implement logic to store the generated plan in the Supabase `WorkoutPlans` table via a `plans_service.py` (e.g., `apps/api/app/services/plans_service.py`).
  - [ ] Subtask 3.6: Update `apps/api/main.py` to include the new `plans` router.
  - [ ] Subtask 3.7: Write integration tests (Pytest) for the `POST /plans/generate` endpoint, mocking OpenAI API calls and Supabase interactions. (Prioritize resolving `ModuleNotFoundError` tech debt for this).
- [ ] **Task 4: Performance Optimization and Monitoring (AC: 6)**
  - [ ] Subtask 4.1: Implement logging for AI API call latency within the `ai_orchestrator_service`.
  - [ ] Subtask 4.2: Implement basic monitoring hooks to track `p95` latency for the `/plans/generate` endpoint.
  - [ ] Subtask 4.3: Investigate prompt engineering techniques to optimize AI response time.
- [ ] **Task 5: Ensure Data Storage (AC: 7)**
  - [ ] Subtask 5.1: Verify the Supabase `WorkoutPlans` table schema is correctly defined to store the structured JSON workout plan.
  - [ ] Subtask 5.2: Ensure the `plans_service.py` correctly interacts with the `WorkoutPlans` table.
- [ ] **Task 6: E2E Testing**
  - [ ] Subtask 6.1: Write an E2E test (Playwright) that simulates a user providing context and triggering plan generation, verifying the API response and storage in the database.

## Dev Notes

*   **AI Orchestration:** The `ai_orchestrator_service` is central to this story. Its prompt engineering and input fusion logic are critical for the quality and adaptiveness of the generated plans. Iterative refinement of prompts will be essential.
*   **Supabase Interaction:** Ensure the Supabase `WorkoutPlans` table is correctly set up with the appropriate schema for storing structured JSON data.
*   **Performance:** The 10s latency target for AI calls is stringent. Consider asynchronous processing and potential caching strategies if initial performance is an issue.
*   **Error Handling:** Implement robust error handling for OpenAI API calls (e.g., retries, timeouts, fallback mechanisms if AI fails).
*   **Testing:** Given the backend testing tech debt, prioritize resolving the `ModuleNotFoundError` for Pytest. Comprehensive unit tests for `ai_orchestrator_service` and E2E tests for the full flow will be crucial.

### Learnings from Previous Story (1.4: User Profile Management)

**From Story 1.4: User Profile Management (Status: ready-for-dev)**

*   **New Components/Services Created**: Frontend components for user profile management. Backend FastAPI router (`user.py`) and service (`user_service.py`) for `GET /users/me` and `PUT /users/me`.
*   **Files Modified**: `apps/api/main.py` (to include new user router).
*   **Architectural Guidance**: Patterns for Zustand store usage, Supabase client integration (`apps/api/app/core/supabase.py`), FastAPI router registration (`apps/api/main.py`), and Pydantic model definition were reinforced. Authorization logic for user-specific data was implemented.
*   **Technical Debt**: The existing backend testing issue (`ModuleNotFoundError` in Pytest setup) continues to be a critical technical debt. It impacts reliable backend integration testing.
*   **Interfaces/Services to REUSE**:
    *   Authentication mechanism (Supabase Auth).
    *   Supabase client integration (`apps/api/app/core/supabase.py`) for database interactions.
    *   FastAPI router registration pattern (`apps/api/main.py`).
    *   Pydantic model definition pattern (`apps/api/app/models/`).
    *   Backend service layer pattern (`apps/api/app/services/`).

**Actionable Intelligence for Story 2.1:**

*   **REUSE EXISTING PATTERNS:** Leverage established patterns for FastAPI router registration, service layer implementation, and Pydantic model definition.
*   **ADDRESS TECHNICAL DEBT:** The `ModuleNotFoundError` in Pytest setup is highly relevant here as the core of this story is backend. Prioritize resolving this to ensure proper testing of the AI orchestration logic. If unresolved, strong emphasis on E2E testing for the API endpoint.
*   **OPENAI API INTEGRATION:** Carefully manage the OpenAI API key using environment variables. Implement robust error handling and retry mechanisms for API calls.
*   **PROMPT ENGINEERING:** The "AI Orchestrator" will be responsible for constructing effective prompts to guide the OpenAI model to produce structured, adaptive workout plans. This will require iteration and refinement.
*   **PERFORMANCE:** Focus on optimizing the AI call latency to meet the `p95` API latency for AI of ≤ 10s.

## Dev Agent Record

### Context Reference
- `docs/architecture.md`
- `docs/epics.md`
- `docs/ux-design-direction.md`
- `docs/sprint-artifacts/1-4-user-profile-management.md`

### Agent Model Used
Gemini

### Debug Log References
- No debug logs for this story yet.

### Completion Notes List
- Not started.

### File List
- Not started.

## Change Log

- **2025-12-14**: Story drafted by SM agent.