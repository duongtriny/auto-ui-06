# Skill: Test Spec Patterns

> **When to use:** Writing new test spec files that follow the project's established structure and conventions.

## Goal

Create well-structured test specs that use page objects, fixtures, data-driven patterns, and proper setup/teardown.

## Instructions

### Template: Basic Test Spec

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../model/pages/login-page';
import { <Feature>Page } from '../../../model/pages/<feature>-page';
import { UI_ADMIN_LOGIN_URL } from '../../../model/utils/constants-utils';

let loginPage: LoginPage;
let featurePage: <Feature>Page;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    featurePage = new <Feature>Page(page);
    // Navigate or login as needed
    await loginPage.adminLogin();
});

test('Verify <feature action>', async ({ page }) => {
    // Arrange
    // Act
    // Assert
});
```

### Template: Test Spec with Fixtures + Allure Steps

```typescript
import { expect } from '@playwright/test';
import { test } from '../../../model/utils/fixtures';       // ← custom fixture
import { iStep } from '../../../model/utils/step-utils';    // ← Allure steps
import { LoginPage } from '../../../model/pages/login-page';
import { <Feature>Page } from '../../../model/pages/<feature>-page';

let loginPage: LoginPage;
let featurePage: <Feature>Page;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    featurePage = new <Feature>Page(page);
    await loginPage.adminLogin();
});

test('Verify <feature action>', async ({ page }) => {
    await iStep("Step 1: Do something", async () => {
        // actions
    });

    await iStep("Step 2: Verify result", async () => {
        expect(await featurePage.getFieldValueByLabel('Name')).toEqual('expected');
    });
});
```

### Template: Test Spec with API Setup + Cleanup

```typescript
import { expect } from '@playwright/test';
import { test } from '../../../model/utils/fixtures';
import { iStep } from '../../../model/utils/step-utils';
import { LoginPage } from '../../../model/pages/login-page';
import { DashboardPage } from '../../../model/pages/dashboard-page';
import { <Feature>Page } from '../../../model/pages/<feature>-page';
import { <dataTemplate> } from '../../../data/<feature>/<feature>-data';

let loginPage: LoginPage;
let dashboardPage: DashboardPage;
let featurePage: <Feature>Page;
let entityIds: string[] = [];
let cookieHeader: string;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    featurePage = new <Feature>Page(page);
    await loginPage.adminLogin();
    cookieHeader = await loginPage.buildCookieHeader();
});

test.afterAll('After all', async () => {
    for (let entityId of entityIds) {
        await featurePage.deleteEntityByApi('<entity-path>', entityId, cookieHeader);
    }
});

test('Verify <feature> via API + UI', async ({ page }) => {
    const random = new Date().getTime();
    let entityName = "";

    await iStep("Create entity by API", async () => {
        let requestBody = { ...<dataTemplate> };
        requestBody.name = `${requestBody.name} ${random}`;
        let response = await dashboardPage.createEntityByApi('<entity-path>', requestBody, cookieHeader);
        await expect(response).toBeOK();
        let responseBody = await response.json();
        entityIds.push(responseBody.data.uuid);
        entityName = requestBody.name;
    });

    await iStep("Navigate and verify", async () => {
        // UI verification steps
    });
});
```

### Template: Data-Driven Test Spec

```typescript
import { test, expect } from '@playwright/test';
import { <testData> } from '../../../data/<feature>/<feature>-data';
import { <Feature>Page } from '../../../model/pages/<feature>-page';

let featurePage: <Feature>Page;

test.beforeEach(async ({ page }) => {
    featurePage = new <Feature>Page(page);
    await page.goto('<target-url>');
});

for (let data of <testData>) {
    test(data.testCaseName, async ({ page }) => {
        // Fill inputs from data.input
        for (let field in data.input) {
            //@ts-ignore
            await featurePage.inputTextboxByLabel(field, data.input[`${field}`]);
        }

        // Trigger action
        await featurePage.clickButtonByLabel('<Action Button>');

        // Verify expectations from data.expect
        for (let field in data.expect) {
            //@ts-ignore
            await featurePage.verifyValidationMessageByLabel(field, data.expect[`${field}`]);
        }
    });
}
```

### Template: Route Mocking Test

```typescript
test('Verify error handling on API failure', async ({ page }) => {
    // ... setup / fill form ...

    // Mock the API before triggering the action
    page.route('*/**/api/<endpoint>', async route => {
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

    // Trigger the action
    await featurePage.clickButtonByLabel('Save');

    // Verify error is displayed
    await featurePage.verifyPopupMessage('Internal Server Error');
});
```

## Conventions Checklist

When writing a new test spec, verify:

- [ ] Page objects are instantiated in `beforeEach`, not at module level
- [ ] `test` is imported from `fixtures.ts` (if auto-screenshot is needed)
- [ ] `expect` is imported from `@playwright/test`
- [ ] Unique data uses `new Date().getTime()` for randomization
- [ ] Created entities are tracked in an array and cleaned up in `afterAll`
- [ ] Cookie header is built after login: `cookieHeader = await loginPage.buildCookieHeader()`
- [ ] `iStep()` wraps logical groups of actions for Allure reporting
- [ ] Step names are human-readable business descriptions
- [ ] Test names start with "Verify" for consistency
- [ ] File is placed at `tests/<app-name>/<feature>/<feature>.spec.ts`

## File Naming

```
tests/
└── <app-name>/
    └── <feature>/
        └── <feature>.spec.ts
```

Examples:
- `tests/evershop/login/login.spec.ts`
- `tests/evershop/new-product/new-product.spec.ts`
- `tests/evershop/edit-product/edit-product.spec.ts`
