# Test Design: Epic 2 - AI-Powered Training & Logging

**Date:** onsdag 19. november 2025
**Author:** BIP
**Status:** Draft / Approved

---

## Executive Summary

**Scope:** full test design for Epic 2

**Risk Summary:**

- Total risks identified: 26
- High-priority risks (≥6): 11
- Critical categories: SEC, DATA, BUS, TECH, PERF, OPS

**Coverage Summary:**

- P0 scenarios: 17 (34.0 hours)
- P1 scenarios: 23 (23.0 hours)
- P2 scenarios: 5 (2.5 hours)
- P3 scenarios: 3 (0.75 hours)
- **Total effort**: 60.25 hours (~8 days)

---

## Risk Assessment

### High-Priority Risks (Score ≥6)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner | Timeline |
| ------- | -------- | ----------- | ----------- | ------ | ----- | ---------- | ------- | -------- |
| R2-1.1.1-1 | SEC | OpenAI API Key Exposure | 2 | 3 | 6 | Securely manage API keys using a robust secrets management solution. Implement strict access control to production environments. | Security Team | TBD |
| R2-1.2.1-1 | DATA/TECH | AI Generated Plan Fails Schema Validation | 3 | 3 | 9 | Implement strict backend validation of AI output against the expected JSON schema. Implement retry logic for API calls that return malformed JSON. Refine prompts to emphasize output format. | Dev Team | TBD |
| R2-1.2.1-2 | BUS | AI Generated Plan is Not Personalized/Relevant | 2 | 3 | 6 | Implement A/B testing for prompt variations. Gather user feedback on plan quality. Continuously refine prompt engineering based on user data and feedback. Implement a human-in-the-loop review for early plans. | Product/AI Team | TBD |
| R2-1.2.1-3 | SEC | Prompt Injection Vulnerability | 2 | 3 | 6 | Implement input sanitization and validation for all user-provided data before it's included in AI prompts. Limit the scope and capabilities of the AI where user input is directly processed. | Security Team | TBD |
| R2-1.3.1-1 | SEC | Unauthorized Access to Plan Generation Endpoint | 2 | 3 | 6 | Implement robust authentication and authorization checks on the `/plans` endpoint using FastAPI's security features and Supabase Auth. Ensure RLS is correctly configured. | Dev Team | TBD |
| R2-1.3.1-3 | PERF | Slow API Response Time for Plan Generation | 2 | 3 | 6 | Implement AI Response Caching (Story 2.1.4). Optimize database queries. Implement monitoring and alerts for AI response times (NFR008). Explore streaming responses if applicable. | Dev Team | TBD |
| R2-1.4.1-1 | DATA/BUS | Stale Cache Data | 2 | 3 | 6 | Implement robust cache invalidation strategies based on changes to user profile, goals, or preferences. Ensure TTLs are appropriate. | Dev Team | TBD |
| R2-6.1-1 | DATA/BUS | Offline Plan Not Available/Corrupted | 2 | 3 | 6 | Implement redundant local storage mechanisms. Add data integrity checks for cached plans. Thoroughly test offline access scenarios. | Dev Team | TBD |
| R2-7.1-1 | DATA | Lost Offline Log Data | 2 | 3 | 6 | Implement robust persistence for locally cached logs (e.g., IndexedDB with transactionality). Implement data recovery mechanisms for potential local storage corruption. | Dev Team | TBD |
| R2-7.1-2 | DATA/TECH | Data Conflicts During Offline/Online Sync | 3 | 3 | 9 | Implement a sophisticated conflict resolution strategy (e.g., last-write-wins with versioning, user-prompted resolution for critical conflicts). Thoroughly unit and integration test this mechanism. | Dev Team | TBD |
| R2-8.1-1 | BUS | Fallback Plan Not Available/Functional | 2 | 3 | 6 | Ensure multiple fallback strategies (cached, rule-based, template-based). Implement health checks for fallback services. Thoroughly test all fallback scenarios. | Dev Team | TBD

