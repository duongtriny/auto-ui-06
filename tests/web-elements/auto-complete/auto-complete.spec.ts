import test, { expect, Page } from "@playwright/test";


test(`Verify select radio button`, async ({ page }) => {
    await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/components/auto-complete');
    await inputAutoCompleteByLabel('Auto complete', 'Burns Bay Road', page);
    await expect(page.getByText('Value: Burns Bay Road was selected!').first()).toBeVisible();
});

async function inputAutoCompleteByLabel(label: string, value: string, page: Page) {
    let inputXpath = `//div[normalize-space()="${label}"]/following::div[contains(concat(' ',normalize-space(@class),' '),' ant-select-show-search ')][1]//input`;
    await page.locator(inputXpath).fill(value);
    let optionXpath = `//div[contains(concat(' ',normalize-space(@class),' '),' ant-select-item ') and normalize-space()='${value}']`;
    await page.locator(optionXpath).click();
}