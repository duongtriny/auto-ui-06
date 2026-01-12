import test, { expect, Page } from "@playwright/test";
test(`Verify alert`, async ({ page }) => {
    await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/alerts');
    page.on('dialog', dialog => {
        dialog.accept();
    });
    await clickButtonByLabel('Show Alert', page);
    await page.waitForTimeout(1000);
});

test(`Verify alert prompt`, async ({ page }) => {
    await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/alerts');
    page.on('dialog', dialog => {
        dialog.accept('Test With Me');
    });
    await clickButtonByLabel('Show Prompt', page);
    await expect(page.getByText('Entered value: Test With Me')).toBeVisible();
});


async function clickButtonByLabel(label: string, page: Page) {
    let xpath = `//button[normalize-space()="${label}"]`;
    await page.locator(xpath).click();
}