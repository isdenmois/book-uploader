import { test, expect } from '@playwright/test'
import { LoginPage } from './login-page'

test('Invalid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page)

  await loginPage.goto()
  await loginPage.login('a@a.ru', '123456')

  await expect(loginPage.spinner).not.toBeVisible()
  await expect(loginPage.chips).not.toBeVisible()
  await expect(loginPage.email).toBeVisible()
  await expect(loginPage.password).toBeVisible()
  await expect(loginPage.submit).toBeVisible()
})

test('Valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page)

  await loginPage.goto()
  await loginPage.login('a@a.ru', 'password')

  await expect(loginPage.spinner).not.toBeVisible()
  await expect(await loginPage.chips.count()).toBe(5)
  await expect(loginPage.email).not.toBeVisible()
  await expect(loginPage.title).not.toBeVisible()
  await expect(loginPage.submit).not.toBeVisible()
})
