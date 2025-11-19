# Decision Architecture

## Executive Summary

The AI-Powered Personal Training Advisor (project ibe160) is a complex system designed to provide personalized, adaptive fitness guidance. It features AI-driven daily workout plan generation, comprehensive workout logging, and seamless integration with Spotify for an enhanced user experience. Key non-functional requirements emphasize WCAG 2.1 AA and GDPR compliance, privacy-first design, high performance, and robust security. The project is structured around 4 epics and 25 stories, focusing on core platform, AI-powered training, enhanced user experience, and comprehensive user control. The architectural decisions will prioritize consistency for AI agent implementation, scalability, and adherence to the defined NFRs.

## Project Initialization

The project will be initialized using a combination of Next.js, FastAPI, and Supabase. The following commands outline the foundational setup:

```bash
# 1. Create the Next.js frontend application
npx create-next-app@latest my-fullstack-app --typescript --eslint --tailwind --app --src-dir --import-alias "@/*"

# Navigate into the project directory
cd my-fullstack-app

# 2. Install Supabase client for Next.js
npm install @supabase/supabase-js

# 3. Create the FastAPI backend directory and set up a Python virtual environment
mkdir backend
cd backend
python -m venv venv

# Activate the virtual environment (example for PowerShell)
# .\venv\Scripts\Activate.ps1

# 4. Install FastAPI, Uvicorn (ASGI server), and python-dotenv for environment variables
pip install fastapi uvicorn python-dotenv "uvicorn[standard]"

# Install Supabase client for Python (optional, if your backend needs direct Supabase interaction)
pip install supabase-py

# 5. Create a basic FastAPI application file (e.g., main.py) - content to be added manually

# 6. Create a .env file in the backend directory for environment variables - content to be added manually

# 7. Go back to the root of your project to continue frontend setup or run commands
cd ..
```

This foundational setup provides the following architectural decisions:
- **Language/TypeScript:** Provided (for Next.js)
- **Styling solution:** Tailwind CSS (for Next.js)
- **Testing framework:** Not explicitly provided by this initial setup, will need to be added.
- **Linting/Formatting:** ESLint (for Next.js)
- **Build tooling:** Next.js built-in for frontend, Uvicorn for FastAPI backend.
- **Project structure:** Separate frontend (Next.js) and backend (FastAPI) directories.

Project initialization using these commands should be the first implementation story.

## Decision Summary



| Category | Decision | Version | Affects Epics | Rationale |

| -------- | -------- | ------- | ------------- | --------- |

| Frontend Framework | Next.js | 16.0.3 | All | Provided by starter template |

| Frontend Language | TypeScript | 5.9.3 | All | Provided by starter template |

| Frontend Styling | Tailwind CSS | 4.1.17 | All | Provided by starter template |

| Frontend Linting | ESLint | v9.39.1 | All | Provided by starter template |

| Backend Framework | FastAPI | 0.121.2 | All | Provided by starter template |

| Backend Language | Python | 3.14.0 | All | Provided by starter template |

| Database | Supabase (PostgreSQL) | postgrest-py 2.24.0 | All | Provided by starter template |

| Authentication | Supabase Auth | postgrest-py 2.24.0 | All | Provided by starter template |

| Project Structure | Monorepo (Next.js/FastAPI) | N/A | All | Provided by starter template |

| AI Model Serving | OpenAI API (Cloud) | openai 2.8.1 | Epic 2, 3 | Simplicity, scalability, focus on core app features |

| Data Architecture | PostgreSQL Schema | N/A | All | Foundational data storage for all application features |

| API Design | RESTful API with JSON | N/A | All | Standardized communication between frontend and backend |

| Authentication & Authorization | Supabase Auth + RLS | N/A | All | Secure user access and data privacy |

| Deployment Strategy | Vercel (Frontend), PaaS (Backend) | N/A | All | Optimized deployment for Next.js, simplified backend management |

| Observability Stack | Vercel/PaaS Built-in + APM | N/A | All | Comprehensive logging, monitoring, and alerting |

