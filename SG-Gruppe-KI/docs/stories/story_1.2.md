As a User,
I want to be able to sign up and log in with my email and password,
So that I can have a secure personal account.

**Acceptance Criteria:**

**Given** a user is on the login/signup page
**When** they enter a valid email and password and click "Sign Up"
**Then** a new user is created in the Supabase users table.
**And** they are automatically logged in.
**Given** a registered user is on the login page
**When** they enter their correct email and password and click "Log In"
**Then** they are successfully authenticated.

**Prerequisites:** Story 1.1.

**Technical Notes:** Use Supabase Auth for email/password authentication. Implement the UI for signup and login forms.
