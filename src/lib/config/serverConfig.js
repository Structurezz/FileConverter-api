// src/config/serverConfig.js
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const serverConfig = {
  port: process.env.PORT || 3000, // Default to 3000 if not specified
  uploadDir: process.env.UPLOAD_DIR || 'uploads', // Default to 'uploads' if not specified
};

export default serverConfig;
