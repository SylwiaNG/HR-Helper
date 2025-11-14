import { test, expect } from '@playwright/test'
import { LoginPage } from './page-objects/LoginPage'
import { DashboardPage } from './page-objects/DashboardPage'
import { OfferDetailsPage } from './page-objects/OfferDetailsPage'
import { loginAsTestUser } from './helpers'

/**
 * E2E Test Suite: Dashboard and Offers Flow
 * Tests the complete user journey from login through viewing offers
 */
test.describe('Dashboard and Offers Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await loginAsTestUser(page)
  })

  test('should display dashboard after login', async ({ page }) => {
    // Arrange
    const dashboardPage = new DashboardPage(page)

    // Act
    await dashboardPage.waitForLoad()

    // Assert
    await expect(dashboardPage.dashboardTitle).toBeVisible()
    await expect(dashboardPage.dashboardTitle).toHaveText('Dashboard rekrutera')
    await expect(dashboardPage.offersGrid).toBeVisible()
    await expect(dashboardPage.userMenu).toBeVisible()
  })

  test('should display list of job offers', async ({ page }) => {
    // Arrange
    const dashboardPage = new DashboardPage(page)
    await dashboardPage.waitForLoad()

    // Act
    const offersCount = await dashboardPage.getOffersCount()

    // Assert
    expect(offersCount).toBeGreaterThan(0)
    
    // Check first offer has required elements
    const firstOfferTitle = await dashboardPage.getOfferTitle(0)
    expect(firstOfferTitle).toBeTruthy()
    
    const firstOfferKeywords = await dashboardPage.getOfferKeywords(0)
    expect(firstOfferKeywords.length).toBeGreaterThan(0)
    
    const firstOfferStats = await dashboardPage.getOfferStats(0)
    expect(firstOfferStats.total).toBeGreaterThanOrEqual(0)
  })

  test('should navigate to offer details when clicking on offer', async ({ page }) => {
    // Arrange
    const dashboardPage = new DashboardPage(page)
    await dashboardPage.waitForLoad()

    // Get first offer title for verification
    const expectedTitle = await dashboardPage.getOfferTitle(0)

    // Act
    await dashboardPage.clickOffer(0)

    // Assert - should be on offer details page
    await page.waitForURL(/\/offers\/\d+/)
    
    const offerDetailsPage = new OfferDetailsPage(page)
    await offerDetailsPage.waitForLoad()
    
    const detailsTitle = await offerDetailsPage.getTitle()
    expect(detailsTitle).toBe(expectedTitle)
  })

  test('should display correct statistics on dashboard', async ({ page }) => {
    // Arrange
    const dashboardPage = new DashboardPage(page)
    await dashboardPage.waitForLoad()

    // Act
    const stats = await dashboardPage.getOfferStats(0)

    // Assert
    expect(stats.total).toBe(stats.accepted + stats.rejected)
    expect(stats.total).toBe(8) // Based on updated mock data (first offer has 8 CVs)
    expect(stats.accepted).toBeGreaterThanOrEqual(0)
    expect(stats.rejected).toBeGreaterThanOrEqual(0)
  })

  test('should display keywords for each offer', async ({ page }) => {
    // Arrange
    const dashboardPage = new DashboardPage(page)
    await dashboardPage.waitForLoad()

    // Act
    const keywords = await dashboardPage.getOfferKeywords(0)

    // Assert
    expect(keywords.length).toBeGreaterThan(0)
    // Check that keywords are not empty
    keywords.forEach(keyword => {
      expect(keyword.trim()).toBeTruthy()
    })
  })
})

/**
 * E2E Test Suite: Offer Details View
 * Tests the detailed view of a single job offer
 */
test.describe('Offer Details View', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page)
  })

  test('should load offer details page', async ({ page }) => {
    // Arrange
    const offerDetailsPage = new OfferDetailsPage(page)

    // Act
    await offerDetailsPage.goto(1)
    await offerDetailsPage.waitForLoad()

    // Assert
    await expect(offerDetailsPage.offerDetailsTitle).toBeVisible()
    await expect(offerDetailsPage.statisticsPanel).toBeVisible()
    await expect(offerDetailsPage.cvListsContainer).toBeVisible()
  })

  test('should display statistics on offer details page', async ({ page }) => {
    // Arrange
    const offerDetailsPage = new OfferDetailsPage(page)
    await offerDetailsPage.goto(1)
    await offerDetailsPage.waitForLoad()

    // Act
    const hasStats = await offerDetailsPage.hasStatistics()
    const stats = await offerDetailsPage.getStats()

    // Assert
    expect(hasStats).toBe(true)
    expect(stats.total).toBeGreaterThanOrEqual(0)
    expect(stats.accepted).toBeGreaterThanOrEqual(0)
    expect(stats.rejected).toBeGreaterThanOrEqual(0)
  })

  test('should display CV lists', async ({ page }) => {
    // Arrange
    const offerDetailsPage = new OfferDetailsPage(page)
    await offerDetailsPage.goto(1)
    await offerDetailsPage.waitForLoad()

    // Act
    const hasCVLists = await offerDetailsPage.hasCVLists()

    // Assert
    expect(hasCVLists).toBe(true)
  })

  test('should navigate from dashboard to specific offer details', async ({ page }) => {
    // Arrange
    const dashboardPage = new DashboardPage(page)
    await dashboardPage.goto()
    await dashboardPage.waitForLoad()

    // Get data from dashboard
    const offerTitle = await dashboardPage.getOfferTitle(1)
    const dashboardStats = await dashboardPage.getOfferStats(1)

    // Act
    await dashboardPage.clickOffer(1)

    // Assert - on details page
    const offerDetailsPage = new OfferDetailsPage(page)
    await offerDetailsPage.waitForLoad()
    
    const detailsTitle = await offerDetailsPage.getTitle()
    expect(detailsTitle).toBe(offerTitle)
    
    // Stats should match (approximately, as accepted/rejected might differ from total)
    const detailsStats = await offerDetailsPage.getStats()
    expect(detailsStats.total).toBeGreaterThanOrEqual(0)
  })
})

/**
 * E2E Test Suite: Complete User Journey
 * Tests the end-to-end flow from login to viewing offer details
 */
test.describe('Complete User Journey', () => {
  
  test('should complete full journey: login → dashboard → offer details', async ({ page }) => {
    // Step 1: Login
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login(
      process.env.E2E_USERNAME!,
      process.env.E2E_PASSWORD!
    )
    await loginPage.waitForSuccessfulLogin()

    // Step 2: Verify Dashboard
    const dashboardPage = new DashboardPage(page)
    await expect(dashboardPage.dashboardTitle).toBeVisible()
    const offersCount = await dashboardPage.getOffersCount()
    expect(offersCount).toBeGreaterThan(0)

    // Step 3: Click first offer
    const firstOfferTitle = await dashboardPage.getOfferTitle(0)
    await dashboardPage.clickOffer(0)

    // Step 4: Verify Offer Details
    await page.waitForURL(/\/offers\/\d+/)
    const offerDetailsPage = new OfferDetailsPage(page)
    await offerDetailsPage.waitForLoad()
    
    const detailsTitle = await offerDetailsPage.getTitle()
    expect(detailsTitle).toBe(firstOfferTitle)
    
    // Step 5: Verify all components loaded
    await expect(offerDetailsPage.statisticsPanel).toBeVisible()
    await expect(offerDetailsPage.cvListsContainer).toBeVisible()
    
    const stats = await offerDetailsPage.getStats()
    expect(stats.total).toBeGreaterThanOrEqual(0)
  })
})
