# Test Design: Epic 1 - Core Platform & User Foundation

**Date:** 2025-11-19
**Author:** BIP
**Status:** Draft / Approved

---

## Executive Summary

**Scope:** full test design for Epic 1

**Risk Summary:**

- Total risks identified: 20
- High-priority risks (≥6): 7
- Critical categories: SEC, BUS, UX

**Coverage Summary:**

- P0 scenarios: 17 (34.0 hours)
- P1 scenarios: 12 (12.0 hours)
- P2/P3 scenarios: 3 (1.5 hours)
- **Total effort**: 47.5 hours (~5.9 days)

---

## Risk Assessment

### High-Priority Risks (Score ≥6)

| Risk ID | Category | Description                                          | Probability | Impact | Score | Mitigation      | Owner       | Timeline |
| ------- | -------- | ---------------------------------------------------- | ----------- | ------ | ----- | --------------- | ----------- | -------- |
| R-003   | SEC      | Improperly configured Row-Level Security (RLS) leading to unauthorized data access. | 2           | 3      | 6     | Implement and rigorously test RLS policies ensuring user data isolation. | Dev/QA Lead | TBD      |
| R-008   | SEC      | Weak password hashing or insecure token management.  | 2           | 3      | 6     | Leverage Supabase Auth's built-in secure hashing and token management. | Dev Lead    | TBD      |
| R-009   | BUS      | Authentication flow failure blocking user access.    | 2           | 3      | 6     | Robust E2E tests for all auth flows; fallback to error pages. | QA Lead     | TBD      |
| R-011   | SEC      | Improper configuration of Google OAuth leading to security vulnerabilities. | 2           | 3      | 6     | Strict adherence to Google OAuth best practices, regular security audits. | Dev Lead    | TBD      |
| R-013   | SEC      | Improper configuration of Apple OAuth leading to security vulnerabilities. | 2           | 3      | 6     | Strict adherence to Apple OAuth best practices, regular security audits. | Dev Lead    | TBD      |
| R-015   | BUS      | Onboarding UI/logic errors preventing new users from completing setup. | 3           | 3      | 9     | Comprehensive E2E testing of all onboarding paths, including edge cases. | QA Lead     | TBD      |
| R-019   | BUS      | Failure to meet WCAG 2.1 AA compliance, leading to legal/reputational issues. | 2           | 3      | 6     | Automated accessibility checks in CI, manual screen reader testing. | UX/QA Lead  | TBD      |

### Medium-Priority Risks (Score 3-4)

| Risk ID | Category | Description                                          | Probability | Impact | Score | Mitigation   | Owner   |
| ------- | -------- | ---------------------------------------------------- | ----------- | ------ | ----- | ------------ | ------- |
| R-001   | TECH     | Misconfiguration of initial project setup (Next.js, FastAPI, virtual env). | 2           | 2      | 4     | Clear setup scripts and documentation. | Dev Lead |
| R-004   | DATA     | Schema definition errors (e.g., incorrect data types, missing constraints) leading to data corruption or loss. | 2           | 2      | 4     | Database migrations and schema validation checks. | Dev Lead |
| R-006   | OPS      | Flaky CI pipeline leading to false positives/negatives, wasting developer time. | 2           | 2      | 4     | Implement burn-in tests and retry mechanisms in CI. | QA Lead |
| R-012   | BUS      | User data mapping errors between Google profile and app profile. | 2           | 2      | 4     | Thorough integration tests for data mapping. | Dev/QA  |
| R-014   | BUS      | User data mapping errors between Apple profile and app profile. | 2           | 2      | 4     | Thorough integration tests for data mapping. | Dev/QA  |
| R-016   | UX       | Inconsistent real-time feedback or UI behavior during onboarding, leading to user confusion/abandonment. | 2           | 2      | 4     | Follow UX specifications rigorously; comprehensive UI tests. | UX/QA   |
| R-017   | BUS      | Plan reveal UI errors or incorrect plan summary display, leading to user distrust. | 2           | 2      | 4     | Visual regression testing and data validation. | QA Lead |
| R-018   | PERF     | Slow loading of "First Plan Reveal" due to AI processing latency. | 2           | 2      | 4     | Implement AI response caching; monitor NFR. | Dev Lead |
| R-020   | UX       | Poor keyboard navigation or screen reader experience, hindering usability for disabled users. | 2           | 2      | 4     | Automated and manual accessibility testing. | UX/QA   |

