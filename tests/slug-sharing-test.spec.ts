import { test, expect } from '@playwright/test';

test.describe('Resume Slug Sharing', () => {
  test('should create resume with slug and share via /#/username/slug', async ({ page, context }) => {
    // Step 1: Login
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', 'pm.nancy@test.com');
    await page.fill('input[type="password"]', 'OtherPass123!');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
    console.log('✓ Login successful');

    // Step 2: Navigate to Resume Builder
    await page.goto('http://localhost:3000/resume');
    await page.waitForLoadState('networkidle');
    console.log('✓ Navigated to resume builder');

    // Step 3: Create new resume
    const createButton = page.locator('button:has-text("Create New Resume")').first();
    await createButton.click();
    console.log('✓ Clicked create new resume');

    // Step 4: Fill in resume details
    await page.waitForSelector('input[placeholder*="Resume"]', { timeout: 5000 });
    const resumeNameInput = page.locator('input[placeholder*="Resume"]').first();
    await resumeNameInput.fill('Test Portfolio');
    console.log('✓ Filled resume name');

    // Look for slug input
    const slugInputs = await page.locator('input').all();
    let slugInput = null;
    for (const input of slugInputs) {
      const placeholder = await input.getAttribute('placeholder');
      if (placeholder?.toLowerCase().includes('slug') || placeholder?.toLowerCase().includes('url')) {
        slugInput = input;
        break;
      }
    }

    if (slugInput) {
      await slugInput.fill('test-portfolio-slug');
      console.log('✓ Filled custom slug');
    } else {
      console.log('⚠ Custom slug input not found');
    }

    // Step 5: Select a template
    const templateCards = page.locator('[class*="cursor-pointer"]').filter({ hasText: 'Modern' }).or(
      page.locator('button:has-text("Modern")')
    ).first();
    await templateCards.click();
    console.log('✓ Selected template');

    // Step 6: Create resume
    await page.waitForTimeout(500);
    const createFinalButton = page.locator('button:has-text("Create")').last();
    await createFinalButton.click();
    console.log('✓ Clicked create button');

    // Wait for resume to be created
    await page.waitForTimeout(3000);

    // Step 7: Go back to resume list
    await page.goto('http://localhost:3000/resume');
    await page.waitForLoadState('networkidle');
    console.log('✓ Back to resume list');

    // Step 8: Find the share button and get the link
    await page.waitForTimeout(2000);
    
    // Hover over the resume card to reveal share button
    const resumeCard = page.locator('div:has-text("Test Portfolio")').first();
    await resumeCard.hover();
    console.log('✓ Hovered over resume card');

    // Look for share button
    await page.waitForTimeout(500);
    const shareButton = page.locator('button[title*="Copy link"], button[title*="share"]').first();
    
    if (await shareButton.isVisible({ timeout: 5000 })) {
      await shareButton.click();
      console.log('✓ Clicked share button');
      await page.waitForTimeout(1000);
    } else {
      console.log('⚠ Share button not visible, checking page structure...');
      // Debug: Take screenshot
      await page.screenshot({ path: 'debug-resume-page.png', fullPage: true });
      console.log('Screenshot saved to debug-resume-page.png');
    }

    // Step 9: Get the clipboard content (the shared link)
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    console.log('Clipboard content:', clipboardText);

    // Verify the link format
    expect(clipboardText).toMatch(/\/#\/.+\/.+/);
    console.log('✓ Link format is correct (/#/username/slug)');

    // Step 10: Open the link in a new page (simulate sharing)
    const newPage = await context.newPage();
    await newPage.goto(clipboardText);
    console.log('✓ Opened shared link in new tab');

    // Step 11: Verify public resume page loads
    await newPage.waitForLoadState('networkidle', { timeout: 10000 });
    
    // Check if we're on the public-resume page
    const currentUrl = newPage.url();
    console.log('Current URL:', currentUrl);
    
    // Should be redirected to /public-resume?username=...&slug=...
    expect(currentUrl).toContain('public-resume');
    console.log('✓ Redirected to public resume page');

    // Step 12: Verify the resume content is visible
    await expect(newPage.locator('text=Test Portfolio')).toBeVisible({ timeout: 10000 });
    console.log('✓ Resume content loaded');

    // Step 13: Verify no login redirect happened
    expect(currentUrl).not.toContain('login');
    console.log('✓ No login redirect (page is truly public)');

    // Step 14: Check for view count
    const viewCount = newPage.locator('text=/\\d+ views/i');
    await expect(viewCount).toBeVisible({ timeout: 5000 });
    console.log('✓ View count visible');

    await newPage.close();
    console.log('\n✅ ALL TESTS PASSED');
  });

  test('should handle private resume correctly', async ({ page }) => {
    // Test that private resumes show appropriate error
    await page.goto('http://localhost:3000/public-resume?slug=xxxxxxxxxxxxxxxx');
    await page.waitForLoadState('networkidle');

    // Should show "This resume is private" error
    const errorMessage = page.locator('text=/This resume is private/i');
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
    console.log('✓ Private resume shows correct error message');
  });
});