### Medium-Priority Risks (Score 3-4)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner |
| ------- | -------- | ----------- | ----------- | ------ | ----- | ---------- | ------- |
| R2-1.1.1-2 | OPS/PERF | OpenAI API Rate Limit Exceeded | 2 | 2 | 4 | Implement client-side rate limiting/throttling. Implement backend rate limiting (NFR009). Implement exponential backoff for OpenAI API calls. | Dev Team |
| R2-1.3.1-2 | DATA/TECH | Data Inconsistency between AI Output and Database Save | 2 | 2 | 4 | Implement transactional operations for plan generation and saving. Implement idempotency for plan creation. Implement logging and alerting for partial failures (NFR008). | Dev Team |
| R2-1.3.1-4 | SEC/TECH | Insufficient Input Validation for Endpoint Parameters | 2 | 2 | 4 | Implement comprehensive input validation (e.g., Pydantic models in FastAPI) for all API endpoint parameters. | Dev Team |
| R2-2.1.1-1 | BUS/TECH | UI Does Not Match UX Spec | 2 | 2 | 4 | Implement thorough UI component tests and visual regression tests. Conduct regular UX reviews. | UX/Dev Team |
| R2-2.1.1-2 | BUS | Poor Responsive Design | 2 | 2 | 4 | Implement responsive design principles (Tailwind CSS breakpoints). Conduct cross-device testing with Playwright. | Dev Team |
| R2-2.1.1-3 | BUS/TECH | Accessibility Issues in UI | 2 | 2 | 4 | Incorporate accessibility audits (automated and manual) into UI development. Use ARIA attributes. | Dev Team |
| R2-2.2.1-1 | BUS/TECH | Inaccurate Timers | 2 | 2 | 4 | Implement precise timer logic with unit tests. Test on various device performance profiles. | Dev Team |
| R2-2.2.1-2 | OPS/TECH | Spotify Integration Failures | 2 | 2 | 4 | Implement robust error handling and retry mechanisms for Spotify API calls. Provide clear user feedback for failures. | Dev Team |
| R2-3.1-2 | TECH | Data Validation Failure for Log Inputs | 2 | 2 | 4 | Implement strict server-side validation for all workout log inputs. | Dev Team |
| R2-4.1-2 | PERF | Poor Dashboard Performance/Load Times | 2 | 2 | 4 | Optimize database queries for aggregation. Implement data pre-computation/caching for dashboard metrics. | Dev Team |
| R2-4.1-3 | BUS | Misleading Data Visualizations | 2 | 2 | 4 | Conduct user testing for dashboard clarity. Ensure UX adherence to "Data-Driven Dashboard" design. | UX/Dev Team |
| R2-5.1-1 | OPS/BUS | Reminders Not Delivered/Delayed | 2 | 2 | 4 | Implement a reliable background job processing system (Celery/Redis as per architecture). Implement monitoring for job failures/delays. | Dev Team |
| R2-5.1-2 | BUS | Overly Frequent/Irrelevant Nudges | 2 | 2 | 4 | Implement configurable frequency limits and context-awareness logic for nudges, with user feedback mechanisms. | Product/AI Team |
| R2-6.1-2 | DATA/BUS | Stale Offline Plan Data | 2 | 2 | 4 | Implement robust cache invalidation logic for offline plans, triggered by online plan changes. | Dev Team |
| R2-7.1-3 | OPS/TECH | Failed/Partial Sync of Offline Logs | 2 | 2 | 4 | Implement retry mechanisms with exponential backoff for sync failures. Ensure robust logging and alerting for partial syncs. | Dev Team |
| R2-8.1-2 | BUS | Confusing/Inadequate User Notification for Fallback | 2 | 2 | 4 | Implement clear and concise UX for fallback notifications and options, following UX spec, with user testing. | UX/Dev Team |
| R2-8.1-3 | BUS | Music Fallback Leads to Broken Experience | 2 | 2 | 4 | Implement robust error handling for music generation failures, graceful fallback to "no music" option, and clear UX. | Dev Team |

### Low-Priority Risks (Score 1-2)

