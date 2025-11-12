import { Page, Locator } from '@playwright/test'

/**
 * Page Object Model for Login Page
 * Encapsulates login page elements and actions
 */
export class LoginPage {
  readonly page: Page
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator
  readonly errorMessage: Locator

  constructor(page: Page) {
    this.page = page
    // Using data-testid for resilient selectors
    this.emailInput = page.getByTestId('email-input')
    this.passwordInput = page.getByTestId('password-input')
    this.submitButton = page.getByTestId('submit-button')
    this.errorMessage = page.getByTestId('error-message')
  }

  /**
   * Navigate to login page
   */
  async goto() {
    await this.page.goto('/login')
  }

  /**
   * Perform login action
   * @param email - User email
   * @param password - User password
   */
  async login(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }

  /**
   * Wait for successful navigation after login
   */
  async waitForSuccessfulLogin() {
    await this.page.waitForURL('/dashboard')
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || ''
  }
}
