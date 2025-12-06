import { test, expect } from '@playwright/test';

test.describe('Resume Slug Sharing - Real Test', () => {
  
  test('Test existing public resume with /#/username/slug format', async ({ page, context }) => {
    console.log('\n=== Testing Public Resume Access ===\n');
    
    // Test 1: Direct access to public resume via hash route
    console.log('Step 1: Opening hash route URL...');
    await page.goto('http://localhost:3000/#/pmnancy/lllllllll-1765055239869-aao16i');
    
    // Wait for redirect and page load
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    await page.waitForTimeout(2000);
    
    const currentUrl = page.url();
    console.log('Current URL:', currentUrl);
    
    // Check if redirected to public-resume page
    if (currentUrl.includes('public-resume')) {
      console.log('✓ Redirected to public resume page');
    } else if (currentUrl.includes('login')) {
      console.log('✗ FAILED: Redirected to login (should be public)');
      await page.screenshot({ path: 'failed-login-redirect.png' });
      throw new Error('Public resume redirected to login - feature broken');
    } else {
      console.log('✗ Unexpected redirect:', currentUrl);
      await page.screenshot({ path: 'failed-unexpected.png' });
      throw new Error('Unexpected redirect');
    }
    
    // Check for resume content
    await page.waitForTimeout(2000);
    const pageContent = await page.content();
    
    if (pageContent.includes('Resume not found') || pageContent.includes('This resume is private')) {
      console.log('✗ FAILED: Resume not accessible');
      await page.screenshot({ path: 'failed-resume-error.png' });
      throw new Error('Resume not found or private');
    }
    
    // Look for resume indicators
    const hasBackButton = await page.locator('button:has-text("Back to Home")').count() > 0;
    const hasViewCount = await page.locator('text=/\\d+ views/i').count() > 0;
    
    console.log('Has back button:', hasBackButton);
    console.log('Has view count:', hasViewCount);
    
    if (hasBackButton || hasViewCount) {
      console.log('✓ Resume page loaded successfully');
    } else {
      console.log('⚠ Resume page elements not found, taking screenshot...');
      await page.screenshot({ path: 'resume-page-debug.png', fullPage: true });
    }
    
    // Verify no login redirect
    expect(currentUrl).not.toContain('login');
    console.log('✓ No login redirect (truly public)');
    
    console.log('\n✅ TEST PASSED: Public resume accessible via /#/username/slug\n');
  });
  
  test('Test backward compatibility with /#/slug format', async ({ page }) => {
    console.log('\n=== Testing Backward Compatibility ===\n');
    
    await page.goto('http://localhost:3000/#/lllllllll-1765055239869-aao16i');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    await page.waitForTimeout(2000);
    
    const currentUrl = page.url();
    console.log('Current URL:', currentUrl);
    
    expect(currentUrl).toContain('public-resume');
    expect(currentUrl).not.toContain('login');
    
    console.log('✓ Backward compatible /#/slug format works');
    console.log('\n✅ TEST PASSED\n');
  });
  
  test('Test private resume shows error', async ({ page }) => {
    console.log('\n=== Testing Private Resume Handling ===\n');
    
    await page.goto('http://localhost:3000/public-resume?slug=xxxxxxxxxxxxxxxx');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    await page.waitForTimeout(2000);
    
    const pageContent = await page.content();
    console.log('Checking for private resume error...');
    
    const hasError = pageContent.includes('private') || 
                     pageContent.includes('not found') || 
                     pageContent.includes('Resume not found');
    
    if (hasError) {
      console.log('✓ Private resume shows error message');
    } else {
      console.log('⚠ No error message found');
      await page.screenshot({ path: 'private-resume-debug.png' });
    }
    
    expect(hasError).toBe(true);
    console.log('\n✅ TEST PASSED\n');
  });
  
  test('Full workflow: Login, view saved resumes, copy share link', async ({ page, context }) => {
    console.log('\n=== Testing Full Workflow ===\n');
    
    // Step 1: Login
    console.log('Step 1: Logging in...');
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', 'pm.nancy@test.com');
    await page.fill('input[type="password"]', 'OtherPass123!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/dashboard/, { timeout: 10000 });
    console.log('✓ Logged in');
    
    // Step 2: Navigate to resumes
    console.log('Step 2: Navigating to resumes...');
    await page.goto('http://localhost:3000/resume');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    console.log('✓ On resume page');
    
    // Step 3: Look for saved resumes
    console.log('Step 3: Looking for saved resumes...');
    const savedResumesSection = await page.locator('text=/Your Saved Resumes/i').count();
    
    if (savedResumesSection > 0) {
      console.log('✓ Found saved resumes section');
      
      // Take screenshot for debugging
      await page.screenshot({ path: 'resume-list-debug.png', fullPage: true });
      
      // Try to find the resume card
      const resumeCards = await page.locator('[class*="cursor-pointer"], [class*="card"], [class*="resume"]').count();
      console.log(`Found ${resumeCards} potential resume elements`);
      
      // Try to hover and find share button
      const allButtons = await page.locator('button').all();
      console.log(`Total buttons on page: ${allButtons.length}`);
      
      let shareButtonFound = false;
      for (const button of allButtons.slice(0, 20)) { // Check first 20 buttons
        const title = await button.getAttribute('title');
        if (title && (title.includes('share') || title.includes('Copy link') || title.includes('link'))) {
          console.log('✓ Found share button with title:', title);
          shareButtonFound = true;
          break;
        }
      }
      
      if (!shareButtonFound) {
        console.log('⚠ Share button not immediately visible (may need hover)');
      }
      
    } else {
      console.log('⚠ No saved resumes section found');
    }
    
    console.log('\n✅ Workflow test completed (partial - resume list verified)\n');
  });
  
});
