# Skill: API Testing & Route Mocking

> **When to use:** Creating/deleting test data via API, authenticating API calls using browser cookies, or mocking API responses to simulate error scenarios.

## Goal

Use Playwright's `request` context and `page.route()` to integrate API calls into UI tests for setup, teardown, and negative testing.

## Instructions

### Pattern 1: Cookie-Based API Authentication

Extract browser session cookies after UI login and use them to authenticate API requests.

**Step 1: Build cookie header from browser session**

This method lives in `CommonPage`:

```typescript
async buildCookieHeader() {
    let cookies = await this.page.context().cookies();
    let asidObj = cookies.find(o => o.name == 'asid');
    let sidObj = cookies.find(o => o.name == 'sid');
    let cookiesHeader = `asid=${asidObj?.value}; sid=${sidObj?.value}`;
    return cookiesHeader;
}
```

**Step 2: Use in test setup**

```typescript
let cookieHeader: string;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.adminLogin();
    cookieHeader = await loginPage.buildCookieHeader();
});
```

> **Key insight:** API auth requires a prior UI login because the cookies (`asid`, `sid`) are set by the browser during the login flow. You cannot make authenticated API calls without logging in first.

### Pattern 2: Create Entity via API (Test Setup)

Create test data via API before running UI tests — faster than creating via UI.

```typescript
// In CommonPage:
async createEntityByApi(entityPath: string, requestBody: any, cookiesHeader: string) {
    let myRequest = await request.newContext();
    return await myRequest.post(`${UI_BASE_URL}/api/${entityPath}`, {
        headers: { cookie: cookiesHeader },
        data: requestBody
    });
}
```

**Usage in test:**

```typescript
test('Verify product editing', async ({ page }) => {
    const random = new Date().getTime();

    await iStep("Create product by API", async () => {
        let requestBody = { ...newProductBodyTemplate };
        requestBody.name = `${requestBody.name} ${random}`;
        requestBody.sku = `${requestBody.sku}${random}`;
        requestBody.url_key = `${requestBody.url_key}${random}`;

        let response = await dashboardPage.createEntityByApi('products', requestBody, cookieHeader);
        await expect(response).toBeOK();

        let responseBody = await response.json();
        productIds.push(responseBody.data.uuid);  // Track for cleanup
        productName = requestBody.name;
    });
});
```

### Pattern 3: Delete Entity via API (Test Cleanup)

Clean up created test data in `afterAll` to prevent test pollution.

```typescript
// In CommonPage:
async deleteEntityByApi(entityPath: string, entityId: string, cookiesHeader: string) {
    let url = `${UI_BASE_URL}/api/${entityPath}/${entityId}`;
    let myRequest = await request.newContext();
    await myRequest.delete(url, {
        headers: { cookie: cookiesHeader }
    });
}
```

**Usage in test cleanup:**

```typescript
let productIds: string[] = [];

test.afterAll('After all', async () => {
    for (let productId of productIds) {
        await editProductPage.deleteEntityByApi('products', productId, cookieHeader);
    }
});
```

**Cleanup pattern:**
1. Track entity IDs in an array during test execution
2. In `afterAll`, iterate and delete each entity via API
3. This ensures cleanup runs even if individual tests fail

### Pattern 4: Route Mocking (Simulate Server Errors)

Use `page.route()` to intercept API calls and return custom responses — useful for testing error handling without a real backend failure.

```typescript
test('Verify error message when server returns 500', async ({ page }) => {
    // ... fill out the form ...

    // Intercept the API call and return a mock 500 response
    page.route('*/**/api/products', async route => {
        await route.fulfill({
            json: {
                error: {
                    status: 500,
                    message: "Internal Server Error"
                }
            },
            status: 500
        });
    });

    // Trigger the action that calls the API
    await newProductPage.clickButtonByLabel('Save');

    // Verify the UI handles the error correctly
    await newProductPage.verifyPopupMessage('Internal Server Error');
});
```

**Key details:**
- `page.route()` must be called BEFORE the action that triggers the API call
- `'*/**/api/products'` matches any request to `/api/products` on any host
- `route.fulfill()` returns the mock response instead of hitting the real server
- The test verifies that the UI displays the error message from the mock response

## Full Test Pattern: API Setup → UI Verify → API Cleanup

```typescript
import { test } from '../../../model/utils/fixtures';
import { expect } from '@playwright/test';
import { iStep } from '../../../model/utils/step-utils';

let productIds: string[] = [];
let cookieHeader: string;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.adminLogin();
    cookieHeader = await loginPage.buildCookieHeader();
});

test.afterAll('Cleanup', async () => {
    for (let id of productIds) {
        await editProductPage.deleteEntityByApi('products', id, cookieHeader);
    }
});

test('Create via API, verify via UI', async ({ page }) => {
    const random = new Date().getTime();
    let productName = "";

    await iStep("Create product by API", async () => {
        let body = { ...template };
        body.name = `${body.name} ${random}`;
        let response = await page.createEntityByApi('products', body, cookieHeader);
        await expect(response).toBeOK();
        let json = await response.json();
        productIds.push(json.data.uuid);
        productName = body.name;
    });

    await iStep("Navigate to products", () => dashboardPage.clickMenuByLabel("Products"));
    await iStep("Search product", () => productsPage.searchProduct(random.toString()));
    await iStep("Open product", () => productsPage.selectProductByName(productName));
    await iStep("Verify product data", async () => {
        expect(await editProductPage.getFieldValueByLabel('Product Name')).toEqual(productName);
    });
});
```

## Rules

1. **Login first, API second** — always log in via UI before making API calls (cookies are required)
2. **Track IDs for cleanup** — push entity IDs into an array; clean up in `afterAll`
3. **Use `request.newContext()`** — creates an isolated request context for API calls
4. **mock before action** — `page.route()` must be called before the action that triggers the request
5. **Use glob patterns** for route matching — `*/**/api/<path>` matches across hosts/ports
6. **Clone templates** before mutation — spread-clone (`{ ...template }`) to avoid cross-test contamination
