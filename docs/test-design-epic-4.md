# Test Design: Epic 4 - User Control & Settings

**Date:** onsdag 19. november 2025
**Author:** BIP
**Status:** Draft / Approved

---

## Executive Summary

**Scope:** full test design for Epic 4

**Risk Summary:**

- Total risks identified: 30
- High-priority risks (≥6): 6
- Critical categories: DATA, BUS, SEC, TECH

**Coverage Summary:**

- P0 scenarios: 7 (14.0 hours)
- P1 scenarios: 22 (22.0 hours)
- P2/P3 scenarios: 2 (1.0 hours)
- **Total effort**: 37.0 hours (~5 days)

---

## Risk Assessment

### High-Priority Risks (Score ≥6)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner | Timeline |
| ------- | -------- | ----------- | ----------- | ------ | ----- | ---------- | ------- | -------- |
| R4-5.1-2 | DATA/TECH | Failure to Properly Clear AI Memory | 2 | 3 | 6 | Implement robust data deletion/invalidation logic across all relevant systems (database, cache) for AI memory. Thoroughly test reset functionality. | Dev Team | TBD |
| R4-6.1-1 | BUS/SEC | GDPR Non-Compliance | 2 | 3 | 6 | Implement and rigorously test all GDPR-related features (consent, export, deletion) against legal requirements. Ensure audit trails. | Legal/Dev Team | TBD |
| R4-6.1-2 | SEC | Data Leakage during Export | 2 | 3 | 6 | Implement secure data export pipelines with strong access controls and data sanitization/masking for sensitive fields. | Dev Team | TBD |
| R4-6.1-3 | DATA/SEC | Incomplete Account Deletion | 2 | 3 | 6 | Develop a comprehensive account deletion process that removes all user data from primary, secondary, and backup storage, and revokes third-party access. | Dev Team | TBD |
| R4-7.1-1 | SEC | Unauthorized Profile Modification | 2 | 3 | 6 | Implement strict authorization checks (e.g., using RLS and API-level checks) to ensure users can only modify their own profiles. | Dev Team | TBD |
| R4-7.1-3 | SEC | Password Management Vulnerabilities | 2 | 3 | 6 | Enforce strong password policies. Implement secure password hashing. Require re-authentication for password changes. Implement rate limiting for login attempts. | Dev Team | TBD |

### Medium-Priority Risks (Score 3-4)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner |
| ------- | -------- | ----------- | ----------- | ------ | ----- | ---------- | ------- |
| R4-1.1-1 | BUS/TECH | Dashboard UI Discrepancy from UX Spec | 2 | 2 | 4 | Conduct thorough UX reviews and visual regression tests. | UX/Dev Team |
| R4-1.1-2 | BUS | Poor Dashboard Responsiveness | 2 | 2 | 4 | Implement responsive design principles (Tailwind CSS breakpoints). Conduct cross-device testing. | Dev Team |
| R4-2.1-1 | BUS/TECH | Settings UI Discrepancy from UX Spec | 2 | 2 | 4 | Conduct thorough UX reviews and visual regression tests for the settings pages. | UX/Dev Team |
| R4-2.1-3 | BUS | Poor Settings Page Responsiveness | 2 | 2 | 4 | Implement responsive design principles for settings pages. Conduct cross-device testing. | Dev Team |
| R4-3.1-1 | DATA/BUS | Incorrect Persistence/Application of Settings | 2 | 2 | 4 | Implement robust state management and persistence logic for settings. Thoroughly test saving and loading of all settings. | Dev Team |
| R4-4.1-1 | DATA/BUS | Inconsistent Spotify Connection State | 2 | 2 | 4 | Implement mechanisms to regularly synchronize Spotify connection status with the application's internal state. | Dev Team |
| R4-4.1-2 | BUS/TECH | Incorrect Application of Session Mix/BPM Matching Settings | 2 | 2 | 4 | Rigorously test the logic that applies music settings to AI generation and playback. | Dev Team |
| R4-4.1-3 | OPS/TECH | Spotify Device Selection Errors | 2 | 2 | 4 | Implement robust error handling and user feedback for device selection failures. Provide clear status of selected device. | Dev Team |
| R4-5.1-1 | DATA/BUS | Inaccurate Display of AI Preferences/Constraints | 2 | 2 | 4 | Ensure the data displayed accurately reflects the AI's internal state. Implement tests for data fetching and display. | Dev Team |
| R4-6.1-5 | TECH/SEC | Failure to Revoke Third-Party Integrations | 2 | 2 | 4 | Implement and test a complete token invalidation process with third-party APIs upon revocation. | Dev Team |
| R4-7.1-2 | TECH/DATA | Data Validation Failure for Profile Inputs | 2 | 2 | 4 | Implement strict server-side validation for all profile editing inputs (name, email, goals, equipment). | Dev Team |
| R4-7.1-4 | BUS | Inaccurate AI Adaptation After Goal/Equipment Update | 2 | 2 | 4 | Ensure AI re-adaptation logic is triggered and functions correctly when goals/equipment are updated. Test with various change scenarios. | Dev Team |

