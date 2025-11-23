As a Developer,
I want to be able to input simulated recovery data (HRV, sleep),
So that I can validate the AI's ability to adapt plans based on recovery metrics.

**Acceptance Criteria:**

**Given** the AI plan generation endpoint
**When** simulated recovery data is included in the prompt
**Then** the generated workout plan is adjusted accordingly (e.g., lower volume for poor recovery).

**Prerequisites:** Story 2.2.

**Technical Notes:** This is a developer-facing story. The FastAPI backend should be able to accept and use simulated recovery data in its prompts to OpenAI.
