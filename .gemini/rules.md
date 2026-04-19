# Playwright UI Test Automation — Project Rules

This is a Playwright + TypeScript (CommonJS) test automation framework using Page Object Model. Target app: EverShop e-commerce admin panel.

## Architecture
- `model/common-page.ts` — base class all pages extend. Contains generic label-based XPath methods + API helpers.
- `model/pages/<name>-page.ts` — feature page classes extending CommonPage.
- `model/utils/` — config-utils (dotenv), constants-utils (URL/credentials), fixtures (auto-screenshot), step-utils (Allure).
- `data/<feature>/` — test data files. `tests/<app>/<feature>/` — test specs.

## Mandatory Rules
1. Every page class MUST extend `CommonPage` and accept `Page` via constructor.
2. ALL label-based locators MUST use XPath with `normalize-space()`. NO CSS selectors for label lookup.
3. NEVER hardcode URLs or credentials — use constants from `model/utils/constants-utils.ts`.
4. NEVER call `getEnv()` outside `constants-utils.ts`.
5. Page objects MUST be instantiated in `test.beforeEach()`, not at module level.
6. Test names MUST start with `"Verify"`.
7. Use `new Date().getTime()` for unique test data — never static values.
8. ALWAYS clean up created entities in `test.afterAll()` via API delete.
9. ALWAYS clone data templates before mutation: `{ ...template }`.
10. Import `test` from `model/utils/fixtures` for auto-screenshot; `expect` always from `@playwright/test`.
11. Use `iStep()` from `step-utils` for Allure reporting — step names must be business-readable.
12. Route mocking (`page.route()`) MUST be set up BEFORE the triggering action.
13. API calls use cookies from `buildCookieHeader()` after UI login — never standalone.

## Naming
- Page classes: PascalCase + `Page` suffix (e.g., `LoginPage`)
- Spec files: kebab-case + `.spec.ts` (e.g., `login.spec.ts`)
- Data files: kebab-case + `-data.ts` (e.g., `login-data.ts`)
- Utils: kebab-case + `-utils.ts` (e.g., `config-utils.ts`)
- Constants: UPPER_SNAKE_CASE (e.g., `UI_BASE_URL`)

## Reference
See `refs/memory-bank.md` for full architecture details and `refs/skills/` for code generation templates.
