import { Page, Locator } from '@playwright/test'

/**
 * Page Object Model for Offer Details Page
 * Represents the detailed view of a single job offer
 */
export class OfferDetailsPage {
  readonly page: Page
  readonly offerDetailsTitle: Locator
  readonly statisticsPanel: Locator
  readonly totalCvsStat: Locator
  readonly acceptedStat: Locator
  readonly rejectedStat: Locator
  readonly cvListsContainer: Locator

  constructor(page: Page) {
    this.page = page
    this.offerDetailsTitle = page.getByTestId('offer-details-title')
    this.statisticsPanel = page.getByTestId('statistics-panel')
    this.totalCvsStat = page.getByTestId('stat-total-cvs')
    this.acceptedStat = page.getByTestId('stat-accepted')
    this.rejectedStat = page.getByTestId('stat-rejected')
    this.cvListsContainer = page.getByTestId('cv-lists-container')
  }

  /**
   * Navigate to offer details by ID
   */
  async goto(offerId: number | string) {
    await this.page.goto(`/offers/${offerId}`)
  }

  /**
   * Get offer title text
   */
  async getTitle(): Promise<string> {
    return await this.offerDetailsTitle.textContent() || ''
  }

  /**
   * Get statistics values
   */
  async getStats(): Promise<{
    total: number
    accepted: number
    rejected: number
  }> {
    const totalText = await this.totalCvsStat.getByTestId('stat-total-cvs-value').textContent()
    const acceptedText = await this.acceptedStat.getByTestId('stat-accepted-value').textContent()
    const rejectedText = await this.rejectedStat.getByTestId('stat-rejected-value').textContent()
    
    return {
      total: parseInt(totalText || '0'),
      accepted: parseInt(acceptedText || '0'),
      rejected: parseInt(rejectedText || '0'),
    }
  }

  /**
   * Check if statistics panel is visible
   */
  async hasStatistics(): Promise<boolean> {
    return await this.statisticsPanel.isVisible()
  }

  /**
   * Check if CV lists container is visible
   */
  async hasCVLists(): Promise<boolean> {
    return await this.cvListsContainer.isVisible()
  }

  /**
   * Wait for page to load
   */
  async waitForLoad() {
    await this.offerDetailsTitle.waitFor()
    await this.statisticsPanel.waitFor()
  }

  /**
   * Check if page is fully loaded (no loading state)
   */
  async isLoaded(): Promise<boolean> {
    try {
      await this.offerDetailsTitle.waitFor({ timeout: 5000 })
      await this.statisticsPanel.waitFor({ timeout: 5000 })
      return true
    } catch {
      return false
    }
  }
}
