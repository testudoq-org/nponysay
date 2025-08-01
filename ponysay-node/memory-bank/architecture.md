# Architecture Overview

> Ponysay Node is a modular CLI tool built with Node.js and ES6 `.mjs` modules. All new features and assets should comply with current standards.

Ponysay Node is a modular CLI tool for displaying ASCII art ponies with speech balloons. The architecture emphasizes separation of concerns, maintainability, and testability.

## Module Breakdown

- **CLI Entrypoint ([`src/index.mjs`](../src/index.mjs:1))**
  Handles argument parsing and dispatches commands. Uses `commander` for CLI options.

- **CLI Logic ([`src/cli.mjs`](../src/cli.mjs:1))**
  Implements command logic, processes user input, and coordinates rendering.

- **Rendering ([`src/render.mjs`](../src/render.mjs:1))**
  Contains functions for generating speech balloons and rendering ASCII ponies. Uses template strings for dynamic output and supports Unicode/ANSI via libraries like `chalk`.

- **Assets**
  ASCII art ponies, balloons, and quotes are stored in the `assets/` directory (planned: `assets/ponies/`, `assets/balloons/`, `assets/quotes/`). Assets are loaded asynchronously using `fs/promises`.

- **Testing**
  Unit tests are written in [`src/say.test.mjs`](../src/say.test.mjs:1) and related files, using Jest. E2E tests are in [`e2e/say.feature`](../e2e/say.feature:1) and [`e2e/say.steps.mjs`](../e2e/say.steps.mjs:1), using Playwright.

## Test Strategy

- **Unit Tests:**
  All core modules are covered by Jest tests. Test files are colocated with source or in a dedicated test directory.
  Run with `npx jest`.

- **E2E Tests:**
  User-facing CLI flows are tested with Playwright and Gherkin feature files.
  Run with `npx playwright test`.

## Asset Strategy

- **Organization:**
  All ASCII art and quote data are stored in `assets/`, separated by type.
- **Loading:**
  Assets are loaded on demand and may be cached for performance.
- **Extensibility:**
  New ponies, balloons, or quotes can be added by placing files in the appropriate subdirectory.

## Best Practices

- Use ES6+ syntax and `.mjs` modules.
- Format code with Prettier.
- Follow import order: Node.js built-ins, external, then local modules.
- Use `const`/`let`, avoid `var`.
- Prefer async/await for async code.
- Handle errors with try/catch.
- Add JSDoc comments for exported functions/classes.
- Avoid editing Ponysay-master; it is reference only.

**Key Decisions:**
- Use ECMAScript modules (.mjs) for all source files
- Separate code, assets, tests, and documentation
- Track migration and design changes in memory-bank
## 2025-07 Enhancements

- **Rendering Logic:** `render.cjs` now detects `$balloonNN` sections in `.pony` files, injects the user message, and displays only the balloon art if present. If not found, it falls back to the default balloon and suppresses ASCII art unless fallback is triggered.
- **.pony File Pattern:** Confirmed `$balloonNN` usage as section headers in pony assets. Detection logic uses regex and lowest-numbered section if multiple are present.
- **CLI Flag:** Added `--debug` flag. Debug output is only shown if this flag is supplied.
- **Text Prompt Handling:** The message is now the first positional argument. Usage/help is shown if no message is provided.
- **Edge Cases:** If both message and balloon are missing, a clear error or usage message is shown. Fallback logic is robust.
- **Documentation:** All new logic is explained inline in code and summarized here.
