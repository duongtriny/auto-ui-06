import { test, expect, Page, Locator } from "@playwright/test";

test(`Verify transfer`, async ({ page }) => {
    // Go to page Switch
    await page.goto("https://test-with-me-app.vercel.app/learning/web-elements/components/transfer");
    await veryTransferItemsByLabel('Transfer', ['Apple', 'Banana'], 'right', page);
    await veryTransferItemsByLabel('Transfer', ['Orange', 'Pineapple'], 'left', page);
})

async function veryTransferItemsByLabel(label: string, items: string[], direction: 'left' | 'right', page: Page) {
    // get source items
    let sourcePanelXpath = `(//div[.//span[normalize-space(text())="${label}"] and @role="separator"]//following::div[.//span[normalize-space()='Source'] and contains(concat(' ',normalize-space(@class),' '),' ant-transfer-list ')])[1]`;
    let sourcePanelLocator = page.locator(sourcePanelXpath);
    let sourceItemsSelector = '.ant-transfer-list-content-item';
    let sourceItems = await sourcePanelLocator.locator(sourceItemsSelector).allTextContents();
    let targetPanelXpath = `(//div[.//span[normalize-space(text())="${label}"] and @role="separator"]//following::div[.//span[normalize-space()='Target'] and contains(concat(' ',normalize-space(@class),' '),' ant-transfer-list ')])[1]`;
    let targetPanelLocator = page.locator(targetPanelXpath);
    let targetItems = await targetPanelLocator.locator(sourceItemsSelector).allTextContents();
    // move items from source to target
    if (direction == 'right') {
        await moveItems(sourcePanelLocator, items);
    } else {
        await moveItems(targetPanelLocator, items);
    }
    let moveButtonXpath = `//div[contains(concat(' ',normalize-space(@class),' '),' ant-transfer-operation ')]//button[.//span[@aria-label="${direction}"]]`;
    await page.locator(moveButtonXpath).click();

    // Verify
    let sourceItemsExpected;
    let targetItemsExpected;
    if (direction == 'right') {
        sourceItemsExpected = sourceItems.filter(v => !items.includes(v));
        targetItemsExpected = [...targetItems, ...items];
    } else {
        targetItemsExpected = targetItems.filter(v => !items.includes(v));
        sourceItemsExpected = [...sourceItems, ...items];
    }

    let sourceItemsActual = await page.locator(sourcePanelXpath).locator(sourceItemsSelector).allTextContents();
    let targetItemsActual = await page.locator(targetPanelXpath).locator(sourceItemsSelector).allTextContents();
    expect(sourceItemsActual).toEqual(expect.arrayContaining(sourceItemsExpected));
    expect(sourceItemsExpected).toEqual(expect.arrayContaining(sourceItemsActual));
    expect(targetItemsActual).toEqual(expect.arrayContaining(targetItemsExpected));
    expect(targetItemsExpected).toEqual(expect.arrayContaining(targetItemsActual));

}


async function moveItems(panel: Locator, items: string[]) {
    for (let item of items) {
        let itemXpath = `//li[normalize-space(.)="${item}"]`;
        await panel.locator(itemXpath).click();
    }
}