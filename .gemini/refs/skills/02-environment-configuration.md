# Skill: Multi-Environment Configuration

> **When to use:** Setting up environment-aware configuration so tests can run against local, staging, or any other environment.

## Goal

Create a `dotenv`-based configuration system that loads different `.env` files based on a `TEST_ENV` environment variable.

## Instructions

### Step 1: Create environment files

Create `env/.env.<environment>` for each target environment:

```bash
# env/.env.local
UI_HOST = 'http://localhost'
UI_PORT = '3000'
ADMIN_USERNAME = 'admin@example.com'
ADMIN_PASSWORD = 'password123'
```

```bash
# env/.env.stg
UI_HOST = 'https://staging.example.com'
UI_PORT = ''
ADMIN_USERNAME = 'admin@example.com'
ADMIN_PASSWORD = 'stg-password'
```

> **Convention:** The file name pattern is `.env.<environment>`. The default environment is `local`.

### Step 2: Create `model/utils/config-utils.ts`

```typescript
import * as dotenv from 'dotenv';

export function getEnv(name: string) {
    let currentEnv = 'local';
    if (!!process.env.TEST_ENV) {
        currentEnv = process.env.TEST_ENV;
    }
    dotenv.config({
        path: `env/.env.${currentEnv}`
    });
    return process.env[name];
}
```

**How it works:**
1. Checks `process.env.TEST_ENV` — if set, uses that value; otherwise defaults to `"local"`
2. Calls `dotenv.config()` pointing to the matching `.env` file
3. Returns the requested variable from `process.env`

### Step 3: Create `model/utils/constants-utils.ts`

```typescript
import { getEnv } from "./config-utils";

export const UI_HOST = getEnv('UI_HOST');
export const UI_PORT = getEnv('UI_PORT');
export const UI_BASE_URL = `${UI_HOST}${UI_PORT ? ':' + UI_PORT : ''}`;
export const UI_ADMIN_LOGIN_URL = `${UI_BASE_URL}/admin/login`;
export const ADMIN_USERNAME = getEnv('ADMIN_USERNAME');
export const ADMIN_PASSWORD = getEnv('ADMIN_PASSWORD');
```

**Pattern:** All constants are derived from env vars at module load time. Other files import constants from here — never call `getEnv()` directly outside this file.

### Step 4: Add npm scripts

```json
{
  "scripts": {
    "test-local": "npx playwright test tests/<app-name>",
    "test-stg": "TEST_ENV=stg npx playwright test tests/<app-name>"
  }
}
```

## How to add a new environment

1. Create `env/.env.<new-env>` with the required variables
2. Add an npm script: `"test-<new-env>": "TEST_ENV=<new-env> npx playwright test tests/<app-name>"`

## How to add a new config variable

1. Add the variable to **all** `.env.*` files
2. Export it from `constants-utils.ts`: `export const MY_VAR = getEnv('MY_VAR');`
3. Import from `constants-utils` in page objects or tests

## Rules

- **Never hardcode URLs or credentials** in page objects or test specs
- **Always use constants** exported from `constants-utils.ts`
- **URL construction:** Use `UI_BASE_URL` as the base; append paths as needed (e.g., `${UI_BASE_URL}/api/products`)
- **Port handling:** `UI_BASE_URL` automatically omits port if `UI_PORT` is empty
