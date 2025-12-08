import test, { expect, Page } from "@playwright/test";


test(`Verify select radio button`, async ({ page }) => {
    await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/elements/radio');
    await selectRadioByLabel('Radio button', 'Orange', page);
    await expect(page.getByText('Value: Orange').first()).toBeVisible();
});

async function selectRadioByLabel(label: string, option: string, page: Page) {
    let xpath = `(//div[.//span[normalize-space(text())="${label}"] and @role="separator"]/following::div[contains(concat(' ',normalize-space(@class),' '),' ant-radio-group ')])[1]//label[normalize-space(.)='${option}']`;
    await page.locator(xpath).click();
}