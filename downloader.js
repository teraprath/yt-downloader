const os = require("os");
const path = require("path");
const fs = require("fs");
const { Audio, Video } = require("yt-converter");

// Destination: User's Downloads folder
const DOWNLOAD_DIR = path.join(os.homedir(), "Downloads");
// Temporary location: project directory
const TEMP_DIR = __dirname;

// Get the latest (most recently modified) file in a directory
function getLatestFileInDir(dir) {
  const files = fs.readdirSync(dir)
      .map((name) => ({
        name,
        time: fs.statSync(path.join(dir, name)).mtime.getTime(),
      }))
      .sort((a, b) => b.time - a.time);

  return files.length ? files[0].name : null;
}

// Download audio and move it to Downloads folder
async function getAudio(url) {
  await Audio({
    url,
    onDownloading: (d) => console.log(d),
  });

  const latestFile = getLatestFileInDir(TEMP_DIR);
  if (!latestFile) {
    console.error("❌ No downloaded audio file found.");
    return;
  }

  const srcPath = path.join(TEMP_DIR, latestFile);
  const destPath = path.join(DOWNLOAD_DIR, latestFile);

  fs.renameSync(srcPath, destPath);
  console.log(`✅ Audio moved to: ${destPath}`);
}

// Download video and move it to Downloads folder
async function getVideo(url) {
  await Video({
    url,
    onDownloading: (d) => console.log(d),
  });

  const latestFile = getLatestFileInDir(TEMP_DIR);
  if (!latestFile) {
    console.error("❌ No downloaded video file found.");
    return;
  }

  const srcPath = path.join(TEMP_DIR, latestFile);
  const destPath = path.join(DOWNLOAD_DIR, latestFile);

  fs.renameSync(srcPath, destPath);
  console.log(`✅ Video moved to: ${destPath}`);
}

module.exports = {
  getAudio,
  getVideo,
};