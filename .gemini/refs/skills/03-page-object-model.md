# Skill: Page Object Model (POM)

> **When to use:** Creating page object classes to encapsulate UI interactions for any web application.

## Goal

Build a Page Object Model hierarchy with a `CommonPage` base class providing generic, label-based interaction methods, and feature-specific page classes inheriting from it.

## Architecture

```
CommonPage (model/common-page.ts)
├── LoginPage (model/pages/login-page.ts)
├── DashboardPage (model/pages/dashboard-page.ts)
├── <Feature>Page (model/pages/<feature>-page.ts)
└── ...
```

## Instructions

### Step 1: Create `model/common-page.ts` — Base Class

This is the foundation. All page classes extend this. It provides **generic methods** that work across any page by locating elements via their visible label text using XPath.

```typescript
import { expect, Page, request } from "@playwright/test";
import { UI_BASE_URL } from "./utils/constants-utils";

export class CommonPage {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    // ─── Form Interactions ───

    async inputTextboxByLabel(label: string, input: string) {
        let inputXpath = `(//label[normalize-space(text())="${label}"]//following::input)[1]`;
        await this.page.locator(inputXpath).fill(input);
    }

    async inputTextByLabel(label: string, input: string) {
        let xpath = `(//label[normalize-space(text())="${label}"]//following::input)[1]`;
        let locator = this.page.locator(xpath);
        await locator.clear();
        await locator.fill(input);
    }

    async inputTextareaByLabel(label: string, input: string) {
        let xpath = `(//label[normalize-space(text())="${label}"]//following::textarea)[1]`;
        let locator = this.page.locator(xpath);
        await locator.clear();
        await locator.fill(input);
    }

    async selectDropdownByLabel(label: string, item: string) {
        let dropdownXpath1 = `(//label[normalize-space(text())="${label}"]//following::select)[1]`;
        let dropdownXpath2 = `(//td[normalize-space(.)="${label}"]//following::select)[1]`;
        await this.page.locator(`${dropdownXpath1}|${dropdownXpath2}`).selectOption(item);
    }

    async clickRadioButtonByLabel(label: string, option: string) {
        let xpath = `(//legend[normalize-space(text())="${label}"]//following::label[normalize-space()="${option}"])[1]`;
        await this.page.locator(xpath).click();
    }

    // ─── Button & Navigation ───

    async clickButtonByLabel(label: string) {
        let buttonXpath = `//button[normalize-space()="${label}"]`;
        await this.page.locator(buttonXpath).click();
    }

    async clickMenuByLabel(label: string) {
        let xpath = `//div[contains(concat(' ',normalize-space(@class),' '),' admin-navigation ')]//a[normalize-space()="${label}"]`;
        await this.page.locator(xpath).click();
    }

    // ─── Assertions ───

    async verifyValidationMessageByLabel(label: string, message: string) {
        let messageXpath = `(//label[normalize-space(text())="${label}"]//following::p[contains(concat(' ',normalize-space(@class),' '),' field-error ') and normalize-space()="${message}"])[1]`;
        await expect(this.page.locator(messageXpath)).toBeVisible();
    }

    async verifyPopupMessage(message: string) {
        let xpath = `//*[@role='alert' and normalize-space()='${message}']`;
        await expect(this.page.locator(xpath)).toBeVisible();
    }

    // ─── Getters ───

    async getFieldValueByLabel(label: string) {
        let xpath = `(//label[normalize-space(text())="${label}"]//following::input)[1]`;
        let value = await this.page.locator(xpath).inputValue();
        return value.trim();
    }

    // ─── API Helpers ───

    async buildCookieHeader() {
        let cookies = await this.page.context().cookies();
        let asidObj = cookies.find(o => o.name == 'asid');
        let sidObj = cookies.find(o => o.name == 'sid');
        let cookiesHeader = `asid=${asidObj?.value}; sid=${sidObj?.value}`;
        return cookiesHeader;
    }

    async deleteEntityByApi(entityPath: string, entityId: string, cookiesHeader: string) {
        let url = `${UI_BASE_URL}/api/${entityPath}/${entityId}`;
        let myRequest = await request.newContext();
        await myRequest.delete(url, {
            headers: { cookie: cookiesHeader }
        });
    }

    async createEntityByApi(entityPath: string, requestBody: any, cookiesHeader: string) {
        let myRequest = await request.newContext();
        return await myRequest.post(`${UI_BASE_URL}/api/${entityPath}`, {
            headers: { cookie: cookiesHeader },
            data: requestBody
        });
    }
}
```

### Step 2: Create feature page classes

Each page class represents one page of the application. It inherits `CommonPage` and adds page-specific actions.

**Template — `model/pages/<feature>-page.ts`:**

```typescript
import { expect, Page } from "@playwright/test";
import { CommonPage } from "../common-page";

