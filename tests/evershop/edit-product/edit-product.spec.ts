import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../../../model/pages/login-page';
import { NewProductPage } from '../../../model/pages/new-product-page';
import { DashboardPage } from '../../../model/pages/dashboard-page';
import { ProductsPage } from '../../../model/pages/products-page';
import { EditProductPage } from '../../../model/pages/edit-product-page';
import { newProductBodyTemplate } from '../../../data/edit-product/edit-product-data';
import * as allure from "allure-js-commons";
import { iStep } from '../../../model/utils/step-utils';

let loginPage: LoginPage;
let newProductPage: NewProductPage;
let dashboardPage: DashboardPage;
let productsPage: ProductsPage;
let editProductPage: EditProductPage;
let productIds: string[] = [];
let cookieHeader: string;
test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    newProductPage = new NewProductPage(page);
    dashboardPage = new DashboardPage(page);
    productsPage = new ProductsPage(page);
    editProductPage = new EditProductPage(page);
    await loginPage.adminLogin();
    cookieHeader = await loginPage.buildCookieHeader();
});

test.afterAll('After all', async () => {
    for (let productId of productIds) {
        await editProductPage.deleteProductByApi(productId, cookieHeader);
    }
})

test('Verify creating new product', async ({ page, request }) => {
    const random = new Date().getTime();
    let productName = "";
    await iStep("Create product by API", async () => {
        let requestBody = newProductBodyTemplate;
        requestBody.name = `${requestBody.name} ${random}`;
        requestBody.sku = `${requestBody.sku}${random}`;
        requestBody.url_key = `${requestBody.url_key}${random}`;
        let response = await dashboardPage.createProductByApi(requestBody, cookieHeader);
        await expect(response).toBeOK();
        let responseBody = await response.json();
        productIds.push(responseBody.data.uuid);
        productName = requestBody.name;
    })
    await iStep("View products", () => newProductPage.clickMenuByLabel("Products"));
    await iStep("User should be on Products page", () => productsPage.isDisplay());
    await iStep("Search product", () => productsPage.searchProduct(random.toString()));
    await iStep("Select product by name", () => productsPage.selectProductByName(productName));
    await iStep("User should be on Edit Product Page", () => editProductPage.isDisplay(`Editing ${productName}`));
    await iStep("Verify product", async () => {
        expect(await editProductPage.getFieldValueByLabel('Product Name')).toEqual(productName);
    });

});
