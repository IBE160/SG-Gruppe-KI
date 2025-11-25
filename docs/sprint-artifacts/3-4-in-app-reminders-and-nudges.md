# User Story: 3.4 In-App Reminders and Nudges

**As a:** User
**I want to:** receive timely in-app reminders and nudges,
**So that:** I stay consistent with my training and goals.

## Description

This story covers the implementation of a system for delivering in-app reminders and nudges to the user. These notifications will help users stay consistent with their training schedules, complete daily inputs, and engage with the application's features, ultimately supporting their fitness goals.

## Acceptance Criteria

**Given** a user has enabled reminders
**When** it's time for a scheduled workout or other event
**Then** an in-app notification or message appears, reminding them.
    *   User can enable/disable different types of reminders (e.g., workout time, daily context input, weekly review).
    *   User can customize reminder timings/frequency (e.g., 15 minutes before workout).
    *   Reminders appear as persistent in-app notifications or snackbars.
    *   Clicking a reminder navigates the user to the relevant section of the app.
    *   Reminders are triggered by predefined schedules or backend events.

## Status

drafted

## Dev Notes

### Architecture Patterns and Constraints
The implementation will involve both frontend (displaying notifications) and backend (triggering and scheduling reminders). Background jobs (e.g., using Celery/Redis) will be essential for scheduling and sending reminders. Frontend will consume these reminders and display them. User settings for reminders will be stored in `user_settings` table.

### References
*   [Source: epics.md#story-3-4-in-app-reminders-and-nudges]
*   [Source: architecture.md#background-job-processing]
*   [Source: architecture.md#data-architecture]

### Prerequisites
*   Epic 1 (for user authentication and profile)
*   User Settings Management (from Story 3.6 for enabling/disabling reminders)

### Technical Notes
Implement a notification system in the frontend, capable of displaying various types of in-app messages. Backend will manage reminder schedules, potentially utilizing Celery with Redis as a message broker for robust, asynchronous task execution. Reminder preferences will be stored in the `user_settings` table, which will inform the backend's scheduling logic.

## Tasks

- [ ] Task 1: Design and implement frontend UI component for displaying in-app notifications (AC: #1)
- [ ] Task 2: Implement frontend service for managing notification state and display (AC: #1)
- [ ] Task 3: Develop FastAPI endpoint for managing reminder preferences (CRUD in `user_settings`) (AC: #1)
- [ ] Task 4: Implement backend service for scheduling and triggering reminders using Celery (AC: #1)
- [ ] Task 5: Develop logic for different reminder types (e.g., workout, daily input) (AC: #1)
- [ ] Task 6: Implement backend API for fetching active reminders for a user (AC: #1)
- [ ] Task 7: Integrate reminder preferences into the settings page (AC: #1)
- [ ] Task 8: Write unit tests for frontend notification components and backend scheduling logic.
- [ ] Task 9: Write integration tests for reminder preference management and notification triggering.
- [ ] Task 10: Conduct end-to-end testing for the full reminder lifecycle, from setting to display.

## Dev Agent Record

### Context Reference
This story was drafted based on the requirements in `epics.md` (Epic 3, Story 3.4) and previous validation feedback for story structure.

### Agent Model Used
Gemini-1.5-Flash

### Debug Log References
N/A

### Completion Notes List
- Initial draft of story with ACs and description.
- Added Dev Notes, Tasks, Dev Agent Record, and Change Log sections.
- Aligned ACs with `epics.md` and broke down into tasks.

### File List
- `docs/sprint-artifacts/3-4-in-app-reminders-and-nudges.md` (MODIFIED)
- `docs/sprint-artifacts/sprint-status.yaml` (MODIFIED)

## Change Log

- **2025-11-25**: Initial draft created by Gemini CLI based on `epics.md`.
- **2025-11-25**: Added Status, Dev Notes, Tasks, Dev Agent Record, and Change Log sections. ACs reviewed and refined to align with epic. Status in `sprint-status.yaml` updated to 'drafted'.