| Background Job Processing | Celery with Redis | Celery 5.5.3, Redis 7.0.1 | Epic 2, 4 | Reliable execution of scheduled and long-running tasks |

| Offline Data Sync | IndexedDB + Outbox Pattern | N/A | Epic 2 | Enable offline workout logging and plan access |

| Spotify Integration | PKCE OAuth, Web Playback SDK, Web API | N/A | Epic 3 | Seamless music integration with BPM matching |

| Client-side State Management | React Query + Context/Hooks | 5.90.10 | All | Efficient data fetching, caching, and UI state management |

| Performance Considerations | Caching, DB Optimization, AI Fallback | N/A | All | Meet NFRs for latency and responsiveness |

## Project Structure

```
C:\Users\Robert\Documents\AI-Powered Personal Training Advisor\SG-Gruppe-KI/
├───.gemini/
├───.logging/
├───.vscode/
├───bmad/
│   ├───_cfg/
│   ├───bmm/
│   ├───cis/
│   └───core/
├───docs/
├───.env.example
├───.gitignore
├───proposal.md
└───README.md
```

## Epic to Architecture Mapping

| Epic | Description | Architectural Components |
|---|---|---|
| Core Platform | Foundational services, user management, data persistence. | Supabase (Auth, PostgreSQL), FastAPI, Next.js (basic setup) |
| AI-Powered Training | AI model integration for workout plan generation and adaptation. | OpenAI API, FastAPI (AI integration), Celery/Redis (background processing) |
| Enhanced User Experience | Spotify integration, intuitive UI, performance optimizations. | Spotify API, Next.js (UI, React Query), Redis (caching) |
| Comprehensive User Control | User settings, data privacy, GDPR compliance, offline capabilities. | Supabase (RLS), Next.js (user settings UI), IndexedDB (offline storage) |

## Technology Stack Details




- **Offline Storage:** IndexedDB

### Integration Points

The application will integrate with several external services and internal components:

- **Supabase:**
    - **Authentication:** For user login and registration (email/password, Google, Apple OAuth).
    - **PostgreSQL Database:** For all application data persistence.
    - **Row-Level Security (RLS):** For fine-grained data access control.
- **OpenAI API:**
    - **AI Model Serving:** For generating personalized workout plans and adapting to user context.
- **Spotify:**
    - **Authentication (PKCE OAuth):** Secure user login and authorization for Spotify.
    - **Web Playback SDK:** For controlling music playback directly within the Next.js frontend.
    - **Web API (Audio Analysis):** Utilized by the FastAPI backend to retrieve BPM information for tracks to facilitate BPM-matched session mixes.
- **Celery/Redis:**
    - **Background Job Processing:** For asynchronous tasks like weekly reviews, GDPR operations, and scheduled reminders.
- **PaaS (e.g., Render/Railway):**
    - **FastAPI Backend Hosting:** Provides the environment for the backend API.
- **Vercel:**
    - **Next.js Frontend Hosting:** Provides the environment for the frontend application.
- **Observability Tools (e.g., Datadog/Sentry):**
    - **Logging, Monitoring, Alerting:** Integration for application health and performance insights.


## Novel Pattern Designs

### Offline Data Synchronization with Outbox Pattern

To support offline workout logging and plan access (NFR007), the application will implement an **Offline Data Synchronization** pattern utilizing **IndexedDB** on the client-side and an **Outbox Pattern**. When the user is offline, data changes (e.g., logged workouts) will be stored locally in IndexedDB. Upon re-establishing connectivity, these changes will be pushed to the backend in a reliable, ordered manner using an Outbox Pattern, ensuring data consistency and preventing data loss.

### AI Response Caching

To meet the stringent performance NFRs for AI response times (NFR008), a dedicated **AI Response Cache** will be implemented using **Redis**. This cache will store the results of AI-generated workout plans for similar or identical requests. Before invoking the OpenAI API, the system will check the Redis cache. If a relevant cached response exists and is still valid, it will be served directly, significantly reducing latency and API costs.

### BPM-Matched Spotify Integration

