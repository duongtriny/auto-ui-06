import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../../../model/pages/login-page';
import { NewProductPage } from '../../../model/pages/new-product-page';
import { DashboardPage } from '../../../model/pages/dashboard-page';
import { ProductsPage } from '../../../model/pages/products-page';
import { EditProductPage } from '../../../model/pages/edit-product-page';
import { newProductBodyTemplate } from '../../../data/edit-product/edit-product-data';

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
    let requestBody = newProductBodyTemplate;
    requestBody.name = `${requestBody.name} ${random}`;
    requestBody.sku = `${requestBody.sku}${random}`;
    requestBody.url_key = `${requestBody.url_key}${random}`;
    let response = await dashboardPage.createProductByApi(requestBody, cookieHeader);
    await expect(response).toBeOK();
    let responseBody = await response.json();
    productIds.push(responseBody.data.uuid);
    let productName = requestBody.name;
    await newProductPage.clickMenuByLabel("Products");
    await productsPage.isDisplay();
    await productsPage.searchProduct(random.toString());
    await productsPage.selectProductByName(productName);
    await editProductPage.isDisplay(`Editing ${productName}`);

    expect(await editProductPage.getFieldValueByLabel('Product Name')).toEqual(productName);
});