### Low-Priority Risks (Score 1-2)

| Risk ID | Category | Description | Probability | Impact | Score | Action |
| ------- | -------- | ----------- | ----------- | ------ | ----- | ------ |
| R4-1.1-3 | BUS/TECH | Broken Navigation Paths | 1 | 2 | 2 | DOCUMENT |
| R4-2.1-2 | BUS | Lack of Instant Feedback for Settings Changes | 2 | 1 | 2 | DOCUMENT |
| R4-3.1-2 | BUS | Inconsistent UI Display After Language/Units Change | 2 | 1 | 2 | DOCUMENT |
| R4-3.1-3 | TECH | Data Transformation Errors with Unit Conversion | 1 | 2 | 2 | DOCUMENT |
| R4-5.1-3 | BUS | Accidental Clearing of AI Memory | 1 | 2 | 2 | DOCUMENT |
| R4-6.1-4 | BUS/SEC | Bypass of Account Deletion Confirmation | 1 | 2 | 2 | DOCUMENT |

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
| Clear AI memory; verify subsequent AI plan generation shows no influence from previous preferences | E2E/Integration | R4-5.1-2 | 1 | Dev Team | Core functionality for user control over AI personalization |
| Change consent settings; verify changes are persisted and reflect in data collection | E2E/Integration | R4-6.1-1 | 1 | Legal/Dev Team | GDPR compliance, privacy |
| Request data export; verify a complete and correct JSON/CSV file is provided | E2E | R4-6.1-2 | 1 | QA/Dev | GDPR compliance, data security |
| Initiate account deletion; verify all user data is removed from database and associated systems | E2E/Integration | R4-6.1-3 | 1 | Dev Team | GDPR compliance, data integrity |
| Edit name/email; verify changes are saved and reflected | E2E | R4-7.1-1 | 1 | QA | User data integrity |
| Change password; verify successful password change and new password works | E2E | R4-7.1-3 | 1 | QA | Account security |
| Attempt to modify another user's profile (negative test) | E2E/Security | R4-7.1-1 | 1 | Security/QA | Authorization enforcement |

### P1 (High) - Run on PR to main

**Criteria**: Important features + Medium risk (3-4) + Common workflows

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
|---|---|---|---|---|---|
| Login as user, verify dashboard is displayed as primary screen | E2E | | 1 | QA | Core functionality |
| Verify presence of daily workout summary, progress highlights, and navigation elements | E2E/Component | R4-1.1-1 | 1 | QA | UI layout accuracy |
| Click on navigation links for Workout Player, Progress Dashboard, Settings; verify correct screen is displayed | E2E | R4-1.1-3 | 1 | QA | Navigation functionality |
| Resize viewport/test on different device sizes; verify dashboard adapts correctly and remains usable | E2E | R4-1.1-2 | 1 | QA | Responsiveness |
| Navigate to settings, verify category list is displayed as per UX spec | E2E/Component | R4-2.1-1 | 1 | QA | UI structure accuracy |
| Click on each category, verify correct sub-page is displayed with relevant options | E2E | | 1 | QA | Navigation functionality |
| Resize viewport/test on different device sizes; verify settings page adapts correctly and remains usable | E2E | R4-2.1-3 | 1 | QA | Responsiveness |
| Change language, verify UI updates and is consistent | E2E | R4-3.1-2 | 1 | QA | Language change |
| Change units (kg/lbs), verify displayed values update correctly | E2E | R4-3.1-3 | 1 | QA | Unit conversion |
| Change time format, verify all time displays update correctly | E2E | | 1 | QA | Time format |
| Change a setting, log out, log in; verify setting is still applied | E2E | R4-3.1-1 | 1 | QA | Persistence |
| Connect Spotify from settings; verify successful connection | E2E | | 1 | QA | Connection |
| Disconnect Spotify from settings; verify successful disconnection | E2E | R4-4.1-1 | 1 | QA | Disconnection |
| Enable/disable Session Mix; verify AI-generated playlists reflect this setting | E2E/Integration | R4-4.1-2 | 1 | QA/Dev | Session Mix setting |
| Enable/disable BPM matching; verify AI-generated playlists reflect this setting | E2E/Integration | R4-4.1-2 | 1 | QA/Dev | BPM matching setting |
| Select a preferred playback device; verify music plays on the selected device | E2E | R4-4.1-3 | 1 | QA | Device selection |
| Navigate to AI settings; verify accurate list of preferences/constraints is displayed | E2E/Integration | R4-5.1-1 | 1 | QA/Dev | Display accuracy |
| Revoke Spotify integration; verify connection is severed and tokens are invalidated | E2E/Integration | R4-6.1-5 | 1 | QA/Dev | Revocation functionality |
| Initiate account deletion; verify confirmation modal with explicit "DELETE" input is required | E2E | R4-6.1-4 | 1 | QA | UX confirmation |
| Navigate to profile management; verify section is accessible and displays current profile info | E2E | | 1 | QA | Access |
| Update fitness goals/equipment; verify changes are saved and reflected | E2E | R4-7.1-4 | 1 | QA | Goals/equipment update |
| Input invalid data for profile fields; verify validation errors are displayed and data is not persisted | E2E | R4-7.1-2 | 1 | QA | Input validation |

