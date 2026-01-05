import { test, expect, Page, Locator } from "@playwright/test";

test(`Verify modal`, async ({ page }) => {
    // Go to page Switch
    await page.goto("https://test-with-me-app.vercel.app/learning/web-elements/components/drag-n-drop");
    await verifyDragDropByLabel('Drag n Drop', ['Apple', 'Orange'], 'toRight', page);
    await verifyDragDropByLabel('Drag n Drop', ['Mango', 'Strawberry'], 'toLeft', page);
})

async function verifyDragDropByLabel(label: string, inputs: string[], direction: 'toRight' | 'toLeft', page: Page) {
    let dragDropXpath = `(//div[normalize-space()="${label}" and @role='separator']/following::div[contains(concat(' ',normalize-space(@class),' '),' ant-space ')])[1]`;
    let dragDropLocator = page.locator(dragDropXpath);
    let leftPanelSelector = `.ant-space-item .border-teal-500`;
    let leftPanelLocator = dragDropLocator.locator(leftPanelSelector);
    let rightPanelSelector = `.ant-space-item .border-orange-500`;
    let rightPanelLocator = dragDropLocator.locator(rightPanelSelector);
    let sourceLocator = direction == 'toRight' ? leftPanelLocator : rightPanelLocator;
    let targetLocator = direction == 'toRight' ? rightPanelLocator : leftPanelLocator;
    let currentItemsSource = await getPanelItems(sourceLocator);
    let currentItemsTarget = await getPanelItems(targetLocator);
    for (let input of inputs) {
        let itemXpath = `//button[normalize-space(.)="${input}"]`;
        let itemLocator = sourceLocator.locator(itemXpath);
        await itemLocator.dragTo(targetLocator);
    }
    let expectedSource = currentItemsSource.filter(v => !inputs.includes(v));
    let expectedTarget = [...currentItemsTarget, ...inputs];
    currentItemsSource = await getPanelItems(sourceLocator);
    currentItemsTarget = await getPanelItems(targetLocator);
    expect(currentItemsSource).toEqual(expect.arrayContaining(expectedSource));
    expect(expectedSource).toEqual(expect.arrayContaining(currentItemsSource));
    expect(currentItemsTarget).toEqual(expect.arrayContaining(expectedTarget));
    expect(expectedTarget).toEqual(expect.arrayContaining(currentItemsTarget));
}

async function getPanelItems(panel: Locator) {
    return await panel.locator(`button`).allTextContents();
}