# Decision Architecture

## Executive Summary

The AI-Powered Personal Training Advisor (project ibe160) provides personalized, adaptive fitness guidance through AI-driven workout plans, comprehensive logging, and Spotify integration. Its architecture prioritizes consistency for AI agents, scalability, and adherence to key non-functional requirements including WCAG 2.1 AA, GDPR, performance, and security.

## Project Initialization

The project will be initialized using a combination of Next.js, FastAPI, and Supabase. The following commands outline the foundational setup:

```bash
# 1. Create the Next.js frontend application
npx create-next-app@14.x my-fullstack-app --typescript --eslint --tailwind --app --src-dir --import-alias "@/*"

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

| Category | Decision | Version | Affects Epics | Rationale | Verification |
| -------- | -------- | ------- | ------------- | --------- | ------------ |
| Frontend Framework | Next.js | 14.x (LTS) | All | Provided by starter template | Verified: 2025-11-21 (Next.js website). LTS version chosen for stability. No breaking changes noted from v13.x. |
| Frontend Language | TypeScript | 5.9.3 | All | Provided by starter template | Verified: 2025-11-21 (npm registry). Stable version. No major breaking changes expected with Next.js 14.x. |
| Frontend Styling | Tailwind CSS | 4.1.17 | All | Provided by starter template | Verified: 2025-11-21 (npm registry). Stable version. |
| Frontend Linting | ESLint | 9.39.1 | All | Provided by starter template | Verified: 2025-11-21 (npm registry). Stable version. |
| Backend Framework | FastAPI | 0.121.3 | All | Provided by starter template | Verified: 2025-11-21 (PyPI). Stable version. |
| Backend Language | Python | 3.11 | All | Provided by starter template | Verified: 2025-11-21 (Python.org). LTS-like support for stability, recommended for FastAPI. |
| Database | Supabase (PostgreSQL) | Client JS: 2.84.0, Client Python: 2.24.0 | All | Provided by starter template | Verified: 2025-11-21 (npm, PyPI). Supabase is a managed service; PostgreSQL versions are handled by Supabase. |
| Authentication | Supabase Auth | N/A (Service) | All | Provided by starter template | Verified: 2025-11-21 (Supabase documentation). Managed service. |
| Project Structure | Monorepo (Next.js/FastAPI) | N/A | All | Provided by starter template | Verified: 2025-11-21 (architectural decision). |
| AI Model Serving | OpenAI API (Cloud) | Client Python: 2.8.1 | Epic 2, 3 | Simplicity, scalability, focus on core app features | Verified: 2025-11-21 (PyPI). Uses OpenAI Python client. |
| Data Architecture | PostgreSQL Schema | N/A | All | Foundational data storage for all application features | Verified: 2025-11-21 (architectural decision/pattern). |
| API Design | RESTful API with JSON | N/A | All | Standardized communication between frontend and backend | Verified: 2025-11-21 (architectural decision/pattern). |
| Authentication & Authorization | Supabase Auth + RLS | N/A | All | Secure user access and data privacy | Verified: 2025-11-21 (architectural decision/pattern). |
| Deployment Strategy | Vercel (Frontend), PaaS (Backend) | N/A | All | Optimized deployment for Next.js, simplified backend management | Verified: 2025-11-21 (architectural decision/pattern). |
| Observability Stack | Vercel/PaaS Built-in + APM | N/A | All | Comprehensive logging, monitoring, and alerting | Verified: 2025-11-21 (architectural decision/pattern). |
| Background Job Processing | Celery with Redis | N/A | Epic 2, 4 | Reliable execution of scheduled and long-running tasks | Verified: 2025-11-21 (architectural decision/pattern). |
| Offline Data Sync | IndexedDB + Outbox Pattern | N/A | Epic 2 | Enable offline workout logging and plan access | Verified: 2025-11-21 (architectural decision/pattern). |
| Spotify Integration | PKCE OAuth, Web Playback SDK, Web API | N/A | Epic 3 | Seamless music integration with BPM matching | Verified: 2025-11-21 (architectural decision/pattern). |
| Client-side State Management | React Query + Context/Hooks | N/A | All | Efficient data fetching, caching, and UI state management | Verified: 2025-11-21 (architectural decision/pattern). |
| UI Component Library | shadcn/ui | 0.8.0 | All | Leverages headless components with Tailwind CSS for customizable and accessible UI. | Verified: 2025-12-03 (shadcn/ui documentation). Aligns with existing frontend stack. |
| Design System | shadcn/ui (customized) | N/A | All | Provides a consistent and accessible visual language and component set for the UI. | Verified: 2025-12-03 (UX Design Specification). |
| Responsive Design | Mobile-first with breakpoints | N/A | All | Ensures optimal user experience across various devices (mobile, tablet, desktop). | Verified: 2025-12-03 (UX Design Specification). |
| Accessibility Standard | WCAG 2.1 AA | N/A | All | Guarantees the application is usable by the widest possible audience, including individuals with disabilities. | Verified: 2025-12-03 (UX Design Specification). |
| Performance Considerations | Caching, DB Optimization, AI Fallback | N/A | All | Meet NFRs for latency and responsiveness | Verified: 2025-11-21 (architectural decision/pattern). |

## Project Structure

A high-level overview of the project directory, emphasizing the monorepo structure with distinct frontend and backend applications.

```
.
├── .gemini/                       # Gemini CLI configuration and temporary files
├── .logging/                      # Application logging infrastructure and tools
├── .vscode/                       # VS Code configuration and settings
├── bmad/                          # BMad agent configurations and workflows
├── docs/                          # Project documentation, architecture, reports, etc.
├── .env.example                   # Example environment variables
├── .gitignore                     # Git ignore rules
├── package.json                   # Node.js project dependencies (root)
├── package-lock.json              # Node.js dependency lock file (root)
├── playwright.config.ts           # Playwright end-to-end testing configuration
├── proposal.md                    # Project proposal document
├── README.md                      # Project README
├── app/                           # Next.js Frontend Application
│   ├── app/                       # Next.js App Router (route-specific components, layouts)
│   ├── components/                # Reusable UI components (e.g., ui/, workouts/)
│   ├── lib/                       # Utility functions, API clients, external service integrations
│   ├── hooks/                     # Custom React hooks
│   ├── styles/                    # Global CSS, Tailwind config
│   ├── types/                     # TypeScript type definitions
│   └── public/                    # Static assets
└── backend/                       # FastAPI Backend Application
    ├── app/                       # Main FastAPI application directory
    │   ├── api/                   # FastAPI routers (e.g., v1/users.py, v1/workouts.py)
    │   ├── core/                  # Application-wide configurations, settings, constants
    │   ├── db/                    # Database connection, session, SQLAlchemy models
    │   ├── schemas/               # Pydantic models for validation, serialization
    │   ├── services/              # Business logic, complex operations
    │   ├── crud/                  # CRUD operations for database models
    │   └── dependencies/          # FastAPI dependency injection functions
    ├── tests/                     # Backend unit, integration, and E2E tests
    └── alembic/                   # Database migrations (if using Alembic)
