import { test, expect } from '@playwright/test';

/**
 * Integration Test 3: Missing Features Detection
 * Tests: Check which backend features have NO UI implementation
 */

const TEST_USER = {
  email: 'designer.alex@test.com',
  password: 'DesignPass123!',
};

test.describe('Missing Features Audit', () => {
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    // Get auth token for API tests
    const response = await request.post('http://localhost:5000/api/auth/login', {
      data: TEST_USER,
    });
    const data = await response.json();
    authToken = data.data.tokens.accessToken;
  });

  test('AI Features - Check if UI exists', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/.*dashboard.*/);
    
    // Check for AI-related buttons/features
    const aiKeywords = [
      'improve content',
      'enhance',
      'ai',
      'tailor',
      'ats score',
      'optimize',
      'generate',
    ];
    
    const results: any = {
      found: [],
      missing: [],
    };
    
    for (const keyword of aiKeywords) {
      const element = page.locator(`text=/${keyword}/i`).first();
      const exists = await element.isVisible().catch(() => false);
      
      if (exists) {
        results.found.push(keyword);
      } else {
        results.missing.push(keyword);
      }
    }
    
    console.log('🔍 AI Features Check:');
    console.log('  ✅ Found:', results.found.join(', ') || 'none');
    console.log('  ❌ Missing:', results.missing.join(', '));
  });

  test('Payment/Subscription - Check if UI exists', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/.*dashboard.*/);
    
    // Check for payment-related UI
    const paymentKeywords = [
      'upgrade',
      'pricing',
      'subscribe',
      'pro',
      'enterprise',
      'billing',
      'payment',
    ];
    
    const results: any = {
      found: [],
      missing: [],
    };
    
    for (const keyword of paymentKeywords) {
      const element = page.locator(`text=/${keyword}/i`).first();
      const exists = await element.isVisible().catch(() => false);
      
      if (exists) {
        results.found.push(keyword);
      } else {
        results.missing.push(keyword);
      }
    }
    
    console.log('🔍 Payment Features Check:');
    console.log('  ✅ Found:', results.found.join(', ') || 'none');
    console.log('  ❌ Missing:', results.missing.join(', '));
  });

  test('PDF Export - Check if UI exists', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/.*dashboard.*/);
    
    // Check for PDF export UI
    const pdfElement = page.locator('text=/download.*pdf|export.*pdf|pdf/i').first();
    const exists = await pdfElement.isVisible().catch(() => false);
    
    if (exists) {
      console.log('✅ PDF export UI found');
    } else {
      console.log('❌ PDF export UI missing (but backend API exists at /api/resumes/:id/pdf)');
    }
  });

  test('Admin Panel - Check if accessible', async ({ page }) => {
    // Try to access admin panel
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@profilebuilder.com');
    await page.fill('input[type="password"]', 'AdminPass123!');
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/.*dashboard.*|.*admin.*/);
    
    // Try to navigate to admin
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    
    const adminPanel = page.locator('text=/admin|users|statistics|analytics/i').first();
    const exists = await adminPanel.isVisible().catch(() => false);
    
    if (exists) {
      console.log('✅ Admin panel accessible');
      
      // Check for admin features
      const userManagement = await page.locator('text=/user.*management|manage.*users/i').first().isVisible().catch(() => false);
      const analytics = await page.locator('text=/analytics|statistics/i').first().isVisible().catch(() => false);
      
      console.log('  - User Management:', userManagement ? '✅' : '❌');
      console.log('  - Analytics:', analytics ? '✅' : '❌');
    } else {
      console.log('❌ Admin panel not accessible or incomplete');
    }
  });
});

test.describe('Backend API Feature Coverage', () => {
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    const response = await request.post('http://localhost:5000/api/auth/login', {
      data: TEST_USER,
    });
    const data = await response.json();
    authToken = data.data.tokens.accessToken;
  });

  test('AI API - Check all endpoints exist', async ({ request }) => {
    const aiEndpoints = [
      '/api/ai/improve-content',
      '/api/ai/generate-bullets',
      '/api/ai/tailor-job',
      '/api/ai/score-ats',
      '/api/ai/generate-cover-letter',
      '/api/ai/extract-keywords',
    ];
    
    console.log('🔍 Checking AI API endpoints:');
    
    for (const endpoint of aiEndpoints) {
      const response = await request.post(`http://localhost:5000${endpoint}`, {
        headers: { Authorization: `Bearer ${authToken}` },
        data: { text: 'Test content' },
      }).catch(() => null);
      
      if (response && response.status() !== 404) {
        console.log(`  ✅ ${endpoint} - EXISTS (${response.status()})`);
      } else {
        console.log(`  ❌ ${endpoint} - NOT FOUND`);
      }
    }
  });

  test('Payment API - Check endpoints exist', async ({ request }) => {
    const paymentEndpoints = [
      { method: 'POST', path: '/api/payment/subscribe' },
      { method: 'GET', path: '/api/payment/subscription' },
      { method: 'POST', path: '/api/payment/cancel' },
      { method: 'GET', path: '/api/payment/plans' },
    ];
    
    console.log('🔍 Checking Payment API endpoints:');
    
    for (const endpoint of paymentEndpoints) {
      let response;
      
      if (endpoint.method === 'GET') {
        response = await request.get(`http://localhost:5000${endpoint.path}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        }).catch(() => null);
      } else {
        response = await request.post(`http://localhost:5000${endpoint.path}`, {
          headers: { Authorization: `Bearer ${authToken}` },
          data: {},
        }).catch(() => null);
      }
      
      if (response && response.status() !== 404) {
        console.log(`  ✅ ${endpoint.method} ${endpoint.path} - EXISTS (${response.status()})`);
      } else {
        console.log(`  ❌ ${endpoint.method} ${endpoint.path} - NOT FOUND`);
      }
    }
  });

  test('Advanced Features API - Check endpoints', async ({ request }) => {
    // Create a test resume first
    const resumeResponse = await request.post('http://localhost:5000/api/resumes', {
      headers: { Authorization: `Bearer ${authToken}` },
      data: {
        title: 'Test Resume for API Check',
        templateId: 'modern',
      },
    });
    
    if (resumeResponse.ok()) {
      const resumeData = await resumeResponse.json();
      const resumeId = resumeData.data.resume._id || resumeData.data._id;
      
      const advancedEndpoints = [
        `/api/advanced/${resumeId}/ats-score`,
        `/api/advanced/${resumeId}/match-job`,
        `/api/advanced/${resumeId}/suggestions`,
        `/api/advanced/${resumeId}/completeness`,
      ];
      
      console.log('🔍 Checking Advanced Features API:');
      
      for (const endpoint of advancedEndpoints) {
        const response = await request.get(`http://localhost:5000${endpoint}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        }).catch(() => null);
        
        if (response && response.status() !== 404) {
          console.log(`  ✅ ${endpoint} - EXISTS (${response.status()})`);
        } else {
          console.log(`  ❌ ${endpoint} - NOT FOUND`);
        }
      }
    } else {
      console.log('⚠️  Could not create test resume for advanced features check');
    }
  });
});
