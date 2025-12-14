# Story 3.1: Spotify Integration & OAuth

## 1. Story Summary
As a user, I want to securely connect my Spotify account to the app, so that I can enable AI-powered music features for my workouts.

## 2. Acceptance Criteria
- Given I am on the Spotify Connection Explainer screen (Flow 3, Screen 1)
- When I tap `[ Connect with Spotify ]`
- Then I am redirected to the Spotify OAuth (PKCE) consent screen
- And after granting permissions (user-read-playback-state, user-modify-playback-state, user-read-recently-played)
- Then I am redirected back to the app, and the connection status is confirmed (Flow 3, Screen 3)
- And Spotify tokens are securely stored in the `Integrations` database table.

## 3. Story Context
*   **Frontend:** This story requires creating the UI for the connection flow, including the explainer screen (`Flow 3, Screen 1`) and the confirmation/error screen (`Flow 3, Screen 3`). This involves guiding the user to the external Spotify consent page and handling their return.
*   **Backend:** This story is also backend-heavy. It requires an endpoint to initiate the OAuth flow and a callback endpoint to handle the authorization code from Spotify. A new service will be needed to manage the token exchange and securely store the credentials.
*   **Data:** A new `Integrations` table will be required in the Supabase database to store the user's Spotify `access_token` and `refresh_token` securely.
*   **UX:** The initial explainer screen is critical for user trust. It must clearly articulate the value of the integration and the permissions being requested before redirecting the user away from the app.

## 4. Dependencies
*   **Story 1.2 (User Authentication):** A logged-in user is required to associate the Spotify integration with an account.
*   **External:** Requires a Spotify Developer account and a configured application to get a `Client ID` and `Client Secret`.

## 5. Risks & Assumptions
*   **Risk:** The OAuth 2.0 PKCE flow is complex and prone to configuration errors (e.g., incorrect redirect URIs). Mitigation: Follow Spotify's documentation meticulously and use a well-vetted OAuth library if possible.
*   **Risk:** Storing third-party credentials (tokens) is a security risk. Mitigation: Ensure tokens are encrypted at rest in the database and that access to the `Integrations` table is highly restricted.
*   **Assumption:** The required scopes (`user-read-playback-state`, etc.) provide all the necessary permissions for the music features planned in subsequent stories.
*   **Assumption:** The backend testing environment issues may complicate testing the callback endpoint.

## 6. Definition of Ready
- [x] Story is defined with summary and acceptance criteria.
- [x] Dependencies (Story 1.2) are complete.
- [ ] Story has been estimated by the development team.
- [x] UX designs for the connection flow (Flow 3) are available.
- [ ] A Spotify Developer application has been created and credentials are available.

## 7. Definition of Done
- [ ] All acceptance criteria are met.
- [ ] The frontend UI and backend endpoints for the OAuth flow are complete and functional.
- [ ] Spotify tokens are successfully and securely stored in the `Integrations` table.
- [ ] The full connection flow is tested end-to-end.
- [ ] Code has been peer-reviewed and approved for both frontend and backend.
- [ ] Code is merged into the main development branch.
- [ ] The `sprint-status.yaml` is updated to reflect the story's new status.
