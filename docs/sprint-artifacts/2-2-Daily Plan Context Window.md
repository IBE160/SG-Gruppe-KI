# Story 2.2: Daily Plan Context Window

Status: review

## Story

As a user,
I want to input my daily mood, energy, and soreness levels via a Context Window,
So that the AI can adapt my daily workout plan accordingly.

### Requirements Context Summary

**Epic 2: AI-Powered Training & Logging**

**Story 2.2: Daily Plan Context Window**

**Story Statement:**
As a user,
I want to input my daily mood, energy, and soreness levels via a Context Window,
So that the AI can adapt my daily workout plan accordingly.

**Acceptance Criteria (from tech-spec-epic-2.md):**
*   **AC2.2.1:** A "Context Window" UI is available on the dashboard for the user to input mood, energy, and soreness.
*   **AC2.2.2:** Submitting the context triggers a call to the `/plans/generate` endpoint.

**Architectural Constraints & Guidance (from architecture.md & tech-spec-epic-2.md):**
*   **Frontend (Next.js `apps/web`):**
    *   Responsible for implementing the "Context Window" UI.
    *   Utilizes Zustand (ADR-004) for managing the state of user inputs (mood, energy, soreness).
    *   UI components for the Context Window will reside within `apps/web/src/app/dashboard/` or a dedicated component directory.
    *   Communicates with the backend by sending context data to the `POST /plans/generate` endpoint.
*   **Backend (FastAPI `apps/api`):**
    *   The `POST /plans/generate` endpoint from Story 2.1 will receive the context data.
    *   The `AI Orchestrator` service (Story 2.1) will fuse this context with other user data to generate an adaptive plan.
*   **Novel Architectural Pattern:** This story directly implements the frontend component of the "Adaptive Workout Dialogue" pattern, serving as the primary user input mechanism for AI adaptation.
*   **API Contracts:** The frontend will send context data to the `POST /plans/generate` endpoint, adhering to its request contract.
*   **Testing:** Jest/React Testing Library for frontend UI, Playwright for E2E tests covering context submission.

**UX/UI Context (from ux-design-direction.md & proposal.md):**
*   **Flow 6: Generate AI Daily Plan:**
    *   **Core User Journey:** User accesses a "Context Window," inputs their current state (mood, energy) with smart suggestions. AI generates a plan, which is presented for review and optional adjustment before confirmation.
    *   **Key UX Direction:** Smart Context Window (pre-fills suggestions based on historical patterns and contextual prompts), transparent plan changes, and an "Edit Plan" option.
    *   The UI for the Context Window should be based on `Flow 6, Screen 1 - screen_1/code.html` (top section) from `ux_design_content`.

### Project Structure Alignment and Lessons Learned

**Based on Architectural Guidance:**

*   **Frontend (Next.js `apps/web`):**
    *   A new UI component for the Context Window will be created (e.g., `apps/web/src/components/ContextWindow/ContextWindow.tsx`).
    *   A Zustand store (e.g., `apps/web/src/store/contextStore.ts`) will manage the temporary state of mood, energy, and soreness inputs.
    *   An API utility or hook will be implemented to send the context data to `POST /api/v1/plans/generate`.

**Learnings from Previous Stories (2.1: AI Daily Plan Generation API):**

**From Story 2.1: AI Daily Plan Generation API (Status: drafted)**

*   **New Components/Services Created**: Backend `AI Orchestrator` service (`apps/api/app/services/ai_orchestrator_service.py`), FastAPI endpoint `POST /plans/generate` (`apps/api/app/api/plans.py`), and OpenAI client (`apps/api/app/core/openai_client.py`).
*   **Files Modified**: `apps/api/main.py` (to include new plans router).
*   **Architectural Guidance**: Patterns for FastAPI router registration, service layer implementation, Pydantic model definition, and OpenAI API integration were established. Performance and security considerations for AI calls were outlined.
*   **Technical Debt**: The existing backend testing issue (`ModuleNotFoundError` in Pytest setup) is a critical technical debt. It impacts reliable backend integration testing for backend components.
*   **Interfaces/Services to REUSE**:
    *   Authentication mechanism (Supabase Auth).
    *   Supabase client integration (`apps/api/app/core/supabase.py`) for database interactions.
    *   FastAPI router registration pattern (`apps/api/main.py`).
    *   Pydantic model definition pattern (`apps/api/app/models/`).
    *   Backend service layer pattern (`apps/api/app/services/`).
    *   The `POST /plans/generate` endpoint from Story 2.1 will be directly called by this story.