| Risk ID | Category | Description | Probability | Impact | Score | Action |
| ------- | -------- | ----------- | ----------- | ------ | ----- | ------ |
| R2-1.1.1-3 | OPS | OpenAI API Downtime/Unavailability | 1 | 3 | 3 | DOCUMENT |
| R2-1.4.1-2 | TECH | Cache Key Collision | 1 | 3 | 3 | DOCUMENT |
| R2-1.4.1-3 | OPS/PERF | Redis Failure Leading to Increased OpenAI Costs/Latency | 1 | 2 | 2 | DOCUMENT |
| R2-2.2.1-3 | BUS/PERF | Non-responsive Controls During Workout | 1 | 2 | 2 | DOCUMENT |

### Risk Category Legend

- **TECH**: Technical/Architecture (flaws, integration, scalability)
- **SEC**: Security (access controls, auth, data exposure)
- **PERF**: Performance (SLA violations, degradation, resource limits)
- **DATA**: Data Integrity (loss, corruption, inconsistency)
- **BUS**: Business Impact (UX harm, logic errors, revenue)
- **OPS**: Operations (deployment, config, monitoring)

---

## Test Coverage Plan

### P0 (Critical) - Run on every commit

**Criteria**: Blocks core journey + High risk (≥6) + No workaround

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
|---|---|---|---|---|---|
| Verify service loads API key from environment variable | Unit | R2-1.1.1-1 | 1 | Dev Team | Directly mitigates API Key Exposure |
| Validate AI JSON response against schema | Integration/API | R2-1.2.1-1 | 1 | Dev Team | Directly mitigates AI Schema Validation Failure |
| Verify `POST /plans` rejects unauthenticated requests | Integration/API | R2-1.3.1-1 | 1 | Dev Team | Directly mitigates Unauthorized Access |
| Verify `POST /plans` allows authenticated requests | Integration/API | R2-1.3.1-1 | 1 | Dev Team | Essential security for core endpoint |
| Authenticated user calls `POST /plans`, receives valid JSON plan | Integration/API | | 1 | Dev Team | Core functionality for plan generation |
| Measure `POST /plans` response time (`AI p95 <= 10s`) | Performance | R2-1.3.1-3 | 1 | QA/Dev | Directly validates Performance NFR |
| Verify plan is persisted in `workout_plans` table | Integration/API | R2-1.3.1-2 | 1 | Dev Team | Ensures data persistence |
| Verify cached plan served for identical request | Integration/API | R2-1.3.1-3 | 1 | Dev Team | Directly mitigates Slow API Response Time |
| Verify cached plan invalidated on user profile changes | Integration/API | R2-1.4.1-1 | 1 | Dev Team | Directly mitigates Stale Cache Data risk |
| Verify offline plan is accessible | E2E | R2-6.1-1 | 1 | QA | Core offline feature |
| Verify offline plan displayed correctly | E2E | R2-6.1-1 | 1 | QA | Core offline user experience |
| Verify offline logs are stored locally | E2E | R2-7.1-1 | 1 | QA | Ensures local data persistence for offline logs |
| Verify offline logs sync to backend on reconnection | E2E/Integration | R2-7.1-1 | 1 | QA | Core data synchronization |
| Verify conflict resolution for offline/online data | Integration/API | R2-7.1-2 | 1 | Dev Team | Critical for data integrity |
| Verify AI plan generation failure displays fallback plan | E2E | R2-8.1-1 | 1 | QA | Core fallback mechanism validation |
| Verify dashboard correctly displays total volume, intensity, streak count | E2E/Integration | R2-4.1-1 | 1 | QA | Core dashboard data accuracy |
| Backend test: calculate dashboard metrics and compare to API output for accuracy | Integration/Unit | R2-4.1-1 | 1 | Dev Team | Direct validation of data accuracy NFR |

**Total P0**: {p0_count} tests, {p0_hours} hours

### P1 (High) - Run on PR to main

