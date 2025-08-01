// Synchronous helpers for extracting $balloonNN sections from pony asset text (ES module version)

/**
 * Extract all $balloonNN sections from pony asset text.
 * Returns an object mapping balloon numbers (as strings) to their content.
 * @param {string} ponyText
 * @returns {Object} e.g. { "5": "...", "7": "..." }
 */
export function extractAllBalloons(ponyText) {
  const lines = ponyText.split('\n');
  const balloons = {};
  let currentNum = null;
  let sectionLines = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.trim().match(/^\$balloon(\d+)/);
    if (match) {
      // Save previous section if present
      if (currentNum !== null) {
        balloons[currentNum] = sectionLines.join('\n').replace(/\s+$/, '');
      }
      // Start new section
      currentNum = match[1];
      sectionLines = [];
      continue;
    }
    // If in a balloon section, stop at next $section or EOF
    if (currentNum !== null) {
      if (/^\$[a-zA-Z0-9]/.test(line.trim()) && !line.trim().startsWith('$balloon')) {
        balloons[currentNum] = sectionLines.join('\n').replace(/\s+$/, '');
        currentNum = null;
        sectionLines = [];
        continue;
      }
      sectionLines.push(line);
    }
  }
  // Save last section if file ends after a balloon
  if (currentNum !== null) {
    balloons[currentNum] = sectionLines.join('\n').replace(/\s+$/, '');
  }
  return balloons;
}

/**
 * Extract $balloon5 section from pony asset text.
 * @param {string} ponyText
 * @returns {string|null}
 */
export function extractBalloon5(ponyText) {
  const all = extractAllBalloons(ponyText);
  return all["5"] || null;
}