**Actionable Intelligence for Story 2.2:**

*   **REUSE EXISTING PATTERNS:** Leverage established frontend patterns for creating React components, using Zustand for state management, and making API calls.
*   **INTEGRATE WITH EXISTING API:** This story directly consumes the `POST /plans/generate` API endpoint developed in Story 2.1.
*   **UX/UI ADHERENCE:** Strictly follow the UX design specifications for the Context Window (Flow 6, Screen 1) including smart suggestions and clear input methods.
*   **ADDRESS TECHNICAL DEBT:** The backend testing issue still persists, so unit and E2E tests for the frontend Context Window are crucial.

## Acceptance Criteria

1.  A "Context Window" UI is available on the dashboard.
2.  The Context Window allows users to input their mood (e.g., via emoticons or segmented buttons).
3.  The Context Window allows users to input their energy level (e.g., via segmented buttons).
4.  The Context Window allows users to input any soreness levels (e.g., via multi-select or free text).
5.  The Context Window includes "smart suggestions" based on historical patterns or contextual prompts.
6.  Submitting the context triggers a `POST` request to the `/plans/generate` endpoint with the collected context data.
7.  The context data sent to the backend adheres to the expected format of the `POST /plans/generate` endpoint.

## Tasks / Subtasks

- [x] **Task 1: Implement Context Window UI Component (AC: 1, 2, 3, 4, 5)**
  - [x] Subtask 1.1: Create `apps/web/src/components/ContextWindow/ContextWindow.tsx` based on `Flow 6, Screen 1` (`screen_1/code.html`) from `ux-design-direction.md`.
  - [x] Subtask 1.2: Implement UI for mood input (emoticons/segmented buttons).
  - [x] Subtask 1.3: Implement UI for energy level input (segmented buttons).
  - [x] Subtask 1.4: Implement UI for soreness input (multi-select/free text).
  - [x] Subtask 1.5: Implement logic for "smart suggestions" based on mock data or a simple rule for Phase 1.
  - [x] Subtask 1.6: Write unit tests (Jest/RTL) for the Context Window component, verifying UI rendering and interaction with input fields.
- [x] **Task 2: Implement Context Window State Management**
  - [x] Subtask 2.1: Create `apps/web/src/store/contextStore.ts` using Zustand to manage the temporary state of mood, energy, and soreness inputs within the Context Window.
  - [x] Subtask 2.2: Integrate the `contextStore` with the `ContextWindow.tsx` component to capture user inputs.
  - [x] Subtask 2.3: Write unit tests for `contextStore.ts` to ensure state updates correctly.
- [x] **Task 3: Implement Context Submission Logic (AC: 6, 7)**
  - [x] Subtask 3.1: Implement an API utility or hook (e.g., in `apps/web/src/lib/planApi.ts`) to send the collected context data from `contextStore` to the `POST /api/v1/plans/generate` endpoint.
  - [x] Subtask 3.2: Add a "Submit" button to the `ContextWindow.tsx` that triggers the API call.
  - [x] Subtask 3.3: Handle loading and error states for the API call in the UI.
  - [x] Subtask 3.4: Write integration tests (Jest) for the submission logic, mocking the API call.
- [x] **Task 4: E2E Testing**
  - [x] Subtask 4.1: Write an E2E test (Playwright) that navigates to the dashboard, interacts with the Context Window, inputs data, and verifies that a `POST` request to `/plans/generate` is successfully made with the correct payload.

## Dev Notes

