import { Page, Locator } from '@playwright/test'

/**
 * Page Object Model for Dashboard Page
 * Represents the main dashboard with job offers list
 */
export class DashboardPage {
  readonly page: Page
  readonly dashboardTitle: Locator
  readonly offersGrid: Locator
  readonly offerCards: Locator
  readonly emptyState: Locator
  readonly userMenu: Locator

  constructor(page: Page) {
    this.page = page
    this.dashboardTitle = page.getByTestId('dashboard-title')
    this.offersGrid = page.getByTestId('offers-grid')
    this.offerCards = page.getByTestId('offer-card')
    this.emptyState = page.getByTestId('empty-state')
    this.userMenu = page.getByTestId('user-menu')
  }

  /**
   * Navigate to dashboard
   */
  async goto() {
    await this.page.goto('/dashboard')
  }

  /**
   * Get offer card by index
   */
  getOfferCard(index: number): Locator {
    return this.offerCards.nth(index)
  }

  /**
   * Get offer title by index
   */
  async getOfferTitle(index: number): Promise<string> {
    const card = this.getOfferCard(index)
    const title = card.getByTestId('offer-title')
    return await title.textContent() || ''
  }

  /**
   * Get offer keywords by index
   */
  async getOfferKeywords(index: number): Promise<string[]> {
    const card = this.getOfferCard(index)
    const keywordBadges = card.getByTestId('keyword-badge')
    const count = await keywordBadges.count()
    const keywords: string[] = []
    
    for (let i = 0; i < count; i++) {
      const text = await keywordBadges.nth(i).textContent()
      if (text) keywords.push(text)
    }
    
    return keywords
  }

  /**
   * Get offer statistics by index
   */
  async getOfferStats(index: number): Promise<{
    total: number
    accepted: number
    rejected: number
  }> {
    const card = this.getOfferCard(index)
    
    const totalText = await card.getByTestId('stat-total').locator('span').last().textContent()
    const acceptedText = await card.getByTestId('stat-accepted').locator('span').last().textContent()
    const rejectedText = await card.getByTestId('stat-rejected').locator('span').last().textContent()
    
    return {
      total: parseInt(totalText || '0'),
      accepted: parseInt(acceptedText || '0'),
      rejected: parseInt(rejectedText || '0'),
    }
  }

  /**
   * Click on offer card to navigate to details
   */
  async clickOffer(index: number) {
    await this.getOfferCard(index).click()
  }

  /**
   * Get number of displayed offers
   */
  async getOffersCount(): Promise<number> {
    return await this.offerCards.count()
  }

  /**
   * Check if dashboard shows empty state
   */
  async isEmptyState(): Promise<boolean> {
    return await this.emptyState.isVisible()
  }

  /**
   * Wait for dashboard to load
   */
  async waitForLoad() {
    await this.dashboardTitle.waitFor()
    await this.offersGrid.waitFor()
  }
}
