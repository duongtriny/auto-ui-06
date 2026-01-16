import { expect, Page } from "@playwright/test";
import { CommonPage } from "../common-page";
import path from "path";

export class NewProductPage extends CommonPage {
    constructor(page: Page) {
        super(page);
    }

    async isDisplay() {
        await expect(this.page.locator('.page-heading-title')).toHaveText('Create a new product');
    }

    async uploadImage(filePath: string) {
        let xpath = `//*[@id='image-uploader-wrapper']//input[@type='file']`;
        let absolutePath = path.join(process.cwd(), filePath);
        await this.page.locator(xpath).setInputFiles(absolutePath);
    }
}