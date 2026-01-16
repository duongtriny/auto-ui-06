import { Page } from "@playwright/test";
import { CommonPage } from "../common-page";

export class DashboardPage extends CommonPage {
    constructor(page: Page) {
        super(page);
    }


}