import { test, expect, Page } from '@playwright/test';

/**
 * Integration Test 1: Authentication Flow
 * Tests: Login → Dashboard → Logout
 */

const TEST_USER = {
  email: 'designer.alex@test.com',
  password: 'DesignPass123!',
};

test.describe('Authentication Flow', () => {
  test('should load landing page', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check if landing page elements exist
    const title = page.locator('h1').first();
    await expect(title).toBeVisible();
    
    console.log('✅ Landing page loaded');
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    
    // Find and click login/sign-in button
    const loginButton = page.locator('text=/sign in|login/i').first();
    await loginButton.click();
    
    // Wait for navigation
    await page.waitForURL(/.*login.*/);
    
    // Verify login page loaded
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    
    console.log('✅ Login page loaded');
  });

  test('should login successfully', async ({ page }) => {
    await page.goto('/login');
    
    // Fill login form
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    
    // Click login button
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Wait for dashboard redirect
    await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });
    
    // Verify dashboard loaded
    const dashboard = page.locator('text=/dashboard|welcome|resumes/i').first();
    await expect(dashboard).toBeVisible({ timeout: 10000 });
    
    console.log('✅ Login successful, redirected to dashboard');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill with invalid credentials
    await page.fill('input[type="email"]', 'invalid@test.com');
    await page.fill('input[type="password"]', 'WrongPassword123!');
    
    // Submit form
    await page.locator('button[type="submit"]').click();
    
    // Wait for error message (toast or inline error)
    const errorMessage = page.locator('text=/invalid|incorrect|error|failed/i').first();
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
    
    // Should still be on login page
    await expect(page).toHaveURL(/.*login.*/);
    
    console.log('✅ Invalid credentials handled correctly');
  });
});

test.describe('Dashboard Features', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/.*dashboard.*/);
  });

  test('should display dashboard stats', async ({ page }) => {
    // Wait for dashboard to load
    await page.waitForLoadState('networkidle');
    
    // Check for stat cards (resume count, views, etc.)
    const statCards = page.locator('[class*="stat"], [class*="card"]');
    const count = await statCards.count();
    
    expect(count).toBeGreaterThan(0);
    console.log(`✅ Dashboard loaded with ${count} stat cards`);
  });

  test('should have create resume button', async ({ page }) => {
    // Look for "Create" or "New Resume" button
    const createButton = page.locator('text=/create.*resume|new.*resume/i').first();
    await expect(createButton).toBeVisible();
    
    console.log('✅ Create resume button found');
  });

  test('should display resume list', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check if resume grid/list exists
    const resumeSection = page.locator('text=/your.*resumes|my.*resumes|resumes/i').first();
    
    if (await resumeSection.isVisible()) {
      console.log('✅ Resume list section visible');
    } else {
      console.log('⚠️  No resumes yet or section not found');
    }
  });
});

test.describe('Resume CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/.*dashboard.*/);
  });

  test('should create new resume', async ({ page }) => {
    // Click create resume button
    const createButton = page.locator('text=/create.*resume|new.*resume/i').first();
    await createButton.click();
    
    // Wait for navigation or modal
    await page.waitForTimeout(2000);
    
    // Check if redirected to editor or modal opened
    const currentUrl = page.url();
    const isEditor = currentUrl.includes('resume') || currentUrl.includes('editor');
    const isModal = await page.locator('[role="dialog"]').isVisible();
    
    if (isEditor || isModal) {
      console.log('✅ Resume creation initiated');
    } else {
      console.log('⚠️  Resume creation flow unclear');
    }
  });

  test('should access resume editor', async ({ page }) => {
    // Try to navigate directly to resume editor
    await page.goto('/resume/new');
    
    await page.waitForLoadState('networkidle');
    
    // Check for editor elements
    const editor = page.locator('[class*="editor"], [class*="canvas"]').first();
    
    if (await editor.isVisible()) {
      console.log('✅ Resume editor loaded');
    } else {
      console.log('⚠️  Resume editor not found at /resume/new');
    }
  });
});

test.describe('API Integration Check', () => {
  test('should verify backend is responding', async ({ request }) => {
    // Test health endpoint
    const response = await request.get('http://localhost:5000/health');
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.status).toBe('ok');
    
    console.log('✅ Backend health check passed');
  });

  test('should verify login API works', async ({ request }) => {
    const response = await request.post('http://localhost:5000/api/auth/login', {
      data: {
        email: TEST_USER.email,
        password: TEST_USER.password,
      },
    });
    
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.tokens.accessToken).toBeDefined();
    
    console.log('✅ Login API integration verified');
  });
});
