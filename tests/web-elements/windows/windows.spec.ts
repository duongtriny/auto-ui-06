import test, { expect, Page } from "@playwright/test";
test(`Verify new tab`, async ({ page, context }) => {
    await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/windows');
    let pageEvent = context.waitForEvent('page');
    await clickButtonByLabel('Open New Tab', page);
    let newTab = await pageEvent;
    await expect(newTab.getByText('Welcome to Test With Me')).toBeVisible();
    await expect(page.getByText('Open New Tab').first()).toBeVisible();
});

test(`Verify new popup windows`, async ({ page, context }) => {
    await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/windows');
    let pageEvent = page.waitForEvent('popup');
    await clickButtonByLabel('Open New Window', page);
    let popup = await pageEvent;
    await expect(popup.getByText('Welcome to Test With Me')).toBeVisible();
    await expect(page.getByText('Open New Window').first()).toBeVisible();
});

async function clickButtonByLabel(label: string, page: Page) {
    let xpath = `//button[normalize-space()="${label}"]`;
    await page.locator(xpath).click();
}