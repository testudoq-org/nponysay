/**
 * Node.js asset loader for ponysay-node (ES module version)
 */
import fsPromises from 'fs/promises';
import fs from 'fs';
import path from 'path';

/**
 * Logs debug output if --debug is set.
 * @param  {...any} args
 */
function debugLog(...args) {
  if (process && process.argv && process.argv.includes('--debug')) {
    console.log('[DEBUG]', ...args);
  }
}

/**
 * Asset types and their directories/extensions.
 */
const ASSET_TYPES = [
  { type: 'ponies', dir: 'assets/ponies', exts: ['.pony', '.asc', '.txt'] },
  { type: 'balloons', dir: 'assets/balloons', exts: ['.txt', '.template'] },
  { type: 'quotes', dir: 'assets/quotes', exts: ['.txt', '.json'] }
];

/**
 * Loads all assets asynchronously, with error handling and summary reporting.
 * @returns {Promise<Object>} Summary report of assets loaded, skipped, or failed.
 */
export async function loadAllAssets() {
  const summary = {};
  for (const { type, dir, exts } of ASSET_TYPES) {
    summary[type] = { loaded: [], skipped: [], failed: [] };
    const absDir = path.join(path.dirname(new URL(import.meta.url).pathname), '..', dir);
    let files;
    try {
      files = await fsPromises.readdir(absDir);
    } catch (err) {
      console.error(`[ASSETS] Missing directory: ${dir}`);
      summary[type].failed.push({ error: 'missing_directory', dir });
      continue;
    }
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (!exts.includes(ext)) {
        summary[type].skipped.push(file);
        continue;
      }
      const filePath = path.join(absDir, file);
      try {
        const content = await fsPromises.readFile(filePath, 'utf8');
        summary[type].loaded.push({ file, size: content.length });
      } catch (err) {
        console.error(`[ASSETS] Failed to load ${type} asset: ${file}`, err);
        summary[type].failed.push({ file, error: err.message });
      }
    }
    // Fallback: If no assets loaded, log warning
    if (summary[type].loaded.length === 0) {
      console.warn(`[ASSETS] No ${type} assets loaded from ${dir}`);
    }
  }
  return summary;
}

/**
 * Loads assets and prints a JSON summary report.
 */
export async function main() {
  const report = await loadAllAssets();
  // Print summary as JSON
  console.log('[ASSETS] Summary report:');
  console.log(JSON.stringify(report, null, 2));
}

/**
 * Lists available asset names for a given type.
 * @param {string} type - 'ponies', 'balloons', or 'quotes'
 * @returns {Promise<string[]>}
 */
export async function listAssets(type) {
  const entry = ASSET_TYPES.find(t => t.type === type);
  if (!entry) throw new Error(`Unknown asset type: ${type}`);
  const absDir = path.join(path.dirname(new URL(import.meta.url).pathname), '..', entry.dir);
  let files;
  try {
    files = await fsPromises.readdir(absDir);
  } catch {
    return [];
  }
  return files
    .filter(f => entry.exts.includes(path.extname(f).toLowerCase()))
    .map(f => path.basename(f, path.extname(f)));
}

/**
 * Gets the content of a named asset.
 * @param {string} type - 'ponies', 'balloons', or 'quotes'
 * @param {string} name - asset name (without extension)
 * @returns {Promise<string>}
 */
export async function getAssetByName(type, name) {
  const entry = ASSET_TYPES.find(t => t.type === type);
  if (!entry) throw new Error(`Unknown asset type: ${type}`);
  const absDir = path.join(path.dirname(new URL(import.meta.url).pathname), '..', entry.dir);
  for (const ext of entry.exts) {
    const filePath = path.join(absDir, name + ext);
    try {
      return await fsPromises.readFile(filePath, 'utf8');
    } catch {}
  }
  throw new Error(`Asset not found: ${type}/${name}`);
}

/**
 * Gets a random asset's content and name.
 * @param {string} type - 'ponies', 'balloons', or 'quotes'
 * @returns {Promise<{name: string, content: string}>}
 */
export async function getRandomAsset(type) {
  const names = await listAssets(type);
  if (!names.length) throw new Error(`No assets found for type: ${type}`);
  const name = names[Math.floor(Math.random() * names.length)];
  const content = await getAssetByName(type, name);
  return { name, content };
}

/**
 * Loads all ponies as [{ name, content }]
 */
export function loadPonies() {
  const dir = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'assets/ponies');
  let files = [];
  try {
    files = fs.readdirSync(dir);
  } catch {
    return [];
  }
  return files
    .filter(f => ['.pony', '.asc', '.txt'].includes(path.extname(f).toLowerCase()))
    .map(f => ({
      name: path.basename(f, path.extname(f)),
      content: fs.readFileSync(path.join(dir, f), 'utf8')
    }));
}

/**
 * Loads all balloons as [{ name, content }]
 */
export function loadBalloons() {
  const cwd = process.cwd();
  const dir = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'assets/balloons');
  debugLog('Entering loadBalloons()');
  debugLog('Current working directory:', cwd);
  debugLog('Resolved assets directory:', dir);
  let files = [];
  try {
    files = fs.readdirSync(dir);
    if (!Array.isArray(files) || files.length === 0) {
      debugLog('No files found in assets directory:', dir);
    } else {
      debugLog('Files found:', files.join(', '));
    }
  } catch (err) {
    console.error(`[ERROR] Failed to read assets directory: ${dir}`);
    console.error(`[ERROR] ${err.stack || err}`);
    return [];
  }
  const validExts = ['.txt', '.template', '.say', '.think'];
  debugLog('Valid balloon asset extensions:', JSON.stringify(validExts));
  const filtered = files
    .filter(f => {
      const ext = path.extname(f).toLowerCase();
      const accepted = validExts.includes(ext);
      if (accepted) {
        debugLog('Accepting file:', f, '(extension:', ext, ')');
      } else {
        debugLog('Rejecting file:', f, '(extension:', ext, ')');
      }
      return accepted;
    });
  if (filtered.length === 0) {
    debugLog('No balloon asset files found with valid extensions in:', dir);
  }
  return filtered.map(f => {
    const assetName = path.basename(f, path.extname(f));
    const assetPath = path.join(dir, f);
    debugLog('Searching for balloon asset:', f, '(name:', assetName, ')');
    try {
      const content = fs.readFileSync(assetPath, 'utf8');
      debugLog('Balloon asset loaded:', f, '(size:', content.length, ')');
      return {
        name: assetName,
        content
      };
    } catch (err) {
      console.error(`[ERROR] Failed to load balloon asset: ${f}`);
      console.error(`[ERROR] ${err.stack || err}`);
      return null;
    }
  }).filter(Boolean);
}

/**
 * Loads all quotes as { [name]: string[] }
 */
export function loadQuotes() {
  const dir = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'assets/quotes');
  let files = [];
  try {
    files = fs.readdirSync(dir);
  } catch {
    return {};
  }
  const result = {};
  files.forEach(f => {
    const ext = path.extname(f).toLowerCase();
    const name = path.basename(f, ext);
    const filePath = path.join(dir, f);
    if (ext === '.json') {
      try {
        result[name] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      } catch {
        result[name] = [];
      }
    } else if (ext === '.txt') {
      try {
        result[name] = fs.readFileSync(filePath, 'utf8').split('\n').filter(Boolean);
      } catch {
        result[name] = [];
      }
    }
  });
  return result;
}