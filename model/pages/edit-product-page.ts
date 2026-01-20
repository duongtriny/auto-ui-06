import { expect, Page } from "@playwright/test";
import { CommonPage } from "../common-page";

export class EditProductPage extends CommonPage {
    constructor(page: Page) {
        super(page);
    }

    async isDisplay(productName: string) {
        await expect(this.page.getByText(productName)).toBeVisible();
    }

    getProductId() {
        let url = this.page.url();
        let urlSplitted = url.split('/');
        return urlSplitted[urlSplitted.length - 1].trim();
    }
}