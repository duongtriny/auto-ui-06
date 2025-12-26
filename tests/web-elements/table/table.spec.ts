import { test, expect, Page } from "@playwright/test";
import { expectedTableData } from "./table-test-data";

test(`Verify table`, async ({ page }) => {
    // Go to page Switch
    await page.goto("https://test-with-me-app.vercel.app/learning/web-elements/components/table");
    let tableData = await getTableDataByTableName('Table', ['Name', 'Age', 'Address', 'Tags'], page);
    expect(tableData).toMatchObject(expectedTableData);
})

async function getTableDataByTableName(tableName: string, expectedHeaders: string[], page: Page) {
    let tableXpath = `(//div[normalize-space()="${tableName}" and @role='separator']/following::table)[1]`;
    let tableData = [];
    let nextButtonXpath = `(//div[normalize-space()="${tableName}" and @role='separator']//following::li[@title='Next Page'])[1]`;
    let nextButtonLocator = page.locator(nextButtonXpath);
    let isNextButtonDisabled = '';
    while ('true' != isNextButtonDisabled) {
        await page.waitForTimeout(1000);
        let tableLocator = page.locator(tableXpath);
        let headerSelector = `//thead//th`;
        let headerLocators = await tableLocator.locator(headerSelector).all();
        let actualHeaders: string[] = [];
        for (let header of headerLocators) {
            let textContent = await header.textContent() ?? '';
            actualHeaders.push(textContent);
        }
        let listHeadersAndIndexes = [];
        for (let expectedHeader of expectedHeaders) {
            let currentIndex = actualHeaders.indexOf(expectedHeader);
            let mapObject = {
                header: expectedHeader,
                index: currentIndex
            }
            listHeadersAndIndexes.push(mapObject);
        }
        let rowSelector = `//tbody//tr`;
        let rows = await tableLocator.locator(rowSelector).all();
        for (let row of rows) {
            let rowData: any = {};
            for (let mapObject of listHeadersAndIndexes) {
                let tdXpath = `//td[${mapObject.index + 1}]`;
                let tdValue;
                if (mapObject.header == 'Tags') {
                    tdValue = await row.locator(tdXpath).allTextContents();
                } else {
                    tdValue = await row.locator(tdXpath).textContent();
                }
                rowData[`${mapObject.header}`] = tdValue;
            }
            tableData.push(rowData);
        }
        isNextButtonDisabled = await nextButtonLocator.getAttribute('aria-disabled') ?? '';
        if ('true' != isNextButtonDisabled) {
            await nextButtonLocator.click();
        }
    }
    return tableData;
}