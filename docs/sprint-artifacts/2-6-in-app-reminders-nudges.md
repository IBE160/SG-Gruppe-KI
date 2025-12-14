# Story 2.6: In-app Reminders & Nudges

## 1. Story Summary
As a user, I want to receive subtle in-app reminders and nudges about my training plan or progress, so that I stay motivated and consistent.

## 2. Acceptance Criteria
- Given I have an active training plan
- When a specific trigger condition is met (e.g., it is a scheduled training day but no plan has been generated)
- Then an in-app reminder (e.g., a banner on the dashboard, a notification dot on a button) is displayed.
- And these reminders are subtle and non-intrusive (i.e., not OS-level push notifications in this phase).

## 3. Story Context
*   **Frontend:** This is a frontend-focused story. It involves creating a system for displaying conditional UI elements based on business logic (e.g., checking dates, user status).
*   **Backend:** The backend might need to provide some data to the frontend to help it decide which nudges to show (e.g., "last login date", "is plan generated for today"), but the core logic for displaying the UI will be on the client.
*   **Data:** The feature will read user state data (e.g., `WorkoutPlans`, `WorkoutLogs`) to determine if a nudge is needed.
*   **UX:** The key is subtlety. The nudges should feel like helpful suggestions, not annoying alerts. They should be easily dismissible and not block the user from using the app.

## 4. Dependencies
*   **Story 2.3 (Display & Review Daily Plan):** A concept of an "active training plan" is needed.
*   **Story 2.5 (Progress Dashboard Display):** The dashboard is the most likely place to display these nudges.

## 5. Risks & Assumptions
*   **Risk:** The logic for triggering conditions could become complex and hard to manage. Mitigation: Start with a few simple, clear triggers and build a scalable system for adding more.
*   **Risk:** The nudges could become annoying to the user. Mitigation: Keep the design subtle and ensure the triggers are genuinely helpful.
*   **Assumption:** We can clearly define the initial set of trigger conditions (e.g., "It's a workout day", "You haven't generated a plan yet today", "You hit a new PR yesterday!").

## 6. Definition of Ready
- [x] Story is defined with summary and acceptance criteria.
- [x] Dependencies (2.3, 2.5) are complete.
- [ ] The initial set of triggers and content for the nudges has been defined.
- [ ] Story has been estimated by the development team.
- [x] UX designs for the nudge components (banners, badges, etc.) are available.

## 7. Definition of Done
- [ ] All acceptance criteria for the initial set of nudges are met.
- [ ] The nudge components are created and functional.
- [ ] The logic for triggering the nudges is implemented and tested.
- [ ] Frontend tests are written for the nudge components and their trigger logic.
- [ ] Code has been peer-reviewed and approved.
- [ ] Code is merged into the main development branch.
- [ ] The `sprint-status.yaml` is updated to reflect the story's new status.
