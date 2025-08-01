/**
 * Renders a pony with a speech balloon.
 * @param {Object} pony - The pony object, may contain $balloon5 property.
 * @param {string} ponyName - The name of the pony to render.
 * @param {string} balloonSection - The style of the balloon (unused for now).
 * @param {string} message - The message to display (not injected yet).
 * @param {boolean|undefined} useColor - true: force color, false: force mono, undefined: auto-detect
 * @returns {string} The rendered pony with balloon and message.
 */

/**
 * Logs debug output if --debug is set.
 * @param  {...any} args
 */
function debugLog(...args) {
  if (process && process.argv && process.argv.includes('--debug')) {
    console.error('[DEBUG]', ...args);
  }
}

export function renderPony(pony, ponyName, balloonSection, message, useColor) {
  // --- ponysay-node enhancement: $balloonNN detection and rendering ---
  // This function renders a pony with a speech balloon, following these rules:
  // 1. If a $balloonNN section is present in the pony object (as a property), use it for the balloon art.
  //    - The loader must parse .pony files and expose $balloonNN sections as properties (e.g., pony.$balloon15).
  //    - If a balloonSection (e.g., "$balloon5") is requested and present, use it.
  //    - Otherwise, use the lowest-numbered $balloonNN section found.
  // 2. If a $balloonNN section is used, inject the user message and display ONLY the balloon art (suppress ASCII art).
  // 3. If no $balloonNN is found, fallback to the default balloon and suppress ASCII art unless fallback is triggered.
  // 4. If both message and balloon are missing, show a clear error or usage message (handled by CLI).
  // 5. All new logic is explained inline.

  // DEBUG: Called second renderPony definition
  debugLog('renderPony called (second definition)');

  // --- Color support detection ---
  function supportsColor() {
    // Debug: log flag state
    debugLog('useColor param:', useColor);
    debugLog('argv:', process.argv);

    // Edge case: both flags present, --no-color wins
    if (process && process.argv && process.argv.includes('--color') && process.argv.includes('--no-color')) {
      debugLog('Both --color and --no-color present, forcing monochrome');
      return false;
    }
    // Respect explicit flag
    if (typeof useColor === 'boolean') {
      debugLog('useColor is boolean, returning', useColor);
      return useColor;
    }
    // Auto-detect: only color if TTY and TERM is not dumb
    if (process && process.stdout && process.stdout.isTTY) {
      const auto = process.env.FORCE_COLOR !== '0' && process.env.TERM !== 'dumb';
      debugLog('Auto-detect color:', auto);
      return auto;
    }
    // Non-interactive or redirected output: no color
    debugLog('Non-interactive, forcing monochrome');
    return false;
  }

  const color = supportsColor();

  // ANSI color codes (example: cyan for balloon, magenta for pony)
  const CYAN = '\x1b[36m';
  const MAGENTA = '\x1b[35m';
  const RESET = '\x1b[0m';

  // --- Balloon selection logic ---
  // 1. If balloonSection (e.g., "$balloon5") is specified and present on the pony object, use it.
  // 2. Otherwise, use the lowest-numbered $balloonNN section if present.
  // 3. Otherwise, fallback to generic balloon art.
  let balloonArt;
  let art = null;

  // 1. Try to use the requested balloon section if present
  if (
    pony &&
    typeof balloonSection === 'string' &&
    typeof pony[balloonSection] === 'string' &&
    pony[balloonSection].trim().length > 0
  ) {
    art = pony[balloonSection];
  } else if (pony) {
    // 2. Try to use the lowest-numbered $balloonNN section if present
    const balloonKeys = Object.keys(pony)
      .filter(k => /^\$balloon\d+$/.test(k) && typeof pony[k] === 'string' && pony[k].trim().length > 0);
    if (balloonKeys.length > 0) {
      // Sort by number and pick the lowest
      const lowest = balloonKeys
        .map(k => ({ key: k, num: parseInt(k.replace('$balloon', ''), 10) }))
        .sort((a, b) => a.num - b.num)[0].key;
      art = pony[lowest];
    }
  }

  if (art) {
    // --- Message injection logic for $balloonNN art ---
    // 1. If the art contains a '{msg}' placeholder, replace it with the message (handling color if needed).
    // 2. Otherwise, try to find a line with a speech bubble (e.g., a line with '|') and inject the message there.
    // 3. If no suitable line is found, fallback to the generic balloon art.

    // DEBUG: Log the extracted balloon art for inspection
    debugLog('First 10 lines after balloon section:', art.split('\n').slice(0, 10));
    // Output balloon art directly to CLI
    console.log(art);

    let injected = false;

    // Handle ANSI color for the message if color is enabled
    const coloredMsg = color ? `${CYAN}${message}${RESET}` : message;

    if (art.includes('{msg}')) {
      // Replace all {msg} placeholders with the message, preserving alignment
      balloonArt = art.replace(/\{msg\}/g, coloredMsg);
      injected = true;
    } else {
      // Overlay logic: If no {msg} or |...| placeholder, inject message into center-most balloon line(s)
      // 1. Find all lines with at least two '|' (balloon text lines)
      // 2. If none, fallback to generic balloon art
      // 3. If one, inject message there; if multiple, center message on the most central line(s)
      // 4. Preserve ANSI color codes and alignment

      /**
       * Overlay Example:
       *  Before:
       *   .-""""-.
       *  /        \
       * |          |
       *  \        /
       *   '-....-'
       *  After (message="Hello!"):
       *   .-""""-.
       *  /        \
       * |  Hello!  |
       *  \        /
       *   '-....-'
       */
      const lines = art.split('\n');
      // Find all indices of lines with at least two '|'
      const balloonLineIndices = [];
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const firstPipe = line.indexOf('|');
        const secondPipe = line.indexOf('|', firstPipe + 1);
        if (firstPipe !== -1 && secondPipe !== -1) {
          balloonLineIndices.push(i);
        }
      }

      if (balloonLineIndices.length === 0) {
        // No balloon lines found, fallback to generic balloon art
        let safeMessage = message;
        debugLog('message type:', typeof safeMessage, 'value:', safeMessage);
        if (typeof safeMessage !== 'string') {
          debugLog('message is not a string, converting to string');
          if (safeMessage === null || safeMessage === undefined) {
            safeMessage = '';
          } else {
            safeMessage = String(safeMessage);
          }
        }
        balloonArt = color
          ? `${CYAN}
   .-""""-.
  /        \\
 |  ${safeMessage.padEnd(8)} |
  \\        /
   '-....-'
 ${RESET}`
          : `
   .-""""-.
  /        \\
 |  ${safeMessage.padEnd(8)} |
  \\        /
   '-....-'
  `;
      } else {
        // Overlay message onto the most central balloon line(s)
        // For multi-line balloons, center the message on the middle line(s)
        // If message is longer than available space, trim; if shorter, pad both sides
        // Only overlay as many lines as needed for the message (split if message contains \n)
        const ansiRegex = /\x1b\[[0-9;]*m/g;
        const msgLines = message.split('\n');
        const n = balloonLineIndices.length;
        const m = msgLines.length;
        // Center message lines on balloon lines
        let start = Math.floor((n - m) / 2);
        if (start < 0) start = 0;
        for (let j = 0; j < Math.min(m, n); j++) {
          const idx = balloonLineIndices[start + j];
          const line = lines[idx];
          const firstPipe = line.indexOf('|');
          const secondPipe = line.indexOf('|', firstPipe + 1);
          const contentWidth = secondPipe - firstPipe - 1;
          // Remove ANSI for length calculation
          let visibleMsg = msgLines[j].replace(ansiRegex, '');
          let msgPadded;
          if (visibleMsg.length < contentWidth) {
            // Pad both sides for centering
            const totalPad = contentWidth - visibleMsg.length;
            const leftPad = Math.floor(totalPad / 2);
            const rightPad = totalPad - leftPad;
            msgPadded =
              (color ? CYAN : '') +
              ' '.repeat(leftPad) +
              msgLines[j] +
              ' '.repeat(rightPad) +
              (color ? RESET : '');
          } else if (visibleMsg.length > contentWidth) {
            msgPadded =
              (color ? CYAN : '') +
              msgLines[j].slice(0, contentWidth) +
              (color ? RESET : '');
          } else {
            msgPadded = (color ? CYAN : '') + msgLines[j] + (color ? RESET : '');
          }
          // Inject into the line
          lines[idx] =
            line.slice(0, firstPipe + 1) +
            msgPadded +
            line.slice(secondPipe);
        }
        balloonArt = lines.join('\n');
        injected = true;
      }
    }
  } else {
    // --- Fallback: No $balloonNN section found ---
    // If the pony asset lacks any $balloonNN section, render the ASCII art and inject the message
    // using the default balloon, matching the behavior for ponies with $balloonNN sections.
    // This ensures ponies like "ace" (no $balloonNN) and "twilight" (has $balloonNN) behave identically.
    let safeMessage = message;
    if (typeof safeMessage !== 'string') {
      if (safeMessage === null || safeMessage === undefined) {
        safeMessage = '';
      } else {
        safeMessage = String(safeMessage);
      }
    }
    balloonArt = color
      ? `${CYAN}
   .-""""-.
  /        \\
 |  ${safeMessage.padEnd(8)} |
  \\        /
   '-....-'
 ${RESET}`
      : `
   .-""""-.
  /        \\
 |  ${safeMessage.padEnd(8)} |
  \\        /
   '-....-'
  `;
    // In fallback, always show both the default balloon and the pony ASCII art.
  }

  // Pony art (unchanged)
  const ponyArt = color
    ? `${MAGENTA}
   \\   ^__^
    \\  (oo)\\_______
       (__)\\\\       )\\/\\
           ||----w |
           ||     ||
  (${ponyName})
 ${RESET}`
    : `
   \\   ^__^
    \\  (oo)\\_______
       (__)\\\\       )\\/\\
           ||----w |
           ||     ||
  (${ponyName})
  `;

  // --- Output logic ---
  // If a $balloonNN section was used (art is not null), only show the balloon art with the injected message.
  // Suppress the default pony ASCII art in this case.
  // Otherwise, fallback to showing both the default balloon and pony art.
  debugLog('renderPony: returning from main block');
  if (art) {
    // If a $balloonNN section was used, only show the balloon art with the injected message.
    // (Legacy ponysay behavior: suppress ASCII art when $balloonNN is present.)
    return balloonArt;
  } else {
    // Fallback: show both the default balloon and pony ASCII art.
    // This matches the behavior for ponies with $balloonNN sections, ensuring consistency.
    return balloonArt + ponyArt;
  }
}