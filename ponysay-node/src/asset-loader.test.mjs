// Example Jest test for asset loader (ES6 .mjs)

import { loadPonies } from './assets.mjs';

/**
 * Unit test for loadPonies function.
 */
describe('loadPonies', () => {
  it('returns valid pony assets', () => {
    const ponies = loadPonies();
    expect(Array.isArray(ponies)).toBe(true);
    expect(ponies.length).toBeGreaterThan(0);
    expect(ponies[0]).toHaveProperty('name');
    expect(ponies[0]).toHaveProperty('content');
  });

  it('handles missing asset directory gracefully', () => {
    // Simulate missing directory scenario
    // Implementation depends on loadPonies error handling
    // expect(() => loadPonies('missing/path')).toThrow();
  });
});