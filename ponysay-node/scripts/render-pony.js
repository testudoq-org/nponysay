// render-pony.js
// Node.js script to render .pony ANSI art as image
// Usage: node scripts/render-pony.js "pony name.pony" [--jpeg]

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import minimist from "minimist";

// Helper to resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directories
const poniesDir = path.resolve(__dirname, "../assets/ponies");

// Parse CLI arguments
const argv = minimist(process.argv.slice(2), {
  boolean: ["jpeg"],
  alias: { jpeg: "j" },
  "--": true,
});

// Extract filename and flags
let ponyFilename = argv._.length > 0 ? argv._.join(" ") : null;
const exportAsJpeg = argv.jpeg;

// Helper: List all .pony files in poniesDir
async function listPonyFiles() {
  try {
    const files = await fs.readdir(poniesDir);
    return files.filter((f) => f.endsWith(".pony"));
  } catch (err) {
    throw new Error(`Failed to list ponies: ${err.message}`);
  }
}

// Helper: Prompt user to select a pony file
async function promptForPonyFile(ponyFiles) {
  try {
    // Dynamically import inquirer (optional dependency)
    let inquirer;
    try {
      inquirer = (await import("inquirer")).default;
    } catch (e) {
      console.error(
        'Error: "inquirer" is required for interactive prompts. Please install it with: npm install inquirer',
      );
      process.exit(1);
    }
    const { pony } = await inquirer.prompt([
      {
        type: "list",
        name: "pony",
        message: "Select a .pony file to render:",
        choices: ponyFiles,
      },
    ]);
    return pony;
  } catch (err) {
    throw new Error(`Prompt failed: ${err.message}`);
  }
}

// Main logic for argument parsing and file selection
async function selectPonyFile() {
  let ponyFiles = await listPonyFiles();
  if (ponyFiles.length === 0) {
    console.error("No .pony files found in ponysay-node/assets/ponies/.");
    process.exit(1);
  }

  // If no filename provided, prompt user
  if (!ponyFilename) {
    ponyFilename = await promptForPonyFile(ponyFiles);
  } else {
    // Validate provided filename (support spaces/special chars)
    // Try exact match, then case-insensitive match
    let match =
      ponyFiles.find((f) => f === ponyFilename) ||
      ponyFiles.find((f) => f.toLowerCase() === ponyFilename.toLowerCase());
    if (!match) {
      console.error(
        `File "${ponyFilename}" not found in ponysay-node/assets/ponies/.`,
      );
      console.log("Available .pony files:");
      ponyFiles.forEach((f) => console.log("  " + f));
      process.exit(1);
    }
    ponyFilename = match;
  }
  return ponyFilename;
}

// Entry point
/**
 * Main entry point for the render-pony script.
 * Handles argument parsing, file selection, ANSI-to-HTML conversion,
 * Puppeteer rendering, image export, and user feedback.
 */
