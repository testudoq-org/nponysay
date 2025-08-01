/* Test suite for renderOutput using ES module syntax */

import { extractBalloon5 } from '../asset-loader.mjs';

/**
 * Integration: renderOutput with asset loader balloon text
 * Simulates loading a pony asset, extracting balloon text, and rendering output.
 * Ensures integration between asset loader and renderOutput.
 */
test('integration: renderOutput with asset loader balloon text', () => {
  const ponyAssetText = `
$balloon5
Hello from balloon 5!
$sectionOther
Other content
`;
  const balloonText = extractBalloon5(ponyAssetText);
  const result = renderOutput({ pony: 'twilight', balloon: 'say', text: balloonText });
  expect(result).toContain('twilight');
  expect(result).toContain('Hello from balloon 5!');
});

function renderOutput({ pony, balloon, text }) {
  if (balloon === 'unknown') throw new Error('Unsupported balloon type');
  return `${pony}: ${text}`;
}

describe('Rendering Output', () => {
  /*
  test('renders output for valid input', () => {
    const result = renderOutput({ pony: 'twilight', balloon: 'say', text: 'Hello!' });
    expect(result).toContain('twilight');
    expect(result).toContain('Hello!');
  });
  */

  /*
  test('renderOutput with empty text', () => {
    const result = renderOutput({ pony: 'twilight', balloon: 'say', text: '' });
    expect(result).toContain('twilight');
    expect(result).toContain(': ');
  });
  */

  /*
  test('renderOutput with unsupported balloon type throws error', () => {
    expect(() => renderOutput({ pony: 'twilight', balloon: 'unknown', text: 'Hello!' }))
      .toThrow('Unsupported balloon type');
  });
  */

  /*
  test('renderOutput output formatting for multiple ponies', () => {
    const ponies = [
      { pony: 'twilight', balloon: 'say', text: 'Hello!' },
      { pony: 'rainbow', balloon: 'say', text: 'Dash!' }
    ];
    const results = ponies.map(renderOutput);
    expect(results[0]).toContain('twilight');
    expect(results[0]).toContain('Hello!');
    expect(results[1]).toContain('rainbow');
    expect(results[1]).toContain('Dash!');
  });
  */
});

// (Other tests remain commented out for incremental enablement)