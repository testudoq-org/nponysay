/**
 * Ponysay Node CLI Entry Point
 * Defaults: --pony twilight --balloon round if not specified
 */

import path from 'path';
import fs from 'fs';
import { argv } from 'process';
import minimist from 'minimist';
import { loadPonies, loadBalloons, loadQuotes } from './assets.mjs';
import { renderPony } from './render.mjs';
import { extractBalloon5, extractAllBalloons } from './asset-loader.mjs';

// Parse CLI arguments
const args = minimist(argv.slice(2));
const message = args._[0] || 'Hello world!';

// Default pony and balloon
const DEFAULT_PONY = 'twilight';
const DEFAULT_BALLOON = 'round';

// Load assets
const ponies = loadPonies();
const balloons = loadBalloons();
const quotes = loadQuotes();

// Helper: check if asset exists
function assetExists(assetList, name) {
  return assetList.some(a => a.name === name);
}

// Determine pony and balloon to use
let ponyName = args.pony || DEFAULT_PONY;
let balloonName = args.balloon || DEFAULT_BALLOON;

// Validate pony
if (!assetExists(ponies, ponyName)) {
  if (assetExists(ponies, DEFAULT_PONY)) {
    console.warn(`[WARN] Pony "${ponyName}" not found. Using default: "${DEFAULT_PONY}".`);
    ponyName = DEFAULT_PONY;
  } else {
    console.error('[ERROR] No pony assets found. Please add pony assets to the assets directory.');
    process.exit(1);
  }
}

// Validate balloon
if (!assetExists(balloons, balloonName)) {
  if (assetExists(balloons, DEFAULT_BALLOON)) {
    console.warn(`[WARN] Balloon "${balloonName}" not found. Using default: "${DEFAULT_BALLOON}".`);
    balloonName = DEFAULT_BALLOON;
  } else {
    console.error('[ERROR] No balloon assets found. Please add balloon assets to the assets directory.');
    process.exit(1);
  }
}

// List ponies
if (args['list-ponies']) {
  console.log('Available ponies:');
  ponies.forEach(p => console.log('-', p.name));
  process.exit(0);
}

// List balloons
if (args['list-balloons']) {
  console.log('Available balloons:');
  balloons.forEach(b => console.log('-', b.name));
  process.exit(0);
}

// Show random quote
if (args['random-quote']) {
  const allQuotes = Object.values(quotes).flat();
  if (allQuotes.length === 0) {
    console.error('[ERROR] No quotes found.');
    process.exit(1);
  }
  const randomQuote = allQuotes[Math.floor(Math.random() * allQuotes.length)];
  console.log(randomQuote);
  process.exit(0);
}

// Render the pony with balloon and message
const ponyAssetPath = path.join(path.dirname(new URL(import.meta.url).pathname), '../assets/ponies', `${ponyName}.pony`);
let ponyText = '';
try {
  ponyText = fs.readFileSync(ponyAssetPath, 'utf8');
} catch (e) {
  console.error('[ERROR] Could not read pony asset:', ponyAssetPath);
  process.exit(1);
}
/**
 * Extract all $balloonNN sections and expose as properties on the pony object.
 * Select the correct balloon section based on CLI/user input, defaulting to the lowest-numbered balloon.
 */
const allBalloons = extractAllBalloons(ponyText);

// Attach all $balloonNN sections as $balloon{NN} properties
const pony = { name: ponyName };
for (const [num, art] of Object.entries(allBalloons)) {
  pony[`$balloon${num}`] = art;
}

// Determine which balloon section to use:
// 1. If user specifies --balloonNN, use that section if present.
// 2. Otherwise, use the lowest-numbered $balloonNN section if any.
// 3. If none, fallback to generic balloon logic in renderPony.
let selectedBalloonNum = null;
const balloonArgMatch = (args.balloon || '').match(/^balloon(\d+)$/);
if (balloonArgMatch && allBalloons[balloonArgMatch[1]]) {
  selectedBalloonNum = balloonArgMatch[1];
} else if (Object.keys(allBalloons).length > 0) {
  // Find the lowest-numbered balloon section
  selectedBalloonNum = Object.keys(allBalloons)
    .map(Number)
    .sort((a, b) => a - b)[0]
    .toString();
}

// Pass the selected balloon section name (e.g., "balloon5") to renderPony
const selectedBalloonSection = selectedBalloonNum ? `$balloon${selectedBalloonNum}` : null;

const balloon = balloons.find(b => b.name === balloonName);

if (!pony || !balloon) {
  console.error('[ERROR] Required assets missing after validation.');
  process.exit(1);
}

const argvRaw = process.argv.slice(2);
const useColor =
  argvRaw.includes('--color') ? true :
  argvRaw.includes('--no-color') ? false :
  undefined; // undefined means auto-detect later

console.log(renderPony(pony, ponyName, selectedBalloonSection, message, useColor));