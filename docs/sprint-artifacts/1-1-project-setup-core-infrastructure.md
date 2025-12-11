# Story 1.1: Project Setup & Core Infrastructure

Status: done

## Story

As a developer,
I want to initialize the project with the specified tech stack,
So that I can begin developing features on a solid foundation.

## Acceptance Criteria

1. Given the project is new and empty
   When I execute the `npx create-next-app@latest my-ai-trainer --typescript --tailwind --eslint --app --src-dir --yes` command
   Then a Next.js project structure is created in `apps/web`
   And `apps/api` (FastAPI) directory is created as a peer to `apps/web`
   And basic `.gitignore` and `README.md` files are present
   And `package.json` reflects a monorepo setup

## Tasks / Subtasks

-   [x] **Task 1: Initialize Next.js Project (AC: 1)**
    -   [x] Subtask 1.1: Execute `npx create-next-app@latest my-ai-trainer --typescript --tailwind --eslint --app --src-dir --yes` in the project root.
    -   [x] Subtask 1.2: Verify `apps/web` directory is created with Next.js project structure.
    -   [x] Subtask 1.3: Update `package.json` to reflect monorepo setup (e.g., workspaces if applicable, or just moving `my-ai-trainer` content into `apps/web` and adapting the root `package.json`).
-   [x] **Task 2: Setup FastAPI Backend (AC: 1)**
    -   [x] Subtask 2.1: Create `apps/api` directory as a peer to `apps/web`.
    -   [x] Subtask 2.2: Initialize a basic FastAPI application within `apps/api`.
    -   [x] Subtask 2.3: Install FastAPI dependencies (e.g., `pip install "fastapi[all]" uvicorn`).
    -   [x] Subtask 2.4: Create initial `main.py` for FastAPI.
-   [x] **Task 3: Basic File Setup (AC: 1)**
    -   [x] Subtask 3.1: Create a root `.gitignore` file, including entries for `node_modules`, `.next`, `.venv`, and other common build/temp files.
    -   [x] Subtask 3.2: Create a root `README.md` file.
-   [x] **Task 4: Verify Monorepo Structure (AC: 1)**
    -   [x] Subtask 4.1: Ensure `package.json` at the project root properly manages both `apps/web` and `apps/api` dependencies (if using a monorepo tool like Lerna or npm/yarn workspaces, otherwise ensure a logical structure).
    -   [x] Subtask 4.2: Verify basic dependencies are installed for both frontend and backend.
-   [x] **Task 5: Testing Setup (AC: 1)**
    -   [x] Subtask 5.1: Install Jest/React Testing Library in `apps/web`.
    -   [x] Subtask 5.2: Install Pytest in `apps/api`.
    -   [x] Subtask 5.3: Ensure Playwright is configured at the project root or in `apps/web`.

## Dev Notes

-   **Relevant architecture patterns and constraints:**
    -   Monorepo structure with `apps/web` (Next.js, TypeScript, Tailwind CSS, ESLint) and `apps/api` (FastAPI).
    -   Testing setup to include Jest/React Testing Library (frontend), Pytest (backend), and Playwright (E2E).
    -   UX Design specifies using Google Material Symbols for iconography.
-   **Source tree components to touch:**
    -   Project root: `.gitignore`, `README.md`, `package.json`.
    -   `apps/web` directory for Next.js setup.
    -   `apps/api` directory for FastAPI setup.
-   **Testing standards summary:**
    -   Jest/React Testing Library for unit/integration tests in `apps/web`.
    -   Pytest for unit/integration tests in `apps/api`.
    -   Playwright for end-to-end tests across the monorepo.

### Project Structure Notes

- Alignment with unified project structure (paths, modules, naming):

  * `apps/web`: Next.js frontend application.
  * `apps/api`: FastAPI backend application.
  * Monorepo structure defined in `package.json`.

- Detected conflicts or variances (with rationale): None.

### References

-   [Source: docs/architecture.md#Project-Initialization]
-   [Source: docs/architecture.md#Decision-Summary]
-   [Source: docs/architecture.md#Project-Structure]
-   [Source: docs/architecture.md#Testing]
-   [Source: docs/epics.md#Story-1.1:-Project-Setup-&-Core-Infrastructure]
-   [Source: docs/sprint-artifacts/ux-design-phase1.md#Design-System-Foundation]

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/1-1-project-setup-core-infrastructure.context.xml`

### Agent Model Used

{{agent_model_name_version}}

### Completion Notes List
- Initialized Next.js project in `apps/web` using `create-next-app`.
- Created FastAPI project directory `apps/api`.
- Configured root `package.json` for npm workspaces, hoisting shared dev dependencies.
- Updated root `.gitignore` to include Python virtual environment and cache files.
- Updated root `README.md` with monorepo setup, installation, and running instructions.
- Set up Jest and React Testing Library for `apps/web`, including `jest.config.ts` and `jest.setup.ts`.
- Set up Pytest for `apps/api`, including virtual environment creation, installation of dependencies, `requirements.txt`, and `test_main.py`.
- Configured Playwright for E2E testing across the monorepo, including `playwright.config.ts` and `tests/e2e/example.spec.ts`.
- All tests (frontend unit, backend unit, E2E) passed successfully.
- Frontend linting passed successfully.
**Completed:** 2025-12-08
**Definition of Done:** All acceptance criteria met, code reviewed, tests passing


### File List
- `package.json` (created, modified for monorepo and dev dependencies)
- `README.md` (modified for monorepo setup instructions)
- `apps/web` (created by npx create-next-app)
- `apps/web/package.json` (modified for monorepo, dependencies, test script)
- `apps/web/jest.config.ts` (created)
- `apps/web/jest.setup.ts` (created)
- `apps/web/src/app/page.test.tsx` (created)
- `apps/api` (created)
- `apps/api/.venv` (created)
- `apps/api/requirements.txt` (created)
- `apps/api/main.py` (created)
- `apps/api/test_main.py` (created)
- `.gitignore` (modified for Python .venv and cache)
- `playwright.config.ts` (created)
- `tests/e2e/example.spec.ts` (created)