export class <Feature>Page extends CommonPage {
    constructor(page: Page) {
        super(page);
    }

    // Page-specific assertion: verify you're on this page
    async isDisplay() {
        await expect(this.page.locator('.page-heading-title')).toHaveText('<Expected Heading>');
    }

    // Page-specific actions
    async doSomething(param: string) {
        // Use inherited methods: this.inputTextByLabel(), this.clickButtonByLabel(), etc.
        // Or use direct Playwright locators for page-specific elements
    }
}
```

**Example — Login Page:**

```typescript
import { expect, Page } from "@playwright/test";
import { CommonPage } from "../common-page";
import { ADMIN_PASSWORD, ADMIN_USERNAME, UI_ADMIN_LOGIN_URL } from "../utils/constants-utils";

export class LoginPage extends CommonPage {
    constructor(page: Page) {
        super(page);
    }

    async adminLogin() {
        await this.page.goto(UI_ADMIN_LOGIN_URL);
        await this.inputTextboxByLabel('Email', ADMIN_USERNAME);
        await this.inputTextboxByLabel('Password', ADMIN_PASSWORD);
        await this.clickButtonByLabel('SIGN IN');
        await expect(this.page.locator('.page-heading-title')).toHaveText('Dashboard');
    }
}
```

**Example — List Page (with search):**

```typescript
import { expect, Page } from "@playwright/test";
import { CommonPage } from "../common-page";

export class ProductsPage extends CommonPage {
    constructor(page: Page) {
        super(page);
    }

    async isDisplay() {
        await expect(this.page.locator('//table[.//th[normalize-space()="Thumbnail"] and .//th[normalize-space()="SKU"]]')).toBeVisible();
    }

    async searchProduct(input: string) {
        let locator = this.page.locator("#field-keyword");
        await locator.click();
        await locator.clear();
        await locator.fill(input);
        await this.page.keyboard.press('Enter');
    }

    async selectProductByName(name: string) {
        let xpath = `//a[normalize-space()="${name}"]`;
        await this.page.locator(xpath).click();
    }
}
```

**Example — Detail/Edit Page (with URL parsing):**

```typescript
import { expect, Page } from "@playwright/test";
import { CommonPage } from "../common-page";

export class EditProductPage extends CommonPage {
    constructor(page: Page) {
        super(page);
    }

    async isDisplay(productName: string) {
        await expect(this.page.getByText(productName)).toBeVisible();
    }

    getProductId() {
        let url = this.page.url();
        let urlSplitted = url.split('/');
        return urlSplitted[urlSplitted.length - 1].trim();
    }
}
```

**Example — Create Page (with file upload):**

```typescript
import { expect, Page } from "@playwright/test";
import { CommonPage } from "../common-page";
import path from "path";

export class NewProductPage extends CommonPage {
    constructor(page: Page) {
        super(page);
    }

    async isDisplay() {
        await expect(this.page.locator('.page-heading-title')).toHaveText('Create a new product');
    }

    async uploadImage(filePath: string) {
        let xpath = `//*[@id='image-uploader-wrapper']//input[@type='file']`;
        let absolutePath = path.join(process.cwd(), filePath);
        await this.page.locator(xpath).setInputFiles(absolutePath);
    }
}
```

## XPath Locator Strategy

All locators use XPath with `normalize-space()` for resilient text matching:

| Pattern | XPath Template |
|---|---|
| Input by label | `(//label[normalize-space(text())="${label}"]//following::input)[1]` |
| Textarea by label | `(//label[normalize-space(text())="${label}"]//following::textarea)[1]` |
| Button by text | `//button[normalize-space()="${label}"]` |
| Select by label | `(//label[normalize-space(text())="${label}"]//following::select)[1]` |
| Radio by legend+label | `(//legend[normalize-space(text())="${label}"]//following::label[normalize-space()="${option}"])[1]` |
| Link by text | `//a[normalize-space()="${name}"]` |
| Validation error | `(//label[...]//following::p[contains(@class,' field-error ') and normalize-space()="${message}"])[1]` |
| Alert/popup | `//*[@role='alert' and normalize-space()='${message}']` |
| Navigation menu | `//div[contains(@class,' admin-navigation ')]//a[normalize-space()="${label}"]` |

## Rules

1. **Every page class MUST extend `CommonPage`**
2. **Pass `Page` via constructor** — never store it globally
3. **Favor inherited generic methods** over duplicating locator logic
4. **Add `isDisplay()` method** to each page for page-load verification
5. **Use XPath** as the primary locator strategy; use Playwright built-in locators (`getByRole`, `getByText`) only when XPath is impractical
6. **API helpers** belong in `CommonPage` since any page may need to call APIs for setup/teardown
7. **Import constants** from `constants-utils.ts` — never hardcode URLs or credentials
