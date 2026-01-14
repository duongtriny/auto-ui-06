import { test, expect, Page } from '@playwright/test';
import { adminLogin, clickButtonByLabel, inputTextboxByLabel } from '../../../model/common';

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/admin/login');
    await adminLogin(page);
});

test('Verify creating new product', async ({ page }) => {
    console.log('Create new product');
});