import { test as base } from '@playwright/test';
import * as allure from "allure-js-commons";

export const test = base.extend<{ forEachTest: void }>({
    forEachTest: [async ({ page }, use, testInfo) => {
        // This code runs before every test.
        // await page.goto('http://localhost:8000');
        await use();
        // This code runs after every test.
        if (testInfo.status != 'passed') {
            const buffer = await page.screenshot({ fullPage: true });
            await allure.attachment("Screenshot", buffer, allure.ContentType.PNG);
        }
    }, { auto: true }],  // automatically starts for every test.
});