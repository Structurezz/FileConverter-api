

import fs from 'fs-extra';

// Handle file removal with error handling
export const removeFile = async (filePath) => {
  try {
    await fs.remove(filePath);
    console.log(`Successfully removed file: ${filePath}`);
  } catch (err) {
    console.error(`Failed to remove file: ${filePath}`, err);
  }
};


