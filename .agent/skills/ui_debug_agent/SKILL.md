---
name: UI Debug Agent
description: Skill inspect web applications bằng browser tools, phân tích DOM elements, xác định locators ổn định và hỗ trợ sinh UI automation scripts.
---

# UI Debug Agent

## Description

This skill enables the agent to inspect web applications using browser debug tools (Playwright MCP, Selenium MCP, or Chrome DevTools).

The agent can analyze DOM elements, identify stable locators, capture UI state, and assist in generating UI automation scripts.

---

## When to Use

Use this skill when tasks involve:

- Exploring UI elements on a live web page
- Debugging UI automation tests (element not found, wrong element)
- Analyzing DOM structure to find stable locators
- Capturing UI state before/after interactions
- Verifying element visibility, enabled state, text content

---

## Workflow

### 1. Open Target Page
- Use Playwright MCP or Selenium MCP to navigate to the target URL
- Set viewport to desktop size (1920x1080) as required by rules
- Use headed mode for debugging

### 2. Inspect DOM
- Use accessibility snapshot or DOM inspection to analyze elements
- Identify element attributes: `id`, `data-testid`, `name`, `aria-label`, `role`, `placeholder`
- Capture the HTML structure of target elements

### 3. Generate Locators
- Apply locator priority from `.agent/rules/locator_strategy.md`
- For Playwright: prefer semantic locators (`getByRole`, `getByLabel`, etc.)
- For Selenium: prefer `id`, `data-testid`, `name`, then CSS
- Validate locator uniqueness on the page

### 4. Execute & Verify
- Interact with elements to verify locators work
- Check element state (visible, enabled, text content)
- Capture before/after screenshots if needed

---

## Inputs

The skill may receive:

- Application URL
- Specific page or module to inspect
- DOM elements or HTML snippets
- UI steps to execute
- Screenshots for reference

---

## Output

- Locator suggestions (primary + fallback)
- UI element analysis (attributes, state, hierarchy)
- Automation recommendations (Page Object structure)
- DOM structure report

---

## Important Rules

- **NEVER guess selectors** — Always inspect real DOM
- **Headed mode for debug** — Only headless after tests pass
- **Desktop viewport** — Use 1920x1080 for UI debugging
- **Smart waits only** — No hard sleep or fixed delays

---

## Rules References

- `.agent/rules/playwright_rules.md` — Playwright browser setup and locator rules
- `.agent/rules/locator_strategy.md` — Master locator priority map
- `.agent/rules/selenium_rules.md` — Selenium locator and wait rules
- `.agent/rules/automation_rules.md` — General automation best practices