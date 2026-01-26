import { test, expect, Page } from '@playwright/test';
import { invalidLogin } from '../../../data/login/login-data';
import { LoginPage } from '../../../model/pages/login-page';
import { UI_ADMIN_LOGIN_URL } from '../../../model/utils/constants-utils';

let loginPage: LoginPage;
test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await page.goto(UI_ADMIN_LOGIN_URL);
});

test('Verify admin login successful', async ({ page }) => {
    await loginPage.adminLogin();
});

for (let data of invalidLogin) {
    test(data.testCaseName, async ({ page }) => {
        for (let field in data.input) {
            //@ts-ignore
            await loginPage.inputTextboxByLabel(field, data.input[`${field}`]);
        }
        await loginPage.clickButtonByLabel('SIGN IN');
        for (let field in data.expect) {
            //@ts-ignore
            await loginPage.verifyValidationMessageByLabel(field, data.expect[`${field}`]);
        }
    });
}