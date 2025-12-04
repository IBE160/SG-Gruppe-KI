# Test Automation Suite

This directory contains the automated test suite for the project, built using [Playwright](https://playwright.dev/).

## 1. Architecture Overview

This test suite follows a scalable, fixture-based architecture to promote robust and maintainable tests.

- **`tests/e2e/`**: Contains the end-to-end test specifications (`.spec.ts` files).
- **`tests/support/`**: Contains the core testing infrastructure.
  - **`fixtures/`**: Manages test data and state. It uses a `mergeTests` pattern to compose fixtures, and includes data factories for creating test entities (e.g., users, products) with automatic cleanup.
  - **`helpers/`**: Provides reusable utility functions that can be used across any test file.
  - **`page-objects/`**: (Optional) A place to store Page Object Models (POMs) for encapsulating interactions with specific pages or components.

## 2. Setup Instructions

### Prerequisites
- Node.js (version specified in `.nvmrc`)
- npm (or your preferred package manager)

### Installation
1.  **Install Dependencies**: Install all project and test dependencies.
    ```bash
    npm install
    ```
2.  **Install Playwright Browsers**: Download the browsers needed for testing (Chromium, Firefox, WebKit).
    ```bash
    npx playwright install
    ```
3.  **Configure Environment**: Copy the example environment file to create your local configuration.
    ```bash
    cp .env.example .env
    ```
4.  **Update `.env`**: Open the `.env` file and update the variables (`BASE_URL`, `API_URL`, credentials, etc.) to match your local development environment.

## 3. Running Tests

### Standard Execution
To run the entire E2E test suite in headless mode, use the following script:
```bash
npm run test:e2e
```
This is the command that will be executed in the CI/CD pipeline.

### Interactive & Debugging Modes
- **Headed Mode**: To watch the tests execute in a live browser.
  ```bash
  npm run test:e2e -- --headed
  ```
- **UI Mode**: To open the Playwright UI, which provides a powerful way to explore, run, and debug tests.
  ```bash
  npm run test:e2e -- --ui
  ```
- **Debug Mode**: For step-by-step debugging.
  ```bash
  npm run test:e2e -- --debug
  ```
- **Run a Specific Test**: To run a single test file.
  ```bash
  npm run test:e2e tests/e2e/example.spec.ts
  ```

### Viewing Reports
After a test run, an HTML report is generated. You can view it with the following command:
```bash
npx playwright show-report test-results/html
```

## 4. Best Practices

- **Selector Strategy**: Prioritize `data-testid` attributes for selecting elements to ensure tests are resilient to UI and styling changes. Avoid brittle selectors like XPath or complex CSS class chains.
- **Test Isolation**: Each test should be independent. Use the `userFactory` and other fixtures to create the specific data needed for a test, and rely on the automatic cleanup to ensure a clean state for the next test.
- **Assertions**: Use explicit and meaningful assertions with `expect()`. Avoid implicit waits or conditional logic in tests.
- **Network Interactions**: For asserting on API calls or mocking responses, use Playwright's built-in network interception capabilities (`page.route()`).

## 5. CI/CD Integration

The test suite is configured to run efficiently in a Continuous Integration environment.

- **Parallelism**: Tests run in parallel by default (`fullyParallel: true`).
- **Retries**: Flaky tests are automatically retried up to 2 times when run in CI (`retries: process.env.CI ? 2 : 0`).
- **Reporters**: JUnit XML reports are generated (`test-results/junit.xml`) for easy integration with CI dashboards (like Jenkins, CircleCI, GitHub Actions).
- **Artifacts**: Screenshots, videos, and traces are captured only on failure (`retain-on-failure`) to save storage space while providing essential debugging information when needed.
