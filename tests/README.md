# Test Architecture

This directory contains the test framework for the project, built with Playwright.

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Configure Environment**:
    Copy the `.env.example` file to a new file named `.env` and fill in the required environment variables for your local setup.
    ```bash
    cp .env.example .env
    ```

## Running Tests

-   **Run all E2E tests**:
    ```bash
    npm run test:e2e
    ```

-   **Run tests in UI Mode**:
    ```bash
    npx playwright test --ui
    ```

-   **Run tests in Headed Mode**:
    ```bash
    npx playwright test --headed
    ```

-   **View Test Report**:
    ```bash
    npx playwright show-report test-results/html
    ```

## Architecture

-   **`tests/e2e`**: Contains all end-to-end test files.
-   **`tests/support`**: Contains all testing infrastructure.
    -   **`fixtures`**: Manages test data setup and teardown. The `userFactory` is a key example, providing isolated user data for each test and cleaning up automatically.
    -   **`helpers`**: For reusable utility functions (e.g., authentication helpers, date formatters).
    -   **`page-objects`**: Optional directory for implementing the Page Object Model pattern.

## Best Practices

-   **Selectors**: Use `data-testid` attributes for resilient test selectors.
-   **Test Isolation**: Tests should be runnable independently and in any order. Use fixtures to create and clean up isolated test data.
-   **Assertions**: Use explicit assertions with `expect()` to validate application state.
-   **CI/CD**: Tests are configured to run in CI environments, with retries enabled and JUnit/HTML reports generated.
