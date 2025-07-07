const cliProgress = require("cli-progress");
const chalk = require("chalk");

/**
 * Creates and returns a new CLI progress bar instance.
 */
function createProgressBar() {
  return new cliProgress.SingleBar(
      {
        format: `⬇️ ${chalk.green(' {bar}')} ${chalk.gray('[{percentage}%]')}`,
        barCompleteChar: "█",
        barIncompleteChar: "░",
        hideCursor: true,
      },
      cliProgress.Presets.shades_classic
  );
}

module.exports = {
  createProgressBar,
};