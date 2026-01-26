import { expect, Page } from "@playwright/test";
import { CommonPage } from "../common-page";
import { ADMIN_PASSWORD, ADMIN_USERNAME, UI_ADMIN_LOGIN_URL } from "../utils/constants-utils";

export class LoginPage extends CommonPage {
    constructor(page: Page) {
        super(page);
    }

    async adminLogin() {
        await this.page.goto(UI_ADMIN_LOGIN_URL);
        await this.inputTextboxByLabel('Email', ADMIN_USERNAME);
        await this.inputTextboxByLabel('Password', ADMIN_PASSWORD);
        await this.clickButtonByLabel('SIGN IN');
        await expect(this.page.locator('.page-heading-title')).toHaveText('Dashboard');
    }
}