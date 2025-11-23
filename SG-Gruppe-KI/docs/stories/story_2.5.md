As a User,
I want to log my completed reps, weight, and RPE for each set,
So that my progress can be tracked.

**Acceptance Criteria:**

**Given** a user is in the workout player
**When** they complete a set
**Then** they can input the reps, weight, and RPE.
**And** this data is saved to the workout_logs table.

**Prerequisites:** Story 2.4.

**Technical Notes:** Implement the functionality to save workout log entries to the database via the FastAPI backend.