### Low-Priority Risks (Score 1-2)

| Risk ID | Category | Description                                          | Probability | Impact | Score | Action  |
| ------- | -------- | ---------------------------------------------------- | ----------- | ------ | ----- | ------- |
| R-002   | OPS      | Incompatibility between chosen versions of Node.js, Python, or framework dependencies. | 1           | 3      | 3     | Document |
| R-005   | TECH     | Environment variable mismanagement (e.g., hardcoding Supabase keys). | 1           | 3      | 3     | Document |
| R-010   | TECH     | Incompatibility between frontend auth library and Supabase Auth. | 1           | 2      | 2     | Monitor |

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

| Requirement                                          | Test Level        | Risk Link | Test ID      | Owner   | Notes                                    |
| ---------------------------------------------------- | ----------------- | --------- | ------------ | ------- | ---------------------------------------- |
| Verify Supabase connection with correct environment variables. | Integration (Backend) | R-005     | DB-INT-001   | Dev Lead | Secure handling of env vars.             |
| Verify Supabase tables (`users`, `workout_plans`, etc.) exist and correct schema. | Integration (Backend) | R-004     | DB-INT-002   | Dev Lead | Critical for data integrity.             |
| Verify RLS policies prevent unauthorized user data access. | Integration (Backend) | R-003     | DB-SEC-001   | QA Lead | Essential for data privacy/security.     |
| Verify CI logs do not expose sensitive environment variables/secrets. | Manual/Audit (CI) | R-007     | CI-SEC-001   | QA Lead | Critical for CI/CD security.             |
| New user can successfully register with valid email/password. | E2E               | R-009     | AUTH-E2E-001 | QA Lead | Core user onboarding.                    |
| Existing user can successfully log in with valid email/password. | E2E               | R-009     | AUTH-E2E-002 | QA Lead | Core user journey.                       |
| Verify password hashing algorithm and token generation logic. | Unit (Backend)    | R-008     | AUTH-UNIT-001| Dev Lead | Critical security.                       |
| User can successfully register and log in using Google OAuth. | E2E               | R-011     | OAUTH-E2E-001| QA Lead | Authentication path.                     |
| User can successfully register and log in using Apple OAuth. | E2E               | R-013     | OAUTH-E2E-003| QA Lead | Authentication path.                     |
| User completes conversational onboarding with happy path. | E2E               | R-015     | ONBOARD-E2E-001| QA Lead | Blocks new user acquisition.             |
| User inputs are stored correctly in the database after onboarding. | Integration (Backend) | R-015     | ONBOARD-API-001| Dev Lead | Data integrity post-onboarding.          |
| "Plan Reveal" screen displays correctly with generated plan summary. | E2E               | R-017     | PLAN-E2E-001 | QA Lead | Core value proposition.                  |
| "View My Plan" button navigates to workout player. | E2E               | R-017     | PLAN-E2E-003 | QA Lead | Core user journey.                       |
| Handles scenario where AI plan generation fails or times out. | E2E               | R-018     | PLAN-E2E-005 | QA Lead | NFR: AI p95 <= 10s, critical fallback.   |
| Keyboard navigation functional across core interactive elements. | E2E               | R-019     | A11Y-E2E-001 | QA Lead | WCAG 2.1 AA Compliance.                  |
| Verify color contrast ratios meet WCAG 2.1 AA standards. | Manual/Automated CSS Audit | R-019     | A11Y-MANUAL-001| UX/QA   | Critical for compliance.                 |
| Conduct screen reader testing for main onboarding and dashboard flows. | Manual            | R-019     | A11Y-MANUAL-003| UX/QA   | Critical for compliance.                 |

**Total P0**: 17 tests, 34 hours

### P1 (High) - Run on PR to main

**Criteria**: Important features + Medium risk (3-4) + Common workflows