The Spotify integration goes beyond simple playback control by incorporating **BPM-matching** for workout sessions. The FastAPI backend will utilize the Spotify Web API's audio analysis capabilities to retrieve BPM information for tracks. This data will then be used to curate or recommend playlists that align with the intensity of the user's workout, providing a seamless and motivating audio experience. This involves a tight integration between the backend's analytical capabilities and the frontend's playback control via the Web Playback SDK.

## Implementation Patterns

These patterns ensure consistent implementation across all AI agents:

## Implementation Patterns

These patterns ensure consistent implementation across all AI agents:

### Prompt Engineering Best Practices

AI agents will adhere to strict **Prompt Engineering Best Practices** to ensure consistent, high-quality, and predictable outputs from the underlying large language models (LLMs). This includes:
- **Clear and Concise Instructions:** Prompts will be designed to be unambiguous, providing clear instructions for the desired output format and content.
- **Role-Playing:** Agents will be instructed to adopt specific personas (e.g., "expert personal trainer") within the prompt to guide their responses.
- **Contextual Information:** Relevant user data (goals, preferences, past performance, daily context) will be dynamically injected into prompts to personalize responses.
- **Output Constraints:** Prompts will specify desired output formats (e.g., JSON schema for workout plans) to facilitate parsing and integration.
- **Iterative Refinement:** Prompts will be continuously refined and versioned based on evaluation metrics and user feedback to improve AI performance.

### Contextual Awareness and Management

AI agents will implement **Contextual Awareness and Management** to provide adaptive and personalized guidance. This involves:
- **Session Context:** Maintaining a short-term memory of the current user interaction, including recent queries and responses.
- **Long-Term User Profile:** Accessing and utilizing the `users` and `daily_contexts` tables to retrieve historical data, preferences, and goals.
- **Dynamic Context Injection:** Automatically injecting relevant contextual information into prompts for AI model calls, ensuring that generated workout plans and advice are tailored to the user's current state and history.
- **Contextual Fallbacks:** Designing mechanisms to gracefully handle missing or incomplete context, providing sensible defaults or prompting the user for more information.

### Idempotent AI Operations

All AI-driven operations, particularly those involving the generation or modification of workout plans, will be designed to be **Idempotent**. This means that making the same request multiple times will produce the same result or have no further effect after the first successful execution. This is crucial for:
- **Reliability:** Allowing for safe retries in case of network issues or temporary service unavailability without creating duplicate or inconsistent data.
- **Consistency:** Ensuring that repeated calls to generate a plan for a specific date and user context always yield the same plan, unless the underlying context changes.
- **Error Recovery:** Simplifying error handling logic by removing the need to track whether a partial operation has already occurred.

### Observability for AI Agents

A comprehensive **Observability Strategy for AI Agents** will be implemented to monitor their behavior, performance, and output quality. This includes:
- **Prompt Logging:** Logging all prompts sent to the AI models, along with the generated responses, for debugging, auditing, and future model fine-tuning.
- **Latency Monitoring:** Tracking the response times of AI model calls to ensure adherence to NFRs.
- **Error Tracking:** Capturing and alerting on any errors or unexpected outputs from AI models.
- **Usage Metrics:** Monitoring token usage and API costs associated with AI interactions.
- **Feedback Loop Integration:** Integrating user feedback mechanisms directly into the observability stack to correlate AI outputs with user satisfaction and identify areas for improvement.

## Consistency Rules

### Naming Conventions

### Naming Conventions

Consistent naming conventions will be applied across the entire codebase to enhance readability, maintainability, and collaboration.

- **Frontend (Next.js/TypeScript):**
    - **Variables & Functions:** `camelCase` (e.g., `userName`, `fetchUserData`)
    - **React Components:** `PascalCase` (e.g., `UserProfile`, `WorkoutCard`)
    - **Files:** `kebab-case` for components and pages (e.g., `user-profile.tsx`, `workout-plan.tsx`), `camelCase` for utility files (e.g., `apiClient.ts`).
    - **Constants:** `SCREAMING_SNAKE_CASE` (e.g., `MAX_RETRIES`)
    - **Types/Interfaces:** `PascalCase` (e.g., `interface UserProfileProps`)

