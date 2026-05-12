import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const APP_ROOT = '#root';
const DIVIDE = '÷';
const MULTIPLY = '×';

async function openCalculator(page: Page) {
  await page.goto('/');
  await expect(page.locator(APP_ROOT)).toBeVisible();
  await expect(resultText(page)).toBeVisible();
}

async function clickButton(page: Page, label: string) {
  await page.getByRole('button', { name: label, exact: true }).click();
}

async function clickLanguage(page: Page, label: string) {
  await page.getByRole('button', { name: label.toUpperCase(), exact: true }).click();
}

async function captureApp(page: Page, name: string) {
  await expect(page.locator(APP_ROOT)).toHaveScreenshot(name);
}

function resultText(page: Page) {
  return page.getByTestId('result');
}

test.describe('calculator visual states', () => {
  test('renders the default calculator shell', async ({ page }) => {
    await openCalculator(page);

    await captureApp(page, 'calculator-default.png');
  });

  test('shows the divide-by-zero error state', async ({ page }) => {
    await openCalculator(page);

    await clickButton(page, '1');
    await clickButton(page, DIVIDE);
    await clickButton(page, '0');
    await clickButton(page, '=');

    await expect(page.getByText('Cannot divide by zero')).toBeVisible();
    await captureApp(page, 'calculator-divide-by-zero.png');
  });

  test('shows the reciprocal divide-by-zero error state', async ({ page }) => {
    await openCalculator(page);

    await clickButton(page, '0');
    await clickButton(page, '1/x');

    await expect(page.getByText('Cannot divide by zero')).toBeVisible();
    await captureApp(page, 'calculator-reciprocal-error.png');
  });

  test('updates translated error copy when the locale changes', async ({ page }) => {
    await openCalculator(page);

    await clickButton(page, '1');
    await clickButton(page, DIVIDE);
    await clickButton(page, '0');
    await clickButton(page, '=');
    await clickLanguage(page, 'es');

    await expect(page.getByText('No se puede dividir por cero')).toBeVisible();
    await expect(page.getByText('Calculadora')).toBeVisible();
    await captureApp(page, 'calculator-error-es.png');
  });

  test('updates translated error copy in Portuguese', async ({ page }) => {
    await openCalculator(page);

    await clickButton(page, '1');
    await clickButton(page, DIVIDE);
    await clickButton(page, '0');
    await clickButton(page, '=');
    await clickLanguage(page, 'pt');

    await expect(page.getByText('Não é possível dividir por zero')).toBeVisible();
    await expect(page.getByText('Calculadora')).toBeVisible();
    await captureApp(page, 'calculator-error-pt.png');
  });

  test('shows addition with two numbers', async ({ page }) => {
    await openCalculator(page);

    await clickButton(page, '1');
    await clickButton(page, '+');
    await clickButton(page, '2');
    await clickButton(page, '=');

    await expect(resultText(page)).toHaveText('3');
    await captureApp(page, 'calculator-addition.png');
  });

  test('shows subtraction with two numbers', async ({ page }) => {
    await openCalculator(page);

    await clickButton(page, '5');
    await clickButton(page, '-');
    await clickButton(page, '2');
    await clickButton(page, '=');

    await expect(resultText(page)).toHaveText('3');
    await captureApp(page, 'calculator-subtraction.png');
  });

  test('shows multiplication with two numbers', async ({ page }) => {
    await openCalculator(page);

    await clickButton(page, '3');
    await clickButton(page, MULTIPLY);
    await clickButton(page, '4');
    await clickButton(page, '=');

    await expect(resultText(page)).toHaveText('12');
    await captureApp(page, 'calculator-multiplication.png');
  });

  test('shows division with two numbers', async ({ page }) => {
    await openCalculator(page);

    await clickButton(page, '8');
    await clickButton(page, DIVIDE);
    await clickButton(page, '2');
    await clickButton(page, '=');

    await expect(resultText(page)).toHaveText('4');
    await captureApp(page, 'calculator-division.png');
  });
});
