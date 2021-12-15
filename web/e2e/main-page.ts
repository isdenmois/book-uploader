import { URL } from 'url'
import { expect, Page, Route } from '@playwright/test'

const REWRITE_API = new RegExp('/api/rewrite((?!.jpg).)*$', 'i')

export class MainPage {
  searchBox = this.page.locator('[role="searchbox"]')
  chips = this.page.locator('.chip')
  selectedChips = this.page.locator('.chip.selected')
  spinner = this.page.locator('[role="progressbar"]')
  listitems = this.page.locator('[role="listitem"]')
  clear = this.page.locator('[data-testid="clear"]')

  private route: Route
  url: URL

  private fulfill: () => Promise<void>

  constructor(private page: Page) {}

  async search(text: string) {
    await this.searchBox.fill(text)
    await this.page.keyboard.press('Enter')

    await expect(this.spinner).toBeVisible()
    await expect(this.searchBox).toBeDisabled()

    await this.fulfill()

    await expect(this.spinner).not.toBeVisible()
    await expect(this.searchBox).not.toBeDisabled()
  }

  async mockFlibustaResponse() {
    await this.page.route(REWRITE_API, (route, request) => {
      this.route = route
      this.url = new URL(request.url())
    })

    this.fulfill = () =>
      this.route.fulfill({
        body: `
                <entry>
                    <link href="/1.fb2"></link>
                    <author>
                        <name>J. K. Rowling</name>
                    </author>
                    <title>Harry Potter and the Philosopher's Stone</title>
                    <link href="/i/82/605182/cover.jpg" rel="http://opds-spec.org/image" type="image/jpeg" />
                </entry>
                <entry>
                <link href="/2.fb2"></link>
                    <author>
                        <name>J. K. Rowling</name>
                    </author>
                    <title>Гарри Поттер и тайная комната</title>
                    <content>Перевод: Росмун&Язык: Русский& Размер: 1Мб  &</content>
                    </entry>
                    <entry>
                    <author>
                        <name>J. K. Rowling</name>
                    </author>
                </entry>
            `,
      })
  }

  async checkFlibustaItems() {
    await expect(await this.listitems.count()).toBe(2)

    await expect(this.listitems.nth(0).locator('.text-primary')).toHaveText("Harry Potter and the Philosopher's Stone")
    await expect(this.listitems.nth(0).locator(':nth-match(.text-secondary, 1)')).toHaveText('J. K. Rowling')
    await expect(this.listitems.nth(0).locator(':nth-match(.text-secondary, 2)')).not.toBeVisible()

    await expect(this.listitems.nth(1).locator('.text-primary')).toHaveText('Гарри Поттер и тайная комната')
    await expect(this.listitems.nth(1).locator(':nth-match(.text-secondary, 1)')).toHaveText('J. K. Rowling')
    await expect(this.listitems.nth(1).locator(':nth-match(.text-secondary, 2)')).toHaveText('1Мб, Русский, Росмун')
  }

  async mockZLibResponse() {
    await this.page.route(REWRITE_API, (route, request) => {
      this.route = route
      this.url = new URL(request.url())
    })

    this.fulfill = () =>
      this.route.fulfill({
        body: `
            <body>
                <div id="searchResultBox">
                    <div class="resItemBox">
                        <div class="itemCover">
                            <img class="cover" data-src="/hp.jpg" />
                        </div>
                        <h3 itemprop="name">
                            <a href="/hp3.epub">
                            Harry Potter and the Prisoner of Azkaban
                            </a>
                        </h3>

                        <div class="authors">
                            <a>J. K. Rowling</a>
                            <a>Someone else</a>
                        </div>

                        <div class="property__file">
                            <div class="property_value">EPUB, 10Mb</div>
                        </div>

                        <div class="property_language">
                            Language: English
                        </div>
                    </div>
                </div>
            </body>
            `,
      })
  }

  async checkZLibItems() {
    await expect(await this.listitems.count()).toBe(1)

    await expect(this.listitems.locator('.text-primary')).toHaveText('Harry Potter and the Prisoner of Azkaban')
    await expect(this.listitems.locator(':nth-match(.text-secondary, 1)')).toHaveText('J. K. Rowling; Someone else')
    await expect(this.listitems.locator(':nth-match(.text-secondary, 2)')).toHaveText('10Mb, English')
  }

  async selectSource(source: string) {
    await this.page.click(`text=${source}`)
    await expect(this.selectedChips.nth(0)).toHaveText(source)
  }

  async selectExt(ext: string) {
    await expect(await this.selectedChips.count()).toBe(2)
    await this.page.click(`text=${ext}`)
    await expect(this.selectedChips.nth(1)).toHaveText(ext)
  }
}
