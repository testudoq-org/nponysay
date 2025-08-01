// Migrate legacy ponyquotes files to per-pony JSON in assets/quotes/
// - Reads all files from assets/legacy/ponyquotes/
// - Groups by pony name, collects all quotes
// - Writes assets/quotes/<pony>.json
// - Logs and flags files with encoding/format issues

import fs from 'fs/promises';
import path from 'path';

/**
 * Extract pony name from filename (e.g., applejack.0 -> applejack)
 * @param {string} fname
 * @returns {string}
 */
function getPonyName(fname) {
  const m = fname.match(/^([^.]+)\./);
  return m ? m[1].toLowerCase() : null;
}

const srcDir = path.resolve('ponysay-node/assets/legacy/ponyquotes');
const destDir = path.resolve('ponysay-node/assets/quotes');
const logPath = path.resolve('ponysay-node/assets/quotes-migration.log');
const reviewPath = path.resolve('ponysay-node/assets/quotes-manual-review.txt');

async function main() {
  const log = [];
  const review = [];
  const ponyQuotes = {};

  let files;
  try {
    files = await fs.readdir(srcDir);
  } catch (e) {
    log.push(`ERROR: Cannot read dir ${srcDir}: ${e.message}`);
    await fs.writeFile(logPath, log.join('\n'), 'utf8');
    return;
  }

  for (const file of files) {
    if (file === 'ponies') continue; // skip index/listing files
    const pony = getPonyName(file);
    if (!pony) {
      log.push(`SKIP: Unrecognized filename ${file}`);
      continue;
    }
    const srcPath = path.join(srcDir, file);
    let content;
    try {
      content = await fs.readFile(srcPath, 'utf8');
    } catch (e) {
      log.push(`ERROR: Cannot read file ${srcPath}: ${e.message}`);
      review.push(srcPath);
      continue;
    }
    // Validate: non-empty, no binary
    if (!content.trim()) {
      log.push(`FORMAT ISSUE: Empty file ${srcPath}`);
      review.push(srcPath);
      continue;
    }
    // Split into lines, trim, filter empty
    const lines = content.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (!ponyQuotes[pony]) ponyQuotes[pony] = [];
    ponyQuotes[pony].push(...lines);
  }

  // Write per-pony JSON files
  for (const [pony, quotes] of Object.entries(ponyQuotes)) {
    const destPath = path.join(destDir, `${pony}.json`);
    try {
      await fs.writeFile(destPath, JSON.stringify({ pony, quotes }, null, 2), 'utf8');
      log.push(`WROTE: ${destPath} (${quotes.length} quotes)`);
    } catch (e) {
      log.push(`ERROR: Could not write ${destPath}: ${e.message}`);
      review.push(destPath);
    }
  }

  await fs.writeFile(logPath, log.join('\n'), 'utf8');
  await fs.writeFile(reviewPath, review.join('\n'), 'utf8');
  console.log('Ponyquotes migration complete. See log and manual review files.');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});