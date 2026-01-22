import { expect, Page, request } from "@playwright/test";

export class CommonPage {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }
    async inputTextboxByLabel(label: string, input: string) {
        let inputXpath = `(//label[normalize-space(text())="${label}"]//following::input)[1]`
        await this.page.locator(inputXpath).fill(input);
    }

    async clickButtonByLabel(label: string) {
        let buttonXpath = `//button[normalize-space()="${label}"]`;
        await this.page.locator(buttonXpath).click();
    }

    async verifyValidationMessageByLabel(label: string, message: string) {
        let messageXpath = `(//label[normalize-space(text())="${label}"]//following::p[contains(concat(' ',normalize-space(@class),' '),' field-error ') and normalize-space()="${message}"])[1]`;
        await expect(this.page.locator(messageXpath)).toBeVisible();
    }

    async clickMenuByLabel(label: string) {
        let xpath = `//div[contains(concat(' ',normalize-space(@class),' '),' admin-navigation ')]//a[normalize-space()="${label}"]`;
        await this.page.locator(xpath).click();
    }

    async inputTextByLabel(label: string, input: string) {
        let xpath = `(//label[normalize-space(text())="${label}"]//following::input)[1]`;
        let locator = this.page.locator(xpath);
        await locator.clear();
        await locator.fill(input);
    }
    async inputTextareaByLabel(label: string, input: string) {
        let xpath = `(//label[normalize-space(text())="${label}"]//following::textarea)[1]`;
        let locator = this.page.locator(xpath);
        await locator.clear();
        await locator.fill(input);
    }

    async selectDropdownByLabel(label: string, item: string) {
        let dropdownXpath1 = `(//label[normalize-space(text())="${label}"]//following::select)[1]`;
        let dropdownXpath2 = `(//td[normalize-space(.)="${label}"]//following::select)[1]`;
        await this.page.locator(`${dropdownXpath1}|${dropdownXpath2}`).selectOption(item);
    }

    async clickRadioButtonByLabel(label: string, option: string) {
        let xpath = `(//legend[normalize-space(text())="${label}"]//following::label[normalize-space()="${option}"])[1]`;
        await this.page.locator(xpath).click();
    }

    async verifyPopupMessage(message: string) {
        let xpath = `//*[@role='alert' and normalize-space()='${message}']`;
        await expect(this.page.locator(xpath)).toBeVisible();
    }

    async getFieldValueByLabel(label: string) {
        let xpath = `(//label[normalize-space(text())="${label}"]//following::input)[1]`;
        let value = await this.page.locator(xpath).inputValue();
        return value.trim();
    }

    async buildCookieHeader() {
        let cookies = await this.page.context().cookies();
        let asidObj = cookies.find(o => o.name == 'asid');
        let sidObj = cookies.find(o => o.name == 'sid');
        let cookiesHeader = `asid=${asidObj?.value}; sid=${sidObj?.value}`;
        return cookiesHeader;
    }

    async deleteProductByApi(productId: string, cookiesHeader: string) {
        let url = `http://localhost:3000/api/products/${productId}`;
        let myRequest = await request.newContext();
        await myRequest.delete(url, {
            headers: {
                cookie: cookiesHeader
            }
        });
    }
}