(async () => {
  try {
    // Select the .pony file to render (argument or interactive)
    const selectedPony = await selectPonyFile();
    const ponyPath = path.join(poniesDir, selectedPony);

    // Read the .pony file as UTF-8 text
    let ponyAnsi;
    try {
      ponyAnsi = await fs.readFile(ponyPath, "utf8");
    } catch (err) {
      console.error(
        `[ERROR] Failed to read file "${selectedPony}": ${err.message}`,
      );
      process.exit(1);
    }

    // Convert ANSI art to HTML using ansi-to-html
    let ansiToHtml;
    try {
      ansiToHtml = (await import("ansi-to-html")).default;
    } catch (e) {
      console.error(
        '[ERROR] "ansi-to-html" is required. Please install it with: npm install ansi-to-html',
      );
      process.exit(1);
    }
    // Create converter instance
    const converter = new ansiToHtml();
    let ponyHtml;
    try {
      ponyHtml = converter.toHtml(ponyAnsi);
    } catch (err) {
      console.error("[ERROR] Failed to convert ANSI to HTML:", err.message);
      process.exit(1);
    }

    // Wrap in minimal HTML document with black background and monospace font
    const htmlDoc = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${selectedPony}</title>
      <style>
        body {
          background: #000;
          color: #fff;
          font-family: "Fira Mono", "Consolas", "Menlo", "Monaco", "Liberation Mono", monospace;
          font-size: 16px;
          margin: 0;
          padding: 20px;
          min-width: 0;
          min-height: 0;
          box-sizing: border-box;
        }
        pre {
          margin: 0;
          line-height: 1.1;
          white-space: pre;
        }
      </style>
    </head>
    <body>
    <pre>${ponyHtml}</pre>
    </body>
    </html>
    `;

    // Stub output for now
    // Inform user of selected options
    console.log(`[INFO] Selected: ${selectedPony}`);
    console.log(`[INFO] Export as JPEG: ${exportAsJpeg ? "yes" : "no"}`);
    console.log("[INFO] ANSI art converted to HTML. Rendering image...");

    // Dynamically import puppeteer for headless browser rendering
    let puppeteer;
    try {
      puppeteer = (await import("puppeteer")).default;
    } catch (e) {
      console.error(
        '[ERROR] "puppeteer" is required. Please install it with: npm install puppeteer',
      );
      process.exit(1);
    }

    // Prepare output filename
    const baseName = path.basename(selectedPony, ".pony");
    const ext = exportAsJpeg ? ".jpg" : ".png";
    const outFile = path.resolve(__dirname, `${baseName}${ext}`);

    // Overwrite protection: check if output file exists
    let fileExists = false;
    try {
      await fs.access(outFile);
      fileExists = true;
    } catch {
      fileExists = false;
    }

    if (fileExists) {
      // Prompt user for overwrite confirmation
      let inquirer;
      try {
        inquirer = (await import("inquirer")).default;
      } catch (e) {
        console.error(
          '[ERROR] "inquirer" is required for overwrite confirmation. Please install it with: npm install inquirer',
        );
        process.exit(1);
      }
      const { overwrite } = await inquirer.prompt([
        {
          type: "confirm",
          name: "overwrite",
          message: `File "${outFile}" already exists. Overwrite?`,
          default: false,
        },
      ]);
      if (!overwrite) {
        console.log("[INFO] Export cancelled. No file was overwritten.");
        process.exit(0);
      }
    }

    // Render HTML and export image using Puppeteer
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Set default viewport
      await page.setViewport({ width: 800, height: 600 });

      // Set HTML content
      await page.setContent(htmlDoc, { waitUntil: "domcontentloaded" });

      // Measure content size for dynamic viewport
      const contentSize = await page.evaluate(() => {
        const pre = document.querySelector("pre");
        if (!pre) return null;
        const rect = pre.getBoundingClientRect();
        return {
          width: Math.ceil(rect.width) + 40, // padding
          height: Math.ceil(rect.height) + 40,
        };
      });

      if (contentSize && contentSize.width > 0 && contentSize.height > 0) {
        await page.setViewport({
          width: Math.max(100, Math.min(contentSize.width, 2000)),
          height: Math.max(100, Math.min(contentSize.height, 2000)),
        });
      }

      // Screenshot options
      const screenshotOpts = {
        path: outFile,
        type: exportAsJpeg ? "jpeg" : "png",
        quality: exportAsJpeg ? 90 : undefined,
        omitBackground: false,
        fullPage: false,
      };

      await page.screenshot(screenshotOpts);
      await browser.close();

      console.log(`[SUCCESS] Image exported: ${outFile}`);
    } catch (err) {
      console.error("[ERROR] Rendering failed:", err.message);
      process.exit(1);
    }
  } catch (err) {
    // Catch-all for unexpected errors
    console.error("[ERROR] Unexpected error:", err.message);
    process.exit(1);
  }
})();
