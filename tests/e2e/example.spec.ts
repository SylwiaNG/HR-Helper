import { test, expect } from '@playwright/test'

/**
 * Przykładowy test E2E - sprawdzenie czy strona logowania się ładuje
 * 
 * To jest szablon - usuń ten plik gdy utworzysz prawdziwe testy
 */
test.describe('Example E2E Test', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('/')
    
    // Sprawdź czy strona się załadowała
    await expect(page).toHaveURL(/\/login/)
    
    // Sprawdź czy formularz logowania jest widoczny
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible()
  })
})