*   **UI/UX:** Strict adherence to the `ux-design-direction.md` (Flow 6, Screen 1) is essential for the Context Window's appearance and interaction.
*   **Frontend-Backend Contract:** Ensure the context data sent from the frontend to `POST /plans/generate` precisely matches the backend's expected Pydantic model for context input.
*   **Phase 1 vs. Phase 2:** For Phase 1, "smart suggestions" can be implemented with mock data or a simple rule. Dynamic suggestions based on historical patterns or physiological signals are Phase 2 considerations.
*   **Testing:** Given the `ModuleNotFoundError` technical debt affecting backend integration tests, prioritize comprehensive frontend unit tests and E2E tests for this story to ensure functionality.

### Learnings from Previous Story (2.1: AI Daily Plan Generation API)

**From Story 2.1: AI Daily Plan Generation API (Status: drafted)**

*   **New Components/Services Created**: Backend `AI Orchestrator` service (`apps/api/app/services/ai_orchestrator_service.py`), FastAPI endpoint `POST /plans/generate` (`apps/api/app/api/plans.py`), and OpenAI client (`apps/api/app/core/openai_client.py`).
*   **Files Modified**: `apps/api/main.py` (to include new plans router).
*   **Architectural Guidance**: Patterns for FastAPI router registration, service layer implementation, Pydantic model definition, and OpenAI API integration were established. Performance and security considerations for AI calls were outlined.
*   **Technical Debt**: The existing backend testing issue (`ModuleNotFoundError` in Pytest setup) is a critical technical debt. This story (2.2) will rely on the `/plans/generate` endpoint, whose backend integration tests are affected.
*   **Interfaces/Services to REUSE**:
    *   Authentication mechanism (Supabase Auth).
    *   FastAPI router registration pattern (`apps/api/main.py`).
    *   Pydantic model definition pattern (`apps/api/app/models/`).
    *   Backend service layer pattern (`apps/api/app/services/`).
    *   The `POST /plans/generate` API endpoint itself will be consumed by this story.

**Actionable Intelligence for Story 2.2:**

*   **REUSE EXISTING PATTERNS:** Leverage established frontend patterns for creating React components, using Zustand for state management, and making API calls.
*   **INTEGRATE WITH EXISTING API:** This story directly consumes the `POST /plans/generate` API endpoint developed in Story 2.1.
*   **UX/UI ADHERENCE:** Strictly follow the UX design specifications for the Context Window (Flow 6, Screen 1) including smart suggestions and clear input methods.
*   **ADDRESS TECHNICAL DEBT:** The backend testing issue still persists, so unit and E2E tests for the frontend Context Window are crucial.

## Dev Agent Record

### Context Reference
- `docs/architecture.md`
- `docs/epics.md`
- `docs/ux-design-direction.md`
- `docs/sprint-artifacts/2-1-ai-daily-plan-generation-api.md`
- docs/sprint-artifacts/2-2-Daily Plan Context Window.context.xml

### Agent Model Used
Gemini

### Debug Log References
- No debug logs for this story yet.

### Completion Notes List
- Implemented Context Window UI (`ContextWindow.tsx`) with mood, energy, and soreness inputs.
- Added smart suggestions logic based on the day of the week.
- Implemented Zustand store (`contextStore.ts`) for state management.
- Integrated Zustand store with `ContextWindow.tsx`.
- Developed API utility (`planApi.ts`) for `POST /api/v1/plans/generate` endpoint.
- Integrated API call and handled loading/error states in `ContextWindow.tsx`.
- Authored comprehensive unit tests for `ContextWindow.tsx` and `contextStore.ts`.
- Created E2E test (`context-window.spec.ts`) for the feature.

### File List
- Added: `apps/web/src/components/ContextWindow/ContextWindow.tsx`
- Added: `apps/web/src/components/MaterialSymbol.tsx`
- Added: `apps/web/src/components/ContextWindow/ContextWindow.test.tsx`
- Added: `apps/web/src/store/contextStore.ts`
- Added: `apps/web/src/store/contextStore.test.ts`
- Added: `apps/web/src/lib/planApi.ts`
- Added: `tests/e2e/context-window.spec.ts`
- Modified: `c:\Users\Robert\Documents\AI-Powered Personal Training Advisor\SG-Gruppe-KI\docs\sprint-artifacts\2-2-Daily Plan Context Window.md`

## Change Log

- **2025-12-14**: Story drafted by SM agent.