- **Backend (FastAPI/Python):**
    - **Variables & Functions:** `snake_case` (e.g., `user_name`, `fetch_user_data`)
    - **Classes:** `PascalCase` (e.g., `UserModel`, `WorkoutPlanService`)
    - **Files:** `snake_case` (e.g., `main.py`, `user_routes.py`)
    - **Constants:** `SCREAMING_SNAKE_CASE` (e.g., `API_KEY`)

- **Database (PostgreSQL/Supabase):**
    - **Table Names:** `snake_case`, plural (e.g., `users`, `workout_plans`)
    - **Column Names:** `snake_case`, singular (e.g., `user_id`, `plan_date`)
    - **Primary Keys:** `id`
    - **Foreign Keys:** `[table_name]_id` (e.g., `user_id` in `workout_plans`)

- **API Endpoints:**
    - **Resource Paths:** `kebab-case` or `snake_case` (e.g., `/workout-plans`, `/user_settings`)
    - **Query Parameters:** `camelCase` (e.g., `?startDate=...`)

### Code Organization

### Code Organization

A modular and consistent code organization strategy will be adopted for both the frontend and backend to promote maintainability, scalability, and ease of navigation.

- **Frontend (Next.js Application):**
    - `app/`: Contains all route-specific components and layouts using the Next.js App Router.
    - `components/`: Reusable UI components, categorized by domain or type (e.g., `components/ui`, `components/workouts`).
    - `lib/`: Utility functions, helper modules, API client configurations, and external service integrations.
    - `hooks/`: Custom React hooks for encapsulating reusable stateful logic.
    - `styles/`: Global CSS files, Tailwind CSS configuration, and any component-specific styles.
    - `types/`: TypeScript type definitions and interfaces for data structures and props.
    - `public/`: Static assets like images, fonts, and favicons.

- **Backend (FastAPI Application):
    - `app/`: The main application directory.
        - `api/`: Contains FastAPI routers, organizing endpoints by resource (e.g., `api/v1/users.py`, `api/v1/workouts.py`).
        - `core/`: Application-wide configurations, settings, and constants.
        - `db/`: Database connection, session management, and SQLAlchemy models (if used).
        - `schemas/`: Pydantic models for request validation, response serialization, and database interaction.
        - `services/`: Business logic and complex operations, abstracting away direct database or external API calls.
        - `crud/`: Create, Read, Update, Delete operations for database models.
        - `dependencies/`: FastAPI dependency injection functions (e.g., authentication, database session).
    - `tests/`: Unit, integration, and end-to-end tests for the backend.
    - `alembic/`: Database migrations (if using Alembic).

### Error Handling

### Error Handling

A robust and consistent error handling strategy will be implemented across the entire application to ensure graceful degradation, provide informative feedback to users, and facilitate debugging.

- **Backend (FastAPI):**
    - **HTTP Exceptions:** Utilize FastAPI's `HTTPException` for standard API errors (e.g., 400 Bad Request, 404 Not Found, 401 Unauthorized).
    - **Custom Exception Handlers:** Implement custom exception handlers for specific application-level errors or third-party service errors to transform them into consistent API error responses.
    - **Centralized Error Logging:** All unhandled exceptions and significant errors will be logged to the observability stack (e.g., Sentry/Datadog) with relevant context (request details, stack trace).
    - **Validation Errors:** Pydantic's automatic validation will provide detailed error messages for invalid request payloads.

- **Frontend (Next.js/React):**
    - **Error Boundaries:** Implement React Error Boundaries to gracefully catch JavaScript errors in UI components, preventing the entire application from crashing and displaying a fallback UI.
    - **API Error Handling:** Centralize API error handling using `try-catch` blocks in data fetching utilities (e.g., `React Query` error handling). Display user-friendly error messages based on the API error response structure.
    - **Global Error Notifications:** Use a consistent notification system (e.g., toast messages) to inform users of errors without interrupting their workflow.
    - **Retry Mechanisms:** Implement retry logic for transient network errors in API calls where appropriate.
    - **User Feedback:** Provide clear and actionable error messages to users, guiding them on how to resolve the issue or whom to contact.

