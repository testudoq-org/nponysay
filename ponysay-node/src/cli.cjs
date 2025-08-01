// External modules
const { Command } = require('commander');

/**
 * Sets up and returns the CLI program.
 * @returns {Command} Configured commander program instance.
 */
function createCli() {
  const program = new Command();

  program
    .name('ponysay')
    .description('Ponysay: Node.js edition – display ponies with quotes in your terminal!')
    .version('0.1.0');

  program
    .argument('[message]', 'Message to display in the speech balloon')
    .option('-p, --pony <name>', 'Specify pony name (default: random)')
    .option('-b, --balloon <style>', 'Specify balloon style (default: speech)')
    .option('-l, --list', 'List available ponies')
    .option('--color', 'Force colored output (ANSI)')
    .option('--no-color', 'Force monochrome output (no ANSI color)');

  return program;
}

module.exports = { createCli };