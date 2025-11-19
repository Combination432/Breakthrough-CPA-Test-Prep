import { test as setup } from '@playwright/test';

/**
 * Authentication Setup for E2E Tests
 *
 * This file handles authentication state for tests.
 * It logs in once and saves the authentication state to be reused across tests.
 */

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Navigate to login page
  await page.goto('/login');

  // Fill in login credentials
  // Note: In a real scenario, use environment variables for test credentials
  const testEmail = process.env.TEST_USER_EMAIL || 'test@example.com';
  const testPassword = process.env.TEST_USER_PASSWORD || 'password123';

  // Fill login form
  await page.fill('input[name="email"]', testEmail);
  await page.fill('input[name="password"]', testPassword);

  // Click sign in button
  await page.click('button[type="submit"]:has-text("Sign In")');

  // Wait for redirect to home page or study page
  await page.waitForURL(/\/(study)?$/, { timeout: 10000 });

  // Verify we're logged in by checking for sign out button
  await page.waitForSelector('button:has-text("Sign Out"), form:has(button:has-text("Sign Out"))', { timeout: 5000 });

  // Save authentication state
  await page.context().storageState({ path: authFile });
});