### Logging Strategy

### Logging Strategy

A comprehensive and structured logging strategy will be implemented across both frontend and backend to provide visibility into application behavior, aid in debugging, and support operational monitoring.

- **Structured Logging:** All logs will be emitted in a structured format (e.g., JSON) to facilitate automated parsing, filtering, and analysis by logging aggregation tools.
- **Logging Levels:** Standard logging levels (DEBUG, INFO, WARNING, ERROR, CRITICAL) will be used consistently to categorize log messages based on their severity and importance.
    - `DEBUG`: Detailed information, typically of interest only when diagnosing problems.
    - `INFO`: Confirmation that things are working as expected.
    - `WARNING`: An indication that something unexpected happened, or indicative of some problem in the near future (e.g., 'disk space low'). The software is still working as expected.
    - `ERROR`: Due to a more serious problem, the software has not been able to perform some function.
    - `CRITICAL`: A serious error, indicating that the program itself may be unable to continue running.
- **Contextual Information:** Each log entry will include relevant contextual information such as:
    - Timestamp
    - Service/Module name
    - Request ID (for tracing requests across services)
    - User ID (if authenticated)
    - Log level
    - Message
    - Any relevant data or metadata
- **Centralized Logging:** Logs from both the frontend and backend will be aggregated and sent to a centralized logging platform (e.g., Datadog, Sentry, or a custom ELK stack) for real-time monitoring, alerting, and historical analysis.
- **Sensitive Data Handling:** Strict measures will be in place to prevent the logging of sensitive user data (e.g., passwords, personal identifiable information, API keys). This will involve redaction or masking of such data before it is written to logs.
- **Frontend Logging:** Client-side errors and significant user interactions will be logged to the centralized system, providing insights into user experience and client-side issues.

## Data Architecture

The application will utilize PostgreSQL, managed via Supabase, for its primary data persistence. The core schema design will include the following tables to support the application's functional requirements:

### `users` table
- `id` (UUID, Primary Key, from Supabase Auth)
- `email` (TEXT, UNIQUE, from Supabase Auth)
- `name` (TEXT)
- `goals` (JSONB)
- `preferences` (JSONB)
- `equipment` (TEXT[])
- `injuries` (TEXT)
- `units` (TEXT)
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())
- `updated_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())

### `workout_plans` table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to `users.id`)
- `plan_date` (DATE, UNIQUE for user_id and date)
- `plan_json` (JSONB, stores full AI-generated plan structure)
- `status` (TEXT, e.g., 'generated', 'completed', 'skipped')
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())
- `updated_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())

### `workout_logs` table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to `users.id`)
- `workout_plan_id` (UUID, Foreign Key to `workout_plans.id`, NULLABLE)
- `exercise_name` (TEXT)
- `set_number` (INTEGER)
- `reps_completed` (INTEGER)
- `weight_used` (NUMERIC)
- `rpe_logged` (INTEGER)
- `log_time` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())

### `daily_contexts` table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to `users.id`)
- `context_date` (DATE, UNIQUE for user_id and date)
- `mood` (TEXT)
- `energy` (TEXT)
- `soreness` (TEXT)
- `notes` (TEXT)
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())
- `updated_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())

### `spotify_integrations` table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to `users.id`, UNIQUE)
- `spotify_user_id` (TEXT, UNIQUE)
- `access_token` (TEXT, ENCRYPTED)
- `refresh_token` (TEXT, ENCRYPTED)
- `expires_at` (TIMESTAMP WITH TIME ZONE)
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())
- `updated_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())

