import { expect, Page } from "@playwright/test";
import { CommonPage } from "../common-page";

export class ProductsPage extends CommonPage {
    constructor(page: Page) {
        super(page);
    }

    async isDisplay() {
        await expect(this.page.locator('//table[.//th[normalize-space()="Thumbnail"] and .//th[normalize-space()="SKU"]]')).toBeVisible();
    }

    async searchProduct(input: string) {
        let locator = this.page.locator("#field-keyword");
        await locator.click();
        await locator.clear();
        await locator.fill(input);
        await this.page.keyboard.press('Enter');
    }

    async selectProductByName(name: string) {
        let xpath = `//a[normalize-space()="${name}"]`;
        await this.page.locator(xpath).click();
    }
}