# TTY/Unix VT Support

## Current Limitations
- No explicit support for TTY/Unix VT environments in ponysay-node.
- Output may not render correctly in non-standard terminals or when redirected.

## Workarounds
- Use standard terminals (e.g., xterm, GNOME Terminal) for best results.
- Redirect output to files for manual inspection if needed.

## Plans for Support
- Assess requirements for TTY/Unix VT compatibility.
- Investigate Node.js libraries for terminal control and VT emulation.
- Consider adding CLI flags for output formatting (e.g., --plain, --tty).

## Example: Alternative CLI Option
```sh
node src/index.mjs --plain "Hello world!"
```

## Next Steps
- Document limitations and workarounds in README.
- Research and prototype TTY/Unix VT support.
- Assign owners for compatibility investigation.