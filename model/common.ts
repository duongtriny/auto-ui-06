import { expect, Page } from "@playwright/test";

export async function inputTextboxByLabel(label: string, input: string, page: Page) {
    let inputXpath = `(//label[normalize-space(text())="${label}"]//following::input)[1]`
    await page.locator(inputXpath).fill(input);
}
export async function clickButtonByLabel(label: string, page: Page) {
    let buttonXpath = `//button[normalize-space()="${label}"]`;
    await page.locator(buttonXpath).click();
}

export async function verifyValidationMessageByLabel(label: string, message: string, page: Page) {
    let messageXpath = `(//label[normalize-space(text())="${label}"]//following::p[contains(concat(' ',normalize-space(@class),' '),' field-error ') and normalize-space()="${message}"])[1]`;
    await expect(page.locator(messageXpath)).toBeVisible();
}

export async function adminLogin(page: Page) {
    await inputTextboxByLabel('Email', 'test@with.me', page);
    await inputTextboxByLabel('Password', '1234567890', page);
    await clickButtonByLabel('SIGN IN', page);
    await expect(page.locator('.page-heading-title')).toHaveText('Dashboard');
}