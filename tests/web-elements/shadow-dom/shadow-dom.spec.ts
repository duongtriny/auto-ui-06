import test, { expect, Page } from "@playwright/test";
test(`Verify form in shadow DOM`, async ({ page, context }) => {
    await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/shadow-dom');
    let myShadowRoot = page.locator("#my-shadow");
    await myShadowRoot.locator('#name-input').fill('Test With Me');
    await myShadowRoot.locator('#shadow-btn').click();
    await expect(myShadowRoot.getByText('What you just type: Test With Me')).toBeVisible();
});