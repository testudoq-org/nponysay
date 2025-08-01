# Documentation & FAQ

## User Onboarding Guide

### Getting Started
1. Install Node.js (v20+ recommended).
2. Clone the repository and run `npm install`.
3. Run the CLI: `node src/index.mjs "Hello world!"`

### Configuration
- Set default pony and balloon in config file or via CLI options.
- See `install-uninstall-configure.md` for setup details.

## Troubleshooting

- **CLI not working:** Ensure Node.js is installed and assets are present.
- **Missing assets:** Check asset directories and permissions.
- **Platform issues:** See `platform-support.md` for Windows/Docker notes.

## FAQ

**Q: How do I add a new pony asset?**  
A: Place a `.pony` file in `assets/ponies/` and restart the CLI.

**Q: How do I select a balloon style?**  
A: Use the `--balloon` CLI option, e.g., `--balloon=round`.

**Q: Can I run Ponysay Node in Docker?**  
A: Yes, see the provided `Dockerfile` and instructions in `platform-support.md`.

**Q: What platforms are supported?**  
A: Unix/Linux, Windows (limited), Docker.

**Q: How do I uninstall Ponysay Node?**  
A: Run the provided `uninstall.sh` or `setup.bat` for Windows.

## Next Steps
- Expand onboarding and FAQ as new features are added.
- Assign owners for documentation updates.