# Jest Unit Test Strategy

## Coverage Goals
- Target: 90%+ code coverage across all modules.
- Prioritize critical modules: asset loading, rendering, CLI logic.

## Critical Modules/Functions
- Asset loaders (`loadPonies`, `loadBalloons`, `loadQuotes`)
- CLI argument parsing and error handling
- Balloon section extraction and selection logic
- Rendering output (including edge cases)

## Test Types
- Unit tests for pure functions and modules
- Integration tests for CLI and asset interactions
- Error handling: invalid assets, missing files, unsupported formats

## Example Test Case
```js
// asset-loader.test.mjs
import { loadPonies } from './assets.mjs';

test('loadPonies returns valid pony assets', () => {
  const ponies = loadPonies();
  expect(Array.isArray(ponies)).toBe(true);
  expect(ponies.length).toBeGreaterThan(0);
  expect(ponies[0]).toHaveProperty('name');
  expect(ponies[0]).toHaveProperty('content');
});
```

## Edge Cases
- Test with missing asset directories
- Test with corrupted or oversized asset files
- Test CLI with invalid arguments

## Next Steps
- Assign owners for test modules
- Set deadlines for coverage targets
- Track progress in project management tool