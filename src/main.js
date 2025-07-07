#!/usr/bin/env node

const { getAudio, getVideo } = require("./downloader");
const chalk = require("chalk");

const args = process.argv.slice(2);
const command = args[0];
let url = args[1];

// Remove accidental escape characters (e.g. \? or \= from shell)
if (url) {
  url = url.replace(/\\/g, "");
}

(async () => {
  try {
    if (!command || !url) {
      console.log("⚠️  Missing arguments.\n");
      console.log("Usage:");
      console.log("  ytd audio <YouTube URL>   # Download as MP3");
      console.log("  ytd video <YouTube URL>   # Download as MP4");
      return;
    }

    console.log("🔗 URL:", chalk.blue(url));

    if (command === "audio") {
      await getAudio(url);
    } else if (command === "video") {
      await getVideo(url);
    } else {
      console.error(`❌ ${chalk.red("Unknown command")}: ${chalk.yellow(command)}`);
    }

    console.log("✅ Download completed.");
  } catch (err) {
    console.error("❌ Error:", err.message || err);
  }
})();