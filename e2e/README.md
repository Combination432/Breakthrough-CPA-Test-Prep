# E2E Tests for CPA Test Prep Platform

## Overview

This directory contains end-to-end tests using Playwright to verify the functionality of the TBS (Task-Based Simulation) engine and other features.

## Prerequisites

1. **Node.js** installed (v18+)
2. **Dependencies** installed: `npm install`
3. **Playwright** installed: Already included in devDependencies
4. **Test user account** in Supabase (for authentication tests)

## Running Tests

### Run all tests
```bash
npm run test:e2e
```

### Run tests in headed mode (see browser)
```bash
npx playwright test --headed
```

### Run specific test file
```bash
npx playwright test e2e/tbs-engine.spec.ts
```

### Run tests in debug mode
```bash
npx playwright test --debug
```

### View test report
```bash
npx playwright show-report
```

## Test Suites

### TBS Engine Tests (`tbs-engine.spec.ts`)

Tests the Task-Based Simulation interface:

1. **Layout Test**: Verifies split-screen layout renders correctly
2. **Tab Navigation Test**: Tests switching between exhibit tabs
3. **Spreadsheet Interaction Test**: Tests editing cells in the grid
4. **Submit Answer Test**: Tests answer validation and feedback
5. **Reset Functionality Test**: Tests clearing user input
6. **Panel Resizing Test**: Tests drag-to-resize functionality
7. **Complete Workflow Test**: End-to-end user flow

## Test Environment

The tests run against `http://localhost:3000` by default.

Playwright will automatically:
- Start the dev server (`npm run dev`)
- Run tests
- Stop the dev server

## Authentication

For tests that require authentication:

1. Create a test user in Supabase
2. Set environment variables:
   ```bash
   TEST_USER_EMAIL=test@example.com
   TEST_USER_PASSWORD=your-password
   ```

Or create a `.env.test` file with these variables.

## Troubleshooting

### Tests fail with "Element not found"
- The page may not have loaded fully. Check `timeout` values in tests.
- Selectors may need adjustment based on actual rendered HTML.

### Authentication fails
- Verify test credentials are correct in Supabase
- Check that Supabase environment variables are set in `.env.local`

### Dev server doesn't start
- Ensure port 3000 is available
- Check for errors in `npm run dev`

## Writing New Tests

Create new test files in the `e2e/` directory:

```typescript
import { test, expect } from '@playwright/test';

test.describe('My Feature', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/my-page');
    await expect(page.locator('text=Hello')).toBeVisible();
  });
});
```

## CI/CD Integration

Tests are configured to run in CI with:
- Retry on failure (2 retries)
- Single worker (sequential execution)
- HTML report generation

## Best Practices

1. **Use data-testid attributes** for stable selectors
2. **Wait for elements** before interacting
3. **Clean up state** in `beforeEach`/`afterEach`
4. **Use descriptive test names**
5. **Group related tests** in `describe` blocks
