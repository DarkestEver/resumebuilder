import { test } from '@playwright/test';

test('Debug - extract page text', async ({ page }) => {
  await page.goto('http://localhost:3000/#/pmnancy/lllllllll-1765055239869-aao16i');
  await page.waitForTimeout(5000);
  
  const bodyText = await page.locator('body').textContent();
  console.log('\n========== PAGE CONTENT ==========\n');
  console.log(bodyText);
  console.log('\n==================================\n');
  
  const h1Texts = await page.locator('h1').allTextContents();
  console.log('H1 headings:', h1Texts);
  
  const errors = await page.locator('text=/error|not found|private|failed/i').allTextContents();
  console.log('Error messages:', errors);
});
