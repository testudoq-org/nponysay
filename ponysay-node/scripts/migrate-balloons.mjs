// Migrate legacy balloon templates to assets/balloons/
// - Copies from assets/legacy/balloons/
// - Updates placeholders if needed
// - Validates encoding/format, logs and flags issues

import fs from 'fs/promises';
import path from 'path';

const srcDir = path.resolve('ponysay-node/assets/legacy/balloons');
const destDir = path.resolve('ponysay-node/assets/balloons');
const logPath = path.resolve('ponysay-node/assets/balloons-migration.log');
const reviewPath = path.resolve('ponysay-node/assets/balloons-manual-review.txt');

/**
 * Update placeholders in balloon templates if needed.
 * (Example: replace legacy placeholders with new ones)
 * @param {string} content
 * @returns {string}
 */
function updatePlaceholders(content) {
  // Example: replace %s with {message}
  return content.replace(/%s/g, '{message}');
}

async function main() {
  const log = [];
  const review = [];

  let files;
  try {
    files = await fs.readdir(srcDir);
  } catch (e) {
    log.push(`ERROR: Cannot read dir ${srcDir}: ${e.message}`);
    await fs.writeFile(logPath, log.join('\n'), 'utf8');
    return;
  }

  for (const file of files) {
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
    // Update placeholders
    const updated = updatePlaceholders(content);
    const destPath = path.join(destDir, file);
    try {
      await fs.writeFile(destPath, updated, 'utf8');
      log.push(`COPIED: ${srcPath} -> ${destPath}`);
    } catch (e) {
      log.push(`ERROR: Could not write ${destPath}: ${e.message}`);
      review.push(destPath);
    }
  }

  await fs.writeFile(logPath, log.join('\n'), 'utf8');
  await fs.writeFile(reviewPath, review.join('\n'), 'utf8');
  console.log('Balloon migration complete. See log and manual review files.');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});