# Project Rules — auto-ui-06

> These rules are derived from the actual source code patterns. All contributors (human and AI) MUST follow them.

---

## 1. Project Structure

- **NEVER** place source files outside the established directory structure:
  ```
  data/       → test data only
  env/        → .env files only
  model/      → page objects and utilities only
  tests/      → test specs only
  ```
- **NEVER** create `tsconfig.json` — Playwright handles TypeScript implicitly.
- **NEVER** change `"type": "commonjs"` in `package.json`.

---

## 2. Page Object Model

### 2.1 Inheritance
- Every page class **MUST** extend `CommonPage`.
- Every page class **MUST** accept `Page` as a constructor parameter and call `super(page)`.
- **NEVER** store `Page` globally or as a module-level variable — always pass through constructor.

### 2.2 CommonPage
- Generic UI interaction methods (input, click, select, verify) belong in `CommonPage`.
- API helper methods (`createEntityByApi`, `deleteEntityByApi`, `buildCookieHeader`) belong in `CommonPage`.
- **DO NOT** add page-specific logic to `CommonPage`. If a method is only relevant to one page, put it in that page's class.

### 2.3 Page-Specific Classes
- Each page class **SHOULD** have an `isDisplay()` method that asserts the page is correctly loaded.
- Page classes go in `model/pages/<page-name>-page.ts`.
- Class name **MUST** be PascalCase with `Page` suffix: `LoginPage`, `ProductsPage`, `EditProductPage`.

---

## 3. Locator Strategy

### 3.1 Primary: XPath with `normalize-space()`
- **ALL label-based locators MUST use XPath**, not CSS selectors.
- **ALWAYS** use `normalize-space()` for text matching to handle whitespace variations.
- Standard XPath patterns:

| Element | XPath Pattern |
|---|---|
| Input by label | `(//label[normalize-space(text())="${label}"]//following::input)[1]` |
| Textarea by label | `(//label[normalize-space(text())="${label}"]//following::textarea)[1]` |
| Button by text | `//button[normalize-space()="${label}"]` |
| Select by label | `(//label[normalize-space(text())="${label}"]//following::select)[1]` |
| Radio button | `(//legend[normalize-space(text())="${label}"]//following::label[normalize-space()="${option}"])[1]` |
| Link by text | `//a[normalize-space()="${name}"]` |
| Validation error | `(//label[...]//following::p[contains(concat(' ',normalize-space(@class),' '),' field-error ') and normalize-space()="${message}"])[1]` |
| Alert/popup | `//*[@role='alert' and normalize-space()='${message}']` |
| Navigation menu | `//div[contains(concat(' ',normalize-space(@class),' '),' admin-navigation ')]//a[normalize-space()="${label}"]` |

### 3.2 Secondary: Playwright Built-in Locators
- `getByRole()`, `getByText()`, `page.locator('#id')` — use **only** when XPath is impractical.
- Element IDs (`#field-keyword`, `#image-uploader-wrapper`) — use when a stable ID exists.

### 3.3 Forbidden
- **NEVER** use fragile CSS selectors that depend on DOM structure (e.g., `div > div > span`).
- **NEVER** use auto-generated class names or data attributes that may change between builds.

---

## 4. Environment & Configuration

- **NEVER** hardcode URLs, ports, usernames, or passwords in page objects or test specs.
- **ALWAYS** use constants from `model/utils/constants-utils.ts`.
- To add a new environment: create `env/.env.<name>` and an npm script `"test-<name>": "TEST_ENV=<name> npx playwright test tests/<app>"`.
- To add a new config variable: add it to **ALL** `.env.*` files, then export from `constants-utils.ts`.
- **NEVER** call `getEnv()` directly outside of `constants-utils.ts`.

---

## 5. Test Specs

### 5.1 Setup & Teardown
- Page objects **MUST** be instantiated in `test.beforeEach()`, never at module level.
- If tests create data, **MUST** track entity IDs in an array and delete them in `test.afterAll()`.
- Cookie header **MUST** be built after login: `cookieHeader = await loginPage.buildCookieHeader()`.

