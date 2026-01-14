import { expect, Page } from "@playwright/test";
import { CommonPage } from "../common-page";

export class LoginPage extends CommonPage {
    constructor(page: Page) {
        super(page);
    }

    async adminLogin() {
        await this.page.goto('http://localhost:3000/admin/login');
        await this.inputTextboxByLabel('Email', 'test@with.me');
        await this.inputTextboxByLabel('Password', '1234567890');
        await this.clickButtonByLabel('SIGN IN');
        await expect(this.page.locator('.page-heading-title')).toHaveText('Dashboard');
    }
}