# Story 1.1: Project Setup & Core Infrastructure

Status: ready-for-dev

## Story

As a developer,
I want to initialize the project with the specified tech stack,
So that I can begin developing features on a solid foundation.

## Acceptance Criteria

1.  Given the project is new and empty
2.  When I execute the `npx create-next-app@latest my-ai-trainer --typescript --tailwind --eslint --app --src-dir` command
3.  Then a Next.js project structure is created in `apps/web`
4.  And `apps/api` (FastAPI) directory is created as a peer to `apps/web`
5.  And basic `.gitignore` and `README.md` files are present
6.  And `package.json` reflects a monorepo setup

## Tasks / Subtasks

*   [ ] Task: Initialize Next.js frontend project (AC: 1, 3)
    *   [ ] Execute `npx create-next-app@latest my-ai-trainer --typescript --tailwind --eslint --app --src-dir`
    *   [ ] Verify `apps/web` directory is created
    *   [ ] Verify `package.json` is generated for `apps/web`
    *   [ ] Test: Verify `npm install` runs successfully in `apps/web`
*   [ ] Task: Create FastAPI backend project structure (AC: 4)
    *   [ ] Create `apps/api` directory as a peer to `apps/web`
    *   [ ] Initialize basic FastAPI project structure within `apps/api` (e.g., `main.py`, `app/`)
    *   [ ] Create `requirements.txt` in `apps/api` with `fastapi` and `uvicorn` (as per architecture)
    *   [ ] Test: Verify `pip install -r requirements.txt` runs successfully in `apps/api`
*   [ ] Task: Configure monorepo `package.json` (AC: 6)
    *   [ ] Update root `package.json` to define workspaces for `apps/web` and `apps/api`
    *   [ ] Test: Verify `npm install` at root installs dependencies for both `apps/web` and `apps/api`
*   [ ] Task: Add basic `.gitignore` and `README.md` files (AC: 5)
    *   [ ] Create/verify root `.gitignore`
    *   [ ] Create/verify root `README.md`
    *   [ ] Create/verify `.gitignore` in `apps/web`
    *   [ ] Create/verify `.gitignore` in `apps/api`
*   [ ] Task: Implement initial testing setup (AC: 1, 3, 4, 6)
    *   [ ] Configure Jest and React Testing Library in `apps/web` (as per architecture)
    *   [ ] Configure Playwright for e2e tests in `apps/web` and `apps/api` (as per architecture)
    *   [ ] Test: Run initial placeholder tests for frontend and backend

## Dev Notes

- Relevant architecture patterns and constraints:
    - Frontend: Next.js (App Router, TypeScript, Tailwind CSS, ESLint)
    - Backend: FastAPI (Python)
    - Database/Auth: Supabase (PostgreSQL, Auth)
    - Testing: Jest, React Testing Library, Playwright
    - Monorepo structure (`apps/web`, `apps/api`)
- Source tree components to touch:
    - `apps/web/` (initial setup)
    - `apps/api/` (new directory)
    - `package.json` (root for monorepo config)
    - `.gitignore` (root, `apps/web`, `apps/api`)
    - `README.md` (root)
- Testing standards summary:
    - Jest/React Testing Library for unit/integration tests in `apps/web`
    - Playwright for e2e tests in `apps/web` and `apps/api`

### Project Structure Notes

- Alignment with unified project structure (paths, modules, naming):
    - The project structure aligns with the defined monorepo architecture.
    - Frontend: `apps/web`
    - Backend: `apps/api`
- Detected conflicts or variances (with rationale):
    - None.

### References

- [Source: docs/architecture.md#Project-Initialization]
- [Source: docs/architecture.md#Project-Structure]
- [Source: docs/architecture.md#Decision-Summary]
- [Source: docs/architecture.md#Development-Environment]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List