### 5.2 Test Naming
- Test names **MUST** start with `"Verify"` — e.g., `'Verify admin login successful'`.
- Test names **MUST** be descriptive of the expected behavior.

### 5.3 Data Uniqueness
- Use `new Date().getTime()` to generate unique values (names, SKUs, URLs) for each test run.
- **NEVER** use static/hardcoded values for entity creation that could collide across runs.

### 5.4 Imports
- Use `import { test } from '../../../model/utils/fixtures'` when auto-screenshot is needed.
- Use `import { test } from '@playwright/test'` only when auto-screenshot is NOT needed.
- `expect` is **ALWAYS** imported from `@playwright/test`.
- All imports use **relative paths** — no path aliases.

### 5.5 Allure Reporting
- Use `iStep("Human-readable action", async () => { ... })` to wrap logical groups of actions.
- Step names **MUST** describe the business action, NOT the technical implementation.
  - ✅ `"Create product by API"` 
  - ❌ `"POST /api/products"`

---

## 6. Test Data

- Test data files go in `data/<feature>/<feature>-data.ts`.
- Data-driven test cases **MUST** have a `testCaseName` field used as the test title.
- Field keys in `input` and `expect` objects **MUST** match visible UI labels (e.g., `'Email'`, `'Password'`).
- API body templates are exported as plain objects; **ALWAYS** clone before mutating: `{ ...template }`.
- Static test assets (images, files) go in `data/<feature>/images/`.

---

## 7. API Testing

- API calls **MUST** use cookies extracted from a prior UI login session (`buildCookieHeader()`).
- Use `request.newContext()` to create isolated request contexts.
- Route mocking (`page.route()`) **MUST** be set up BEFORE the action that triggers the API call.
- Use glob patterns for route matching: `'*/**/api/<endpoint>'`.

---

## 8. Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Page class | PascalCase + `Page` | `LoginPage`, `ProductsPage` |
| Spec file | kebab-case + `.spec.ts` | `login.spec.ts`, `new-product.spec.ts` |
| Data file | kebab-case + `-data.ts` | `login-data.ts`, `edit-product-data.ts` |
| Utility file | kebab-case + `-utils.ts` | `config-utils.ts`, `step-utils.ts` |
| Fixture file | `fixtures.ts` | `model/utils/fixtures.ts` |
| Folder names | kebab-case | `new-product`, `edit-product` |
| Test names | Start with `Verify` | `'Verify admin login successful'` |
| Variable names | camelCase | `loginPage`, `cookieHeader`, `productIds` |
| Constants | UPPER_SNAKE_CASE | `UI_BASE_URL`, `ADMIN_USERNAME` |

---

## 9. File Organization

### Tests mirror data and model structure:
```
tests/evershop/login/       ↔ data/login/       ↔ model/pages/login-page.ts
tests/evershop/new-product/  ↔ data/new-product/  ↔ model/pages/new-product-page.ts
tests/evershop/edit-product/ ↔ data/edit-product/ ↔ model/pages/edit-product-page.ts
```

- Each feature has a matching folder in `tests/`, `data/`, and a page class in `model/pages/`.
- **NEVER** put multiple unrelated features in the same spec file.

---

## 10. Forbidden Practices

| ❌ Don't | ✅ Do |
|---|---|
| Hardcode URLs in tests | Import from `constants-utils.ts` |
| Use CSS selectors for label-based lookups | Use XPath with `normalize-space()` |
| Instantiate page objects at module level | Instantiate in `beforeEach` |
| Leave created test data behind | Clean up in `afterAll` via API |
| Use static values for entity creation | Use `Date().getTime()` for uniqueness |
| Mutate shared data templates | Clone with `{ ...template }` first |
| Call `getEnv()` directly in page objects | Use exported constants from `constants-utils` |
| Add page-specific methods to `CommonPage` | Add to the specific page class |
| Use `test` from `@playwright/test` with fixtures | Import `test` from `model/utils/fixtures` |
| Name tests without `Verify` prefix | Start all test names with `Verify` |
