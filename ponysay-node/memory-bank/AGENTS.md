# AGENTS.md

## Build, Lint, and Test
- Use Node.js (ES6, .mjs modules).
- Build: No build step required unless specified.
- Lint: `npx eslint .`
- Unit tests: `npx jest`
- Run a single unit test: `npx jest path/to/test-file.mjs`
- E2E tests: `npx playwright test`
- Run a single E2E test: `npx playwright test path/to/test-file.mjs`
- Install dependencies: `npm install`

## Code Style Guidelines
- Use ES6+ syntax and `.mjs` modules.
- Format code with Prettier (`npx prettier --write .`).
- Import order: Node.js built-ins, external, then local modules.
- Use `const`/`let`, avoid `var`.
- Use camelCase for variables/functions, PascalCase for classes.
- Prefer async/await for async code.
- Handle errors with try/catch.
- Add JSDoc comments for exported functions/classes.
- Avoid editing Ponysay-master; it is reference only.
