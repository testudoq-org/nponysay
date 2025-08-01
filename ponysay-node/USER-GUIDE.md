# Ponysay Node User Guide

## Overview

Ponysay Node is a modern, ES6-based CLI application for displaying ponies and quotes in your terminal. This guide covers installation, usage, CLI flags, asset migration, and current workflows.

---

## Installation

> **Note:** After cloning or updating, run `npm install -g .` or `npm link` in the project directory to register the `ponysay` command globally. This enables you to run `ponysay "Friendship is magic!"` from any terminal.
### Installation Options

#### 1. Install from npm (recommended)
```bash
npm install -g ponysay-node
```
This will make the `ponysay` command available globally on your system.

#### 2. Install from a cloned repository (for development or latest features)
```bash
git clone https://github.com/testudoq-org/nponysay.git
cd nponysay/ponysay-node
npm install
npm link
```
This registers your local version globally, so you can run `ponysay "Friendship is magic!"` from any terminal.

#### 3. Update an existing clone
After pulling updates, run:
```bash
npm install
npm link
```
to refresh the global command.

---

Once installed, you can use the standard syntax:
```bash
ponysay "Friendship is magic!"
```
from any terminal, just like the original ponysay tool.
```bash
npm install -g ponysay-node
```

- Requires Node.js 16+.
- Uses ES6 `.mjs` modules.

---

## Usage

Basic command:

```bash
ponysay "Friendship is magic!"
**Current:**  
You must run the CLI with:  
```sh
node src/cli.mjs "Friendship is magic!"
```

**After these changes:**  
You can run:  
```sh
ponysay "Friendship is magic!"
```
from any terminal, matching the original ponysay tool's UX.
```

Display a specific pony:

```bash
ponysay --pony Twilight "Books are awesome!"
```

---

## ES6 `.mjs` Modules

- All source files use ES6 syntax and `.mjs` extensions.
- Import modules using:
  ```js
  import { say } from './src/say.mjs';
  ```
- Avoid CommonJS (`require`); use `import`/`export`.

---

## CLI Flags

| Flag           | Description                                 | Example                                  |
|----------------|---------------------------------------------|------------------------------------------|
| `--pony`       | Select pony by name                         | `--pony Rainbow`                         |
| `--balloon`    | Choose balloon style                        | `--balloon unicode`                      |
| `--quote`      | Display a random quote                      | `--quote`                                |
| `--list`       | List available ponies or balloons           | `--list ponies`                          |
| `--debug`      | Enable debug output for troubleshooting     | `--debug`                                |
| `--assets`     | Specify custom asset directory              | `--assets ./my-assets`                   |
| `--help`       | Show help                                   | `--help`                                 |

---

## Asset Migration

Ponysay Node supports migration from legacy assets.

### Migrating Assets

1. Place legacy assets in `ponysay-node/assets/legacy/`.
2. Run migration scripts:
   ```bash
   node scripts/migrate-ponies.mjs
   node scripts/migrate-ponyquotes.mjs
   node scripts/migrate-balloons.mjs
   ```
3. Migrated assets will appear in their respective directories.

See [`memory-bank/asset-migration.md`](ponysay-node/memory-bank/asset-migration.md) for details.

---

## Application Behavior

- Loads assets from `ponysay-node/assets/`.
- Supports both legacy and migrated assets.
- Uses async/await for all file operations.
- Handles errors gracefully; use `--debug` for verbose output.

---

## Examples

Display a random pony and quote:

```bash
ponysay --quote
```

List all available ponies:

```bash
ponysay --list ponies
```

Use a custom asset directory:

```bash
ponysay --assets ./custom-assets --pony Luna
```

---

## Troubleshooting

- For verbose logs, use `--debug`.
- Ensure assets are migrated and in correct directories.
- For ES6 import errors, check Node.js version and file extensions.

---

## Contributing

- Use ES6 `.mjs` modules.
- Format code with Prettier: `npx prettier --write .`
- Lint with ESLint: `npx eslint .`
- Run tests: `npx jest`

---

## License

This is wponsay-node © 2025 by Testudo is licensed under CC BY-NC-SA 4.0

<a href="https://github.com/testudoq-org/nponysay">wponsay-node</a> © 2025 by <a href="https://www.testudo.co.nz/">Testudo</a> is licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a><img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt="" style="max-width: 1em;max-height:1em;margin-left: .2em;"><img src="https://mirrors.creativecommons.org/presskit/icons/by.svg" alt="" style="max-width: 1em;max-height:1em;margin-left: .2em;"><img src="https://mirrors.creativecommons.org/presskit/icons/nc.svg" alt="" style="max-width: 1em;max-height:1em;margin-left: .2em;"><img src="https://mirrors.creativecommons.org/presskit/icons/sa.svg" alt="" style="max-width: 1em;max-height:1em;margin-left: .2em;">

## Acknowledgements

Special thanks to [https://github.com/erkin/ponysay](https://github.com/erkin/ponysay) for their inspiration and dedication to ANSI code. Your hard work is deeply appreciated!
