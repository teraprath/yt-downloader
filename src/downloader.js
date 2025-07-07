const os = require("os");
const path = require("path");
const fs = require("fs");
const { Audio, Video } = require("yt-converter");
const { createProgressBar } = require("./progress");
const chalk = require("chalk");

// The system's default Downloads folder
const DOWNLOAD_DIR = path.join(os.homedir(), "Downloads");

// TEMP_DIR is the directory where the script is executed (where the file is downloaded)
const TEMP_DIR = process.cwd();

// Supported file extensions that should be moved
const MEDIA_EXTENSIONS = [".mp3", ".mp4"];

/**
 * Returns all .mp3 and .mp4 files in the given directory,
 * sorted by modified time in descending order (newest first).
 */
function getMediaFiles(dir) {
  return fs.readdirSync(dir)
      .filter((file) => MEDIA_EXTENSIONS.includes(path.extname(file).toLowerCase()))
      .map((name) => ({
        name,
        time: fs.statSync(path.join(dir, name)).mtime.getTime(),
      }))
      .sort((a, b) => b.time - a.time)
      .map((f) => f.name);
}

/**
 * Moves all valid media files (.mp3, .mp4) from the TEMP_DIR
 * to the system's Downloads directory.
 */
function moveMediaFiles() {
  const mediaFiles = getMediaFiles(TEMP_DIR);
  if (mediaFiles.length === 0) {
    console.warn("⚠️ No .mp3 or .mp4 files found to move.");
    return;
  }

  mediaFiles.forEach((file) => {
    const srcPath = path.join(TEMP_DIR, file);
    const destPath = path.join(DOWNLOAD_DIR, file);

    try {
      fs.renameSync(srcPath, destPath);
      console.log(`✅ Moved: ${chalk.green(file)} → Downloads`);
    } catch (err) {
      console.error(`❌ Failed to move ${chalk.redBright(file)}:`, err.message);
    }
  });
}

/**
 * Downloads audio from a given YouTube URL and moves the result to the Downloads folder.
 * Shows a progress bar during the download process.
 */
async function getAudio(url) {
  console.log("🎵 Downloading audio...");

  const bar = createProgressBar();
  bar.start(100, 0);

  await Audio({
    url,
    onDownloading: (d) => {
      const percent = d.percentage ?? 0;
      bar.update(percent);
    },
  });

  bar.update(100);
  bar.stop();
  moveMediaFiles();
}

/**
 * Downloads video from a given YouTube URL and moves the result to the Downloads folder.
 * Shows a progress bar during the download process.
 */
async function getVideo(url) {
  console.log("🎥 Downloading video...");

  const bar = createProgressBar();
  bar.start(100, 0);

  await Video({
    url,
    onDownloading: (d) => {
      const percent = d.percentage ?? 0;
      bar.update(percent);
    },
  });

  bar.update(100);
  bar.stop();
  moveMediaFiles();
}

module.exports = {
  getAudio,
  getVideo,
};