import { test, expect } from '@playwright/test';

test.describe('Cover Letter Generator', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
  });

  test('generates a cover letter', async ({ page }) => {
    await page.goto('/tools/cover-letter');
    
    // Fill in the form
    await page.fill('input[name="jobTitle"]', 'Software Engineer');
    await page.fill('input[name="company"]', 'Example Corp');
    await page.fill('textarea[name="keySkills"]', 'React, TypeScript, Node.js');
    await page.fill('textarea[name="experience"]', '5 years of experience');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Check if generated content appears
    await expect(page.locator('text=Generated Content')).toBeVisible();
  });
});