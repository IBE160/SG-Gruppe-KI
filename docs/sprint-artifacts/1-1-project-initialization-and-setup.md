# Story 1.1: Project Setup & Core Infrastructure - Implementation Plan

**Story:** As a developer, I want to initialize the project with the specified tech stack, so that I can begin developing features on a solid foundation.

**Epic:** Epic 1: Core Platform & User Foundation

## Acceptance Criteria:

Given the project is new and empty
When I execute the `npx create-next-app@latest my-ai-trainer --typescript --tailwind --eslint --app --src-dir` command
Then a Next.js project structure is created in `apps/web`
And `apps/api` (FastAPI) directory is created as a peer to `apps/web`
And basic `.gitignore` and `README.md` files are present
And `package.json` reflects a monorepo setup

**Technical Notes from Epic:** Follow `architecture_content` for monorepo structure and initial `create-next-app` command. Ensure `package.json` is updated for monorepo and dependencies are correctly installed. Install FastAPI within `apps/api`.

---

## Implementation Steps:

This story primarily focuses on setting up the initial project structure and dependencies, which has largely been completed for the current environment. However, the plan details the steps that *would have been* taken to achieve the current state, and ensures that the `package.json` correctly reflects a monorepo setup, matching the established `README.md` instructions.

### Step 1: Initial Project Structure Creation (Conceptual/Verified)

*   **Description:** This step involves creating the core project directories and initializing the Next.js and FastAPI applications. For the current state, this has already been performed.
*   **Commands (Conceptual):**
    1.  `npx create-next-app@latest apps/web --typescript --tailwind --eslint --app --src-dir`
    2.  `mkdir apps/api`
*   **Expected Outcome:**
    *   A `apps/web` directory containing a Next.js application.
    *   An `apps/api` directory.
    *   `project.json` contains a `workspaces` entry for `apps/web`.

### Step 2: Configure Monorepo `package.json`

*   **Description:** Update the root `package.json` to configure workspaces, allowing `npm install` from the root to manage dependencies for both `apps/web` and `apps/api`.
*   **Commands:**
    1.  Read the existing `package.json` to verify `workspaces` entry.
    2.  If `workspaces` is not present, add it.
*   **Expected Outcome:**
    *   The `package.json` file in the project root includes:
        ```json
        "workspaces": [
            "apps/*"
        ],
        ```
    *   The existing `package.json` already contains this, so this step is primarily verification.

### Step 3: Install Node.js Dependencies (Frontend & Shared)

*   **Description:** Install all Node.js dependencies specified in `apps/web/package.json` and any root-level dependencies.
*   **Commands:**
    1.  `npm install` (from the project root)
*   **Expected Outcome:**
    *   A `node_modules` directory in the project root.
    *   All Node.js packages for `apps/web` are installed.

### Step 4: Setup Python Virtual Environment and Install Backend Dependencies

*   **Description:** Create a Python virtual environment within `apps/api` and install necessary FastAPI and Uvicorn dependencies.
*   **Commands:**
    1.  `cd apps/api`
    2.  `python -m venv .venv`
    3.  `.\.venv\Scripts\pip install "fastapi[all]" uvicorn` (Windows)
        *   Alternatively: `source .venv/bin/activate && pip install "fastapi[all]" uvicorn` (macOS/Linux)
    4.  `cd ../..` (Return to project root)
*   **Expected Outcome:**
    *   A `.venv` directory created inside `apps/api`.
    *   FastAPI and Uvicorn installed within the virtual environment.

### Step 5: Verify Initial Files

*   **Description:** Ensure that basic `.gitignore` and `README.md` files are present at the project root.
*   **Commands:**
    1.  `ls -F .` (or equivalent) to check for `.gitignore` and `README.md`.
*   **Expected Outcome:**
    *   `.gitignore` file exists.
    *   `README.md` file exists.

---

## Validation:

*   Confirm that `apps/web` and `apps/api` directories exist.
*   Confirm `node_modules` exists at the root.
*   Confirm `apps/api/.venv` directory exists.
*   Confirm `package.json` has `workspaces`.
*   Run `npm run dev --workspace=web` and verify the Next.js app starts.
*   Run FastAPI from `apps/api` using `uvicorn main:app --reload` and verify it starts.

---

**Note:** This plan details the setup steps. For the current execution, the environment is already largely established, so the focus will be on verification and ensuring the `package.json` is correctly configured for a monorepo if it deviates.
