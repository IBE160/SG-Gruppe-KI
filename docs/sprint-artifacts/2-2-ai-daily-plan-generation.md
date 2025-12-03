# Story 2.2: AI Daily Plan Generation

Status: ready-for-dev

## Story

As a User,
I want the AI to generate a personalized daily workout plan based on my goals, profile, and daily context,
So that I have a clear plan to follow.

## Acceptance Criteria

1.  **AC 2.2.1:** Given a user has provided their daily context, when they request a new plan for the day, then the FastAPI backend constructs a prompt with the user's profile, daily context, and recent workout history.
2.  **AC 2.2.2:** And the AI returns a valid JSON workout plan which is then saved to the `workout_plans` table.

## Tasks / Subtasks

- [x] **Task 1: Backend API for Plan Generation** (AC: 2.2.1, 2.2.2)
  - [x] Create a `POST /api/v1/workout_plans/generate` endpoint in FastAPI to trigger plan generation. (Source: `tech-spec-epic-2.md#APIs-and-Interfaces`)
  - [x] Implement the `AI Plan Generation Service` to orchestrate data fetching (user profile, daily context, workout history). (Source: `tech-spec-epic-2.md#Services-and-Modules`)
  - [x] Construct a prompt for the OpenAI API using relevant user data.
  - [x] Implement logic to call the OpenAI API.
  - [x] Validate OpenAI's JSON response against the defined schema (`Architecture.md`).
  - [x] Save the valid `plan_json` to the `workout_plans` table.
  - [x] Implement AI Response Caching using Redis. (Source: `tech-spec-epic-2.md#Services-and-Modules`)
- [x] **Task 2: Data Model & Schema Verification** (AC: 2.2.2)
  - [x] Verify the `workout_plans` table schema in Supabase (`id`, `user_id`, `plan_date`, `plan_json`, `status`). (Source: `tech-spec-epic-2.md#Data-Models-and-Contracts`)
  - [x] Verify the `AI Workout Plan JSON Structure` defined in `Architecture.md`.
- [x] **Task 3: Testing** (AC: 2.2.1, 2.2.2)
  - [x] Add Pytest integration tests for the `POST /api/v1/workout_plans/generate` endpoint, mocking OpenAI API calls.
  - [x] Test prompt construction and data extraction.
  - [x] Test JSON schema validation of the AI response.
  - [x] Test AI Response Caching functionality.

## Dev Notes

### Relevant Architecture Patterns and Constraints

- **AI Model Serving:** OpenAI API (Cloud) is integrated via the FastAPI backend for generating and adapting workout plans. (Source: `architecture.md#AI-Model-Serving`)
- **Data Architecture:** `workout_plans` table stores the complete, versioned AI-generated workout plan structure in JSONB format. (Source: `architecture.md#Data-Architecture`)
- **API Design:** RESTful API with JSON, `POST /api/v1/workout_plans/generate` endpoint. (Source: `architecture.md#API-Design`)
- **Performance:** AI Response Caching (Redis) must be implemented for frequently requested or similar plans to meet P95 AI plan generation time ≤ 10s. (Source: `tech-spec-epic-2.md#Performance`)
- **Security:** AI prompt security (sanitization) and rate limiting on the AI endpoint are critical. (Source: `tech-spec-epic-2.md#Security`)

### Source Tree Components to Touch

- `backend/app/api/v1/workout_plans.py`: Create endpoint `POST /api/v1/workout_plans/generate`.
- `backend/app/services/ai_plan_service.py`: Implement core logic for AI plan generation, data orchestration, OpenAI API calls, and response validation.
- `backend/app/schemas/workout_plan.py`: Define Pydantic schema for the workout plan if not already present.
- `backend/tests/`: Add new tests for AI plan generation.

### Testing Standards Summary

- Backend unit tests with Pytest.
- Integration tests for `POST /api/v1/workout_plans/generate` endpoint, mocking OpenAI API calls.
- Test prompt construction and data extraction.
- Test JSON schema validation of the AI response.
- Test AI Response Caching functionality. (Source: `tech-spec-epic-2.md#Test-Strategy-Summary`)

### Project Structure Notes

- New services and API endpoints will adhere to the existing monorepo structure. (Source: `architecture.md#Project-Structure`)

### References

- [Source: docs/epics.md#Story-2.2:-AI-Daily-Plan-Generation]
- [Source: docs/sprint-artifacts/tech-spec-epic-2.md#Story-2.2:-AI-Daily-Plan-Generation]
- [Source: docs/architecture.md#AI-Integration-and-Prompting]
- [Source: docs/architecture.md#Data-Architecture]

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/2-2-ai-daily-plan-generation.context.xml`

### Agent Model Used

Gemini CLI

### Debug Log References

### Completion Notes List

### File List

## Change Log

- 2025-11-25: Story content updated with detailed requirements and tasks.
- 2025-11-24: Initial draft created by Gemini CLI.
