# Security Configuration and Best Practices Checklist (R1.6: OWASP Top 10 Compliance)

**Objective:** This checklist provides actionable guidelines for preventing common web application security vulnerabilities as identified by the OWASP Top 10, specifically tailored for the Next.js, FastAPI, and Supabase technology stack. It complements the `docs/architecture.md` and should be reviewed and implemented during development.

---

## 1. Broken Access Control

*   **FastAPI Backend:**
    *   [ ] Implement **API-level Authorization** for all sensitive endpoints. This must ensure that only authenticated and authorized users can access or modify resources (e.g., using FastAPI `Depends` for authentication and custom authorization logic).
    *   [ ] Verify **Row-Level Security (RLS)** policies are correctly configured and enabled on all Supabase tables (`users`, `workout_plans`, `workout_logs`, `daily_contexts`, `spotify_integrations`, `user_settings`) to ensure users can only access their own data. Test RLS with non-owner access attempts.
    *   [ ] Ensure **least privilege** principle is applied: Backend services and database roles should only have the minimum necessary permissions.
*   **Next.js Frontend:**
    *   [ ] Do not rely solely on client-side checks for access control. Always re-verify authorization on the server-side.
    *   [ ] Secure API routes (if used) with proper authentication and authorization.

## 2. Cryptographic Failures

*   **FastAPI Backend:**
    *   [ ] Ensure all sensitive data at rest (e.g., Spotify tokens, API keys if stored) is **encrypted** using strong, industry-standard algorithms.
    *   [ ] Use **HTTPS/SSL** for all communication in transit between frontend, backend, and Supabase.
    *   [ ] Implement **strong hashing algorithms** (e.g., Argon2, bcrypt) for storing passwords. (Supabase Auth handles this, but verify configuration if custom auth is used).
*   **Next.js Frontend:**
    *   [ ] Ensure all communication with the backend is exclusively over **HTTPS**.
    *   [ ] Do not store sensitive information unencrypted in local storage or session storage.

## 3. Injection

*   **FastAPI Backend:**
    *   [ ] Use **parameterized queries** and ORMs (e.g., SQLAlchemy with Supabase) to prevent SQL Injection.
    *   [ ] Implement **input validation and sanitization** on all user-supplied data, especially for data that interacts with databases, APIs, or AI prompts.
    *   [ ] For AI prompts, adhere to **Prompt Engineering Best Practices** to prevent "prompt injection" or manipulation of the AI's intended behavior. Validate and sanitize all user input before it's included in an AI prompt.
*   **Next.js Frontend:**
    *   [ ] Perform client-side input validation, but always re-validate on the server.
    *   [ ] Ensure proper escaping of user-supplied data before rendering it in HTML to prevent XSS.

## 4. Insecure Design (General)

*   [ ] Conduct **Threat Modeling** for critical user flows (e.g., authentication, workout plan generation, data logging) to identify and mitigate design-level vulnerabilities.
*   [ ] Implement **Fallback Mechanisms** (e.g., for AI generation failure or timeouts) to ensure graceful degradation and prevent system failures.
*   [ ] Adhere to the **Idempotent AI Operations** pattern to ensure reliability and consistency in AI-driven processes.
*   [ ] Implement a **Privacy by Design** approach, especially for GDPR compliance (e.g., data minimization, user consent, clear data retention policies).

## 5. Security Misconfiguration

*   **Deployment (Vercel/PaaS/Supabase):**
    *   [ ] Ensure all default credentials are changed.
    *   [ ] Disable unnecessary features, services, or ports.
    *   [ ] Configure **security headers** (e.g., Content-Security-Policy, X-Frame-Options, Strict-Transport-Security) for the Next.js frontend and FastAPI backend.
    *   [ ] Implement **Rate Limiting** on critical API endpoints (e.g., login, AI generation) to prevent abuse and brute-force attacks.
    *   [ ] Regularly review and update **dependencies** to their latest secure versions.
*   **FastAPI Backend:**
    *   [ ] Disable debug mode and detailed error messages in production.
    *   [ ] Ensure environment variables are managed securely (e.g., using `python-dotenv` for local development, and proper secret management in production PaaS).
*   **Next.js Frontend:**
    *   [ ] Configure `next.config.js` for security best practices (e.g., `Strict-Transport-Security`).

## 6. Vulnerable and Outdated Components

*   [ ] Implement a process for **regularly scanning dependencies** (npm for frontend, pip for backend) for known vulnerabilities.
*   [ ] Establish a routine for **updating libraries and frameworks** to secure versions.
*   [ ] Remove unused dependencies and code.

## 7. Identification and Authentication Failures

*   **Supabase Auth:**
    *   [ ] Verify **password policies** (length, complexity) are configured according to best practices.
    *   [ ] Implement **Multi-Factor Authentication (MFA)** if specified in NFRs or future requirements.
    *   [ ] Test **session management** to ensure tokens are securely handled (e.g., short-lived access tokens, http-only cookies, proper logout invalidation).
*   **FastAPI Backend:**
    *   [ ] Ensure **rate limiting** is applied to login attempts.
    *   [ ] Do not expose sensitive user information (e.g., "User not found") in login error messages to prevent enumeration attacks.

## 8. Software and Data Integrity Failures

*   **FastAPI Backend:**
    *   [ ] Implement **strong data validation** on all incoming API requests to ensure data integrity before processing or storing.
    *   [ ] Use **transactional integrity** for multi-step database operations to prevent partial updates and ensure data consistency.
    *   [ ] Verify that **AI-generated content** (e.g., workout plans) is validated against expected schemas before storage.
*   **Deployment:**
    *   [ ] Ensure **code integrity** through secure CI/CD pipelines that prevent unauthorized code changes.
    *   [ ] Verify the **integrity of data backups** and ensure their security.

## 9. Security Logging and Monitoring Failures

*   **Observability Stack:**
    *   [ ] Implement comprehensive **structured logging** for all security-relevant events (e.g., failed login attempts, access violations, data modification, security scan results).
    *   [ ] Configure **real-time monitoring and alerting** for critical security events to enable rapid response.
    [ ] Ensure **sensitive data is redacted/masked** from logs.
    *   [ ] Regularly **review security logs** for suspicious activity.

## 10. Server-Side Request Forgery (SSRF)

*   **FastAPI Backend:**
    *   [ ] Implement strict **allow-listing** for any URLs that the backend can fetch from. This is critical for any features that involve the backend making requests to external services based on user input (e.g., image fetching, URL parsing).
    *   [ ] Sanitize and validate all user-provided URLs before they are used in server-side requests.

---

**Next Steps:** This checklist will serve as a foundational document. It should be continuously updated and cross-referenced with actual implementation during the development phase. Once the core components are available, these points will form the basis for security testing scenarios.
