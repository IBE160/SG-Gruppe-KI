// apps/web/playwright.global-setup.ts
require('web-streams-polyfill/polyfill'); // Use require and the direct polyfill module

async function globalSetup() {
  // No need for explicit check if the polyfill is correctly imported
}

export default globalSetup;