| Requirement                                          | Test Level        | Risk Link | Test ID      | Owner   | Notes                                    |
| ---------------------------------------------------- | ----------------- | --------- | ------------ | ------- | ---------------------------------------- |
| Verify CI workflow triggers on push to `main` and `develop`. | E2E (CI)          | R-006     | CI-OPS-001   | QA Lead | Flaky CI issue.                          |
| Verify CI workflow installs frontend and backend dependencies. | E2E (CI)          | R-006     | CI-OPS-002   | QA Lead | CI dependency stability.                 |
| Verify CI workflow runs linters (ESLint) and builds Next.js project successfully. | E2E (CI)          | R-006     | CI-OPS-003   | QA Lead | CI build health.                         |
| User receives appropriate error message for invalid login credentials. | E2E               | R-009     | AUTH-E2E-003 | QA Lead | User experience on auth failure.         |
| User sees error on registration with existing email. | E2E               | R-009     | AUTH-E2E-004 | QA Lead | User experience on auth failure.         |
| User data from Google is correctly mapped to app profile. | E2E               | R-012     | OAUTH-E2E-002| QA Lead | Data integrity.                          |
| User data from Apple is correctly mapped to app profile. | E2E               | R-014     | OAUTH-E2E-004| QA Lead | Data integrity.                          |
| Real-time feedback updates correctly based on user input during check-in. | Component/E2E     | R-016     | ONBOARD-E2E-003| UX/QA   | UX consistency.                          |
| User exits onboarding mid-flow and can resume from last step. | E2E (Edge Case)   | R-015     | ONBOARD-E2E-005| QA Lead | Edge case for new user journey.          |
| "Adjust Details" button returns to onboarding for modifications. | E2E               | R-017     | PLAN-E2E-004 | QA Lead | User control over plan adjustments.      |
| Visible focus indicators are present on all interactive elements. | E2E Visual        | R-019     | A11Y-E2E-002 | UX/QA   | WCAG 2.1 AA Compliance.                  |
| Verify basic ARIA attributes on key UI components. | Manual/Automated  | R-019     | A11Y-MANUAL-002| UX/QA   | WCAG 2.1 AA Compliance.                  |

**Total P1**: 12 tests, 12 hours

### P2 (Medium) - Run nightly/weekly

**Criteria**: Secondary features + Low risk (1-2) + Edge cases

| Requirement                                          | Test Level        | Risk Link | Test ID      | Owner   | Notes                                    |
| ---------------------------------------------------- | ----------------- | --------- | ------------ | ------- | ---------------------------------------- |
| Verify `npx create-next-app` flags in setup script.  | Unit (Script)     | R-001     | INFRA-UNIT-001| Dev Lead | Validate initial project config.         |
| Verify Python virtual environment creation and package installation. | Unit (Script)     | R-001     | INFRA-UNIT-002| Dev Lead | Validate initial backend config.         |
| All UI states and variants for onboarding components are rendered correctly. | Component/E2E Visual | R-016     | ONBOARD-E2E-004| UX/QA   | Visual regression on onboarding.         |

**Total P2**: 3 tests, 1.5 hours

### P3 (Low) - Run on-demand

**Criteria**: Nice-to-have + Exploratory + Performance benchmarks

| Requirement   | Test Level | Test Count | Owner | Notes   |
| ------------- | ---------- | ---------- | ----- | ------- |
| No P3 Scenarios identified for Epic 1 at this time. |||||

**Total P3**: 0 tests, 0 hours

---

## Execution Order

### Smoke Tests (<5 min)

**Purpose**: Fast feedback, catch build-breaking issues

- [ ] Existing user can successfully log in with valid email/password. (AUTH-E2E-002)
- [ ] User completes conversational onboarding with happy path. (ONBOARD-E2E-001)
- [ ] "Plan Reveal" screen displays correctly with generated plan summary. (PLAN-E2E-001)

**Total**: 3 scenarios

### P0 Tests (<10 min)

**Purpose**: Critical path validation

