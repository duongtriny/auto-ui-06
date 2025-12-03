import test, { expect, Page } from "@playwright/test";
import { inputData } from "./input-data";

for (let testData of inputData) {
    test(`Verify ${testData.label}`, async ({ page }) => {
        await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/elements/input');
        await inputTextByLabel(page, testData.label, testData.input);
        await expect(page.getByText(`Value: ${testData.input}`)).toBeVisible();
    });
}

test(`Verify input number - Increase/Decrease`, async ({ page }) => {
    await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/elements/input');
    let initialValue = 10;
    await inputTextByLabel(page, "Input Number", `${initialValue}`);
    //identify input locator
    let xpath = `(//div[@role="separator" and .//span[normalize-space(.)="Input Number"]]/following::input)[1]`;
    let locator = page.locator(xpath);
    //get step value
    let stepValue = await locator.getAttribute('step') ?? "";
    //Hover input
    await locator.hover();
    //Click on increase button
    let increaseButtonXpath = `//div[@role="separator" and .//span[normalize-space(.)="Input Number"]]/following::span[@aria-label='Increase Value']`;
    //Verify number -> input number + step
    await page.locator(increaseButtonXpath).click();
    await expect(page.getByText(`Value: ${initialValue + Number.parseInt(stepValue)}`)).toBeVisible();
    //Click on decrease button
    let decreaseButtonXpath = `//div[@role="separator" and .//span[normalize-space(.)="Input Number"]]/following::span[@aria-label='Decrease Value']`;
    await page.locator(decreaseButtonXpath).click();
    await expect(page.getByText(`Value: ${initialValue}`)).toBeVisible();
});

async function inputTextByLabel(page: Page, label: string, input: string) {
    let xpath1 = `//div[@role="separator" and .//span[normalize-space(.)="${label}"]]/following::input`;
    let xpath2 = `//div[@role="separator" and .//span[normalize-space(.)="${label}"]]/following::textarea`;
    let locator = page.locator(`(${xpath1} | ${xpath2})[1]`);
    await locator.clear();
    await locator.fill(input);
    await page.keyboard.press('Enter');
}

test(`Verify OTP`, async ({ page }) => {
    await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/elements/input');
    let otp = '123456';
    let xpath = `(//div[@role="separator" and span[normalize-space(.)="OTP Box"]]/following::div[contains(concat(' ',normalize-space(@class),' '),' ant-otp ')])[1]//input`;
    let inputs = await page.locator(xpath).all();
    for (let i = 0; i < 6; i++) {
        await inputs[i].fill(otp[i]);
    }
    await expect(page.getByText(`Value: ${otp}`)).toBeVisible();
})