### P2 (Medium) - Run nightly/weekly

**Criteria**: Secondary features + Low risk (1-2) + Edge cases

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
|---|---|---|---|---|---|
| Make a change in a sub-page; verify instant application and visual feedback | E2E | R4-2.1-2 | 1 | QA | UX feedback |
| Attempt to clear AI memory without confirmation; verify confirmation modal is required | E2E | R4-5.1-3 | 1 | QA | Confirmation UX |

### P3 (Low) - Run on-demand

**Criteria**: Nice-to-have + Exploratory + Performance benchmarks

No P3 scenarios identified for Epic 4.

---

## Execution Order

### Smoke Tests (<5 min)

**Purpose**: Fast feedback, catch build-breaking issues

- [x] Clear AI memory; verify subsequent AI plan generation shows no influence from previous preferences (E2E/Integration)
- [x] Change consent settings; verify changes are persisted and reflect in data collection (E2E/Integration)
- [x] Request data export; verify a complete and correct JSON/CSV file is provided (E2E)
- [x] Initiate account deletion; verify all user data is removed from database and associated systems (E2E/Integration)
- [x] Edit name/email; verify changes are saved and reflected (E2E)
- [x] Change password; verify successful password change and new password works (E2E)
- [x] Attempt to modify another user's profile (negative test) (E2E/Security)

**Total**: 7 scenarios

### P0 Tests (<10 min)

**Purpose**: Critical path validation

All P0 scenarios are covered in the Smoke Tests.

**Total**: 0 scenarios

### P1 Tests (<30 min)

**Purpose**: Important feature coverage

- [x] Login as user, verify dashboard is displayed as primary screen (E2E)
- [x] Verify presence of daily workout summary, progress highlights, and navigation elements (E2E/Component)
- [x] Click on navigation links for Workout Player, Progress Dashboard, Settings; verify correct screen is displayed (E2E)
- [x] Resize viewport/test on different device sizes; verify dashboard adapts correctly and remains usable (E2E)
- [x] Navigate to settings, verify category list is displayed as per UX spec (E2E/Component)
- [x] Click on each category, verify correct sub-page is displayed with relevant options (E2E)
- [x] Resize viewport/test on different device sizes; verify settings page adapts correctly and remains usable (E2E)
- [x] Change language, verify UI updates and is consistent (E2E)
- [x] Change units (kg/lbs), verify displayed values update correctly (E2E)
- [x] Change time format, verify all time displays update correctly (E2E)
- [x] Change a setting, log out, log in; verify setting is still applied (E2E)
- [x] Connect Spotify from settings; verify successful connection (E2E)
- [x] Disconnect Spotify from settings; verify successful disconnection (E2E)
- [x] Enable/disable Session Mix; verify AI-generated playlists reflect this setting (E2E/Integration)
- [x] Enable/disable BPM matching; verify AI-generated playlists reflect this setting (E2E/Integration)
- [x] Select a preferred playback device; verify music plays on the selected device (E2E)
- [x] Navigate to AI settings; verify accurate list of preferences/constraints is displayed (E2E/Integration)
- [x] Revoke Spotify integration; verify connection is severed and tokens are invalidated (E2E/Integration)
- [x] Initiate account deletion; verify confirmation modal with explicit "DELETE" input is required (E2E)
- [x] Navigate to profile management; verify section is accessible and displays current profile info (E2E)
- [x] Update fitness goals/equipment; verify changes are saved and reflected (E2E)
- [x] Input invalid data for profile fields; verify validation errors are displayed and data is not persisted (E2E)

**Total**: 22 scenarios

### P2/P3 Tests (<60 min)

**Purpose**: Full regression coverage

- [x] Make a change in a sub-page; verify instant application and visual feedback (E2E)
- [x] Attempt to clear AI memory without confirmation; verify confirmation modal is required (E2E)

**Total**: 2 scenarios

---

## Resource Estimates

### Test Development Effort

| Priority | Count | Hours/Test | Total Hours | Notes |
| -------- | ----- | ---------- | ----------- | ----- |
| P0 | 7 | 2.0 | 14.0 | Complex setup, security |
| P1 | 22 | 1.0 | 22.0 | Standard coverage |
| P2 | 2 | 0.5 | 1.0 | Simple scenarios |
| P3 | 0 | 0.25 | 0.0 | Exploratory |
| **Total** | **31** | **-** | **37.0** | **~5 days** |

### Prerequisites

**Test Data:**

- {factory_name} factory (faker-based, auto-cleanup)
- {fixture_name} fixture (setup/teardown)

**Tooling:**

- {tool} for {purpose}
- {tool} for {purpose}

**Environment:**

- {env_requirement}
- {env_requirement}

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