- [ ] Verify Supabase connection with correct environment variables. (DB-INT-001)
- [ ] Verify Supabase tables (`users`, `workout_plans`, etc.) exist and correct schema. (DB-INT-002)
- [ ] Verify RLS policies prevent unauthorized user data access. (DB-SEC-001)
- [ ] Verify CI logs do not expose sensitive environment variables/secrets. (CI-SEC-001)
- [ ] New user can successfully register with valid email/password. (AUTH-E2E-001)
- [ ] Existing user can successfully log in with valid email/password. (AUTH-E2E-002)
- [ ] Verify password hashing algorithm and token generation logic. (AUTH-UNIT-001)
- [ ] User can successfully register and log in using Google OAuth. (OAUTH-E2E-001)
- [ ] User can successfully register and log in using Apple OAuth. (OAUTH-E2E-003)
- [ ] User completes conversational onboarding with happy path. (ONBOARD-E2E-001)
- [ ] User inputs are stored correctly in the database after onboarding. (ONBOARD-API-001)
- [ ] "Plan Reveal" screen displays correctly with generated plan summary. (PLAN-E2E-001)
- [ ] "View My Plan" button navigates to workout player. (PLAN-E2E-003)
- [ ] Handles scenario where AI plan generation fails or times out. (PLAN-E2E-005)
- [ ] Keyboard navigation functional across core interactive elements. (A11Y-E2E-001)
- [ ] Verify color contrast ratios meet WCAG 2.1 AA standards. (A11Y-MANUAL-001)
- [ ] Conduct screen reader testing for main onboarding and dashboard flows. (A11Y-MANUAL-003)

**Total**: 17 scenarios

### P1 Tests (<30 min)

**Purpose**: Important feature coverage

- [ ] Verify CI workflow triggers on push to `main` and `develop`. (CI-OPS-001)
- [ ] Verify CI workflow installs frontend and backend dependencies. (CI-OPS-002)
- [ ] Verify CI workflow runs linters (ESLint) and builds Next.js project successfully. (CI-OPS-003)
- [ ] User receives appropriate error message for invalid login credentials. (AUTH-E2E-003)
- [ ] User sees error on registration with existing email. (AUTH-E2E-004)
- [ ] User data from Google is correctly mapped to app profile. (OAUTH-E2E-002)
- [ ] User data from Apple is correctly mapped to app profile. (OAUTH-E2E-004)
- [ ] Real-time feedback updates correctly based on user input during check-in. (ONBOARD-E2E-003)
- [ ] User exits onboarding mid-flow and can resume from last step. (ONBOARD-E2E-005)
- [ ] "Adjust Details" button returns to onboarding for modifications. (PLAN-E2E-004)
- [ ] Visible focus indicators are present on all interactive elements. (A11Y-E2E-002)
- [ ] Verify basic ARIA attributes on key UI components. (A11Y-MANUAL-002)

**Total**: 12 scenarios

### P2/P3 Tests (<60 min)

**Purpose**: Full regression coverage

- [ ] Verify `npx create-next-app` flags in setup script. (INFRA-UNIT-001)
- [ ] Verify Python virtual environment creation and package installation. (INFRA-UNIT-002)
- [ ] All UI states and variants for onboarding components are rendered correctly. (ONBOARD-E2E-004)

**Total**: 3 scenarios

---

## Resource Estimates

### Test Development Effort

| Priority  | Count             | Hours/Test | Total Hours       | Notes                   |
| --------- | ----------------- | ---------- | ----------------- | ----------------------- |
| P0        | 17                | 2.0        | 34.0              | Complex setup, security |
| P1        | 12                | 1.0        | 12.0              | Standard coverage       |
| P2        | 3                 | 0.5        | 1.5               | Simple scenarios        |
| P3        | 0                 | 0.25       | 0.0               | Exploratory             |
| **Total** | **32**            | **-**      | **47.5**          | **~5.9 days**           |

### Prerequisites

**Test Data:**

- User factory (faker-based, auto-cleanup)
- Supabase seeding (for initial schema and RLS testing)
- Mocked AI responses (for plan generation until Epic 2 is fully integrated)

**Tooling:**

- Playwright (for E2E and Component tests)
- Jest/Vitest (for Frontend Unit tests)
- Pytest (for Backend Unit and Integration tests)
- GitHub Actions (for CI/CD pipeline)
- Accessibility testing tools (e.g., Axe-core integration, manual screen reader testing)

