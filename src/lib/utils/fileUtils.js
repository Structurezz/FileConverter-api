import fs from 'fs-extra';
import path from 'path';

// Check if a directory exists, create it if it doesn't
export const ensureDirectoryExists = async (dirPath) => {
  try {
    if (!fs.existsSync(dirPath)) {
      await fs.mkdirp(dirPath); // Creates the directory recursively
      console.log(`Directory created: ${dirPath}`);
    } else {
      console.log(`Directory already exists: ${dirPath}`);
    }
  } catch (error) {
    console.error(`Error ensuring directory exists: ${error.message}`);
    throw error; // Propagate the error
  }
};

// Function to generate a file path
export const generateFilePath = (dir, filename) => {
  if (typeof dir !== 'string' || typeof filename !== 'string') {
    throw new TypeError('Both dir and filename must be strings');
  }
  return path.join(dir, filename);
};

// Function to sanitize filenames
export const sanitizeFilename = (filename) => {
  return filename.replace(/[<>:"/\\|?*]+/g, ''); // Remove invalid characters
};
