import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
  });

  test('shows all tool cards', async ({ page }) => {
    await page.goto('/dashboard');
    
    await expect(page.getByText('CV Optimizer')).toBeVisible();
    await expect(page.getByText('Cover Letter Generator')).toBeVisible();
    await expect(page.getByText('Email Preparer')).toBeVisible();
    await expect(page.getByText('Interview Coach')).toBeVisible();
  });

  test('navigates to tools', async ({ page }) => {
    await page.goto('/dashboard');
    
    await page.click('text=CV Optimizer');
    await expect(page).toHaveURL('/tools/cv');
    
    await page.goto('/dashboard');
    await page.click('text=Cover Letter Generator');
    await expect(page).toHaveURL('/tools/cover-letter');
    
    await page.goto('/dashboard');
    await page.click('text=Email Preparer');
    await expect(page).toHaveURL('/tools/email');
  });
});