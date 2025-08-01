# Unit Testing Strategy for ES6 `.mjs` Codebase

## Overview
This strategy outlines best practices for unit testing ES6 modules in this project using Jest. It covers test organization, coverage, and CI integration.

## Test Organization
- Place unit tests alongside source files, using `.test.mjs` suffix (e.g., `say.test.mjs`).
- Group related tests by feature or module.
- Use descriptive test names and organize with `describe` blocks.

## Example Test Structure

```javascript
// [`src/example.test.mjs`](ponysay-node/src/example.test.mjs:1)
import { exampleFn } from './example.mjs';

describe('exampleFn', () => {
  it('returns expected value', () => {
    expect(exampleFn(2)).toBe(4);
  });
});
```

## ES6 Modules & Jest
- Use `.mjs` for all modules and tests.
- Configure Jest for ESM in [`jest.config.mjs`](ponysay-node/jest.config.mjs:1).
- Run all tests:  
  ```
  npx jest
  ```
- Run a single test file:  
  ```
  npx jest src/example.test.mjs
  ```

## Coverage
- Collect coverage with:
  ```
  npx jest --coverage
  ```
- Aim for high coverage, but prioritize meaningful tests over coverage numbers.
- Review coverage reports to identify untested code.

## Best Practices
- Test pure functions and logic in isolation.
- Mock dependencies for unit tests.
- Use `beforeEach`/`afterEach` for setup/teardown.
- Prefer async/await for async tests.
- Add JSDoc comments for exported functions/classes.

## Continuous Integration (CI)
- Integrate tests in CI pipelines (e.g., GitHub Actions).
- Fail builds on test or coverage failures.
- Example GitHub Actions step:
  ```yaml
  - name: Run unit tests
    run: npx jest --coverage
  ```

## Maintenance
- Update tests with code changes.
- Refactor tests for clarity and reliability.
- Remove obsolete tests.
