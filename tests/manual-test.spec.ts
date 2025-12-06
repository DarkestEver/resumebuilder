import { test } from '@playwright/test';

test('Manual browser test - keep browser open', async ({ page }) => {
  console.log('\n📱 Opening browser - CHECK MANUALLY\n');
  console.log('Going to: http://localhost:3000/#/pmnancy/lllllllll-1765055239869-aao16i');
  
  await page.goto('http://localhost:3000/#/pmnancy/lllllllll-1765055239869-aao16i');
  
  // Wait and let you see what happens
  await page.waitForTimeout(5000);
  
  console.log('Current URL:', page.url());
  console.log('\n📸 Taking screenshot...');
  await page.screenshot({ path: 'manual-test-result.png', fullPage: true });
  
  console.log('✅ Screenshot saved to: manual-test-result.png');
  console.log('\n⏸️  Keeping browser open for 30 seconds - CHECK IT NOW\n');
  
  await page.waitForTimeout(30000);
});
