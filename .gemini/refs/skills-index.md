# Skills Index — Playwright UI Test Automation

> **Purpose:** These skills capture all patterns and conventions from the `auto-ui-06` project. Use them as instructions to generate code for new Playwright test automation projects targeting any web application.

## How to Use

1. **New project?** → Start with **Skill 01** (scaffolding), then **Skill 02** (env config)
2. **Adding pages?** → Follow **Skill 03** (Page Object Model)
3. **Adding reporting?** → Follow **Skill 04** (Fixtures & Allure)
4. **Adding test data?** → Follow **Skill 05** (Data-Driven Testing)
5. **Adding API setup/mock?** → Follow **Skill 06** (API Testing & Mocking)
6. **Writing tests?** → Copy a template from **Skill 07** (Test Spec Patterns)

## Skills

| # | Skill | File | Description |
|---|---|---|---|
| 01 | [Project Scaffolding](./skills/01-project-scaffolding.md) | `01-project-scaffolding.md` | Initialize project, install deps, create folder structure |
| 02 | [Environment Configuration](./skills/02-environment-configuration.md) | `02-environment-configuration.md` | Multi-env setup with dotenv (local, staging, etc.) |
| 03 | [Page Object Model](./skills/03-page-object-model.md) | `03-page-object-model.md` | CommonPage base class + feature page classes + XPath strategy |
| 04 | [Fixtures & Allure](./skills/04-fixtures-and-allure.md) | `04-fixtures-and-allure.md` | Auto-screenshot on failure + Allure step reporting |
| 05 | [Data-Driven Testing](./skills/05-data-driven-testing.md) | `05-data-driven-testing.md` | Parameterized tests with external data arrays |
| 06 | [API Testing & Mocking](./skills/06-api-testing-and-mocking.md) | `06-api-testing-and-mocking.md` | Cookie auth, CRUD via API, route mocking for errors |
| 07 | [Test Spec Patterns](./skills/07-test-spec-patterns.md) | `07-test-spec-patterns.md` | Ready-to-use test spec templates for all scenarios |

## Quick Reference: Generating a New Project

To generate a complete test automation project for a new web application, provide these skills as context along with your prompt. Example prompt:

```
Using the skills in refs/skills/, generate a Playwright test automation project for
[application name] with the following test scenarios:
- [scenario 1]
- [scenario 2]
- ...

The application's pages are:
- [page 1]: [URL, key elements]
- [page 2]: [URL, key elements]
- ...

Environment:
- Local: [host:port]
- Staging: [host:port]
```

The AI will use the skills to generate:
- ✅ Correct project structure (`data/`, `env/`, `model/`, `tests/`)
- ✅ CommonPage base class with XPath locator methods
- ✅ Feature-specific page objects extending CommonPage
- ✅ Multi-environment config (dotenv)
- ✅ Custom fixtures with auto-screenshot
- ✅ Allure step reporting
- ✅ Data-driven test data files
- ✅ Test specs following established patterns
- ✅ API setup/teardown with cookie auth
- ✅ Route mocking for negative scenarios
