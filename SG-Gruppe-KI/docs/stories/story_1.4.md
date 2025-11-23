As a new User,
I want to be guided through a conversational onboarding process,
So that I can set up my initial fitness goals, preferences, and available equipment.

**Acceptance Criteria:**

**Given** a new user logs in for the first time
**When** they are redirected to the onboarding flow
**Then** they are presented with a series of questions about their goals, time availability, equipment, injuries, and preferred units.
**And** their responses are saved to their user profile in the users table.

**Prerequisites:** Story 1.2 or 1.3.

**Technical Notes:** Implement a multi-step conversational UI for onboarding. Store the collected data in the users table (goals, preferences, equipment, injuries, units columns).
