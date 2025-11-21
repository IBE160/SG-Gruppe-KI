# Story 1.1: Project Initialization and Setup

Status: ready-for-dev

## Story

**As a Developer,**
**I want to initialize the project with Next.js, FastAPI, and Supabase by executing the provided setup commands,**
**So that a foundational infrastructure is established and a monorepo structure is set up for further development.**

## Acceptance Criteria

1.  **Given** the project structure is defined in `architecture.md`
    **When** the initialization commands are run
    **Then** a Next.js frontend, a FastAPI backend, and a Supabase project are created and connected.
2.  **Given** the initialization commands are run
    **Then** the project is structured as a monorepo with distinct frontend and backend applications.

## Tasks / Subtasks

-   [ ] **Initialize Next.js Frontend:** (AC: #1)
    -   [ ] Execute `npx create-next-app@14.x my-fullstack-app --typescript --eslint --tailwind --app --src-dir --import-alias "@/*"` (Source: `architecture.md`) (AC: #1)
    -   [ ] Navigate into the `my-fullstack-app` directory. (AC: #1)
    -   [ ] Install Supabase client for Next.js: `npm install @supabase/supabase-js` (Source: `architecture.md`) (AC: #1)
    -   [ ] Verify basic Next.js application runs without errors. (AC: #1)
-   [ ] **Set up FastAPI Backend:** (AC: #1)
    -   [ ] Create `backend` directory. (AC: #1)
    -   [ ] Navigate into `backend` directory. (AC: #1)
    -   [ ] Create and activate a Python virtual environment: `python -m venv venv` and `.\venv\Scripts\Activate.ps1` (Source: `architecture.md`) (AC: #1)
    -   [ ] Install FastAPI, Uvicorn, and python-dotenv: `pip install fastapi uvicorn python-dotenv "uvicorn[standard]"` (Source: `architecture.md`) (AC: #1)
    -   [ ] Install Supabase client for Python (if needed for direct backend interaction): `pip install supabase-py` (Source: `architecture.md`) (AC: #1)
    -   [ ] Create a basic FastAPI application file (e.g., `main.py`) with a simple health check endpoint. (AC: #1)
    -   [ ] Create a `.env` file in the backend directory for environment variables. (AC: #1)
    -   [ ] Verify basic FastAPI application runs without errors (e.g., `uvicorn main:app --reload`). (AC: #1)
-   [ ] **Verify Monorepo Structure:** (AC: #2)
    -   [ ] Confirm the project root contains both the `my-fullstack-app` (frontend) and `backend` directories. (AC: #2)
-   [ ] **Basic End-to-End Test (Playwright):** (AC: #1, #2)
    -   [ ] Add a basic Playwright test to verify the Next.js frontend loads. (AC: #1)
    -   [ ] Add a basic Playwright test to call the FastAPI health check endpoint. (AC: #1)

## Dev Notes

- Relevant architecture patterns and constraints
- Source tree components to touch
- Testing standards summary

### Project Structure Alignment and Lessons Learned

As this is the first story in the epic, there are no previous story learnings or project structure alignment conflicts to address. The foundational structure for this story is directly derived from the architectural decisions outlined in `architecture.md`, specifically the "Project Initialization" and "Project Structure" sections, which establish the monorepo setup with Next.js and FastAPI. All new components and files created as part of this story should adhere to the naming conventions and code organization principles detailed within `architecture.md`.

### References

- Cite all technical details with source paths and sections, e.g. [Source: docs/<file>.md#Section]
  - `architecture.md#Project-Initialization`
  - `architecture.md#Decision-Summary`
  - `architecture.md#Project-Structure`
  - `epics.md#Story-1.1:-Project-Initialization-and-Setup`

## Dev Agent Record

### Context Reference

- `C:\Users\Robert\Documents\AI-Powered Personal Training Advisor\SG-Gruppe-KI\docs\sprint-artifacts\1-1-project-initialization-and-setup.context.xml`

### Agent Model Used

Gemini CLI

### Debug Log References

### Completion Notes List

### File List

## Change Log
- 2025-11-21: Initial draft created by Gemini CLI.

