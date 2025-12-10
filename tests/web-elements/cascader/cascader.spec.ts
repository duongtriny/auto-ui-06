import test, { expect, Page } from "@playwright/test";


test(`Verify cascader`, async ({ page }) => {
    await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/components/cascader');
    // Click on button.
    await selectCascaderByLabel('Cascader', 'Tho>Test>API', page);
    // Verify text
    await expect(page.getByText(`Current value: Tho, Test, API`)).toBeVisible();
});

async function selectCascaderByLabel(label: string, path: string, page: Page) {
    let xpath = `(//div[normalize-space()="${label}"]/following::div[contains(concat(' ',normalize-space(@class),' '),' ant-select-selector ')])[1]`;
    await page.locator(xpath).click();
    for (let item of path.split('>')) {
        let itemXpath = `//li[@role='menuitemcheckbox' and .//div[normalize-space(.)='${item}']]`;
        await page.locator(itemXpath).last().click();
    }
}

test(`Verify cascader multiple values`, async ({ page }) => {
    await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/components/cascader');
    // Click on button.
    await selectCascaderMultipleValuesByLabel('Cascader multiple values', 'Bamboo>Little>Toy Fish-Toy Bird', page);
    // Verify text
    await expect(page.getByText(`Current value: bamboo, little, fishbamboo, little, bird`)).toBeVisible();
});

async function selectCascaderMultipleValuesByLabel(label: string, path: string, page: Page) {
    let xpath = `(//div[normalize-space()="${label}"]/following::div[contains(concat(' ',normalize-space(@class),' '),' ant-select-selector ')])[1]`;
    await page.locator(xpath).click();
    let pathList = path.split('>');
    for (let i = 0; i < pathList.length; i++) {
        if (i != pathList.length - 1) {
            let itemXpath = `//li[@role='menuitemcheckbox' and .//div[normalize-space(.)='${pathList[i]}']]`;
            await page.locator(itemXpath).last().click();
        } else {
            for (let item of pathList[i].split('-')) {
                let itemXpath = `//li[@role='menuitemcheckbox' and .//div[normalize-space(.)='${item}']]`;
                await page.locator(itemXpath).last().click();
            }
        }

    }
}