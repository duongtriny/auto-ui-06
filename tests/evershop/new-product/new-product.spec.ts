import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../../../model/pages/login-page';
import { NewProductPage } from '../../../model/pages/new-product-page';
import { DashboardPage } from '../../../model/pages/dashboard-page';

let loginPage: LoginPage;
let newProductPage: NewProductPage;
let dashboardPage: DashboardPage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    newProductPage = new NewProductPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.adminLogin();
});

test('Verify creating new product', async ({ page }) => {
    await dashboardPage.clickMenuByLabel('New Product');
    await newProductPage.isDisplay();
    await newProductPage.inputTextByLabel('Product Name', "Giày Chạy Bộ Biti's Hunter Running Nam Màu Xanh Dương HSM011000XDG");
    await newProductPage.inputTextByLabel('SKU', "SKU-123");
    await newProductPage.inputTextByLabel('Price', "50");
    await newProductPage.inputTextByLabel('Weight', "1");
    await newProductPage.selectDropdownByLabel('Tax Class', 'Taxable Goods');
    await newProductPage.uploadImage('data/new-product/images/bitis.jpg');
    await newProductPage.clickRadioButtonByLabel('Status', 'Disabled');
    await newProductPage.clickRadioButtonByLabel('Visibility', 'Not visible individually');
    await newProductPage.clickRadioButtonByLabel('Manage Stock', 'No');
    await newProductPage.clickRadioButtonByLabel('Stock Availability', 'Out of Stock');
    await newProductPage.inputTextByLabel('Quantity', "100");
    await newProductPage.inputTextByLabel('URL Key', "giay-chay-bo-biti-s-hunter-running-nam-mau-xanh-duong-hsm011000xdg");
    await newProductPage.inputTextByLabel('Meta Title', "bitis, chay bo");
    await newProductPage.selectDropdownByLabel('Attribute group', 'Default');
    await newProductPage.selectDropdownByLabel('Color', 'White');
    await newProductPage.selectDropdownByLabel('Size', 'XL');
    await newProductPage.inputTextareaByLabel('Meta Description', "Giày Chạy Bộ Biti's Hunter Running Nam Xanh Dương Nâng Tầm Tốc Độ");
    await newProductPage.clickButtonByLabel('Save');
    await newProductPage.verifyPopupMessage('Product updated successfully');
});