### `user_settings` table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to `users.id`)
- `setting_key` (TEXT)
- `setting_value` (TEXT)
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())
- `updated_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())
- (Composite UNIQUE constraint on `user_id` and `setting_key` will be applied)

## API Contracts

The application's API will adhere to RESTful principles, utilizing JSON for all request and response bodies. FastAPI will be used to implement the backend API, which inherently supports OpenAPI (Swagger) documentation for clear contract definition.

### General Principles:
- **Resource-Oriented URLs:** Endpoints will represent resources (e.g., `/users`, `/workouts`, `/plans`).
- **Standard HTTP Methods:**
    - `GET`: Retrieve resources.
    - `POST`: Create new resources.
    - `PUT`/`PATCH`: Update existing resources.
    - `DELETE`: Remove resources.
- **JSON Payloads:** All request and response bodies will be JSON.
- **Stateless Communication:** Each request from client to server will contain all the information needed to understand the request.

### Request/Response Formats:
- **Successful Responses (HTTP 2xx):**
    ```json
    {
      "message": "success",
      "data": { /* resource data */ }
    }
    ```
    Or directly return resource data for `GET` requests.
- **Error Responses (HTTP 4xx, 5xx):**
    ```json
    {
      "error": {
        "code": "error_code_string",
        "message": "Human-readable error message.",
        "details": { /* optional additional details */ }
      }
    }
    ```

### Error Handling:
- **Standard HTTP Status Codes:** Appropriate status codes will be used to indicate the nature of the response (e.g., `200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`).
- **Consistent Error Structure:** All error responses will follow the defined JSON error format to ensure predictable handling on the client-side.

### Example Endpoints (Illustrative):
- `GET /users/{user_id}`: Retrieve a specific user's profile.
- `POST /workouts`: Create a new workout log.
- `GET /plans?date=YYYY-MM-DD`: Retrieve a user's workout plan for a specific date.

## Security Architecture

The application's security architecture will be built upon Supabase's robust authentication and PostgreSQL's Row-Level Security (RLS) features.

### Authentication:
- User authentication will be handled by Supabase Auth, supporting email/password and OAuth providers (Google, Apple) as defined in the PRD.

### Authorization:
- **Role-Based Access Control (RBAC):** Initially, the system will operate with a single 'user' role, implying that all authenticated users have access to their own data and features. No distinct 'admin' or 'trainer' roles are planned at this stage.
- **Row-Level Security (RLS):** Supabase's PostgreSQL RLS will be extensively utilized to enforce data privacy and isolation. Policies will be defined on all relevant tables (e.g., `workout_plans`, `workout_logs`, `daily_contexts`, `spotify_integrations`, `user_settings`) to ensure that users can only read, write, update, or delete data that belongs to them. This is a critical component for GDPR compliance and maintaining a privacy-first approach.
- **API-level Authorization:** While RLS handles data access, the FastAPI backend will implement additional authorization checks for specific API endpoints or actions that require verification beyond RLS (e.g., ensuring a user is authenticated before allowing any data manipulation). This provides a layered defense.

### Data Protection:
- Sensitive data, such as Spotify access and refresh tokens, will be encrypted at rest within the database.
- All communication between the frontend, backend, and Supabase will be secured using HTTPS/SSL to ensure encryption in transit.

## Performance Considerations

The application's performance will be a critical factor for user experience, especially given the NFRs for API latency and AI response times.

### General Principles:
- **Optimize for User Experience:** Prioritize responsiveness and perceived performance for critical user journeys.
- **Proactive Optimization:** Implement performance considerations from the design phase, rather than as an afterthought.
- **Continuous Monitoring:** Utilize the observability stack to track performance metrics and identify bottlenecks.

### Strategies:
- **Caching:**
    - **Frontend (Next.js):** Leverage Next.js's built-in caching mechanisms (ISR, SSR caching) and **React Query** for client-side caching of API responses. React Query handles stale-while-revalidate, background re-fetching, and provides a great developer experience for managing server state.
    - **Backend (FastAPI):** Implement a dedicated **Redis** instance for caching frequently accessed data from the PostgreSQL database (e.g., user profiles, workout templates, aggregated statistics). Redis will also be used for **AI Response Cache** to store results from OpenAI API calls for similar or identical requests, crucial for meeting the AI performance NFR.
- **Database Optimization:**
    - **Efficient Queries:** Design and optimize PostgreSQL queries to minimize execution time.
    - **Indexing:** Apply appropriate database indexes to speed up data retrieval.
    - **Connection Pooling:** Utilize connection pooling for the FastAPI application to efficiently manage database connections.
- **AI Model Performance:**
    - **API Optimization:** Ensure efficient communication with the OpenAI API, including batching requests where appropriate.
    - **Response Time Monitoring:** Closely monitor AI response times to meet the p95 ≤ 10s NFR.
    - **Fallback Mechanism:** Implement a fallback mechanism (as per FR008) to provide a cached or rule-based plan if AI generation fails or times out, ensuring a continuous user experience.
- **Frontend Performance:**
    - **Code Splitting & Lazy Loading:** Optimize Next.js bundles by splitting code and lazy-loading components to reduce initial page load times.
    - **Image Optimization:** Optimize images for web delivery (e.g., using Next.js Image component, appropriate formats and compression).
    - **CDN:** Leverage Vercel's global CDN for fast asset delivery.
- **Rate Limiting:** Implement rate limiting on AI endpoints (as per NFR009) to prevent abuse and ensure fair usage, which can also indirectly help maintain performance under heavy load.

## Deployment Architecture

The application will be deployed with a clear separation between the frontend and backend components, leveraging specialized platforms for optimal performance and ease of management.

### Frontend (Next.js):
- **Platform:** Vercel
- **Rationale:** Vercel is the creator of Next.js and provides highly optimized deployment, including automatic scaling, global Content Delivery Network (CDN), serverless functions for API routes (if used within Next.js), and seamless integration with Git repositories for continuous deployment. This choice ensures excellent performance, developer experience, and scalability for the user-facing application.

### Backend (FastAPI):
- **Platform:** A Platform-as-a-Service (PaaS) solution such as Render or Railway.
- **Rationale:** PaaS providers simplify the deployment and management of the FastAPI backend by abstracting away infrastructure concerns. They offer managed services for hosting, scaling, and monitoring, allowing the development team to focus on building application logic rather than managing servers. This approach balances control with operational simplicity, providing a robust environment for the FastAPI API.

### Database (PostgreSQL via Supabase):
- **Platform:** Supabase
- **Rationale:** Supabase provides a fully managed PostgreSQL database, handling all aspects of hosting, backups, and scaling. This eliminates the need for separate database deployment considerations.

### Overall Deployment Flow:
1.  **Code Commit:** Developers push code changes to their Git repository.
2.  **Frontend CI/CD (Vercel):** Vercel automatically detects changes in the Next.js repository, builds the application, and deploys it to its global network.
3.  **Backend CI/CD (PaaS):** The chosen PaaS (e.g., Render/Railway) automatically detects changes in the FastAPI repository, builds the application (e.g., Docker image), and deploys it to its managed infrastructure.
4.  **Supabase:** Database changes are managed directly within the Supabase platform.

## Development Environment

### Prerequisites

### Prerequisites

To set up the development environment, the following software and tools are required:

- **Node.js (LTS version):** Required for running the Next.js frontend application and its associated tooling (npm/yarn).
- **npm (Node Package Manager):** Used for managing frontend dependencies. (Comes with Node.js)
- **Python (3.9+):** Required for the FastAPI backend application.
- **pip (Python Package Installer):** Used for managing backend dependencies. (Comes with Python)
- **Git:** For version control and cloning the project repository.
- **Code Editor:** A modern code editor such as Visual Studio Code, with relevant extensions for TypeScript, React, Python, and Tailwind CSS.
- **Docker (Optional but Recommended):** For running Supabase locally or for containerizing the backend application.

### Setup Commands

```bash
# 1. Create the Next.js frontend application
npx create-next-app@latest my-fullstack-app --typescript --eslint --tailwind --app --src-dir --import-alias "@/*"

