import { test, expect, Page } from '@playwright/test';
import { invalidLogin } from '../../../data/login/login-data';
import { adminLogin, clickButtonByLabel, inputTextboxByLabel } from '../../../model/common';

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/admin/login');
});

test('Verify admin login successful', async ({ page }) => {
    await adminLogin(page);
});

for (let data of invalidLogin) {
    test(data.testCaseName, async ({ page }) => {
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