**Criteria**: Important features + Medium risk (3-4) + Common workflows

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
|---|---|---|---|---|---|
| Verify service establishes connection to OpenAI API | Integration/API | | 1 | Dev Team | Essential functionality |
| Verify basic function sends prompt and receives response | Integration/API | | 1 | Dev Team | Core functionality |
| Verify prompt construction logic correctly embeds dynamic user data | Unit | | 1 | Dev Team | Essential for personalization |
| Send sample prompt to OpenAI and validate raw JSON response against schema | Integration/API | R2-1.2.1-1 | 1 | Dev Team | Directly validates JSON schema output |
| Authenticated user calls `POST /plans`, receives a valid JSON plan | Integration/API | | 1 | Dev Team | Core functionality |
| Request plan, then request with *different* context; verify OpenAI API called | Integration/API | | 1 | Dev Team | Cache hit/miss logic |
| Request plan, verify new plan stored in Redis with correct TTL | Integration/API | | 1 | Dev Team | Cache population |
| Verify workout plan elements displayed correctly in UI | E2E/Component | R2-2.1.1-1 | 1 | QA | Core UI elements |
| Interact with navigation controls; verify smooth transitions | E2E | | 1 | QA | User experience |
| Resize viewport/test on different device sizes; verify UI adapts correctly | E2E | R2-2.1.1-2 | 1 | QA | Cross-device usability |
| Verify rest and exercise duration timers function accurately | E2E | R2-2.2.1-1 | 1 | QA | Core functionality, accuracy |
| Click 'Complete' and 'Skip' buttons; verify workout state changes | E2E | | 1 | QA | Core interaction |
| With Spotify connected, verify play, pause, skip controls work | E2E | R2-2.2.1-2 | 1 | QA | External integration |
| Interact with input fields for reps, weight, RPE; verify data entry works | E2E | | 1 | QA | Core logging input |
| Input invalid data; verify input validation and error messages | E2E | R2-3.1-2 | 1 | QA | Input validation |
| Click 'Complete' without inputs; verify set marked complete | E2E | | 1 | QA | Alternative logging path |
| Verify charts load and accurately represent data trends | E2E/Integration | R2-4.1-3 | 1 | QA | Data visualization accuracy |
| Resize viewport/test on different device sizes; verify dashboard adapts | E2E | | 1 | QA | Responsive design |
| User sets reminder; verify reminder received in-app at scheduled time | E2E/Integration | R2-5.1-1 | 1 | QA | Core reminder functionality |
| User has specific context; verify nudge message adapts accordingly | E2E/Integration | R2-5.1-2 | 1 | QA | Context-awareness |
| Online, plan changes, then go offline; verify *updated* plan cached | E2E | R2-6.1-2 | 1 | QA | Cache freshness |
| Simulate network interruption during sync; verify retry mechanism | E2E/Integration | R2-7.1-3 | 1 | QA | Robust sync |
| Simulate AI music generation failure; verify warning and options | E2E | R2-8.1-3 | 1 | QA | Music fallback UX |
| Simulate offline/no network during plan generation; verify template shown | E2E | | 1 | QA | Network failure UX |


### P2 (Medium) - Run nightly/weekly

**Criteria**: Secondary features + Low risk (1-2) + Edge cases

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
|---|---|---|---|---|---|
| Verify prompt string contains role-playing instructions | Unit | | 1 | Dev Team | UX refinement |
| Test all UI component states (e.g., active exercise, completed set) | Component/E2E | | 1 | QA | Comprehensive UI testing |
| Verify all main controls are visible and clickable | Component/E2E | | 1 | QA | UI element presence |
| Test all control states (e.g., playing music, paused music) | Component/E2E | | 1 | QA | Comprehensive UI testing |
| Visually inspect dashboard for adherence to UX styling | Visual Regression/E2E | R2-4.1.3 | 1 | UX/QA | Visual quality |

### P3 (Low) - Run on-demand

**Criteria**: Rarely used features + Non-critical optimizations

| Requirement | Test Level | Test Count | Owner | Notes |
|---|---|---|---|---|
| Verify `services/plan_service.py` exists and is importable | Unit | 1 | Dev Team | Basic file existence |
| Verify `POST /plans` endpoint exists and accepts requests | Unit/API | 1 | Dev Team | Basic endpoint existence |
| Verify Redis connection can be established from backend | Unit/Integration | 1 | Dev Team | Infrastructure check |


---

## Execution Order

### Smoke Tests (<5 min)

**Purpose**: Fast feedback, catch build-breaking issues

- [x] Verify `POST /plans` allows authenticated requests (E2E)
- [x] Authenticated user calls `POST /plans`, receives valid JSON plan (E2E)
- [x] Verify offline plan is accessible (E2E)
- [x] Verify offline plan displayed correctly (E2E)
- [x] Verify offline logs are stored locally (E2E)

