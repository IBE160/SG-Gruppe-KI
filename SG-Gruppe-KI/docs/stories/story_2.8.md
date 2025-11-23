As a User,
I want to receive an automated weekly summary of my progress,
So that I can stay motivated and see my achievements.

**Acceptance Criteria:**

**Given** a user has completed workouts during the week
**When** the week ends
**Then** an automated summary is generated showing their progress, PRs, and other highlights.

**Prerequisites:** Story 2.6.

**Technical Notes:** This can be implemented as a scheduled background job (e.g., using Celery) that generates the summary and stores it for the user to view.
