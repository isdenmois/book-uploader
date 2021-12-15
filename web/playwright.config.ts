import { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
  testDir: 'e2e',
  use: {
    trace: 'on-first-retry',
    viewport: { width: 375, height: 812 },
  },
  projects: [
    {
      name: 'chromium',
    },
  ],
  webServer: {
    command: 'npm run serve',
    port: 7777,
  },
  reporter: 'line',
}

export default config
