As a User,
I want to receive timely in-app reminders and nudges,
So that I stay consistent with my training and goals.

**Acceptance Criteria:**

**Given** a user has enabled reminders
**When** it's time for a scheduled workout or other event
**Then** an in-app notification or message appears, reminding them.

**Prerequisites:** Epic 1.

**Technical Notes:** Implement a notification system within the frontend. Use background jobs (e.g., Celery) to trigger reminders.
