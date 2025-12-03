import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('Email Authentication', () => {
  test('should allow a user to sign up, log out, and log back in', async ({ page }) => {
    const email = faker.internet.email();
    const password = faker.internet.password({ length: 12 });

    // --- Sign Up ---
    await page.goto('/login');

    // Fill sign-up form
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);

    // Click sign-up button
    await page.click('button[type="submit"]:has-text("Sign Up")');

    // Assert redirection to a protected page (e.g., home)
    await expect(page).toHaveURL('/'); 
    await expect(page.locator('h1:has-text("Welcome")')).toBeVisible();

    // --- Log Out ---
    // This assumes a user menu and a logout button. Adjust selectors as needed.
    await page.click('[data-testid="user-menu"]'); 
    await page.click('button:has-text("Log Out")');
    
    // Assert redirection to login page
    await expect(page).toHaveURL('/login');
    await expect(page.locator('button:has-text("Log In")')).toBeVisible();

    // --- Log In ---
    // Fill login form
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);

    // Click login button
    await page.click('button[type="submit"]:has-text("Log In")');

    // Assert redirection to a protected page
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1:has-text("Welcome")')).toBeVisible();
  });
});