**Total**: 5 scenarios

### P0 Tests (<10 min)

**Purpose**: Critical path validation

- [x] Verify service loads API key from environment variable (Unit)
- [x] Validate AI JSON response against schema (Integration/API)
- [x] Verify `POST /plans` rejects unauthenticated requests (Integration/API)
- [x] Measure `POST /plans` response time (`AI p95 <= 10s`) (Performance)
- [x] Verify plan is persisted in `workout_plans` table (Integration/API)
- [x] Verify cached plan served for identical request (Integration/API)
- [x] Verify cached plan invalidated on user profile changes (Integration/API)
- [x] Verify conflict resolution for offline/online data (Integration/API)
- [x] Verify AI plan generation failure displays fallback plan (E2E)
- [x] Verify dashboard correctly displays total volume, intensity, streak count (E2E/Integration)
- [x] Backend test: calculate dashboard metrics and compare to API output for accuracy (Integration/Unit)

**Total**: 11 scenarios

### P1 Tests (<30 min)

**Purpose**: Important feature coverage

- [x] Verify service establishes connection to OpenAI API (Integration/API)
- [x] Verify basic function sends prompt and receives response (Integration/API)
- [x] Verify prompt construction logic correctly embeds dynamic user data (Unit)
- [x] Send sample prompt to OpenAI and validate raw JSON response against schema (Integration/API)
- [x] Authenticated user calls `POST /plans`, receives a valid JSON plan (Integration/API)
- [x] Request plan, then request with *different* context; verify OpenAI API called (Integration/API)
- [x] Request plan, verify new plan stored in Redis with correct TTL (Integration/API)
- [x] Verify workout plan elements displayed correctly in UI (E2E/Component)
- [x] Interact with navigation controls; verify smooth transitions (E2E)
- [x] Resize viewport/test on different device sizes; verify UI adapts correctly (E2E)
- [x] Verify rest and exercise duration timers function accurately (E2E)
- [x] Click 'Complete' and 'Skip' buttons; verify workout state changes (E2E)
- [x] With Spotify connected, verify play, pause, skip controls work (E2E)
- [x] Interact with input fields for reps, weight, RPE; verify data entry works (E2E)
- [x] Input invalid data; verify input validation and error messages (E2E)
- [x] Click 'Complete' without inputs; verify set marked complete (E2E)
- [x] Verify charts load and accurately represent data trends (E2E/Integration)
- [x] Resize viewport/test on different device sizes; verify dashboard adapts (E2E)
- [x] User sets reminder; verify reminder received in-app at scheduled time (E2E/Integration)
- [x] User has specific context; verify nudge message adapts accordingly (E2E/Integration)
- [x] Online, plan changes, then go offline; verify *updated* plan cached (E2E)
- [x] Simulate network interruption during sync; verify retry mechanism (E2E/Integration)
- [x] Simulate AI music generation failure; verify warning and options (E2E)
- [x] Simulate offline/no network during plan generation; verify template shown (E2E)

**Total**: 24 scenarios

### P2/P3 Tests (<60 min)

**Purpose**: Full regression coverage

- [x] Verify prompt string contains role-playing instructions (Unit)
- [x] Test all UI component states (e.g., active exercise, completed set) (Component/E2E)
- [x] Verify all main controls are visible and clickable (Component/E2E)
- [x] Test all control states (e.g., playing music, paused music) (Component/E2E)
- [x] Visually inspect dashboard for adherence to UX styling (Visual Regression/E2E)
- [x] Verify `services/plan_service.py` exists and is importable (Unit)
- [x] Verify `POST /plans` endpoint exists and accepts requests (Unit/API)
- [x] Verify Redis connection can be established from backend (Unit/Integration)

**Total**: 8 scenarios

---

## Resource Estimates

### Test Development Effort

| Priority | Count | Hours/Test | Total Hours | Notes |
| -------- | ----- | ---------- | ----------- | ----- |
| P0 | 17 | 2.0 | 34.0 | Complex setup, security |
| P1 | 23 | 1.0 | 23.0 | Standard coverage |
| P2 | 5 | 0.5 | 2.5 | Simple scenarios |
| P3 | 3 | 0.25 | 0.75 | Exploratory |
| **Total** | **48** | **-** | **60.25** | **~8 days** |

