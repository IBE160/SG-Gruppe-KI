As a User,
I want to provide daily context on my mood, energy, and soreness,
So that the AI can adapt my workout plan for the day.

**Acceptance Criteria:**

**Given** an authenticated user on the dashboard
**When** they open the "Context Window"
**Then** they can input their mood, energy level, and any muscle soreness.
**And** this data is saved to the daily_contexts table for the current date.

**Prerequisites:** Epic 1.

**Technical Notes:** Implement a UI for the Context Window. This could be a modal or a dedicated section on the dashboard.
