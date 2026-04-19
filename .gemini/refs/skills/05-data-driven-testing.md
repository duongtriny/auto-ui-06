# Skill: Data-Driven Testing

> **When to use:** Creating parameterized tests that iterate over multiple test data sets — e.g., validation scenarios, boundary testing, multi-user testing.

## Goal

Separate test data from test logic by exporting typed data arrays from `data/` files and consuming them with `for...of` loops in test specs.

## Instructions

### Pattern 1: Validation/Negative Test Data (Field-Level)

Use this when testing form validation — each test case specifies input values and expected error messages, **keyed by field label**.

**Step 1: Create `data/<feature>/<feature>-data.ts`**

```typescript
export const invalidLogin = [
    {
        testCaseName: 'Verify email is empty',
        input: {
            'Email': '',
            'Password': '123456789'
        },
        expect: {
            'Email': 'Email is required'
        }
    },
    {
        testCaseName: 'Verify password is empty',
        input: {
            'Email': 'test@with.me',
            'Password': ''
        },
        expect: {
            'Password': 'Password is required'
        }
    },
    {
        testCaseName: 'Verify email and password are empty',
        input: {
            'Email': '',
            'Password': ''
        },
        expect: {
            'Email': 'Email is required',
            'Password': 'Password is required'
        }
    }
]
```

**Data structure convention:**

```typescript
{
    testCaseName: string,                  // Used as the test title
    input: { [fieldLabel: string]: string }, // Field label → input value
    expect: { [fieldLabel: string]: string } // Field label → expected error message
}
```

**Step 2: Consume in test spec**

```typescript
import { test, expect } from '@playwright/test';
import { invalidLogin } from '../../../data/login/login-data';
import { LoginPage } from '../../../model/pages/login-page';

let loginPage: LoginPage;
test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await page.goto(UI_ADMIN_LOGIN_URL);
});

// Dynamic test generation from data array
for (let data of invalidLogin) {
    test(data.testCaseName, async ({ page }) => {
        // Fill all input fields
        for (let field in data.input) {
            //@ts-ignore
            await loginPage.inputTextboxByLabel(field, data.input[`${field}`]);
        }
        // Trigger form submission
        await loginPage.clickButtonByLabel('SIGN IN');
        // Verify all expected error messages
        for (let field in data.expect) {
            //@ts-ignore
            await loginPage.verifyValidationMessageByLabel(field, data.expect[`${field}`]);
        }
    });
}
```

> **Note:** `@ts-ignore` is used for dynamic property access on the data objects. This is an accepted convention in this project.

### Pattern 2: API Request Body Template

Use this when tests need to create entities via API before performing UI verification.

**Step 1: Create `data/<feature>/<feature>-data.ts`**

```typescript
export const newProductBodyTemplate = {
    "name": "Product Template Name",
    "sku": "SKU-",
    "price": 50,
    "weight": 1,
    "tax_class": "1",
    "description": [],
    "url_key": "product-template-name-",
    "meta_title": "product, template",
    "meta_keywords": "",
    "meta_description": "Product template description",
    "status": 0,
    "visibility": 0,
    "manage_stock": 0,
    "stock_availability": 0,
    "qty": 100,
    "group_id": "1",
    "images": [
        "/assets/catalog/1369/2740/product.jpg"
    ],
    "attributes": [
        {
            "attribute_code": "color",
            "attribute_name": "Color",
            "type": "select",
            "attribute_id": "1",
            "value": "1",
            "is_required": 0
        }
    ]
}
```

**Step 2: Consume in test spec (with unique data per run)**

```typescript
import { newProductBodyTemplate } from '../../../data/edit-product/edit-product-data';

test('Verify creating new product', async ({ page }) => {
    const random = new Date().getTime();

    // Clone and customize template for this test run
    let requestBody = { ...newProductBodyTemplate };
    requestBody.name = `${requestBody.name} ${random}`;
    requestBody.sku = `${requestBody.sku}${random}`;
    requestBody.url_key = `${requestBody.url_key}${random}`;

    let response = await dashboardPage.createEntityByApi('products', requestBody, cookieHeader);
    await expect(response).toBeOK();
});
```

> **Warning:** If you mutate the template directly (`requestBody.name = ...` without cloning), the mutation persists across tests in the same module. Always spread-clone (`{ ...template }`) if multiple tests use the same template.

## How to add a new data-driven test

1. Create a data file: `data/<feature>/<feature>-data.ts`
2. Export an array of test case objects with `testCaseName`, `input`, and `expect` fields
3. In the spec file, use `for...of` to generate tests dynamically
4. Use the field labels (not CSS selectors) as keys — they map directly to `CommonPage` methods

## Rules

1. **Test data lives in `data/` directory** — never inline test data in spec files
2. **Organize by feature** — `data/login/`, `data/new-product/`, etc.
3. **Use `testCaseName`** as the key for the test title — it appears in test reports
4. **Field keys match visible labels** — `'Email'`, `'Password'`, `'Product Name'` match what the user sees
5. **Timestamp for uniqueness** — use `new Date().getTime()` to ensure unique data per test run
6. **Clone templates** before mutation to prevent cross-test contamination
7. **Static assets** (images, files) go under `data/<feature>/images/`