### Prerequisites

**Test Data:**

- User profiles (with varying goals, equipment, preferences)
- Valid and invalid AI-generated workout plans (to test schema validation)
- Extensive workout logs (for progress dashboard accuracy)
- Mocked Spotify connection data (for music integration)
- Redis cached data (for cache hit/miss scenarios)

**Tooling:**

- Playwright for E2E and Component tests (frontend UI, interactions, responsiveness)
- Pytest with `httpx` for Unit and Integration tests (FastAPI backend API endpoints, services, data validation)
- Mocking libraries (e.g., `unittest.mock` for Python, `jest-mock` or `vitest.mock` for TS)
- Load testing tool (e.g., K6 or Locust) for Performance tests on API endpoints
- Visual regression testing tool (e.g., Playwright's built-in visual comparisons) for UI adherence to UX spec
- Accessibility testing tool (e.g., Axe-core) for WCAG compliance

**Environment:**

- Local development environment with Docker (for isolated Supabase and Redis instances)
- Dedicated Test/Staging environment mirroring production setup (for E2E and Performance testing)

---

## Quality Gate Criteria

### Pass/Fail Thresholds

- **P0 pass rate**: 100% (no exceptions)
- **P1 pass rate**: ≥95% (waivers required for failures)
- **P2/P3 pass rate**: ≥90% (informational)
- **High-risk mitigations**: 100% complete or approved waivers

### Coverage Targets

- **Critical paths**: ≥80%
- **Security scenarios**: 100%
- **Business logic**: ≥70%
- **Edge cases**: ≥50%

### Non-Negotiable Requirements

- [ ] All P0 tests pass
- [ ] No high-risk (≥6) items unmitigated
- [ ] Security tests (SEC category) pass 100%
- [ ] Performance targets met (PERF category)

---

## Mitigation Plans

### R-001: {Risk Description} (Score: 6)

**Mitigation Strategy:** {detailed_mitigation}
**Owner:** {owner}
**Timeline:** {date}
**Status:** Planned / In Progress / Complete
**Verification:** {how_to_verify}

### R-002: {Risk Description} (Score: 6)

**Mitigation Strategy:** {detailed_mitigation}
**Owner:** {owner}
**Timeline:** {date}
**Status:** Planned / In Progress / Complete
**Verification:** {how_to_verify}

---

## Assumptions and Dependencies

### Assumptions

1. {assumption}
2. {assumption}
3. {assumption}

### Dependencies

1. {dependency} - Required by {date}
2. {dependency} - Required by {date}

### Risks to Plan

- **Risk**: {risk_to_plan}
  - **Impact**: {impact}
  - **Contingency**: {contingency}

---

## Approval

**Test Design Approved By:**

- [ ] Product Manager: **\*\***\_\_\_**\*\*** Date: **\*\***\_\_\_**\*\***
- [ ] Tech Lead: **\*\***\_\_\_**\*\*** Date: **\*\***\_\_\_**\*\***
- [ ] QA Lead: **\*\***\_\_\_**\*\*** Date: **\*\***\_\_\_**\*\***

**Comments:**

---

---

---

## Appendix

### Knowledge Base References

- `risk-governance.md` - Risk classification framework
- `probability-impact.md` - Risk scoring methodology
- `test-levels-framework.md` - Test level selection
- `test-priorities-matrix.md` - P0-P3 prioritization

### Related Documents

- PRD: C:\Users\Robert\Documents\AI-Powered Personal Training Advisor\SG-Gruppe-KI\docs\bmm-PRD.md
- Epic: C:\Users\Robert\Documents\AI-Powered Personal Training Advisor\SG-Gruppe-KI\docs\epics.md
- Architecture: C:\Users\Robert\Documents\AI-Powered Personal Training Advisor\SG-Gruppe-KI\docs\architecture.md
- Tech Spec: {tech_spec_link}

---

**Generated by**: BMad TEA Agent - Test Architect Module
**Workflow**: .bmad/bmm/workflows/testarch/test-design
**Version**: 4.0 (BMad v6)
