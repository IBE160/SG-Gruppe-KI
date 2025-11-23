As a User,
I want a comprehensive settings page to manage my general preferences, appearance, music, AI personalization, privacy, and account,
So that I have full control over my app experience.

**Acceptance Criteria:**

**Given** an authenticated user
**When** they navigate to the settings page
**Then** they can view and modify various categories of settings (General, Appearance, Performance & Data, Music & Playback, AI & Personalization, Privacy & Account).
**And** changes are persisted in the user_settings table.

**Prerequisites:** Epic 1.

**Technical Notes:** Design a multi-section settings UI. Implement CRUD operations for the user_settings table.
