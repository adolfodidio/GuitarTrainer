const { test, expect } = require('@playwright/test');

test('Caricamento Trainer Intervalli e bottoni quiz', async ({ page }) => {
  // Naviga alla pagina del Trainer Intervalli
  await page.goto('/TrainerIntervalli.html');

  // Verifica che il titolo sia corretto
  await expect(page).toHaveTitle(/Trainer Intervalli/);

  // Verifica che il container delle opzioni sia visibile
  const optionsContainer = page.locator('#options-container');
  await expect(optionsContainer).toBeVisible();
  
  // Verifica che siano stati generati esattamente 6 bottoni
  const buttons = page.locator('.quiz-opt-btn');
  await expect(buttons).toHaveCount(6);

  // Clicca sul primo bottone e verifica che appaia il feedback
  const firstButton = buttons.nth(0);
  await firstButton.click();

  const nextButton = page.locator('#btn-next-q');
  await expect(nextButton).not.toHaveClass(/hidden/);
  await expect(nextButton).toBeVisible();
});
