---
name: QA Automation Engineer
description: Skill hỗ trợ agent thực hiện các tác vụ QA automation testing bao gồm generate test cases, automation scripts, API tests, locators, phân tích flaky tests, và tạo test data.
---

# QA Automation Engineer

## Description

This skill enables the agent to assist with software testing and automation tasks.

The agent can:

- Generate manual test cases from requirements
- Generate test automation scripts from test cases or UI flows
- Generate API tests from Swagger/OpenAPI specifications
- Explore applications and discover test scenarios
- Generate automation frameworks
- Generate test data
- Analyze flaky tests
- Generate stable locators
- Generate requirements from website analysis

This skill is designed for modern QA workflows and automation development.

---

# When to Use

Use this skill when the user asks about:

- Test automation
- Manual testing
- Automation frameworks
- API testing
- UI testing
- Test data generation
- Flaky test debugging
- Locator generation
- Requirements analysis from website
- Jira integration (fetch requirements, push test results)
- Xray test management

Typical prompts include:

- Generate test cases from requirement
- Generate Selenium automation from test case
- Generate automation from UI steps
- Generate API tests from Swagger
- Generate regression suite
- Generate test data
- Analyze flaky test
- Generate locator for element
- Generate requirements from website

---

# Workflow Routing

When the user request matches a specific task, select the appropriate workflow file from `.agent/workflows/`.

### Generate test cases from requirements

> **Delegate:** Tác vụ này thuộc skill **`rbt_manual_testing`** — không phải `qa_automation_engineer`.

Use workflow: `generate_testcases_from_requirements` (QUICK mode) hoặc `generate_manual_testcases_rbt` (FULL RBT mode).

Triggers when user asks:

- generate test cases → **delegate to `rbt_manual_testing` (QUICK mode)**
- write manual test cases → **delegate to `rbt_manual_testing` (QUICK mode)**
- test scenarios from requirement → **delegate to `rbt_manual_testing` (QUICK mode)**
- sinh test cases đầy đủ / quy trình 6 bước → **delegate to `rbt_manual_testing` (FULL RBT mode)**

---

### Generate automation from manual test case

Use workflow: `generate_automation_from_testcases`

Triggers when user asks:

- convert test case to automation
- generate Selenium automation
- generate Playwright automation from test case

---

### Generate automation from UI steps

Use workflow: `generate_automation_from_ui_flow`

Triggers when user asks:

- automate this UI flow
- generate automation from steps
- run UI steps and generate Selenium script

---

### Generate API tests

Use workflow: `generate_api_tests_from_swagger`

Triggers when user provides:

- Swagger URL
- OpenAPI specification

---

### Generate test data

Use workflow: `generate_test_data`

Triggers when user asks:

- generate test data
- generate boundary test data

---

### Generate regression suite

Use workflow: `generate_regression_suite`

Triggers when user asks:

- create regression test suite
- generate regression scenarios

---

### Generate automation framework

Use workflow: `generate_automation_framework`

Triggers when user asks:

- create automation framework
- design Selenium framework
- design Playwright framework

---

### Explore application and generate test plan

Use workflow: `generate_application_test_plan`

Triggers when user asks:

- explore application
- discover test scenarios
- generate test plan

---

### Analyze flaky tests

Use workflow: `analyze_flaky_tests`

Triggers when user asks:

- why is this test flaky
- analyze unstable automation

---

### Generate full automation suite

Use workflow: `generate_full_automation_suite`

Triggers when user asks:

- generate full automation suite
- bootstrap automation for project

---

### Generate stable locators

Use workflow: `generate_locator`

Triggers when user asks:

- generate locator for this element
- find stable selector
- create automation locator

---

### Generate requirements from website

Use workflow: `generate_requirements_from_website`

Triggers when user asks:

- generate requirements from website
- analyze website module and create requirements
- extract user stories from web page

---

### Fetch requirements from Jira

Use workflow: `fetch_jira_requirements`

Triggers when user asks:

- fetch jira requirements
- lấy requirement từ jira
- get jira ticket
- import user stories from jira

---

### Import test results to Xray

Use workflow: `import_test_results_xray`

Triggers when user asks:

- push test results to xray
- đẩy kết quả test lên xray
- import test execution to jira
- upload playwright results to xray

---

# Automation Framework

Default automation stack:

- **Language:** Java
- **UI automation:** Selenium WebDriver or Playwright
- **Test framework:** TestNG
- **API automation:** REST Assured
- **Mobile automation:** Appium
- **Design pattern:** Page Object Model (POM)

---

# Locator Strategy

## Selenium Locator Priority

1. `id`
2. `data-testid`
3. `name`
4. `css selector`
5. `xpath` (last resort)

Avoid fragile locators such as auto-generated class names or positional xpaths.

## Playwright Locator Priority

1. `getByRole()`
2. `getByLabel()`
3. `getByPlaceholder()`
4. `getByText()`
5. `getByTestId()`
6. `css selector`
7. `xpath` (last resort)

Avoid fragile selectors such as dynamic class names.

> **Note:** For detailed locator rules, refer to `.agent/rules/locator_strategy.md`.

---

# Rules References

The agent MUST also follow the detailed rules defined in `.agent/rules/`:

- [automation_rules.md](.agent/rules/automation_rules.md) — General automation best practices
- [locator_strategy.md](.agent/rules/locator_strategy.md) — Detailed locator selection rules
- [playwright_rules.md](.agent/rules/playwright_rules.md) — Playwright-specific rules
- [selenium_rules.md](.agent/rules/selenium_rules.md) — Selenium-specific rules
- [appium_rules.md](.agent/rules/appium_rules.md) — Appium mobile automation rules

---

# References

The agent may consult additional documentation in the `references/` folder:

- `PROJECT_CONTEXT.md` — Project domain, tech stack, key modules
- `TEST_STRATEGY.md` — Testing objectives, scope, execution plan
- `REPOSITORY_MAP.md` — Repository structure and navigation guide
- `SELF_CHECK.md` — Quality checklist before completing tasks
- `PROMPT_TEMPLATES.md` — Reusable prompt templates for common QA tasks

---

# Output

Depending on the request, the agent may return:

- Manual test cases (structured format)
- Automation scripts (Java/TypeScript)
- API tests (REST Assured)
- Locator recommendations
- Test data (structured, randomized, traceable)
- Automation framework design
- Requirements documents

Automation outputs should include:

- Page Object classes
- Test classes
- Assertions validating expected behavior
- Clean, readable, maintainable code (no debug logs, no commented code)