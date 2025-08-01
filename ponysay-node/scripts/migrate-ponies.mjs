// Migrate and deduplicate legacy .pony files to assets/ponies/
// - Copies from legacy/ponies and legacy/extraponies
// - Deduplicates by content
// - Standardizes filenames (lowercase, no spaces, safe chars)
// - Logs and flags files with encoding/format issues

import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

/**
 * Standardize filename: lowercase, replace spaces, remove illegal chars.
 * @param {string} name
 * @returns {string}
 */
function standardizeFilename(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_\-\.]/g, '');
}

/**
 * Compute SHA256 hash of file content.
 * @param {Buffer} buf
 * @returns {string}
 */
function hashBuffer(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

const legacyDirs = [
  '../assets/legacy/ponies',
  '../assets/legacy/extraponies',
];
const destDir = path.resolve('ponysay-node/assets/ponies');
const logPathFixed = path.resolve('ponysay-node/assets/ponies-migration.log');
const reviewPathFixed = path.resolve('ponysay-node/assets/ponies-manual-review.txt');

async function main() {
  const seenHashes = new Map();
  const log = [];
  const review = [];

  // Ensure destination and log directories exist
  try {
    await fs.mkdir(destDir, { recursive: true });
    await fs.mkdir(path.dirname(logPathFixed), { recursive: true });
  } catch (e) {
    console.error('Failed to create directories:', e);
    process.exit(1);
  }

  for (const srcDir of legacyDirs) {
    let files;
    try {
      files = await fs.readdir(srcDir);
    } catch (e) {
      log.push(`ERROR: Cannot read dir ${srcDir}: ${e.message}`);
      continue;
    }
    for (const file of files) {
      if (!file.endsWith('.pony')) continue;
      const srcPath = path.join(srcDir, file);
      let buf;
      try {
        buf = await fs.readFile(srcPath);
      } catch (e) {
        log.push(`ERROR: Cannot read file ${srcPath}: ${e.message}`);
        review.push(srcPath);
        continue;
      }
      // Validate encoding (UTF-8)
      try {
        buf.toString('utf8');
      } catch (e) {
        log.push(`ENCODING ISSUE: ${srcPath}: ${e.message}`);
        review.push(srcPath);
        continue;
      }
      // Validate minimal .pony format (first line starts with "ponysay")
      const lines = buf.toString('utf8').split(/\r?\n/);
      if (!lines[0].toLowerCase().includes('ponysay')) {
        log.push(`FORMAT ISSUE: ${srcPath}: missing ponysay header`);
        review.push(srcPath);
      }
      const hash = hashBuffer(buf);
      if (seenHashes.has(hash)) {
        log.push(`DUPLICATE: ${srcPath} == ${seenHashes.get(hash)}`);
        continue;
      }
      seenHashes.set(hash, srcPath);
      // Standardize filename
      const stdName = standardizeFilename(file);
      const destPath = path.join(destDir, stdName);
      try {
        await fs.copyFile(srcPath, destPath, fs.constants.COPYFILE_EXCL);
        log.push(`COPIED: ${srcPath} -> ${destPath}`);
      } catch (e) {
        log.push(`ERROR: Could not copy ${srcPath} to ${destPath}: ${e.message}`);
        review.push(srcPath);
      }
    }
  }
  await fs.writeFile(logPathFixed, log.join('\n'), 'utf8');
  await fs.writeFile(reviewPathFixed, review.join('\n'), 'utf8');
  console.log('Migration complete. See log and manual review files.');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});