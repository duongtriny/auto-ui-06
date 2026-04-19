# Skill: Custom Fixtures & Allure Reporting

> **When to use:** Setting up automatic screenshot-on-failure, Allure step reporting, and custom test fixtures.

## Goal

Create a custom Playwright test fixture that automatically captures screenshots on failure and attaches them to Allure reports, plus a step wrapper utility for structured reporting.

## Instructions

### Step 1: Create `model/utils/fixtures.ts`

This extends Playwright's base `test` with an auto-running fixture that runs before/after every test.

```typescript
import { test as base } from '@playwright/test';
import * as allure from "allure-js-commons";

export const test = base.extend<{ forEachTest: void }>({
    forEachTest: [async ({ page }, use, testInfo) => {
        // ──── BEFORE each test ────
        // Add any global setup here, e.g.:
        // await page.goto('http://localhost:3000');

        await use();

        // ──── AFTER each test ────
        if (testInfo.status != 'passed') {
            const buffer = await page.screenshot({ fullPage: true });
            await allure.attachment("Screenshot", buffer, allure.ContentType.PNG);
        }
    }, { auto: true }],  // automatically starts for every test
});
```

**How it works:**
- `base.extend<{ forEachTest: void }>` adds a new fixture named `forEachTest`
- `{ auto: true }` makes it run automatically for every test without explicit opt-in
- After each test, if the test did NOT pass, it:
  1. Takes a full-page screenshot
  2. Attaches it to the Allure report as a PNG

### Step 2: Create `model/utils/step-utils.ts`

This wraps Allure's `step()` function for cleaner syntax in test specs.

```typescript
import * as allure from "allure-js-commons";

export async function iStep(name: string, action: () => Promise<any>): Promise<any> {
    await allure.step(name, async () => {
        await action();
    })
}
```

### Step 3: Usage in test specs

**Import `test` from fixtures (NOT from `@playwright/test`):**

```typescript
// ✅ Correct — uses custom fixture with auto-screenshot
import { expect, Page } from '@playwright/test';
import { test } from '../../../model/utils/fixtures';

// ❌ Wrong — no auto-screenshot
import { test, expect } from '@playwright/test';
```

**Use `iStep()` to wrap logical groups of actions:**

```typescript
import { iStep } from '../../../model/utils/step-utils';

test('Verify product creation flow', async ({ page }) => {
    await iStep("Login as admin", async () => {
        await loginPage.adminLogin();
    });

    await iStep("Create product via API", async () => {
        let response = await dashboardPage.createEntityByApi('products', requestBody, cookieHeader);
        await expect(response).toBeOK();
    });

    await iStep("Navigate to products list", () => productsPage.clickMenuByLabel("Products"));

    await iStep("Search for product", () => productsPage.searchProduct(searchTerm));

    await iStep("Verify product details", async () => {
        expect(await editProductPage.getFieldValueByLabel('Product Name')).toEqual(expectedName);
    });
});
```

> **Convention:** Use `iStep()` for steps that should appear in the Allure report. Single-action steps can use inline arrow syntax; multi-action steps use `async () => { ... }`.

## Allure Report Configuration

Already configured in `playwright.config.ts`:

```typescript
reporter: [["line"], ["allure-playwright"]],
```

Generate the report:

```bash
npm run generate-report
# → npx allure awesome --single-file allure-results
```

## Rules

1. **Always import `test` from `fixtures.ts`** when you want auto-screenshot on failure
2. **Import `expect` from `@playwright/test`** (fixtures only re-exports `test`)
3. **Use `iStep()`** to wrap logical groups of actions — it improves Allure readability
4. **Step names should be human-readable** — describe the business action, not the technical detail
   - ✅ `"Create product via API"`
   - ❌ `"POST /api/products"`
5. **Screenshots are full-page** — `{ fullPage: true }` captures the entire scrollable area
