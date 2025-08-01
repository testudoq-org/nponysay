# Source Code Overview

This directory contains the main application logic for Ponysay Node.

- `index.mjs`: Entry point for the CLI and main module exports.
- `[other modules]`: Supporting modules for parsing, rendering, and data management.

All code uses ECMAScript modules (.mjs) and follows Node.js best practices.
## Example CLI Usage and Expected Output

### 1. Default (auto-detect color support)
```sh
node src/index.cjs "Hello"
```
- Output: Colored if terminal supports ANSI, monochrome otherwise.

### 2. Force color output
```sh
node src/index.cjs "Hello" --color
```
- Output: Always colored (ANSI codes), even if auto-detect would disable.

### 3. Force monochrome output
```sh
node src/index.cjs "Hello" --no-color
```
- Output: Always monochrome, no ANSI color codes.

### 4. Both --color and --no-color present
```sh
node src/index.cjs "Hello" --color --no-color
```
- Output: Monochrome (per spec, --no-color wins).

### 5. Output redirected (non-interactive)
```sh
node src/index.cjs "Hello" > out.txt
```
- Output: Monochrome in file.

## Acknowledgements

Special thanks to [https://github.com/erkin/ponysay](https://github.com/erkin/ponysay) for their inspiration and dedication to ANSI code. Your hard work is deeply appreciated!
