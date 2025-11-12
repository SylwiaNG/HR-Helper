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
    
    // Sprawdź czy formularz logowania jest widoczny (polski tekst)
    await expect(page.getByRole('heading', { name: /logowanie/i })).toBeVisible()
    
    // Sprawdź czy pola formularza są obecne
    await expect(page.getByLabel(/adres e-mail/i)).toBeVisible()
    await expect(page.getByLabel(/hasło/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /zaloguj się/i })).toBeVisible()
  })
})
