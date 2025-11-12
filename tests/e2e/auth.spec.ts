import { test, expect } from '@playwright/test'
import { LoginPage } from './page-objects/LoginPage'
import { loginAsTestUser } from './helpers'

/**
 * E2E Test Suite: User Authentication
 * Tests login functionality with valid and invalid credentials
 */
test.describe('User Authentication', () => {
  let loginPage: LoginPage

  // Arrange: Setup before each test
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    await loginPage.goto()
  })

  test('should login successfully with valid credentials', async ({ page }) => {
    // Arrange
    const email = process.env.E2E_USERNAME!
    const password = process.env.E2E_PASSWORD!

    // Act
    await loginPage.login(email, password)

    // Assert
    await expect(page).toHaveURL(/.*dashboard/)
    // Verify user is authenticated by checking for dashboard elements
    await expect(page.getByTestId('user-menu')).toBeVisible()
  })

  test('should show error with invalid credentials', async ({ page }) => {
    // Arrange
    const invalidEmail = 'invalid@example.com'
    const invalidPassword = 'wrongpassword'

    // Act
    await loginPage.login(invalidEmail, invalidPassword)

    // Assert
    // Note: Error handling depends on your implementation
    // This is a placeholder - adjust based on actual error display
    await expect(page).toHaveURL(/.*login/)
  })

  test('should not allow login with empty fields', async ({ page }) => {
    // Act
    await loginPage.submitButton.click()

    // Assert
    // Form validation should prevent submission
    await expect(page).toHaveURL(/.*login/)
  })
})

/**
 * E2E Test: Quick login helper test
 */
test.describe('Login Helper', () => {
  test('should login using helper function', async ({ page }) => {
    // Act
    await loginAsTestUser(page)

    // Assert
    await expect(page).toHaveURL(/.*dashboard/)
    await expect(page.getByTestId('user-menu')).toBeVisible()
  })
})
