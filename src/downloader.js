const os = require("os");
const path = require("path");
const fs = require("fs");
const { Audio, Video } = require("yt-converter");

const DOWNLOAD_DIR = path.join(os.homedir(), "Downloads");
const TEMP_DIR = process.cwd();

// Supported media formats
const MEDIA_EXTENSIONS = [".mp3", ".mp4"];

/**
 * Returns all media files (mp3/mp4) in the given directory,
 * sorted by modified time (descending).
 */
function getMediaFiles(dir) {
  return fs.readdirSync(dir)
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return MEDIA_EXTENSIONS.includes(ext);
      })
      .map((name) => ({
        name,
        time: fs.statSync(path.join(dir, name)).mtime.getTime(),
      }))
      .sort((a, b) => b.time - a.time)
      .map((f) => f.name);
}

/**
 * Moves all supported media files from TEMP_DIR to the system Downloads folder.
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
      console.log(`✅ Moved: ${file} → Downloads`);
    } catch (err) {
      console.error(`❌ Failed to move ${file}:`, err.message);
    }
  });
}

async function getAudio(url) {
  await Audio({
    url,
    onDownloading: (d) => {
      const percent = d.percentage.toFixed(2);
      process.stdout.write(`\r⬇️  Downloading: ${percent}%`);
    },
  });

  console.log();
  moveMediaFiles();
}

async function getVideo(url) {
  await Video({
    url,
    onDownloading: (d) => {
      const percent = d.percentage.toFixed(2);
      process.stdout.write(`\r⬇️  Downloading: ${percent}%`);
    },
  });

  console.log();
  moveMediaFiles();
}

module.exports = {
  getAudio,
  getVideo,
};