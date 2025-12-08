import test, { expect, Page } from "@playwright/test";


test(`Verify select dropdown`, async ({ page }) => {
    await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/elements/dropdown');
    await selectDropdownByLabel('Dropdown', '2nd menu item', page);
    await expect(page.getByText('Value: 2nd menu item')).toBeVisible();
});

async function selectDropdownByLabel(label: string, option: string, page: Page) {
    let openDropdownButtonXpath = `(//div[normalize-space()="${label}"]/following::button[contains(concat(' ',normalize-space(@class),' '),' ant-dropdown-trigger ')])[1]`;
    await page.locator(openDropdownButtonXpath).click();
    let dropdownOptionXpath = `//li[normalize-space(.)='${option}']`;
    await page.locator(dropdownOptionXpath).click();
}