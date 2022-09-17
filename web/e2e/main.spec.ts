import { test, expect } from '@playwright/test'
import { MainPage } from './main-page'

test('basic test', async ({ page, baseURL }) => {
  const mainPage = new MainPage(page)
  await page.goto(baseURL)

  await expect(mainPage.searchBox).toBeVisible()
  await expect(await mainPage.chips.count()).toBe(3)
  await expect(await mainPage.selectedChips.count()).toBe(1)
  await expect(mainPage.selectedChips).toHaveText('Flibusta')
})

test('FLIBUSTA', async ({ page, baseURL }) => {
  const mainPage = new MainPage(page)

  await page.goto(baseURL)

  await mainPage.mockFlibustaResponse()

  await mainPage.search('Harry Potter')

  expect(mainPage.url.searchParams.get('searchTerm')).toBe('Harry Potter')

  await mainPage.checkFlibustaItems()
  await mainPage.clear.click()

  await expect(mainPage.listitems).not.toBeVisible()
})

test.describe('ZLIB', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(baseURL)
    await page.evaluate(() => {
      localStorage.setItem('zlibauth', 'example-token')
    })
  })

  test('search EPUB', async ({ page, baseURL }) => {
    const mainPage = new MainPage(page)
    await page.goto(baseURL)

    await mainPage.mockZLibResponse()

    await mainPage.selectSource('ZLib')
    await expect(await mainPage.chips.count()).toBe(6)
    await mainPage.search('HP3')

    expect(mainPage.url.searchParams.get('path')).toBe('/s/HP3')
    expect(mainPage.url.searchParams.get('cookie')).toBe('example-token')
    expect(mainPage.url.searchParams.get('extension')).toBe('epub')
    expect(mainPage.url.searchParams.get('host')).toBe('zlib.cc')

    await mainPage.checkZLibItems()
    await mainPage.clear.click()

    await expect(mainPage.listitems).not.toBeVisible()
  })

  test('search PDF', async ({ page, baseURL }) => {
    const mainPage = new MainPage(page)
    await page.goto(baseURL)

    await mainPage.mockZLibResponse()

    await mainPage.selectSource('ZLib')
    await mainPage.selectExt('PDF')

    await mainPage.search('HP5')

    expect(mainPage.url.searchParams.get('path')).toBe('/s/HP5')
    expect(mainPage.url.searchParams.get('extension')).toBe('pdf')

    await mainPage.checkZLibItems()
    await mainPage.clear.click()

    await expect(mainPage.listitems).not.toBeVisible()
  })

  test('search FB2', async ({ page, baseURL }) => {
    const mainPage = new MainPage(page)
    await page.goto(baseURL)

    await mainPage.mockZLibResponse()

    await mainPage.selectSource('ZLib')
    await mainPage.selectExt('FB2')

    await mainPage.search('HP7')

    expect(mainPage.url.searchParams.get('path')).toBe('/s/HP7')
    expect(mainPage.url.searchParams.get('extension')).toBe('fb2')

    await mainPage.checkZLibItems()
    await mainPage.clear.click()

    await expect(mainPage.listitems).not.toBeVisible()
  })
})