# Navigate into the project directory
cd my-fullstack-app

# 2. Install Supabase client for Next.js
npm install @supabase/supabase-js

# 3. Create the FastAPI backend directory and set up a Python virtual environment
mkdir backend
cd backend
python -m venv venv

# Activate the virtual environment (example for PowerShell)
# .\venv\Scripts\Activate.ps1

# 4. Install FastAPI, Uvicorn (ASGI server), and python-dotenv for environment variables
pip install fastapi uvicorn python-dotenv "uvicorn[standard]"

# Install Supabase client for Python (optional, if your backend needs direct Supabase interaction)
pip install supabase-py

# 5. Create a basic FastAPI application file (e.g., main.py) - content to be added manually

# 6. Create a .env file in the backend directory for environment variables - content to be added manually

# 7. Go back to the root of your project to continue frontend setup or run commands
cd ..
```

## Architecture Decision Records (ADRs)

## Architecture Decision Records (ADRs)

The following are key architectural decisions made for the project:

- **Frontend Framework: Next.js**
    - **Rationale:** Provided by starter template, offers strong features for SSR, SSG, and API routes, optimized for performance and developer experience.
- **Frontend Language: TypeScript**
    - **Rationale:** Provided by starter template, enhances code quality, maintainability, and developer productivity through static typing.
- **Frontend Styling: Tailwind CSS**
    - **Rationale:** Provided by starter template, utility-first CSS framework for rapid UI development and consistent design.
- **Frontend Linting: ESLint**
    - **Rationale:** Provided by starter template, ensures code quality and adherence to coding standards.
- **Backend Framework: FastAPI**
    - **Rationale:** Provided by starter template, high-performance Python web framework for building APIs, with automatic OpenAPI documentation.
- **Backend Language: Python**
    - **Rationale:** Provided by starter template, widely used for AI/ML, offering a rich ecosystem for backend development.
- **Database: Supabase (PostgreSQL)**
    - **Rationale:** Provided by starter template, fully managed PostgreSQL with real-time capabilities, authentication, and RLS.
- **Authentication: Supabase Auth**
    - **Rationale:** Provided by starter template, integrated authentication solution with various providers and robust security features.
- **Project Structure: Monorepo (Next.js/FastAPI)**
    - **Rationale:** Provided by starter template, simplifies dependency management, code sharing, and deployment for related frontend and backend projects.
- **AI Model Serving: OpenAI API (Cloud)**
    - **Rationale:** Simplicity, scalability, and allows focus on core application features rather than managing AI infrastructure.
- **Data Architecture: PostgreSQL Schema**
    - **Rationale:** Foundational data storage for all application features, leveraging PostgreSQL's reliability and features.
- **API Design: RESTful API with JSON**
    - **Rationale:** Standardized communication between frontend and backend, widely understood and supported.
- **Authentication & Authorization: Supabase Auth + RLS**
    - **Rationale:** Secure user access and data privacy through integrated authentication and fine-grained row-level security.
- **Deployment Strategy: Vercel (Frontend), PaaS (Backend)**
    - **Rationale:** Optimized deployment for Next.js (Vercel) and simplified backend management (PaaS) for scalability and operational ease.
- **Observability Stack: Vercel/PaaS Built-in + APM**
    - **Rationale:** Comprehensive logging, monitoring, and alerting for application health and performance insights.
- **Background Job Processing: Celery with Redis**
    - **Rationale:** Reliable execution of scheduled and long-running tasks, crucial for AI plan generation and other asynchronous operations.
- **Offline Data Sync: IndexedDB + Outbox Pattern**
    - **Rationale:** Enables offline workout logging and plan access, enhancing user experience and data resilience.
- **Spotify Integration: PKCE OAuth, Web Playback SDK, Web API**
    - **Rationale:** Seamless music integration with BPM matching, providing a unique and engaging user experience.
- **Client-side State Management: React Query + Context/Hooks**
    - **Rationale:** Efficient data fetching, caching, and UI state management for a responsive frontend.
- **Performance Considerations: Caching, DB Optimization, AI Fallback**
    - **Rationale:** Strategies to meet Non-Functional Requirements (NFRs) for latency and responsiveness, ensuring a smooth user experience.

---

_Generated by BMAD Decision Architecture Workflow v1.0_
_Date: tirsdag 18. november 2025_
_For: BIP_