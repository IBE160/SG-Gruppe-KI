As a User,
I want to be able to sign up and log in with my Google account,
So that I can have a quick and easy authentication experience.

**Acceptance Criteria:**

**Given** a user is on the login/signup page
**When** they click "Continue with Google"
**Then** they are redirected to Google's OAuth flow.
**And** upon successful authentication, they are redirected back to the app and are logged in.

**Prerequisites:** Story 1.1.

**Technical Notes:** Configure Google as an OAuth provider in Supabase. Implement the "Continue with Google" button and handle the OAuth callback.
