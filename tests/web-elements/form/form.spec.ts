import test, { expect, Page } from "@playwright/test";
import { invalidFormData, validFormData } from "./form-data";

for (let data of invalidFormData) {
    test(`${data.testCaseName}`, async ({ page }) => {
        await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/form');
        for (let fieldName in data.input) {
            //@ts-ignore
            await inputTextByLabel(fieldName, data.input[`${fieldName}`].value, page);
        }
        await clickButtonByLabel('Submit', page);
        for (let fieldName in data.input) {
            //@ts-ignore
            await verifyValidationMessageByLabel(fieldName, data.input[`${fieldName}`].message, page);
        }
    });
}
for (let data of validFormData) {
    test(`${data.testCaseName}`, async ({ page }) => {
        await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/form');
        for (let fieldName in data.input) {
            //@ts-ignore
            await inputTextByLabel(fieldName, data.input[`${fieldName}`], page);
        }
        await clickButtonByLabel('Submit', page);
        let messageXpath = `//div[contains(concat(' ',normalize-space(@class),' '),' ant-notification-notice-message ') and normalize-space()='Application of "${data.input['Full Name']}"']`;
        await expect(page.locator(messageXpath)).toBeVisible();
    });
}

async function clickButtonByLabel(label: string, page: Page) {
    let xpath = `//button[normalize-space()="${label}"]`;
    await page.locator(xpath).click();
}

async function verifyValidationMessageByLabel(label: string, message: string, page: Page) {
    let messageXpath = `(//div[normalize-space()="${label}"]/following::div[@role="alert" and normalize-space()="${message}"])[1]`;
    await expect(page.locator(messageXpath)).toBeVisible();
}
async function inputTextByLabel(label: string, input: string, page: Page) {
    let xpath = `(//div[normalize-space()="${label}"]/following::input)[1]`;
    let locator = page.locator(xpath);
    await locator.click();
    await locator.fill(input);
}