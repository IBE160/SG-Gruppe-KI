# Story 4.3: Privacy & Account Management

## 1. Story Summary
As a user, I want full control over my privacy settings, including data export and account deletion, so that I can manage my personal information in compliance with GDPR.

## 2. Acceptance Criteria
- Given I am in the "Privacy & Account" settings sub-screen (Flow 18, Screen 5)
- When I tap `[ Export My Data ]`
- Then I am taken to the "Export Data Information & Request" screen (Flow 15, Screen 1)
- And I can request a GDPR-compliant export of my data, receiving confirmation and a timeline for delivery (Flow 15, Screen 2).
- When I tap `[ Delete My Account ]`
- Then I am presented with warnings and required to confirm deletion with explicit user input (Flow 16, Screen 1 & 2).
- And upon confirmation, my account and all associated data are permanently removed as per GDPR (Flow 16, Screen 3 & 4).
- When I tap `[ Logout ]`
- Then I am securely logged out of the application.

## 3. Story Context
*   **Frontend:** This story involves creating UI for sensitive actions: data export request, account deletion with multiple confirmation steps, and a simple logout button. This will involve new pages and modal components.
*   **Backend:** New backend endpoints are required for:
    1.  Initiating a data export (`POST /export`).
    2.  Handling account deletion (`DELETE /auth/user`).
    3.  A logout endpoint to invalidate tokens (though Supabase Auth often handles client-side invalidation).
*   **Data:** Data export will involve querying the entire user's data from Supabase. Account deletion will involve deleting records across multiple tables (e.g., `Users`, `Goals`, `WorkoutPlans`, `WorkoutLogs`, `Integrations`).
*   **UX:** Due to the sensitive nature of these actions, the UX must prioritize clarity, provide explicit warnings, and require strong confirmation (e.g., typing a specific phrase) to prevent accidental data loss.

## 4. Dependencies
*   **Story 1.2 (User Authentication):** A secure authentication system is critical for these actions.
*   **Story 4.1 (Main Settings Menu):** Requires the settings menu and navigation to access this sub-screen.

## 5. Risks & Assumptions
*   **Risk:** Accidental data deletion or privacy breaches. Mitigation: Implement robust backend logic with transactional integrity for deletion, and ensure strict authorization checks. Strong frontend confirmation mechanisms are vital.
*   **Risk:** GDPR compliance can be complex. Mitigation: Consult with legal/compliance experts if available. Ensure all data related to the user is covered in the export and deletion processes.
*   **Assumption:** Supabase's capabilities for data export and deletion (including RLS for ensuring users can only delete their own data) are sufficient for GDPR compliance.

## 6. Definition of Ready
- [x] Story is defined with summary and acceptance criteria.
- [x] Dependencies (1.2, 4.1) are complete.
- [ ] Backend contracts for data export and account deletion endpoints are defined.
- [ ] Story has been estimated by the development team.
- [x] UX designs for privacy and account settings (Flows 15, 16, 18) are available.

## 7. Definition of Done
- [ ] All acceptance criteria are met.
- [ ] Data export request functionality is implemented.
- [ ] Account deletion functionality works, with all associated user data permanently removed.
- [ ] Secure logout functionality is implemented.
- [ ] Frontend and backend components for these features are thoroughly tested.
- [ ] Code has been peer-reviewed and approved.
- [ ] Code is merged into the main development branch.
- [ ] The `sprint-status.yaml` is updated to reflect the story's new status.
