# Test Design Document - Epic 2: AI-Powered Training & Logging

## Epic Overview

**Goal**: Implement the core AI daily plan generation, workout player, and progress tracking to deliver personalized and adaptive training experiences.

## 1. Risk Assessment

Based on the analysis of Epic 2 stories (FR002, FR003, FR004, FR009, FR010, FR011) and NFRs (NFR004, NFR005, NFR008, NFR009), the following risks have been identified and classified:

### Risk Assessment Matrix

| Risk ID | Category | Description | Probability | Impact | Score | Action | Mitigation Plan |
|---|---|---|---|---|---|---|---|
| R2.1 | DATA, BUS | Context Window: Incorrect data input/validation, poor UX, incorrect saving to `daily_contexts`. | 2 | 2 | 4 | MONITOR | Implement robust frontend validation, clear UI feedback, thorough API validation. |
| R2.2 | TECH, PERF, DATA | AI Daily Plan Generation: AI hallucinations/incorrect plans, slow response time, OpenAI API issues, prompt engineering errors, incorrect data fetching. | 3 | 3 | 9 | BLOCK | Strict prompt engineering, AI response validation, caching, fallback mechanisms, comprehensive error handling for OpenAI API. |
| R2.3 | BUS | Display Daily Workout Plan: Incorrect plan rendering, UI bugs, poor user experience. | 2 | 2 | 4 | MONITOR | Thorough UI testing, consistent data mapping from backend to frontend. |
| R2.4 | BUS | Workout Player UI: UI responsiveness issues, incorrect timer functionality, display errors. | 2 | 2 | 4 | MONITOR | Rigorous UI/UX testing, performance profiling, precise timer implementation. |
| R2.5 | DATA | Workout Logging: Incorrect logging (reps, weight, RPE), data loss, data integrity issues with `workout_logs`. | 2 | 3 | 6 | MITIGATE | Implement strong backend validation, transactional logging, data consistency checks. |
| R2.6 | DATA, PERF | Basic Progress Dashboard: Incorrect data aggregation/calculation, misleading visualizations, performance issues. | 2 | 2 | 4 | MONITOR | Unit test data calculations, validate visualization logic, optimize database queries. |
| R2.7 | TECH, BUS | Simulated Recovery Inputs: Incorrect simulation data, AI not adapting as expected, difficulty in validating AI behavior. | 2 | 2 | 4 | MONITOR | Develop clear test cases for AI adaptation, monitor AI outputs with simulated data. |
| R2.8 | TECH, DATA, PERF | Weekly Review Ritual: Scheduled job failures, incorrect summary generation, performance issues with data processing. | 2 | 2 | 4 | MONITOR | Implement robust error handling and retry mechanisms for background jobs, optimize data aggregation for summaries. |
| R2.9 | PERF | NFR004 (AI Performance) & NFR009 (Rate Limiting): Failure to meet AI response time NFR, hitting API rate limits. | 3 | 3 | 9 | BLOCK | Implement AI response caching, rate limiting strategies, and circuit breakers for OpenAI API calls. |

### Summary of Risks:

*   **Total risks identified**: 9
*   **High-priority risks (score ≥6)**: 3 (R2.2, R2.5, R2.9)
*   **Categories involved**: DATA, BUS, TECH, PERF

## 2. Test Coverage Design

### Test Scenarios and Levels

| Test Scenario | Test Level(s) | Priority | Risk Link(s) |
|---|---|---|---|
| `enter_valid_daily_context` | E2E, API | P2 | R2.1 |
| `validate_daily_context_persistence` | API | P2 | R2.1 |
| `attempt_invalid_daily_context_input` | API | P2 | R2.1 |
| `generate_plan_with_full_context` | API | P0 | R2.2, R2.9 |
| `generate_plan_with_minimal_context` | API | P1 | R2.2 |
| `validate_ai_response_json_schema` | UNIT, API | P0 | R2.2 |
| `test_ai_plan_adaptation_for_low_energy` | API | P0 | R2.2 |
| `test_ai_plan_adaptation_for_injury` | API | P0 | R2.2 |
| `handle_openai_api_failure_gracefully` | P0 | R2.2 |
| `test_ai_response_time_performance` | PERFORMANCE | P0 | R2.2, R2.9 |
| `display_generated_plan_correctly` | E2E | P2 | R2.3 |
| `display_empty_plan_message` | E2E | P2 | R2.3 |
| `start_workout_player_and_display_first_exercise` | E2E | P2 | R2.4 |
| `timer_functions_correctly_for_rest_periods` | E2E | P2 | R2.4 |
| `navigate_through_exercises` | E2E | P2 | R2.4 |
| `log_workout_set_successfully` | E2E, API | P1 | R2.5 |
| `validate_workout_log_persistence` | API | P1 | R2.5 |
| `attempt_invalid_workout_log_input` | API | P1 | R2.5 |
| `display_correct_workout_volume` | API | P2 | R2.6 |
| `display_correct_workout_streak` | API | P2 | R2.6 |
| `dashboard_loads_within_performance_thresholds` | PERFORMANCE | P2 | R2.6 |
| `ai_adjusts_plan_for_simulated_poor_recovery` | API | P1 | R2.7 |
| `ai_adjusts_plan_for_simulated_good_recovery` | API | P2 | R2.7 |
| `generate_weekly_summary_correctly` | INTEGRATION (Background Job) | P2 | R2.8 |
| `weekly_summary_performance_metrics` | PERFORMANCE | P2 | R2.8 |
| `ai_response_caching_effectiveness` | PERFORMANCE | P0 | R2.9 |
| `rate_limiting_prevents_api_abuse` | API | P0 | R2.9 |
| `stress_test_ai_plan_generation_endpoint` | PERFORMANCE | P0 | R2.9 |

### Test Effort Estimates

*   **P0 scenarios**: 8 tests × 3 hours = 24 hours
*   **P1 scenarios**: 4 tests × 2 hours = 8 hours
*   **P2 scenarios**: 16 tests × 1 hour = 16 hours
*   **Total**: 48 hours (~6 days)

_Note: Estimates are high-level. Complex AI behavior or performance issues may require more time._

### Test Execution Order

1.  **UNIT Tests**: Fast feedback, executed first in CI.
2.  **API (Integration) Tests**: Core AI logic, data persistence, error handling, executed after unit tests in CI.
3.  **E2E Tests**: UI interactions, critical user flows, executed later in CI.
4.  **PERFORMANCE Tests**: Validate NFRs for AI response times, dashboard loading, etc.
5.  **Background Job Tests**: Validate scheduled tasks and data processing.

## 3. Quality Gate Criteria

*   **All P0 tests pass**: 100%
*   **P1 tests pass rate**: ≥95%
*   **High-risk (score ≥6) items**: 100% mitigated or waived with explicit approval.
*   **Test coverage**: ≥80% for P0/P1 critical paths.
*   **AI Performance (NFR004)**: p95 API (non-AI) < 300ms; AI p95 ≤ 10s.
*   **AI Rate Limiting (NFR009)**: All rate limiting strategies must function as designed.

## 4. Next Steps

1.  **Review risk assessment with team**: Discuss and refine identified risks and mitigation plans.
2.  **Prioritize mitigation for high-risk items**: Assign owners and deadlines for risks with score ≥6 (especially R2.2, R2.5, R2.9).
3.  **Generate failing tests**: Use the `atdd` workflow to create initial failing tests for P0/P1 scenarios (especially AI plan generation and logging).
4.  **Allocate resources**: Assign development and QA resources based on effort estimates.
5.  **Set up test data factories and mocks**: Prepare reusable test data and mock AI responses for efficient test development.