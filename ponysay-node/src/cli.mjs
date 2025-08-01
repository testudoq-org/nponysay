/**
 * ponysay-node CLI entrypoint
 * Adds --debug flag support: debug output is only shown if --debug is present.
 * All debug output should use debugLog().
 */

// Parse CLI arguments for --debug flag
const argv = process.argv.slice(2);
const debugEnabled = argv.includes('--debug');

// Debug logging function: only logs if --debug is present
function debugLog(...args) {
 if (debugEnabled) {
   console.error('[DEBUG]', ...args);
 }
}

// Debug: Print path info for diagnosis (after initialization)
debugLog('import.meta.url:', import.meta.url);
debugLog('process.cwd:', process.cwd());
debugLog('CLI entry: argv =', process.argv);

/**
 * Parse CLI arguments for message and options.
 * The first positional argument is the message.
 * If no message is provided, show usage/help and exit.
 */
const positional = argv.filter(arg => !arg.startsWith('--'));
const message = positional[0];

// Usage/help text
const usage = `
Usage: ponysay [--debug] [--pony NAME] [--balloon STYLE] <message>

  <message>         The text to display in the balloon (required)
  --pony NAME       Select a specific pony (optional)
  --balloon STYLE   Select a specific balloon style (optional)
  --debug           Show debug output
`;

// Show usage/help if no message is provided
if (!message) {
  debugLog(usage.trim());
  process.exit(1);
}

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { renderPony } from './render.mjs';
import { extractAllBalloons } from './asset-loader.mjs';

/**
 * Main CLI logic:
 * - Loads the requested pony asset.
 * - Extracts all $balloonNN sections.
 * - Calls renderPony with the correct arguments.
 * - Handles edge cases for missing message/balloon.
 */
(async () => {
  // Default pony if none specified (could be made configurable)
  // Parse --pony argument robustly
  let ponyName = 'applejack';
  const ponyArgIdx = argv.findIndex(arg => arg === '--pony' || arg.startsWith('--pony='));
  if (ponyArgIdx !== -1) {
    if (argv[ponyArgIdx] === '--pony' && argv[ponyArgIdx + 1] && !argv[ponyArgIdx + 1].startsWith('--')) {
      ponyName = argv[ponyArgIdx + 1].toLowerCase();
    } else if (argv[ponyArgIdx].startsWith('--pony=')) {
      ponyName = argv[ponyArgIdx].slice('--pony='.length).toLowerCase();
    }
  }

  // Load pony asset text
  let ponyText;
  let ponyPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../assets/ponies', `${ponyName}.pony`);
  try {
    ponyText = await fs.readFile(ponyPath, 'utf8');
    debugLog('Loaded pony asset:', ponyName);
  } catch (err) {
    // Fallback to applejack if not found
    if (ponyName !== 'applejack') {
      if (!debugEnabled) {
        debugLog(`Error: Could not load pony asset "${ponyName}". Falling back to Applejack.`);
      }
      ponyName = 'applejack';
      ponyPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../assets/ponies', 'applejack.pony');
      try {
        ponyText = await fs.readFile(ponyPath, 'utf8');
        debugLog('Loaded fallback pony asset: applejack');
      } catch (fallbackErr) {
        if (!debugEnabled) {
          debugLog('Error: Could not load fallback pony asset "applejack".');
        }
        process.exit(2);
      }
    } else {
      if (!debugEnabled) {
        debugLog('Error: Could not load pony asset "applejack".');
      }
      process.exit(2);
    }
  }

  // Extract all $balloonNN sections
  const balloons = extractAllBalloons(ponyText);
  debugLog('Extracted balloons:', Object.keys(balloons));

  // Pick the lowest-numbered balloon section if available
  let balloonSection = null;
  if (Object.keys(balloons).length > 0) {
    const lowest = Object.keys(balloons).map(Number).sort((a, b) => a - b)[0];
    balloonSection = `$balloon${lowest}`;
  }

  // Prepare the pony object for renderPony
  const ponyObj = {};
  for (const [num, art] of Object.entries(balloons)) {
    ponyObj[`$balloon${num}`] = art;
  }

  // Edge case: No balloon sections found, fallback to default balloon (handled by renderPony)
  // Edge case: No message provided (already handled above)
  // Edge case: Both message and balloon missing (should not occur, but print error if so)
  if (!message && !balloonSection) {
    if (!debugEnabled) {
      debugLog('Error: No message and no balloon art found. Nothing to display.');
    }
    process.exit(3);
  }

  // Render and print output
  const output = renderPony(ponyObj, ponyName, balloonSection, message, undefined);
  process.stdout.write(output);
})();

// TODO: Continue CLI implementation here...