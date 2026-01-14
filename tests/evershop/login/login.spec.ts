import { test, expect, Page } from '@playwright/test';
import { invalidLogin } from '../../../data/login/login-data';


test('Verify admin login successful', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/login');
    await inputTextboxByLabel('Email', 'test@with.me', page);
    await inputTextboxByLabel('Password', '1234567890', page);
    await clickButtonByLabel('SIGN IN', page);
    await expect(page.locator('.page-heading-title')).toHaveText('Dashboard');
});

for (let data of invalidLogin) {
    test(data.testCaseName, async ({ page }) => {
        await page.goto('http://localhost:3000/admin/login');
        for (let field in data.input) {
            //@ts-ignore
            await inputTextboxByLabel(field, data.input[`${field}`], page);
        }
        await clickButtonByLabel('SIGN IN', page);
        for (let field in data.expect) {
            //@ts-ignore
            await verifyValidationMessageByLabel(field, data.expect[`${field}`], page);
        }
    });
}

async function inputTextboxByLabel(label: string, input: string, page: Page) {
    let inputXpath = `(//label[normalize-space(text())="${label}"]//following::input)[1]`
    await page.locator(inputXpath).fill(input);
}
async function clickButtonByLabel(label: string, page: Page) {
    let buttonXpath = `//button[normalize-space()="${label}"]`;
    await page.locator(buttonXpath).click();
}

async function verifyValidationMessageByLabel(label: string, message: string, page: Page) {
    let messageXpath = `(//label[normalize-space(text())="${label}"]//following::p[contains(concat(' ',normalize-space(@class),' '),' field-error ') and normalize-space()="${message}"])[1]`;
    await expect(page.locator(messageXpath)).toBeVisible();
}