**Environment:**

- Local development environment with Next.js and FastAPI running.
- Dedicated Supabase test project/instance.
- Staging environment with deployed Next.js and FastAPI (for E2E).

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

### R-003: Improperly configured Row-Level Security (RLS) (Score: 6)

**Mitigation Strategy:** Implement and rigorously test RLS policies ensuring user data isolation. Conduct regular security audits on RLS configurations.
**Owner:** Dev Lead / QA Lead
**Timeline:** TBD
**Status:** Planned
**Verification:** Integration tests for RLS policies, security review.

### R-008: Weak password hashing or insecure token management (Score: 6)

**Mitigation Strategy:** Leverage Supabase Auth's built-in secure hashing and token management features. Ensure no custom, insecure authentication logic is introduced.
**Owner:** Dev Lead
**Timeline:** TBD
**Status:** Planned
**Verification:** Security review of auth implementation, penetration testing.

### R-009: Authentication flow failure blocking user access (Score: 6)

**Mitigation Strategy:** Implement robust E2E tests covering all authentication flows (email/password, Google, Apple OAuth). Design clear fallback mechanisms or error pages for auth failures.
**Owner:** QA Lead
**Timeline:** TBD
**Status:** Planned
**Verification:** E2E test pass rate, manual testing of failure scenarios.

### R-011: Improper configuration of Google OAuth (Score: 6)

**Mitigation Strategy:** Strict adherence to Google OAuth best practices, including secure redirect URIs and state parameter validation. Regular security audits of OAuth configurations.
**Owner:** Dev Lead
**Timeline:** TBD
**Status:** Planned
**Verification:** E2E tests for Google OAuth, security review.

### R-013: Improper configuration of Apple OAuth (Score: 6)

**Mitigation Strategy:** Strict adherence to Apple OAuth best practices, including secure redirect URIs and client secret management. Regular security audits of OAuth configurations.
**Owner:** Dev Lead
**Timeline:** TBD
**Status:** Planned
**Verification:** E2E tests for Apple OAuth, security review.

### R-015: Onboarding UI/logic errors preventing new users from completing setup (Score: 9)

**Mitigation Strategy:** Implement comprehensive E2E tests for all onboarding paths, including valid, invalid, and incomplete input scenarios. Utilize visual regression testing for UI consistency.
**Owner:** QA Lead
**Timeline:** TBD
**Status:** Planned
**Verification:** E2E test pass rate for onboarding, visual regression reports.

### R-019: Failure to meet WCAG 2.1 AA compliance (Score: 6)

**Mitigation Strategy:** Integrate automated accessibility checks (e.g., Axe-core) into CI. Conduct regular manual screen reader testing and keyboard navigation audits for critical user journeys.
**Owner:** UX Lead / QA Lead
**Timeline:** TBD
**Status:** Planned
**Verification:** Accessibility audit reports, E2E test pass rate for A11y tests, manual testing.

---

## Assumptions and Dependencies

### Assumptions

1. The provided `docs/epics.md` and `docs/bmm-PRD.md` are the single source of truth for requirements for Epic 1.
2. The architectural decisions in `docs/architecture.md` are finalized for Epic 1.
3. A dedicated Supabase test instance will be available for integration testing.
4. Adequate development resources will be allocated for test automation development as per estimates.

### Dependencies

1. Stable API contracts for Supabase, OpenAI, and Spotify integrations. - Required by Epic 1 E2E/Integration Test Development
2. Completed frontend and backend setup (Story 1.1.1) for test execution. - Required by all tests
3. Implemented RLS policies for secure data access (Story 1.1.2) for secure testing. - Required by all tests, especially security tests

### Risks to Plan

- No specific risks to the plan identified at this stage.

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

- PRD: ../bmm-PRD.md
- Epic: ../epics.md
- Architecture: ../architecture.md
- Tech Spec: N/A (No separate tech spec provided)

---

**Generated by**: BMad TEA Agent - Test Architect Module
**Workflow**: `.bmad/bmm/testarch/test-design`
**Version**: 4.0 (BMad v6)
