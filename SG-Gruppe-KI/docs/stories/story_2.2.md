As a User,
I want the AI to generate a personalized daily workout plan based on my goals, profile, and daily context,
So that I have a clear plan to follow.

**Acceptance Criteria:**

**Given** a user has provided their daily context
**When** they request a new plan for the day
**Then** the FastAPI backend constructs a prompt with the user's profile, daily context, and recent workout history.
**And** the AI returns a valid JSON workout plan which is then saved to the workout_plans table.

**Prerequisites:** Story 2.1.

**Technical Notes:** Implement the FastAPI endpoint for AI plan generation. This involves fetching data from Supabase, interacting with the OpenAI API, and validating the response.
