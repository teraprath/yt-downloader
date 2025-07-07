#!/usr/bin/env node

const { getAudio, getVideo } = require("./downloader");

const args = process.argv.slice(2);

const command = args[0];
const url = args[1];

(async () => {
  try {
    if (!command || !url) {
      console.log("⚠️ Missing CLI arguments.");
      console.log("Usage: ytd <audio|video> <YouTube URL>");
      return;
    }

    console.log("🔗 URL:", url);

    if (command === "audio") {
      await getAudio(url);
    } else if (command === "video") {
      await getVideo(url);
    } else {
      console.error("❌ Unknown command:", command);
    }

    console.log("✅ Download completed.");
  } catch (err) {
    console.error("❌ Error:", err.message || err);
  }
})();
