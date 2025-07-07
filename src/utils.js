/**
 * Sanitizes a filename to be safe for all operating systems.
 * - Removes illegal characters: \ / : * ? " < > |
 * - Collapses multiple spaces to one
 * - Trims leading/trailing whitespace
 * - Replaces spaces with underscores
 * - Trims leading/trailing underscores
 */
function sanitizeFileName(name) {
  return name
      .replace(/[\\/:*?"<>|]/g, "")     // Remove illegal characters
      .replace(/\s+/g, " ")             // Collapse multiple spaces
      .trim()                           // Trim surrounding spaces
      .replace(/ /g, "_")               // Replace spaces with underscores
      .replace(/^_+|_+$/g, "");         // Remove leading/trailing underscores
}

module.exports = {
  sanitizeFileName,
};