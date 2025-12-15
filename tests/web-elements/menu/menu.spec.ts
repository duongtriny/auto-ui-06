import test, { expect, Page } from "@playwright/test";


test(`Verify select menu option`, async ({ page }) => {
    await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/components/menu');
    await selectMenuByLabel('My Menu', 'Option 1', page);
    await expect(page.getByText('Current value: setting:1').first()).toBeVisible();
});

async function selectMenuByLabel(label: string, option: string, page: Page) {
    let menuXpath = `//div[@role='menuitem' and normalize-space()="${label}"]`;
    await page.locator(menuXpath).hover();
    let optionXpath = `//li[@role="menuitem" and normalize-space()="${option}"]`;
    await page.locator(optionXpath).click();
}