```

## Epic to Architecture Mapping

| Epic | Description | Architectural Components |
|---|---|---|
| Core Platform | Foundational services, user management, data persistence. | Supabase (Auth, PostgreSQL), FastAPI, Next.js (basic setup) |
| AI-Powered Training | AI model integration for workout plan generation and adaptation. | OpenAI API, FastAPI (AI integration), Celery/Redis (background processing) |
| Enhanced User Experience | Spotify integration, intuitive UI, performance optimizations. | Spotify API, Next.js (UI, React Query), Redis (caching) |
| Comprehensive User Control | User settings, data privacy, GDPR compliance, offline capabilities. | Supabase (RLS), Next.js (user settings UI), IndexedDB (offline storage) |

## Technology Stack Details
- **Frontend:**
    - **Framework:** Next.js
    - **Language:** TypeScript
    - **Styling:** Tailwind CSS
    - **UI Component Library:** shadcn/ui
        - **Description:** A collection of re-usable components built using Radix UI and Tailwind CSS. It provides headless components that are easily customizable and accessible, aligning with the project's need for a modern, flexible, and themeable UI.
    - **Client-side State Management:** React Query + Context/Hooks
- **Backend:
    - **Framework:** FastAPI
    - **Language:** Python
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **AI Model Serving:** OpenAI API (Cloud)
- **Background Job Processing:** Celery with Redis
- **Offline Storage:** IndexedDB

## User Experience (UX) Architecture

The application's User Experience (UX) architecture is driven by the goal of providing a personalized, adaptive, and highly engaging fitness journey. It prioritizes user-centric design, accessibility, and a seamless interaction flow.

### Design System Foundation

The UX is built upon **shadcn/ui (v0.8.0)**, chosen for its modern, customizable, and headless components that integrate seamlessly with Tailwind CSS. This foundation ensures consistency, flexibility, and accessibility across the user interface.

### Core User Experience & Novel Patterns

The defining core experience is the "**Adaptive Daily Session**" — a 3-step ritual combining self-reflection, AI guidance, and performance tracking. This pattern is designed to make each workout feel intelligently adapted, emotionally attuned, and effortless to begin, transforming "checking in" into a motivational ritual.

**Key aspects include:**
-   **Contextual Check-In:** A quick, conversational interface for users to provide input on mood, energy, and soreness.
-   **Live Feedback:** Transparent AI feedback during plan generation, making the process collaborative.
-   **Graceful Error Handling:** Providing fallback sessions or guidance during AI or music integration failures.
-   **"Perceived Magic" Speed:** Aiming for an ideal interaction time of 5-8 seconds from check-in to session start, achieved through optimized data pre-fetching and micro-feedback animations.

### Core Experience Principles

The UX adheres to the following principles:
-   **Speed: Perceived Magic:** The core flow should feel instantaneous (under 8 seconds).
-   **Guidance: Transparent Partnership:** AI acts as a transparent partner, guiding users with clear, collaborative feedback.
-   **Flexibility: Simple by Default, Controllable on Demand:** Streamlined primary paths with "Edit Plan" options for more control.
-   **Feedback: Personal & Resonant:** Subtle and celebratory feedback, making the experience personal and emotionally engaging.

### Responsive Design & Accessibility

The application employs a **mobile-first responsive strategy** with standard breakpoints, ensuring an optimal and adaptive experience across web (mobile, tablet, desktop). A key non-functional requirement is adherence to **WCAG 2.1 AA** standards, ensuring the application is usable by individuals with disabilities through robust keyboard navigation, focus indicators, ARIA attributes, and clear screen reader considerations.

## Performance Considerations

The application's performance will be a critical factor for user experience, especially given the NFRs for API latency and AI response times. UX-driven performance targets, such as the "perceived magic" speed for critical user journeys like the Adaptive Daily Session, are detailed in the [User Experience (UX) Architecture](#user-experience-ux-architecture) section.

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

To set up the development environment, the following software and tools are required:

- **Node.js (LTS version):** Required for running the Next.js frontend application and its associated tooling (npm/yarn).
- **npm (Node Package Manager):** Used for managing frontend dependencies. (Comes with Node.js)
- **Python (3.11):** Required for the FastAPI backend application.
- **pip (Python Package Installer):** Used for managing backend dependencies. (Comes with Python)
- **Git:** For version control and cloning the project repository.
- **Code Editor:** A modern code editor such as Visual Studio Code, with relevant extensions for TypeScript, React, Python, and Tailwind CSS.
- **shadcn/ui CLI:** For initializing and adding UI components.
- **Docker (Optional but Recommended):** For running Supabase locally or for containerizing the backend application.

### Setup Commands

```bash
# 1. Create the Next.js frontend application
npx create-next-app@14.x my-fullstack-app --typescript --eslint --tailwind --app --src-dir --import-alias "@/*"

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

# 8. Initialize shadcn/ui and add required components (e.g., button, form)
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input form # Example components
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
    - **Rationale:** Provided by starter-template, ensures code quality and adherence to coding standards.
- **Backend Framework: FastAPI**
    - **Rationale:** Provided by starter template, high-performance Python web framework for building APIs, with automatic OpenAPI documentation.
- **Backend Language: Python**
    - **Rationale:** Provided by starter template, widely used for AI/ML, offering a rich ecosystem for backend development.
- **Database: Supabase (PostgreSQL)**
    - **Rationale:** Provided by starter-template, fully managed PostgreSQL with real-time capabilities, authentication, and RLS.
- **Authentication: Supabase Auth**
    - **Rationale:** Provided by starter-template, integrated authentication solution with various providers and robust security features.
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