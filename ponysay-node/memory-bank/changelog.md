# Migration Changelog

## [Unreleased]
- Project structure initialized
- Migrated core logic from Python to Node.js modules
- Established memory-bank for architecture and progress tracking
## [Unreleased] - 2025-07-30

### Added
- Support for `--color` and `--no-color` CLI flags to control ANSI color output.
- Auto-detection of terminal color support; falls back to monochrome if unsupported or redirected.

### Fixed
- Correct propagation of color flags from CLI to renderer.
- `--no-color` now reliably disables all ANSI color output (previously, color could still appear due to argument parsing issues).

### Improved
- Edge case handling: `--no-color` takes precedence if both flags are present.
- Debug logging for color flag state and detection logic.
- Updated documentation and usage examples in README.
