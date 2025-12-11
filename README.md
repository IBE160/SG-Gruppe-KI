# AI-Powered Personal Training Advisor

This project is a monorepo designed to build an AI-Powered Personal Training Advisor. It leverages a Next.js frontend for a dynamic user interface and a FastAPI backend for efficient API services and AI integrations.

## Project Structure

- `apps/web`: The Next.js frontend application, built with TypeScript, Tailwind CSS, and using the App Router.
- `apps/api`: The FastAPI backend application, designed for handling business logic, data processing, and AI features.

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

*   Node.js (v20.x or later)
*   Python (v3.11 or later)

### 1. Clone the Repository

```bash
git clone <repository_url>
cd AI-Powered-Personal-Training-Advisor
```
**(Replace `<repository_url>` with the actual repository URL)**

### 2. Install Dependencies

#### Node.js Dependencies (Frontend & Shared)

From the project root directory, install Node.js dependencies and set up workspaces:

```bash
npm install
```

#### Python Dependencies (Backend)

Navigate into the `apps/api` directory and set up the Python virtual environment and install dependencies:

```bash
cd apps/api
python -m venv .venv
.\.venv\Scripts\pip install "fastapi[all]" uvicorn
# On macOS/Linux, use: source .venv/bin/activate && pip install "fastapi[all]" uvicorn
cd ../.. # Return to project root
```

### 3. Running the Applications

#### Start Frontend (Next.js)

From the project root:

```bash
npm run dev --workspace=web
```

This will start the Next.js development server. Open [http://localhost:3000](http://localhost:3000) (or the port indicated in your terminal) to view it in your browser.

#### Start Backend (FastAPI)

From the project root, activate the virtual environment and start the FastAPI server:

```bash
cd apps/api
.\.venv\Scripts\uvicorn main:app --reload
# On macOS/Linux, use: source .venv/bin/activate && uvicorn main:app --reload
cd ../.. # Return to project root
```

The FastAPI application will be accessible at [http://127.0.0.1:8000](http://127.0.0.1:8000).

## Development Scripts

The root `package.json` contains scripts to manage the monorepo:

*   `npm run dev --workspace=web`: Starts the Next.js development server.
*   `npm run build --workspace=web`: Builds the Next.js application for production.
*   `npm run start --workspace=web`: Starts the Next.js production server.
*   `npm run lint --workspace=web`: Runs ESLint for the Next.js application.

---