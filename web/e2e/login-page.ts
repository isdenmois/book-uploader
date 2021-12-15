import { expect, Page, Route } from '@playwright/test'

const REWRITE_API = new RegExp('/api/rewrite((?!.jpg).)*$', 'i')

export class LoginPage {
  title = this.page.locator('h1')
  email = this.page.locator('[placeholder="E-Mail"]')
  password = this.page.locator('[placeholder="Password"]')
  submit = this.page.locator('[type="submit"]')
  spinner = this.page.locator('[role="progressbar"]')
  chips = this.page.locator('.chip')

  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/')
    await this.page.click('text=ZLIB')
    await expect(this.title).toHaveText('Login')
  }

  async login(email: string, password: string) {
    let route: Route

    await this.page.route(REWRITE_API, _route => {
      route = _route
    })

    await this.email.fill(email)
    await this.password.fill(password)
    await this.submit.click()

    await expect(this.email).toBeDisabled()
    await expect(this.password).toBeDisabled()
    await expect(this.submit).not.toBeVisible()
    await expect(this.spinner).toBeVisible()

    await route.fulfill({
      body:
        password === 'password'
          ? '<script language="javascript">parent.location="http://oraora.onion/?key=973&userid=482"</script>'
          : '',
    })
  }
}
