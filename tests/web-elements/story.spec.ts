import test, { expect, Page } from "@playwright/test";
test(`Verify open story`, async ({ page, context }) => {
    await page.goto('https://truyenfull.vision/lam-can-sung-nich/chuong-1/');
    await page.waitForTimeout(5000);
});
