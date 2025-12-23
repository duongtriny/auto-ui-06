import { test, expect, Page, Locator } from "@playwright/test";

test(`Verify modal`, async ({ page }) => {
    // Go to page Switch
    await page.goto("https://test-with-me-app.vercel.app/learning/web-elements/components/modal");
    await selectButtonOnModal('Show Confirm', 'Are you sure delete this task?', 'Yes', page);
    await expect(page.getByText('Status: OK')).toBeVisible();
})

async function selectButtonOnModal(modalButtonName: string, modalName: string, action: string, page: Page) {
    let modalButtonXpath = `//button[normalize-space(.)="${modalButtonName}"]`;
    await page.locator(modalButtonXpath).click();
    let modalXpath = `//div[.//span[normalize-space()="${modalName}" and contains(concat(' ',normalize-space(@class),' '),' ant-modal-confirm-title ')] and @role="dialog"]`;
    let modalLocator = page.locator(modalXpath);
    let actionButtonXpath = `//button[normalize-space(.)="${action}"]`;
    await modalLocator.locator(actionButtonXpath).click();
}