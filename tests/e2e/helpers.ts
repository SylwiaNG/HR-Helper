import { Page } from '@playwright/test'
import { cleanupTestUserData } from './teardown'

/**
 * Test utilities and helper functions for E2E tests
 */

/**
 * Login helper for authenticated tests
 * Uses credentials from .env.test
 */
export async function loginAsTestUser(page: Page) {
  const email = process.env.E2E_USERNAME!
  const password = process.env.E2E_PASSWORD!

  if (!email || !password) {
    throw new Error('E2E_USERNAME and E2E_PASSWORD must be set in .env.test')
  }

  await page.goto('/login')
  await page.getByTestId('email-input').fill(email)
  await page.getByTestId('password-input').fill(password)
  await page.getByTestId('submit-button').click()
  
  // Wait for successful navigation
  await page.waitForURL('**/dashboard')
}

/**
 * Clear all data for test user
 * Useful for test cleanup in afterEach or afterAll
 */
export async function clearTestUserData() {
  const userId = process.env.E2E_USERNAME_ID!
  
  if (!userId) {
    throw new Error('E2E_USERNAME_ID must be set in .env.test')
  }
  
  await cleanupTestUserData(userId)
}

/**
 * Wait for Supabase to be ready
 */
export async function waitForSupabase(page: Page) {
  await page.waitForFunction(() => {
    return typeof window !== 'undefined' && (window as any).supabase !== undefined
  })
}

/**
 * Take screenshot with timestamp for debugging
 */
export async function takeDebugScreenshot(page: Page, name: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  await page.screenshot({ 
    path: `test-results/debug-${name}-${timestamp}.png`,
    fullPage: true 
  })
}
