# Skill: Project Scaffolding

> **When to use:** Starting a new Playwright UI test automation project from scratch.

## Goal

Set up a Playwright + TypeScript + Allure project with multi-environment support and Page Object Model structure.

## Instructions

### Step 1: Initialize the project

```bash
mkdir <project-name> && cd <project-name>
npm init -y
npx -y playwright install
```

### Step 2: Install dependencies

```bash
# Dev dependencies
npm install -D @playwright/test @types/node allure-playwright

# Runtime dependencies
npm install allure dotenv deep-object-diff
```

### Step 3: Set module system in `package.json`

```json
{
  "name": "<project-name>",
  "version": "1.0.0",
  "type": "commonjs",
  "scripts": {
    "test-local": "npx playwright test tests/<app-name>",
    "test-stg": "TEST_ENV=stg npx playwright test tests/<app-name>",
    "generate-report": "npx allure awesome --single-file allure-results"
  }
}
```

> **Convention:** Always scope npm test scripts to the specific app folder under `tests/` to avoid running unrelated spec files (e.g., `example.spec.ts`).

### Step 4: Create the directory structure

```
<project-name>/
├── data/                    # Test data files, organized by feature
│   └── <feature>/
│       └── <feature>-data.ts
├── env/                     # Environment config files
│   ├── .env.local
│   └── .env.stg
├── model/                   # Page Object Models & utilities
│   ├── common-page.ts       # Base page class
│   ├── pages/               # One file per page
│   │   └── <page-name>-page.ts
│   └── utils/               # Shared utilities
│       ├── config-utils.ts
│       ├── constants-utils.ts
│       ├── fixtures.ts
│       └── step-utils.ts
├── tests/                   # Test specs
│   └── <app-name>/          # Grouped by application
│       └── <feature>/
│           └── <feature>.spec.ts
├── playwright.config.ts
└── .gitignore
```

### Step 5: Create `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["line"], ["allure-playwright"]],
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

### Step 6: Create `.gitignore`

```
node_modules/
/test-results/
/playwright-report/
/blob-report/
/playwright/.cache/
/playwright/.auth/
allure-results
allure-report
```

## Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Page classes | PascalCase + `Page` suffix | `LoginPage`, `ProductsPage` |
| Spec files | kebab-case + `.spec.ts` | `login.spec.ts` |
| Data files | kebab-case + `-data.ts` | `login-data.ts` |
| Utility files | kebab-case + `-utils.ts` | `config-utils.ts` |
| Folders | kebab-case | `new-product`, `edit-product` |
