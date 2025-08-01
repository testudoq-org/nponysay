# ponysay-master Node.js Migration Plan

## 1. Component Mapping and Migration Steps

- **CLI Entry Point**
  - Python: `src/__main__.py`, `src/ponysay.py`
  - Node.js: Create `src/index.mjs` as the CLI entry, using `process.argv` and a library like `commander` for argument parsing.
  - Example:
    ```js
    // src/index.mjs
    import { program } from 'commander';
    program.option('--pony <name>', 'Choose a pony');
    program.parse(process.argv);
    ```

- **Argument Parsing**
  - Python: `argparse` in `argparser.py`
  - Node.js: Use `commander` or `yargs` for robust CLI parsing.

- **Rendering Balloons and Ponies**
  - Python: `balloon.py`, `ponysay.py`, ASCII art in `ponies/`, `balloons/`
  - Node.js:
    - Port balloon/pony rendering logic to JS modules.
    - Store ASCII art in `assets/ponies/`, `assets/balloons/` (planned).
    - Use template strings for dynamic rendering.
    - Unicode/ANSI handling via `chalk`.

- **Data Management**
  - Python: Loads `.pony` and template files directly.
  - Node.js: Use `fs/promises` to load assets. Consider caching for performance.

- **Quotes and Extras**
  - Python: `ponyquotes/`
  - Node.js: Replicate as `assets/quotes/`, load and display as needed.

- **Testing**
  - Python: Custom scripts in `dev/tests/`
  - Node.js: Use `jest` for unit tests in `src/` (see [`src/say.test.mjs`](../src/say.test.mjs:1)). E2E tests use Playwright and Gherkin in `e2e/`.

## 2. Key Factors and Considerations

- **Dependencies**
  - Use only well-maintained Node.js packages (`commander`, `chalk`, `jest`).
  - Avoid Python-specific dependencies.

- **Platform Compatibility**
  - Test on Windows, macOS, Linux.
  - Use Node.js APIs for file and terminal operations.

- **Performance**
  - Lazy-load large ASCII assets.
  - Optimize rendering for large terminal outputs.

- **Python-Specific Features**
  - Replace Python string formatting with JS template literals.
  - Replace `argparse` with Node.js CLI libraries.

## 3. Documentation Updates

### progress.md
- [x] Analyze legacy ponysay-master structure
- [x] Propose Node.js folder structure
- [x] Draft documentation and memory-bank
- [x] Implement core modules in src/
- [x] Port data assets to assets/
- [x] Write unit tests

### architecture.md
- Updated with module breakdowns, test and asset strategies (see [`architecture.md`](./architecture.md:1)).
- Documented decisions on CLI library, asset handling, and test strategy.

## 4. Edge Cases and Solutions

- **Unicode/Emoji Support**
  - Use Node.js Buffer and string APIs for robust Unicode handling.
  - Test with a variety of pony art and speech content.

- **Terminal Compatibility**
  - Use libraries that detect terminal width/capabilities.
  - Fallback to plain ASCII if color/Unicode is unsupported.

- **Cross-Platform File Paths**
  - Use `path.join` and avoid hardcoded separators.
